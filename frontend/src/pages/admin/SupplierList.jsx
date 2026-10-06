import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaSearch, FaTimes } from "react-icons/fa";

const SupplierList = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" });

    const token = localStorage.getItem("token");

    const fetchSuppliers = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/suppliers", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setSuppliers(res.data.suppliers);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleOpenModal = (supplier = null) => {
        if (supplier) {
            setEditingSupplier(supplier);
            setFormData({
                name: supplier.name,
                email: supplier.email,
                phone: supplier.phone,
                address: supplier.address || ""
            });
        } else {
            setEditingSupplier(null);
            setFormData({ name: "", email: "", phone: "", address: "" });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSupplier(null);
        setFormData({ name: "", email: "", phone: "", address: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSupplier) {
                await axios.put(`http://localhost:3000/api/suppliers/${editingSupplier._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post("http://localhost:3000/api/suppliers/add", formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchSuppliers();
            handleCloseModal();
        } catch (err) {
            alert(err.response?.data?.message || "Error saving supplier");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this supplier?")) return;
        try {
            await axios.delete(`http://localhost:3000/api/suppliers/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSuppliers();
        } catch (err) {
            alert(err.response?.data?.message || "Error deleting supplier");
        }
    };

    const filteredSuppliers = suppliers.filter(
        (sup) =>
            sup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sup.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Supplier Management</h1>
                    <p className="text-gray-500 text-sm">Manage vendor records and contact info</p>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition text-sm shadow-sm"
                >
                    <FaPlus className="w-4 h-4" />
                    <span>Add Supplier</span>
                </button>
            </div>

            {/* Search Filter */}
            <div className="relative max-w-md">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search suppliers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border rounded text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                />
            </div>

            {/* Suppliers Table */}
            <div className="bg-white border rounded shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading suppliers...</div>
                ) : filteredSuppliers.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No suppliers found.</div>
                ) : (
                    <table className="w-full text-left text-sm text-gray-700">
                        <thead className="bg-gray-50 border-b text-xs font-semibold text-gray-600 uppercase">
                            <tr>
                                <th className="px-6 py-3">#</th>
                                <th className="px-6 py-3">Supplier Name</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Phone</th>
                                <th className="px-6 py-3">Address</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredSuppliers.map((sup, idx) => (
                                <tr key={sup._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-xs font-mono text-gray-400">{idx + 1}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-800">{sup.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{sup.email}</td>
                                    <td className="px-6 py-4 text-gray-600">{sup.phone}</td>
                                    <td className="px-6 py-4 text-gray-600">{sup.address || "N/A"}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleOpenModal(sup)}
                                            className="px-2.5 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition font-medium text-xs"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(sup._id)}
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
                    <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4 shadow-xl">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h3 className="text-lg font-bold text-gray-800">
                                {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
                            </h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Supplier Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter Name"
                                    className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Enter Email"
                                    className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="Enter Phone"
                                    className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Address</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Enter Address"
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
                                    {editingSupplier ? "Update" : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupplierList;
