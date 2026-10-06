import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import axios from "axios";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await axios.post("http://localhost:3000/api/auth/register", {
                name,
                email,
                password,
                address,
                role: "customer"
            });
            if (response.data.success) {
                setSuccess("Registered successfully! Redirecting to login...");
                setTimeout(() => navigate("/login"), 1500);
            } else {
                setError(response.data.message || "Registration failed");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Server connection error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex flex-col items-center h-screen justify-center
            bg-gradient-to-b from-[#1e293b] from-50% to-gray-100 to-50% space-y-6 font-sans"
        >
            <h2 className="text-3xl text-white font-bold">Inventory Management System</h2>
            <div className="border shadow-lg p-6 w-96 bg-white rounded-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Register Account</h2>
                {error && <p className="text-red-500 mb-4 text-sm font-medium">{error}</p>}
                {success && <p className="text-blue-900 mb-4 text-sm font-medium">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-slate-800"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter Name"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-slate-800"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Email"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-slate-800"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Address</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-slate-800"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter Address"
                        />
                    </div>
                    <div className="mb-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1e293b] hover:bg-slate-900 text-white font-semibold py-2 rounded transition"
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </div>
                </form>
                <div className="text-center text-sm text-gray-600 mt-2">
                    Already have an account?{" "}
                    <Link to="/login" className="text-[#1e293b] hover:underline font-semibold">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
