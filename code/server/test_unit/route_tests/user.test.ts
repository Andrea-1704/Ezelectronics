import {expect, jest, test} from "@jest/globals"
// @ts-ignore
import request from 'supertest'
import {app} from "../../index"

import UserController from "../../src/controllers/userController"
import {Role} from "../../src/components/user";
import Authenticator from "../../src/routers/auth";
import {UserNotAdminError} from "../../src/errors/userError";

const baseURL = "/ezelectronics"

jest.mock("../../src/controllers/userController")
jest.mock("../../src/dao/userDAO")
jest.mock("../../src/routers/auth")

describe("User Routes", () => {

    describe("Create User", () => {
        afterEach(() => {
            jest.clearAllMocks()
        })

        //test manager
        test("Create Manager should return 200", async () => {
            const testUser = { //Define a test user object sent to the route
                username: "test",
                name: "test",
                surname: "test",
                password: "test",
                role: Role.MANAGER
            }
            jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true) //Mock the createUser method of the controller
            const response = await request(app).post(baseURL + "/users").send(testUser) //Send a POST request to the route
            expect(response.status).toBe(200) //Check if the response status is 200
            expect(UserController.prototype.createUser).toHaveBeenCalledTimes(1) //Check if the createUser method has been called once
            //Check if the createUser method has been called with the correct parameters
            expect(UserController.prototype.createUser).toHaveBeenCalledWith(testUser.username,
                testUser.name,
                testUser.surname,
                testUser.password,
                testUser.role)
        })

        //test customer
        test("Create Customer should return 200", async () => {
            const testUser = { //Define a test user object sent to the route
                username: "test",
                name: "test",
                surname: "test",
                password: "test",
                role: Role.CUSTOMER
            }
            jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true) //Mock the createUser method of the controller
            const response = await request(app).post(baseURL + "/users").send(testUser) //Send a POST request to the route
            expect(response.status).toBe(200) //Check if the response status is 200
            expect(UserController.prototype.createUser).toHaveBeenCalledTimes(1) //Check if the createUser method has been called once
            //Check if the createUser method has been called with the correct parameters
            expect(UserController.prototype.createUser).toHaveBeenCalledWith(testUser.username,
                testUser.name,
                testUser.surname,
                testUser.password,
                testUser.role)
        })

        //test admin
        test("Create admin should return 200", async () => {
            const testUser = { //Define a test user object sent to the route
                username: "test",
                name: "test",
                surname: "test",
                password: "test",
                role: Role.ADMIN
            }
            jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true) //Mock the createUser method of the controller
            const response = await request(app).post(baseURL + "/users").send(testUser) //Send a POST request to the route
            expect(response.status).toBe(200) //Check if the response status is 200
            expect(UserController.prototype.createUser).toHaveBeenCalledTimes(1) //Check if the createUser method has been called once
            //Check if the createUser method has been called with the correct parameters
            expect(UserController.prototype.createUser).toHaveBeenCalledWith(testUser.username,
                testUser.name,
                testUser.surname,
                testUser.password,
                testUser.role)
        })

        //empty name
        test("Empty name should return 422", async () => {
            const testUser = { //Define a test user object sent to the route
                username: "test",
                name: "",
                surname: "test",
                password: "test",
                role: Role.MANAGER
            }
            jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true) //Mock the createUser method of the controller
            const response = await request(app).post(baseURL + "/users").send({}) //Send a POST request to the route
            expect(response.status).toBe(422) //Check if the response status is 422
            expect(UserController.prototype.createUser).toHaveBeenCalledTimes(0) //Check if the createUser method has not been called
        })

        //empty surname
        test("Empty surname should return 422", async () => {
            const testUser = { //Define a test user object sent to the route
                username: "test",
                name: "test",
                surname: "",
                password: "test",
                role: Role.MANAGER
            }
            jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true) //Mock the createUser method of the controller
            const response = await request(app).post(baseURL + "/users").send({}) //Send a POST request to the route
            expect(response.status).toBe(422) //Check if the response status is 422
            expect(UserController.prototype.createUser).toHaveBeenCalledTimes(0) //Check if the createUser method has not been called
        })

        //empty password
        test("Empty password should return 422", async () => {
            const testUser = { //Define a test user object sent to the route
                username: "test",
                name: "test",
                surname: "test",
                password: "",
                role: Role.MANAGER
            }
            jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true) //Mock the createUser method of the controller
            const response = await request(app).post(baseURL + "/users").send({}) //Send a POST request to the route
            expect(response.status).toBe(422) //Check if the response status is 422
            expect(UserController.prototype.createUser).toHaveBeenCalledTimes(0) //Check if the createUser method has not been called
        })

        //wrong role
        test("invalid role should return 422", async () => {
            const testUser = { //Define a test user object sent to the route
                username: "test",
                name: "test",
                surname: "test",
                password: "test",
                role: "Super Admin"
            }
            jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true) //Mock the createUser method of the controller
            const response = await request(app).post(baseURL + "/users").send({}) //Send a POST request to the route
            expect(response.status).toBe(422) //Check if the response status is 422
            expect(UserController.prototype.createUser).toHaveBeenCalledTimes(0) //Check if the createUser method has not been called
        })

        //empty role
        test("empty role should return 422", async () => {
            const testUser = { //Define a test user object sent to the route
                username: "test",
                name: "test",
                surname: "test",
                password: "test",
                role: ""
            }
            jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true) //Mock the createUser method of the controller
            const response = await request(app).post(baseURL + "/users").send({}) //Send a POST request to the route
            expect(response.status).toBe(422) //Check if the response status is 422
            expect(UserController.prototype.createUser).toHaveBeenCalledTimes(0) //Check if the createUser method has not been called
        })

    })

    describe("Get Users", () => {
        beforeEach(() => {

        })

        afterEach(() => {
            jest.clearAllMocks()
            jest.restoreAllMocks()
            jest.resetAllMocks()
        })

        test("Get Users should return 200", async () => {
            const user = {
                username: "test",
                name: "test",
                surname: "test",
                password: "test",
                role: Role.MANAGER,
                address: "test",
                birthdate: "test"
            }

            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req: any, res: any, next: any) => {
                return next()
            })

            jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req: any, res: any, next: any) => {
                return next()
            })

            jest.spyOn(UserController.prototype, "getUsers").mockResolvedValueOnce([user])

            const response = await request(app).get(baseURL + "/users")
            expect(response.status).toBe(200)
            expect(UserController.prototype.getUsers).toHaveBeenCalledTimes(1)
            expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1)
            expect(Authenticator.prototype.isAdmin).toHaveBeenCalledTimes(1)
        })


        describe("Get Users should return 401", () => {
            test("Not logged in", async () => {
                jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req: any, res: any, next: any) => {
                    return res.status(401).json({error: "Unauthenticated user", status: 401})
                })

                const response = await request(app).get(baseURL + "/users")
                expect(response.status).toBe(401)
                expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1)
            })

            test("Not an admin", async () => {
                jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req: any, res: any, next: any) => {
                    return next()
                })

                jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req: any, res: any, next: any) => {
                    return res.status(401).json({error: "User is not an admin", status: 401})
                })

                const response = await request(app).get(baseURL + "/users")
                expect(response.status).toBe(401)
                expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1)
                expect(Authenticator.prototype.isAdmin).toHaveBeenCalledTimes(1)
            })
        })
    })

    describe("Get Users By role", () => {
        beforeEach(() => {

        })

        afterEach(() => {
            jest.clearAllMocks()
            jest.restoreAllMocks()
            jest.resetAllMocks()
        })

        test("Get Users should return 200", async () => {
            const user = {
                username: "test",
                name: "test",
                surname: "test",
                password: "test",
                role: Role.MANAGER,
                address: "test",
                birthdate: "test"
            }

            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req: any, res: any, next: any) => {
                return next()
            })

            jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req: any, res: any, next: any) => {
                return next()
            })

            jest.spyOn(UserController.prototype, "getUsersByRole").mockResolvedValueOnce([user])

            const response = await request(app).get(baseURL + "/users/roles/Manager")
            expect(response.status).toBe(200)
            expect(response.body).toEqual([user])
            expect(UserController.prototype.getUsersByRole).toHaveBeenCalledTimes(1)
            expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1)
            expect(Authenticator.prototype.isAdmin).toHaveBeenCalledTimes(1)
        })


        describe("Get Users should return 401", () => {
            test("Not logged in", async () => {
                jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req: any, res: any, next: any) => {
                    return res.status(401).json({error: "Unauthenticated user", status: 401})
                })

                const response = await request(app).get(baseURL + "/users/roles/Manager")
                expect(response.status).toBe(401)
                expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1)
            })

            test("Not an admin", async () => {
                jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req: any, res: any, next: any) => {
                    return next()
                })

                jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req: any, res: any, next: any) => {
                    return res.status(401).json({error: "User is not an admin", status: 401})
                })

                const response = await request(app).get(baseURL + "/users/roles/Manager")
                expect(response.status).toBe(401)
                expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1)
                expect(Authenticator.prototype.isAdmin).toHaveBeenCalledTimes(1)
            })
        })


        describe("Get Users should return 422", () => {
            test("Invalid role", async () => {
                jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req: any, res: any, next: any) => {
                    return next()
                })

                jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req: any, res: any, next: any) => {
                    return next()
                })

                const response = await request(app).get(baseURL + "/users/roles/Super Admin")
                expect(response.status).toBe(422)
                expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1)
                expect(Authenticator.prototype.isAdmin).toHaveBeenCalledTimes(1)
            })
        })
    })

    describe("Get User by username", () => {
        beforeEach(() => {

        })

        afterEach(() => {
            jest.clearAllMocks()
            jest.restoreAllMocks()
            jest.resetAllMocks()
        })

        //get their own profile
        test("Get User by username should return 200", async () => {
            const user = {
                username: "test",
                name: "test",
                surname: "test",
                password: "test",
                role: Role.MANAGER,
                address: "test",
                birthdate: "test"
            }

            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req: any, res: any, next: any) => {
                return next()
            })

            jest.spyOn(UserController.prototype, "getUserByUsername").mockResolvedValueOnce(user)

            const response = await request(app).get(baseURL + "/users/test")
            expect(response.status).toBe(200)
            expect(response.body).toEqual(user)
            expect(UserController.prototype.getUserByUsername).toHaveBeenCalledTimes(1)
            expect(UserController.prototype.getUserByUsername).toHaveBeenCalledWith(user, "test")
            expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1)
        })
        //admin user get user different from their own
        test("Get User by username should return 200", async () => {
            const user = {
                username: "manager",
                name: "test",
                surname: "test",
                password: "test",
                role: Role.MANAGER,
                address: "test",
                birthdate: "test"
            }

            const adminUser = {
                username: "admin",
                name: "test",
                surname: "test",
                password: "test",
                role: Role.ADMIN,
                address: "test",
                birthdate: "test"
            }

            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req: any, res: any, next: any) => {
                return next()
            })

            jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req: any, res: any, next: any) => {
                return next()
            })

            jest.spyOn(UserController.prototype, "getUserByUsername").mockResolvedValueOnce(user)

            const response = await request(app).get(baseURL + "/users/test")
            expect(response.status).toBe(200)
            expect(response.body).toEqual(user)
            expect(UserController.prototype.getUserByUsername).toHaveBeenCalledTimes(1)
            expect(UserController.prototype.getUserByUsername).toHaveBeenCalledWith(adminUser, user.username)
            expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1)
            expect(Authenticator.prototype.isAdmin).toHaveBeenCalledTimes(1)
        })

        test("customer user trying to get a different user should return 401", async () => {
            const customer1 = {
                username: "customer1",
                name: "customer_1",
                surname: "customer_1",
                password: "customer_1",
                role: Role.CUSTOMER,
                address: "customer_1",
                birthdate: "1990-01-01"
            };

            const customer2 = {
                username: "customer2",
                name: "customer_2",
                surname: "customer_2",
                password: "customer_2",
                role: Role.CUSTOMER,
                address: "customer_2",
                birthdate: "1990-01-01"
            };

            // Mock the authenticator to simulate logged-in user
            jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
                req.user = customer1; // Assume customer1 is the logged-in user
                return next();
            });

            // Mock the UserController.getUserByUsername to not return anything as we expect the route to error out before that
            jest.spyOn(UserController.prototype, 'getUserByUsername').mockImplementation(() => {
                return Promise.reject(new UserNotAdminError());
            });

            const response = await request(app).get(baseURL + "/users/customer2");

            expect(response.status).toBe(401);
            expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
            expect(UserController.prototype.getUserByUsername).toHaveBeenCalledTimes(0);
        });

        test("Manager user trying to get a different user's info should return 401", async () => {
            const manager = {
                username: "manager_user",
                name: "Manager",
                surname: "User",
                password: "manager_password",
                role: Role.MANAGER,
                address: "Manager Address",
                birthdate: "1985-01-01"
            };

            const customer = {
                username: "customer_user",
                name: "Customer",
                surname: "User",
                password: "customer_password",
                role: Role.CUSTOMER,
                address: "Customer Address",
                birthdate: "1990-01-01"
            };

            // Mock the authenticator to simulate logged-in user
            jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
                req.user = manager; // Assume manager is the logged-in user
                return next();
            });

            // Mock the UserController.getUserByUsername to not return anything as we expect the route to error out before that
            jest.spyOn(UserController.prototype, 'getUserByUsername').mockImplementation(() => {
                return Promise.reject(new UserNotAdminError());
            });

            const response = await request(app).get(`${baseURL}/users/${customer.username}`);

            expect(response.status).toBe(401);
            expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
            expect(UserController.prototype.getUserByUsername).toHaveBeenCalledTimes(0);
        });


    });

    describe("Delete User", () => {
        beforeEach(() => {

        })

        afterEach(() => {
            jest.clearAllMocks()
            jest.restoreAllMocks()
            jest.resetAllMocks()
        })

        //delete their own profile
        test("Delete User should return 200", async () => {
            const user = {
                username: "test",
                name: "test",
                surname: "test",
                password: "test",
                role: Role.MANAGER,
                address: "test",
                birthdate: "test"
            }

            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req: any, res: any, next: any) => {
                return next()
            })

            jest.spyOn(UserController.prototype, "deleteUser").mockResolvedValueOnce(true)

            const response = await request(app).delete(baseURL + "/users/test")
            expect(response.status).toBe(200)
            expect(UserController.prototype.deleteUser).toHaveBeenCalledTimes(1)
            expect(UserController.prototype.deleteUser).toHaveBeenCalledWith(user, "test")
            expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1)
        })
        //admin user delete a different user
        test("Delete User should return 200", async () => {
            const user = {
                username: "manager",
                name: "test",
                surname: "test",
                password: "test",
                role: Role.MANAGER,
                address: "test",
                birthdate: "test"
            }

            const adminUser = {
                username: "admin",
                name: "test",
                surname: "test",
                password: "test",
                role: Role.ADMIN,
                address: "test",
                birthdate: "test"
            }

            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req: any, res: any, next: any) => {
                return next()
            })

            jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req: any, res: any, next: any) => {
                return next()
            })

            jest.spyOn(UserController.prototype, "deleteUser").mockResolvedValueOnce(true)

            const response = await request(app).delete(baseURL + "/users/test")
            expect(response.status).toBe(200)
            expect(UserController.prototype.deleteUser).toHaveBeenCalledTimes(1)
            expect(UserController.prototype.deleteUser).toHaveBeenCalledWith(adminUser, user.username)
            expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1)
            expect(Authenticator.prototype.isAdmin).toHaveBeenCalledTimes(1)
        })

        test("Non-admin user (Customer) trying to delete another user should return 401", async () => {
            const customer1 = {
                username: "customer1",
                name: "customer_1",
                surname: "customer_1",
                password: "customer_1",
                role: Role.CUSTOMER,
                address: "customer_1",
                birthdate: "1990-01-01"
            };

            const customer2 = {
                username: "customer2",
                name: "customer_2",
                surname: "customer_2",
                password: "customer_2",
                role: Role.CUSTOMER,
                address: "customer_2",
                birthdate: "1990-01-01"
            };

            jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
                req.user = customer1;
                req.params.username = customer2.username;
                return next();
            });

            jest.spyOn(UserController.prototype, 'getUserByUsername').mockResolvedValue(customer2);

            const response = await request(app).delete(`${baseURL}/users/${customer2.username}`);

            expect(response.status).toBe(401);
            expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
            expect(UserController.prototype.getUserByUsername).toHaveBeenCalledTimes(0);
        });

        test("Manager user trying to delete another user should return 401", async () => {
            const manager = {
                username: "manager_user",
                name: "Manager",
                surname: "User",
                password: "manager_password",
                role: Role.MANAGER,
                address: "Manager Address",
                birthdate: "1985-01-01"
            };

            const customer = {
                username: "customer_user",
                name: "Customer",
                surname: "User",
                password: "customer_password",
                role: Role.CUSTOMER,
                address: "Customer Address",
                birthdate: "1990-01-01"
            };

            jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
                req.user = manager;
                req.params.username = customer.username;
                return next();
            });

            const getUserByUsernameMock = jest.spyOn(UserController.prototype, 'getUserByUsername').mockResolvedValue(customer);

            const response = await request(app).delete(`${baseURL}/users/${customer.username}`);

            expect(response.status).toBe(401);
            expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
            expect(UserController.prototype.getUserByUsername).toHaveBeenCalledTimes(0);
        });
    });
})