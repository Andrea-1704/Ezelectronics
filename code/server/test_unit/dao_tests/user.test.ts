import { describe, test, expect, jest, beforeEach } from "@jest/globals"
import UserDAO from "../../src/dao/userDAO"
// @ts-ignore
import crypto from "crypto"
import { UserAlreadyExistsError, UserNotFoundError } from "../../src/errors/userError";
import { setupDatabase, teardownDatabase, insertUser } from '../../src/db/testdb';


jest.mock("crypto")
jest.mock("../../src/db/testdb.ts")

//Example of unit test for the createUser method
//It mocks the database run method to simulate a successful insertion and the crypto randomBytes and scrypt methods,
//to simulate the hashing of the password,
//It then calls the createUser method and expects it to resolve true

// test("It should resolve true", async () => {
//     const userDAO = new UserDAO()
//     const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
//         callback(null)
//         return {} as Database
//     });
//     const mockRandomBytes = jest.spyOn(crypto, "randomBytes").mockImplementation((size) => {
//         return (Buffer.from("salt"))
//     })
//     const mockScrypt = jest.spyOn(crypto, "scrypt").mockImplementation(async (password, salt, keylen) => {
//         return Buffer.from("hashedPassword")
//     })
//     const result = await userDAO.createUser("username", "name", "surname", "password", "role")
//     expect(result).toBe(true)
//     mockRandomBytes.mockRestore()
//     mockDBRun.mockRestore()
//     mockScrypt.mockRestore()
//
// })


let dao : UserDAO;

beforeEach(async () => {
    await setupDatabase();
    dao = new UserDAO();
});

// afterEach(async () => {
//     await teardownDatabase();
// });

describe("UserDAO", () => {

    test("getIsUserAuthenticated - correct credentials", async () => {
        const user = {
            username: "test_user",
            name: "Test",
            surname: "User",
            role: "Manager",
            password: crypto.scryptSync("password", Buffer.from("salt", "utf8"), 16),
            salt: Buffer.from("salt", "utf8"),
            address: "Test Address",
            birthdate: "1990-01-01"
        };
        await insertUser(user);

        const isAuthenticated = await dao.getIsUserAuthenticated("test_user", "password");
        expect(isAuthenticated).toBe(true);
    });

    test("getIsUserAuthenticated - incorrect username", async () => {
        const isAuthenticated = await dao.getIsUserAuthenticated("wrong_user", "password");
        expect(isAuthenticated).toBe(false);
    });

    test("getIsUserAuthenticated - incorrect password", async () => {
        const user = {
            username: "test_user",
            name: "Test",
            surname: "User",
            role: "Manager",
            password: crypto.scryptSync("password", Buffer.from("salt", "utf8"), 16),
            salt: Buffer.from("salt", "utf8"),
            address: "Test Address",
            birthdate: "1990-01-01"
        };
        await insertUser(user);

        const isAuthenticated = await dao.getIsUserAuthenticated("test_user", "wrong_password");
        expect(isAuthenticated).toBe(false);
    });

    test("createUser - successful creation", async () => {
        const isCreated = await dao.createUser("test_user", "Test", "User", "password", "Manager");
        expect(isCreated).toBe(true);
    });

    test("createUser - user already exists", async () => {
        await dao.createUser("test_user", "Test", "User", "password", "Manager");

        await expect(dao.createUser("test_user", "Test", "User", "password", "Manager")).rejects.toThrow(UserAlreadyExistsError);
    });

    test("getUserByUsername - user exists", async () => {
        const user = {
            username: "test_user",
            name: "Test",
            surname: "User",
            role: "Manager",
            password: crypto.scryptSync("password", Buffer.from("salt", "utf8"), 16),
            salt: Buffer.from("salt", "utf8"),
            address: "Test Address",
            birthdate: "1990-01-01"
        };
        await insertUser(user);

        const fetchedUser = await dao.getUserByUsername("test_user");
        expect(fetchedUser.username).toBe(user.username);
        expect(fetchedUser.name).toBe(user.name);
    });

    test("getUserByUsername - user does not exist", async () => {
        await expect(dao.getUserByUsername("non_existent_user")).rejects.toThrow(UserNotFoundError);
    });

    test("getUsers - fetch all users", async () => {
        const user1 = {
            username: "test_user1",
            name: "Test1",
            surname: "User1",
            role: "Manager",
            password: crypto.scryptSync("password", Buffer.from("salt1", "utf8"), 16),
            salt: Buffer.from("salt1", "utf8"),
            address: "Test Address1",
            birthdate: "1990-01-01"
        };

        const user2 = {
            username: "test_user2",
            name: "Test2",
            surname: "User2",
            role: "Customer",
            password: crypto.scryptSync("password", Buffer.from("salt2", "utf8"), 16),
            salt: Buffer.from("salt2", "utf8"),
            address: "Test Address2",
            birthdate: "1992-01-01"
        };

        await insertUser(user1);
        await insertUser(user2);

        const users = await dao.getUsers();
        expect(users).toHaveLength(2);
    });

    test("getUsersByRole - fetch users by role", async () => {
        const user1 = {
            username: "test_user1",
            name: "Test1",
            surname: "User1",
            role: "Manager",
            password: crypto.scryptSync("password", Buffer.from("salt1", "utf8"), 16),
            salt: Buffer.from("salt1", "utf8"),
            address: "Test Address1",
            birthdate: "1990-01-01"
        };

        const user2 = {
            username: "test_user2",
            name: "Test2",
            surname: "User2",
            role: "Customer",
            password: crypto.scryptSync("password", Buffer.from("salt2", "utf8"), 16),
            salt: Buffer.from("salt2", "utf8"),
            address: "Test Address2",
            birthdate: "1992-01-01"
        };

        const user3 = {
            username: "test_user3",
            name: "Test3",
            surname: "User3",
            role: "Manager",
            password: crypto.scryptSync("password", Buffer.from("salt3", "utf8"), 16),
            salt: Buffer.from("salt3", "utf8"),
            address: "Test Address3",
            birthdate: "1993-01-01"
        };

        await insertUser(user1);
        await insertUser(user2);
        await insertUser(user3);

        const managers = await dao.getUsersByRole("Manager");
        expect(managers).toHaveLength(2);
        managers.forEach(user => expect(user.role).toBe("Manager"));

        const customers = await dao.getUsersByRole("Customer");
        expect(customers).toHaveLength(1);
        customers.forEach(user => expect(user.role).toBe("Customer"));
    });

    test("deleteUser - user is deleted successfully", async () => {
        const user = {
            username: "test_user",
            name: "Test",
            surname: "User",
            role: "Manager",
            password: crypto.scryptSync("password", Buffer.from("salt", "utf8"), 16),
            salt: Buffer.from("salt", "utf8"),
            address: "Test Address",
            birthdate: "1990-01-01"
        };
        await insertUser(user);

        const isDeleted = await dao.deleteUser("test_user");
        expect(isDeleted).toBe(true);

        await expect(dao.getUserByUsername("test_user")).rejects.toThrow(UserNotFoundError);
    });

    test("deleteAll - all non-admin users are deleted", async () => {
        const adminUser = {
            username: "admin_user",
            name: "Admin",
            surname: "User",
            role: "Admin",
            password: crypto.scryptSync("admin_password", Buffer.from("admin_salt", "utf8"), 16),
            salt: Buffer.from("admin_salt", "utf8"),
            address: "Admin Address",
            birthdate: "1985-01-01"
        };

        const managerUser = {
            username: "manager_user",
            name: "Manager",
            surname: "User",
            role: "Manager",
            password: crypto.scryptSync("password", Buffer.from("salt", "utf8"), 16),
            salt: Buffer.from("salt", "utf8"),
            address: "Manager Address",
            birthdate: "1990-01-01"
        };

        const customerUser = {
            username: "customer_user",
            name: "Customer",
            surname: "User",
            role: "Customer",
            password: crypto.scryptSync("password", Buffer.from("salt", "utf8"), 16),
            salt: Buffer.from("salt", "utf8"),
            address: "Customer Address",
            birthdate: "1990-01-01"
        };

        await insertUser(adminUser);
        await insertUser(managerUser);
        await insertUser(customerUser);

        const isDeleted = await dao.deleteAll();
        expect(isDeleted).toBe(true);

        const users = await dao.getUsers();
        expect(users).toHaveLength(1);
        expect(users[0].role).toBe("Admin");
    });

    test("updateUserInfo - update user information", async () => {
        const user = {
            username: "test_user",
            name: "Test",
            surname: "User",
            role: "Manager",
            password: crypto.scryptSync("password", Buffer.from("salt", "utf8"), 16),
            salt: Buffer.from("salt", "utf8"),
            address: "Test Address",
            birthdate: "1990-01-01"
        };
        await insertUser(user);

        const updatedUser = await dao.updateUserInfo("Updated Name", "Updated Surname", "Updated Address", "1990-01-02", "test_user");

        expect(updatedUser.name).toBe("Updated Name");
        expect(updatedUser.surname).toBe("Updated Surname");
        expect(updatedUser.address).toBe("Updated Address");
        expect(updatedUser.birthdate).toBe("1990-01-02");
    });

});
