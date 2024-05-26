import db from "../db/db";
import {Product} from "../components/product";
import {
  EmptyProductStockError,
  LowProductStockError,
  ProductAlreadyExistsError,
  ProductNotFoundError
} from "../errors/productError";

/**
 * A class that implements the interaction with the database for all product-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class ProductDAO {

    /**
     * Registers a new product concept (model, with quantity defining the number of units available) in the database.
     * @param model The unique model of the product.
     * @param category The category of the product.
     * @param quantity The number of units of the new product.
     * @param details The optional details of the product.
     * @param sellingPrice The price at which one unit of the product is sold.
     * @param arrivalDate The optional date in which the product arrived.
     * @returns A Promise that resolves to nothing.
     */
    async registerProducts(model: string, category: string, quantity: number, details: string | null, sellingPrice: number, arrivalDate: string | null): Promise<void> {

      const product : Product = await this.getProductByModel(model)
      if(product){
        throw new ProductAlreadyExistsError()
      }
      if(!arrivalDate){
        arrivalDate = new Date().toISOString().slice(0, 10)
      }

      return new Promise<void>((resolve, reject) => {
        try {
          const sql = "INSERT INTO product (model, category, quantity, details, sellingPrice, arrivalDate) VALUES (?, ?, ?, ?, ?, ?)"
          db.run(sql, [model, category, quantity, details, sellingPrice, arrivalDate], (err: Error) => {
            if (err) {
              reject(err)
              return
            }
            resolve()
          })
        } catch (error) {
          reject(error)
        }
      })
    }

    /**
     * Increases the available quantity of a product through the addition of new units.
     * @param model The model of the product to increase.
     * @param newQuantity The number of product units to add. This number must be added to the existing quantity, it is not a new total.
     * @param changeDate The optional date in which the change occurred.
     * @returns A Promise that resolves to the new available quantity of the product.
     */
    async changeProductQuantity(model: string, newQuantity: number, changeDate: string | null) : Promise<number> {
      const product : Product = await this.getProductByModel(model)
      if(!product){
        throw new ProductNotFoundError()
      }
      const _changeDate = new Date(changeDate)

      const arrivalDate = new Date(product.arrivalDate)
      const today = new Date()
      if(changeDate){
        if(_changeDate < arrivalDate || _changeDate > today){
          throw new Error("Invalid change date")
        }
      }

      return new Promise<number>((resolve, reject) => {
        try {
          const sql = "UPDATE product SET quantity = quantity + ? WHERE model = ?"
          db.run(sql, [newQuantity, model], (err: Error) => {
            if (err) {
              reject(err)
              return
            }
            const sql = "SELECT quantity FROM product WHERE model = ?"
            db.get(sql, [model], (err: Error, row: any) => {
              if (err) {
                reject(err)
                return
              }
              resolve(row.quantity)
            })
          })
        } catch (error) {
          reject(error)
        }
      })
    }
    /**
     * Decreases the available quantity of a product through the sale of units.
     * @param model The model of the product to sell
     * @param quantity The number of product units that were sold.
     * @param sellingDate The optional date in which the sale occurred.
     * @returns A Promise that resolves to the new available quantity of the product.
     */
    async sellProduct(model: string, quantity: number, sellingDate: string | null): Promise<number> {

      const product : Product = await this.getProductByModel(model)
      if(!product){
        throw new ProductNotFoundError()
      }


      const arrivalDate = new Date(product.arrivalDate)
      const today = new Date()

      if(sellingDate){
      const _sellingDate = new Date(sellingDate)
        if(_sellingDate < arrivalDate || _sellingDate > today){
          throw new Error("Invalid selling date")
        }
      }

      if(product.quantity === 0){
        throw new EmptyProductStockError()
      }

      if(product.quantity < quantity){
        throw new LowProductStockError()
      }

      return new Promise<number>((resolve, reject) => {
        try {
          const sql = "UPDATE product SET quantity = quantity - ? WHERE model = ?"
          db.run(sql, [quantity, model], (err: Error) => {
            if (err) {
              reject(err)
              return
            }
            const sql = "SELECT quantity FROM product WHERE model = ?"
            db.get(sql, [model], (err: Error, row: any) => {
              if (err) {
                reject(err)
                return
              }
              resolve(row.quantity)
            })
          })
        } catch (error) {
          reject(error)
        }
      })
    }

    /**
     * Returns all products in the database, with the option to filter them by category or model.
     * @param grouping An optional parameter. If present, it can be either "category" or "model".
     * @param category An optional parameter. It can only be present if grouping is equal to "category" (in which case it must be present) and, when present, it must be one of "Smartphone", "Laptop", "Appliance".
     * @param model An optional parameter. It can only be present if grouping is equal to "model" (in which case it must be present and not empty).
     * @returns A Promise that resolves to an array of Product objects.
     */
    getProducts(grouping: string | null, category: string | null, model: string | null): Promise<Product[]> {
      return new Promise<Product[]>((resolve, reject) => {
        try {
          let sql = "SELECT * FROM product"
          let params = []
          if (grouping === "category") {
            sql += " WHERE category = ?"
            params.push(category)
          } else if (grouping === "model") {
            sql += " WHERE model = ?"
            params.push(model)
          }
          db.all(sql, params, (err: Error, rows: any) => {
            if (err) {
              reject(err)
              return
            }
            resolve(rows)
          })
        } catch (error) {
          reject(error)
        }
      })
    }

    /**
     * Returns all available products (with a quantity above 0) in the database, with the option to filter them by category or model.
     * @param grouping An optional parameter. If present, it can be either "category" or "model".
     * @param category An optional parameter. It can only be present if grouping is equal to "category" (in which case it must be present) and, when present, it must be one of "Smartphone", "Laptop", "Appliance".
     * @param model An optional parameter. It can only be present if grouping is equal to "model" (in which case it must be present and not empty).
     * @returns A Promise that resolves to an array of Product objects.
     */
    getAvailableProducts(grouping: string | null, category: string | null, model: string | null): Promise<Product[]>  {
      return new Promise<Product[]>((resolve, reject) => {
        try {
          let sql = "SELECT * FROM product WHERE quantity > 0"
          let params = []
          if (grouping === "category") {
            sql += " AND category = ?"
            params.push(category)
          } else if (grouping === "model") {
            sql += " AND model = ?"
            params.push(model)
          }
          db.all(sql, params, (err: Error, rows: any) => {
            if (err) {
              reject(err)
              return
            }
            resolve(rows)
          })
        } catch (error) {
          reject(error)
        }
      })
    }

    /**
     * Deletes all products in the database.
     * @returns A Promise that resolves to nothing.
     */
    deleteAllProducts(): Promise<Boolean> {
      return new Promise<Boolean>((resolve, reject) => {
        try {
          const sql = "DELETE FROM product"
          db.run(sql, (err: Error) => {
            if (err) {
              reject(err)
              return false
            }
            resolve(true)
          })
        } catch (error) {
          reject(error)
        }
      })
    }

  /**
   * Deletes one product, identified by its model
   * @param model The model of the product to delete
   * @returns A Promise that resolves to `true` if the product has been successfully deleted.
   */
    async deleteProduct(model: string): Promise<Boolean> {
      const product : Product = await this.getProductByModel(model)

      if(!product){
        throw new ProductNotFoundError()
      }

      return new Promise<Boolean>((resolve, reject) => {
        try {
          const sql = "DELETE FROM product WHERE model = ?"
          db.run(sql, [model], (err: Error) => {
            if (err) {
              reject(err)
              return false
            }
            resolve(true)
          })
        } catch (error) {
          reject(error)
        }
      })
    }


    async getProductByModel(model: string): Promise<Product> {
      return new Promise<Product>((resolve, reject) => {
        try {
          const sql = "SELECT * FROM product WHERE model = ?"
          db.get(sql, [model], (err: Error, row: Product) => {
            if (err) {
              reject(err)
              return
            }
            resolve(row)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
}


export default ProductDAO