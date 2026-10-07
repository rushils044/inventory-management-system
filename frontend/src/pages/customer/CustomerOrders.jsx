import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPrint, FaTimes } from "react-icons/fa";
import { API_BASE_URL } from "../../config";

const CustomerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [printingOrder, setPrintingOrder] = useState(null);

    const token = localStorage.getItem("token");

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/orders/customer-orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setOrders(res.data.orders);
            }
        } catch (err) {
            console.error("Error fetching orders", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const triggerPrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders</h1>

            <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No past orders found.</div>
                ) : (
                    <table className="w-full text-left text-sm text-gray-800">
                        <thead className="bg-white border-b text-sm font-bold text-gray-900">
                            <tr>
                                <th className="px-6 py-3.5">Order ID</th>
                                <th className="px-6 py-3.5">Date</th>
                                <th className="px-6 py-3.5">Items</th>
                                <th className="px-6 py-3.5">Total Amount</th>
                                <th className="px-6 py-3.5">Status</th>
                                <th className="px-6 py-3.5 text-right">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50/80 transition">
                                    <td className="px-6 py-4 font-mono text-xs font-bold text-gray-600">
                                        #{order._id.slice(-6).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {new Date(order.orderDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-gray-800 font-medium">
                                        {order.products?.map((item, idx) => (
                                            <div key={idx}>
                                                {item.product?.name || "Product"} × {item.quantity}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-emerald-600">${order.totalAmount}</td>
                                    <td className="px-6 py-4">
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
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setPrintingOrder(order)}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded transition"
                                        >
                                            <FaPrint className="w-3 h-3 text-gray-500" />
                                            <span>Invoice</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Printable Invoice Modal */}
            {printingOrder && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-lg p-6 space-y-6 shadow-2xl border relative">
                        <button
                            onClick={() => setPrintingOrder(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 print:hidden"
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>

                        <div className="border-b pb-4 space-y-1">
                            <h2 className="text-2xl font-bold text-gray-900">INVENTORY STORE</h2>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Customer Purchase Receipt</p>
                        </div>

                        <div className="grid grid-cols-2 text-xs gap-4 text-gray-700">
                            <div>
                                <p className="font-bold text-gray-900 uppercase">Customer Details:</p>
                                <p className="font-semibold text-gray-800 mt-1">{printingOrder.customer?.name || "Customer"}</p>
                                <p>{printingOrder.customer?.email}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-gray-900 uppercase">Order Ref:</p>
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
                            <div className="text-xs text-gray-400">Thank you for shopping with us!</div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 font-bold uppercase">Total Paid</p>
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
                                <span>Print Receipt</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerOrders;
