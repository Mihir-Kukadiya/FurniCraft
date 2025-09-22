import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const email = sessionStorage.getItem("email");
  const storageKey = email ? `cartItems_${email}` : "cartItems_guest";

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem(storageKey);
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cartItems));
  }, [cartItems, storageKey]);

  const addToCart = (product) => {
    const exists = cartItems.some((item) => item.name === product.name);
    if (exists) {
      setMessage("Product is already in the cart!");
    } else {
      setCartItems((prev) => [...prev, { ...product, quantity: 1 }]);
      setMessage("Product added to cart!");
    }

    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, setCartItems, addToCart, clearCart, message }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartProvider;
