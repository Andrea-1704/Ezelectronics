import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
// @ts-ignore
import request from 'supertest';
import Authenticator from "../../src/routers/auth";
import ErrorHandler from "../../src/helper";
import UserController from "../../src/controllers/userController";
import { User, Role } from "../../src/components/user";
import { cleanup } from "../../src/db/cleanup";
import { app } from "../../index";
import {Utility} from "../../src/utilities";
import {UserNotAdminError} from "../../src/errors/userError";

const baseURL = "/ezelectronics/users";

// Mocking dependencies
jest.mock('../../src/routers/auth');
jest.mock('../../src/controllers/userController');
jest.mock('../../src/helper');

const customerUser = new User("customerUser", "FirstName", "LastName", Role.CUSTOMER, "Address", "2000-01-01");
const updatedUser = new User("updatedUser", "UpdatedName", "UpdatedSurname", Role.CUSTOMER, "UpdatedAddress", "2000-01-01");
const managerUser = new User("managerUser", "Manager", "User", Role.MANAGER, "Address", "2000-01-01");
const adminUser = new User("adminUser", "Admin", "User", Role.ADMIN, "Address", "2000-01-01");


describe('UserRoutes unit tests', () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe("POST /users", () => {
    test("should create a new user successfully", async () => {
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
      jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true);

      const response = await request(app).post(baseURL).send({
        username: "newUser",
        name: "New",
        surname: "User",
        password: "password",
        role: "Customer"
      });

      expect(response.status).toBe(200);
      expect(UserController.prototype.createUser).toHaveBeenCalledWith(
          "newUser",
          "New",
          "User",
          "password",
          "Customer"
      );
    });

    test("should return error for existing user", async () => {
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
      jest.spyOn(UserController.prototype, "createUser").mockRejectedValueOnce(new Error("User already exists"));

      const response = await request(app).post(baseURL).send({
        username: "newUser",
        name: "New",
        surname: "User",
        password: "password",
        role: "Customer"
      });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe("User already exists");
    });

    test("should return validation errors for missing fields", async () => {
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
        res.status(422).json({ error: "Validation Error" });
      });

      const response = await request(app).post(baseURL).send({
        username: "", // Missing username
        name: "New",
        surname: "User",
        password: "password",
        role: "Customer"
      });

      expect(response.status).toBe(422);
      expect(response.body.error).toBe("Validation Error");
    });

    test("should return validation errors for invalid role", async () => {
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
        res.status(422).json({ error: "Validation Error" });
      });

      const response = await request(app).post(baseURL).send({
        username: "newUser",
        name: "New",
        surname: "User",
        password: "password",
        role: "InvalidRole"
      });

      expect(response.status).toBe(422);
      expect(response.body.error).toBe("Validation Error");
    });

    test("should return validation errors for invalid date", async () => {
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
        res.status(422).json({ error: "Validation Error" });
      });

      const response = await request(app).post(baseURL).send({
        username: "newUser",
        name: "New",
        surname: "User",
        password: "password",
        role: "Customer",
        birthdate: "InvalidDate"
      });

      expect(response.status).toBe(422);
      expect(response.body.error).toBe("Validation Error");
    });

    test("should return validation errors for invalid password", async () => {
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
        res.status(422).json({ error: "Validation Error" });
      });

      const response = await request(app).post(baseURL).send({
        username: "newUser",
        name: "New",
        surname: "User",
        password: "short",
        role: "Customer"
      });

      expect(response.status).toBe(422);
      expect(response.body.error).toBe("Validation Error");
    });

    test("should return validation errors for invalid username", async () => {
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
        res.status(422).json({ error: "Validation Error" });
      });

      const response = await request(app).post(baseURL).send({
        username: "newUser",
        name: "New",
        surname: "User",
        password: "password",
        role: "Customer"
      });

      expect(response.status).toBe(422);
      expect(response.body.error).toBe("Validation Error");
    });

    test("should return validation errors for invalid name", async () => {
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
        res.status(422).json({ error: "Validation Error" });
      });

      const response = await request(app).post(baseURL).send({
        username: "newUser",
        name: "New",
        surname: "User",
        password: "password",
        role: "Customer"
      });

      expect(response.status).toBe(422);
      expect(response.body.error).toBe("Validation Error");
    });

    test("should return validation errors for invalid surname", async () => {
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
        res.status(422).json({ error: "Validation Error" });
      });

      const response = await request(app).post(baseURL).send({
        username: "newUser",
        name: "New",
        surname: "User",
        password: "password",
        role: "Customer"
      });

      expect(response.status).toBe(422);
      expect(response.body.error).toBe("Validation Error");
    });
  });

  describe("GET /users", () => {
    test("should allow admin to retrieve all users", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
      jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => next());
      jest.spyOn(UserController.prototype, "getUsers").mockResolvedValueOnce([customerUser]);

      const response = await request(app).get(baseURL)

      expect(response.status).toBe(200);
      expect(response.body).toEqual([customerUser]);
    });

    test("should not allow non-admin users to retrieve all users", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
      jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => res.status(401).send());

      const response = await request(app).get(baseURL)

      expect(response.status).toBe(401);
    });
  });

  describe("GET /users/roles/:role", () => {
    test("should allow admin to retrieve users by role", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
      jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => next());
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
      jest.spyOn(UserController.prototype, "getUsersByRole").mockResolvedValueOnce([customerUser]);

      const response = await request(app).get(`${baseURL}/roles/Customer`)

      expect(response.status).toBe(200);
      expect(response.body).toEqual([customerUser]);
    });

    test("should return validation error for invalid role", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
      jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => next());
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
        res.status(422).json({ error: "Validation Error" });
      });

      const response = await request(app).get(`${baseURL}/roles/InvalidRole`).set("Cookie", "adminUserCookie");

      expect(response.status).toBe(422);
      expect(response.body.error).toBe("Validation Error");
    });
  });

  describe("GET /users/:username", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test("should allow admin to retrieve any user by username", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        req.user = adminUser;
        next();
      });

      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
      jest.spyOn(UserController.prototype, "getUserByUsername").mockResolvedValueOnce(managerUser);

      const response = await request(app).get(`${baseURL}/managerUser`);

      expect(response.status).toBe(200);
      expect(response.body.username).toBe(managerUser.username);
    });

    test("should allow users to retrieve their own data by username", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        req.user = customerUser;
        next();
      });

      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
      jest.spyOn(UserController.prototype, "getUserByUsername").mockResolvedValueOnce(customerUser);

      const response = await request(app).get(`${baseURL}/customerUser`);

      expect(response.status).toBe(200);
      expect(response.body.username).toBe("customerUser");
    });

    test("should not allow non-admin users to retrieve other users' data", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        req.user = customerUser;
        next();
      });


      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
      jest.spyOn(UserController.prototype, "getUserByUsername").mockResolvedValueOnce(managerUser);


      const response = await request(app).get(`${baseURL}/managerUser`);

      //expect controller to be called 0 times.
      expect(UserController.prototype.getUserByUsername).toHaveBeenCalledTimes(0);
      expect(response.status).toBe(401);
    });
  });

  describe("PATCH /users/:username", () => {
    test("should allow admin to update any user's data", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
      jest.spyOn(UserController.prototype, "updateUserInfo").mockResolvedValueOnce(updatedUser);

      const response = await request(app).patch(`${baseURL}/customerUser`).send(updatedUser);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("UpdatedName");
    });

    test("should allow users to update their own data", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        req.user = { username: "customerUser" };
        next();
      });
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
      jest.spyOn(UserController.prototype, "updateUserInfo").mockResolvedValueOnce(updatedUser);

      const response = await request(app).patch(`${baseURL}/customerUser`).send(updatedUser);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("UpdatedName");
    });

    test("should return validation error for invalid data", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        req.user = { username: "customerUser" };
        next();
      });
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
        res.status(422).json({ error: "Validation Error" });
      });

      const response = await request(app).patch(`${baseURL}/customerUser`).send({
        name: "", // Missing name
        surname: "UpdatedSurname",
        address: "UpdatedAddress",
        birthdate: "InvalidDate" // Invalid birthdate
      });

      expect(response.status).toBe(422);
      expect(response.body.error).toBe("Validation Error");
    });
  });

  describe("DELETE /users/:username", () => {
    test("should allow admin to delete any user", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
      jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => next());
      jest.spyOn(UserController.prototype, "deleteUser").mockResolvedValueOnce(true);

      const response = await request(app).delete(`${baseURL}/customerUser`);

      expect(response.status).toBe(200);
    });

    test("should allow users to delete their own account", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        req.user = { username: "customerUser" };
        next();
      });
      jest.spyOn(UserController.prototype, "deleteUser").mockResolvedValueOnce(true);

      const response = await request(app).delete(`${baseURL}/customerUser`);

      expect(response.status).toBe(200);
    });

    test("should not allow non-admin users to delete other users", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        req.user = { username: "customerUser" };
        next();
      });

      const response = await request(app).delete(`${baseURL}/managerUser`);

      expect(response.status).toBe(401);
    });
  });

  describe("DELETE /users", () => {
    test("should allow admin to delete all users", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
      jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => next());
      jest.spyOn(UserController.prototype, "deleteAll").mockResolvedValueOnce(true);

      const response = await request(app).delete(baseURL)

      expect(response.status).toBe(200);
    });

    test("should not allow non-admin users to delete all users", async () => {
    });
  });
});