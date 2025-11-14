import React, { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext();

const FavoritesProvider = ({ children }) => {
  // ========================= manage favorite items =========================

  const [storageKey, setStorageKey] = useState("favorites_guest");

  useEffect(() => {
    const email = sessionStorage.getItem("email");
    setStorageKey(email ? `favorites_${email}` : "favorites_guest");
  }, []);

  const [favorites, setFavorites] = useState([]);

useEffect(() => {
  const saved = localStorage.getItem(storageKey);
  setFavorites(saved ? JSON.parse(saved) : []);
}, [storageKey]);


  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(favorites));
  }, [favorites, storageKey]);

  // ========================= add OR remove favorite items =========================

  const [message, setMessage] = useState("");

  const toggleFavorite = (product) => {
    setFavorites((prev) => {
      const exists = prev.find((item) => item.name === product.name);
      if (exists) {
        setMessage("Product removed from favorites!");
        return prev.filter((item) => item.name !== product.name);
      } else {
        setMessage("Product added to favorites!");
        return [...prev, product];
      }
    });

    setTimeout(() => setMessage(""), 2000);
  };

  const isFavorite = (product) =>
    favorites.some((item) => item.name === product.name);

  const removeFavorite = (product) => {
    setFavorites((prev) => prev.filter((item) => item.name !== product.name));
    setMessage("Product removed from favorites!");
    setTimeout(() => setMessage(""), 2000);
  };

  // ====================================================================

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite, removeFavorite, message }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
export default FavoritesProvider;
