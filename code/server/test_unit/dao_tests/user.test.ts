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

test("It should resolve true", async () => {
    const userDAO = new UserDAO()
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(null)
        return {} as Database
    });
    const mockRandomBytes = jest.spyOn(crypto, "randomBytes").mockImplementation((size) => {
        return (Buffer.from("salt"))
    })
    const mockScrypt = jest.spyOn(crypto, "scrypt").mockImplementation(async (password, salt, keylen) => {
        return Buffer.from("hashedPassword")
    })
    const result = await userDAO.createUser("username", "name", "surname", "password", "role")
    expect(result).toBe(true)
    mockRandomBytes.mockRestore()
    mockDBRun.mockRestore()
    mockScrypt.mockRestore()

})

//to be checked whether these are to be written on dao layer or not
//test to be written:
//login
//setup
//creates user (any role)
//test1. try login with correct password verify true response
//test2. try login but with a different password verify error type
//test3. try login with a non-existent username, verify not found error
//test4. already logged IDK how to test this one actually login twice to see what happens


//logout
//setup
//creates user (any role)
//login
//test1. try logout, verify success
//test2. logout twice see what happens

//create account
//test1. successfully login, try out maybe with different roles
//test2. username already in user, verify error
//test3. empty parameters (although this should be checked on routes test and not here)


//view users'
//setup
//create a bunch of users with different roles
//login as admin/ or customer or manager
//test1 query a username that already exists verify the user data
//test2 query a username that does not exist and get error?
//customer/manager tests
//test1. try to see another user's info, should get error
//test2. try to see your own data, should verify the data
//test3. try to see the information of all users, should get not admin error
//test4. try to see information based on role, should get not admin error
//try
//admin
//test5 try to see information based on role that does not exist, get error saying which fields are correct or whatnot
//test6 get users by role, verify mocked users with the response
//test7 get the information of all users and verify it with the ones inserted


//delete one user
//setup1
//login as customer or manager
//test1.
// try to delete a username that is not yours get error
//test2.
// try to delete your own account get success verify it


//setup2 as admin
//test1 try to delete a username that is not admin, get success verify
//test2 try to delete non-existent username
//test3 try to delete a username associated to an admin and get error


