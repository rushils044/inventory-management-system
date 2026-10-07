import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaSearch, FaTimes, FaBoxOpen, FaFileCsv } from "react-icons/fa";
import { API_BASE_URL } from "../../config.js";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        supplier: "",
        price: "",
        quantity: "",
        description: "",
        image: ""
    });

    const token = localStorage.getItem("token");

    const fetchData = async () => {
        try {
            const [prodRes, catRes, supRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/products`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_BASE_URL}/api/categories`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_BASE_URL}/api/suppliers`, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            if (prodRes.data.success) setProducts(prodRes.data.products);
            if (catRes.data.success) setCategories(catRes.data.categories);
            if (supRes.data.success) setSuppliers(supRes.data.suppliers);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleExportCSV = () => {
        if (filteredProducts.length === 0) return;
        const headers = ["ID", "Name", "Category", "Supplier", "Price ($)", "Stock Quantity"];
        const rows = filteredProducts.map((p, idx) => [
            idx + 1,
            `"${p.name.replace(/"/g, '""')}"`,
            `"${(p.category?.name || "Uncategorized").replace(/"/g, '""')}"`,
            `"${(p.supplier?.name || "Unknown").replace(/"/g, '""')}"`,
            p.price,
            p.quantity
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "inventory_products.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                category: product.category?._id || product.category || "",
                supplier: product.supplier?._id || product.supplier || "",
                price: product.price,
                quantity: product.quantity,
                description: product.description || "",
                image: product.image || ""
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: "",
                category: categories[0]?._id || "",
                supplier: suppliers[0]?._id || "",
                price: "",
                quantity: "",
                description: "",
                image: ""
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await axios.put(`${API_BASE_URL}/api/products/${editingProduct._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${API_BASE_URL}/api/products/add`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchData();
            handleCloseModal();
        } catch (err) {
            alert(err.response?.data?.message || "Error saving product");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || "Error deleting product");
        }
    };

    const filteredProducts = products.filter((prod) => {
        const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            selectedCategoryFilter === "all" ||
            prod.category?._id === selectedCategoryFilter ||
            prod.category === selectedCategoryFilter;
        return matchesSearch && matchesCategory;
    });

    const getStockBadge = (qty) => {
        if (qty === 0) {
            return <span className="px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded">Out of Stock</span>;
        } else if (qty <= 5) {
            return <span className="px-2 py-1 text-xs font-bold bg-amber-100 text-amber-700 rounded">Low Stock ({qty})</span>;
        } else {
            return <span className="px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded">In Stock ({qty})</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Product Inventory</h1>
                    <p className="text-gray-500 text-sm">Manage products, pricing, and stock levels</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition text-sm shadow-sm"
                    >
                        <FaFileCsv className="w-4 h-4" />
                        <span>Export CSV</span>
                    </button>

                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition text-sm shadow-sm"
                    >
                        <FaPlus className="w-4 h-4" />
                        <span>Add Product</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1 max-w-md w-full">
                    <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border rounded text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                </div>

                <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
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

            {/* Product Table */}
            <div className="bg-white border rounded shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading products...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No products found.</div>
                ) : (
                    <table className="w-full text-left text-sm text-gray-700">
                        <thead className="bg-gray-50 border-b text-xs font-semibold text-gray-600 uppercase">
                            <tr>
                                <th className="px-6 py-3">Product</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Supplier</th>
                                <th className="px-6 py-3">Price</th>
                                <th className="px-6 py-3">Stock Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredProducts.map((prod) => (
                                <tr key={prod._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        {prod.image ? (
                                            <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded object-cover border" />
                                        ) : (
                                            <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 border">
                                                <FaBoxOpen className="w-5 h-5" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-semibold text-gray-800">{prod.name}</p>
                                            <p className="text-xs text-gray-500 truncate max-w-xs">{prod.description || "No description"}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <span className="px-2 py-1 text-xs bg-gray-100 rounded font-medium">
                                            {prod.category?.name || "Uncategorized"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-xs">{prod.supplier?.name || "Unknown"}</td>
                                    <td className="px-6 py-4 font-bold text-green-600">${prod.price}</td>
                                    <td className="px-6 py-4">{getStockBadge(prod.quantity)}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleOpenModal(prod)}
                                            className="px-2.5 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition font-medium text-xs"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(prod._id)}
                                            className="px-2.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded transition font-medium text-xs"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-lg p-6 space-y-4 shadow-xl overflow-y-auto max-h-[90vh]">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h3 className="text-lg font-bold text-gray-800">
                                {editingProduct ? "Edit Product" : "Add New Product"}
                            </h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter Product Name"
                                    className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                                    <select
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((c) => (
                                            <option key={c._id} value={c._id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Supplier</label>
                                    <select
                                        required
                                        value={formData.supplier}
                                        onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                        className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                                    >
                                        <option value="">Select Supplier</option>
                                        {suppliers.map((s) => (
                                            <option key={s._id} value={s._id}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="0.00"
                                        className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Stock Quantity</label>
                                    <input
                                        type="number"
                                        min="0"
                                        required
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                        placeholder="0"
                                        className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Image URL</label>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="Enter Image URL"
                                    className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                                <textarea
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Enter Description"
                                    className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm font-semibold transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-semibold transition"
                                >
                                    {editingProduct ? "Update" : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;
