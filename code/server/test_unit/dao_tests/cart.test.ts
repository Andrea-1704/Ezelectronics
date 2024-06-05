import { describe, test, expect, jest, afterEach } from "@jest/globals"
import CartDAO from "../../src/dao/cartDAO"
import ProductDAO from "../../src/dao/productDAO"
import { Role, User } from "../../src/components/user"
import db from "../../src/db/db"
import { Database } from "sqlite3"
import { EmptyProductStockError, ProductNotFoundError } from "../../src/errors/productError";
import { Category, Product } from "../../src/components/product"
import { Cart, ProductInCart } from "../../src/components/cart"
import { EmptyCartError, ProductNotInCartError } from "../../src/errors/cartError"
import { error } from "console"

jest.mock("../../src/db/db.ts")

let testCustomer = new User("customer", "customer", "customer", Role.CUSTOMER, "", "")
let testProduct = new Product(10, "test", Category.SMARTPHONE, "10-04-2002", " ", 3);
let productInCart = new ProductInCart("test", 100, Category.SMARTPHONE, 30);
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
    const getCartSpy = jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(testCart);

    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    const product = {
        model: "test",
        sellingPrice: 100
    };

    const mockDBRun = jest.spyOn(db, "run").mockImplementation((_sql, _params, callback) => {
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
    const getCartSpy = jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(testCart);

    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    const product = {
        model: "test",
        sellingPrice: 100
    };

    const mockDBRun = jest.spyOn(db, "run").mockImplementation((_sql, _params, callback) => {
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
    const getCartSpy = jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(testCart);
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    const product = {
        model: "test",
        sellingPrice: 100
    };
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((_sql, _params, callback) => {
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
    const getCartSpy = jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce({ ...testCart, products: [] });
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    const product = {
        model: "test",
        sellingPrice: 100
    };
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((_sql, _params, callback) => {
        callback(null)
        return {} as Database
    });
    const result = await cartDao.addToCart(user, product.model)
    expect(result).toBe(true)
    mockDBRun.mockRestore()
});

test("addToCart - product does not exist", async () => {
    const cartDao = new CartDAO()
    const productDao = new ProductDAO()
    const getProductSpy = jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(undefined);
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    const product = {
        model: "test",
        sellingPrice: 100
    };
    await expect(cartDao.addToCart(user, product.model)).rejects.toThrow(ProductNotFoundError);
    getProductSpy.mockRestore();
});

test("addToCart - product exists in the cart", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    let productInCart = new ProductInCart("test", 20, Category.SMARTPHONE, 30);
    let testCart = new Cart(0, "test_user", true, "17-04-2002", 200, [productInCart]);
    let testProduct = new Product(10, "test", Category.SMARTPHONE, "10-04-2002", " ", 35);
    const productDao = new ProductDAO()
    const getProductSpy = jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(testProduct);
    const hasCartSpy = jest.spyOn(CartDAO.prototype, "hasCart").mockResolvedValueOnce(true);
    const getCartSpy = jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(testCart);
    const product = {
        model: "test",
        sellingPrice: 100
    };
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((_sql, _params, callback) => {
        callback(null)
        return {} as Database
    });
    const result = await cartDao.addToCart(user, product.model)
    expect(result).toBe(true)
    mockDBRun.mockRestore();
    getProductSpy.mockRestore();
    hasCartSpy.mockRestore();
    getCartSpy.mockRestore();
});

test("addToCart - SQL error when updating product quantity in cart", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    let productInCart = new ProductInCart("test", 20, Category.SMARTPHONE, 30);
    let testCart = new Cart(0, "test_user", true, "17-04-2002", 200, [productInCart]);
    let testProduct = new Product(10, "test", Category.SMARTPHONE, "10-04-2002", " ", 35);
    const productDao = new ProductDAO()
    
    const getProductSpy = jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(testProduct);
    const hasCartSpy = jest.spyOn(CartDAO.prototype, "hasCart").mockResolvedValueOnce(true);
    const getCartSpy = jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(testCart);
    const product = {
        model: "test",
        sellingPrice: 100
    };
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((_sql, _params, callback) => {
        callback(new Error("SQL error"))
        return {} as Database
    });
    await expect(cartDao.addToCart(user, product.model)).rejects.toThrow("SQL error");
    mockDBRun.mockRestore();
    getProductSpy.mockRestore();
    hasCartSpy.mockRestore();
    getCartSpy.mockRestore();
});


/*test("addToCart - SQL error when inserting new product in cart", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    let productInCart = new ProductInCart("test", 20, Category.SMARTPHONE, 30);
    let testCart = new Cart(0, "test_user", true, "17-04-2002", 200, [productInCart]);
    let testProduct = new Product(10, "test", Category.SMARTPHONE, "10-04-2002", " ", 35);
    const productDao = new ProductDAO()
    const getProductSpy = jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(testProduct);
    const hasCartSpy = jest.spyOn(CartDAO.prototype, "hasCart").mockResolvedValueOnce(true);
    const getCartSpy = jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(testCart);
    const product = {
        model: "test",
        sellingPrice: 100
    };
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((_sql, _params, callback) => {
        if (_sql.includes("INSERT INTO cart_product")) {
            callback(new Error("SQL error"))
        } else {
            callback(null)
        }
        return {} as Database
    });
    await expect(cartDao.addToCart(user, product.model)).rejects.toThrow("SQL error");
    mockDBRun.mockRestore();
    getProductSpy.mockRestore();
    hasCartSpy.mockRestore();
    getCartSpy.mockRestore();
});*/






test("getCart - user has a cart and cart is not empty", async () => {
    const cartDao = new CartDAO()
    const productDao = new ProductDAO()
    const getCartSpy = jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(testCart);
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    const mockDBGet = jest.spyOn(db, "get").mockImplementation((_sql, _params, callback) => {
        callback(null, null)
        return {} as Database
    });

    const mockDBAll = jest.spyOn(db, "all").mockImplementation((_sql, _params, callback) => {
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
    const mockDBGet = jest.spyOn(db, "get").mockImplementation((_sql, _params, callback) => {
        callback(null, null)
        return {} as Database
    });

    const mockDBAll = jest.spyOn(db, "all").mockImplementation((_sql, _params, callback) => {
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
    const mockDBGet = jest.spyOn(db, "get").mockImplementation((_sql, _params, callback) => {
        callback(null, null)
        return {} as Database
    });

    const result = await cartDao.getCart(user, false)
    expect(result).toEqual(new Cart(+1, user.username, false, "", 0, []))
    mockDBGet.mockRestore()
});


test("getCart - SQL error when retrieving cart", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    const mockDBGet = jest.spyOn(db, "get").mockImplementation((_sql, _params, callback) => {
        callback(new Error("SQL error"), null)
        return {} as Database
    });

    await expect(cartDao.getCart(user, false)).rejects.toThrow("SQL error");
    mockDBGet.mockRestore()
});


test("createCart - user does not have a cart", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((_sql, _params, callback) => {
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
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((_sql, _params, callback) => {
        callback(new Error("Database error"))
        return {} as Database
    });

    await expect(cartDao.createCart(user)).rejects.toThrow("Database error")
    mockDBRun.mockRestore()
});

test("createCart - user already has a cart", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((_sql, _params, callback) => {
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
    let productInCart = new ProductInCart("test", 100, Category.SMARTPHONE, 30);
    let testCart = new Cart(0, "test_user", false, "17-04-2002", 200, [productInCart]);

    jest.spyOn(cartDao, 'getCart').mockResolvedValue(testCart);
    jest.spyOn(ProductDAO.prototype, 'getProductByModel').mockResolvedValue(undefined);

    const mockDBRun = jest.spyOn(db, "run").mockImplementation((_sql, _params, callback) => {
        callback(null)
        return {} as Database
    });

    await expect(cartDao.checkoutCart(user)).rejects.toThrow(ProductNotFoundError)
    mockDBRun.mockRestore()
}, 10000);

test("checkoutCart - product stock is empty", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    let productInCart = new ProductInCart("test", 100, Category.SMARTPHONE, 30);
    let testCart = new Cart(0, "test_user", false, "17-04-2002", 200, [productInCart]);
    let testProduct = new Product(10, "test", Category.SMARTPHONE, "10-04-2002", " ", 0);
    jest.spyOn(cartDao, 'getCart').mockResolvedValue(testCart);
    jest.spyOn(ProductDAO.prototype, 'getProductByModel').mockResolvedValue(testProduct);

    const mockDBRun = jest.spyOn(db, "run").mockImplementation((_sql, _params, callback) => {
        callback(null)
        return {} as Database
    });

    await expect(cartDao.checkoutCart(user)).rejects.toThrow(EmptyProductStockError)
    mockDBRun.mockRestore()
});

test("checkoutCart - successful checkout", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    let productInCart = new ProductInCart("test", 20, Category.SMARTPHONE, 30);
    let testCart = new Cart(0, "test_user", false, "17-04-2002", 200, [productInCart]);
    let testProduct = new Product(10, "test", Category.SMARTPHONE, "10-04-2002", " ", 35);
    jest.spyOn(cartDao, 'getCart').mockResolvedValue(testCart);
    jest.spyOn(ProductDAO.prototype, 'getProductByModel').mockResolvedValue(testProduct);

    const mockDBRun = jest.spyOn(db, "run").mockImplementation((_sql, _params, callback) => {
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
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((_sql, _params, callback) => {
        callback(new Error("Database error"))
        return {} as Database
    });

    expect(cartDao.checkoutCart(user)).rejects.toThrow(Error)
    mockDBRun.mockRestore()
});






test("getCustomerCarts - successful operation", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    let productInCart = new ProductInCart("test", 20, Category.SMARTPHONE, 30);
    let testCart = new Cart(0, "test_user", true, "17-04-2002", 200, [productInCart]);
    let testProduct = new Product(10, "test", Category.SMARTPHONE, "10-04-2002", " ", 35);

    const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, _params, callback) => {
        if (sql.includes("cart WHERE")) {
            callback(null, [testCart])
        } else if (sql.includes("cart_product WHERE")) {
            callback(null, [productInCart])
        }
        return {} as Database
    });

    jest.spyOn(ProductDAO.prototype, 'getProductByModel').mockResolvedValue(testProduct);

    const carts = await cartDao.getCustomerCarts(user)

    // Verifica che db.all sia stato chiamato con la query SQL corretta per ottenere i carrelli
    expect(mockDBAll).toHaveBeenCalledWith(
        "SELECT * FROM cart WHERE customer = ? AND paid = 1",
        [user.username],
        expect.any(Function)
    )

    // Verifica che db.all sia stato chiamato con la query SQL corretta per ottenere i prodotti nel carrello
    expect(mockDBAll).toHaveBeenCalledWith(
        "SELECT * FROM cart_product WHERE cartId = ?",
        [testCart.id],
        expect.any(Function)
    )

    // Verifica che il risultato sia corretto
    expect(carts).toEqual([testCart])

    mockDBAll.mockRestore()
});

test("getCustomerCarts - database error", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");

    const mockDBAll = jest.spyOn(db, "all").mockImplementation((_sql, _params, callback) => {
        callback(new Error("Database error"))
        return {} as Database
    });

    // Verifica che venga rifiutata con un errore quando c'è un errore del database
    await expect(cartDao.getCustomerCarts(user)).rejects.toThrow(Error)

    mockDBAll.mockRestore()
});


test("removeProductFromCart - successful operation", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    let productInCart = new ProductInCart("test", 20, Category.SMARTPHONE, 30);
    let testCart = new Cart(0, "test_user", true, "17-04-2002", 200, [productInCart]);
    let testProduct = new Product(10, "test", Category.SMARTPHONE, "10-04-2002", " ", 35);

    const mockDBRun = jest.spyOn(db, "run").mockImplementation((_sql, _params, callback) => {
        callback(null)
        return {} as Database
    });

    jest.spyOn(cartDao, 'getCart').mockResolvedValue(testCart);

    const result = await cartDao.removeProductFromCart(user, "test")


    expect(mockDBRun).toHaveBeenCalledWith(
        "UPDATE cart_product SET quantity = quantity - 1 WHERE cartId = ? AND model = ?",
        [testCart.id, "test"],
        expect.any(Function)
    )


    expect(result).toEqual(true)

    mockDBRun.mockRestore()
});

test("removeProductFromCart - product not in cart", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    let productInCart = new ProductInCart("test", 20, Category.SMARTPHONE, 30);
    let testCart = new Cart(0, "test_user", true, "17-04-2002", 200, [productInCart]);
    let testProduct = new Product(10, "test", Category.SMARTPHONE, "10-04-2002", " ", 35);

    jest.spyOn(cartDao, 'getCart').mockResolvedValue(testCart);


    await expect(cartDao.removeProductFromCart(user, "non_existent_model")).rejects.toThrow(ProductNotInCartError)
});


test("removeProductFromCart - database error on update quantity", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    let productInCart = new ProductInCart("test", 20, Category.SMARTPHONE, 30);
    let testCart = new Cart(0, "test_user", true, "17-04-2002", 200, [productInCart]);
    let testProduct = new Product(10, "test", Category.SMARTPHONE, "10-04-2002", " ", 35);

    const mockDBRun = jest.spyOn(db, "run").mockImplementation((_sql, _params, callback) => {
        callback(new Error("Database error"))
        return {} as Database
    });

    jest.spyOn(cartDao, 'getCart').mockResolvedValue(testCart);


    await expect(cartDao.removeProductFromCart(user, "test")).rejects.toThrow("Database error")

    mockDBRun.mockRestore()
});

test("removeProductFromCart - database error on delete product", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    let productInCart = new ProductInCart("test", 1, Category.SMARTPHONE, 30);
    let testCart = new Cart(0, "test_user", true, "17-04-2002", 200, [productInCart]);
    let testProduct = new Product(10, "test", Category.SMARTPHONE, "10-04-2002", " ", 35);

    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, _params, callback) => {
        if (sql.includes("DELETE FROM cart_product WHERE")) {
            callback(new Error("Database error"))
        } else {
            callback(null)
        }
        return {} as Database
    });

    jest.spyOn(cartDao, 'getCart').mockResolvedValue(testCart);


    await expect(cartDao.removeProductFromCart(user, "test")).rejects.toThrow("Database error")

    mockDBRun.mockRestore()
});

test("removeProductFromCart - database error on update total", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    let productInCart = new ProductInCart("test", 20, Category.SMARTPHONE, 30);
    let testCart = new Cart(0, "test_user", true, "17-04-2002", 200, [productInCart]);
    let testProduct = new Product(10, "test", Category.SMARTPHONE, "10-04-2002", " ", 35);

    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, _params, callback) => {
        if (sql.includes("UPDATE cart SET total = total - ? WHERE id = ?")) {
            callback(new Error("Database error"))
        } else {
            callback(null)
        }
        return {} as Database
    });

    jest.spyOn(cartDao, 'getCart').mockResolvedValue(testCart);


    await expect(cartDao.removeProductFromCart(user, "test")).rejects.toThrow("Database error")

    mockDBRun.mockRestore()
});

test("clearCart - successful operation", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    let testCart = new Cart(0, "test_user", false, "17-04-2002", 200, []);

    const mockDBGet = jest.spyOn(db, "get").mockImplementation((_sql, _params, callback) => {
        callback(null, testCart)
        return {} as Database
    });

    const mockDBRun = jest.spyOn(db, "run").mockImplementation((_sql, _params, callback) => {
        callback(null)
        return {} as Database
    });

    const result = await cartDao.clearCart(user)


    expect(mockDBGet).toHaveBeenCalledWith(
        "SELECT * FROM cart WHERE customer = ? AND paid = 0",
        [user.username],
        expect.any(Function)
    )

    expect(mockDBRun).toHaveBeenCalledWith(
        "DELETE FROM cart_product WHERE cartId = ?",
        [testCart.id],
        expect.any(Function)
    )


    expect(mockDBRun).toHaveBeenCalledWith(
        "UPDATE cart SET total = 0 WHERE id = ?",
        [testCart.id],
        expect.any(Function)
    )


    expect(result).toEqual(true)

    mockDBGet.mockRestore()
    mockDBRun.mockRestore()
});

test("clearCart - cart not found", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");

    const mockDBGet = jest.spyOn(db, "get").mockImplementation((_sql, _params, callback) => {
        callback(null, null)
        return {} as Database
    });

    const result = await cartDao.clearCart(user)


    expect(mockDBGet).toHaveBeenCalledWith(
        "SELECT * FROM cart WHERE customer = ? AND paid = 0",
        [user.username],
        expect.any(Function)
    )

    expect(result).toEqual(false)

    mockDBGet.mockRestore()
});

test("clearCart - database error on get cart", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");

    const mockDBGet = jest.spyOn(db, "get").mockImplementation((_sql, _params, callback) => {
        callback(new Error("Database error"), null)
        return {} as Database
    });


    await expect(cartDao.clearCart(user)).rejects.toThrow("Database error")

    mockDBGet.mockRestore()
});

test("clearCart - database error on delete products", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    let testCart = new Cart(0, "test_user", false, "17-04-2002", 200, []);

    const mockDBGet = jest.spyOn(db, "get").mockImplementation((_sql, _params, callback) => {
        callback(null, testCart)
        return {} as Database
    });

    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, _params, callback) => {
        if (sql.includes("DELETE FROM cart_product WHERE")) {
            callback(new Error("Database error"))
        } else {
            callback(null)
        }
        return {} as Database
    });


    await expect(cartDao.clearCart(user)).rejects.toThrow("Database error")

    mockDBGet.mockRestore()
    mockDBRun.mockRestore()
});

test("clearCart - database error on update cart total", async () => {
    const cartDao = new CartDAO()
    const user = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    let testCart = new Cart(0, "test_user", false, "17-04-2002", 200, []);

    const mockDBGet = jest.spyOn(db, "get").mockImplementation((_sql, _params, callback) => {
        callback(null, testCart)
        return {} as Database
    });

    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, _params, callback) => {
        if (sql.includes("UPDATE cart SET total = 0 WHERE id = ?")) {
            callback(new Error("Database error"))
        } else {
            callback(null)
        }
        return {} as Database
    });


    await expect(cartDao.clearCart(user)).rejects.toThrow("Database error")

    mockDBGet.mockRestore()
    mockDBRun.mockRestore()
});


test("deleteAllCarts - successful operation", async () => {
    const cartDao = new CartDAO()

    const mockDBRun = jest.spyOn(db, "run").mockImplementation((_sql, _params, callback) => {
        callback(null)
        return {} as Database
    });

    const result = await cartDao.deleteAllCarts()


    expect(mockDBRun).toHaveBeenCalledWith(
        "DELETE FROM cart",
        [],
        expect.any(Function)
    )


    expect(result).toEqual(true)

    mockDBRun.mockRestore()
});

test("deleteAllCarts - database error", async () => {
    const cartDao = new CartDAO()

    const mockDBRun = jest.spyOn(db, "run").mockImplementation((_sql, _params, callback) => {
        callback(new Error("Database error"))
        return {} as Database
    });


    await expect(cartDao.deleteAllCarts()).rejects.toThrow("Database error")

    mockDBRun.mockRestore()
});


test("getAllCarts - successful operation", async () => {
    const cartDao = new CartDAO();
    let productInCart = new ProductInCart("test", 20, Category.SMARTPHONE, 30);

    let testCart = new Cart(0, "test_user", false, "17-04-2002", 600, [productInCart]);
    let testProduct = new Product(30, "test", Category.SMARTPHONE, "10-04-2002", " ", 20);

    const mockDBAll = jest.spyOn(db, "all").mockImplementationOnce((_sql, _params, callback) => {
        callback(null, [testCart])
        return {} as Database
    });

    const mockDBAll2 = jest.spyOn(db, "all").mockImplementationOnce((_sql, _params, callback) => {
        callback(null, [productInCart])
        return {} as Database
    });

    // const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, _params, callback) => {
    //     console.log(sql)
    //     if (sql.includes("SELECT * FROM cart_product WHERE cartId = ?")) {
    //         console.log("MIAO")
    //         callback(null, [testCart])
    //     } else if (sql.includes("SELECT * FROM cart")) {
    //         console.log("BAU")
    //         callback(null, [productInCart])
    //     }
    //     return {} as Database
    // });


    jest.spyOn(ProductDAO.prototype, 'getProductByModel').mockResolvedValue(testProduct);

    const result = await cartDao.getAllCarts()

    expect(mockDBAll).toHaveBeenCalledWith(
        "SELECT * FROM cart",
        [],
        expect.any(Function)
    )

    expect(mockDBAll).toHaveBeenCalledWith(
        "SELECT * FROM cart_product WHERE cartId = ?",
        [testCart.id],
        expect.any(Function)
    )
    //console.log(result);
    //console.log(testCart);
    let listCart = [testCart];
    expect(result).toEqual(listCart)

    mockDBAll.mockRestore()
});


test("getAllCarts - database error on get carts", async () => {
    const cartDao = new CartDAO()

    const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, _params, callback) => {
        if (sql.includes("SELECT * FROM cart")) {
            callback(new Error("Database error"), null)
        }
        return {} as Database
    });

    await expect(cartDao.getAllCarts()).rejects.toThrow("Database error")

    mockDBAll.mockRestore()
});


/*test("getAllCarts - database error on get products", async () => {
    const cartDao = new CartDAO()

    let testCart = new Cart(0, "test_user", false, "17-04-2002", 600, []);

    const mockDBAll = jest.spyOn(db, "all").mockImplementationOnce((_sql, _params, callback) => {
        callback(null, [testCart])
        return {} as Database
    });

    const mockDBAll2 = jest.spyOn(db, "all").mockImplementationOnce((_sql, _params, callback) => {
        callback(new Error("Database error"))
        return {} as Database
    });

    await expect(cartDao.getAllCarts()).rejects.toThrow("Database error")

    mockDBAll.mockRestore()
});*/




test("hasCart - successful operation", async () => {
    const cartDao = new CartDAO()
    const testUser = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");
    let testCart = new Cart(0, "test_user", false, "17-04-2002", 200, []);

    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        if (sql.includes("SELECT * FROM cart WHERE customer = ? AND paid = 0")) {
            callback(null, {id: 1, customer: "test_user", paid: 0, paymentDate: null, total: 0})
        }
        return {} as Database
    });

    const result = await cartDao.hasCart(testUser)

    expect(mockDBGet).toHaveBeenCalledWith(
        "SELECT * FROM cart WHERE customer = ? AND paid = 0",
        [testUser.username],
        expect.any(Function)
    )

    expect(result).toBe(true)

    mockDBGet.mockRestore()
});

test("hasCart - no cart for user", async () => {
    const cartDao = new CartDAO()
    const testUser = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");

    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        if (sql.includes("SELECT * FROM cart WHERE customer = ? AND paid = 0")) {
            callback(null, null)
        }
        return {} as Database
    });

    const result = await cartDao.hasCart(testUser)

    expect(mockDBGet).toHaveBeenCalledWith(
        "SELECT * FROM cart WHERE customer = ? AND paid = 0",
        [testUser.username],
        expect.any(Function)
    )

    expect(result).toBe(false)

    mockDBGet.mockRestore()
});

test("hasCart - database error", async () => {
    const cartDao = new CartDAO()
    const testUser = new User("test_user", "Test", "User", Role.CUSTOMER, "Test Address", "1990-01-01");

    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        if (sql.includes("SELECT * FROM cart WHERE customer = ? AND paid = 0")) {
            callback(new Error("Database error"), null)
        }
        return {} as Database
    });

    await expect(cartDao.hasCart(testUser)).rejects.toThrow("Database error")

    mockDBGet.mockRestore()
});
