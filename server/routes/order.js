import express from "express";
import { createOrder, getOrders, getCustomerOrders, updateOrderStatus } from "../controllers/orderController.js";
import { verifyUser, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", verifyUser, createOrder);
router.get("/customer-orders", verifyUser, getCustomerOrders);
router.get("/", verifyUser, verifyAdmin, getOrders);
router.put("/:id/status", verifyUser, verifyAdmin, updateOrderStatus);

export default router;
