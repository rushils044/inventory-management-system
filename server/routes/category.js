import express from "express";
import { addCategory, getCategories, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import { verifyUser, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyUser, getCategories);
router.post("/add", verifyUser, verifyAdmin, addCategory);
router.put("/:id", verifyUser, verifyAdmin, updateCategory);
router.delete("/:id", verifyUser, verifyAdmin, deleteCategory);

export default router;
