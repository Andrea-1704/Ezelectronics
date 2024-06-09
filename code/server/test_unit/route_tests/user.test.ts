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

const baseURL = "/ezelectronics/users";

// Mocking dependencies
jest.mock('../../src/routers/auth');
jest.mock('../../src/controllers/userController');
jest.mock('../../src/helper');

const customerUser = new User("customerUser", "FirstName", "LastName", Role.CUSTOMER, "Address", "2000-01-01");
const updatedUser = new User("updatedUser", "UpdatedName", "UpdatedSurname", Role.CUSTOMER, "UpdatedAddress", "2000-01-01");
const managerUser = new User("managerUser", "Manager", "User", Role.MANAGER, "Address", "2000-01-01");
const adminUser = new User("adminUser", "Admin", "User", Role.ADMIN, "Address", "2000-01-01");


// const login = async (user: User) => {
//
// }
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
  });

  describe("GET /users", () => {
    test("should allow admin to retrieve all users", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
      jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => next());
      jest.spyOn(UserController.prototype, "getUsers").mockResolvedValueOnce([customerUser]);

      const response = await request(app).get(baseURL).set("Cookie", "adminUserCookie");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([customerUser]);
    });

    test("should not allow non-admin users to retrieve all users", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
      jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => res.status(401).send());

      const response = await request(app).get(baseURL).set("Cookie", "managerUserCookie");

      expect(response.status).toBe(401);
    });
  });

  describe("GET /users/roles/:role", () => {
    test("should allow admin to retrieve users by role", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
      jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => next());
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
      jest.spyOn(UserController.prototype, "getUsersByRole").mockResolvedValueOnce([customerUser]);

      const response = await request(app).get(`${baseURL}/roles/Customer`).set("Cookie", "adminUserCookie");

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
        req.user = { username: "adminUser", role: Role.ADMIN };
        next();
      });

      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
      jest.spyOn(UserController.prototype, "getUserByUsername").mockResolvedValueOnce(managerUser);

      const response = await request(app).get(`${baseURL}/managerUser`).set("Cookie", "adminUserCookie");

      expect(response.status).toBe(200);
      expect(response.body.username).toBe(managerUser.username);
    });

    test("should allow users to retrieve their own data by username", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        req.user = { username: "customerUser" , role: Role.CUSTOMER};
        next();
      });
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
      jest.spyOn(UserController.prototype, "getUserByUsername").mockResolvedValueOnce(customerUser);

      const response = await request(app).get(`${baseURL}/customerUser`).set("Cookie", "customerUserCookie");

      expect(response.status).toBe(200);
      expect(response.body.username).toBe("customerUser");
    });

    test("should not allow users to retrieve data of other users", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        req.user = customerUser;
        req.params.username="managerUser";
        next();
      });

      jest.spyOn(Utility, 'isAdmin').mockReturnValue(false);
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
      jest.spyOn(UserController.prototype, "getUserByUsername").mockResolvedValueOnce(managerUser); // Optional, in caso il controllo venga fatto comunque

      const response = await request(app)
          .get(`${baseURL}/managerUser`)
          .set("Cookie", "customerUserCookie");

      expect(UserController.prototype.getUserByUsername).toHaveBeenCalledTimes(0);
      expect(response.status).toBe(401);
    });
  });

  describe("PATCH /users/:username", () => {
    test("should allow admin to update any user's data", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
      jest.spyOn(UserController.prototype, "updateUserInfo").mockResolvedValueOnce(updatedUser);

      const response = await request(app).patch(`${baseURL}/customerUser`).set("Cookie", "adminUserCookie").send(updatedUser);

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

      const response = await request(app).patch(`${baseURL}/customerUser`).set("Cookie", "customerUserCookie").send(updatedUser);

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

      const response = await request(app).patch(`${baseURL}/customerUser`).set("Cookie", "customerUserCookie").send({
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
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
          req.user = adminUser as User
          req.params.username = managerUser.username;
          next();
      })
      jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => next());
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
      jest.spyOn(UserController.prototype, "deleteUser").mockResolvedValueOnce(true);

      const response = await request(app).delete(`${baseURL}/managerUser`).set("Cookie", "adminUserCookie");

      expect(response.status).toBe(200);
      expect(UserController.prototype.deleteUser).toHaveBeenCalledWith("managerUser");
    });

    test("should not allow users to delete other users", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        req.user = { username: "customerUser" };
        next();
      });
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
      jest.spyOn(UserController.prototype, "deleteUser").mockRejectedValueOnce(new Error('Unauthorized'));

      const response = await request(app).delete(`${baseURL}/adminUser`).set("Cookie", "customerUserCookie");

      expect(response.status).toBe(401);
    });

    test("should allow users to delete their own data", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        req.user = { username: "customerUser" };
        next();
      });
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
      jest.spyOn(UserController.prototype, "deleteUser").mockResolvedValueOnce(true);

      const response = await request(app).delete(`${baseURL}/customerUser`).set("Cookie", "customerUserCookie");

      expect(response.status).toBe(200);
      expect(UserController.prototype.deleteUser).toHaveBeenCalledWith("customerUser");
    });
  });

  describe("DELETE /users", () => {
    test("should allow admin to delete all users", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
      jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => next());
      jest.spyOn(UserController.prototype, "deleteAll").mockResolvedValueOnce(true);

      const response = await request(app).delete(baseURL).set("Cookie", "adminUserCookie");

      expect(response.status).toBe(200);
    });

    test("should not allow non-admin users to delete all users", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
          req.user = { username: "customerUser", role: Role.CUSTOMER };
          next();
      })
      jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => res.status(401).send());

      const response = await request(app).delete(baseURL).set("Cookie", "customerUserCookie");

      expect(response.status).toBe(401);
    });
  });
});