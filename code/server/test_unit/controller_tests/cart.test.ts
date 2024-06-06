import { describe, test, expect, afterEach, beforeAll, afterAll, jest } from "@jest/globals"
import {User, Role} from "../../src/components/user";
import { Cart, ProductInCart } from "../../src/components/cart";
import CartController from "../../src/controllers/cartController";
import CartDAO from "../../src/dao/cartDAO";
import { Category, Product } from "../../src/components/product";
import ProductDAO from "../../src/dao/productDAO";
import { LowProductStockError } from "../../src/errors/productError";
import { CartNotFoundError, EmptyCartError, ProductInCartError, ProductNotInCartError } from "../../src/errors/cartError";
const baseURL = "/ezelectronics";

let testCustomer = new User("customer", "customer", "customer", Role.CUSTOMER, "", "")
let testCart = new Cart(0, "customer", false, "17-04-2002", 0, []);
let testProduct= new Product(10, "iphone13", Category.SMARTPHONE, "10-04-2002"," " , 3);


jest.mock("../../src/dao/cartDAO")
jest.mock("../../src/routers/auth")

jest.mock("../../src/routers/auth")


afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

describe("controller unit tests", () => {
  describe("CartController", () => {
    test("It should add a product to the cart of the logged in user", async () => {
      
      const addToCartSpy = jest.spyOn(CartDAO.prototype, "addToCart").mockResolvedValueOnce(true);
      const addToCartSpy2 = jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(testProduct);
      
      const controller = new CartController();
      const response=await controller.addToCart(testCustomer, "test");
      expect(CartDAO.prototype.addToCart).toHaveBeenCalled();
      expect(CartDAO.prototype.addToCart).toHaveBeenCalledWith(testCustomer, "test");
      expect(response).toBe(true);
    });
  })

  describe("CartController", () => {
    let testCustomer = new User("customer2", "customer2", "customer2", Role.CUSTOMER, "", "")

    test("Error cart not found error", async () => {
      let testProduct= new Product(10, "iphone13", Category.SMARTPHONE, "10-04-2002"," " , -1);
      const addToCartSpy = jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(testProduct);
      const controller = new CartController();
      await expect(controller.addToCart(testCustomer, "test")).rejects.toThrow(LowProductStockError);
    });
    
  })

    describe("CartController", () => {
      test("It should retrieve the user's cart", async () => {
        const getCartSpy = jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(testCart);
        
        const controller = new CartController();
        const response = await controller.getCart(testCustomer);
  
        expect(CartDAO.prototype.getCart).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.getCart).toHaveBeenCalledWith(testCustomer);
        expect(response).toEqual(testCart);
      });

      describe("CartController", () => {
        let emptyCart = new Cart(0, "customer", false, "17-04-2002", 0, []);
        test("Empty cart", async () => {
          const getCartSpy = jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(emptyCart);
          
          const controller = new CartController();
          const response = await controller.getCart(testCustomer);
    
          expect(CartDAO.prototype.getCart).toHaveBeenCalledTimes(1);
          expect(CartDAO.prototype.getCart).toHaveBeenCalledWith(testCustomer);
          expect(response).toEqual(emptyCart);
        });

    describe("CartController", () => {
      test("It should checkout the user's cart", async () => {
        const prodottoInCarrello=new ProductInCart("iphone13", 1, Category.SMARTPHONE, 20);
        const prodotto=new Product(20,"iphone13", Category.SMARTPHONE,null, null, 1);
        const testCart = new Cart(0, "customer", false, "17-04-2002", 0, [prodottoInCarrello]);
        const checkoutCartSpy = jest.spyOn(CartDAO.prototype, "checkoutCart").mockResolvedValueOnce(true);
        const checkoutCartSpy2 = jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(testCart);
        const checkoutCartSpy3 = jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(prodotto);
        const controller = new CartController();
        const response = await controller.checkoutCart(testCustomer);
  
        expect(CartDAO.prototype.checkoutCart).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.checkoutCart).toHaveBeenCalledWith(testCustomer);
        expect(response).toBe(true);
      });
  
      test("Cart already paid", async () => {
        const prodottoInCarrello=new ProductInCart("iphone13", 1, Category.SMARTPHONE, 20);
        const prodotto=new Product(20,"iphone13", Category.SMARTPHONE,null, null, 1);
        const testCart = new Cart(0, "customer", true, "17-04-2002", 0, [prodottoInCarrello]);
        const checkoutCartSpy = jest.spyOn(CartDAO.prototype, "checkoutCart").mockResolvedValueOnce(true);
        const checkoutCartSpy2 = jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(testCart);
        const checkoutCartSpy3 = jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(prodotto);
        const controller = new CartController();
        await expect(controller.checkoutCart(testCustomer)).rejects.toThrow(CartNotFoundError);
      });

      test("Empty cart", async () => {
        const prodottoInCarrello=new ProductInCart("iphone13", 1, Category.SMARTPHONE, 20);
        const prodotto=new Product(20,"iphone13", Category.SMARTPHONE,null, null, 1);
        const testCart = new Cart(0, "customer", false, "17-04-2002", 0, []);
        const checkoutCartSpy = jest.spyOn(CartDAO.prototype, "checkoutCart").mockResolvedValueOnce(true);
        const checkoutCartSpy2 = jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(testCart);
        const checkoutCartSpy3 = jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(prodotto);
        const controller = new CartController();
        await expect(controller.checkoutCart(testCustomer)).rejects.toThrow(EmptyCartError);
      });

      test("ProductInCartError (no availability)", async () => {
        const prodottoInCarrello=new ProductInCart("iphone13", 0, Category.SMARTPHONE, 20);
        const prodotto=new Product(20,"iphone13", Category.SMARTPHONE,null, null, -1);
        const testCart = new Cart(0, "customer", false, "17-04-2002", 0, [prodottoInCarrello]);
        const checkoutCartSpy = jest.spyOn(CartDAO.prototype, "checkoutCart").mockResolvedValueOnce(true);
        const checkoutCartSpy2 = jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(testCart);
        const checkoutCartSpy3 = jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(prodotto);
        const controller = new CartController();
        await expect(controller.checkoutCart(testCustomer)).rejects.toThrow(ProductInCartError);
      });

      test("ProductInCartError (Information changed)", async () => {
        const prodottoInCarrello=new ProductInCart("iphone13", 20, Category.SMARTPHONE, 20);
        const prodotto=new Product(20,"iphone13", Category.SMARTPHONE,null, null, 200);
        const testCart = new Cart(0, "customer", false, "17-04-2002", 0, [prodottoInCarrello]);
        const checkoutCartSpy = jest.spyOn(CartDAO.prototype, "checkoutCart").mockResolvedValueOnce(true);
        const checkoutCartSpy2 = jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(testCart);
        const checkoutCartSpy3 = jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(prodotto);
        const controller = new CartController();
        await expect(controller.checkoutCart(testCustomer)).rejects.toThrow(ProductInCartError);
      });
    });

    /*describe("CartController", () => {
      test("It should handle errors when adding a product to the cart", async () => {
        const error = new Error("Database error");
        const addToCartSpy = jest.spyOn(CartDAO.prototype, "addToCart").mockRejectedValueOnce(error);
        
        const controller = new CartController();
        let caughtError;
        try {
          await controller.addToCart(testCustomer, "test");
        } catch (e) {
          caughtError = e;
        }
    
        expect(addToCartSpy).toHaveBeenCalledTimes(1);
        expect(addToCartSpy).toHaveBeenCalledWith(testCustomer, "test");
        expect(caughtError).toEqual(error);
      });
    });


    describe("CartController", () => {
      test("It should handle errors when the product does not exist", async () => {
        const addToCartSpy = jest.spyOn(CartDAO.prototype, "addToCart").mockResolvedValueOnce(false);
        
        const controller = new CartController();
        const response = await controller.addToCart(testCustomer, "non-existing-product");
    
        expect(addToCartSpy).toHaveBeenCalledTimes(1);
        expect(addToCartSpy).toHaveBeenCalledWith(testCustomer, "non-existing-product");
        expect(response).toBe(false);
      });
    
      test("It should handle errors when the user does not exist", async () => {
        const addToCartSpy = jest.spyOn(CartDAO.prototype, "addToCart").mockResolvedValueOnce(false);
        
        const controller = new CartController();
        const response = await controller.addToCart(testCustomer, "test");
    
        expect(addToCartSpy).toHaveBeenCalledTimes(1);
        expect(addToCartSpy).toHaveBeenCalledWith(testCustomer, "test");
        expect(response).toBe(false);
      });
    
      test("It should handle errors when the cart cannot be checked out", async () => {
        const checkoutCartSpy = jest.spyOn(CartDAO.prototype, "checkoutCart").mockResolvedValueOnce(false);
        
        const controller = new CartController();
        const response = await controller.checkoutCart(testCustomer);
    
        expect(checkoutCartSpy).toHaveBeenCalledTimes(1);
        expect(checkoutCartSpy).toHaveBeenCalledWith(testCustomer);
        expect(response).toBe(false);
      });
    });*/
    
    

    describe("CartController", () => {
      test("Should remove the cart of the logged in user", async () => {
        const prodottoInCarrello=new ProductInCart("iphone13", 1, Category.SMARTPHONE, 20);
        const prodotto=new Product(20,"iphone13", Category.SMARTPHONE,null, null, 1);
        const testCart = new Cart(0, "customer", false, "17-04-2002", 0, [prodottoInCarrello]);
        const removeProductFromCartSpy = jest.spyOn(CartDAO.prototype, "removeProductFromCart").mockResolvedValueOnce(true);
        const removeProductFromCartSpy2 = jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(prodotto);
        const removeProductFromCartSpy3 = jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(testCart);
        

        const controller = new CartController();
        const response = await controller.removeProductFromCart(testCustomer, testProduct.model);
  
        expect(removeProductFromCartSpy).toHaveBeenCalledTimes(1);
        expect(removeProductFromCartSpy).toHaveBeenCalledWith(testCustomer, testProduct.model);
        expect(response).toBe(true);
      });
  
      test("Product not in cart error", async () => {
        const prodottoInCarrello=new ProductInCart("iphone13", 1, Category.SMARTPHONE, 20);
        const prodotto=new Product(20,"iphone14", Category.SMARTPHONE,null, null, 1);
        const testUser = new User("test", "test", "test", Role.CUSTOMER, "", "");
        const testCart = new Cart(0, "test", false, "17-04-2002", 0, [prodottoInCarrello]);
        
        
        const removeProductFromCartSpy = jest.spyOn(CartDAO.prototype, "removeProductFromCart").mockResolvedValueOnce(true);
        const removeProductFromCartSpy2 = jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(prodotto);
        const removeProductFromCartSpy3 = jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(testCart);
        

        const controller = new CartController();
        //const response = await controller.removeProductFromCart(testCustomer, testProduct.model);
  
        //expect(removeProductFromCartSpy).toHaveBeenCalledTimes(1);
        //expect(removeProductFromCartSpy).toHaveBeenCalledWith(testCustomer, testProduct.model);
        await expect(controller.removeProductFromCart(testCustomer, prodotto.model)).rejects.toThrow(ProductNotInCartError);
      });

      test("Cart already paid", async () => {
        const prodottoInCarrello=new ProductInCart("iphone13", 1, Category.SMARTPHONE, 20);
        const prodotto=new Product(20,"iphone13", Category.SMARTPHONE,null, null, 1);
        const testUser = new User("test", "test", "test", Role.CUSTOMER, "", "");
        const testCart = new Cart(0, "test", true, "17-04-2002", 0, [prodottoInCarrello]);
        
        
        const removeProductFromCartSpy = jest.spyOn(CartDAO.prototype, "removeProductFromCart").mockResolvedValueOnce(true);
        const removeProductFromCartSpy2 = jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(prodotto);
        const removeProductFromCartSpy3 = jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(testCart);
        

        const controller = new CartController();
        //const response = await controller.removeProductFromCart(testCustomer, testProduct.model);
  
        //expect(removeProductFromCartSpy).toHaveBeenCalledTimes(1);
        //expect(removeProductFromCartSpy).toHaveBeenCalledWith(testCustomer, testProduct.model);
        await expect(controller.removeProductFromCart(testCustomer, testProduct.model)).rejects.toThrow(ProductNotInCartError);
      });
    });


    describe("CartController", () => {
      test("It should clear all the carts", async () => {
        const prodottoInCarrello=new ProductInCart("iphone13", 1, Category.SMARTPHONE, 20);
        const prodotto=new Product(20,"iphone13", Category.SMARTPHONE,null, null, 1);
        const testUser = new User("test", "test", "test", Role.CUSTOMER, "", "");
        const testCart = new Cart(0, "test", false, "17-04-2002", 0, [prodottoInCarrello]);
        const addToCartSpy = jest.spyOn(CartDAO.prototype, "clearCart").mockResolvedValueOnce(true);
        const addToCartSpy2 = jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(testCart);
        const controller = new CartController();
        //const response = await controller.addToCart(testCustomer, "test");
        const response=await controller.clearCart(testCustomer);
        expect(CartDAO.prototype.clearCart).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.clearCart).toHaveBeenCalledWith(testCustomer);
        expect(response).toBe(true);
      });

      test("Product not in cart (paid cart)", async () => {
        const prodottoInCarrello=new ProductInCart("iphone13", 1, Category.SMARTPHONE, 20);
        const prodotto=new Product(20,"iphone13", Category.SMARTPHONE,null, null, 1);
        const testUser = new User("test", "test", "test", Role.CUSTOMER, "", "");
        const testCart = new Cart(0, "test", true, "17-04-2002", 0, [prodottoInCarrello]);
        //const addToCartSpy = jest.spyOn(CartDAO.prototype, "clearCart").mockResolvedValueOnce(true);
        const addToCartSpy2 = jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(testCart);
        const controller = new CartController();
        //const response = await controller.addToCart(testCustomer, "test");
        //const response=await controller.clearCart(testCustomer);
        //expect(CartDAO.prototype.clearCart).toHaveBeenCalledTimes(1);
        //expect(CartDAO.prototype.clearCart).toHaveBeenCalledWith(testCustomer);
        await expect(controller.clearCart(testCustomer)).rejects.toThrow(ProductNotInCartError);
      });

      
    })

    describe("CartController", () => {
      test("It should get customer's cart", async () => {
        let testCart = new Cart(0, "customer", false, "17-04-2002", 0, []);
        let testProduct= new Product(10, "iphone13", Category.SMARTPHONE, "10-04-2002"," " , 3);


        const addToCartSpy = jest.spyOn(CartDAO.prototype, "getCustomerCarts").mockResolvedValueOnce([testCart]);
        
        const controller = new CartController();
        //const response = await controller.addToCart(testCustomer, "test");
        const response=await controller.getCustomerCarts(testCustomer);
        expect(CartDAO.prototype.getCustomerCarts).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.getCustomerCarts).toHaveBeenCalledWith(testCustomer);
        expect(response).toEqual([testCart]);
      });
    })

    describe("CartController", () => {
      test("error in clear cart", async () => {
         
        let testCart = new Cart(0, "customer4", false, "17-04-2002", 0, []);
        let testProduct= new Product(10, "iphone13", Category.SMARTPHONE, "10-04-2002"," " , 3);


        const addToCartSpy = jest.spyOn(CartDAO.prototype, "getCustomerCarts").mockResolvedValueOnce([]);
        
        const controller = new CartController();
        //const response = await controller.addToCart(testCustomer, "test");
        const response=await controller.getCustomerCarts(testCustomer);
        expect(CartDAO.prototype.getCustomerCarts).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.getCustomerCarts).toHaveBeenCalledWith(testCustomer);
        expect(response).toEqual([]);
      });
    })


    describe("CartController", () => {
      test("Should remove all the carts of all the users", async () => {
        const deleteAllCartsSpy = jest.spyOn(CartDAO.prototype, "deleteAllCarts").mockResolvedValueOnce(true);
        
        const controller = new CartController();
        const response = await controller.deleteAllCarts();
  
        expect(deleteAllCartsSpy).toHaveBeenCalledTimes(1);
        expect(response).toBe(true);
      }, 10000);
  
      test("return false if the cart cannot be removed", async () => {
        const deleteAllCartsSpy = jest.spyOn(CartDAO.prototype, "deleteAllCarts").mockResolvedValueOnce(false);
        
        const controller = new CartController();
        const response = await controller.deleteAllCarts();
  
        expect(deleteAllCartsSpy).toHaveBeenCalledTimes(1);
        expect(response).toBe(false);
      });
    });

    /*@returns A Promise that resolves to an array of carts.
     
    async getAllCarts(): Promise<Cart[]>{
      return this.dao.getAllCarts()
    }
    */
    /*describe("CartController", () => {
      test("Should get all the carts, if possible", async () => {
        const getAllCarts = jest.spyOn(CartDAO.prototype, "getAllCarts").mockResolvedValueOnce(undefined);
        
        const controller = new CartController();
        const response = await controller.getAllCarts();
  
        expect(getAllCarts).toHaveBeenCalledTimes(1);
        expect(response).toBe(undefined);
      }, 10000);

    });*/
      describe("CartController", () => {
        test("Should get all the carts", async () => {
          const getAllCarts = jest.spyOn(CartDAO.prototype, "getAllCarts").mockResolvedValueOnce([testCart]);
          
          const controller = new CartController();
          const response = await controller.getAllCarts();
    
          expect(getAllCarts).toHaveBeenCalledTimes(1);
          expect(response).toStrictEqual([testCart]);
        });
      });
      
    
    
});
});
});