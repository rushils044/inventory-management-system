import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:3000/api/dashboard/summary", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setStats(res.data.stats);
                }
            } catch (err) {
                console.error("Error fetching dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-500 font-medium">Loading dashboard metrics...</div>;
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header Title matching screenshot */}
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>

            {/* Top 4 Summary Colored Cards Row (Exact replica of screenshot) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Card 1: Total Products (Blue) */}
                <div className="bg-[#3b82f6] text-white p-5 rounded-lg shadow-sm text-center flex flex-col justify-center items-center">
                    <p className="text-sm font-semibold text-white/90">Total Products</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats?.totalProducts || 0}</p>
                </div>

                {/* Card 2: Total Stock (Green) */}
                <div className="bg-[#22c55e] text-white p-5 rounded-lg shadow-sm text-center flex flex-col justify-center items-center">
                    <p className="text-sm font-semibold text-white/90">Total Stock</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats?.totalStock || 0}</p>
                </div>

                {/* Card 3: Order Today (Yellow) */}
                <div className="bg-[#eab308] text-white p-5 rounded-lg shadow-sm text-center flex flex-col justify-center items-center">
                    <p className="text-sm font-semibold text-white/90">Order Today</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats?.orderToday || 0}</p>
                </div>

                {/* Card 4: Revenue (Purple) */}
                <div className="bg-[#a855f7] text-white p-5 rounded-lg shadow-sm text-center flex flex-col justify-center items-center">
                    <p className="text-sm font-semibold text-white/90">Revenue</p>
                    <p className="text-3xl font-bold text-white mt-1">${stats?.totalRevenue || 0}</p>
                </div>
            </div>

            {/* Bottom 3 White Cards Grid (Exact replica of screenshot) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Out of Stock Products */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-3 min-h-[160px]">
                    <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Out of Stock Products</h2>
                    {stats?.outOfStockProducts?.length === 0 ? (
                        <p className="text-gray-400 text-sm">None</p>
                    ) : (
                        <div className="space-y-1.5 text-sm text-gray-600">
                            {stats?.outOfStockProducts?.map((item) => (
                                <p key={item._id}>
                                    <span className="font-medium text-gray-800">{item.name}</span>{" "}
                                    <span className="text-gray-400">({item.category?.name || "General"})</span>
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                {/* Highest Sale Product */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-3 min-h-[160px]">
                    <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Highest Sale Product</h2>
                    {stats?.highestSaleProduct ? (
                        <div className="space-y-1 text-sm text-gray-700">
                            <p>
                                <span className="font-semibold text-gray-900">Name:</span> {stats.highestSaleProduct.name}
                            </p>
                            <p>
                                <span className="font-semibold text-gray-900">Category:</span> {stats.highestSaleProduct.category}
                            </p>
                            <p>
                                <span className="font-semibold text-gray-900">Total Units Sold:</span> {stats.highestSaleProduct.totalUnitsSold}
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">No sales recorded yet</p>
                    )}
                </div>

                {/* Low Stock Products */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-3 min-h-[160px]">
                    <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Low Stock Products</h2>
                    {stats?.lowStockProducts?.length === 0 ? (
                        <p className="text-gray-400 text-sm">None</p>
                    ) : (
                        <div className="space-y-1.5 text-sm text-gray-600">
                            {stats?.lowStockProducts?.map((item) => (
                                <p key={item._id}>
                                    <span className="font-medium text-gray-800">{item.name}</span> -{" "}
                                    <span className="text-gray-500 font-semibold">{item.quantity} left</span>{" "}
                                    <span className="text-gray-400">({item.category?.name || "General"})</span>
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
