import { test, expect, jest, beforeEach, afterEach } from "@jest/globals"
import request from 'supertest'
const baseURL = "/ezelectronics"
import db, {createTables, deleteAllData}  from "../src/db/db"
import exp from "node:constants"


//add a review
test("should delete a product from a cart", async () => {
    deleteAllData();
    createTables();

    // First, create a manager account
    const manager = {
        username: "manager",
        name: "manager",
        surname: "manager",
        password: "manager",
        role: "Manager"
    }

    const managerRegisterResponse = await request('http://localhost:3001')
        .post(`${baseURL}/users`)
        .send(manager);

    // Check that the manager account was created successfully
    expect(managerRegisterResponse.status).toBe(200);

    // Then, authenticate and get a token for the manager
    const managerLoginResponse = await request('http://localhost:3001')
        .post(`${baseURL}/sessions`)
        .send({ username: manager.username, password: manager.password });

    const managerCookie = managerLoginResponse.headers['set-cookie'];

    const product = {
        model: 'model',
        category: 'Smartphone',
        sellingPrice: 100,
        arrivalDate: '2022-01-01',
        details: 'Details about the product',
        quantity: 10
    }

    // Manager adds the product
    const addProductResponse = await request('http://localhost:3001')
        .post(`${baseURL}/products`)
        .set('Cookie', managerCookie)
        .send(product);

    expect(addProductResponse.status).toBe(200);

    // Create a customer account
    const customer = {
        username: "customer",
        name: "customer",
        surname: "customer",
        password: "customer",
        role: "Customer"
    }

    const customerRegisterResponse = await request('http://localhost:3001')
        .post(`${baseURL}/users`)
        .send(customer);
        // Check that the customer account was created successfully
    expect(customerRegisterResponse.status).toBe(200);

    // Then, authenticate and get a token for the customer
    const customerLoginResponse = await request('http://localhost:3001')
        .post(`${baseURL}/sessions`)
        .send({ username: customer.username, password: customer.password });

    const customerCookie = customerLoginResponse.headers['set-cookie'];

    // Customer adds the product to the cart
    const addToCartResponse = await request('http://localhost:3001')
        .post(`${baseURL}/carts`)
        .set('Cookie', customerCookie)
        .send({ model: product.model });

    expect(addToCartResponse.status).toBe(200);

    // Customer pays for the cart
    const payCartResponse = await request('http://localhost:3001')
        .patch(`${baseURL}/carts/`)
        .set('Cookie', customerCookie);
    expect(payCartResponse.status).toBe(200);

    // Customer adds a review for the product
    const review = {
        score: 5,
        comment: 'Great product'
    }

    // Customer add a review
    const addReview = await request('http://localhost:3001')
        .post(`${baseURL}/reviews/${product.model}`)
        .set('Cookie', customerCookie)
        .send(review);
    expect(addReview.status).toBe(200);

    deleteAllData();
});

//get the reviews of a product
test("should delete a product from a cart", async () => {
    deleteAllData();
    createTables();

    // First, create a manager account
    const manager = {
        username: "manager",
        name: "manager",
        surname: "manager",
        password: "manager",
        role: "Manager"
    }

    const managerRegisterResponse = await request('http://localhost:3001')
        .post(`${baseURL}/users`)
        .send(manager);

    // Check that the manager account was created successfully
    expect(managerRegisterResponse.status).toBe(200);

    // Then, authenticate and get a token for the manager
    const managerLoginResponse = await request('http://localhost:3001')
        .post(`${baseURL}/sessions`)
        .send({ username: manager.username, password: manager.password });

    const managerCookie = managerLoginResponse.headers['set-cookie'];

    const product = {
        model: 'model',
        category: 'Smartphone',
        sellingPrice: 100,
        arrivalDate: '2022-01-01',
        details: 'Details about the product',
        quantity: 10
    }

    // Manager adds the product
    const addProductResponse = await request('http://localhost:3001')
        .post(`${baseURL}/products`)
        .set('Cookie', managerCookie)
        .send(product);

    expect(addProductResponse.status).toBe(200);

    // Create a customer account
    const customer = {
        username: "customer",
        name: "customer",
        surname: "customer",
        password: "customer",
        role: "Customer"
    }

    const customerRegisterResponse = await request('http://localhost:3001')
        .post(`${baseURL}/users`)
        .send(customer);
        // Check that the customer account was created successfully
    expect(customerRegisterResponse.status).toBe(200);

    // Then, authenticate and get a token for the customer
    const customerLoginResponse = await request('http://localhost:3001')
        .post(`${baseURL}/sessions`)
        .send({ username: customer.username, password: customer.password });

    const customerCookie = customerLoginResponse.headers['set-cookie'];

    // Customer adds the product to the cart
    const addToCartResponse = await request('http://localhost:3001')
        .post(`${baseURL}/carts`)
        .set('Cookie', customerCookie)
        .send({ model: product.model });

    expect(addToCartResponse.status).toBe(200);

    // Customer pays for the cart
    const payCartResponse = await request('http://localhost:3001')
        .patch(`${baseURL}/carts/`)
        .set('Cookie', customerCookie);
    expect(payCartResponse.status).toBe(200);

    // Customer adds a review for the product
    const review = {
        score: 5,
        comment: 'Great product'
    }

    // Customer add a review
    const addReview = await request('http://localhost:3001')
        .post(`${baseURL}/reviews/${product.model}`)
        .set('Cookie', customerCookie)
        .send(review);
    expect(addReview.status).toBe(200);

    //get all the review of a model:
    const getReview = await request('http://localhost:3001')
        .get(`${baseURL}/reviews/${product.model}`)
        .set('Cookie', customerCookie)
    expect(getReview.status).toBe(200);

    deleteAllData();
});

//delete a review
test("should delete a product from a cart", async () => {
    deleteAllData();
    createTables();

    // First, create a manager account
    const manager = {
        username: "manager",
        name: "manager",
        surname: "manager",
        password: "manager",
        role: "Manager"
    }

    const managerRegisterResponse = await request('http://localhost:3001')
        .post(`${baseURL}/users`)
        .send(manager);

    // Check that the manager account was created successfully
    expect(managerRegisterResponse.status).toBe(200);

    // Then, authenticate and get a token for the manager
    const managerLoginResponse = await request('http://localhost:3001')
        .post(`${baseURL}/sessions`)
        .send({ username: manager.username, password: manager.password });

    const managerCookie = managerLoginResponse.headers['set-cookie'];

    const product = {
        model: 'model',
        category: 'Smartphone',
        sellingPrice: 100,
        arrivalDate: '2022-01-01',
        details: 'Details about the product',
        quantity: 10
    }

    // Manager adds the product
    const addProductResponse = await request('http://localhost:3001')
        .post(`${baseURL}/products`)
        .set('Cookie', managerCookie)
        .send(product);

    expect(addProductResponse.status).toBe(200);

    // Create a customer account
    const customer = {
        username: "customer",
        name: "customer",
        surname: "customer",
        password: "customer",
        role: "Customer"
    }

    const customerRegisterResponse = await request('http://localhost:3001')
        .post(`${baseURL}/users`)
        .send(customer);
        // Check that the customer account was created successfully
    expect(customerRegisterResponse.status).toBe(200);

    // Then, authenticate and get a token for the customer
    const customerLoginResponse = await request('http://localhost:3001')
        .post(`${baseURL}/sessions`)
        .send({ username: customer.username, password: customer.password });

    const customerCookie = customerLoginResponse.headers['set-cookie'];

    // Customer adds the product to the cart
    const addToCartResponse = await request('http://localhost:3001')
        .post(`${baseURL}/carts`)
        .set('Cookie', customerCookie)
        .send({ model: product.model });

    expect(addToCartResponse.status).toBe(200);

    // Customer pays for the cart
    const payCartResponse = await request('http://localhost:3001')
        .patch(`${baseURL}/carts/`)
        .set('Cookie', customerCookie);
    expect(payCartResponse.status).toBe(200);

    // Customer adds a review for the product
    const review = {
        score: 5,
        comment: 'Great product'
    }

    // Customer add a review
    const addReview = await request('http://localhost:3001')
        .post(`${baseURL}/reviews/${product.model}`)
        .set('Cookie', customerCookie)
        .send(review);
    expect(addReview.status).toBe(200);

    //get all the review of a model:
    const deleteReview = await request('http://localhost:3001')
        .delete(`${baseURL}/reviews/${product.model}`)
        .set('Cookie', customerCookie)
    expect(deleteReview.status).toBe(200);

    deleteAllData();
});


//delete all review:
test("should delete a product from a cart", async () => {
    deleteAllData();
    createTables();

    // First, create a manager account
    const manager = {
        username: "manager",
        name: "manager",
        surname: "manager",
        password: "manager",
        role: "Manager"
    }

    const managerRegisterResponse = await request('http://localhost:3001')
        .post(`${baseURL}/users`)
        .send(manager);

    // Check that the manager account was created successfully
    expect(managerRegisterResponse.status).toBe(200);

    // Then, authenticate and get a token for the manager
    const managerLoginResponse = await request('http://localhost:3001')
        .post(`${baseURL}/sessions`)
        .send({ username: manager.username, password: manager.password });

    const managerCookie = managerLoginResponse.headers['set-cookie'];

    const product = {
        model: 'model',
        category: 'Smartphone',
        sellingPrice: 100,
        arrivalDate: '2022-01-01',
        details: 'Details about the product',
        quantity: 10
    }

    // Manager adds the product
    const addProductResponse = await request('http://localhost:3001')
        .post(`${baseURL}/products`)
        .set('Cookie', managerCookie)
        .send(product);

    expect(addProductResponse.status).toBe(200);

    // Create a customer account
    const customer = {
        username: "customer",
        name: "customer",
        surname: "customer",
        password: "customer",
        role: "Customer"
    }

    const customerRegisterResponse = await request('http://localhost:3001')
        .post(`${baseURL}/users`)
        .send(customer);
        // Check that the customer account was created successfully
    expect(customerRegisterResponse.status).toBe(200);

    // Then, authenticate and get a token for the customer
    const customerLoginResponse = await request('http://localhost:3001')
        .post(`${baseURL}/sessions`)
        .send({ username: customer.username, password: customer.password });

    const customerCookie = customerLoginResponse.headers['set-cookie'];

    // Customer adds the product to the cart
    const addToCartResponse = await request('http://localhost:3001')
        .post(`${baseURL}/carts`)
        .set('Cookie', customerCookie)
        .send({ model: product.model });

    expect(addToCartResponse.status).toBe(200);

    // Customer pays for the cart
    const payCartResponse = await request('http://localhost:3001')
        .patch(`${baseURL}/carts/`)
        .set('Cookie', customerCookie);
    expect(payCartResponse.status).toBe(200);

    // Customer adds a review for the product
    const review = {
        score: 5,
        comment: 'Great product'
    }

    // Customer add a review
    const addReview = await request('http://localhost:3001')
        .post(`${baseURL}/reviews/${product.model}`)
        .set('Cookie', customerCookie)
        .send(review);
    expect(addReview.status).toBe(200);

    //delete all the review of a model:
    const deleteReview = await request('http://localhost:3001')
        .delete(`${baseURL}/reviews/${product.model}/all`)
        .set('Cookie', managerCookie)
    expect(deleteReview.status).toBe(200);

    deleteAllData();
});


//update al the reviews of all the products:
test("should delete a product from a cart", async () => {
    deleteAllData();
    createTables();

    // First, create a manager account
    const manager = {
        username: "manager",
        name: "manager",
        surname: "manager",
        password: "manager",
        role: "Manager"
    }

    const managerRegisterResponse = await request('http://localhost:3001')
        .post(`${baseURL}/users`)
        .send(manager);

    // Check that the manager account was created successfully
    expect(managerRegisterResponse.status).toBe(200);

    // Then, authenticate and get a token for the manager
    const managerLoginResponse = await request('http://localhost:3001')
        .post(`${baseURL}/sessions`)
        .send({ username: manager.username, password: manager.password });

    const managerCookie = managerLoginResponse.headers['set-cookie'];

    const product = {
        model: 'model',
        category: 'Smartphone',
        sellingPrice: 100,
        arrivalDate: '2022-01-01',
        details: 'Details about the product',
        quantity: 10
    }

    // Manager adds the product
    const addProductResponse = await request('http://localhost:3001')
        .post(`${baseURL}/products`)
        .set('Cookie', managerCookie)
        .send(product);

    expect(addProductResponse.status).toBe(200);

    // Create a customer account
    const customer = {
        username: "customer",
        name: "customer",
        surname: "customer",
        password: "customer",
        role: "Customer"
    }

    const customerRegisterResponse = await request('http://localhost:3001')
        .post(`${baseURL}/users`)
        .send(customer);
        // Check that the customer account was created successfully
    expect(customerRegisterResponse.status).toBe(200);

    // Then, authenticate and get a token for the customer
    const customerLoginResponse = await request('http://localhost:3001')
        .post(`${baseURL}/sessions`)
        .send({ username: customer.username, password: customer.password });

    const customerCookie = customerLoginResponse.headers['set-cookie'];

    // Customer adds the product to the cart
    const addToCartResponse = await request('http://localhost:3001')
        .post(`${baseURL}/carts`)
        .set('Cookie', customerCookie)
        .send({ model: product.model });

    expect(addToCartResponse.status).toBe(200);

    // Customer pays for the cart
    const payCartResponse = await request('http://localhost:3001')
        .patch(`${baseURL}/carts/`)
        .set('Cookie', customerCookie);
    expect(payCartResponse.status).toBe(200);

    // Customer adds a review for the product
    const review = {
        score: 5,
        comment: 'Great product'
    }

    // Customer add a review
    const addReview = await request('http://localhost:3001')
        .post(`${baseURL}/reviews/${product.model}`)
        .set('Cookie', customerCookie)
        .send(review);
    expect(addReview.status).toBe(200);

    //delete all the review of a model:
    const deleteReview = await request('http://localhost:3001')
        .delete(`${baseURL}/reviews`)
        .set('Cookie', managerCookie)
    expect(deleteReview.status).toBe(200);

    deleteAllData();
});