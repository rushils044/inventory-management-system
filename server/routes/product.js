import express from "express";
import { addProduct, getProducts, getProductById, updateProduct, deleteProduct } from "../controllers/productController.js";
import { verifyUser, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyUser, getProducts);
router.get("/:id", verifyUser, getProductById);
router.post("/add", verifyUser, verifyAdmin, addProduct);
router.put("/:id", verifyUser, verifyAdmin, updateProduct);
router.delete("/:id", verifyUser, verifyAdmin, deleteProduct);

export default router;
