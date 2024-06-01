import { describe, test, expect, beforeAll, afterAll, jest } from "@jest/globals"
import {User, Role} from "../../src/components/user";
import { Cart } from "../../src/components/cart";
import CartController from "../../src/controllers/cartController";
import Authenticator from "../../src/routers/auth";
import request from 'supertest';
import { app } from "../../index";
import ErrorHandler from "../../src/helper"
import { Category, Product } from "../../src/components/product";
const baseURL = "/ezelectronics";

let testCustomer = new User("customer", "customer", "customer", Role.CUSTOMER, "", "")
let testCart = new Cart(0, "customer", false, "17-04-2002", 0, []);
let testProduct= new Product(10, "iphone13", Category.SMARTPHONE, null, null, 3);

jest.mock("../../src/controllers/cartController")
jest.mock("../../src/routers/auth")

describe("Route unit tests", () => {
  describe("GET /carts", () => {
    test("It returns the cart of the logged in user", async() => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        return next();
      })
      jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
        return next();
      })
      jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(testCart);
      
      //We send a request to the route we are testing. We are in a situation where:
            //  - The user is an Customer (= the Authenticator logic is mocked to be correct)
            //  - The getCart function returns the cart of the user (= the cartController logic is mocked to be correct)
            //We expect the 'getCart' function to have been called, the route to return a 200 success code and the expected cart of the
            //customer
      const response = await request(app).get(baseURL + "/carts")
      expect(response.status).toBe(200)
      expect(CartController.prototype.getCart).toHaveBeenCalled()
      expect(response.body).toEqual(testCart)
    }, 10000);
  })

/*
test this function:
this.router.get(
            "/",
            this.authenticator.isLoggedIn,
            this.authenticator.isCustomer,
            (req: any, res: any, next: any) => this.controller.getCart(req.user)
                .then((cart: any ) => {
                  res.status(200).json(cart)
                })
                .catch((err) => {
                    next(err)
                })
        )
*/
describe("POST /carts", () => {
  test("It returns the cart of the logged in user", async() => {
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
      return next();
    })
    jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
      return next();
    })
    jest.mock('express-validator', () => ({
      body: jest.fn().mockImplementation(() => ({
          isString: () => ({ notEmpty: () => ({}) }),
      })),
    }))
    jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
      return next()
    })
    jest.spyOn(CartController.prototype, "addToCart").mockResolvedValueOnce(true);
    
    //We send a request to the route we are testing. We are in a situation where:
          //  - The user is an Customer (= the Authenticator logic is mocked to be correct)
          //  - The getCart function returns the cart of the user (= the cartController logic is mocked to be correct)
          //We expect the 'getCart' function to have been called, the route to return a 200 success code and the expected cart of the
          //customer
    const response = await request(app).post(baseURL + "/carts").send(testProduct)
    expect(response.status).toBe(200)
    expect(CartController.prototype.addToCart).toHaveBeenCalled()
    //expect(response.body).toEqual(testCart)
    //sellingPrice: number, model: string, category: Category, arrivalDate: string | null, details: string | null, quantity: number
    expect(CartController.prototype.addToCart).toHaveBeenCalledWith(testProduct.sellingPrice, testProduct.model, testProduct.category, testProduct.arrivalDate, testProduct.details, testProduct.quantity)

    }, 10000);
  })
  /*
  this.router.post(
            "/",
            this.authenticator.isLoggedIn,
            this.authenticator.isCustomer,
            body("model").isString().notEmpty(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => this.controller.addToCart(req.user, req.body.model)
                .then((): void => res.status(200).end())
                .catch((err) => {
                    next(err)
                })
        )
  */



})

/*
describe("POST /users", () => {
        //We are testing a route that creates a user. This route calls the createUser method of the UserController, uses the express-validator 'body' method to validate the input parameters and the ErrorHandler to validate the request
        //All of these dependencies are mocked to test the route in isolation
        //For the success case, we expect that the dependencies all work correctly and the route returns a 200 success code
        test("It should return a 200 success code", async () => {
            const inputUser = { username: "test", name: "test", surname: "test", password: "test", role: "Manager" }
            //We mock the express-validator 'body' method to return a mock object with the methods we need to validate the input parameters
            //These methods all return an empty object, because we are not testing the validation logic here (we assume it works correctly)
            jest.mock('express-validator', () => ({
                body: jest.fn().mockImplementation(() => ({
                    isString: () => ({ isLength: () => ({}) }),
                    isIn: () => ({ isLength: () => ({}) }),
                })),
            }))
            //We mock the ErrorHandler validateRequest method to return the next function, because we are not testing the validation logic here (we assume it works correctly)
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            })
            //We mock the UserController createUser method to return true, because we are not testing the UserController logic here (we assume it works correctly)
            jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true)

            /*We send a request to the route we are testing. We are in a situation where:
                - The input parameters are 'valid' (= the validation logic is mocked to be correct)
                - The user creation function is 'successful' (= the UserController logic is mocked to be correct)
              We expect the 'createUser' function to have been called with the input parameters and to return a 200 success code
              Since we mock the dependencies and we are testing the route in isolation, we do not need to check that the user has actually been created
            
              const response = await request(app).post(baseURL + "/users").send(inputUser)
              expect(response.status).toBe(200)
              expect(UserController.prototype.createUser).toHaveBeenCalled()
              expect(UserController.prototype.createUser).toHaveBeenCalledWith(inputUser.username, inputUser.name, inputUser.surname, inputUser.password, inputUser.role)
          })
      })
*/

/*
this.router.post(
            "/",
            body("username").isString().isLength({ min: 1 }),
            body("surname").isString().isLength({ min: 1 }),
            body("name").isString().isLength({ min: 1 }),
            body("password").isString().isLength({ min: 1 }),
            body("role").isString().isIn(["Manager", "Customer", "Admin"]),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => this.controller.createUser(req.body.username, req.body.name, req.body.surname, req.body.password, req.body.role)
                .then(() => res.status(200).end())
                .catch((err) => {
                    next(err)
                })
        )
*/