import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes, FaCheckCircle } from "react-icons/fa";
import { API_BASE_URL } from "../../config";

const CustomerProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [loading, setLoading] = useState(true);

    // Modal state for ordering a product
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [orderQuantity, setOrderQuantity] = useState(1);
    const [ordering, setOrdering] = useState(false);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/products`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_BASE_URL}/api/categories`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            if (prodRes.data.success) setProducts(prodRes.data.products);
            if (catRes.data.success) setCategories(catRes.data.categories);
        } catch (err) {
            console.error("Error loading products", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenOrderModal = (product) => {
        setSelectedProduct(product);
        setOrderQuantity(1);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
        setOrderQuantity(1);
    };

    const handleConfirmOrder = async (e) => {
        e.preventDefault();
        if (!selectedProduct) return;
        setOrdering(true);

        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/orders/create`,
                {
                    products: [{ productId: selectedProduct._id, quantity: Number(orderQuantity) }]
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setMessage(`Order placed successfully for ${selectedProduct.name}!`);
                handleCloseModal();
                fetchData();
                setTimeout(() => setMessage(""), 4000);
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to place order.");
        } finally {
            setOrdering(false);
        }
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
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header Title matching screenshot */}
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Products</h1>

            {message && (
                <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 px-4 py-3 rounded flex items-center gap-2 text-sm font-medium">
                    <FaCheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>{message}</span>
                </div>
            )}

            {/* Filter controls row matching screenshot */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Category Dropdown */}
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full sm:w-64 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                    <option value="all">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 px-3 py-2 bg-white border border-blue-500 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
            </div>

            {/* Products Table matching screenshot */}
            <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading products...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No products found.</div>
                ) : (
                    <table className="w-full text-left text-sm text-gray-800">
                        <thead className="bg-white border-b text-sm font-bold text-gray-900">
                            <tr>
                                <th className="px-6 py-3.5">ID</th>
                                <th className="px-6 py-3.5">Name</th>
                                <th className="px-6 py-3.5">Category</th>
                                <th className="px-6 py-3.5">Price</th>
                                <th className="px-6 py-3.5">Stock</th>
                                <th className="px-6 py-3.5 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredProducts.map((product, idx) => {
                                const isOutOfStock = product.quantity === 0;
                                return (
                                    <tr key={product._id} className="hover:bg-gray-50/80 transition">
                                        <td className="px-6 py-4 text-gray-600 font-medium">{idx + 1}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 text-gray-700">{product.category?.name || "General"}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">${product.price}</td>
                                        <td className="px-6 py-4 text-gray-700 font-medium">{product.quantity}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleOpenOrderModal(product)}
                                                disabled={isOutOfStock}
                                                className="px-4 py-1.5 bg-[#22c55e] hover:bg-[#16a34a] text-white font-medium text-sm rounded-md transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isOutOfStock ? "Out of Stock" : "Order"}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Order Confirmation Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4 shadow-xl border">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h3 className="text-lg font-bold text-gray-900">Place Order</h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleConfirmOrder} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Product Name</label>
                                <p className="text-sm font-bold text-gray-900 bg-gray-50 p-2.5 rounded border">{selectedProduct.name}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Unit Price</label>
                                    <p className="text-sm font-bold text-green-600 bg-gray-50 p-2.5 rounded border">${selectedProduct.price}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Stock Available</label>
                                    <p className="text-sm font-bold text-gray-900 bg-gray-50 p-2.5 rounded border">{selectedProduct.quantity}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Select Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={selectedProduct.quantity}
                                    required
                                    value={orderQuantity}
                                    onChange={(e) => setOrderQuantity(Math.max(1, Math.min(selectedProduct.quantity, Number(e.target.value))))}
                                    className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                />
                            </div>

                            <div className="pt-2 border-t flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500">Total Price</p>
                                    <p className="text-xl font-bold text-green-600">${(selectedProduct.price * orderQuantity).toFixed(2)}</p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm font-semibold transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={ordering}
                                        className="px-4 py-2 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded text-sm font-bold transition shadow"
                                    >
                                        {ordering ? "Processing..." : "Confirm Order"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerProducts;
