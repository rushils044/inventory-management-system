import User from "../models/user.js";
import bcrypt from "bcrypt";

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ _id: -1 });
        return res.status(200).json({ success: true, users });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

const addUser = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User with this email already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashPassword,
            address: address || "N/A",
            role: role || "customer"
        });

        await newUser.save();
        const userResponse = { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, address: newUser.address };
        return res.status(201).json({ success: true, message: "User created successfully", user: userResponse });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Prevent admin from deleting their own active account while logged in
        if (req.user && req.user._id.toString() === id) {
            return res.status(400).json({ success: false, message: "You cannot delete your own logged-in admin account." });
        }

        // 2. Check if the user being deleted is an admin
        const targetUser = await User.findById(id);
        if (!targetUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (targetUser.role === "admin") {
            const adminCount = await User.countDocuments({ role: "admin" });
            if (adminCount <= 1) {
                return res.status(400).json({ success: false, message: "Cannot delete the last remaining admin account." });
            }
        }

        await User.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

export { getUsers, addUser, deleteUser };
