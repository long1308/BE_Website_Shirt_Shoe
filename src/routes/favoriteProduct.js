import express from "express";
const router = express.Router();
import { createFavoriteProduct,removeFavoriteProduct } from "../controllers/favoriteProduct";
router.post("/favoriteProducts", createFavoriteProduct);
router.delete("/favoriteProducts", removeFavoriteProduct);
export default router;