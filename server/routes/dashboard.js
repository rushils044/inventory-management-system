import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { verifyUser, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/summary", verifyUser, verifyAdmin, getDashboardStats);

export default router;
