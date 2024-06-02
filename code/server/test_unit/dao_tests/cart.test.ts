import { describe, test, expect, jest, afterEach } from "@jest/globals"
import CartDAO from "../../src/dao/cartDAO"
import ProductDAO from "../../src/dao/productDAO"
import { Role, User } from "../../src/components/user"
import db from "../../src/db/db"
import { Database } from "sqlite3"
import { ProductNotFoundError } from "../../src/errors/productError";
import { Category, Product } from "../../src/components/product"
import { Cart, ProductInCart } from "../../src/components/cart"

jest.mock("../../src/db/db.ts")

let testCustomer = new User("customer", "customer", "customer", Role.CUSTOMER, "", "")
let testProduct= new Product(10, "test", Category.SMARTPHONE, "10-04-2002"," " , 3);
let productInCart = new ProductInCart("test", 100, Category.SMARTPHONE , 30);
let testCart = new Cart(0, "customer", false, "17-04-2002", 200, [productInCart]);


afterEach(() => {
    jest.restoreAllMocks();
});

test("addToCart - product exists and user has cart", async () => {
    const cartDao = new CartDAO()
    const productDao = new ProductDAO()
    //const testProduct = { model: "test_model", sellingPrice: 100 };
    //const testCart = { products: [testProduct] }; // Il carrello contiene il prodotto
    const getProductSpy = jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(testProduct);
    const hasCartSpy = jest.spyOn(CartDAO.prototype, "hasCart").mockResolvedValueOnce(true);
    const getCartSpy= jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(testCart);
     
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    const product = {
        model: "test",
        sellingPrice: 100
    };

    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(null)
        return {} as Database
    });

    //await productDao.registerProducts(product.model, Category.SMARTPHONE, 1, "details", product.sellingPrice, "date")
    const result = await cartDao.addToCart(user, product.model)
    expect(result).toBe(true)
    mockDBRun.mockRestore()
});
