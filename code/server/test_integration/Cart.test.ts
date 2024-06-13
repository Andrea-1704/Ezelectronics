import { test, expect, jest, beforeEach, afterEach } from "@jest/globals"
import request from 'supertest'
const baseURL = "/ezelectronics"
import db, {createTables, deleteAllData}  from "../src/db/db"
import exp from "node:constants"


//get cart
test("should get cart", async () => {
    
    createTables()
    deleteAllData();

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
  
    // Check that the registration was successful
    expect(customerRegisterResponse.status).toBe(200);
     // Get the token for the customer
    const customerLoginResponse = await request('http://localhost:3001')
    .post(`${baseURL}/sessions`)
    .send({ username: customer.username, password: customer.password });

    // Check that the login was successful
    expect(customerLoginResponse.status).toBe(200);
    const customerCookie = customerLoginResponse.headers['set-cookie'];

    const testCart = {
        "customer": "1",
        "paid": false,
        "paymentDate": "1",
        "total": 1
    }

    const response2 = await request('http://localhost:3001')
    .get(`${baseURL}/carts`) 
    .set('Cookie', customerCookie)
    

    deleteAllData();

    expect(response2.status).toBe(200)
})


//add to cart
test("should add product to cart", async () => {
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

    // Create a new customer account
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
    deleteAllData();
});


test("should return error 401 adding product to cart", async () => {
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

    // Create a new customer account
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
        .send({ model: "fake_model_error" });

    expect(addToCartResponse.status).toBe(404);
    deleteAllData();
});

test("should return error 409 adding product to cart", async () => {
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
        quantity: 1
    }

    // Manager adds the product
    const addProductResponse = await request('http://localhost:3001')
        .post(`${baseURL}/products`)
        .set('Cookie', managerCookie)
        .send(product);

    
    expect(addProductResponse.status).toBe(200);

    // Create a new customer account
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

    //checkout cart
    const payCartResponse = await request('http://localhost:3001')
        .patch(`${baseURL}/carts`)
        .set('Cookie', customerCookie);


    // Customer adds the product to the cart
    const addToCartResponse2 = await request('http://localhost:3001')
    .post(`${baseURL}/carts`)
    .set('Cookie', customerCookie)
    .send({ model: product.model });

    expect(addToCartResponse2.status).toBe(409);
    deleteAllData();
});



//Payment of the cart
test("should add product to cart", async () => {
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

    // Create a new customer account
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
    
    deleteAllData();
});


//Payment of the cart
test("should return 400 error", async () => {
    deleteAllData();
    createTables();

    


    // Create a new customer account
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

  
    expect(customerRegisterResponse.status).toBe(200);

    // Then, authenticate and get a token for the customer
    const customerLoginResponse = await request('http://localhost:3001')
        .post(`${baseURL}/sessions`)
        .send({ username: customer.username, password: customer.password });

    const customerCookie = customerLoginResponse.headers['set-cookie'];

    

    // Customer pays for the cart
    const payCartResponse = await request('http://localhost:3001')
        .patch(`${baseURL}/carts/`)
        .set('Cookie', customerCookie);
    expect(payCartResponse.status).toBe(400);
    
    deleteAllData();
});


test("should return 409: product not available", async () => {
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
        quantity: 1
    }

    // Manager adds the product
    const addProductResponse = await request('http://localhost:3001')
        .post(`${baseURL}/products`)
        .set('Cookie', managerCookie)
        .send(product);

    
    expect(addProductResponse.status).toBe(200);

    // Create a new customer account
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


    //create second customer and add the same product to cart:

    const customer2 = {
        username: "customer2",
        name: "customer2",
        surname: "customer2",
        password: "customer2",
        role: "Customer"
    }

    const customerRegisterResponse2 = await request('http://localhost:3001')
        .post(`${baseURL}/users`)
        .send(customer2);

  
    expect(customerRegisterResponse2.status).toBe(200);

    // Then, authenticate and get a token for the customer
    const customerLoginResponse2 = await request('http://localhost:3001')
        .post(`${baseURL}/sessions`)
        .send({ username: customer2.username, password: customer2.password });

    const customerCookie2 = customerLoginResponse2.headers['set-cookie'];

    // Customer adds the product to the cart
    const addToCartResponse2 = await request('http://localhost:3001')
        .post(`${baseURL}/carts`)
        .set('Cookie', customerCookie2)
        .send({ model: product.model });
    expect(addToCartResponse2.status).toBe(200);

    // Customer pays for the cart
    const payCartResponse = await request('http://localhost:3001')
        .patch(`${baseURL}/carts/`)
        .set('Cookie', customerCookie);
    expect(payCartResponse.status).toBe(200);

    //try to pay but product finished:
    const payCartResponse2 = await request('http://localhost:3001')
        .patch(`${baseURL}/carts/`)
        .set('Cookie', customerCookie2);
    expect(payCartResponse2.status).toBe(409);
    
    deleteAllData();
});


test("should return 409: quantity greather than the one in db", async () => {
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
        quantity: 2
    }

    // Manager adds the product
    const addProductResponse = await request('http://localhost:3001')
        .post(`${baseURL}/products`)
        .set('Cookie', managerCookie)
        .send(product);

    
    expect(addProductResponse.status).toBe(200);

    // Create a new customer account
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

    const addToCartResponse3 = await request('http://localhost:3001')
        .post(`${baseURL}/carts`)
        .set('Cookie', customerCookie)
        .send({ model: product.model });
    expect(addToCartResponse3.status).toBe(200);


    //create second customer and add the same product to cart:

    const customer2 = {
        username: "customer2",
        name: "customer2",
        surname: "customer2",
        password: "customer2",
        role: "Customer"
    }

    const customerRegisterResponse2 = await request('http://localhost:3001')
        .post(`${baseURL}/users`)
        .send(customer2);

  
    expect(customerRegisterResponse2.status).toBe(200);

    // Then, authenticate and get a token for the customer
    const customerLoginResponse2 = await request('http://localhost:3001')
        .post(`${baseURL}/sessions`)
        .send({ username: customer2.username, password: customer2.password });

    const customerCookie2 = customerLoginResponse2.headers['set-cookie'];

    // Customer adds the product to the cart
    const addToCartResponse2 = await request('http://localhost:3001')
        .post(`${baseURL}/carts`)
        .set('Cookie', customerCookie2)
        .send({ model: product.model });
    expect(addToCartResponse2.status).toBe(200);

    

    //try to pay but product finished:
    const payCartResponse2 = await request('http://localhost:3001')
        .patch(`${baseURL}/carts/`)
        .set('Cookie', customerCookie2);
    expect(payCartResponse2.status).toBe(200);


    // Customer one pays for the cart
    const payCartResponse = await request('http://localhost:3001')
        .patch(`${baseURL}/carts/`)
        .set('Cookie', customerCookie);
    expect(payCartResponse.status).toBe(409);
    
    deleteAllData();
});


//history of carts
test("should get history of carts", async () => {
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

    // Customer checks out the cart
    const checkoutCartResponse = await request('http://localhost:3001')
        .patch(`${baseURL}/carts`)
        .set('Cookie', customerCookie);

    expect(checkoutCartResponse.status).toBe(200);

    // Customer gets the history of carts
    const historyResponse = await request('http://localhost:3001')
        .get(`${baseURL}/carts/history`)
        .set('Cookie', customerCookie);

    expect(historyResponse.status).toBe(200);
    deleteAllData();
});


//delete product from cart
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

    // Customer deletes the product from the cart:
    const checkoutCartResponse = await request('http://localhost:3001')
        .delete(`${baseURL}/carts/products/${product.model}`)
        .set('Cookie', customerCookie);

    expect(checkoutCartResponse.status).toBe(200);
    deleteAllData();
});



//delete product from cart. error 404
test("should raise 404 error case: model not in cart", async () => {
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

    const product2 = {
        model: 'model2',
        category: 'Smartphone2',
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

    // Customer deletes the product from the cart:
    const checkoutCartResponse = await request('http://localhost:3001')
        .delete(`${baseURL}/carts/products/${product2.model}`)
        .set('Cookie', customerCookie);

    expect(checkoutCartResponse.status).toBe(404);
    deleteAllData();
});



//delete product from cart. error 404
test("should raise 404 error case: no product in cart", async () => {
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

    const product2 = {
        model: 'model2',
        category: 'Smartphone2',
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


    // Customer deletes the product from the cart:
    const checkoutCartResponse = await request('http://localhost:3001')
        .delete(`${baseURL}/carts/products/${product.model}`)
        .set('Cookie', customerCookie);

    expect(checkoutCartResponse.status).toBe(404);
    deleteAllData();
});


//delete product from cart. error 404
test("should raise 404 error case: model not in db", async () => {
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

    const product2 = {
        model: 'model2',
        category: 'Smartphone2',
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

    // Customer deletes the product from the cart:
    const checkoutCartResponse = await request('http://localhost:3001')
        .delete(`${baseURL}/carts/products/"error_model"`)
        .set('Cookie', customerCookie);

    expect(checkoutCartResponse.status).toBe(404);
    deleteAllData();
});



//empties the cart:
test("should empty the cart", async () => {
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

    // Customer empties the cart
    const checkoutCartResponse = await request('http://localhost:3001')
        .delete(`${baseURL}/carts/current`)
        .set('Cookie', customerCookie);

    expect(checkoutCartResponse.status).toBe(200);
    deleteAllData();
});

//delete all carts:
test("Manager deletes all carts", async () => {
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

    //Manager deletes all carts:
    const deleteAllCarts = await request('http://localhost:3001')
        .delete(`${baseURL}/carts`)
        .set('Cookie', managerCookie);

    expect(deleteAllCarts.status).toBe(200);
    
    deleteAllData();
});


//Manager retrieves all carts
test("Manager gets all cart", async () => {
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


    // Then, authenticate and get a token for the manager
    const managerLoginResponse2 = await request('http://localhost:3001')
        .post(`${baseURL}/sessions`)
        .send({ username: manager.username, password: manager.password });

    const managerCookie2 = managerLoginResponse2.headers['set-cookie'];

    //Manager gets all carts:
    const getCarts = await request('http://localhost:3001')
        .get(`${baseURL}/carts/all`)
        .set('Cookie', managerCookie2);

    expect(getCarts.status).toBe(200);
    
    deleteAllData();
});



//Retrieve all carts Admin
test("Admin gets all cart", async () => {
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

    //Create a new admin account:
    const admin = {
        username: "admin",
        name: "admin",
        surname: "admin",
        password: "admin",
        role: "Admin"
    }

    const adminRegisterResponse = await request('http://localhost:3001')
        .post(`${baseURL}/users`)
        .send(admin);

    // Check that the admin account was created successfully
    expect(adminRegisterResponse.status).toBe(200);

    // Then, authenticate and get a token for the manager
    const adminLoginResponse = await request('http://localhost:3001')
        .post(`${baseURL}/sessions`)
        .send({ username: admin.username, password: admin.password });

    const adminCoockie = adminLoginResponse.headers['set-cookie'];

    //admin gets all carts:
    const getCarts = await request('http://localhost:3001')
        .get(`${baseURL}/carts/all`)
        .set('Cookie', adminCoockie);
    
    deleteAllData();
});