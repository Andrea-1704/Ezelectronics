import {describe, test, expect, beforeAll, afterAll, jest} from "@jest/globals";
import { User, Role } from "../../src/components/user";
import { Category, Product } from "../../src/components/product";
import ReviewController from "../../src/controllers/reviewController";
import request from "supertest";
import {app} from "../../index";
import ErrorHandler from "../../src/helper";
import { beforeEach } from "node:test";
import Authenticator from "../../src/routers/auth";
import { isString } from "node:util";
import exp from "node:constants";
const baseURL = "/ezelectronics";

let testCustomer = new User("customer", "customer", "customer", Role.CUSTOMER, "", "")
let testProduct= new Product(10, "iphone13", Category.SMARTPHONE, "10-04-2002"," " , 3);
let testReviews = [
    {
        model: "iphone13", 
        user: "username1", 
        score: 3, 
        date: "25-04-2022", 
        comment: "comment1"
    },
    {
        model: "iphone14",
        user: "username2", 
        score: 4, 
        date: "26-04-2023", 
        comment: "comment2"
    },
    {
        model: "iphone13", 
        user: "username3", 
        score: 4, 
        date: "13-11-2023", 
        comment: "comment3"
    }
];

jest.mock("../../src/controllers/reviewController");
jest.mock("../../src/routers/auth");

describe("Route unit tests", () => {
    describe("POST /reviews/:model", () => {
        test("it adds a review to the corresponding product", async() => {
            const user = {username: "customer"};
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
                            isInt: ({min, max}) => {
                                if (min === 1 && max === 5) {
                                    return {};
                                }
                                return { custom: () => ({})};
                            },
                        };
                    };
                    if (field === 'comment') {
                        return { optional: () => ({ isString: () => ({})})};
                    }
                    return {};
                }),
              }));
              jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next();
              });
              jest.spyOn(ReviewController.prototype, "addReview").mockResolvedValueOnce();

              const response = await request(app).post('{$baseURL}/reviews/${model}').send({score, comment});
              expect(response.status).toBe(200);
              expect(ReviewController.prototype.addReview).toHaveBeenCalled();
              expect(ReviewController.prototype.addReview).toHaveBeenLastCalledWith(user, model);
        }, 1000);
    });


    describe("GET /reviews/:model", () => {
        test("it returns the reviews of the corresponding product model", async() => {
            const model = "iphone13";
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                return next();
            });
            jest.mock('express-validator', () => ({
                body: jest.fn().mockImplementation(() => ({
                    isString: () => ({ notEmpty: () => ({}) }),
                })),
            }));
            jest.spyOn(ReviewController.prototype, "getProductReviews").mockResolvedValueOnce(testReviews);

            const response = await request(app).get('{$baseURL}/reviews/${model}');
            expect(response.status).toBe(200);
            expect(ReviewController.prototype.getProductReviews).toHaveBeenCalled();
            expect(ReviewController.prototype.getProductReviews).toHaveBeenCalledWith(model);
            expect(response.body).toEqual(testReviews);
        })
    })

    describe("DELETE /reviews/:model", () => {
        const model = "iphone13";
        const user = {username: "customer"};
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

        test("it deletes the reviews made by the current user on the corresponding product", async() => {
            const response = await request(app).delete('${baseURL}/reviews/${model}');
            expect(response.status).toBe(200);
            expect(ReviewController.prototype.deleteReview).toHaveBeenCalledWith(model, user);
        });

    });

    describe("DELETE /reviews/:model/all", () => {
        const model = "iphone13";
        const user = {username: "manager"};
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            req.user = user;
            return next();
        });
        //is admin or manager?
        jest.spyOn(Authenticator.prototype, "isManager").mockImplementation((req, res, next) => {
            return next();
        });
        jest.mock('express-validator', () => ({
            body: jest.fn().mockImplementation(() => ({
                isString: () => ({ notEmpty: () => ({}) }),
            })),
        }));
        jest.spyOn(ReviewController.prototype, "deleteReviewsOfProduct").mockResolvedValueOnce();

        test("it deletes the reviews made by the current user on the corresponding product", async() => {
            const response = await request(app).delete('${baseURL}/reviews/${model}/all');
            expect(response.status).toBe(200);
            expect(ReviewController.prototype.deleteReviewsOfProduct).toHaveBeenCalledWith(model);
        });
    });

    describe("DELETE /reviews", () => {
        const model = "iphone13";
        const user = {username: "manager"};
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            req.user = user;
            return next();
        });
        //is admin or manager?
        jest.spyOn(Authenticator.prototype, "isManager").mockImplementation((req, res, next) => {
            return next();
        });
        jest.mock('express-validator', () => ({
            body: jest.fn().mockImplementation(() => ({
                isString: () => ({ notEmpty: () => ({}) }),
            })),
        }));
        jest.spyOn(ReviewController.prototype, "deleteAllReviews").mockResolvedValueOnce();

        test("it deletes the reviews made by the current user on the corresponding product", async() => {
            const response = await request(app).delete('${baseURL}/reviews');
            expect(response.status).toBe(200);
            expect(ReviewController.prototype.deleteAllReviews).toHaveBeenCalled();
        });
    });
});


//fix the urls