import express from "express";
import { getFavorites, addFavorite, removeFavorite } from "../controllers/favoritesController.js";

const router = express.Router();

router.get("/:email", getFavorites);
router.post("/add", addFavorite);
router.post("/remove", removeFavorite);

export default router;
