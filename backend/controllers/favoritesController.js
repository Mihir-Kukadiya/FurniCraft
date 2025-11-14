import Favorite from "../models/Favorites.js";

// GET favorites for one user
export const getFavorites = async (req, res) => {
  try {
    const email = req.params.email;
    const favorites = await Favorite.find({ userEmail: email }).sort({ createdAt: -1 });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
};

// ADD favorite
export const addFavorite = async (req, res) => {
  try {
    const { userEmail, product } = req.body;

    const exists = await Favorite.findOne({
      userEmail,
      productId: product._id,
    });

    if (exists) return res.json({ message: "EXISTS" });

    const fav = await Favorite.create({
      userEmail,
      productId: product._id,
      name: product.name,
      img: product.img,
      price: product.price,
      category: product.category,
      description: product.description,
    });

    res.json({ message: "ADDED", fav });
  } catch (err) {
    res.status(500).json({ message: "Failed to add favorite" });
  }
};

// REMOVE favorite
export const removeFavorite = async (req, res) => {
  try {
    const { userEmail, productId } = req.body;

    await Favorite.findOneAndDelete({ userEmail, productId });

    res.json({ message: "REMOVED" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove favorite" });
  }
};
