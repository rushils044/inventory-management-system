import express from "express";
import { getUsers, addUser, deleteUser } from "../controllers/userController.js";
import { verifyUser, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyUser, verifyAdmin, getUsers);
router.post("/add", verifyUser, verifyAdmin, addUser);
router.delete("/:id", verifyUser, verifyAdmin, deleteUser);

export default router;
