import { describe, test, expect, afterEach, beforeAll, afterAll, jest } from "@jest/globals"
import ReviewController from "../../src/controllers/reviewController";
import ReviewDAO from "../../src/dao/reviewDAO"
import { User, Role } from "../../src/components/user";
import { Product } from "../../src/components/product";
import { ProductReview } from "../../src/components/review"
import UserDAO from "../../src/dao/userDAO";
import { ProductNotFoundError } from "../../src/errors/productError";
import ProductDAO from "../../src/dao/productDAO";
import exp from "constants";
import { ExistingReviewError, NoReviewProductError } from "../../src/errors/reviewError";
import { Category } from "../../src/components/product";

let testCustomer = new User("customer", "customer", "customer", Role.CUSTOMER, "", "")
let testProductReview = new ProductReview("iphone13", "customer", 3, "25-04-2022", "test_comment");
let testProduct = new Product(500, "iphone13", Category.SMARTPHONE, "12-06-2023", "test_details", 4);

jest.mock("../../src/routers/auth")
jest.mock("../../src/dao/reviewDAO")
jest.mock('../../src/dao/productDAO');

afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks()
});


describe("Review Controller", () => {

    const testCustomer = new User("customer", "john", "smith", Role.CUSTOMER, "address", "12-06-2004");
    const testProduct = new Product(400, "iphone13", Category.SMARTPHONE, "2023-05-05", "details", 6);



    describe("Add Review Successful", () => {
        test("It should add a review to the corresponding product without comment", async () => {
            const controller = new ReviewController();
            jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(testProduct);
            jest.spyOn(ReviewDAO.prototype, "hasReviewed").mockResolvedValueOnce(false);
            const addReviewSpy = jest.spyOn(ReviewDAO.prototype, "addReview").mockResolvedValueOnce(undefined);

            await controller.addReview("iphone13", testCustomer, 3);

            expect(addReviewSpy).toHaveBeenCalledTimes(1);
            expect(addReviewSpy).toHaveBeenCalledWith("iphone13", testCustomer, 3, ' ');
        });

        test("It should add a review to the corresponding product with comment", async () => {
            const controller = new ReviewController();
            jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(testProduct);
            jest.spyOn(ReviewDAO.prototype, "hasReviewed").mockResolvedValueOnce(false);
            const addReviewSpy = jest.spyOn(ReviewDAO.prototype, "addReview").mockResolvedValueOnce(undefined);

            await controller.addReview("iphone13", testCustomer, 3, "test_comment");

            expect(addReviewSpy).toHaveBeenCalledTimes(1);
            expect(addReviewSpy).toHaveBeenCalledWith("iphone13", testCustomer, 3, "test_comment");
        });
    });

    describe("Add Review Error - already reviewed", () => {
        test("It should return an error if the user has already reviewed the product", async () => {
            const controller = new ReviewController();
            jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(testProduct);
            jest.spyOn(ReviewDAO.prototype, "hasReviewed").mockResolvedValueOnce(true);
            const addReviewSpy = jest.spyOn(ReviewDAO.prototype, "addReview");

            await expect(controller.addReview("iphone13", testCustomer, 3, "test_comment")).rejects.toThrow(ExistingReviewError);

            expect(addReviewSpy).not.toHaveBeenCalled();
        });
    });

    describe("Add Product Reviews Error - product does not exist", () => {
        test("it should return ProductNotFoundError if the product does not exist", async () => {
            const controller = new ReviewController();
            await expect(controller.addReview("iphone13", testCustomer, 3, "test_comment")).rejects.toThrow(ProductNotFoundError);
        }, 10000);


    });


    describe("Get Product Reviews Success", () => {
        test("It should return the reviews of iphone13", async () => {
            let testReview = new ProductReview("iphone13", "customer", 3, "25-04-2022", "test_comment");
            const controller = new ReviewController();
            jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(testProduct);
            const getProductReviewsSpy = jest.spyOn(ReviewDAO.prototype, "getProductReviews").mockResolvedValueOnce([testProductReview]);

            const response = await controller.getProductReviews("iphone13");

            expect(getProductReviewsSpy).toHaveBeenCalledTimes(1);
            expect(getProductReviewsSpy).toHaveBeenCalledWith("iphone13");
            expect(response).toEqual([testReview]);
        }, 10000);
    });
    describe("Get Product Reviews Error - no reviews", () => {
        test("It should return an empty array if there are no reviews", async () => {
            const controller = new ReviewController();
            jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(testProduct);
            const getProductReviewsSpy = jest.spyOn(ReviewDAO.prototype, "getProductReviews").mockResolvedValueOnce([]);
    
            const response = await controller.getProductReviews("iphone15");
    
            expect(getProductReviewsSpy).toHaveBeenCalledTimes(1);
            expect(getProductReviewsSpy).toHaveBeenCalledWith("iphone15");
            expect(response).toEqual([]);
        }, 10000);
    });
    

});
describe("Get Product Reviews Error - product does not exist", () => {
    test("it should return ProductNotFoundError if the product does not exist", async () => {
        const controller = new ReviewController();
        await expect(controller.getProductReviews("")).rejects.toThrow(ProductNotFoundError);
    }, 10000);
});




describe("Delete Product Review Success", () => {
    test("It should delete the review made by a user for a product", async () => {
        const deleteReviewSpy = jest.spyOn(ReviewDAO.prototype, "deleteReview").mockResolvedValueOnce(undefined);
        const controller = new ReviewController();
        jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(testProduct);
        jest.spyOn(ReviewDAO.prototype, "hasReviewed").mockResolvedValueOnce(true);
        const response = await controller.deleteReview("iphone13", testCustomer);

        expect(deleteReviewSpy).toHaveBeenCalledTimes(1);
        expect(deleteReviewSpy).toHaveBeenCalledWith("iphone13", testCustomer);
        expect(response).toBeUndefined();
    }, 10000);
});

describe("Delete Product Review Error - product is not yet reviewed by user", () => {
    test("It should return an error if the user has not yet reviewed the product", async () => {
        const controller = new ReviewController();
        jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(testProduct);
        jest.spyOn(ReviewDAO.prototype, "hasReviewed").mockResolvedValueOnce(false);
        const deleteReviewSpy = jest.spyOn(ReviewDAO.prototype, "deleteReview").mockRejectedValueOnce(NoReviewProductError);

        await expect(controller.deleteReview("iphone13", testCustomer)).rejects.toThrow(NoReviewProductError);
    }, 10000);
});

describe("Delete Product Review Error - product does not exist", () => {
    test("It should return an error if the user has already reviewed the product", async () => {
        const controller = new ReviewController();
        await expect(controller.deleteReview("", testCustomer)).rejects.toThrow(ProductNotFoundError);
    }, 10000);
});

describe("ReviewController", () => {
    test("It should handle errpors while deleting the review of a product", async () => {
        const error = new Error("Testing error");
        const deleteReviewSpy = jest.spyOn(ReviewDAO.prototype, "deleteReview").mockRejectedValueOnce(error);
        const controller = new ReviewController();
        jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(testProduct);
        jest.spyOn(ReviewDAO.prototype, "hasReviewed").mockResolvedValueOnce(true);
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

describe("Delete Reviews Of Product success", () => {
    test("It should delete all the reviews of the given product model", async () => {
        const deleteReviewsOfProductSpy = jest.spyOn(ReviewDAO.prototype, "deleteReviewsOfProduct").mockResolvedValueOnce(undefined);
        const controller = new ReviewController();
        jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(testProduct);
        const response = await controller.deleteReviewsOfProduct("iphone13");

        expect(deleteReviewsOfProductSpy).toHaveBeenCalledTimes(1);
        expect(deleteReviewsOfProductSpy).toHaveBeenCalledWith("iphone13");
        expect(response).toBeUndefined();
    }, 10000);
});
describe("Delete Reviews of Product Error", () => {
    test("It should handle errors while deleting all the reviews of a product", async () => {
        const error = new Error();
        const deleteReviewsOfProductSpy = jest.spyOn(ReviewDAO.prototype, "deleteReviewsOfProduct").mockRejectedValueOnce(error);
        const controller = new ReviewController();
        let caughtError;
        try {
            await controller.deleteReviewsOfProduct("iphone13");
        } catch (e) {
            caughtError = e;
        }
        expect(caughtError).toEqual(error);
    }, 10000);
});
describe("Delete Reviews of Product - product not found", () => {
    test("it should return ProductNotFoundError if the product does not exist", async () => {
        const controller = new ReviewController();
        await expect(controller.deleteReviewsOfProduct("")).rejects.toThrow(ProductNotFoundError);
    }, 10000);
});


describe("Delete all Reviews Success", () => {
    test("It should delete all reviews of all products", async () => {
        const deleteAllReviewsSpy = jest.spyOn(ReviewController.prototype, "deleteAllReviews").mockResolvedValueOnce(undefined);

        const controller = new ReviewController();
        const response = await controller.deleteAllReviews();

        expect(deleteAllReviewsSpy).toHaveBeenCalledTimes(1);
        expect(deleteAllReviewsSpy).toHaveBeenCalledWith();
        expect(response).toBeUndefined();
    }, 10000);
});
describe("Delete all Reviews Error", () => {
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






