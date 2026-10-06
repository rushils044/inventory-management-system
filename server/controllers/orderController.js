import Order from "../models/order.js";
import Product from "../models/product.js";

const createOrder = async (req, res) => {
    try {
        const { products } = req.body; // array of { productId, quantity }
        const customerId = req.user._id;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ success: false, message: "Order must contain at least one product" });
        }

        let totalAmount = 0;
        const orderProducts = [];

        // Validate stock and calculate total
        for (const item of products) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ success: false, message: `Product with ID ${item.productId} not found` });
            }
            if (product.quantity < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for product "${product.name}". Available: ${product.quantity}, requested: ${item.quantity}`
                });
            }

            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;

            orderProducts.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });
        }

        // Create Order
        const newOrder = new Order({
            customer: customerId,
            products: orderProducts,
            totalAmount,
            status: "Completed"
        });

        await newOrder.save();

        // Deduct inventory quantities
        for (const item of products) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { quantity: -item.quantity }
            });
        }

        const populatedOrder = await Order.findById(newOrder._id)
            .populate("customer", "name email")
            .populate("products.product", "name price image");

        return res.status(201).json({ success: true, message: "Order placed successfully", order: populatedOrder });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("customer", "name email address")
            .populate("products.product", "name price image")
            .sort({ orderDate: -1 });
        return res.status(200).json({ success: true, orders });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

const getCustomerOrders = async (req, res) => {
    try {
        const customerId = req.user._id;
        const orders = await Order.find({ customer: customerId })
            .populate("products.product", "name price image")
            .sort({ orderDate: -1 });
        return res.status(200).json({ success: true, orders });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const oldStatus = order.status;
        order.status = status;
        await order.save();

        // If changing to Cancelled from Completed/Pending, restore stock
        if (status === "Cancelled" && oldStatus !== "Cancelled") {
            for (const item of order.products) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { quantity: item.quantity }
                });
            }
        }

        return res.status(200).json({ success: true, message: "Order status updated successfully", order });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

export { createOrder, getOrders, getCustomerOrders, updateOrderStatus };
