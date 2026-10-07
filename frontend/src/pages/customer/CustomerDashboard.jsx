import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/authcontext.jsx";
import { useNavigate } from "react-router";
import { API_BASE_URL } from "../../config";
import { 
  FaBoxes, 
  FaSearch, 
  FaSignOutAlt, 
  FaUserCircle, 
  FaCheckCircle, 
  FaReceipt,
  FaExclamationCircle
} from "react-icons/fa";

const CustomerDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("products"); // "products" | "orders"
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [myOrders, setMyOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderQuantities, setOrderQuantities] = useState({});
    const [orderingId, setOrderingId] = useState(null);
    const [message, setMessage] = useState({ text: "", type: "" }); // type: "success" | "error"

    const token = localStorage.getItem("token");

    const fetchStoreData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/products`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_BASE_URL}/api/categories`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            if (prodRes.data.success) {
                setProducts(prodRes.data.products);
                // initialize quantities to 1
                const initialQty = {};
                prodRes.data.products.forEach((p) => {
                    initialQty[p._id] = 1;
                });
                setOrderQuantities(initialQty);
            }
            if (catRes.data.success) setCategories(catRes.data.categories);
        } catch (err) {
            console.error("Error fetching store data", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyOrders = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/orders/customer-orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setMyOrders(res.data.orders);
            }
        } catch (err) {
            console.error("Error fetching customer orders", err);
        }
    };

    useEffect(() => {
        fetchStoreData();
        fetchMyOrders();
    }, []);

    const handleQtyChange = (productId, val, maxStock) => {
        const num = parseInt(val) || 1;
        const bounded = Math.max(1, Math.min(num, maxStock > 0 ? maxStock : 1));
        setOrderQuantities((prev) => ({ ...prev, [productId]: bounded }));
    };

    const handleDirectOrder = async (product) => {
        const qty = orderQuantities[product._id] || 1;

        if (product.quantity <= 0) {
            setMessage({ text: "Product is out of stock!", type: "error" });
            return;
        }

        if (qty > product.quantity) {
            setMessage({ text: `Cannot order more than ${product.quantity} items in stock.`, type: "error" });
            return;
        }

        setOrderingId(product._id);
        setMessage({ text: "", type: "" });

        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/orders/create`,
                {
                    products: [{ productId: product._id, quantity: qty }]
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setMessage({ text: `Order placed successfully for ${qty} x ${product.name}!`, type: "success" });
                fetchStoreData();
                fetchMyOrders();
                setTimeout(() => setMessage({ text: "", type: "" }), 4000);
            }
        } catch (err) {
            setMessage({ text: err.response?.data?.message || "Failed to place order.", type: "error" });
        } finally {
            setOrderingId(null);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const filteredProducts = products.filter((prod) => {
        const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            selectedCategory === "all" ||
            prod.category?._id === selectedCategory ||
            prod.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col font-sans">
            {/* Top Navbar */}
            <header className="bg-green-600 text-white shadow px-6 h-16 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <FaBoxes className="w-6 h-6" />
                    <h1 className="font-bold text-xl tracking-wide">Customer Dashboard</h1>
                </div>

                <div className="flex items-center gap-2 bg-green-700/60 p-1 rounded">
                    <button
                        onClick={() => setActiveTab("products")}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-bold transition ${
                            activeTab === "products" ? "bg-white text-green-700" : "text-white hover:bg-green-700"
                        }`}
                    >
                        <FaBoxes className="w-3.5 h-3.5" />
                        <span>Products Catalog</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-bold transition ${
                            activeTab === "orders" ? "bg-white text-green-700" : "text-white hover:bg-green-700"
                        }`}
                    >
                        <FaReceipt className="w-3.5 h-3.5" />
                        <span>My Orders ({myOrders.length})</span>
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                        <FaUserCircle className="w-4 h-4" />
                        <span>{user?.name || "Customer"}</span>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded transition"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Area */}
            <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
                {message.text && (
                    <div
                        className={`px-4 py-3 rounded border flex items-center gap-2 font-medium text-sm ${
                            message.type === "success"
                                ? "bg-green-100 border-green-300 text-green-800"
                                : "bg-red-100 border-red-300 text-red-800"
                        }`}
                    >
                        {message.type === "success" ? (
                            <FaCheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                        ) : (
                            <FaExclamationCircle className="w-4 h-4 text-red-600 shrink-0" />
                        )}
                        <span>{message.text}</span>
                    </div>
                )}

                {activeTab === "products" ? (
                    <>
                        {/* Search & Category Filter */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                            <div className="relative w-full max-w-md">
                                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search products by name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white border rounded text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                                />
                            </div>

                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-2 bg-white border rounded text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                            >
                                <option value="all">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Products Table (Video Tutorial Style) */}
                        <div className="bg-white border rounded shadow-sm overflow-hidden">
                            {loading ? (
                                <div className="p-8 text-center text-gray-500">Loading available products...</div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="p-8 text-center text-gray-400">No products found in store.</div>
                            ) : (
                                <table className="w-full text-left text-sm text-gray-700">
                                    <thead className="bg-gray-100 border-b text-xs font-bold text-gray-600 uppercase">
                                        <tr>
                                            <th className="px-6 py-3">#</th>
                                            <th className="px-6 py-3">Product Name</th>
                                            <th className="px-6 py-3">Category</th>
                                            <th className="px-6 py-3">Price</th>
                                            <th className="px-6 py-3">Stock Available</th>
                                            <th className="px-6 py-3">Order Quantity</th>
                                            <th className="px-6 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {filteredProducts.map((product, idx) => {
                                            const isOutOfStock = product.quantity === 0;
                                            const qty = orderQuantities[product._id] || 1;

                                            return (
                                                <tr key={product._id} className="hover:bg-gray-50 transition">
                                                    <td className="px-6 py-4 text-xs font-mono text-gray-400">{idx + 1}</td>
                                                    <td className="px-6 py-4 font-semibold text-gray-800">
                                                        {product.name}
                                                        {product.description && (
                                                            <p className="text-xs text-gray-400 font-normal">{product.description}</p>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2.5 py-1 text-xs bg-gray-100 rounded font-medium text-gray-600">
                                                            {product.category?.name || "General"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-green-600">${product.price}</td>
                                                    <td className="px-6 py-4">
                                                        {isOutOfStock ? (
                                                            <span className="px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded">
                                                                Out of Stock
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded">
                                                                {product.quantity} units
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max={product.quantity}
                                                            disabled={isOutOfStock}
                                                            value={qty}
                                                            onChange={(e) => handleQtyChange(product._id, e.target.value, product.quantity)}
                                                            className="w-20 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-600 disabled:bg-gray-100 disabled:text-gray-400"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => handleDirectOrder(product)}
                                                            disabled={isOutOfStock || orderingId === product._id}
                                                            className="px-4 py-1.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold text-xs rounded transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {orderingId === product._id ? "Ordering..." : isOutOfStock ? "Unavailable" : "Order Now"}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                ) : (
                    /* My Orders Section */
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
                            <p className="text-gray-500 text-sm">View details of your past purchase transactions</p>
                        </div>

                        {myOrders.length === 0 ? (
                            <div className="bg-white border rounded p-12 text-center text-gray-400 shadow-sm">
                                You haven't placed any orders yet.
                            </div>
                        ) : (
                            <div className="bg-white border rounded shadow-sm overflow-hidden divide-y">
                                {myOrders.map((order) => (
                                    <div key={order._id} className="p-5 flex flex-col md:flex-row justify-between gap-4 hover:bg-gray-50 transition">
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                                                    Order #{order._id.slice(-6).toUpperCase()}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(order.orderDate).toLocaleString()}
                                                </span>
                                            </div>

                                            <div className="bg-gray-50 p-2.5 rounded border text-xs text-gray-600 space-y-1 max-w-md">
                                                {order.products?.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between">
                                                        <span>{item.product?.name || "Product"} × {item.quantity}</span>
                                                        <span className="font-bold text-gray-700">${item.price * item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-between items-end gap-2 shrink-0">
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400">Total Price</p>
                                                <p className="text-xl font-bold text-green-600">${order.totalAmount}</p>
                                            </div>

                                            <span
                                                className={`px-3 py-1 text-xs font-bold uppercase rounded ${
                                                    order.status === "Completed"
                                                        ? "bg-green-100 text-green-700"
                                                        : order.status === "Pending"
                                                        ? "bg-amber-100 text-amber-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default CustomerDashboard;
