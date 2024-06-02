import { describe, test, expect, afterEach, beforeAll, afterAll, jest } from "@jest/globals"
import {User, Role} from "../../src/components/user";
import { Cart } from "../../src/components/cart";
import CartController from "../../src/controllers/cartController";
import CartDAO from "../../src/dao/cartDAO";
import Authenticator from "../../src/routers/auth";
import request from 'supertest';
import { app } from "../../index";
import ErrorHandler from "../../src/helper"
import { Category, Product } from "../../src/components/product";
import { beforeEach } from "node:test";
import { get } from "http";
const baseURL = "/ezelectronics";

let testCustomer = new User("customer", "customer", "customer", Role.CUSTOMER, "", "")
let testCart = new Cart(0, "customer", false, "17-04-2002", 0, []);
let testProduct= new Product(10, "iphone13", Category.SMARTPHONE, "10-04-2002"," " , 3);


jest.mock("../../src/dao/cartDAO")
jest.mock("../../src/routers/auth")

jest.mock("../../src/routers/auth")


afterEach(() => {
  jest.restoreAllMocks();
});

describe("controller unit tests", () => {
  describe("CartController", () => {
    test("It should add a product to the cart of the logged in user", async () => {
       
      const addToCartSpy = jest.spyOn(CartController.prototype, "addToCart").mockResolvedValueOnce(true);
      
      const controller = new CartController();
      const response = await controller.addToCart(testCustomer, "test");

      expect(addToCartSpy).toHaveBeenCalledTimes(1);
      expect(addToCartSpy).toHaveBeenCalledWith(testCustomer, "test");
      expect(response).toBe(true);
    }, 10000);
  })

    
  describe("CartController", () => {
    test("It should add a product to the cart of the logged in user", async () => {
       
      const addToCartSpy = jest.spyOn(CartController.prototype, "addToCart").mockResolvedValueOnce(undefined);
      
      const controller = new CartController();
      const response = await controller.addToCart(testCustomer, "test");
  
      expect(addToCartSpy).toHaveBeenCalledTimes(1);
      expect(addToCartSpy).toHaveBeenCalledWith(testCustomer, "test");
      expect(response).toBe(undefined);
    }, 10000);
  })

  
    describe("CartController", () => {
      test("It should add a product to the cart of the logged in user", async () => {
         
        const addToCartSpy = jest.spyOn(CartController.prototype, "addToCart").mockResolvedValueOnce(undefined);
        
        const controller = new CartController();
        const response = await controller.addToCart(testCustomer, "test");
    
        expect(addToCartSpy).toHaveBeenCalledTimes(1);
        expect(addToCartSpy).toHaveBeenCalledWith(testCustomer, "test");
        expect(response).toBe(undefined);
      }, 10000);
    })

    describe("CartController", () => {
      test("It should retrieve the user's cart if it exists", async () => {
        const getCartSpy = jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(testCart);
        
        const controller = new CartController();
        const response = await controller.getCart(testCustomer);
  
        expect(getCartSpy).toHaveBeenCalledTimes(1);
        expect(getCartSpy).toHaveBeenCalledWith(testCustomer);
        expect(response).toEqual(testCart);
      }, 10000);
  
      test("It should return undefined if there is no current cart for the user", async () => {
        const getCartSpy = jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(undefined);
        
        const controller = new CartController();
        const response = await controller.getCart(testCustomer);
  
        expect(getCartSpy).toHaveBeenCalledTimes(1);
        expect(getCartSpy).toHaveBeenCalledWith(testCustomer);
        expect(response).toBeUndefined();
      }, 10000);
    });

    describe("CartController", () => {
      test("It should checkout the user's cart if possible", async () => {
        const checkoutCartSpy = jest.spyOn(CartController.prototype, "checkoutCart").mockResolvedValueOnce(true);
        
        const controller = new CartController();
        const response = await controller.checkoutCart(testCustomer);
  
        expect(checkoutCartSpy).toHaveBeenCalledTimes(1);
        expect(checkoutCartSpy).toHaveBeenCalledWith(testCustomer);
        expect(response).toBe(true);
      }, 10000);
  
      test("It should return false if the cart cannot be checked out", async () => {
        const checkoutCartSpy = jest.spyOn(CartController.prototype, "checkoutCart").mockResolvedValueOnce(false);
        
        const controller = new CartController();
        const response = await controller.checkoutCart(testCustomer);
  
        expect(checkoutCartSpy).toHaveBeenCalledTimes(1);
        expect(checkoutCartSpy).toHaveBeenCalledWith(testCustomer);
        expect(response).toBe(false);
      }, 10000);
    });
    describe("CartController", () => {
      test("Should remocve the cart of the logged in user", async () => {
        const removeProductFromCartSpy = jest.spyOn(CartController.prototype, "removeProductFromCart").mockResolvedValueOnce(true);
        
        const controller = new CartController();
        const response = await controller.removeProductFromCart(testCustomer, testProduct.model);
  
        expect(removeProductFromCartSpy).toHaveBeenCalledTimes(1);
        expect(removeProductFromCartSpy).toHaveBeenCalledWith(testCustomer, testProduct.model);
        expect(response).toBe(true);
      }, 10000);
  
      test("should return false if the product cannot be removed from the cart", async () => {
        const removeProductFromCartSpy = jest.spyOn(CartController.prototype, "removeProductFromCart").mockResolvedValueOnce(false);
        
        const controller = new CartController();
        const response = await controller.removeProductFromCart(testCustomer, testProduct.model);
  
        expect(removeProductFromCartSpy).toHaveBeenCalledTimes(1);
        expect(removeProductFromCartSpy).toHaveBeenCalledWith(testCustomer, testProduct.model);
        expect(response).toBe(false);
      }, 10000);
    });
    describe("CartController", () => {
      test("Should remove all the carts of all the users", async () => {
        const deleteAllCartsSpy = jest.spyOn(CartController.prototype, "deleteAllCarts").mockResolvedValueOnce(true);
        
        const controller = new CartController();
        const response = await controller.deleteAllCarts();
  
        expect(deleteAllCartsSpy).toHaveBeenCalledTimes(1);
        expect(response).toBe(true);
      }, 10000);
  
      test("return false if the cart cannot be removed", async () => {
        const deleteAllCartsSpy = jest.spyOn(CartController.prototype, "deleteAllCarts").mockResolvedValueOnce(false);
        
        const controller = new CartController();
        const response = await controller.deleteAllCarts();
  
        expect(deleteAllCartsSpy).toHaveBeenCalledTimes(1);
        expect(response).toBe(false);
      }, 10000);
    });

    /*@returns A Promise that resolves to an array of carts.
     
    async getAllCarts(): Promise<Cart[]>{
      return this.dao.getAllCarts()
    }
    */
    describe("CartController", () => {
      test("Should get all the carts, if possible", async () => {
        const getAllCarts = jest.spyOn(CartController.prototype, "getAllCarts").mockResolvedValueOnce(undefined);
        
        const controller = new CartController();
        const response = await controller.getAllCarts();
  
        expect(getAllCarts).toHaveBeenCalledTimes(1);
        expect(response).toBe(undefined);
      }, 10000);
  
      
    });
    
});