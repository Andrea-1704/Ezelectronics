import { describe, test, expect, jest, afterEach } from "@jest/globals";
import db from "../../src/db/db";
import { Category, Product } from "../../src/components/product";
import ProductDAO from "../../src/dao/productDAO";
import {
  EmptyProductStockError,
  LowProductStockError,
  ProductAlreadyExistsError,
  ProductNotFoundError
} from "../../src/errors/productError";

jest.mock("../../src/db/db");

afterEach(() => {
  jest.restoreAllMocks();
});

describe("ProductDAO unit tests", () => {
  const testProduct = new Product(10, "iPhone13", Category.SMARTPHONE, "2022-06-05", "Latest model", 100);
  const anotherProduct = new Product(15, "GalaxyS21", Category.SMARTPHONE, "2021-08-10", "Top-notch model", 50);

  test("registerProducts - successful registration", async () => {
    const productDAO = new ProductDAO();
    jest.spyOn(productDAO, 'getProductByModel').mockResolvedValueOnce(undefined);
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(null);
      return db;
    });

    await productDAO.registerProducts(testProduct.model, testProduct.category, testProduct.quantity, testProduct.details, testProduct.sellingPrice, testProduct.arrivalDate);

    expect(mockDBRun).toHaveBeenCalledWith(
        "INSERT INTO product (model, category, quantity, details, sellingPrice, arrivalDate) VALUES (?, ?, ?, ?, ?, ?)",
        [
          testProduct.model,
          testProduct.category,
          testProduct.quantity,
          testProduct.details,
          testProduct.sellingPrice,
          testProduct.arrivalDate
        ],
        expect.any(Function)
    );

    mockDBRun.mockRestore();
  });

  test("registerProducts - product already exists", async () => {
    const productDAO = new ProductDAO();
    jest.spyOn(productDAO, 'getProductByModel').mockResolvedValueOnce(testProduct);

    await expect(productDAO.registerProducts(testProduct.model, testProduct.category, testProduct.quantity, testProduct.details, testProduct.sellingPrice, testProduct.arrivalDate))
        .rejects
        .toThrow(ProductAlreadyExistsError);
  });

  test("registerProducts - successful registration without arrival date", async () => {
    const productDAO = new ProductDAO();
    jest.spyOn(productDAO, 'getProductByModel').mockResolvedValueOnce(undefined);
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(null);
      return db;
    });

    const testProductWithoutDate = { ...testProduct, arrivalDate: null as any };

    await productDAO.registerProducts(
        testProductWithoutDate.model,
        testProductWithoutDate.category,
        testProductWithoutDate.quantity,
        testProductWithoutDate.details,
        testProductWithoutDate.sellingPrice,
        null // no arrival date
    );

    expect(mockDBRun).toHaveBeenCalledWith(
        "INSERT INTO product (model, category, quantity, details, sellingPrice, arrivalDate) VALUES (?, ?, ?, ?, ?, ?)",
        [
          testProductWithoutDate.model,
          testProductWithoutDate.category,
          testProductWithoutDate.quantity,
          testProductWithoutDate.details,
          testProductWithoutDate.sellingPrice,
          expect.any(String) // should be the current date
        ],
        expect.any(Function)
    );

    mockDBRun.mockRestore();
  });

  test("registerProducts - database error", async () => {
    const productDAO = new ProductDAO();
    jest.spyOn(productDAO, 'getProductByModel').mockResolvedValueOnce(undefined);
    const errorMessage = "Database error";
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(new Error(errorMessage));
      return db;
    });

    await expect(productDAO.registerProducts(testProduct.model, testProduct.category, testProduct.quantity, testProduct.details, testProduct.sellingPrice, testProduct.arrivalDate))
        .rejects
        .toThrow(errorMessage);

    mockDBRun.mockRestore();
  });

  test("changeProductQuantity - successful operation", async () => {
    const productDAO = new ProductDAO();
    jest.spyOn(productDAO, 'getProductByModel').mockResolvedValueOnce(testProduct);
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(null);
      return db;
    });
    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(null, { quantity: testProduct.quantity + 50 });
      return db;
    });

    const newQuantity = await productDAO.changeProductQuantity(testProduct.model, 50, null);

    expect(mockDBRun).toHaveBeenCalledWith(
        "UPDATE product SET quantity = quantity + ? WHERE model = ?",
        [50, testProduct.model],
        expect.any(Function)
    );

    expect(newQuantity).toBe(150);

    mockDBRun.mockRestore();
    mockDBGet.mockRestore();
  });

  test("changeProductQuantity - product not found", async () => {
    const productDAO = new ProductDAO();
    jest.spyOn(productDAO, 'getProductByModel').mockResolvedValueOnce(undefined);

    await expect(productDAO.changeProductQuantity(testProduct.model, 50, null))
        .rejects
        .toThrow(ProductNotFoundError);
  });

  test("changeProductQuantity - invalid change date", async () => {
    const productDAO = new ProductDAO();
    jest.spyOn(productDAO, 'getProductByModel').mockResolvedValueOnce(testProduct);

    await expect(productDAO.changeProductQuantity(testProduct.model, 50, '2100-01-01'))
        .rejects
        .toThrow("Invalid change date");
  });

  test("changeProductQuantity - successful operation without change date", async () => {
    const productDAO = new ProductDAO();
    jest.spyOn(productDAO, 'getProductByModel').mockResolvedValueOnce(testProduct);
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(null);
      return db;
    });
    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(null, { quantity: testProduct.quantity + 50 });
      return db;
    });

    const newQuantity = await productDAO.changeProductQuantity(testProduct.model, 50, null);

    expect(mockDBRun).toHaveBeenCalledWith(
        "UPDATE product SET quantity = quantity + ? WHERE model = ?",
        [50, testProduct.model],
        expect.any(Function)
    );

    expect(newQuantity).toBe(150);

    mockDBRun.mockRestore();
    mockDBGet.mockRestore();
  })

  test("changeProductQuantity - database error", async () => {
    const productDAO = new ProductDAO();
    jest.spyOn(productDAO, 'getProductByModel').mockResolvedValueOnce(testProduct);
    const errorMessage = "Database error";
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(new Error(errorMessage));
      return db;
    });

    await expect(productDAO.changeProductQuantity(testProduct.model, 50, null))
        .rejects
        .toThrow(errorMessage);

    mockDBRun.mockRestore();
  });

  test("changeProductQuantity - database error on get updated quantity", async () => {
    const productDAO = new ProductDAO();
    jest.spyOn(productDAO, 'getProductByModel').mockResolvedValueOnce(testProduct);
    const errorMessage = "Database error";
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(null);
      return db;
    });
    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(new Error(errorMessage), null);
      return db;
    });

    await expect(productDAO.changeProductQuantity(testProduct.model, 50, null))
        .rejects
        .toThrow(errorMessage);

    mockDBRun.mockRestore();
    mockDBGet.mockRestore();
  });

//   test("changeProductQuantity - ArrivalDateAfterCurrent error", async () => {
//     const productDAO = new ProductDAO();
//     const testProduct = new Product(10, "iPhone13", Category.SMARTPHONE, "2222-06-05", "Latest model", 100);
  
    
//     jest.spyOn(productDAO, 'getProductByModel').mockResolvedValueOnce(testProduct);

//     await expect(productDAO.changeProductQuantity(testProduct.model, 50, "2020-01-01"))
//         .rejects
//         .toThrow("ArrivalDateAfterCurrent");
// });

  test("sellProduct - successful operation", async () => {
    const productDAO = new ProductDAO();
    jest.spyOn(productDAO, 'getProductByModel').mockResolvedValueOnce(testProduct);
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(null);
      return db;
    });
    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(null, { quantity: testProduct.quantity - 20 });
      return db;
    });

    const newQuantity = await productDAO.sellProduct(testProduct.model, 20, null);

    expect(mockDBRun).toHaveBeenCalledWith(
        "UPDATE product SET quantity = quantity - ? WHERE model = ?",
        [20, testProduct.model],
        expect.any(Function)
    );

    expect(newQuantity).toBe(80);

    mockDBRun.mockRestore();
    mockDBGet.mockRestore();
  });

  test("sellProduct - product not found", async () => {
    const productDAO = new ProductDAO();
    jest.spyOn(productDAO, 'getProductByModel').mockResolvedValueOnce(undefined);

    await expect(productDAO.sellProduct(testProduct.model, 20, null))
        .rejects
        .toThrow(ProductNotFoundError);
  });

  test("sellProduct - empty stock", async () => {
    const productDAO = new ProductDAO();
    const emptyProduct = { ...testProduct, quantity: 0 };

    jest.spyOn(productDAO, 'getProductByModel').mockResolvedValueOnce(emptyProduct);

    await expect(productDAO.sellProduct(emptyProduct.model, 20, null))
        .rejects
        .toThrow(EmptyProductStockError);
  });

  test("sellProduct - low stock", async () => {
    const productDAO = new ProductDAO();
    const lowStockProduct = { ...testProduct, quantity: 10 };

    jest.spyOn(productDAO, 'getProductByModel').mockResolvedValueOnce(lowStockProduct);

    await expect(productDAO.sellProduct(lowStockProduct.model, 20, null))
        .rejects
        .toThrow(LowProductStockError);
  });

  test("sellProduct - invalid selling date", async () => {
    const productDAO = new ProductDAO();
    jest.spyOn(productDAO, 'getProductByModel').mockResolvedValueOnce(testProduct);

    await expect(productDAO.sellProduct(testProduct.model, 20, '2100-01-01'))
        .rejects
        .toThrow("Invalid selling date");
  });

  test("sellProduct - database error", async () => {
    const productDAO = new ProductDAO();
    jest.spyOn(productDAO, 'getProductByModel').mockResolvedValueOnce(testProduct);
    const errorMessage = "Database error";
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(new Error(errorMessage));
      return db;
    });

    await expect(productDAO.sellProduct(testProduct.model, 20, null))
        .rejects
        .toThrow(errorMessage);

    mockDBRun.mockRestore();
  });

  test("sellProduct - database error on get updated quantity", async () => {
    const productDAO = new ProductDAO();
    jest.spyOn(productDAO, 'getProductByModel').mockResolvedValueOnce(testProduct);
    const errorMessage = "Database error";
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(null);
      return db;
    });
    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(new Error(errorMessage), null);
      return db;
    });

    await expect(productDAO.sellProduct(testProduct.model, 20, null))
        .rejects
        .toThrow(errorMessage);

    mockDBRun.mockRestore();
    mockDBGet.mockRestore();
  });

  test("sellProduct - arrival date after current date", async () => {
    const productDAO = new ProductDAO();
    jest.spyOn(productDAO, 'getProductByModel').mockResolvedValueOnce(testProduct);

    await expect(productDAO.sellProduct(testProduct.model, 20, "2100-01-01"))
        .rejects
        .toThrow("Invalid selling date");
  });

  test("getProducts - successful operation", async () => {
    const productDAO = new ProductDAO();
    const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
      callback(null, [testProduct, anotherProduct]);
      return db;
    });

    const products = await productDAO.getProducts(null, null, null);

    expect(mockDBAll).toHaveBeenCalledWith(
        "SELECT * FROM product",
        [],
        expect.any(Function)
    );

    expect(products).toEqual([testProduct, anotherProduct]);

    mockDBAll.mockRestore();
  });

  test("getProducts - filter by model", async () => {
    const productDAO = new ProductDAO();
    const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
      callback(null, [testProduct]);
      return db;
    });

    const products = await productDAO.getProducts("model", null, "iPhone13");

    expect(mockDBAll).toHaveBeenCalledWith(
        "SELECT * FROM product WHERE model = ?",
        ["iPhone13"],
        expect.any(Function)
    );

    expect(products).toEqual([testProduct]);

    mockDBAll.mockRestore();
  });

  test("getProducts - filter by category", async () => {
    const productDAO = new ProductDAO();
    const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
      callback(null, [testProduct]);
      return db;
    });

    const products = await productDAO.getProducts("category", "Smartphone", null);

    expect(mockDBAll).toHaveBeenCalledWith(
        "SELECT * FROM product WHERE category = ?",
        ["Smartphone"],
        expect.any(Function)
    );

    expect(products).toEqual([testProduct]);

    mockDBAll.mockRestore();
  });

  test("get Products - database error", async () => {
    const productDAO = new ProductDAO();
    const errorMessage = "Database error";
    const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
      callback(new Error(errorMessage), null);
      return db;
    });

    await expect(productDAO.getProducts(null, null, null)).rejects.toThrow(errorMessage);

    mockDBAll.mockRestore();
  });

  test("getProducts - grouping equal model and rows.length==0 error", async () => {
    const productDAO = new ProductDAO();
    const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
      callback(null, []);
      return db;
    });

    await expect(productDAO.getProducts("model", null, "iPhone13")).rejects.toThrow("");

    mockDBAll.mockRestore();
  });

  test("getProducts - first catch error", async () => {
    const productDAO = new ProductDAO();
    const errorMessage = "Database error";
    const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
      callback(new Error(errorMessage), null);
      return db;
    });

    await expect(productDAO.getProducts("model", null, "iPhone13")).rejects.toThrow(errorMessage);

    mockDBAll.mockRestore();
  });

  test("getAvailableProducts - successful operation", async () => {
    const productDAO = new ProductDAO();
    const availableProducts = [testProduct, anotherProduct];
    const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
      callback(null, availableProducts);
      return db;
    });

    const products = await productDAO.getAvailableProducts(null, null, null);

    expect(mockDBAll).toHaveBeenCalledWith(
        "SELECT * FROM product WHERE quantity > 0",
        [],
        expect.any(Function)
    );

    expect(products).toEqual(availableProducts);

    mockDBAll.mockRestore();
  });

  test("getAvailableProducts - filter by model", async () => {
    const productDAO = new ProductDAO();
    const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
      callback(null, [testProduct]);
      return db;
    });

    const products = await productDAO.getAvailableProducts("model", null, "iPhone13");

    expect(mockDBAll).toHaveBeenCalledWith(
        "SELECT * FROM product WHERE quantity > 0 AND model = ?",
        ["iPhone13"],
        expect.any(Function)
    );

    expect(products).toEqual([testProduct]);

    mockDBAll.mockRestore();
  });

  test("getAvailableProducts - filter by category", async () => {
    const productDAO = new ProductDAO();
    const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
      callback(null, [testProduct]);
      return db;
    });

    const products = await productDAO.getAvailableProducts("category", "Smartphone", null);

    expect(mockDBAll).toHaveBeenCalledWith(
        "SELECT * FROM product WHERE quantity > 0 AND category = ?",
        ["Smartphone"],
        expect.any(Function)
    );

    expect(products).toEqual([testProduct]);

    mockDBAll.mockRestore();
  });

  test("getAvailableProducts - database error", async () => {
    const productDAO = new ProductDAO();
    const errorMessage = "Database error";
    const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
      callback(new Error(errorMessage), null);
      return db;
    });

    await expect(productDAO.getAvailableProducts(null, null, null)).rejects.toThrow(errorMessage);

    mockDBAll.mockRestore();
  });

  test("deleteAllProducts - successful operation", async () => {
    const productDAO = new ProductDAO();
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, callback) => {
      callback(null);
      return db;
    });

    const result = await productDAO.deleteAllProducts();

    expect(mockDBRun).toHaveBeenCalledWith(
        "DELETE FROM product",
        expect.any(Function)
    );

    expect(result).toBe(true);

    mockDBRun.mockRestore();
  });

  test("deleteAllProducts - database error", async () => {
    const productDAO = new ProductDAO();
    const errorMessage = "Database error";
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, callback) => {
      callback(new Error(errorMessage));
      return db;
    });

    await expect(productDAO.deleteAllProducts()).rejects.toThrow(errorMessage);

    mockDBRun.mockRestore();
  });

  test("deleteProduct - successful operation", async () => {
    const productDAO = new ProductDAO();
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(null);
      return db;
    });

    jest.spyOn(productDAO, 'getProductByModel').mockResolvedValueOnce(testProduct);

    const result = await productDAO.deleteProduct(testProduct.model);

    expect(mockDBRun).toHaveBeenCalledWith(
        "DELETE FROM product WHERE model = ?",
        [testProduct.model],
        expect.any(Function)
    );

    expect(result).toBe(true);

    mockDBRun.mockRestore();
  });

  test("deleteProduct - database error", async () => {
    const productDAO = new ProductDAO();
    const errorMessage = "Database error";
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(new Error(errorMessage));
      return db;
    });

    jest.spyOn(productDAO, 'getProductByModel').mockResolvedValueOnce(testProduct);

    await expect(productDAO.deleteProduct(testProduct.model)).rejects.toThrow(errorMessage);

    mockDBRun.mockRestore();
  });

  test("deleteProduct - product not found", async () => {
    const productDAO = new ProductDAO();
    jest.spyOn(productDAO, 'getProductByModel').mockResolvedValueOnce(undefined);

    await expect(productDAO.deleteProduct(testProduct.model))
        .rejects
        .toThrow(ProductNotFoundError);
  });

  describe("getProductByModel", () => {
    test("should return the product when model exists", async () => {
      const productDAO = new ProductDAO();
      const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, testProduct);
        return db;
      });

      const product = await productDAO.getProductByModel(testProduct.model);

      expect(mockDBGet).toHaveBeenCalledWith(
          "SELECT * FROM product WHERE model = ?",
          [testProduct.model],
          expect.any(Function)
      );

      expect(product).toEqual(testProduct);

      mockDBGet.mockRestore();
    });

    test("should handle database errors gracefully", async () => {
      const productDAO = new ProductDAO();
      const errorMessage = "Database error";
      const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(new Error(errorMessage), null);
        return db;
      });

      await expect(productDAO.getProductByModel(testProduct.model)).rejects.toThrow(errorMessage);

      expect(mockDBGet).toHaveBeenCalledWith(
          "SELECT * FROM product WHERE model = ?",
          [testProduct.model],
          expect.any(Function)
      );

      mockDBGet.mockRestore();
    });
  });
});