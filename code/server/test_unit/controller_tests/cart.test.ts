import { describe, test, expect, beforeAll, afterAll, jest } from "@jest/globals"
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


describe("CartController", () => {
    test("It should add a product to the cart of th elogged in user", async() => {
      jest.spyOn(CartDAO.prototype, "addToCart").mockResolvedValueOnce(true);
      const controller = new CartController();
      const response = await controller.addToCart(testCustomer, "test");
      expect(CartDAO.prototype.addToCart).toHaveBeenCalledTimes(1);
      expect(CartController.prototype.addToCart).toHaveBeenCalledWith(testCustomer, "test");
      expect(response).toBe(undefined);
    }, 10000);
  })

