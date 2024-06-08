import { describe, test, expect, beforeEach, afterAll, afterEach, jest, it } from "@jest/globals"
import ReviewDAO from "../../src/dao/reviewDAO"
import crypto from "crypto"
import db from "../../src/db/db"
import { Database } from "sqlite3"
import { ProductReview } from "../../src/components/review"
import { ExistingReviewError, NoReviewProductError } from "../../src/errors/reviewError"
import { ProductNotFoundError } from "../../src/errors/productError"
import { Role, User } from "../../src/components/user"

jest.mock("crypto")
jest.mock("../../src/db/db.ts")

const testReview = new ProductReview("iphone", "username", 3, "12-01-2023", "comment");
const testUser = new User("customer", "cusotmer", "customer", Role.CUSTOMER, "password", "13-11-2002")


const testUser2 = new User("username2", "John", "Smith", Role.CUSTOMER, "password", "14-11-2002")



describe("Review DAO", () => {
    const reviewDAO = new ReviewDAO();
    afterEach(async () => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    /**
    * ReviewDao
    */
    it("should be defined", () => {
        expect(reviewDAO).toBeDefined();
    });

    describe('addReview', () => {
        it('should add a review', async () => {
            let callCount = 0;
            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callCount++;
                if (callCount === 1) {
                    return callback(null, { id: 1 }); // Simulate product exists
                } else {
                    return callback(null, null); // Simulate no existing review
                }
            });

            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                return callback(null); // Simulate successful insert
            });

            const result = await reviewDAO.addReview(testReview.model, testUser2, testReview.score, testReview.comment);
            expect(result).toBe(undefined);
            expect(mockDBGet).toHaveBeenCalledTimes(2);
            expect(mockDBRun).toHaveBeenCalledTimes(1);
        });

        it('should throw ProductNotFoundError if product does not exist', async () => {
            jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                return callback(null, null); // Simulate product does not exist
            });

            await expect(reviewDAO.addReview(testReview.model, testUser2, testReview.score, testReview.comment))
                .rejects.toThrow(ProductNotFoundError);

            expect(db.get).toHaveBeenCalledTimes(1);
        });

        it('should throw ExistingReviewError if the product is already reviewed by the user', async () => {
            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                return callback(null, { id: 1 }); // Simulate product exists
            }).mockImplementation((sql, params, callback) => {
                return callback(null, { user: 'testuser' }); // Simulate existing review
            });

            await expect(reviewDAO.addReview(testReview.model, testUser2, testReview.score, testReview.comment))
                .rejects.toThrow(ExistingReviewError);
            expect(mockDBGet).toHaveBeenCalledTimes(2);
        });

        it('should return an error when trying to execute the query', async () => {
            jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
                return callback(null, { id: 1 }); // Simulate product exists
            }).mockImplementationOnce((sql, params, callback) => {
                return callback(null, null); // Simulate no existing review
            });

            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                return callback(new Error()); // Simulate query execution error
            });

            await expect(reviewDAO.addReview(testReview.model, testUser2, testReview.score, testReview.comment))
                .rejects.toThrow(Error);

            expect(mockDBRun).toHaveBeenCalledTimes(1);
        });
        test('should return an error in product query if not working correctly', async () => {
            const model = 'testModel';

            // Mocking the behavior for the product query to simulate an error
            jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                return callback(new Error('Database error'), null);
            });

            await expect(reviewDAO.addReview(testReview.model, testUser2, testReview.score, testReview.comment))
                .rejects.toThrow(Error);
        });
        test('should return an error in review query if not working correctly', async () => {
            const model = 'testModel';
            // Mocking the behavior for the product query to succeed
            jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
                // Simulate successful product query by returning null for product
                return callback(null, { id: 1 });
            });

            // Mocking the behavior for the review query to encounter an error
            jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
                // Simulate an error by directly invoking the callback with an error
                return callback(new Error('Database error'));
            });

            await expect(reviewDAO.addReview(testReview.model, testUser2, testReview.score, testReview.comment))
                .rejects.toThrow(Error);
        });

        it('should catch and reject unexpected errors', async () => {
            const mockDBRun = jest.spyOn(db, "run").mockImplementation(() => {
                throw new Error('Unexpected error');
            });

            await expect(reviewDAO.addReview(testReview.model, testUser2, testReview.score, testReview.comment))
                .rejects.toThrow('Unexpected error');

            expect(mockDBRun).toHaveBeenCalledTimes(1);
        });


    });

    describe('getProductReviews', () => {

        it('should return a review successfully', async () => {
            const mockDBAll = jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
                return callback(null, [{ id: 1, ...testReview }]); // Simulate product exists and has a review
            });

            const result = await reviewDAO.getProductReviews(testReview.model)
            expect(result).toEqual([testReview]);
            expect(mockDBAll).toHaveBeenCalledTimes(1);
        }, 5004);

        it('should throw ProductNotFoundError if product does not exist', async () => {
            const mockDBAll = jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
                return callback(null, null); // Simulate product does not exist
            });

            await expect(reviewDAO.getProductReviews(testReview.model))
                .rejects.toThrow(ProductNotFoundError);

            expect(mockDBAll).toHaveBeenCalledTimes(1);
        });

        it('should return an error when trying to execute the query', async () => {
            jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
                return callback(new Error()); // Simulate query execution error
            });

            await expect(reviewDAO.getProductReviews(testReview.model))
                .rejects.toThrow(Error);

            expect(db.all).toHaveBeenCalledTimes(1);
        });
    });

    describe('deleteReview', () => {

        it('should delete a review successfully', async () => {
            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                return callback(null, { id: 1 }); // Simulate product exists
            }).mockImplementation((sql, params, callback) => {
                return callback(null, { user: testUser2 }); // Simulate existing review
            });

            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                return callback(null); // Simulate successful delete
            });

            const result = await reviewDAO.deleteReview(testReview.model, testUser2)
            expect(result).toBe(undefined);
            expect(mockDBGet).toHaveBeenCalledTimes(2);
            expect(mockDBRun).toHaveBeenCalledTimes(1);
        });

        it('should throw ProductNotFoundError if product does not exist', async () => {
            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                return callback(null, null); // Simulate product does not exist
            });

            await expect(reviewDAO.deleteReview(testReview.model, testUser2))
                .rejects.toThrow(ProductNotFoundError);
            expect(mockDBGet).toHaveBeenCalledTimes(1);
        });

        it('should return an error when trying to execute the query', async () => {
            jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
                return callback(null, { id: 1 }); // Simulate product exists
            }).mockImplementationOnce((sql, params, callback) => {
                return callback(null, { user: testUser2 }); // Simulate existing review
            });

            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                return callback(new Error()); // Simulate query execution error
            });

            await expect(reviewDAO.deleteReview(testReview.model, testUser2))
                .rejects.toThrow(Error);

            expect(db.get).toHaveBeenCalledTimes(2);
            expect(mockDBRun).toHaveBeenCalledTimes(1);
        });

        it('should resolve the promise when the review is successfully deleted', async () => {

            jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
                return callback(null, testReview);
            });

            jest.spyOn(db, "run").mockImplementationOnce((sql, params, callback) => {
                return callback(null);
            });

            await reviewDAO.deleteReview(testReview.model, testUser2)
                .catch((error) => { })
                .then(() => expect(db.get).toHaveBeenCalledTimes(2));

        });
        test('should return an error if product query fails', async () => {
            const model = 'testModel';
            // Mocking the behavior for the product query to encounter an error
            jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
                // Simulate an error by directly invoking the callback with an error
                return callback(new Error('Database error'));
            });

            await expect(reviewDAO.deleteReview(model, testUser2)).rejects.toThrow('Database error');
        });
        test('should return an error if review query fails', async () => {
            const model = 'testModel';
            jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
                return callback(null, model);
            })
            jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
                return callback(new Error('Database error'));
            });

            await expect(reviewDAO.deleteReview(model, testUser2)).rejects.toThrow('Database error');
        });

        it('should catch and reject unexpected errors', async () => {
            const model = 'testModel';
            const mockDBRun = jest.spyOn(db, "run").mockImplementation(() => {
                throw new Error('Unexpected error');
            });

            await expect(reviewDAO.deleteReview(model, testUser2))
                .rejects.toThrow('Unexpected error');

            expect(mockDBRun).toHaveBeenCalledTimes(1);
        });

    });

    describe('deleteReviewsOfProduct', () => {

        it('should delete a review successfully', async () => {
            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                return callback(null, { id: 1 }); // Simulate product exists
            });

            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                return callback(null); // Simulate successful delete
            });

            const result = await reviewDAO.deleteReviewsOfProduct(testReview.model)
            expect(result).toBe(undefined);
            expect(mockDBGet).toHaveBeenCalledTimes(1);
            expect(mockDBRun).toHaveBeenCalledTimes(1);
        });

        it('should throw ProductNotFoundError if product does not exist', async () => {
            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                return callback(null, null); // Simulate product does not exist
            });

            await expect(reviewDAO.addReview(testReview.model, testUser2, testReview.score, testReview.comment))
                .rejects.toThrow(ProductNotFoundError);
            expect(mockDBGet).toHaveBeenCalledTimes(1);
        });

        it("should return an error when trying to execute the query", async () => {
            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                return callback(null, { id: 1 }); // Simulate product exists
            });

            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                return callback(new Error()); // Simulate query execution error
            });

            await expect(reviewDAO.deleteReviewsOfProduct(testReview.model)).rejects.toThrow(Error);

            expect(mockDBGet).toHaveBeenCalledTimes(1);
            expect(mockDBRun).toHaveBeenCalledTimes(1);
        });
        it("should return an error when trying to execute the get query", async () => {
            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                return callback(new Error()); // Simulate query execution error
            });

            await expect(reviewDAO.deleteReviewsOfProduct(testReview.model)).rejects.toThrow(Error);

            expect(mockDBGet).toHaveBeenCalledTimes(1);
        });
        it("should return an error if not found the product", async () => {
            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                return callback(null, null); // Simulate query execution error
            });

            await expect(reviewDAO.deleteReviewsOfProduct(testReview.model)).rejects.toThrow(new ProductNotFoundError());

            expect(mockDBGet).toHaveBeenCalledTimes(1);
        });
    });

    describe('deleteAllReviews', () => {
        it('should delete all reviews successfully', async () => {
            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, callback) => {
                return callback(null); // Simulate successful delete
            });

            const result = await reviewDAO.deleteAllReviews();
            expect(result).toBe(undefined);
            expect(mockDBRun).toHaveBeenCalledTimes(1);
        });

        it('should return an error when trying to execute the query', async () => {
            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, callback) => {
                return callback(new Error('Database error')); // Simulate database error
            });

            await expect(reviewDAO.deleteAllReviews()).rejects.toThrow('Database error');
            expect(mockDBRun).toHaveBeenCalledTimes(1);
        });

        it('should catch and reject unexpected errors', async () => {
            const mockDBRun = jest.spyOn(db, "run").mockImplementation(() => {
                throw new Error('Unexpected error');
            });

            await expect(reviewDAO.deleteAllReviews()).rejects.toThrow('Unexpected error');
            expect(mockDBRun).toHaveBeenCalledTimes(1);
        });
    });

    describe('hasReviewed', () => {
        it('should return true if the user has reviewed the product', async () => {
            const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                return callback(null, [{ id: 1, model: 'testModel', user: 'testUser', score: 5, comment: 'Great product!' }]); // Simulate user has reviewed the product
            });
    
            const result = await reviewDAO.hasReviewed('testModel', 'testUser');
            expect(result).toBe(true);
            expect(mockDBAll).toHaveBeenCalledTimes(1);
        });
    
        it('should return false if the user has not reviewed the product', async () => {
            const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                return callback(null, []); // Simulate user has not reviewed the product
            });
    
            const result = await reviewDAO.hasReviewed('testModel', 'testUser');
            expect(result).toBe(false);
            expect(mockDBAll).toHaveBeenCalledTimes(1);
        });
    
        it('should return an error when trying to execute the query', async () => {
            const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                return callback(new Error('Database error'), null); // Simulate database error
            });
    
            await expect(reviewDAO.hasReviewed('testModel', 'testUser')).rejects.toThrow('Database error');
            expect(mockDBAll).toHaveBeenCalledTimes(1);
        });
    
        it('should catch and reject unexpected errors', async () => {
            const mockDBAll = jest.spyOn(db, "all").mockImplementation(() => {
         
                throw new Error('Unexpected error');
            });
    
            await expect(reviewDAO.hasReviewed('testModel', 'testUser')).rejects.toThrow('Unexpected error');
            expect(mockDBAll).toHaveBeenCalledTimes(1);
        });
    });
    

});
