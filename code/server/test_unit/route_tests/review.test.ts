import { describe, test, expect, beforeAll, afterAll, jest } from "@jest/globals";
import { User, Role } from "../../src/components/user";
import { Category, Product } from "../../src/components/product";
import ReviewController from "../../src/controllers/reviewController";
import { ProductReview } from "../../src/components/review";
import request from "supertest";
import { app } from "../../index";
import ErrorHandler from "../../src/helper";
import Authenticator from "../../src/routers/auth";
import { isString } from "node:util";
import exp from "node:constants";
const baseURL = "/ezelectronics";

let testCustomer = new User("customer", "customer", "customer", Role.CUSTOMER, "", "");
let testProduct = new Product(10, "iphone13", Category.SMARTPHONE, "10-04-2002", " ", 3);
let testReviews = new ProductReview("iphone13", "username", 3, "25-04-2022", "comment");

jest.mock("../../src/controllers/reviewController");
jest.mock("../../src/routers/auth");

describe("Route Review Unit Tests", () => {

    //POST /:model
    describe("add review", () => {
        test("it adds a review to the corresponding product", async () => {
            const user = {
                username: "customer1",
                name: "john",
                surname: "smith",
                role: Role.CUSTOMER,
                address: "address1",
                birthdate: "2004-12-06"
            };
            const model = "iphone13";
            const score = 4;
            const comment = "test_comment";

            const mockIsLoggedIn = jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                return next();
            });
            const mockIsCustomer = jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return next();
            });
            jest.mock('express-validator', () => ({
                param: jest.fn().mockImplementation(() => ({
                    isString: () => ({ notEmpty: () => ({}) }),
                })),
                body: jest.fn().mockImplementation((field) => {
                    if (field === 'score') {
                        return {
                            isInt: ({ min, max }: {min:number; max: number}) => {
                                if (min === 1 && max === 5) {
                                    return {};
                                }
                                return { custom: () => ({}) };
                            },
                        };
                    };
                    if (field === 'comment') {
                        return { optional: () => ({ isString: () => ({}) }) };
                    }
                    return {};
                }),
            }));
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next();
            });
            jest.spyOn(ReviewController.prototype, "addReview").mockResolvedValueOnce();

            const response = await request(app).post(`${baseURL}/reviews/${model}`).send({ score, comment });
            expect(response.status).toBe(200);
            expect(mockIsLoggedIn).toHaveBeenCalledTimes(1);
            expect(mockIsCustomer).toHaveBeenCalledTimes(1);
            expect(ReviewController.prototype.addReview).toHaveBeenLastCalledWith(user, model);
        }, 1000);

        test("it returns an error if one is thrown", async () => {
            const error = new Error("testing error");
            const user = {
                username: "customer1",
                name: "john",
                surname: "smith",
                role: Role.CUSTOMER,
                address: "address1",
                birthdate: "2004-12-06"
            };
            const model = "iphone13";
            const score = 4;
            const comment = "test_comment";

            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = user;
                return next();
            });
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return next();
            });
            jest.mock('express-validator', () => ({
                param: jest.fn().mockImplementation(() => ({
                    isString: () => ({ notEmpty: () => ({}) }),
                })),
                body: jest.fn().mockImplementation((field) => {
                    if (field === 'score') {
                        return {
                            isInt: ({ min, max }: {min:number; max: number}) => {
                                if (min === 1 && max === 5) {
                                    return {};
                                }
                                return { custom: () => ({}) };
                            },
                        };
                    };
                    if (field === 'comment') {
                        return { optional: () => ({ isString: () => ({}) }) };
                    }
                    return {};
                }),
            }));
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next();
            });
            jest.spyOn(ReviewController.prototype, "addReview").mockRejectedValueOnce(error);

            const response = await request(app).post(`${baseURL}/reviews/${model}`).send({ score, comment });
            expect(response.status).not.toBe(200);
            expect(ReviewController.prototype.addReview).toHaveBeenCalled();
            expect(ReviewController.prototype.addReview).toHaveBeenLastCalledWith(user, model);
        }, 1000);
    });


    //GET /:model
    describe("Get Product Reviews", () => {
        test("it returns the reviews of the corresponding product model", async () => {
            const model = "iphone13";
            const mockIsLoggedIn = jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                return next();
            });
            jest.mock('express-validator', () => ({
                body: jest.fn().mockImplementation(() => ({
                    isString: () => ({ notEmpty: () => ({}) }),
                })),
            }));
            jest.spyOn(ReviewController.prototype, "getProductReviews").mockResolvedValueOnce([testReviews]);

            const response = await request(app).get(`${baseURL}/reviews/${model}`);
            expect(response.status).toBe(200);
            expect(ReviewController.prototype.getProductReviews).toHaveBeenCalledWith(model);
            expect(mockIsLoggedIn).toHaveBeenCalledTimes(1);
            expect(response.body).toEqual([testReviews]);
        });
``
        test("it handles error", async () => {
            const error = new Error("Testing Error");
            const user = {
                username: "customer1",
                name: "john",
                surname: "smith",
                role: Role.CUSTOMER,
                address: "address1",
                birthdate: "2004-12-06"
            };
            const model = "iphone13";
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = user;
                return next();
            });
            jest.spyOn(ReviewController.prototype, "getProductReviews").mockRejectedValueOnce(error);
            const response = await request(app).get(`${baseURL}/reviews/${model}`);
            expect(response.status).not.toBe(200);
        });
    });

    describe("DELETE /reviews/:model", () => {

        test("it deletes the reviews made by the current user on the corresponding product", async () => {
            const model = "iphone13";
            const user = { username: "customer" };
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = user;
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
            jest.spyOn(ReviewController.prototype, "deleteReview").mockResolvedValueOnce();

            const response = await request(app).delete(`${baseURL}/reviews/${model}`);
            expect(response.status).toBe(200);
            expect(ReviewController.prototype.deleteReview).toHaveBeenCalledWith(model, user);
        });

        test("it deletes the reviews made by the current user on the corresponding product", async () => {
            const error = new Error("testing error");
            const model = "iphone13";
            const user = { username: "customer" };
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = user;
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
            jest.spyOn(ReviewController.prototype, "deleteReview").mockRejectedValueOnce(error);

            const response = await request(app).delete(`${baseURL}/reviews/${model}`);
            expect(response.status).toBe(200);
            expect(ReviewController.prototype.deleteReview).toHaveBeenCalledWith(model, user);
        });

    });

    describe("DELETE /reviews/:model/all", () => {
        test("it deletes the reviews made by the current user on the corresponding product", async () => {
            const model = "iphone13";
            const user = { username: "manager" };
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = user;
                return next();
            });

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            });
            jest.mock('express-validator', () => ({
                param: jest.fn().mockImplementation(() => ({
                    isString: () => ({ notEmpty: () => ({}) }),
                })),
            }));
            jest.spyOn(ReviewController.prototype, "deleteReviewsOfProduct").mockResolvedValueOnce();

            const response = await request(app).delete(`${baseURL}/reviews/${model}/all`);
            expect(response.status).toBe(200);
            expect(ReviewController.prototype.deleteReviewsOfProduct).toHaveBeenCalledWith(model);
        });

        test("it handles errors while deleting all reviews on product", async () => {
            const model = "iphone13";
            const error = new Error("error while deleting reviews");

            jest.mock('express-validator', () => ({
                body: jest.fn().mockImplementation(() => ({
                    isString: () => ({ notEmpty: () => ({}) }),
                })),
            }));
            jest.spyOn(ReviewController.prototype, "deleteReviewsOfProduct").mockRejectedValueOnce(error);

            const response = await request(app).delete(`${baseURL}/reviews/${model}/all`);
            expect(ReviewController.prototype.deleteAllReviews).toHaveBeenCalledWith(model);
            expect(response.status).not.toBe(200);
        });
    });
    

    describe("DELETE /reviews", () => {

        test("it deletes the reviews made by the current user on the corresponding product", async () => {
            const model = "iphone13";
            const user = { username: "manager" };
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = user;
                return next();
            });
            //is admin or manager?
            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            });
            jest.mock('express-validator', () => ({
                body: jest.fn().mockImplementation(() => ({
                    isString: () => ({ notEmpty: () => ({}) }),
                })),
            }));
            jest.spyOn(ReviewController.prototype, "deleteAllReviews").mockResolvedValueOnce();

            const response = await request(app).delete(`${baseURL}/reviews`);
            expect(ReviewController.prototype.deleteAllReviews).toHaveBeenCalled();
            expect(response.status).toBe(200);
        });

        test("it handles errors while deleting all reviews made by user on product", async () => {
            const model = "iphone13";
            const user = { username: "manager" };
            const error = new Error("error while deleting reviews");
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = user;
                return next();
            });
            //is admin or manager?
            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            });
            jest.mock('express-validator', () => ({
                body: jest.fn().mockImplementation(() => ({
                    isString: () => ({ notEmpty: () => ({}) }),
                })),
            }));
            jest.spyOn(ReviewController.prototype, "deleteAllReviews").mockRejectedValueOnce(error);

            const response = await request(app).delete(`${baseURL}/reviews`);
            expect(ReviewController.prototype.deleteAllReviews).toHaveBeenCalled();
            expect(response.status).not.toBe(200);
        });

    });
});

