import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaUser, FaCalendarAlt, FaFileCsv, FaPrint, FaTimes } from "react-icons/fa";
import { API_BASE_URL } from "../../config.js";

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const [printingOrder, setPrintingOrder] = useState(null);

    const token = localStorage.getItem("token");

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setOrders(res.data.orders);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(
                `${API_BASE_URL}/api/orders/${orderId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchOrders();
        } catch (err) {
            alert(err.response?.data?.message || "Error updating status");
        }
    };

    const handleExportCSV = () => {
        if (filteredOrders.length === 0) return;
        const headers = ["Order ID", "Date", "Customer Name", "Customer Email", "Total Amount ($)", "Status"];
        const rows = filteredOrders.map((o) => [
            `"${o._id}"`,
            `"${new Date(o.orderDate).toLocaleString()}"`,
            `"${(o.customer?.name || "Customer").replace(/"/g, '""')}"`,
            `"${(o.customer?.email || "N/A").replace(/"/g, '""')}"`,
            o.totalAmount,
            `"${o.status}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "orders_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrintInvoice = (order) => {
        setPrintingOrder(order);
    };

    const triggerPrint = () => {
        window.print();
    };

    const filteredOrders = orders.filter(
        (order) =>
            order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order._id.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Customer Orders</h1>
                    <p className="text-gray-500 text-sm">View and manage customer transactions</p>
                </div>

                <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition text-sm shadow-sm"
                >
                    <FaFileCsv className="w-4 h-4" />
                    <span>Export Orders CSV</span>
                </button>
            </div>

            {/* Search Filter */}
            <div className="relative max-w-md">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border rounded text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                />
            </div>

            {/* Orders List */}
            <div className="bg-white border rounded shadow-sm overflow-hidden divide-y">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading orders...</div>
                ) : filteredOrders.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No orders recorded.</div>
                ) : (
                    filteredOrders.map((order) => (
                        <div key={order._id} className="p-5 flex flex-col md:flex-row justify-between gap-4 hover:bg-gray-50 transition">
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                                        #{order._id.slice(-6).toUpperCase()}
                                    </span>
                                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                                        <FaCalendarAlt className="w-3 h-3" />
                                        <span>{new Date(order.orderDate).toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-gray-800 text-sm font-semibold">
                                    <FaUser className="text-gray-400 w-3.5 h-3.5" />
                                    <span>{order.customer?.name || "Customer"}</span>
                                    <span className="text-gray-400 text-xs font-normal">({order.customer?.email})</span>
                                </div>

                                <div className="bg-gray-50 p-2.5 rounded border text-xs text-gray-600 space-y-1 max-w-md">
                                    {order.products?.map((item, i) => (
                                        <div key={i} className="flex justify-between">
                                            <span>{item.product?.name || "Product"} × {item.quantity}</span>
                                            <span className="font-semibold text-gray-700">${item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col justify-between items-end gap-2 shrink-0">
                                <div className="text-right">
                                    <p className="text-xs text-gray-400">Total Amount</p>
                                    <p className="text-xl font-bold text-green-600">${order.totalAmount}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePrintInvoice(order)}
                                        className="flex items-center gap-1 px-2.5 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded transition"
                                    >
                                        <FaPrint className="w-3 h-3" />
                                        <span>Invoice</span>
                                    </button>

                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        className="px-2.5 py-1 text-xs font-bold rounded border focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
                                    >
                                        <option value="Completed">Completed</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Printable Invoice Modal */}
            {printingOrder && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-lg p-6 space-y-6 shadow-2xl border relative print:p-0 print:border-none">
                        <button
                            onClick={() => setPrintingOrder(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 print:hidden"
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>

                        <div className="border-b pb-4 space-y-1">
                            <h2 className="text-2xl font-bold text-gray-900">INVENTORY MANAGEMENT</h2>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Official Order Invoice</p>
                        </div>

                        <div className="grid grid-cols-2 text-xs gap-4 text-gray-700">
                            <div>
                                <p className="font-bold text-gray-900 uppercase">Billed To:</p>
                                <p className="font-semibold text-gray-800 mt-1">{printingOrder.customer?.name || "Customer"}</p>
                                <p>{printingOrder.customer?.email}</p>
                                <p>{printingOrder.customer?.address || "Delivery Address"}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-gray-900 uppercase">Invoice Details:</p>
                                <p className="mt-1 font-mono text-gray-800">#{printingOrder._id.toUpperCase()}</p>
                                <p>{new Date(printingOrder.orderDate).toLocaleString()}</p>
                                <p className="font-bold text-green-700 uppercase">Status: {printingOrder.status}</p>
                            </div>
                        </div>

                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b bg-gray-100 font-bold text-gray-800">
                                    <th className="p-2">Item</th>
                                    <th className="p-2 text-center">Qty</th>
                                    <th className="p-2 text-right">Price</th>
                                    <th className="p-2 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-gray-700">
                                {printingOrder.products?.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="p-2 font-medium">{item.product?.name || "Product"}</td>
                                        <td className="p-2 text-center">{item.quantity}</td>
                                        <td className="p-2 text-right">${item.price}</td>
                                        <td className="p-2 text-right font-semibold">${item.price * item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-between items-center border-t pt-4">
                            <div className="text-xs text-gray-400">Thank you for your business!</div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 font-bold uppercase">Total Amount</p>
                                <p className="text-2xl font-bold text-green-600">${printingOrder.totalAmount}</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 print:hidden">
                            <button
                                onClick={() => setPrintingOrder(null)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs font-semibold"
                            >
                                Close
                            </button>
                            <button
                                onClick={triggerPrint}
                                className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-bold shadow"
                            >
                                <FaPrint className="w-3.5 h-3.5" />
                                <span>Print / Save PDF</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderList;
