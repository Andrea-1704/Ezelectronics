// @ts-ignore
import request from 'supertest';
import db from "../src/db/db";
import { app } from "../index";
import UserDAO from "../src/dao/userDAO";
import { User, Role } from "../src/components/user";

const baseURL = "/ezelectronics";

// Function to insert test users into the database
const insertTestUser = async (username: string, name: string, surname: string, password: string, role: string) => {
  const userDAO = new UserDAO();
  await userDAO.createUser(username, name, surname, password, role);
};

// Function to log in a user and retrieve the session cookie
const loginUser = async (username: string, password: string) => {
  const response = await request(app)
      .post(`${baseURL}/sessions`)
      .send({ username, password });

  return response.header['set-cookie'][0];
};

beforeAll(async () => {
  await db.run("DELETE FROM users"); // Clean users table

  // Insert test users
  await insertTestUser("adminUser", "Admin", "User", "adminPass", Role.ADMIN);
  await insertTestUser("managerUser", "Manager", "User", "managerPass", Role.MANAGER);
  await insertTestUser("customerUser", "Customer", "User", "customerPass", Role.CUSTOMER);
});

afterAll(async () => {
  await db.run("DELETE FROM users"); // Clean up users table
});

describe("User API Integration Tests", () => {
  let adminCookie: any, managerCookie: any, customerCookie: any;

  beforeAll(async () => {
    // Login users and save cookies
    adminCookie = await loginUser("adminUser", "adminPass");
    managerCookie = await loginUser("managerUser", "managerPass");
    customerCookie = await loginUser("customerUser", "customerPass");
  });

  describe("POST /ezelectronics/users", () => {
    test("should create a new user successfully", async () => {
      const response = await request(app)
          .post(`${baseURL}/users`)
          .send({
            username: "newUser",
            name: "New",
            surname: "User",
            password: "password",
            role: "Customer"
          });

      expect(response.status).toBe(200);
    });

    test("should return validation errors for missing fields", async () => {
      const response = await request(app)
          .post(`${baseURL}/users`)
          .send({
            username: "", // Missing username
            name: "New",
            surname: "User",
            password: "password",
            role: "Customer"
          });

      expect(response.status).toBe(422); // Validation Error
    });
  });

  describe("GET /ezelectronics/users", () => {
    test("should allow admin to retrieve all users", async () => {
      const response = await request(app)
          .get(`${baseURL}/users`)
          .set("Cookie", adminCookie);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    test("should not allow manager to retrieve all users", async () => {
      const response = await request(app)
          .get(`${baseURL}/users`)
          .set("Cookie", managerCookie);

      expect(response.status).toBe(401); // Unauthorized Error
    });

    test("should not allow customer to retrieve all users", async () => {
      const response = await request(app)
          .get(`${baseURL}/users`)
          .set("Cookie", customerCookie);

      expect(response.status).toBe(401); // Unauthorized Error
    });
  });

  describe("GET /ezelectronics/users/roles/:role", () => {
    test("should allow admin to retrieve users by role", async () => {
      const response = await request(app)
          .get(`${baseURL}/users/roles/Customer`)
          .set("Cookie", adminCookie);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    test("should return validation error for invalid role", async () => {
      const response = await request(app)
          .get(`${baseURL}/users/roles/InvalidRole`)
          .set("Cookie", adminCookie);

      expect(response.status).toBe(422); // Validation Error
    });
  });

  describe("GET /ezelectronics/users/:username", () => {
    test("should allow admin to retrieve any user by username", async () => {
      const response = await request(app)
          .get(`${baseURL}/users/managerUser`)
          .set("Cookie", adminCookie);

      expect(response.status).toBe(200);
      expect(response.body.username).toBe("managerUser");
    });

    test("should allow users to retrieve their own data by username", async () => {
      const response = await request(app)
          .get(`${baseURL}/users/customerUser`)
          .set("Cookie", customerCookie);

      expect(response.status).toBe(200);
      expect(response.body.username).toBe("customerUser");
    });

    test("should not allow users to retrieve data of other users", async () => {
      const response = await request(app)
          .get(`${baseURL}/users/managerUser`)
          .set("Cookie", customerCookie);

      expect(response.status).toBe(401); // Unauthorized Error
    });
  });

  describe("PATCH /ezelectronics/users/:username", () => {
    test("should allow admin to update any user's data", async () => {
      const response = await request(app)
          .patch(`${baseURL}/users/customerUser`)
          .set("Cookie", adminCookie)
          .send({
            name: "UpdatedName",
            surname: "UpdatedSurname",
            address: "UpdatedAddress",
            birthdate: "2000-01-01"
          });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("UpdatedName");
    });

    test("should allow users to update their own data", async () => {
      const response = await request(app)
          .patch(`${baseURL}/users/customerUser`)
          .set("Cookie", customerCookie)
          .send({
            name: "CustomerNewName",
            surname: "CustomerNewSurname",
            address: "CustomerNewAddress",
            birthdate: "2000-02-02"
          });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("CustomerNewName");
    });

    test("should not allow users to update data of other users", async () => {
      const response = await request(app)
          .patch(`${baseURL}/users/managerUser`)
          .set("Cookie", customerCookie)
          .send({
            name: "UpdatedName",
            surname: "UpdatedSurname",
            address: "UpdatedAddress",
            birthdate: "2000-01-01"
          });

      expect(response.status).toBe(401); // Unauthorized Error
    });

    test("should return validation error for invalid data", async () => {
      const response = await request(app)
          .patch(`${baseURL}/users/customerUser`)
          .set("Cookie", customerCookie)
          .send({
            name: "", // Missing name
            surname: "UpdatedSurname",
            address: "UpdatedAddress",
            birthdate: "InvalidDate" // Invalid birthdate
          });

      expect(response.status).toBe(422); // Validation Error
    });
  });

  describe("DELETE /ezelectronics/users/:username", () => {
    test("should allow admin to delete any user", async () => {
      const response = await request(app)
          .delete(`${baseURL}/users/managerUser`)
          .set("Cookie", adminCookie);

      expect(response.status).toBe(200);
    });

    test("should not allow users to delete other users", async () => {
      const response = await request(app)
          .delete(`${baseURL}/users/adminUser`)
          .set("Cookie", customerCookie);

      expect(response.status).toBe(401); // Unauthorized Error
    });

    test("should allow users to delete their own data", async () => {
      const response = await request(app)
          .delete(`${baseURL}/users/customerUser`)
          .set("Cookie", customerCookie);

      expect(response.status).toBe(200);
    });
  });

  describe("DELETE /ezelectronics/users", () => {
    test("should allow admin to delete all users", async () => {
      const response = await request(app)
          .delete(`${baseURL}/users`)
          .set("Cookie", adminCookie);

      expect(response.status).toBe(200);
    });

    test("should not allow non-admin users to delete all users", async () => {
      const response = await request(app)
          .delete(`${baseURL}/users`)
          .set("Cookie", customerCookie);

      expect(response.status).toBe(401); // Unauthorized Error
    });
  });
});