import db from "../db/db";
import {Product} from "../components/product";
import {
  ArrivalDateAfterCurrent,
  EmptyProductStockError,
  LowProductStockError,
  ProductAlreadyExistsError,
  ProductNotFoundError
} from "../errors/productError";
import { ProductNotInCartError } from "../errors/cartError";

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
        arrivalDate = new Date().toISOString().slice(0, 10).toString()
      }

      try {
        const sql = "INSERT INTO product (model, category, quantity, details, sellingPrice, arrivalDate) VALUES (?, ?, ?, ?, ?, ?)";
        await new Promise<void>((resolve, reject) => {
          db.run(sql, [model, category, quantity, details, sellingPrice, arrivalDate], (err: Error) => {
            if (err) {
              return reject(err);
            }
            resolve();
          });
        });
      } catch (error) {
        throw error;
      }
    }

    /**
     * Increases the available quantity of a product through the addition of new units.
     * @param model The model of the product to increase.
     * @param newQuantity The number of product units to add. This number must be added to the existing quantity, it is not a new total.
     * @param changeDate The optional date in which the change occurred.
     * @returns A Promise that resolves to the new available quantity of the product.
     */
    async changeProductQuantity(model: string, newQuantity: number, changeDate: string | null): Promise<number> {
      const product: Product = await this.getProductByModel(model);
      if (!product) {
        throw new ProductNotFoundError();
      }
      
      if (changeDate !== null && product.arrivalDate !== null) {
        // Converti il valore di arrivalDate in numero prima di creare un oggetto Date
        const arrivalDate = new Date(parseInt(product.arrivalDate));
        const changeDateObj = new Date(changeDate);

        if (arrivalDate > changeDateObj) {
            throw new ArrivalDateAfterCurrent();
        }
    }

      const _changeDate = new Date(changeDate);
      const arrivalDate = new Date(product.arrivalDate);
      const today = new Date();

      if (changeDate) {
        if (_changeDate < arrivalDate || _changeDate > today) {
          throw new Error("Invalid change date");
        }
      }

      try {
        const updateSql = "UPDATE product SET quantity = quantity + ? WHERE model = ?";
        await new Promise<void>((resolve, reject) => {
          db.run(updateSql, [newQuantity, model], (err: Error) => {
            if (err) {
              return reject(err);
            }
            resolve();
          });
        });

        const selectSql = "SELECT quantity FROM product WHERE model = ?";
        return await new Promise<number>((resolve, reject) => {
          db.get(selectSql, [model], (err: Error, row: any) => {
            if (err) {
              return reject(err);
            }
            resolve(row.quantity);
          });
        });
      } catch (error) {
        throw error;
      }
    }
    /**
     * Decreases the available quantity of a product through the sale of units.
     * @param model The model of the product to sell
     * @param quantity The number of product units that were sold.
     * @param sellingDate The optional date in which the sale occurred.
     * @returns A Promise that resolves to the new available quantity of the product.
     */
    async sellProduct(model: string, quantity: number, sellingDate: string | null): Promise<number> {
      const product: Product = await this.getProductByModel(model);
      if (!product) {
        throw new ProductNotFoundError();
      }

      if (sellingDate !== null && product.arrivalDate !== null) {
        // Converti il valore di arrivalDate in numero prima di creare un oggetto Date
        const arrivalDate = new Date(parseInt(product.arrivalDate));
        const changeDateObj = new Date(sellingDate);

        if (arrivalDate > changeDateObj) {
            throw new ArrivalDateAfterCurrent();
        }
    }

      const arrivalDate = new Date(product.arrivalDate);
      const today = new Date();

      if (sellingDate) {
        const _sellingDate = new Date(sellingDate);
        if (_sellingDate < arrivalDate || _sellingDate > today) {
          throw new Error("Invalid selling date");
        }
      }

      if (product.quantity === 0) {
        throw new EmptyProductStockError();
      }

      if (product.quantity < quantity) {
        throw new LowProductStockError();
      }

      try {
        const updateSql = "UPDATE product SET quantity = quantity - ? WHERE model = ?";
        await new Promise<void>((resolve, reject) => {
          db.run(updateSql, [quantity, model], (err: Error) => {
            if (err) {
              return reject(err);
            }
            resolve();
          });
        });

        const selectSql = "SELECT quantity FROM product WHERE model = ?";
        return await new Promise<number>((resolve, reject) => {
          db.get(selectSql, [model], (err: Error, row: any) => {
            if (err) {
              return reject(err);
            }
            resolve(row.quantity);
          });
        });
      } catch (error) {
        throw error;
      }
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
    async getAvailableProducts(grouping: string | null, category: string | null, model: string | null): Promise<Product[]> {
      try {
        let sql = "SELECT * FROM product WHERE quantity > 0";
        let params: any[] = [];

        if (grouping === "category") {
          sql += " AND category = ?";
          params.push(category);
        } else if (grouping === "model") {
          sql += " AND model = ?";
          params.push(model);
        }

        const rows: Product[] = await new Promise<Product[]>((resolve, reject) => {
          db.all(sql, params, (err: Error, rows: any) => {
            if (err) {
              return reject(err);
            }
            resolve(rows);
          });
        });

        return rows;
      } catch (error) {
        throw error;
      }
    }

    /**
     * Deletes all products in the database.
     * @returns A Promise that resolves to nothing.
     */
    async deleteAllProducts(): Promise<boolean> {
      try {
        const sql = "DELETE FROM product";
        await new Promise<void>((resolve, reject) => {
          db.run(sql, (err: Error) => {
            if (err) {
              return reject(err);
            }
            resolve();
          });
        });
        return true;
      } catch (error) {
        throw error;
      }
    }

  /**
   * Deletes one product, identified by its model
   * @param model The model of the product to delete
   * @returns A Promise that resolves to `true` if the product has been successfully deleted.
   */
  async deleteProduct(model: string): Promise<boolean> {
    const product: Product = await this.getProductByModel(model);

    if (!product) {
      throw new ProductNotFoundError();
    }

    try {
      const sql = "DELETE FROM product WHERE model = ?";
      await new Promise<void>((resolve, reject) => {
        db.run(sql, [model], (err: Error) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
      return true;
    } catch (error) {
      throw error;
    }
  }


    async getProductByModel(model: string): Promise<Product> {
      return new Promise<Product>((resolve, reject) => {
        try {
          const sql = "SELECT * FROM product WHERE model = ?"
          //console.log("sono dentro il product dao")
          db.get(sql, [model], (err: Error, row: Product) => {
            if (err) {
              
              reject(err)
              return
            }
            // if (row===undefined) {
            //   console.log("undefined ")
            //   // Se row è undefined (nessun prodotto trovato), restituisci un errore 404
            //   reject(new ProductNotInCartError());
            //   return;
            // }
            resolve(row)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
}


export default ProductDAO