import { describe, test, expect, jest, beforeEach } from '@jest/globals';
// @ts-ignore
import request from 'supertest';
import Authenticator from "../../src/routers/auth";
import ErrorHandler from "../../src/helper";
import ProductController from "../../src/controllers/productController";
import {Category, Product} from "../../src/components/product";
import {cleanup} from "../../src/db/cleanup";
import {app} from "../../index";
const baseURL = "/ezelectronics/products";

jest.mock('../../src/routers/auth');
jest.mock('../../src/controllers/productController');
jest.mock('../../src/helper');

// Sample data for testing
const testProduct: Product = {
  model: 'iPhone13',
  category: Category.SMARTPHONE,
  quantity: 100,
  details: 'Latest model',
  sellingPrice: 999.99,
  arrivalDate: undefined
};

describe('ProductRoutes unit tests', () => {
  beforeEach(() => {
    cleanup()
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  })

  describe("POST /products", () => {
    test("It should register product arrival", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
      jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => next());
      jest.mock('express-validator', () => ({
        body: jest.fn().mockImplementation(() => ({
          isString: () => ({ notEmpty: () => ({}) }),
          isIn: () => ({}),
          optional: () => ({ isISO8601: () => ({ toDate: () => ({}) }) })
        }))
      }));
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
      jest.spyOn(ProductController.prototype, "registerProducts").mockResolvedValueOnce();

      const response = await request(app).post(baseURL).send(testProduct);
      expect(response.status).toBe(200);

      // Convert arrivalDate to string format for the comparison
      expect(ProductController.prototype.registerProducts).toHaveBeenCalledTimes(1);
      expect(ProductController.prototype.registerProducts).toHaveBeenCalledWith(
          testProduct.model,
          testProduct.category,
          testProduct.quantity,
          testProduct.details,
          testProduct.sellingPrice,
          testProduct.arrivalDate
      );
    }, 10000);
  });

  describe("PATCH /products/:model", () => {
    test("It should register increase in product quantity", async () => {
      const updatedQuantity = 50;
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
      jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => next());
      jest.mock('express-validator', () => ({
        param: jest.fn().mockImplementation(() => ({ isString: () => ({ notEmpty: () => ({}) }) })),
        body: jest.fn().mockImplementation(() => ({ isNumeric: () => ({ isInt: () => ({}) }) }))
      }));
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
      jest.spyOn(ProductController.prototype, "changeProductQuantity").mockResolvedValueOnce(updatedQuantity);

      const response = await request(app).patch(`${baseURL}/${testProduct.model}`).send({ quantity: updatedQuantity });
      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(updatedQuantity);
      expect(ProductController.prototype.changeProductQuantity).toHaveBeenCalledWith(
          testProduct.model,
          updatedQuantity,
          undefined
      );
    }, 10000);
  });

  describe("PATCH /products/:model/sell", () => {
    test("It should sell the product", async () => {
      const sellQuantity = 10;
      const remainingQuantity = 90;
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
      jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => next());
      jest.mock('express-validator', () => ({
        param: jest.fn().mockImplementation(() => ({ isString: () => ({ notEmpty: () => ({}) }) })),
        body: jest.fn().mockImplementation(() => ({ isNumeric: () => ({ isInt: () => ({}) }) }))
      }));
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
      jest.spyOn(ProductController.prototype, "sellProduct").mockResolvedValueOnce(remainingQuantity);

      const response = await request(app).patch(`${baseURL}/${testProduct.model}/sell`).send({ quantity: sellQuantity });
      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(remainingQuantity);
      expect(ProductController.prototype.sellProduct).toHaveBeenCalledWith(
          testProduct.model,
          sellQuantity,
          undefined
      );
    }, 10000);
  });

  describe("GET /products", () => {
    test("It should retrieve all products", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
      jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => next());
      jest.mock('express-validator', () => ({
        query: jest.fn().mockImplementation(() => ({
          optional: () => ({ isString: () => ({ isIn: () => ({}) }), notEmpty: () => ({}) })
        }))
      }));
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
      jest.spyOn(ProductController.prototype, "getProducts").mockResolvedValueOnce([testProduct]);

      const response = await request(app).get(baseURL);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([testProduct]);
      expect(ProductController.prototype.getProducts).toHaveBeenCalledWith(undefined, undefined, undefined);
    }, 10000);
  });

  describe("DELETE /products", () => {
    test("It should delete all products", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
      jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => next());
      jest.spyOn(ProductController.prototype, "deleteAllProducts").mockResolvedValueOnce(null);

      const response = await request(app).delete(baseURL);
      expect(response.status).toBe(200);
      expect(ProductController.prototype.deleteAllProducts).toHaveBeenCalled();
    }, 10000);
  });

  describe("DELETE /products/:model", () => {
    test("It should delete a product by model", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
      jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => next());
      jest.mock('express-validator', () => ({
        param: jest.fn().mockImplementation(() => ({ isString: () => ({ notEmpty: () => ({}) }) }))
      }));
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
      jest.spyOn(ProductController.prototype, "deleteProduct").mockResolvedValueOnce(null);

      const response = await request(app).delete(`${baseURL}/${testProduct.model}`);
      expect(response.status).toBe(200);
      expect(ProductController.prototype.deleteProduct).toHaveBeenCalledWith(testProduct.model);
    }, 10000);
  });
});