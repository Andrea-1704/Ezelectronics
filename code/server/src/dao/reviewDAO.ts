import db from "../db/db";
import {ProductReview} from "../components/review";
import {User} from "../components/user";

/**
 * A class that implements the interaction with the database for all review-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class ReviewDAO {
    /**
     * Adds a new review for a product
     * @param model The model of the product to review
     * @param user The username of the user who made the review
     * @param score The score assigned to the product, in the range [1, 5]
     * @param comment The comment made by the user
     * @returns A Promise that resolves to nothing
     */
    addReview(model: string, user: User, score: number, comment: string) {
        return new Promise<void>((resolve, reject) => {
            try {
                const sql = "INSERT INTO review (model, user, score, comment, date) VALUES (?, ?, ?, ?, ?)"
                db.run(sql, [model, user.username, score, comment, new Date().toISOString().slice(0,10)], (err: Error) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve()
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * Returns all reviews for a product
     * @param model The model of the product to get reviews from
     * @returns A Promise that resolves to an array of ProductReview objects
     */
    getProductReviews(model: string) {
        return new Promise<any>((resolve, reject) => {
            try {
                const sql = "SELECT * FROM review WHERE model = ?"
                db.all(sql, [model], (err: Error, rows: ProductReview[]) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    const reviews = rows.map(row => {
                        return {
                            model: row.model,
                            user: row.user,
                            score: row.score,
                            comment: row.comment,
                            date: row.date
                        }
                    })
                    resolve(reviews)
                })
            } catch (error) {
                reject(error)
            }
        })

    }
    /**
     * Deletes the review made by a user for a product
     * @param model The model of the product to delete the review from
     * @param user The user who made the review to delete
     * @returns A Promise that resolves to nothing
     */
    deleteReview(model: string, user: User) {
        return new Promise<void>((resolve, reject) => {
            try {
                const sql = "DELETE FROM review WHERE model = ? AND user = ?"
                db.run(sql, [model, user.username], (err: Error) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve()
                })
            } catch (error) {
                reject(error)
            }
        })
    }
    /**
     * Deletes all reviews for a product
     * @param model The model of the product to delete the reviews from
     * @returns A Promise that resolves to nothing
     */
    deleteReviewsOfProduct(model: string) {
        const sql = "DELETE FROM review WHERE model = ?"
        return new Promise<void>((resolve, reject) => {
            db.run(sql, [model], (err: Error) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve()
            })
        })
    }
    /**
     * Deletes all reviews of all products
     * @returns A Promise that resolves to nothing
     */
    deleteAllReviews() {
        const sql = "DELETE FROM review"
        return new Promise<void>((resolve, reject) => {
            db.run(sql, (err: Error) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve()
            })
        })
    }
    /**
     * Checks if a user has reviewed a product
     * @param model the model of the product
     * @param username the username of the user
     */
    hasReviewed(model: string, username: string) {
        const sql = "SELECT * FROM review WHERE model = ? AND user = ?"
        return new Promise<boolean>((resolve, reject) => {
            db.all(sql, [model, username], (err: Error, rows: ProductReview[]) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve(rows.length > 0)
            })
        })
    }
}

export default ReviewDAO;