import {User} from "../components/user";
import db from "../db/db";
import { Cart, ProductInCart } from "../components/cart";
import ProductDAO from "./productDAO";
import { EmptyProductStockError, ProductNotFoundError } from "../errors/productError";
import { EmptyCartError, ProductNotInCartError } from "../errors/cartError";

/**
 * A class that implements the interaction with the database for all cart-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class CartDAO {

  private productDao: ProductDAO

  constructor() {
    this.productDao = new ProductDAO()
  }
  /**
   * Adds a product to the user's cart. If the product is already in the cart, the quantity should be increased by 1.
   * If the product is not in the cart, it should be added with a quantity of 1.
   * If there is no current unpaid cart in the database, then a new cart should be created.
   * @param user - The user to whom the product should be added.
   * @param model - The model of the product to add.
   * @returns A Promise that resolves to `true` if the product was successfully added.
   */
  async addToCart(user: User, model: string): Promise<Boolean> {
    const product = await this.productDao.getProductByModel(model)
    if (!product) {
      throw new ProductNotFoundError()
    }
    const hasCart = await this.hasCart(user)
    if (!hasCart) {
      await this.createCart(user)
    }
    const cart = await this.getCart(user)
    const productInCart = cart.products.find(p => p.model === model)
    if (productInCart) {
      const sqlUpdate = "UPDATE cart_product SET quantity = quantity + 1 WHERE cartId = ? AND model = ?"
      await new Promise<void>((resolve, reject) => {
        db.run(sqlUpdate, [cart.id, model], (err: Error) => {
          if (err) {
            reject(err)
            return
          }
          resolve()
        })
      })
    } else {
      const sqlInsert = "INSERT INTO cart_product (cartId, model, quantity) VALUES (?, ?, 1)"
      await new Promise<void>((resolve, reject) => {
        db.run(sqlInsert, [cart.id, model], (err: Error) => {
          if (err) {
            reject(err)
            return
          }
          resolve()
        })
      })
    }
    const updateCartTotal = "UPDATE cart SET total = total + ? WHERE id = ?"
    await new Promise<void>((resolve, reject) => {
      db.run(updateCartTotal, [product.sellingPrice, cart.id], (err: Error) => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
    return true
  }
  /**
   * Retrieves the current cart for a specific user.
   * @param user - The user for whom to retrieve the cart.
   * @param cartEmpty - If true, the cart will be empty.
   * If false, the cart will be filled with products.
   * @returns A Promise that resolves to the user's cart or an empty one if there is no current cart.
   */
  async getCart(user: User, cartEmpty = false): Promise<Cart> {
    return new Promise<Cart>(async (resolve, reject) => {
      const sql = "SELECT * FROM cart WHERE customer = ? AND paid = 0"
      db.get(sql, [user.username], (err: Error, row: Cart) => {
        if (err) {
          reject(err)
          return
        }
        if (!row) {
          resolve(new Cart(-1, user.username, false, "", 0, []))
          return
        }
        if (cartEmpty) {
          resolve(new Cart(row.id, row.customer, row.paid, row.paymentDate, row.total, []))
          return
        }
        const sqlProducts = "SELECT * FROM cart_product WHERE cartId = ?"
        db.all(sqlProducts, [row.id], async (err: Error, rows: ProductInCart[]) => {
          if (err) {
            reject(err)
            return
          }
          const products: ProductInCart[] = []
          for (const row1 of rows) {
            const product = await this.productDao.getProductByModel(row1.model)
            products.push(new ProductInCart(row1.model, row1.quantity, product.category, product.sellingPrice))
          }
          resolve(new Cart(row.id, row.customer, row.paid, row.paymentDate, row.total, products))
        })
      })
    })
  }
  /**
   * Creates a new cart for the user.
   * @param user - The user for whom to create the cart.
   */
  async createCart(user: User) {
    const insertSql = "INSERT INTO cart (customer, paid, paymentDate, total) VALUES (?, 0, '', 0)"
    await new Promise<void>((resolve, reject) => {
      db.run(insertSql, [user.username], (err: Error) => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  }
  /**
   * Checks out the user's cart. We assume that payment is always successful; there is no need to implement anything related to payment.
   * @param user - The user whose cart should be checked out.
   * @returns A Promise that resolves to `true` if the cart was successfully checked out.
   *
   */
  async checkoutCart(user: User): Promise<Boolean> {
    // It fails if the cart is empty, there is no current cart in the database,
    // or at least one of the products in the cart is not available in the required quantity.

    const cart = await this.getCart(user)
    if (cart.products.length === 0) {
      throw new EmptyCartError();
    }
    for (const productInCart of cart.products) {
      const productInDb = await this.productDao.getProductByModel(productInCart.model)
      if(!productInDb) {
        throw new ProductNotFoundError()
      } else if(productInDb.quantity < productInCart.quantity) {
        throw new EmptyProductStockError()
      }
    }

    const updateCart = "UPDATE cart SET paid = 1, paymentDate = ?, total = ? WHERE id = ?"
    return new Promise<Boolean>((resolve, reject) => {
      db.run(updateCart, [new Date().toISOString().slice(0,10), cart.total, cart.id], (err: Error) => {
        if (err) {
          reject(err)
          return
        }
        const updateStock = "UPDATE product SET quantity = quantity - ? WHERE model = ?"
        cart.products.forEach(async (productInCart) => {
          await new Promise<void>((resolve, reject) => {
            db.run(updateStock, [productInCart.quantity, productInCart.model], (err: Error) => {
              if (err) {
                reject(err)
                return
              }
              resolve()
            })
          })
        })
        resolve(true)
      })
    })
  }
  /**
   * Retrieves all paid carts for a specific customer.
   * @param user - The customer for whom to retrieve the carts.
   * @returns A Promise that resolves to an array of carts belonging to the customer.
   * Only the carts that have been checked out should be returned, the current cart should not be included in the result.
   */
  async getCustomerCarts(user: User): Promise<Cart[]> {
    return new Promise<Cart[]>((resolve, reject) => {
      const sql = "SELECT * FROM cart WHERE customer = ? AND paid = 1"
      db.all(sql, [user.username], async (err: Error, rows: Cart[]) => {
        if (err) {
          reject(err)
          return
        }
        const carts: Cart[] = []
        for (const row of rows) {
          const products = await new Promise<ProductInCart[]>((resolve, reject) => {
            const sqlProducts = "SELECT * FROM cart_product WHERE cartId = ?"
            db.all(sqlProducts, [row.id], async (err: Error, rows: ProductInCart[]) => {
              if (err) {
                reject(err)
                return
              }
              resolve(rows)
            })
          })
          for(const product of products) {
            const productInDb = await this.productDao.getProductByModel(product.model)
            product.category = productInDb.category
            product.price = productInDb.sellingPrice
          }
          carts.push(new Cart(row.id, row.customer, row.paid, row.paymentDate, row.total, products))
        }
        resolve(carts)
      })
    })
  }
  /**
   * Removes one product unit from the current cart. In case there is more than one unit in the cart, only one should be removed.
   * @param user The user who owns the cart.
   * @param model
   * @returns A Promise that resolves to `true` if the product was successfully removed.
   */
  async removeProductFromCart(user: User, model: string):Promise<Boolean> {
    const cart = await this.getCart(user)
    const productInCart = cart.products.find(p => p.model === model)
    if (!productInCart) {
      throw new ProductNotInCartError()
    }
    const sqlUpdate = "UPDATE cart_product SET quantity = quantity - 1 WHERE cartId = ? AND model = ?"
    return new Promise<Boolean>((resolve, reject) => {
      db.run(sqlUpdate, [cart.id, model], (err: Error) => {
        if (err) {
          reject(err)
          return
        }
        if(productInCart.quantity === 1) {
          const sqlDelete = "DELETE FROM cart_product WHERE cartId = ? AND model = ?"
          db.run(sqlDelete, [cart.id, model], (err: Error) => {
            if (err) {
              reject(err)
              return
            }
          })
        }
        const sqlUpdateTotal = "UPDATE cart SET total = total - ? WHERE id = ?"
        db.run(sqlUpdateTotal, [productInCart.price, cart.id], (err: Error) => {
          if (err) {
            reject(err)
            return
          }
          resolve(true)
        })
      })
    })
  }
  /**
   * Removes all products from the current cart.
   * @param user - The user who owns the cart.
   * @returns A Promise that resolves to `true` if the cart was successfully cleared.
   */
  async clearCart(user: User): Promise<Boolean> {
    return new Promise<Boolean>((resolve, reject) => {
      const sqlCart = "SELECT * FROM cart WHERE customer = ? AND paid = 0"
      db.get(sqlCart, [user.username], (err: Error, row: Cart) => {
        if (err) {
          reject(err)
          return
        }
        if (!row) {
          resolve(false)
          return
        }
        const sqlDelete = "DELETE FROM cart_product WHERE cartId = ?"
        db.run(sqlDelete, [row.id], (err: Error) => {
          if (err) {
            reject(err)
            return
          }
          const sqlUpdateCartTotal = "UPDATE cart SET total = 0 WHERE id = ?"
          db.run(sqlUpdateCartTotal, [row.id], (err: Error) => {
            if (err) {
              reject(err)
              return
            }
            resolve(true)
          })
        })
      })
    })
  }
  /**
   * Deletes all carts of all users.
   * @returns A Promise that resolves to `true` if all carts were successfully deleted.
   */
  async deleteAllCarts() : Promise<Boolean> {
  return new Promise<Boolean>((resolve, reject) => {
      const sql = "DELETE FROM cart"
      db.run(sql, [], (err: Error) => {
        if (err) {
          reject(err)
          return
        }
        resolve(true)
      })
    })
  }
  /**
   * Retrieves all carts in the database.
   * @returns A Promise that resolves to an array of carts.
   */
  async getAllCarts(): Promise<Cart[]>{
    return new Promise<Cart[]>((resolve, reject) => {
      const sql = "SELECT * FROM cart"
      db.all(sql, [], async (err: Error, rows: Cart[]) => {
        if (err) {
          reject(err)
          return
        }
        const carts: Cart[] = []
        for (const row of rows) {
          const products = await new Promise<ProductInCart[]>((resolve, reject) => {
            const sqlProducts = "SELECT * FROM cart_product WHERE cartId = ?"
            db.all(sqlProducts, [row.id], async (err: Error, rows: ProductInCart[]) => {
              if (err) {
                reject(err)
                return
              }
              resolve(rows)
            })
          })
          for(const product of products) {
            const productInDb = await this.productDao.getProductByModel(product.model)
            product.category = productInDb.category
            product.price = productInDb.sellingPrice
          }
          carts.push(new Cart(row.id, row.customer, row.paid, row.paymentDate, row.total, products))
        }
        resolve(carts)
      })
    })
  }
  /**
   * Checks if the user has a cart.
   * @param user
   */
  async hasCart(user: User): Promise<Boolean> {
    return new Promise<Boolean>((resolve, reject) => {
      const sql = "SELECT * FROM cart WHERE customer = ? AND paid = 0"
      db.get(sql, [user.username], (err: Error, row: any) => {
        if (err) {
          reject(err)
          return
        }
        resolve(!!row)
      })
    })
  }

}

export default CartDAO