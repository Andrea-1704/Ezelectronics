import { describe, test, expect, jest, afterEach } from "@jest/globals"
import CartDAO from "../../src/dao/cartDAO"
import ProductDAO from "../../src/dao/productDAO"
import { Role, User } from "../../src/components/user"
import db from "../../src/db/db"
import { Database } from "sqlite3"
import { EmptyProductStockError, ProductNotFoundError } from "../../src/errors/productError";
import { Category, Product } from "../../src/components/product"
import { Cart, ProductInCart } from "../../src/components/cart"
import { EmptyCartError } from "../../src/errors/cartError"
import { error } from "console"

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


test("addToCart - product exists and user does not have a cart", async () => {
    const cartDao = new CartDAO()
    const productDao = new ProductDAO()
    //const testProduct = { model: "test_model", sellingPrice: 100 };
    let testCart = new Cart(0, "customer", false, "17-04-2002", 200, []);
    //const testCart = { products: [testProduct] }; // Il carrello contiene il prodotto
    const getProductSpy = jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(testProduct);
    const hasCartSpy = jest.spyOn(CartDAO.prototype, "hasCart").mockResolvedValueOnce(false);
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
    const createCartSpy = jest.spyOn(CartDAO.prototype, "createCart").mockResolvedValueOnce();
    //await productDao.registerProducts(product.model, Category.SMARTPHONE, 1, "details", product.sellingPrice, "date")
    const result = await cartDao.addToCart(user, product.model)
    expect(result).toBe(true)
    mockDBRun.mockRestore()
});



test("addToCart - user does not have a cart", async () => {
    const cartDao = new CartDAO()
    const productDao = new ProductDAO()
    const getProductSpy = jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(testProduct);
    const hasCartSpy = jest.spyOn(CartDAO.prototype, "hasCart").mockResolvedValueOnce(false);
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
    
    const createCartSpy = jest.spyOn(CartDAO.prototype, "createCart").mockResolvedValueOnce();
    const result = await cartDao.addToCart(user, product.model)
    expect(result).toBe(true)
    mockDBRun.mockRestore()
});

test("addToCart - product is not in the cart", async () => {
    const cartDao = new CartDAO()
    const productDao = new ProductDAO()
    const getProductSpy = jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(testProduct);
    const hasCartSpy = jest.spyOn(CartDAO.prototype, "hasCart").mockResolvedValueOnce(true);
    const getCartSpy= jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce({ ...testCart, products: [] });
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    const product = {
        model: "test",
        sellingPrice: 100
    };
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(null)
        return {} as Database
    });
    const result = await cartDao.addToCart(user, product.model)
    expect(result).toBe(true)
    mockDBRun.mockRestore()
});



test("getCart - user has a cart and cart is not empty", async () => {
    const cartDao = new CartDAO()
    const productDao = new ProductDAO()
    const getCartSpy = jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(testCart);
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, null)
        return {} as Database
    });
    
    const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        callback(null, [])
        return {} as Database
    });
    
    const result = await cartDao.getCart(user, false)
    expect(result).toEqual(testCart)
    mockDBGet.mockRestore()
    mockDBAll.mockRestore()
});

test("getCart - user has a cart and cart is empty", async () => {
    const cartDao = new CartDAO()
    const productDao = new ProductDAO()
    let testCart = new Cart(0, "customer", false, "17-04-2002", 200, []);
    const getCartSpy = jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(testCart);
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, null)
        return {} as Database
    });
    
    const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        callback(null, [])
        return {} as Database
    });    
    const result = await cartDao.getCart(user, true)
    expect(result).toEqual({ ...testCart, products: [] })
    mockDBGet.mockRestore()
    mockDBAll.mockRestore()
});

test("getCart - user does not have a cart", async () => {
    const cartDao = new CartDAO()
    const productDao = new ProductDAO()
    let testCart = new Cart(0, "customer", false, "17-04-2002", 200, []);
    const getCartSpy = jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(new Cart(+1, "test_user", false, "", 0, []));
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, null)
        return {} as Database
    });
    
    const result = await cartDao.getCart(user, false)
    expect(result).toEqual(new Cart(+1, user.username, false, "", 0, []))
    mockDBGet.mockRestore()
});

test("createCart - user does not have a cart", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(null)
        return {} as Database
    });
    
    await cartDao.createCart(user)
    expect(mockDBRun).toHaveBeenCalledWith("INSERT INTO cart (customer, paid, paymentDate, total) VALUES (?, 0, '', 0)", [user.username], expect.any(Function))
    mockDBRun.mockRestore()
});

test("createCart - database error", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(new Error("Database error"))
        return {} as Database
    });
    
    await expect(cartDao.createCart(user)).rejects.toThrow("Database error")
    mockDBRun.mockRestore()
});

test("createCart - user already has a cart", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(new Error("SQLITE_CONSTRAINT: UNIQUE constraint failed: cart.customer"))
        return {} as Database
    });
    
    await expect(cartDao.createCart(user)).rejects.toThrow("SQLITE_CONSTRAINT: UNIQUE constraint failed: cart.customer")
    mockDBRun.mockRestore()
});

test("checkoutCart - cart is empty", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    let testCart = new Cart(0, "test_user", false, "17-04-2002", 200, []);
    // Mock the `getCart` method to return an empty cart
    jest.spyOn(cartDao, 'getCart').mockResolvedValue(testCart);
    
    await expect(cartDao.checkoutCart(user)).rejects.toThrow(EmptyCartError)
}, 10000);


test("checkoutCart - product not found", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    let productInCart = new ProductInCart("test", 100, Category.SMARTPHONE , 30);
    let testCart = new Cart(0, "test_user", false, "17-04-2002", 200, [productInCart]);
    
    jest.spyOn(cartDao, 'getCart').mockResolvedValue(testCart);
    jest.spyOn(ProductDAO.prototype, 'getProductByModel').mockResolvedValue(undefined);

    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(null)
        return {} as Database
    });
    
    await expect(cartDao.checkoutCart(user)).rejects.toThrow(ProductNotFoundError)
    mockDBRun.mockRestore()
}, 10000);

test("checkoutCart - product stock is empty", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    let productInCart = new ProductInCart("test", 100, Category.SMARTPHONE , 30);
    let testCart = new Cart(0, "test_user", false, "17-04-2002", 200, [productInCart]);
    let testProduct= new Product(10, "test", Category.SMARTPHONE, "10-04-2002"," " , 0);
    jest.spyOn(cartDao, 'getCart').mockResolvedValue(testCart);
    jest.spyOn(ProductDAO.prototype, 'getProductByModel').mockResolvedValue(testProduct);

    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(null)
        return {} as Database
    });
    
    await expect(cartDao.checkoutCart(user)).rejects.toThrow(EmptyProductStockError)
    mockDBRun.mockRestore()
});
/*
test("checkoutCart - successful checkout", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    let productInCart = new ProductInCart("test", 100, Category.SMARTPHONE , 30);
    let testCart = new Cart(0, "test_user", false, "17-04-2002", 200, [productInCart]);
    let testProduct= new Product(10, "test", Category.SMARTPHONE, "10-04-2002"," " , 1);
    jest.spyOn(cartDao, 'getCart').mockResolvedValue(testCart);
    jest.spyOn(ProductDAO.prototype, 'getProductByModel').mockResolvedValue(testProduct);

    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(null)
        return {} as Database
    });
    
    await expect(cartDao.checkoutCart(user)).rejects.toThrow(EmptyProductStockError)
    mockDBRun.mockRestore()
});
*/
test("checkoutCart - successful checkout", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    let productInCart = new ProductInCart("test", 20, Category.SMARTPHONE , 30);
    let testCart = new Cart(0, "test_user", false, "17-04-2002", 200, [productInCart]);
    let testProduct= new Product(10, "test", Category.SMARTPHONE, "10-04-2002"," " , 35);
    jest.spyOn(cartDao, 'getCart').mockResolvedValue(testCart);
    jest.spyOn(ProductDAO.prototype, 'getProductByModel').mockResolvedValue(testProduct);

    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(null)
        return {} as Database
    });

    await cartDao.checkoutCart(user)

    // Verifica che db.run sia stato chiamato con la query SQL corretta per aggiornare il carrello
    expect(mockDBRun).toHaveBeenCalledWith(
        "UPDATE cart SET paid = 1, paymentDate = ?, total = ? WHERE id = ?",
        [expect.any(String), testCart.total, testCart.id],
        expect.any(Function)
    )

    // Verifica che db.run sia stato chiamato con la query SQL corretta per aggiornare il magazzino
    testCart.products.forEach((productInCart) => {
        expect(mockDBRun).toHaveBeenCalledWith(
            "UPDATE product SET quantity = quantity - ? WHERE model = ?",
            [productInCart.quantity, productInCart.model],
            expect.any(Function)
        )
    })

    mockDBRun.mockRestore()
});



test("checkoutCart - database error during checkout", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(new Error("Database error"))
        return {} as Database
    });
    
    expect(cartDao.checkoutCart(user)).rejects.toThrow(Error)
    mockDBRun.mockRestore()
});
