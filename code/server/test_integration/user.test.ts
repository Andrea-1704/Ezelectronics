import { test, expect, jest, beforeEach, afterEach } from "@jest/globals"
import request from 'supertest'
const baseURL = "/ezelectronics"
import db, {createTables, deleteAllData}  from "../src/db/db"
import exp from "node:constants"


//Create a new user
test("should create a new user account", async () => {
    
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
})




//get all the users
test("should get all the users", async () => {
    
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


  const getUsers = await request('http://localhost:3001')
    .get(`${baseURL}/users`)
    .set('Cookie', adminCoockie);

  // Check that the registration was successful
  expect(getUsers.status).toBe(200);
})


//get all the users
test("should get all the users with specific role", async () => {
    
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


  const getUsers = await request('http://localhost:3001')
    .get(`${baseURL}/users/roles/Customer`)
    .set('Cookie', adminCoockie);

  // Check that the registration was successful
  expect(getUsers.status).toBe(200);
})


//get a specific user
test("should get a specific user", async () => {
    
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


  const getUsers = await request('http://localhost:3001')
    .get(`${baseURL}/users/${customer.username}`)
    .set('Cookie', adminCoockie);

  // Check that the registration was successful
  expect(getUsers.status).toBe(200);
})


//delete a specific user
test("should delete a specific user", async () => {
    
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


  const getUsers = await request('http://localhost:3001')
    .delete(`${baseURL}/users/${customer.username}`)
    .set('Cookie', adminCoockie);

  // Check that the registration was successful
  expect(getUsers.status).toBe(200);
})


//delete all non admin users
test("should delete all the non admin users", async () => {
    
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


  const getUsers = await request('http://localhost:3001')
    .delete(`${baseURL}/users`)
    .set('Cookie', adminCoockie);

  // Check that the registration was successful
  expect(getUsers.status).toBe(200);
})


//update the personal information of a user
test("should update the information of a user", async () => {
    
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

  //Create a new admin account:
   const body = {
      name: "pippo",
      surname: "pluto",
      address: "topolandia",
      birthdate: "1999-01-01"
  }

  // Get the token for the customer
  const customerLoginResponse = await request('http://localhost:3001')
    .post(`${baseURL}/sessions`)
    .send({ username: customer.username, password: customer.password });

  // Check that the login was successful
  expect(customerLoginResponse.status).toBe(200);
  const customerCookie = customerLoginResponse.headers['set-cookie'];

  const modification = await request('http://localhost:3001')
    .patch(`${baseURL}/users/${customer.username}`)
    .send(body)
    .set('Cookie', customerCookie);

  // Check that the registration was successful
  expect(modification.status).toBe(200);
})