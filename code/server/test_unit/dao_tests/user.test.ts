import { test, expect, jest } from "@jest/globals"
import UserDAO from "../../src/dao/userDAO"
// @ts-ignore
import crypto from "crypto"
import {Database} from "sqlite3";
import db from "../../src/db/db";
import {Role, User} from "../../src/components/user";
import {UserAlreadyExistsError, UserNotFoundError} from "../../src/errors/userError";


jest.mock("crypto")
jest.mock("../../src/db/testdb.ts")

//Example of unit test for the createUser method
//It mocks the database run method to simulate a successful insertion and the crypto randomBytes and scrypt methods,
//to simulate the hashing of the password,
//It then calls the createUser method and expects it to resolve true

afterEach(() => {
    jest.restoreAllMocks();
});

describe("UserDAO unit tests", () => {
    const testUser = new User("username123", "FirstName", "LastName", Role.CUSTOMER, "Address", "2000-01-01");

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
    describe("getIsUserAuthenticated", () => {
        test("should authenticate user with correct credentials", async () => {
            const userDAO = new UserDAO();
            const plainPassword = "password";

            const salt = Buffer.from("salt");
            const hashedPasswordBuffer = Buffer.from("hashedPassword", "hex");

            // Correct mock implementation
            jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                const row = { username: testUser.username, password: hashedPasswordBuffer.toString("hex"), salt: salt.toString("hex") };
                callback(null, row);
                return db;
            });

            jest.spyOn(crypto, "scryptSync").mockImplementation((password, salt, keylen) => {
                return hashedPasswordBuffer;
            });

            const result = await userDAO.getIsUserAuthenticated(testUser.username, plainPassword);
            expect(result).toBe(true);
        });

        test("should not authenticate user with incorrect credentials", async () => {
            const userDAO = new UserDAO();
            const plainPassword = "password";
            const wrongPassword = "wrongpassword";

            const salt = Buffer.from("salt");
            const hashedPasswordBuffer = Buffer.from("hashedPassword", "hex");

            jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                const row = { username: testUser.username, password: hashedPasswordBuffer.toString("hex"), salt: salt.toString("hex") };
                callback(null, row);
                return db;
            });

            jest.spyOn(crypto, "scryptSync").mockImplementation((password, salt, keylen) => {
                return hashedPasswordBuffer;
            });

            const result = await userDAO.getIsUserAuthenticated(testUser.username, wrongPassword);
            expect(result).toBe(false);
        });
        test("should not authenticate user with non-existent username", async () => {
            const userDAO = new UserDAO();

            jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(null, null);
                return db;
            });

            const result = await userDAO.getIsUserAuthenticated("nonexistent", "password");
            expect(result).toBe(false);
        });
    });

    describe("createUser", () => {
        test("should create a new user successfully", async () => {
            const userDAO = new UserDAO();
            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                callback(null);
                return {} as Database;
            });
            const mockRandomBytes = jest.spyOn(crypto, "randomBytes").mockImplementation(() =>Buffer.from("salt"));
            const mockScryptSync = jest.spyOn(crypto, "scryptSync").mockReturnValue(Buffer.from("hashedPassword"));

            const result = await userDAO.createUser(testUser.username, testUser.name, testUser.surname, "password", testUser.role);
            expect(result).toBe(true);

            mockRandomBytes.mockRestore();
            mockDBRun.mockRestore();
            mockScryptSync.mockRestore();
        });

        test("should throw UserAlreadyExistsError if the username already exists", async () => {
            const userDAO = new UserDAO();
            jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                const error = new Error("UNIQUE constraint failed: users.username");
                callback(error);
                return db;
            });

            await expect(userDAO.createUser(testUser.username, testUser.name, testUser.surname, "password", testUser.role))
                .rejects
                .toThrow(UserAlreadyExistsError);
        });
    });

    describe("getUserByUsername", () => {
        test("should retrieve a user by username", async () => {
            const userDAO = new UserDAO();
            jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(null, testUser);
                return db;
            });

            const result = await userDAO.getUserByUsername(testUser.username);
            expect(result).toEqual(testUser);
        });

        test("should throw UserNotFoundError if the user does not exist", async () => {
            const userDAO = new UserDAO();
            jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(null, null);
                return db;
            });

            await expect(userDAO.getUserByUsername("nonexistent"))
                .rejects
                .toThrow(UserNotFoundError);
        });
    });

    describe("getUsers", () => {
        test("should retrieve all users", async () => {
            const userDAO = new UserDAO();
            const users = [testUser, new User("user2", "Second", "User", Role.MANAGER, "Address", "2000-02-02")];
            jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                callback(null, users);
                return db;
            });

            const result = await userDAO.getUsers();
            expect(result).toEqual(users);
        });
    });

    describe("getUsersByRole", () => {
        test("should retrieve users by role", async () => {
            const userDAO = new UserDAO();
            const users = [testUser];
            jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                callback(null, users);
                return db;
            });

            const result = await userDAO.getUsersByRole(testUser.role);
            expect(result).toEqual(users);
        });
    });

    describe("deleteUser", () => {
        test("should delete a user successfully", async () => {
            const userDAO = new UserDAO();
            jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                callback(null);
                return db;
            });

            const result = await userDAO.deleteUser(testUser.username);
            expect(result).toBe(true);
        });
    });

    describe("deleteAll", () => {
        test("should delete all non-admin users successfully", async () => {
            const userDAO = new UserDAO();
            jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                callback(null);
                return db;
            });

            const result = await userDAO.deleteAll();
            expect(result).toBe(true);
        });
    });

    describe("updateUserInfo", () => {
        test("should update user information successfully", async () => {
            const userDAO = new UserDAO();
            const updatedUser = new User(testUser.username, "UpdatedName", "UpdatedSurname", testUser.role, "UpdatedAddress", "2000-01-01");
            jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                callback(null);
                return db;
            });
            jest.spyOn(userDAO, "getUserByUsername").mockResolvedValueOnce(updatedUser);

            const result = await userDAO.updateUserInfo(updatedUser.name, updatedUser.surname, updatedUser.address, updatedUser.birthdate, updatedUser.username);
            expect(result).toEqual(updatedUser);
        });
    });
});

