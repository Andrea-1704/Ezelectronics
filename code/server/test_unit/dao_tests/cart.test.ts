import { describe, test, expect, jest, afterEach } from "@jest/globals"
import CartDAO from "../../src/dao/cartDAO"
import ProductDAO from "../../src/dao/productDAO"
import { Role, User } from "../../src/components/user"
import db from "../../src/db/db"
import { Database } from "sqlite3"
import { ProductNotFoundError } from "../../src/errors/productError";
import { Category } from "../../src/components/product"

jest.mock("../../src/db/db.ts")

afterEach(() => {
    jest.restoreAllMocks();
});

test("addToCart - product exists and user has no cart", async () => {
    const cartDao = new CartDAO()
    const productDao = new ProductDAO()
    const user = new User("test_user", "Test", "User", Role.MANAGER, "Test Address", "1990-01-01");
    const product = {
        model: "test_model",
        sellingPrice: 100
    };

    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(null)
        return {} as Database
    });

    await productDao.registerProducts(product.model, Category.SMARTPHONE, 1, "details", product.sellingPrice, "date")
    const result = await cartDao.addToCart(user, product.model)
    expect(result).toBe(true)
    mockDBRun.mockRestore()
});
