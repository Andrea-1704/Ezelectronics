import { test, expect, jest, beforeEach, afterEach } from "@jest/globals"
import request from 'supertest'
const baseURL = "/ezelectronics"
import db, {createTables, deleteAllData}  from "../src/db/db"
import exp from "node:constants"
import { describe } from "node:test"


describe('Integration test: Login (UC1)', () => {
    
    test('Successful Login (UC1.1)', async () => {
        deleteAllData();
        createTables();
        // First, create a customer account
        const customerTest = { //Define a test user object sent to the route
            username: 'test',
            name: 'test',
            surname: 'test',
            password: 'test',
            role: 'Customer'
        }

        const registerResponse = await request('http://localhost:3001')
        .post(`${baseURL}/users`)
        .send(customerTest);
        expect(registerResponse.status).toBe(200);

        // Then, authenticate and get a token
        const loginResponse = await request('http://localhost:3001')
        .post(`${baseURL}/sessions`)
        .send({ username: customerTest.username, password: customerTest.password });

        // Check that the login was successful and a token was received
        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body).toEqual({username: customerTest.username, 
                                            name: customerTest.name,
                                            surname: customerTest.surname,
                                            role: customerTest.role,
                                            birthdate: null,
                                            address: null})

        deleteAllData();

    })
})



describe('Integration test: Login error ', () => {
    
    test('Unsuccessful Login uncorrect password', async () => {
        deleteAllData();
        createTables();
        // First, create a customer account
        const customerTest = { //Define a test user object sent to the route
            username: 'test',
            name: 'test',
            surname: 'test',
            password: 'test',
            role: 'Customer'
        }

        const registerResponse = await request('http://localhost:3001')
        .post(`${baseURL}/users`)
        .send(customerTest);
        expect(registerResponse.status).toBe(200);

        // Then, authenticate and get a token
        const loginResponse = await request('http://localhost:3001')
        .post(`${baseURL}/sessions`)
        .send({ username: customerTest.username, password: "altro" });

        // Check that the login was successful and a token was received
        expect(loginResponse.status).toBe(401);
        
        deleteAllData();

    })
})



describe('Integration test: Login error', () => {
    
    test('Uncorrect username', async () => {
        deleteAllData();
        createTables();
        // First, create a customer account
        const customerTest = { //Define a test user object sent to the route
            username: 'test',
            name: 'test',
            surname: 'test',
            password: 'test',
            role: 'Customer'
        }

        const registerResponse = await request('http://localhost:3001')
        .post(`${baseURL}/users`)
        .send(customerTest);
        expect(registerResponse.status).toBe(200);

        // Then, authenticate and get a token
        const loginResponse = await request('http://localhost:3001')
        .post(`${baseURL}/sessions`)
        .send({ username: "username_errato", password: customerTest.password });

        // Check that the login was successful and a token was received
        expect(loginResponse.status).toBe(401);
        
        deleteAllData();

    })
})


describe('Integration test: Delete session (UC1)', () => {
    
    test('Logout (UC1.2)', async () => {
        deleteAllData();
        createTables();
        // First, create a customer account
        const customerTest = { //Define a test user object sent to the route
            username: 'test',
            name: 'test',
            surname: 'test',
            password: 'test',
            role: 'Customer'
        }

        const registerResponse = await request('http://localhost:3001')
        .post(`${baseURL}/users`)
        .send(customerTest);
        expect(registerResponse.status).toBe(200);

        // Then, authenticate and get a token
        const loginResponse = await request('http://localhost:3001')
        .post(`${baseURL}/sessions`)
        .send({ username: customerTest.username, password: customerTest.password });

        // Check that the login was successful and a token was received
        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body).toEqual({username: customerTest.username, 
                                            name: customerTest.name,
                                            surname: customerTest.surname,
                                            role: customerTest.role,
                                            birthdate: null,
                                            address: null})

        // Then, logout
        const logoutResponse = await request('http://localhost:3001')
        .delete(`${baseURL}/sessions/current`)
        .set('Cookie', loginResponse.headers['set-cookie']);

        // Check that the logout was successful
        expect(logoutResponse.status).toBe(200);

        deleteAllData();

    })
})



describe('Integration test: Delete admin session', () => {
    
    test('Logout (UC1.2)', async () => {
        deleteAllData();
        createTables();
        // First, create a customer account
        const customerTest = { //Define a test user object sent to the route
            username: 'test',
            name: 'test',
            surname: 'test',
            password: 'test',
            role: 'Admin'
        }

        const registerResponse = await request('http://localhost:3001')
        .post(`${baseURL}/users`)
        .send(customerTest);
        expect(registerResponse.status).toBe(200);

        // Then, authenticate and get a token
        const loginResponse = await request('http://localhost:3001')
        .post(`${baseURL}/sessions`)
        .send({ username: customerTest.username, password: customerTest.password });

        // Check that the login was successful and a token was received
        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body).toEqual({username: customerTest.username, 
                                            name: customerTest.name,
                                            surname: customerTest.surname,
                                            role: customerTest.role,
                                            birthdate: null,
                                            address: null})

        // Then, logout
        const logoutResponse = await request('http://localhost:3001')
        .delete(`${baseURL}/sessions/current`)
        .set('Cookie', loginResponse.headers['set-cookie']);

        // Check that the logout was successful
        expect(logoutResponse.status).toBe(200);

        deleteAllData();

    })
})






describe('Integration test: get', () => {
    
    test('get the session', async () => {
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

        const response2 = await request('http://localhost:3001')
            .get(`${baseURL}/sessions/current`) 
            .set('Cookie', customerCookie)
        

        deleteAllData();

        expect(response2.status).toBe(200);
    })
    
})