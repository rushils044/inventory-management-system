import Supplier from "../models/supplier.js";
import Product from "../models/product.js";

const addSupplier = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        const newSupplier = new Supplier({ name, email, phone, address });
        await newSupplier.save();
        return res.status(201).json({ success: true, message: "Supplier created successfully", supplier: newSupplier });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, suppliers });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address } = req.body;
        const updatedSupplier = await Supplier.findByIdAndUpdate(
            id,
            { name, email, phone, address },
            { new: true }
        );
        if (!updatedSupplier) {
            return res.status(404).json({ success: false, message: "Supplier not found" });
        }
        return res.status(200).json({ success: true, message: "Supplier updated successfully", supplier: updatedSupplier });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const productsCount = await Product.countDocuments({ supplier: id });
        if (productsCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete supplier because ${productsCount} product(s) are currently assigned to it.`
            });
        }
        const deletedSupplier = await Supplier.findByIdAndDelete(id);
        if (!deletedSupplier) {
            return res.status(404).json({ success: false, message: "Supplier not found" });
        }
        return res.status(200).json({ success: true, message: "Supplier deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

export { addSupplier, getSuppliers, updateSupplier, deleteSupplier };
