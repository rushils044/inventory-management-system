import express from "express";
import { addSupplier, getSuppliers, updateSupplier, deleteSupplier } from "../controllers/supplierController.js";
import { verifyUser, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyUser, getSuppliers);
router.post("/add", verifyUser, verifyAdmin, addSupplier);
router.put("/:id", verifyUser, verifyAdmin, updateSupplier);
router.delete("/:id", verifyUser, verifyAdmin, deleteSupplier);

export default router;
