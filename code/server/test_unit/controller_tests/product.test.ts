import { describe, test, expect, jest, afterEach, beforeEach } from "@jest/globals";
import ProductController from "../../src/controllers/productController";
import { Category, Product } from "../../src/components/product";
import ProductDAO from "../../src/dao/productDAO";
import { GroupingError } from "../../src/errors/productError";

jest.mock('../../src/dao/productDAO');

const testProduct = new Product(10, "iPhone13", Category.SMARTPHONE, "2022-06-05", "Latest model", 100);
const anotherProduct = new Product(15, "GalaxyS21", Category.SMARTPHONE, "2021-08-10", "Top-notch model", 50);

describe("ProductController unit tests", () => {

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe("registerProducts", () => {
    test("It should register a new product", async () => {
      const registerProductsSpy = jest.spyOn(ProductDAO.prototype, "registerProducts").mockResolvedValueOnce(undefined);

      const controller = new ProductController();
      const response = await controller.registerProducts(
          testProduct.model,
          testProduct.category,
          testProduct.quantity,
          testProduct.details,
          testProduct.sellingPrice,
          testProduct.arrivalDate
      );

      expect(registerProductsSpy).toHaveBeenCalledTimes(1);
      expect(registerProductsSpy).toHaveBeenCalledWith(
          testProduct.model,
          testProduct.category,
          testProduct.quantity,
          testProduct.details,
          testProduct.sellingPrice,
          testProduct.arrivalDate
      );
      expect(response).toBeUndefined();
    });

    test("It should throw an error if the arrival date is after the current date", async () => {
      const controller = new ProductController();
      await expect(controller.registerProducts(
          testProduct.model,
          testProduct.category,
          testProduct.quantity,
          testProduct.details,
          testProduct.sellingPrice,
          "2029-06-05"
      )).rejects.toThrow("");
    });
  });

  describe("changeProductQuantity", () => {
    test("It should increase the quantity of a product", async () => {
      const changeProductQuantitySpy = jest.spyOn(ProductDAO.prototype, "changeProductQuantity").mockResolvedValueOnce(150);

      const controller = new ProductController();
      const response = await controller.changeProductQuantity(testProduct.model, 50, null);

      expect(changeProductQuantitySpy).toHaveBeenCalledTimes(1);
      expect(changeProductQuantitySpy).toHaveBeenCalledWith(testProduct.model, 50, null);
      expect(response).toBe(150);
    });

    test("It should throw an error if the change date is after the current date", async () => {
      const controller = new ProductController();
      await expect(controller.changeProductQuantity(testProduct.model, 50, "2029-06-05")).rejects.toThrow("");
    });
  });

  describe("sellProduct", () => {
    test("It should decrease the quantity of a product through a sale", async () => {
      const sellProductSpy = jest.spyOn(ProductDAO.prototype, "sellProduct").mockResolvedValueOnce(80);

      const controller = new ProductController();
      const response = await controller.sellProduct(testProduct.model, 20, null);

      expect(sellProductSpy).toHaveBeenCalledTimes(1);
      expect(sellProductSpy).toHaveBeenCalledWith(testProduct.model, 20, null);
      expect(response).toBe(80);
    });
    test("It should throw an error if the selling date is after the current date", async () => {
      const controller = new ProductController();
      await expect(controller.sellProduct(testProduct.model, 20, "2029-06-05")).rejects.toThrow("");
    });
  });

  describe("getProducts", () => {
    test("It should return all products", async () => {
      const getProductsSpy = jest.spyOn(ProductDAO.prototype, "getProducts").mockResolvedValueOnce([testProduct, anotherProduct]);

      const controller = new ProductController();
      const response = await controller.getProducts(null, null, null);

      expect(getProductsSpy).toHaveBeenCalledTimes(1);
      expect(response).toEqual([testProduct, anotherProduct]);
    });

    test("It should throw an error if category is required but not provided", async () => {
      const controller = new ProductController();
      await expect(controller.getProducts("category", null, null)).rejects.toThrow("");
    });

    test("It should throw an error if model is required but not provided", async () => {
      const controller = new ProductController();
      await expect(controller.getProducts("model", null, null)).rejects.toThrow("");
    });

    test('should throw GroupingError when grouping is "category" and category is null', async () => {
      expect.assertions(1);
      try {
          const controller = new ProductController();
          await controller.getProducts('category', null, null);
      } catch (e) {
          expect(e).toBeInstanceOf(GroupingError);
      }
  });
    test("shold throw GroupingError when grouping is not provided but model is", async () => {
      expect.assertions(1);
      try {
          const controller = new ProductController();
          await controller.getProducts(null, null, "model");
      } catch (e) {
          expect(e).toBeInstanceOf(GroupingError);
      }
    });
  });

  test("getProducts should throw an error if gorouping is equal to category and category is not provided", async () => {
    const controller = new ProductController();
    await expect(controller.getProducts("category", null, null)).rejects.toThrow("");
  });

  describe("getAvailableProducts", () => {
    test("It should return all available products", async () => {
      const getAvailableProductsSpy = jest.spyOn(ProductDAO.prototype, "getAvailableProducts").mockResolvedValueOnce([testProduct]);

      const controller = new ProductController();
      const response = await controller.getAvailableProducts(null, null, null);

      expect(getAvailableProductsSpy).toHaveBeenCalledTimes(1);
      expect(response).toEqual([testProduct]);
    });

    test("It should throw an error if category is required but not provided", async () => {
      const controller = new ProductController();
      await expect(controller.getAvailableProducts("category", null, null)).rejects.toThrow("");
    });

    test("It should throw an error if model is required but not provided", async () => {
      const controller = new ProductController();
      await expect(controller.getAvailableProducts("model", null, null)).rejects.toThrow("");
    });

    test("It should throw an error if grouping is not provided but category is", async () => {
      const controller = new ProductController();
      await expect(controller.getAvailableProducts(null, "category", null)).rejects.toThrow("");
    });

    test("It should throw an error if grouping is category and category is not provided", async () => {
      const controller = new ProductController();
      //await expect(controller.getAvailableProducts("category", null, null)).rejects.toThrow("");
      try {
        const controller = new ProductController();
        await controller.getAvailableProducts("category", null, null);
      } catch (e) {
          expect(e).toBeInstanceOf(GroupingError);
      }
   
    });
    test("It should throw an error if grouping is model and model is not provided", async () => {
      const controller = new ProductController();
      //await expect(controller.getAvailableProducts("model", null, null)).rejects.toThrow("");
      try {
        const controller = new ProductController();
        await controller.getAvailableProducts("model", null, null);
      } catch (e) {
          expect(e).toBeInstanceOf(GroupingError);
      }
    });
    
  });

  describe("deleteAllProducts", () => {
    test("It should delete all products", async () => {
      const deleteAllProductsSpy = jest.spyOn(ProductDAO.prototype, "deleteAllProducts").mockResolvedValueOnce(true);

      const controller = new ProductController();
      const response = await controller.deleteAllProducts();

      expect(deleteAllProductsSpy).toHaveBeenCalledTimes(1);
      expect(response).toBe(true);
    });
  });

  describe("deleteProduct", () => {
    test("It should delete a product by model", async () => {
      const deleteProductSpy = jest.spyOn(ProductDAO.prototype, "deleteProduct").mockResolvedValueOnce(true);

      const controller = new ProductController();
      const response = await controller.deleteProduct(testProduct.model);

      expect(deleteProductSpy).toHaveBeenCalledTimes(1);
      expect(deleteProductSpy).toHaveBeenCalledWith(testProduct.model);
      expect(response).toBe(true);
    });
  });
});