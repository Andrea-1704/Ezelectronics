import { describe, test, expect, beforeAll, afterAll, jest } from "@jest/globals"

import UserController from "../../src/controllers/userController"
import UserDAO from "../../src/dao/userDAO"
// @ts-ignore
import crypto from "crypto"
import db from "../../src/db/db"
import { Database } from "sqlite3"
import {User} from "../../src/components/user";
import {UserNotFoundError} from "../../src/errors/userError";

jest.mock("crypto")
jest.mock("../../src/db/db.ts")

//Example of unit test for the createUser method
//It mocks the database run method to simulate a successful insertion and the crypto randomBytes and scrypt methods,
//to simulate the hashing of the password,
//It then calls the createUser method and expects it to resolve true

// test("It should resolve true", async () => {
//   const userDAO = new UserDAO()
//   const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
//     callback(null)
//     return {} as Database
//   });
//   const mockRandomBytes = jest.spyOn(crypto, "randomBytes").mockImplementation((size) => {
//     return (Buffer.from("salt"))
//   })
//   const mockScrypt = jest.spyOn(crypto, "scrypt").mockImplementation(async (password, salt, keylen) => {
//     return Buffer.from("hashedPassword")
//   })
//
//   const result = await userDAO.createUser("username", "name", "surname", "password", "role")
//   expect(result).toBe(true)
//   mockRandomBytes.mockRestore()
//   mockDBRun.mockRestore()
//   mockScrypt.mockRestore()
// })


//test to run for products
//register product
//test1. add product with all fields filled
//test2. add two products both with the same model the second one should fail
//test3. add product with invalid fileds (can be expanded into more tests)

//update quantity
//test1. update quantity and add to it, verify the new value is the sum of the previous + the added
//test2. try to do the same operating but with wrong product model, verify error (check other fields maybe the changeDate and verify the function)

//sell product
//test1. sell a product, verify the quantity is updated
//test2. sell a product with wrong model, verify error
//test3. sell a product with quantity 0, verify error
//test4. sell a product that has an available quantity non zero but less than the quantity to be sold, verify error


//view products
//test1. add products, view them and chefck if they are ok maybe do a count of the products thats easier
//test2. view products with no products, verify empty array
//test3. view products with invalid model, verify error
//add products of different categories, verify that the counts are correct

//delete product(s)
//what if the product is not found
//what if the stock is empty? (idk) no use case
//successfull deletion


//mixed tests
//test2 add a product, update the quantity, sell the product, view the product, delete the product, control count of products
