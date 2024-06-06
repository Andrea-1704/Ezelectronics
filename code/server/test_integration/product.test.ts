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
  await db.run("DELETE FROM product"); // Clean product table

  // Insert test users
  await insertTestUser("adminUser", "Admin", "User", "adminPass", Role.ADMIN);
  await insertTestUser("managerUser", "Manager", "User", "managerPass", Role.MANAGER);
  await insertTestUser("customerUser", "Customer", "User", "customerPass", Role.CUSTOMER);
});

afterAll(async () => {
  await db.run("DELETE FROM users"); // Clean up users table
  await db.run("DELETE FROM product"); // Clean up products table
});

describe("Product API Integration Tests", () => {
  let adminCookie: any, managerCookie: any, customerCookie: any;

  beforeAll(async () => {
    // Login users and save cookies
    adminCookie = await loginUser("adminUser", "adminPass");
    managerCookie = await loginUser("managerUser", "managerPass");
    customerCookie = await loginUser("customerUser", "customerPass");
  });

  describe("POST /ezelectronics/products", () => {
    test("should allow admin to register a product", async () => {
      const response = await request(app)
          .post(`${baseURL}/products`)
          .set("Cookie", adminCookie)
          .send({
            model: "iPhone 13",
            category: "Smartphone",
            quantity: 100,
            details: "Latest model",
            sellingPrice: 999.99,
            arrivalDate: "2022-01-01"
          });

      expect(response.status).toBe(200);
    });

    test("should allow manager to register a product", async () => {
      const response = await request(app)
          .post(`${baseURL}/products`)
          .set("Cookie", managerCookie)
          .send({
            model: "Galaxy S21",
            category: "Smartphone",
            quantity: 50,
            details: "Top-notch model",
            sellingPrice: 799.99,
            arrivalDate: "2022-02-01"
          });

      expect(response.status).toBe(200);
    });

    test("should not allow customer to register a product", async () => {
      const response = await request(app)
          .post(`${baseURL}/products`)
          .set("Cookie", customerCookie)
          .send({
            model: "MacBook Pro",
            category: "Laptop",
            quantity: 10,
            details: "Latest model",
            sellingPrice: 1299.99,
            arrivalDate: "2022-03-01"
          });

      expect(response.status).toBe(401); // Assuming 403 Forbidden for unauthorized access
    });
  });

  describe("PATCH /ezelectronics/products/:model", () => {
    test("should allow admin to increase product quantity", async () => {
      const response = await request(app)
          .patch(`${baseURL}/products/iPhone 13`)
          .set("Cookie", adminCookie)
          .send({ quantity: 50, changeDate: "2022-04-01" });

      expect(response.status).toBe(200);
    });

    test("should allow manager to increase product quantity", async () => {
      const response = await request(app)
          .patch(`${baseURL}/products/Galaxy S21`)
          .set("Cookie", managerCookie)
          .send({ quantity: 30, changeDate: "2022-04-02" });

      expect(response.status).toBe(200);
    });

    test("should not allow customer to increase product quantity", async () => {
      const response = await request(app)
          .patch(`${baseURL}/products/MacBook Pro`)
          .set("Cookie", customerCookie)
          .send({ quantity: 10, changeDate: "2022-04-03" });

      expect(response.status).toBe(401); // Assuming 403 Forbidden for unauthorized access
    });
  });

  describe("DELETE /ezelectronics/products/:model", () => {
    test("should allow admin to delete a product", async () => {
      const response = await request(app)
          .delete(`${baseURL}/products/iPhone 13`)
          .set("Cookie", adminCookie);

      expect(response.status).toBe(200);
    });

    test("should allow manager to delete a product", async () => {
      const response = await request(app)
          .delete(`${baseURL}/products/Galaxy S21`)
          .set("Cookie", managerCookie);

      expect(response.status).toBe(200);
    });

    test("should not allow customer to delete a product", async () => {
      const response = await request(app)
          .delete(`${baseURL}/products/MacBook Pro`)
          .set("Cookie", customerCookie);

      expect(response.status).toBe(401); // Assuming 403 Forbidden for unauthorized access
    });
  });

  describe("GET /ezelectronics/products", () => {
    test("should allow admin to get all products", async () => {
      const response = await request(app)
          .get(`${baseURL}/products`)
          .set("Cookie", adminCookie);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    test("should allow manager to get all products", async () => {
      const response = await request(app)
          .get(`${baseURL}/products`)
          .set("Cookie", managerCookie);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    test("should not allow customer to get all products", async () => {
      const response = await request(app)
          .get(`${baseURL}/products`)
          .set("Cookie", customerCookie);

      expect(response.status).toBe(401); // Assuming 403 Forbidden for unauthorized access
    });
  });
});