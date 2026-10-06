import Product from "../models/product.js";

const addProduct = async (req, res) => {
    try {
        const { name, category, supplier, price, quantity, description, image } = req.body;
        
        if (Number(price) <= 0) {
            return res.status(400).json({ success: false, message: "Price must be a positive number greater than 0" });
        }
        if (Number(quantity) < 0) {
            return res.status(400).json({ success: false, message: "Stock quantity cannot be negative" });
        }

        const newProduct = new Product({
            name,
            category,
            supplier,
            price: Number(price),
            quantity: Number(quantity),
            description: description || "",
            image: image || ""
        });
        await newProduct.save();
        const populatedProduct = await Product.findById(newProduct._id)
            .populate("category", "name")
            .populate("supplier", "name");

        return res.status(201).json({ success: true, message: "Product created successfully", product: populatedProduct });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate("category", "name")
            .populate("supplier", "name")
            .sort({ createdAt: -1 });
        return res.status(200).json({ success: true, products });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id)
            .populate("category", "name")
            .populate("supplier", "name");
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        return res.status(200).json({ success: true, product });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, supplier, price, quantity, description, image } = req.body;

        if (Number(price) <= 0) {
            return res.status(400).json({ success: false, message: "Price must be a positive number greater than 0" });
        }
        if (Number(quantity) < 0) {
            return res.status(400).json({ success: false, message: "Stock quantity cannot be negative" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, category, supplier, price: Number(price), quantity: Number(quantity), description, image },
            { new: true }
        )
            .populate("category", "name")
            .populate("supplier", "name");

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        return res.status(200).json({ success: true, message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        return res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

export { addProduct, getProducts, getProductById, updateProduct, deleteProduct };
