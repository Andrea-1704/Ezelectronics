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
            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                return callback(null); // Simulate successful insert
            });
    
            const result = await reviewDAO.addReview(testReview.model, testUser2, testReview.score, testReview.comment);
            expect(result).toBe(undefined);
            expect(mockDBRun).toHaveBeenCalledTimes(1);
        });
    
        it('should return an error when trying to execute the query', async () => {
            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                return callback(new Error('Database error')); // Simulate query execution error
            });
    
            await expect(reviewDAO.addReview(testReview.model, testUser2, testReview.score, testReview.comment))
                .rejects.toThrow('Database error');
    
            expect(mockDBRun).toHaveBeenCalledTimes(1);
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
                return callback(null, [{ model: 'testModel', user: 'testUser', score: 5, comment: 'Great product!', date: '2021-01-01' }]); // Simulate product exists and has a review
            });
    
            const result = await reviewDAO.getProductReviews('testModel');
            expect(result).toEqual([{ model: 'testModel', user: 'testUser', score: 5, comment: 'Great product!', date: '2021-01-01' }]);
            expect(mockDBAll).toHaveBeenCalledTimes(1);
        });
    
        it('should return an error when trying to execute the query', async () => {
            jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
                return callback(new Error('Database error'), null); // Simulate query execution error
            });
    
            await expect(reviewDAO.getProductReviews('testModel')).rejects.toThrow('Database error');
            expect(db.all).toHaveBeenCalledTimes(1);
        });
    
        it('should catch and reject unexpected errors', async () => {
            const mockDBAll = jest.spyOn(db, "all").mockImplementation(() => {
                throw new Error('Unexpected error');
            });
    
            await expect(reviewDAO.getProductReviews('someModel')).rejects.toThrow('Unexpected error');
            expect(mockDBAll).toHaveBeenCalledTimes(1);
        });
    });
    
    describe('deleteReview', () => {
        it('should delete a review successfully', async () => {
            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                return callback(null); // Simulate successful delete
            });
    
            const result = await reviewDAO.deleteReview(testReview.model, testUser);
            expect(result).toBe(undefined);
            expect(mockDBRun).toHaveBeenCalledTimes(1);
        });
    
        it('should return an error when trying to execute the query', async () => {
            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                return callback(new Error('Database error')); // Simulate query execution error
            });
    
            await expect(reviewDAO.deleteReview(testReview.model, testUser))
                .rejects.toThrow('Database error');
            expect(mockDBRun).toHaveBeenCalledTimes(1);
        });
    
        it('should catch and reject unexpected errors', async () => {
            const mockDBRun = jest.spyOn(db, "run").mockImplementation(() => {
                throw new Error('Unexpected error');
            });
    
            await expect(reviewDAO.deleteReview(testReview.model, testUser))
                .rejects.toThrow('Unexpected error');
            expect(mockDBRun).toHaveBeenCalledTimes(1);
        });
    
        it('should return an error if product is not found', async () => {
            await expect(reviewDAO.deleteReview("", testUser))
                .rejects.toThrow(Error);
        });
    
    });
    

    describe('deleteReviewsOfProduct', () => {

        it('should delete a review successfully', async () => {
                const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                return callback(null); // Simulate successful delete
            });

            const result = await reviewDAO.deleteReviewsOfProduct(testReview.model)
            expect(result).toBe(undefined);
            expect(mockDBRun).toHaveBeenCalledTimes(1);
        });

        
        

        it("should return an error when trying to execute the query", async () => {
            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                return callback(new Error()); // Simulate query execution error
            });

            await expect(reviewDAO.deleteReviewsOfProduct(testReview.model)).rejects.toThrow(Error);
            expect(mockDBRun).toHaveBeenCalledTimes(1);
        });
        it("should return an error when trying to execute the get query", async () => {
            await expect(reviewDAO.deleteReviewsOfProduct(testReview.model)).rejects.toThrow(Error);

        });
        it("should return an error if the product does not", async () => {
            await expect(reviewDAO.deleteReviewsOfProduct(testReview.model)).rejects.toThrow(new ProductNotFoundError());
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
