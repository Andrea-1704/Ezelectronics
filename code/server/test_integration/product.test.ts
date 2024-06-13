import { test, expect, jest, beforeEach, afterEach } from "@jest/globals"
import request from 'supertest'
const baseURL = "/ezelectronics"
import db, {createTables, deleteAllData}  from "../src/db/db"
import exp from "node:constants"



//Register arrivals 
test("Manager registers arrivals of new products", async () => {
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
    
    deleteAllData();
});


//Register arrivals 
test("Admin registers arrivals of new products", async () => {
  deleteAllData();
  createTables();

  // First, create a manager account
  const admin = {
      username: "admin",
      name: "admin",
      surname: "admin",
      password: "admin",
      role: "Admin"
  }

  const managerRegisterResponse = await request('http://localhost:3001')
      .post(`${baseURL}/users`)
      .send(admin);

  // Check that the manager account was created successfully
  expect(managerRegisterResponse.status).toBe(200);

  // Then, authenticate and get a token for the manager
  const managerLoginResponse = await request('http://localhost:3001')
      .post(`${baseURL}/sessions`)
      .send({ username: admin.username, password: admin.password });

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
  
  deleteAllData();
});


//Register arrivals : error case
test("409: model already exists", async () => {
    deleteAllData();
    createTables();
  
    // First, create a manager account
    const admin = {
        username: "admin",
        name: "admin",
        surname: "admin",
        password: "admin",
        role: "Admin"
    }
  
    const managerRegisterResponse = await request('http://localhost:3001')
        .post(`${baseURL}/users`)
        .send(admin);
  
    // Check that the manager account was created successfully
    expect(managerRegisterResponse.status).toBe(200);
  
    // Then, authenticate and get a token for the manager
    const managerLoginResponse = await request('http://localhost:3001')
        .post(`${baseURL}/sessions`)
        .send({ username: admin.username, password: admin.password });
  
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


    const addProductResponse2 = await request('http://localhost:3001')
        .post(`${baseURL}/products`)
        .set('Cookie', managerCookie)
        .send(product);
  
    expect(addProductResponse2.status).toBe(409);
    
    deleteAllData();
  });

//Register arrivals :400
test("400 error: arrival date after current", async () => {
    deleteAllData();
    createTables();
  
    // First, create a manager account
    const admin = {
        username: "admin",
        name: "admin",
        surname: "admin",
        password: "admin",
        role: "Admin"
    }
  
    const managerRegisterResponse = await request('http://localhost:3001')
        .post(`${baseURL}/users`)
        .send(admin);
  
    // Check that the manager account was created successfully
    expect(managerRegisterResponse.status).toBe(200);
  
    // Then, authenticate and get a token for the manager
    const managerLoginResponse = await request('http://localhost:3001')
        .post(`${baseURL}/sessions`)
        .send({ username: admin.username, password: admin.password });
  
    const managerCookie = managerLoginResponse.headers['set-cookie'];
  
    const product = {
        model: 'model',
        category: 'Smartphone',
        sellingPrice: 100,
        arrivalDate: '2044-01-01',
        details: 'Details about the product',
        quantity: 10
    }
  
    // Manager adds the product
    const addProductResponse = await request('http://localhost:3001')
        .post(`${baseURL}/products`)
        .set('Cookie', managerCookie)
        .send(product);
  
    expect(addProductResponse.status).toBe(400);
    
    deleteAllData();
  });

//Increase quantity of product
test("Manager increases the availability of a product", async () => {
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


  const increase = {
    model: 'model',
    quantity: 10,
    changeDate: '2022-01-01'
  }

  // Manager increases the availability of the product
  const increaseAvailability = await request('http://localhost:3001')
      .patch(`${baseURL}/products/${product.model}`)
      .set('Cookie', managerCookie)
      .send(increase);

  expect(addProductResponse.status).toBe(200);
  
  deleteAllData();
});


//Increase quantity of product
test("404: model not in db", async () => {
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
  
  
    const increase = {
      model: 'model',
      quantity: 10,
      changeDate: '2022-01-01'
    }
  
    // Manager increases the availability of the product
    const increaseAvailability = await request('http://localhost:3001')
        .patch(`${baseURL}/products/"error_model"`)
        .set('Cookie', managerCookie)
        .send(increase);
  
    expect(increaseAvailability.status).toBe(404);
    
    deleteAllData();
});


//Increase quantity of product
test("400: changeDate after current date", async () => {
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
  
  
    const increase = {
      model: 'model',
      quantity: 10,
      changeDate: '2044-01-01'
    }
  
    // Manager increases the availability of the product
    const increaseAvailability = await request('http://localhost:3001')
        .patch(`${baseURL}/products/${product.model}`)
        .set('Cookie', managerCookie)
        .send(increase);
  
    expect(increaseAvailability.status).toBe(400);
    
    deleteAllData();
});



//Increase quantity of product
test("400: changeDate before arrival date", async () => {
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
  
  
    const increase = {
      model: 'model',
      quantity: 10,
      changeDate: '2000-01-01'
    }
  
    // Manager increases the availability of the product
    const increaseAvailability = await request('http://localhost:3001')
        .patch(`${baseURL}/products/${product.model}`)
        .set('Cookie', managerCookie)
        .send(increase);
  
    expect(increaseAvailability.status).toBe(400);
    
    deleteAllData();
});


//Increase quantity of product
test("Admin increases the availability of a product", async () => {
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


  const increase = {
    model: 'model',
    quantity: 10,
    changeDate: '2022-01-01'
  }


  // First, create a manager account
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

  // Check that the manager account was created successfully
  expect(managerRegisterResponse.status).toBe(200);

  // Then, authenticate and get a token for the admin
  const adminLoginResponse = await request('http://localhost:3001')
      .post(`${baseURL}/sessions`)
      .send({ username: admin.username, password: admin.password });

  const adminCookie = adminLoginResponse.headers['set-cookie'];

  // admin increases the availability of the product
  const increaseAvailability = await request('http://localhost:3001')
      .patch(`${baseURL}/products/${product.model}`)
      .set('Cookie', adminCookie)
      .send(increase);

  expect(addProductResponse.status).toBe(200);
  
  deleteAllData();
});



//Sell a product
test("Manager sells a product", async () => {
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

  //manager sells the product:
  const sell = {
    model: 'model',
    sellingDate: '2022-01-01',
    quantity: 1
  }

  // Manager sells the product
  const sellProduct = await request('http://localhost:3001')
      .patch(`${baseURL}/products/${product.model}/sell`)
      .set('Cookie', managerCookie)
      .send(sell);

  expect(sellProduct.status).toBe(200);
  
  deleteAllData();
});


//Sell a product
test("404 error: Model not in db", async () => {
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
  
    //manager sells the product:
    const sell = {
      model: 'model',
      sellingDate: '2022-01-01',
      quantity: 1
    }
  
    // Manager sells the product
    const sellProduct = await request('http://localhost:3001')
        .patch(`${baseURL}/products/"erro_model"/sell`)
        .set('Cookie', managerCookie)
        .send(sell);
  
    expect(sellProduct.status).toBe(404);
    
    deleteAllData();
  });


//Sell a product
test("400 error: selling date after current date", async () => {
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
  
    //manager sells the product:
    const sell = {
      model: 'model',
      sellingDate: '2040-01-01',
      quantity: 1
    }
  
    // Manager sells the product
    const sellProduct = await request('http://localhost:3001')
        .patch(`${baseURL}/products/${product.model}/sell`)
        .set('Cookie', managerCookie)
        .send(sell);
  
    expect(sellProduct.status).toBe(400);
    
    deleteAllData();
  });


//Sell a product
test("400 error: selling date before arrival date", async () => {
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
  
    //manager sells the product:
    const sell = {
      model: 'model',
      sellingDate: '2040-01-01',
      quantity: 1
    }
  
    // Manager sells the product
    const sellProduct = await request('http://localhost:3001')
        .patch(`${baseURL}/products/${product.model}/sell`)
        .set('Cookie', managerCookie)
        .send(sell);
  
    expect(sellProduct.status).toBe(400);
    
    deleteAllData();
  });


//Sell a product
test("409 error: not available product", async () => {
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
  
    //manager sells the product:
    const sell = {
      model: 'model',
      sellingDate: '2022-01-01',
      quantity: 10
    }
  
    // Manager sells the product
    const sellProduct = await request('http://localhost:3001')
        .patch(`${baseURL}/products/${product.model}/sell`)
        .set('Cookie', managerCookie)
        .send(sell);
  
    expect(sellProduct.status).toBe(409);
    
    deleteAllData();
  });


//Get all products
test("Manager gets all products", async () => {
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

  //manager gets all products:
  const getProducts = await request('http://localhost:3001')
    .get(`${baseURL}/products`)
    .set('Cookie', managerCookie);

  expect(getProducts.status).toBe(200);
  
  deleteAllData();
});


//Get all products
test("422 error:groping=category and !category", async () => {
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
  
    //manager gets all products:
    const getProducts = await request('http://localhost:3001')
      .get(`${baseURL}/products?category=Smartphone`)
      .set('Cookie', managerCookie);
  
    expect(getProducts.status).toBe(422);
    
    deleteAllData();
  });


  //Get all products
test("422 error: groping=category and !model", async () => {
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
  
    //manager gets all products:
    const getProducts = await request('http://localhost:3001')
      .get(`${baseURL}/products?category=model`)
      .set('Cookie', managerCookie);
  
    expect(getProducts.status).toBe(422);
    
    deleteAllData();
  });


  //Get all products
  test("404: product does not exists", async () => {
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
  
    //manager gets all products:
    const getProducts = await request('http://localhost:3001')
      .get(`${baseURL}/products?grouping=model&model=Smartphone`)
      .set('Cookie', managerCookie);
  
    expect(getProducts.status).toBe(404);
    
    deleteAllData();
  });


  //Get all products
  test("422 error: groping=null and category or model not null", async () => {
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
  
    //manager gets all products:
    const getProducts = await request('http://localhost:3001')
      .get(`${baseURL}/products?grouping=category`)
      .set('Cookie', managerCookie);
  
    expect(getProducts.status).toBe(422);
    
    deleteAllData();
  });



//Get all available products
test("Manager gets all the available products", async () => {
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

  //manager gets all products:
  const getProducts = await request('http://localhost:3001')
    .get(`${baseURL}/products/available`)
    .set('Cookie', managerCookie);

  expect(getProducts.status).toBe(200);
  
  deleteAllData();
});


//Get all available products
test("422 error: grouping is null and category or model is not", async () => {
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
  
    //manager gets all products:
    const getProducts = await request('http://localhost:3001')
      .get(`${baseURL}/products/available?model=testModel`)
      .set('Cookie', managerCookie);
  
    expect(getProducts.status).toBe(422);
    
    deleteAllData();
  });


  //Get all products
  test("404: product does not exists", async () => {
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
  
    //manager gets all products:
    const getProducts = await request('http://localhost:3001')
      .get(`${baseURL}/products/available?grouping=model&model=Smartphone`)
      .set('Cookie', managerCookie);
  
    expect(getProducts.status).toBe(404);
    
    deleteAllData();
  });


  //Get all products
  test("422 error: groping=null and category or model not null", async () => {
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
  
    //manager gets all products:
    const getProducts = await request('http://localhost:3001')
      .get(`${baseURL}/products/available?grouping=category`)
      .set('Cookie', managerCookie);
  
    expect(getProducts.status).toBe(422);
    
    deleteAllData();
  });





//Delete a spcific product
test("Manager deletes a specific product", async () => {
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

  //manager delete the product:
  const deleteProduct = await request('http://localhost:3001')
    .delete(`${baseURL}/products/${product.model}`)
    .set('Cookie', managerCookie);

  expect(deleteProduct.status).toBe(200);
  
  deleteAllData();
});


//Delete a spcific product
test("404: model not exists", async () => {
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
  
    //manager delete the product:
    const deleteProduct = await request('http://localhost:3001')
      .delete(`${baseURL}/products/"error_model"`)
      .set('Cookie', managerCookie);
  
    expect(deleteProduct.status).toBe(404);
    
    deleteAllData();
  });



//Delete all the products:
test("Manager deletes all the products", async () => {
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

  //manager delete the product:
  const deleteProduct = await request('http://localhost:3001')
    .delete(`${baseURL}/products`)
    .set('Cookie', managerCookie);

  expect(deleteProduct.status).toBe(200);
  
  deleteAllData();
});