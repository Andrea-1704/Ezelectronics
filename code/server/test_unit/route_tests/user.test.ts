import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
// @ts-ignore
import request from 'supertest';
import Authenticator from "../../src/routers/auth";
import ErrorHandler from "../../src/helper";
import UserController from "../../src/controllers/userController";
import { User, Role } from "../../src/components/user";
import { cleanup } from "../../src/db/cleanup";
import { app } from "../../index";
import { Utility } from "../../src/utilities";
import { UserNotAdminError } from "../../src/errors/userError";
import exp from 'constants';
import { isUndefined } from 'util';

const baseURLusers = "/ezelectronics/users";
const baseURLsessions = "/ezelectronics/sessions";

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

      const response = await request(app).post(baseURLusers).send({
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

      const response = await request(app).post(baseURLusers).send({
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

      const response = await request(app).post(baseURLusers).send({
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

      const response = await request(app).post(baseURLusers).send({
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

      const response = await request(app).post(baseURLusers).send({
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

      const response = await request(app).post(baseURLusers).send({
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

      const response = await request(app).post(baseURLusers).send({
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

      const response = await request(app).post(baseURLusers).send({
        username: "newUser",
        name: "New",
        surname: "User",
        password: "password",
        role: "Customer"
      });

      expect(response.status).toBe(422);
      expect(response.body.error).toBe("Validation Error");
    });

    describe("POST /users", () => {
      test("should create a new user successfully", async () => {
        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
        jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true);

        const response = await request(app).post(baseURLusers).send({
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

        const response = await request(app).post(baseURLusers).send({
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

        const response = await request(app).post(baseURLusers).send({
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

        const response = await request(app).post(baseURLusers).send({
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

        const response = await request(app).post(baseURLusers).send({
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

        const response = await request(app).post(baseURLusers).send({
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

        const response = await request(app).post(baseURLusers).send({
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

        const response = await request(app).post(baseURLusers).send({
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

    test("should return error for existing user", async () => {
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
      jest.spyOn(UserController.prototype, "createUser").mockRejectedValueOnce(new Error());
      const response = await request(app).post(baseURLusers).send({
        username: "newUser",
        name: "New",
        surname: "User",
        password: "password",
        role: "Customer"
      });
      expect(response.status).not.toBe(200);
      expect(response.body.error).toBe(undefined);
    });


  });


});

describe("GET /users", () => {
  test("should allow admin to retrieve all users", async () => {
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => next());
    jest.spyOn(UserController.prototype, "getUsers").mockResolvedValueOnce([customerUser]);

    const response = await request(app).get(baseURLusers)

    expect(response.status).toBe(200);
    expect(response.body).toEqual([customerUser]);
  });

  test("should not allow non-admin users to retrieve all users", async () => {
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => res.status(401).send());

    const response = await request(app).get(baseURLusers)

    expect(response.status).toBe(401);
  });

  test("should handle error", async () => {
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => next());
    jest.spyOn(UserController.prototype, "getUsers").mockRejectedValueOnce({});

    const response = await request(app).get(baseURLusers)

    expect(response.status).not.toBe(200);
    expect(response.body).toEqual({});
  });
});

describe("GET /users/roles/:role", () => {
  test("should allow admin to retrieve users by role", async () => {
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => next());
    jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
    jest.spyOn(UserController.prototype, "getUsersByRole").mockResolvedValueOnce([customerUser]);

    const response = await request(app).get(`${baseURLusers}/roles/Customer`)

    expect(response.status).toBe(200);
    expect(response.body).toEqual([customerUser]);
  });

  test("should return validation error for invalid role", async () => {
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => next());
    jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
      res.status(422).json({ error: "Validation Error" });
    });

    const response = await request(app).get(`${baseURLusers}/roles/InvalidRole`).set("Cookie", "adminUserCookie");

    expect(response.status).toBe(422);
    expect(response.body.error).toBe("Validation Error");
  });
  test("should allow admin to retrieve users by role", async () => {
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => next());
    jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
    jest.spyOn(UserController.prototype, "getUsersByRole").mockRejectedValueOnce({});

    const response = await request(app).get(`${baseURLusers}/roles/Customer`)

    expect(response.status).not.toBe(200);
    expect(response.body).toEqual({});
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

      const response = await request(app).get(`${baseURLusers}/managerUser`);

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

      const response = await request(app).get(`${baseURLusers}/customerUser`);

      expect(response.status).toBe(200);
      expect(response.body.username).toBe("customerUser");
    });


    test("should handle controller error", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        req.user = adminUser;
        next();
      });

      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
      jest.spyOn(UserController.prototype, "getUserByUsername").mockRejectedValueOnce(undefined);

      const response = await request(app).get(`${baseURLusers}/managerUser`);

      expect(response.status).not.toBe(200);
      expect(response.body.username).toBe(undefined);
    });



  });

  describe("PATCH /users/:username", () => {
    test("should allow admin to update any user's data", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
      jest.spyOn(UserController.prototype, "updateUserInfo").mockResolvedValueOnce(updatedUser);

      const response = await request(app).patch(`${baseURLusers}/customerUser`).send(updatedUser);

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

      const response = await request(app).patch(`${baseURLusers}/customerUser`).send(updatedUser);

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

      const response = await request(app).patch(`${baseURLusers}/customerUser`).send({
        name: "", // Missing name
        surname: "UpdatedSurname",
        address: "UpdatedAddress",
        birthdate: "InvalidDate" // Invalid birthdate
      });

      expect(response.status).toBe(422);
      expect(response.body.error).toBe("Validation Error");
    });



    test("should allow admin to update any user's data", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
      jest.spyOn(UserController.prototype, "updateUserInfo").mockResolvedValueOnce(updatedUser);

      const response = await request(app).patch(`${baseURLusers}/customerUser`).send(updatedUser);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("UpdatedName");
    });

    test("should handle controller error", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        req.user = adminUser;
        next();
      });
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
      jest.spyOn(UserController.prototype, "updateUserInfo").mockRejectedValueOnce(new Error("Controller error"));

      const response = await request(app)
        .patch(`${baseURLusers}/managerUser`)
        .send({
          name: "John",
          surname: "Doe",
          address: "123 Main St",
          birthdate: "1990-01-01"
        });

      expect(response.status).not.toBe(200);
      expect(response.body.username).toBeUndefined();
    });


  });

  describe("DELETE /users/:username", () => {
    test("should allow admin to delete any user", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
      jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => next());
      jest.spyOn(UserController.prototype, "deleteUser").mockResolvedValueOnce(true);

      const response = await request(app).delete(`${baseURLusers}/customerUser`);

      expect(response.status).toBe(200);
    });

    test("should allow users to delete their own account", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        req.user = { username: "customerUser" };
        next();
      });
      jest.spyOn(UserController.prototype, "deleteUser").mockResolvedValueOnce(true);

      const response = await request(app).delete(`${baseURLusers}/customerUser`);

      expect(response.status).toBe(200);
    });

    test("should not allow non-admin users to delete other users", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
      jest.spyOn(Utility, "isAdmin").mockReturnValue(false);
      //jest.spyOn(UserController.prototype, "deleteUser").mockImplementation(() => Promise.resolve(true));

      const response = await request(app).delete(`${baseURLusers}/managerUser`);

      expect(response.status).toBe(401);
    });





    test("should handle controller error", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
      jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => next());
      jest.spyOn(UserController.prototype, "deleteUser").mockRejectedValueOnce(false);

      const response = await request(app).delete(`${baseURLusers}/customerUser`);

      expect(response.status).not.toBe(200);
    });
  });

  describe("DELETE /users", () => {
    test("should allow admin to delete all users", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
      jest.spyOn(Utility, "isAdmin").mockReturnValue(true);
      jest.spyOn(UserController.prototype, "deleteAll").mockResolvedValueOnce(true);

      const response = await request(app).delete(baseURLusers);

      expect(response.status).toBe(200);
    });

    test("should not allow non-admin users to delete all users", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
      jest.spyOn(Utility, "isAdmin").mockReturnValue(false);

      const response = await request(app).delete(baseURLusers);

      expect(response.status).not.toBe(200);
    });

    test("should handle controller error", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
      jest.spyOn(Utility, "isAdmin").mockReturnValue(true);
      jest.spyOn(UserController.prototype, "deleteAll").mockRejectedValueOnce(new Error("Controller error"));

      const response = await request(app).delete(baseURLusers);

      expect(response.status).not.toBe(200);
    });
  });

});

describe('UserAuth unit tests', () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe("POST /", () => {
    test("should log in a user", async () => {
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
      jest.spyOn(Authenticator.prototype, "login").mockResolvedValueOnce(customerUser);

      const response = await request(app).post(baseURLsessions).send({
        username: "customerUser",
        password: "password"
      });
      expect(response.status).toBe(200);
      expect(Authenticator.prototype.login).toHaveBeenCalledWith("customerUser", "password");
    });

  });

  test("should return validation errors for missing fields", async () => {
    jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
      res.status(422).json({ error: "Validation Error" });
    });
    const response = await request(app).post(baseURLsessions).send({
      username: "customerUser",
      password: "password"
    });
    expect(response.status).toBe(422);
    expect(response.body.error).toBe("Validation Error");
  });

  test("should return validation error for invalid password", async () => {
    jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
      res.status(422).json({ error: "Validation Error" });
    });
    const response = await request(app).post(baseURLsessions).send({
      username: "customerUser",
      password: "short"
    });
    expect(response.status).toBe(422);
    expect(response.body.error).toBe("Validation Error");
  });
  test("should return validation error for invalid username", async () => {
    jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
      res.status(422).json({ error: "Validation Error" });
    });
    const response = await request(app).post(baseURLsessions).send({
      username: "newUser",
      password: "short"
    });
    expect(response.status).toBe(422);
    expect(response.body.error).toBe("Validation Error");
  });
  test("should handle authenticator error", async () => {
    jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, "login").mockRejectedValueOnce(undefined);

    const response = await request(app).post(baseURLsessions).send({
      username: "customerUser",
      password: "password"
    });
    expect(response.status).not.toBe(200);
  })

  describe("DELETE /sessions/current", () => {
    test("should log out the user successfully", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        req.user = { username: "loggedInUser" };
        next();
      });
      jest.spyOn(Authenticator.prototype, "logout").mockResolvedValueOnce(null);

      const response = await request(app).delete(`${baseURLsessions}/current`);

      expect(response.status).toBe(200);
      expect(Authenticator.prototype.logout).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.any(Function)
      );
    });

    test("should return an error if the user is not logged in", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        res.status(401).json({ error: "Not authenticated" });
      });

      const response = await request(app).delete(`${baseURLsessions}/current`);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Not authenticated");
    });

    test("should handle logout service error", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        req.user = { username: "loggedInUser" };
        next();
      });
      jest.spyOn(Authenticator.prototype, "logout").mockRejectedValueOnce(new Error("Internal Server Error"));

      const response = await request(app).delete(`${baseURLsessions}/current`);

      expect(response.status).not.toBe(200);
      expect(response.body.error).toBe(undefined);
    });
  });

  describe("GET /sessions/current", () => {
    test("should retrieve the currently logged in user", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        req.user = customerUser;
        next();
      });

      const response = await request(app).get(`${baseURLsessions}/current`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(customerUser);
    });

    test("should return an error if the user is not logged in", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        res.status(401).json({ error: "Not authenticated" });
      });

      const response = await request(app).get(`${baseURLsessions}/current`);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Not authenticated");
    });

    test("should handle unexpected errors", async () => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        next(new Error("Unexpected error"));
      });
  
      const response = await request(app).get(`${baseURLsessions}/current`);
  
      expect(response.status).toBe(500);
      expect(response.body.error).toBe(undefined);
    });

  });



});

