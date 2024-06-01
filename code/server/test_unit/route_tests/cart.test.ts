import { describe, test, expect, beforeAll, afterAll, jest } from "@jest/globals"
import {User, Role} from "../../src/components/user";
import { Cart } from "../../src/components/cart";
import CartController from "../../src/controllers/cartController";
import Authenticator from "../../src/routers/auth";
import request from 'supertest';
import { app } from "../../index";
import ErrorHandler from "../../src/helper"
import { Category, Product } from "../../src/components/product";
import { beforeEach } from "node:test";
const baseURL = "/ezelectronics";

let testCustomer = new User("customer", "customer", "customer", Role.CUSTOMER, "", "")
let testCart = new Cart(0, "customer", false, "17-04-2002", 0, []);
let testProduct= new Product(10, "iphone13", Category.SMARTPHONE, "10-04-2002"," " , 3);

jest.mock("../../src/controllers/cartController")
jest.mock("../../src/routers/auth")

describe("Route unit tests", () => {
  describe("GET /carts", () => {
    test("It returns the cart of the logged in user", async() => {
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        return next();
      })
      jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
        return next();
      })
      jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(testCart);
      
      //We send a request to the route we are testing. We are in a situation where:
            //  - The user is an Customer (= the Authenticator logic is mocked to be correct)
            //  - The getCart function returns the cart of the user (= the cartController logic is mocked to be correct)
            //We expect the 'getCart' function to have been called, the route to return a 200 success code and the expected cart of the
            //customer
      const response = await request(app).get(baseURL + "/carts")
      expect(response.status).toBe(200)
      expect(CartController.prototype.getCart).toHaveBeenCalled()
      expect(response.body).toEqual(testCart)
    }, 10000);
  })

/*
test this function:
this.router.get(
            "/",
            this.authenticator.isLoggedIn,
            this.authenticator.isCustomer,
            (req: any, res: any, next: any) => this.controller.getCart(req.user)
                .then((cart: any ) => {
                  res.status(200).json(cart)
                })
                .catch((err) => {
                    next(err)
                })
        )
*/
/*describe("POST /carts", () => {
  test("It adds a product to a cart", async() => {
    const req = { model: "iPhone13" }
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
      return next();
    })
    jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
      return next();
    })
    jest.mock('express-validator', () => ({
      body: jest.fn().mockImplementation(() => ({
          isString: () => ({ notEmpty: () => ({}) }),
      })),
    }))
    jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
      return next()
    })
    jest.spyOn(CartController.prototype, "addToCart").mockResolvedValueOnce(true);
    
    const response = await request(app).post(baseURL + "/carts").send(req)
    expect(response.status).toBe(200)
    expect(CartController.prototype.addToCart).toHaveBeenCalled()
    //expect(response.body).toEqual(testCart)
    //sellingPrice: number, model: string, category: Category, arrivalDate: string | null, details: string | null, quantity: number
    expect(CartController.prototype.addToCart).toHaveBeenCalledWith(req.model)


    }, 10000);
  })*/
  describe("POST /carts", () => {
    test("It adds a product to a cart", async() => {
      // Simula un oggetto `req` che includa `user` e `body`
      const user = { username: "customer" }; // Assumi che questo sia l'utente loggato
      const model = "iPhone13";
      
      // Setup mock
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        req.user = user; // Aggiungi l'utente al req
        return next();
      });
      jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
        return next();
      });
      jest.mock('express-validator', () => ({
        body: jest.fn().mockImplementation(() => ({
            isString: () => ({ notEmpty: () => ({}) }),
        })),
      }));
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
        return next();
      });
      jest.spyOn(CartController.prototype, "addToCart").mockResolvedValueOnce(true);
      
      const response = await request(app).post(baseURL + "/carts").send({ model });
      expect(response.status).toBe(200);
      expect(CartController.prototype.addToCart).toHaveBeenCalled();
      expect(CartController.prototype.addToCart).toHaveBeenCalledWith(user, model);
  
    }, 10000);
  });
  
  /*
  this.router.post(
            "/",
            this.authenticator.isLoggedIn,
            this.authenticator.isCustomer,
            body("model").isString().notEmpty(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => this.controller.addToCart(req.user, req.body.model)
                .then((): void => res.status(200).end())
                .catch((err) => {
                    next(err)
                })
        )
  */
  describe("PATCH /carts", () => {
          test("It checks out the cart for the logged in user", async() => {
            // create fake use:
            const user = { username: "customer" };
        
            //  middleware di autenticazione
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
              req.user = user; // add user to req
              return next();
            });
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
              return next();
            });
        
            // Mock del controller
            jest.spyOn(CartController.prototype, "checkoutCart").mockResolvedValueOnce(true);
        
            
            const response = await request(app).patch(baseURL + "/carts");
            expect(response.status).toBe(200);
            expect(CartController.prototype.checkoutCart).toHaveBeenCalled();
            // Verifica che `checkoutCart` sia stata chiamata con l'utente autenticato
            expect(CartController.prototype.checkoutCart).toHaveBeenCalledWith(user);
        
          }, 10000); 
  });
  describe("GET /history", () => {
    // Test succes case:
    test("It returns the cart history for the logged in user with status 200", async() => {
      const user = { username: "customer" };
      
  
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        req.user = user;
        return next();
      });
      jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
        return next();
      });
      jest.spyOn(CartController.prototype, "getCustomerCarts").mockResolvedValueOnce([testCart]);
  
      const response = await request(app).get(baseURL + "/carts/history");
      expect(response.status).toBe(200);
      expect(response.body).toEqual([testCart]);
      expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledWith(user);
    });
  
    // Test error:
    test("It handles errors and returns the appropriate error status", async() => {
      const user = { username: "customer" };
      const error = new Error("Errore di test");
      const next = jest.fn();
  
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        req.user = user;
        return next();
      });
      jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
        return next();
      });
      jest.spyOn(CartController.prototype, "getCustomerCarts").mockRejectedValueOnce(error);
  
      const response = await request(app).get(baseURL + "/carts/history");
      expect(response.status).not.toBe(200);
    });
  });
  
  describe("DELETE /products/:model", () => {
    const user = { username: "customer" };
    const model = "iPhone13";
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        req.user = user;
        return next();
    });
    jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
        return next();
    });
    jest.spyOn(CartController.prototype, "removeProductFromCart").mockResolvedValueOnce(true);
    
  
    test("It removes a product from the cart for the logged in user", async() => {
      //ezelectronics/carts/products/:model
      const response = await request(app).delete(`${baseURL}/carts/products/${model}`);
      expect(response.status).toBe(200);
      expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledWith(user, model);
    });
  
    test("It handles errors when removing a product from the cart", async() => {
      const errorMessage = "Product not found";
      jest.spyOn(CartController.prototype, "removeProductFromCart").mockRejectedValueOnce(new Error(errorMessage));
  
      const response = await request(app).delete(`${baseURL}/carts/products/${model}`);
      expect(response.status).not.toBe(200);
    });
  });
   

  describe("DELETE /current", () => {
    test("It clears the cart for the logged in user", async() => {
      const user = { username: "customer" };
  
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        req.user = user;
        return next();
      });
      jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
        return next();
      });
      jest.spyOn(CartController.prototype, "clearCart").mockResolvedValueOnce(true);
  
      const response = await request(app).delete(baseURL + "/carts/current");
      expect(response.status).toBe(200);
      expect(CartController.prototype.clearCart).toHaveBeenCalledWith(user);
    });
  
    test("It handles errors when clearing the cart", async() => {
      const user = { username: "customer" };
      const error = new Error("Errore durante la pulizia del carrello");
  
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        req.user = user;
        return next();
      });
      jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
        return next();
      });
      jest.spyOn(CartController.prototype, "clearCart").mockRejectedValueOnce(error);
  
      const response = await request(app).delete(baseURL + "/carts/current");
      expect(response.status).not.toBe(200);
    });
  });
  
  describe("DELETE /", () => {
    test("It deletes all carts", async() => {
      // Setup dei mock per i middleware di autenticazione
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        return next();
      });
      jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
        return next();
      });
      jest.spyOn(CartController.prototype, "deleteAllCarts").mockResolvedValueOnce(true);
  
      // Esegui la richiesta DELETE
      const response = await request(app).delete(baseURL+"/carts");
      expect(response.status).toBe(200);
      expect(CartController.prototype.deleteAllCarts).toHaveBeenCalled();
    });
  
    test("It handles errors when deleting all carts", async() => {
      const error = new Error("Errore durante l'eliminazione dei carrelli");
  
      // Setup dei mock per i middleware di autenticazione
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        return next();
      });
      jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
        return next();
      });
      jest.spyOn(CartController.prototype, "deleteAllCarts").mockRejectedValueOnce(error);
  
      // Esegui la richiesta DELETE
      const response = await request(app).delete(baseURL+"/carts");
      expect(response.status).not.toBe(200);
    });
  });
  
  describe("GET /all", () => {
    test("It retrieves all carts for admin or manager", async() => {
      const user = { username: "admin" }; 
  
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        req.user = user;
        return next();
      });
      jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
        return next();
      });
      const carts = [testCart]; 
      jest.spyOn(CartController.prototype, "getAllCarts").mockResolvedValueOnce(carts);
  
      const response = await request(app).get(baseURL + "/carts/all");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(carts);
      expect(CartController.prototype.getAllCarts).toHaveBeenCalled();
    });
  
    test("It handles errors when retrieving all carts", async() => {
      const user = { username: "admin" };
  
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        req.user = user;
        return next();
      });
      jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
        return next();
      });
      const error = new Error("Errore durante il recupero dei carrelli");
      jest.spyOn(CartController.prototype, "getAllCarts").mockRejectedValueOnce(error);
  
      const response = await request(app).get(baseURL + "/carts/all");
      expect(response.status).not.toBe(200);
    });
  });
  

})

/*
describe("POST /users", () => {
        //We are testing a route that creates a user. This route calls the createUser method of the UserController, uses the express-validator 'body' method to validate the input parameters and the ErrorHandler to validate the request
        //All of these dependencies are mocked to test the route in isolation
        //For the success case, we expect that the dependencies all work correctly and the route returns a 200 success code
        test("It should return a 200 success code", async () => {
            const inputUser = { username: "test", name: "test", surname: "test", password: "test", role: "Manager" }
            //We mock the express-validator 'body' method to return a mock object with the methods we need to validate the input parameters
            //These methods all return an empty object, because we are not testing the validation logic here (we assume it works correctly)
            jest.mock('express-validator', () => ({
                body: jest.fn().mockImplementation(() => ({
                    isString: () => ({ isLength: () => ({}) }),
                    isIn: () => ({ isLength: () => ({}) }),
                })),
            }))
            //We mock the ErrorHandler validateRequest method to return the next function, because we are not testing the validation logic here (we assume it works correctly)
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            })
            //We mock the UserController createUser method to return true, because we are not testing the UserController logic here (we assume it works correctly)
            jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true)

            /*We send a request to the route we are testing. We are in a situation where:
                - The input parameters are 'valid' (= the validation logic is mocked to be correct)
                - The user creation function is 'successful' (= the UserController logic is mocked to be correct)
              We expect the 'createUser' function to have been called with the input parameters and to return a 200 success code
              Since we mock the dependencies and we are testing the route in isolation, we do not need to check that the user has actually been created
            
              const response = await request(app).post(baseURL + "/users").send(inputUser)
              expect(response.status).toBe(200)
              expect(UserController.prototype.createUser).toHaveBeenCalled()
              expect(UserController.prototype.createUser).toHaveBeenCalledWith(inputUser.username, inputUser.name, inputUser.surname, inputUser.password, inputUser.role)
          })
      })
*/

/*
this.router.post(
            "/",
            body("username").isString().isLength({ min: 1 }),
            body("surname").isString().isLength({ min: 1 }),
            body("name").isString().isLength({ min: 1 }),
            body("password").isString().isLength({ min: 1 }),
            body("role").isString().isIn(["Manager", "Customer", "Admin"]),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => this.controller.createUser(req.body.username, req.body.name, req.body.surname, req.body.password, req.body.role)
                .then(() => res.status(200).end())
                .catch((err) => {
                    next(err)
                })
        )
*/