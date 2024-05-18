import {User} from "../components/user";
import db from "../db/db";
import {Cart, ProductInCart} from "../components/cart";
import ProductDAO from "./productDAO";

/**
 * A class that implements the interaction with the database for all cart-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class CartDAO {

  private productDao: ProductDAO
  /**
   * Adds a product to the user's cart. If the product is already in the cart, the quantity should be increased by 1.
   * If the product is not in the cart, it should be added with a quantity of 1.
   * If there is no current unpaid cart in the database, then a new cart should be created.
   * @param user - The user to whom the product should be added.
   * @param productId - The model of the product to add.
   * @returns A Promise that resolves to `true` if the product was successfully added.
   */
  async addToCart(user: User, product: string)/*: Promise<Boolean>*/ {
    //check if product exists
    const productRow = await new Promise<any>((resolve, reject) => {
      const sql = "SELECT * FROM product WHERE model = ?"
      db.get(sql, [product], (err: Error, row: any) => {
        if (err) {
          reject(err)
          return
        }
        resolve(row)
      })
    })

    if (!productRow) {
      return false
    } else {
      console.log(productRow)
    }


    const cartRow = await new Promise<any>((resolve, reject) => {
      const sql = "SELECT * FROM cart WHERE customer = ? AND paid = 0"
      db.get(sql, ["customer"], (err: Error, row: any) => {
        if (err) {
          reject(err)
          return
        }
        resolve(row)
      })
    })

    if (!cartRow) {
      return false
    } else {
      console.log(cartRow)
    }

    const productInCartRow = await new Promise<any>((resolve, reject) => {
      const sql = "SELECT * FROM cart_product WHERE cartId = ? AND productId = ?"
      db.get(sql, [cartRow.id, product], (err: Error, row: any) => {
        if (err) {
          reject(err)
          return
        }
        resolve(row)
      })
    })

    if (!productInCartRow) {
      const insertSql = "INSERT INTO cart_product (cartId, productId, quantity) VALUES (?, ?, 1)"
      await new Promise<void>((resolve, reject) => {
        db.run(insertSql, [cartRow.id, productRow.id], (err: Error) => {
          if (err) {
            reject(err)
            return
          }
          resolve()
        })
      })
    } else {
      const updateSql = "UPDATE cart_product SET quantity = quantity + 1 WHERE cartId = ? AND productId = ?"
      await new Promise<void>((resolve, reject) => {
        db.run(updateSql, [cartRow.id, product], (err: Error) => {
          if (err) {
            reject(err)
            return
          }
          resolve()
        })
      })
    }

    return true

  }

  /**
   * Retrieves the current cart for a specific user.
   * @param user - The user for whom to retrieve the cart.
   * @returns A Promise that resolves to the user's cart or an empty one if there is no current cart.
   */
  async getCart(user: User)/*: Cart*/ {
    const cartRow = await new Promise<any>((resolve, reject) => {
      const sql = "SELECT * FROM cart WHERE customer = ? AND paid = 0"
      db.get(sql, [user.username], (err: Error, row: any) => {
        if (err) {
          reject(err)
          return
        }
        resolve(row)
      })
    })

    if (!cartRow) {
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

      return new Cart(user.username, false, "", 0, [])
    } else {
      const sqlProducts = "SELECT productId FROM cart_product WHERE cartId = ?"
      const productsIds = await new Promise<any[]>((resolve, reject) => {
        db.all(sqlProducts, [cartRow.id], (err: Error, rows: any[]) => {
          if (err) {
            reject(err)
            return
          }
          resolve(rows)
        })
      })

      const productsInCart: ProductInCart[] = []
      for (const product of productsIds) {
        const productRow = await new Promise<any>((resolve, reject) => {
          const sql = "SELECT * FROM product WHERE id = ?"
          db.get(sql, [product.productId], (err: Error, row: any) => {
            if (err) {
              reject(err)
              return
            }
            resolve(row)
          })
        })
        productsInCart.push(new ProductInCart(productRow.model, 1, productRow.category, productRow.price))
      }

      return new Cart(cartRow.customer, cartRow.paid, cartRow.paymentDate, cartRow.total, productsInCart)

    }
  }

  /**
   * Checks out the user's cart. We assume that payment is always successful; there is no need to implement anything related to payment.
   * @param user - The user whose cart should be checked out.
   * @returns A Promise that resolves to `true` if the cart was successfully checked out.
   *
   */
  async checkoutCart(user: User) /**Promise<Boolean> */ {
    return new Promise<Boolean>((resolve, reject) => {
      const sql = "SELECT * FROM cart WHERE customer = ? AND paid = 0"
      db.get(sql, [user.username], (err: Error, row: any) => {
        if (err) {
          reject(err)
          return
        }
        if (!row) {
          resolve(false)
          return
        }
        const sqlUpdate = "UPDATE cart SET paid = 1, paymentDate = ? WHERE id = ?"
        db.run(sqlUpdate, [new Date().toISOString(), row.id], (err: Error) => {
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
   * Retrieves all paid carts for a specific customer.
   * @param user - The customer for whom to retrieve the carts.
   * @returns A Promise that resolves to an array of carts belonging to the customer.
   * Only the carts that have been checked out should be returned, the current cart should not be included in the result.
   */
  async getCustomerCarts(user: User): Promise<Cart[]> {
    return new Promise<Cart[]>((resolve, reject) => {
      const sql = `
      SELECT 
        c.id as cartId, c.customer, c.paid, c.paymentDate, c.total,
        p.id as productId, p.model, cp.quantity, p.category, p.sellingPrice
      FROM cart c
      JOIN cart_product cp ON c.id = cp.cartId
      JOIN product p ON cp.productId = p.id
      WHERE c.customer = ? AND c.paid = 1
    `;

      db.all(sql, [user.username], (err: Error, rows: any[]) => {
        if (err) {
          reject(err);
          return;
        }

        // Prepare the cart objects
        const carts: { [key: string]: Cart } = {};
        rows.forEach(row => {
          if (!carts[row.cartId]) {
            carts[row.cartId] = new Cart(row.customer, row.paid, row.paymentDate, row.total, []);
          }
          carts[row.cartId].products.push(
              new ProductInCart(row.model, row.quantity, row.category, row.sellingPrice)
          );
        });

        // Convert the object to an array
        resolve(Object.values(carts));
      });
    });
  }

  /**
   * Removes one product unit from the current cart. In case there is more than one unit in the cart, only one should be removed.
   * @param user The user who owns the cart.
   * @param product The model of the product to remove.
   * @returns A Promise that resolves to `true` if the product was successfully removed.
   */
  async removeProductFromCart(user: User, product: string) /**Promise<Boolean> */ {
    return new Promise<Boolean>((resolve, reject) => {
      const sqlCart = "SELECT * FROM cart WHERE customer = ? AND paid = 0"
      db.get(sqlCart, [user.username], (err: Error, row: any) => {
        if (err) {
          reject(err)
          return
        }
        if (!row) {
          resolve(false)
          return
        }
        const sqlProduct = "SELECT * FROM cart_product WHERE cartId = ? AND productId = ?"
        db.get(sqlProduct, [row.id, product], (err: Error, product: any) => {
          if (err) {
            reject(err)
            return
          }
          if (!product) {
            resolve(false)
            return
          }
          if (product.quantity === 1) {
            const sqlDelete = "DELETE FROM cart_product WHERE cartId = ? AND productId = ?"
            db.run(sqlDelete, [row.id, product], (err: Error) => {
              if (err) {
                reject(err)
                return
              }
              resolve(true)
            })
          } else {
            const sqlUpdate = "UPDATE cart_product SET quantity = quantity - 1 WHERE cartId = ? AND productId = ?"
            db.run(sqlUpdate, [row.id, product], (err: Error) => {
              if (err) {
                reject(err)
                return
              }
              resolve(true)
            })
          }
        })
      })
    })
  }

  /**
   * Removes all products from the current cart.
   * @param user - The user who owns the cart.
   * @returns A Promise that resolves to `true` if the cart was successfully cleared.
   */
  async clearCart(user: User)/*:Promise<Boolean> */ {
    return new Promise<Boolean>((resolve, reject) => {
      const sqlCart = "SELECT * FROM cart WHERE customer = ? AND paid = 0"
      db.get(sqlCart, [user.username], (err: Error, row: any) => {
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
          resolve(true)
        })
      })
    })
  }

  /**
   * Deletes all carts of all users.
   * @returns A Promise that resolves to `true` if all carts were successfully deleted.
   */
  async deleteAllCarts() /**Promise<Boolean> */ {
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
  async getAllCarts() /*:Promise<Cart[]> */ {
    return new Promise<Cart[]>((resolve, reject) => {
      const sql = `
      SELECT 
        c.id as cartId, c.customer, c.paid, c.paymentDate, c.total,
        p.id as productId, p.model, cp.quantity, p.category, p.sellingPrice
      FROM cart c
      JOIN cart_product cp ON c.id = cp.cartId
      JOIN product p ON cp.productId = p.id
    `;

      db.all(sql, [], (err: Error, rows: any[]) => {
        if (err) {
          reject(err);
          return;
        }

        // Prepare the cart objects
        const carts: { [key: string]: Cart } = {};
        rows.forEach(row => {
          if (!carts[row.cartId]) {
            carts[row.cartId] = new Cart(row.customer, row.paid, row.paymentDate, row.total, []);
          }
          carts[row.cartId].products.push(
              new ProductInCart(row.model, row.quantity, row.category, row.sellingPrice)
          );
        });

        // Convert the object to an array
        resolve(Object.values(carts));
      });
    });
  }

}

export default CartDAO