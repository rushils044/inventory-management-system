import React, { useState } from "react";
import { useAuth } from "../context/authcontext.jsx";
import { useNavigate, Link } from "react-router";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://localhost:3000/api/auth/login", { email, password });
            if (response.data.success) {
                login(response.data.user, response.data.token);
                if (response.data.user.role === "admin") {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/customer/dashboard");
                }
            } else {
                setError(response.data.message || "Login failed");
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Server connection error");
            }
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
            <div className="border shadow-lg p-6 w-80 bg-white rounded-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Login</h2>
                {error && <p className="text-red-500 mb-4 text-sm font-medium">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-slate-800"
                            name="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Email"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-slate-800"
                            name="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                        />
                    </div>
                    <div className="mb-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1e293b] hover:bg-slate-900 text-white font-semibold py-2 rounded transition"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                </form>
                <div className="text-center text-sm text-gray-600 mt-2">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-[#1e293b] hover:underline font-semibold">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;