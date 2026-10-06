import Product from "../models/product.js";
import Order from "../models/order.js";

const getDashboardStats = async (req, res) => {
    try {
        // Total Products
        const totalProducts = await Product.countDocuments();

        // Total Stock (sum of quantities across all products)
        const products = await Product.find().populate("category", "name");
        const totalStock = products.reduce((sum, p) => sum + (p.quantity || 0), 0);

        // Order Today (orders created today)
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const orderToday = await Order.countDocuments({
            orderDate: { $gte: startOfDay }
        });

        // Revenue (sum of totalAmount of completed orders)
        const completedOrders = await Order.find({ status: "Completed" });
        const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        // Out of Stock Products (quantity === 0)
        const outOfStockProducts = products.filter((p) => p.quantity === 0);

        // Low Stock Products (0 < quantity <= 5)
        const lowStockProducts = products.filter((p) => p.quantity > 0 && p.quantity <= 5);

        // Highest Sale Product calculation from completed orders
        const allCompletedOrders = await Order.find({ status: "Completed" }).populate("products.product");
        const productSales = {};

        allCompletedOrders.forEach((order) => {
            order.products?.forEach((item) => {
                if (item.product) {
                    const pid = item.product._id.toString();
                    if (!productSales[pid]) {
                        productSales[pid] = {
                            name: item.product.name,
                            category: item.product.category?.name || "General",
                            totalUnitsSold: 0
                        };
                    }
                    productSales[pid].totalUnitsSold += item.quantity || 0;
                }
            });
        });

        let highestSaleProduct = null;
        let maxSold = 0;
        Object.values(productSales).forEach((p) => {
            if (p.totalUnitsSold > maxSold) {
                maxSold = p.totalUnitsSold;
                highestSaleProduct = p;
            }
        });

        return res.status(200).json({
            success: true,
            stats: {
                totalProducts,
                totalStock,
                orderToday,
                totalRevenue,
                outOfStockProducts,
                lowStockProducts,
                highestSaleProduct
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

export { getDashboardStats };
