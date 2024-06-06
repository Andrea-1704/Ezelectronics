import { describe, test, expect, afterEach, beforeAll, afterAll, jest } from "@jest/globals"
import ReviewController from "../../src/controllers/reviewController";
import ReviewDAO from "../../src/dao/reviewDAO"
import { User, Role } from "../../src/components/user";
import { ProductReview } from "../../src/components/review"
import UserDAO from "../../src/dao/userDAO";
import { ProductNotFoundError } from "../../src/errors/productError";
import ProductDAO from "../../src/dao/productDAO";
import exp from "constants";
import { ExistingReviewError } from "../../src/errors/reviewError";

let testCustomer = new User("customer", "customer", "customer", Role.CUSTOMER, "", "")
let testProductReview = new ProductReview("iphone13", "customer", 3, "25-04-2022", "test_comment");

jest.mock("../../src/routers/auth")
jest.mock("../../src/dao/reviewDAO")
jest.mock('../../src/dao/productDAO');

afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks()
});


describe("Review Controller", () => {

    describe("Add Review Successful", () => {
        test("It should add a review to the corresponding product", async () => {
            const addReviewSpy = jest.spyOn(ReviewDAO.prototype, "addReview").mockResolvedValueOnce();
            const controller = new ReviewController();
            const response = await controller.addReview("iphone13", testCustomer, 3, "test_comment");

            expect(ReviewDAO.prototype.addReview).toHaveBeenCalledTimes(1);
            expect(ReviewDAO.prototype.addReview).toHaveBeenCalledWith("iphone13", testCustomer, 3, "test_comment");
            expect(response).toBeUndefined();
        }, 10000);
    });
    /*
    describe("Add Review Error", () => {
        test("it handles errors when adding a review", async () => {
            const error = new Error("testing error")
            const addReviewSpy = jest.spyOn(ReviewDAO.prototype, "addReview").mockRejectedValueOnce(error);
            const controller = new ReviewController();

            let caughtError;
            try {
                await controller.addReview("iphone13", testCustomer, 3, "test_comment");
            } catch (e) {
                caughtError = e;
            }
            expect(addReviewSpy).toHaveBeenCalledTimes(1);
            expect(addReviewSpy).toHaveBeenCalledWith("iphone13", testCustomer, 3, "test_comment");
            expect(caughtError).toEqual(error);
        }, 10000);
    });*/
    describe("ReviewController", () => {
        test("it should return ProductNotFoundError if there is no product", async () => {
            const controller = new ReviewController();
            await expect(controller.addReview("", testCustomer, 3, "test_comment")).rejects.toThrow(ProductNotFoundError);
        }, 10000);
    });
    describe("ReviewController", () => {
        test("it should return ProductNotFoundError if there is no product", async () => {
            jest.spyOn(ReviewDAO.prototype, "addReview").mockRejectedValueOnce(ExistingReviewError);
            expect(ReviewDAO.prototype.addReview).toHaveBeenCalledTimes(1);
            expect(ReviewDAO.prototype.addReview).toHaveBeenCalledWith("iphone13", testCustomer, 3, "test_comment");
        }, 10000);
    });


    describe("Get Product Reviews", () => {
        test("It should return the reviews of iphone13", async () => {
            let testReview = new ProductReview("iphone13", "customer", 3, "25-04-2022", "test_comment");
            const getProductReviewsSpy = jest.spyOn(ReviewDAO.prototype, "getProductReviews").mockResolvedValueOnce([testProductReview]);

            const controller = new ReviewController();
            const response = await controller.getProductReviews("iphone13");

            expect(getProductReviewsSpy).toHaveBeenCalledTimes(1);
            expect(getProductReviewsSpy).toHaveBeenCalledWith("iphone13");
            expect(response).toEqual([testReview]);
        }, 10000);
    });
    describe("ReviewController", () => {
        test("It should return undefined if there are no reviews", async () => {
            const getProductReviewsSpy = jest.spyOn(ReviewDAO.prototype, "getProductReviews").mockResolvedValueOnce([]);
            const controller = new ReviewController();
            const response = await controller.getProductReviews("iphone15");

            expect(getProductReviewsSpy).toHaveBeenCalledTimes(1);
            expect(getProductReviewsSpy).toHaveBeenCalledWith("iphone15");
            expect(response).toBe([]);
        }, 10000);
    });
    describe("ReviewController", () => {
        test("it should return ProductNotFoundError if there is no product", async () => {
            const controller = new ReviewController();
            await expect(controller.getProductReviews("")).rejects.toThrow(ProductNotFoundError);
        }, 10000);
    });


    describe("ReviewController", () => {
        test("It should delete the review made by a user for a product", async () => {
            const deleteReviewSpy = jest.spyOn(ReviewDAO.prototype, "deleteReview").mockResolvedValueOnce(undefined);
            const controller = new ReviewController();
            const response = await controller.deleteReview("iphone13", testCustomer);

            expect(deleteReviewSpy).toHaveBeenCalledTimes(1);
            expect(deleteReviewSpy).toHaveBeenCalledWith("iphone13", testCustomer);
            expect(response).toBeUndefined();
        }, 10000);
    });
    describe("ReviewController", () => {
        test("It should handle errpors while deleting the review of a product", async () => {
            const error = new Error("Testing error");
            const deleteReviewSpy = jest.spyOn(ReviewDAO.prototype, "deleteReview").mockRejectedValueOnce(error);
            const controller = new ReviewController();
            let caughtError;
            try {
                await controller.deleteReview("iphone13", testCustomer);
            } catch (e) {
                caughtError = e;
            }
            expect(deleteReviewSpy).toHaveBeenCalledTimes(1);
            expect(deleteReviewSpy).toHaveBeenCalledWith("iphone13", testCustomer);
            expect(caughtError).toEqual(error);
        }, 10000);
    });
    describe("ReviewController", () => {
        test("It should delete all the reviews of the given product model", async () => {
            const deleteReviewsOfProductSpy = jest.spyOn(ReviewDAO.prototype, "deleteReviewsOfProduct").mockResolvedValueOnce(undefined);
            const controller = new ReviewController();
            const response = await controller.deleteReviewsOfProduct("iphone13");

            expect(deleteReviewsOfProductSpy).toHaveBeenCalledTimes(1);
            expect(deleteReviewsOfProductSpy).toHaveBeenCalledWith("iphone13");
            expect(response).toBeUndefined();
        }, 10000);
    });
    describe("ReviewController", () => {
        test("It should handle errpors while deleting all the reviews of a product", async () => {
            const error = new Error("Testing error");
            const deleteReviewsOfProductSpy = jest.spyOn(ReviewDAO.prototype, "deleteReviewsOfProduct").mockRejectedValueOnce(error);
            const controller = new ReviewController();
            let caughtError;
            try {
                await controller.deleteReviewsOfProduct("iphone13");
            } catch (e) {
                caughtError = e;
            }
            expect(deleteReviewsOfProductSpy).toHaveBeenCalledTimes(1);
            expect(deleteReviewsOfProductSpy).toHaveBeenCalledWith("iphone13");
            expect(caughtError).toEqual(error);
        }, 10000);
    });


    describe("ReviewController", () => {
        test("It should delete all reviews of all products", async () => {
            const deleteAllReviewsSpy = jest.spyOn(ReviewController.prototype, "deleteAllReviews").mockResolvedValueOnce(undefined);

            const controller = new ReviewController();
            const response = await controller.deleteAllReviews();

            expect(deleteAllReviewsSpy).toHaveBeenCalledTimes(1);
            expect(deleteAllReviewsSpy).toHaveBeenCalledWith();
            expect(response).toBeUndefined();
        }, 10000);
    });
    describe("ReviewController", () => {
        test("It should handle errpors while deleting all reviews", async () => {
            const error = new Error("Testing error");
            const deleteAllReviewsSpy = jest.spyOn(ReviewDAO.prototype, "deleteAllReviews").mockRejectedValueOnce(error);

            const controller = new ReviewController();
            let caughtError;
            try {
                await controller.deleteAllReviews();
            } catch (e) {
                caughtError = e;
            }
            expect(deleteAllReviewsSpy).toHaveBeenCalledTimes(1);
            expect(deleteAllReviewsSpy).toHaveBeenCalledWith();
            expect(caughtError).toEqual(error);
        }, 10000);
    });






})