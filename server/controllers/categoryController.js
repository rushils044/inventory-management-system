import Category from "../models/category.js";
import Product from "../models/product.js";

const addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ success: false, message: "Category already exists" });
        }
        const newCategory = new Category({ name, description });
        await newCategory.save();
        return res.status(201).json({ success: true, message: "Category created successfully", category: newCategory });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, categories });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name, description },
            { new: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        return res.status(200).json({ success: true, message: "Category updated successfully", category: updatedCategory });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const productsCount = await Product.countDocuments({ category: id });
        if (productsCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category because ${productsCount} product(s) are currently assigned to it.`
            });
        }
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        return res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

export { addCategory, getCategories, updateCategory, deleteCategory };
