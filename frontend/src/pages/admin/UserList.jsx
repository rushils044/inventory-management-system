import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaSearch, FaTimes, FaUserShield, FaUser } from "react-icons/fa";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", password: "", address: "", role: "customer" });

    const token = localStorage.getItem("token");

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setUsers(res.data.users);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenModal = () => {
        setFormData({ name: "", email: "", password: "", address: "", role: "customer" });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3000/api/users/add", formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
            handleCloseModal();
        } catch (err) {
            alert(err.response?.data?.message || "Error adding user");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await axios.delete(`http://localhost:3000/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || "Error deleting user");
        }
    };

    const filteredUsers = users.filter(
        (u) =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">User Accounts</h1>
                    <p className="text-gray-500 text-sm">Manage registered system users</p>
                </div>

                <button
                    onClick={handleOpenModal}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition text-sm shadow-sm"
                >
                    <FaPlus className="w-4 h-4" />
                    <span>Add User</span>
                </button>
            </div>

            {/* Search Filter */}
            <div className="relative max-w-md">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border rounded text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                />
            </div>

            {/* Users Table */}
            <div className="bg-white border rounded shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading user list...</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No users found.</div>
                ) : (
                    <table className="w-full text-left text-sm text-gray-700">
                        <thead className="bg-gray-50 border-b text-xs font-semibold text-gray-600 uppercase">
                            <tr>
                                <th className="px-6 py-3">#</th>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Address</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredUsers.map((u, idx) => (
                                <tr key={u._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-xs font-mono text-gray-400">{idx + 1}</td>
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-gray-800">{u.name}</p>
                                        <p className="text-xs text-gray-500">{u.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {u.role === "admin" ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold bg-green-100 text-green-700 rounded">
                                                <FaUserShield className="w-3 h-3" />
                                                Admin
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-700 rounded">
                                                <FaUser className="w-3 h-3" />
                                                Customer
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{u.address || "N/A"}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(u._id)}
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
                            <h3 className="text-lg font-bold text-gray-800">Add New User</h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Name</label>
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
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Enter Password"
                                    className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                                >
                                    <option value="customer">Customer</option>
                                    <option value="admin">Admin</option>
                                </select>
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
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;
