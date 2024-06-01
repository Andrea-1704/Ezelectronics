import { describe, test, expect, beforeAll, afterAll, jest } from "@jest/globals"
import {User, Role} from "../../src/components/user";
import { Cart } from "../../src/components/cart";
import CartController from "../../src/controllers/cartController";
import Authenticator from "../../src/routers/auth";
import request from 'supertest';
import { app } from "../../index";
const baseURL = "/ezelectronics";

let testCustomer = new User("customer", "customer", "customer", Role.CUSTOMER, "", "")
let testCart = new Cart(0, "customer", false, "17-04-2002", 0, []);

jest.mock("../../src/controllers/cartController")
jest.mock("../../src/routers/auth")


describe("Route unit tests", () => {
  describe("GET /carts", () => {
    test("It returns the cart of the logged in user", async() => {
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
    }, 10000)
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


})

/*
this.router.get(
            "/",
            this.authService.isLoggedIn,
            this.authService.isAdmin,
            (req: any, res: any, next: any) => this.controller.getUsers()
                .then((users: any ) => res.status(200).json(users))
                .catch((err) => next(err))
        )
*/

/*
describe("Route unit tests", () => {
  describe("GET /users", () => {
        test("It returns an array of users", async () => {
            //The route we are testing calls the getUsers method of the UserController and the isAdmin method of the Authenticator
            //We mock the 'getUsers' method to return an array of users, because we are not testing the UserController logic here (we assume it works correctly)
            jest.spyOn(UserController.prototype, "getUsers").mockResolvedValueOnce([testAdmin, testCustomer])
            //We mock the 'isAdmin' method to return the next function, because we are not testing the Authenticator logic here (we assume it works correctly)
            jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => {
                return next();
            })

            //We send a request to the route we are testing. We are in a situation where:
            //  - The user is an Admin (= the Authenticator logic is mocked to be correct)
            //  - The getUsers function returns an array of users (= the UserController logic is mocked to be correct)
            //We expect the 'getUsers' function to have been called, the route to return a 200 success code and the expected array
            const response = await request(app).get(baseURL + "/users")
            expect(response.status).toBe(200)
            expect(UserController.prototype.getUsers).toHaveBeenCalled()
            expect(response.body).toEqual([testAdmin, testCustomer])
        })
*/

