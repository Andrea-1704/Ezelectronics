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

  /*
   @param user - The user for whom to retrieve the cart.
     * @returns A Promise that resolves to the user's cart or an empty one if there is no current cart.
     
   getCart(user: User): Promise<Cart> {
    return this.dao.getCart(user);
    }
  */
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
      test("Dovrebbe rimuovere il prodotto dal carrello dell'utente se possibile", async () => {
        const removeProductFromCartSpy = jest.spyOn(CartController.prototype, "removeProductFromCart").mockResolvedValueOnce(true);
        
        const controller = new CartController();
        const response = await controller.removeProductFromCart(testCustomer, testProduct.model);
  
        expect(removeProductFromCartSpy).toHaveBeenCalledTimes(1);
        expect(removeProductFromCartSpy).toHaveBeenCalledWith(testCustomer, testProduct.model);
        expect(response).toBe(true);
      }, 10000);
  
      test("Dovrebbe restituire false se il prodotto non può essere rimosso dal carrello", async () => {
        const removeProductFromCartSpy = jest.spyOn(CartController.prototype, "removeProductFromCart").mockResolvedValueOnce(false);
        
        const controller = new CartController();
        const response = await controller.removeProductFromCart(testCustomer, testProduct.model);
  
        expect(removeProductFromCartSpy).toHaveBeenCalledTimes(1);
        expect(removeProductFromCartSpy).toHaveBeenCalledWith(testCustomer, testProduct.model);
        expect(response).toBe(false);
      }, 10000);
    });
    describe("CartController", () => {
      test("Dovrebbe eliminare tutti i carrelli di tutti gli utenti se possibile", async () => {
        const deleteAllCartsSpy = jest.spyOn(CartController.prototype, "deleteAllCarts").mockResolvedValueOnce(true);
        
        const controller = new CartController();
        const response = await controller.deleteAllCarts();
  
        expect(deleteAllCartsSpy).toHaveBeenCalledTimes(1);
        expect(response).toBe(true);
      }, 10000);
  
      test("Dovrebbe restituire false se i carrelli non possono essere eliminati", async () => {
        const deleteAllCartsSpy = jest.spyOn(CartController.prototype, "deleteAllCarts").mockResolvedValueOnce(false);
        
        const controller = new CartController();
        const response = await controller.deleteAllCarts();
  
        expect(deleteAllCartsSpy).toHaveBeenCalledTimes(1);
        expect(response).toBe(false);
      }, 10000);
    });
  });
  

