import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
// @ts-ignore
import request from 'supertest';
import Authenticator from "../../src/routers/auth";
import ErrorHandler from "../../src/helper";
import UserController from "../../src/controllers/userController";
import { User, Role } from "../../src/components/user";
import { cleanup } from "../../src/db/cleanup";
import { app } from "../../index";
import express from 'express';
import passport, { use } from 'passport';
import LocalStrategy from 'passport-local';
import UserDAO from '../../src/dao/userDAO';


describe("Authenticator", () => {
    let app: express.Application;
    let authenticator: Authenticator;

    beforeEach(() => {
        app = express();
        authenticator=new Authenticator(app);
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    describe("initAuth", () => {
        test("Should inizialize session and passport", () => {
            jest.spyOn(app, 'use');
            jest.spyOn(passport, 'use');
            jest.spyOn(passport, "serializeUser");    
            jest.spyOn(passport, "deserializeUser");
            
            authenticator.initAuth();

            expect(app.use).toHaveBeenCalledWith(expect.any(Function));
            expect(passport.use).toHaveBeenCalledWith(
                expect.any(LocalStrategy),
            );
        })
    })

    describe("deserialize user test2", () => {
        test("deserialization should catch errors", () => {
            jest.spyOn(app, 'use');
            jest.spyOn(passport, 'use');
            jest.spyOn(passport, "serializeUser");    
            jest.spyOn(passport, "deserializeUser");
            
            authenticator.initAuth();
            
            jest.spyOn(
                UserDAO.prototype,
                "getUserByUsername",
            ).mockRejectedValue(new Error("Error"));

            const done = jest.fn();

            const user = {username: "test"};

            try{
                passport.deserializeUser(user, done);
            }catch(e){
                expect(1).toBe(2);
            }
        })
    })
    

    describe("Authentication of the user", () => {
        describe("isCustomer test", () => {
            test("isCustomer error because user is not customer ", async () => {
                const req = {
                    isAuthenticated: jest.fn().mockReturnValue(true),
                    user: {role: Role.MANAGER}
                };

                const res = {status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn()};
                const next = jest.fn();

                authenticator.isCustomer(req, res, next);

                expect(req.isAuthenticated).toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.json).toHaveBeenCalledWith({
                    error: "User is not a customer",
                    status: 401
                })
                expect(next).not.toHaveBeenCalled();
            })
        })
    })

    describe("IsManager", () => {
            test("Should call next middleware if user is authenticates and is a manager ", async () => {
                const req = {
                    isAuthenticated: jest.fn().mockReturnValue(true),
                    user: {role: Role.MANAGER}
                };

                const res = {};
                const next = jest.fn();

                authenticator.isManager(req, res, next);

                expect(req.isAuthenticated).toHaveBeenCalled();
                expect(next).toHaveBeenCalled();
            })
    })

    describe("isLoggedIn", () => {
        test("Should call next middleware if user is authenticated", async () => {
            const req = {
                isAuthenticated: jest.fn().mockReturnValue(true),
            };

            const res = {};
            const next = jest.fn();

            authenticator.isLoggedIn(req, res, next);

            expect(req.isAuthenticated).toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        })
    })

    describe("isAdmin", () => {
        test("Should call next middleware if user is authenticated and is an admin", async () => {
            const req = {
                isAuthenticated: jest.fn().mockReturnValue(true),
                user: {role: Role.ADMIN}
            };

            const res = {};
            const next = jest.fn();

            authenticator.isAdmin(req, res, next);

            expect(req.isAuthenticated).toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        })
    })

    describe("isManager", () => {
        test("Should call next middleware if user is authenticated and is a manager", async () => {
            const req = {
                isAuthenticated: jest.fn().mockReturnValue(true),
                user: {role: Role.MANAGER}
            };

            const res = {};
            const next = jest.fn();

            authenticator.isManager(req, res, next);

            expect(req.isAuthenticated).toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        })
    })

    describe("isCustomer", () => {
        test("Should call next middleware if user is authenticated and is a customer", async () => {
            const req = {
                isAuthenticated: jest.fn().mockReturnValue(true),
                user: {role: Role.CUSTOMER}
            };

            const res = {};
            const next = jest.fn();

            authenticator.isCustomer(req, res, next);

            expect(req.isAuthenticated).toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        })
    })

    describe("isLoggedIn", () => {  
        test("isLoggedIn error because user is not authenticated", async () => {
            const req = {
                isAuthenticated: jest.fn().mockReturnValue(false)
            };

            const res = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() };
            const next = jest.fn();

            authenticator.isLoggedIn(req, res, next);

            expect(req.isAuthenticated).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: "Unauthenticated user",
                status: 401
            })
            expect(next).not.toHaveBeenCalled();
        })
    })

    describe("isAdmin", () => {
        test("isAdmin error because user is not authenticated", async () => {
            const req = {
                isAuthenticated: jest.fn().mockReturnValue(false)
            };

            const res = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() };
            const next = jest.fn();

            authenticator.isAdmin(req, res, next);

            expect(req.isAuthenticated).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: "User is not an admin",
                status: 401
            })
            expect(next).not.toHaveBeenCalled();
        })
    })

    describe("isManager", () => {
        test("isManager error because user is not authenticated", async () => {
            const req = {
                isAuthenticated: jest.fn().mockReturnValue(false)
            };

            const res = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() };
            const next = jest.fn();

            authenticator.isManager(req, res, next);

            expect(req.isAuthenticated).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: "User is not a manager",
                status: 401
            })
            expect(next).not.toHaveBeenCalled();
        })
    })

    describe("isCustomer", () => {
        test("isCustomer error because user is not authenticated", async () => {
            const req = {
                isAuthenticated: jest.fn().mockReturnValue(false)
            };

            const res = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() };
            const next = jest.fn();

            authenticator.isCustomer(req, res, next);

            expect(req.isAuthenticated).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: "User is not a customer",
                status: 401
            })
            expect(next).not.toHaveBeenCalled();
        })
    })  

    describe("isLoggedin error", () => {
        test("isLoggedIn error because user is not authenticated", async () => {
            const req = {
                isAuthenticated: jest.fn().mockReturnValue(false)
            };

            const res = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() };
            const next = jest.fn();

            authenticator.isLoggedIn(req, res, next);

            expect(req.isAuthenticated).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: "Unauthenticated user",
                status: 401
            })
            expect(next).not.toHaveBeenCalled();
        })
    })

    describe("isAdmin error", () => {
        test("isAdmin error because user is not authenticated", async () => {
            const req = {
                isAuthenticated: jest.fn().mockReturnValue(false)
            };

            const res = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() };
            const next = jest.fn();

            authenticator.isAdmin(req, res, next);

            expect(req.isAuthenticated).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: "User is not an admin",
                status: 401
            })
            expect(next).not.toHaveBeenCalled();
        })
    })

    describe("isAdminOrManager", () => {
        describe("isAdminOrManager", () => {
            test("Should call next middleware if user is authenticated and is an admin or manager", async () => {
                const req = {
                    isAuthenticated: jest.fn().mockReturnValue(true),
                    user: { role: Role.ADMIN }
                };

                const res = {};
                const next = jest.fn();

                authenticator.isAdminOrManager(req, res, next);

                expect(req.isAuthenticated).toHaveBeenCalled();
                expect(next).toHaveBeenCalled();
            })
        })

        describe("isAdminOrManager", () => {
            test("Should call next middleware if user is authenticated and is an admin or manager", async () => {
                const req = {
                    isAuthenticated: jest.fn().mockReturnValue(true),
                    user: { role: Role.MANAGER }
                };

                const res = {};
                const next = jest.fn();

                authenticator.isAdminOrManager(req, res, next);

                expect(req.isAuthenticated).toHaveBeenCalled();
                expect(next).toHaveBeenCalled();
            })
        })
    })

    describe("isAdminOrManager error", () => {
        test("isAdminOrManager error because user is not authenticated", async () => {
            const req = {
                isAuthenticated: jest.fn().mockReturnValue(false)
            };

            const res = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() };
            const next = jest.fn();

            authenticator.isAdminOrManager(req, res, next);

            expect(req.isAuthenticated).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: "User is not an admin or manager",
                status: 401
            })
            expect(next).not.toHaveBeenCalled();
        })

        
    })

    

    describe("logout test", () => {
        test("logout success", async () => {
            const req = {
                logout: jest.fn()
            };

            const res = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() };
            const next = jest.fn();

            authenticator.logout(req, res, next);

            expect(req.logout).toHaveBeenCalled();
        })
    })
    describe("logout error test", ()=>{
        test("logout error", async () => {
            const req = {
                logout: jest.fn().mockImplementation((cb: any) => cb(new Error("Error")))
            };

            const res = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() };
            const next = jest.fn();

            authenticator.logout(req, res, next);

            expect(req.logout).toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        })
    })
       

    describe("login", () => {
        test("login success", async () => {
            const req = {
                login: jest.fn().mockImplementation((user: any, cb: any) => cb(null)),
                body: { username: "test", password: "test" }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
                json: jest.fn()
            };
            const next = jest.fn();

            authenticator.initAuth();

            //mock passport authenticate
            passport.authenticate = jest.fn().mockImplementation((strategy: any, cb: any) => cb(null, req.body, null));

            // Call the login method
            await authenticator.login(req, res, next);

            expect(req.login).toHaveBeenCalled();
        })
    })

    
    
})