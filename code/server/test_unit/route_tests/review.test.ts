import { afterEach, describe, test, expect, jest } from "@jest/globals";
import request from "supertest";
import { app } from "../../index";
import ReviewController from "../../src/controllers/reviewController";
import Authenticator from "../../src/routers/auth";
import { Role } from "../../src/components/user";
import { mockReview } from "../mocks/mocks_reviews";

const baseURL = "/ezelectronics";
jest.mock("../../src/controllers/reviewController");
jest.mock("../../src/routers/auth");

describe("Route Review Unit Tests", () => {
    afterEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    //POST /:model
    describe("Add Review Route", () => {
        test("should add a review to the corresponding product", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
            jest.spyOn(ReviewController.prototype, "addReview").mockResolvedValueOnce();

            const response = await request(app).post(`${baseURL}/reviews/${mockReview.model}`).send(mockReview);
            expect(response.status).toBe(200);
            expect(ReviewController.prototype.addReview).toHaveBeenCalledWith(mockReview);
        });

        test("should handle error if controller throws an error", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
            const error = new Error("Internal Server Error");
            jest.spyOn(ReviewController.prototype, "addReview").mockRejectedValueOnce(error);

            const response = await request(app).post(`${baseURL}/reviews/${mockReview.model}`).send(mockReview);
            expect(response.status).toBe(503);
            expect(response.body).toEqual({ error: "Internal Server Error", status: 503 });
        });
    });

    //GET /:model
    describe("Get Product Reviews", () => {
        test("should return the reviews of the corresponding product model", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
            jest.spyOn(ReviewController.prototype, "getProductReviews").mockResolvedValueOnce([mockReview]);

            const response = await request(app).get(`${baseURL}/reviews/${mockReview.model}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual([mockReview]);
        });

        test("should handle error if controller throws an error", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
            const error = new Error("Internal Server Error");
            jest.spyOn(ReviewController.prototype, "getProductReviews").mockRejectedValueOnce(error);

            const response = await request(app).get(`${baseURL}/reviews/${mockReview.model}`);
            expect(response.status).toBe(503);
            expect(response.body).toEqual({ error: "Internal Server Error", status: 503 });
        });
    });

    //DELETE /:model
    describe("Delete Review", () => {
        test("should delete the review made by the current user on the corresponding product", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = { username: "customer", role: Role.CUSTOMER };
                return next();
            });
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
            jest.spyOn(ReviewController.prototype, "deleteReview").mockResolvedValueOnce();

            const response = await request(app).delete(`${baseURL}/reviews/${mockReview.model}`);
            expect(response.status).toBe(200);
            expect(ReviewController.prototype.deleteReview).toHaveBeenCalledWith(mockReview.model, { username: "customer", role: Role.CUSTOMER });
        });

        test("should handle error if controller throws an error", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = { username: "customer", role: Role.CUSTOMER };
                return next();
            });
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
            const error = new Error("Internal Server Error");
            jest.spyOn(ReviewController.prototype, "deleteReview").mockRejectedValueOnce(error);

            const response = await request(app).delete(`${baseURL}/reviews/${mockReview.model}`);
            expect(response.status).toBe(503);
            expect(response.body).toEqual({ error: "Internal Server Error", status: 503 });
        });
    });

    //DELETE /:model/all
    describe("Delete Reviews of a Product", () => {
        test("should delete all reviews made by the current user on the corresponding product", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = { username: "manager", role: Role.MANAGER };
                return next();
            });
            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => next());
            jest.spyOn(ReviewController.prototype, "deleteReviewsOfProduct").mockResolvedValueOnce();

            const response = await request(app).delete(`${baseURL}/reviews/${mockReview.model}/all`);
            expect(response.status).toBe(200);
            expect(ReviewController.prototype.deleteReviewsOfProduct).toHaveBeenCalledWith(mockReview.model);
        });

        test("should handle error if controller throws an error", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = { username: "manager", role: Role.MANAGER };
                return next();
            });
            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => next());
            const error = new Error("Internal Server Error");
            jest.spyOn(ReviewController.prototype, "deleteReviewsOfProduct").mockRejectedValueOnce(error);

            const response = await request(app).delete(`${baseURL}/reviews/${mockReview.model}/all`);
            expect(response.status).toBe(503);
            expect(response.body).toEqual({ error: "Internal Server Error", status: 503 });
        });
    });

    //DELETE /
    describe("DELETE /reviews", () => {
        test("should return a 200 success code if the user is authenticated and admin or manager", async () => {
            jest.spyOn(ReviewController.prototype, "deleteAllReviews").mockResolvedValue();
            const mockIsLoggedIn = jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation(
                (req: any, res: any, next: any) => next()
            );
            const mockIsAdminOrManager = jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation(
                (req: any, res: any, next: any) => next()
            );
            
            const response = await request(app).delete(`${baseURL}/reviews/`);
            expect(response.status).toBe(200);
            expect(mockIsLoggedIn).toHaveBeenCalledTimes(1);
            expect(mockIsAdminOrManager).toHaveBeenCalledTimes(1);
            expect(ReviewController.prototype.deleteAllReviews).toHaveBeenCalled();
        });
    
        test("should return a 503 error code if the controller throws an error", async () => {
            jest.spyOn(ReviewController.prototype, "deleteAllReviews").mockRejectedValue(new Error("Internal Server Error"));
            const mockIsLoggedIn = jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation(
                (req: any, res: any, next: any) => next()
            );
            const mockIsAdminOrManager = jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation(
                (req: any, res: any, next: any) => next()
            );
            
            const response = await request(app).delete(`${baseURL}/reviews/`);
            expect(response.status).toBe(503);
            expect(response.body).toEqual({ error: "Internal Server Error", status: 503});
            expect(mockIsLoggedIn).toHaveBeenCalledTimes(1);
            expect(mockIsAdminOrManager).toHaveBeenCalledTimes(1);
            expect(ReviewController.prototype.deleteAllReviews).toHaveBeenCalled();
        });
    });
});
    
