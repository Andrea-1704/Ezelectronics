import {describe, test, expect, afterEach, beforeAll, afterAll, jest} from "@jest\globals"
import ReviewController from "../../src/controllers/reviewController";
import ReviewDAO from "../../src/dao/reviewDAO"
import {User, Role} from "../../src/components/user";
import {ProductReview} from "../../src/components/review"
import UserDAO from "../../src/dao/userDAO";



describe("Review Controller", () => {

    let testUser;
    let testProductReview;
    let reviews: ProductReview[] = [];

    beforeEach(() => {
        testUser = {
            username: "test",
            name: "test",
            surname: "test",
            password: "test",
            role: "Manager"
        };
        testProductReview = {
                    model: "iphone13", 
                    user: "test_username", 
                    score: 3, 
                    date: "25-04-2022", 
                    comment: "test_comment"
        };
        reviews = [
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

        ]
    })

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        jest.restoreAllMocks()
    });

    describe("Add Review", () => {
        test("It should add a review to the corresponding product", async () => {
            jest.spyOn(ReviewDAO.prototype, "addReview").mockResolvedValueOnce(void);
            const controller = new ReviewController();
            const response = await controller.addReview("iphone13", testUser, 3, "test_comment");

            expect(ReviewDAO.prototype.addReview).toHaveBeenCalledTimes(1);
            expect(ReviewDAO.prototype.addReview).toHaveBeenCalledWith("iphone13", testUser, 3, "test_comment");
            expect(response).toBe(void);
        }, 10000);
    });

    describe("Get Product Reviews", () => {
        test("It should return the reviews of iphone13", async () => {
            jest.spyOn(ReviewController.prototype, "getProductReviews").mockResolvedValueOnce([testProductReview]);

            const controller = new ReviewController();
            const response = await controller.getProductReviews("iphone13");

            expect(ReviewDAO.prototype.getProductReviews).toHaveBeenCalledTimes(1);
            expect(ReviewDAO.prototype.getProductReviews).toHaveBeenCalledWith("iphone13");
            expect(response).toStrictEqual([testProductReview]);
        }, 10000);
    });

    describe("ReviewController", () => {
        test("It should return undefined if there are no reviews", async () => {
            const getProductReviewsSpy = jest.spyOn(ReviewController.prototype, "getProductReviews").mockResolvedValueOnce(undefined);

            const controller = new ReviewController();
            const response = await controller.getProductReviews("iphone13");

            expect(getProductReviewsSpy).toHaveBeenCalledTimes(1);
            expect(getProductReviewsSpy).toHaveBeenCalledWith("iphone13");
            expect(response).toBe(undefined);
        }, 10000);
    });


    describe("ReviewController", () => {
        test("It should delete the review made by a user for a product", async () => {
            const deleteReviewSpy = jest.spyOn(ReviewController.prototype, "deleteReview").mockResolvedValueOnce(void);

            const controller = new ReviewController();
            const response = await controller.deleteReview("iphone13", testCustomer);

            expect(deleteReviewSpy).toHaveBeenCalledTimes(1);
            expect(deleteReviewSpy).toHaveBeenCalledWith("iphone13", testCustomer);
            expect(response).toBe(void);
        }, 10000);
    });


    describe("ReviewController", () => {
        test("It should delete all the reviews of the given product model", async () => {
            const deleteReviewsOfProductSpy = jest.spyOn(ReviewController.prototype, "deleteReviewsOfProduct").mockResolvedValueOnce(void);

            const controller = new ReviewController();
            const response = await controller.deleteReviewsOfProduct("iphone13");

            expect(deleteReviewsOfProductSpy).toHaveBeenCalledTimes(1);
            expect(deleteReviewsOfProductSpy).toHaveBeenCalledWith("iphone13");
            expect(response).toBe(void);
        }, 10000);
    });

    describe("ReviewController", () => {
        test("It should delete all reviews of all products", async () => {
            const deleteAllReviewsSpy = jest.spyOn(ReviewController.prototype, "deleteAllReviews").mockResolvedValueOnce(void);

            const controller = new ReviewController();
            const response = await controller.deleteAllReviews();

            expect(deleteAllReviewsSpy).toHaveBeenCalledTimes(1);
            expect(deleteAllReviewsSpy).toHaveBeenCalledWith();
            expect(response).toBe(void);
        }, 10000);
    });



    


    









})