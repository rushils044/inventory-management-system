import React from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router";
import { useAuth } from "../context/authcontext.jsx";
import { 
  FaBox, 
  FaShoppingCart, 
  FaCog, 
  FaSignOutAlt 
} from "react-icons/fa";

const CustomerLayout = () => {
    const { logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navItems = [
        { name: "Products", path: "/customer/dashboard", icon: FaBox },
        { name: "Orders", path: "/customer/orders", icon: FaShoppingCart },
        { name: "Profile", path: "/customer/profile", icon: FaCog },
    ];

    return (
        <div className="flex h-screen bg-slate-100 text-slate-800 font-sans overflow-hidden">
            {/* Sidebar matching screenshot */}
            <aside className="w-64 bg-[#1e293b] text-white flex flex-col justify-between shrink-0 shadow-lg">
                <div>
                    {/* Header title from screenshot */}
                    <div className="p-6 text-2xl font-bold text-white tracking-tight border-b border-slate-700/50">
                        Inventory MS
                    </div>

                    <nav className="p-4 space-y-1.5">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive =
                                location.pathname === item.path ||
                                (item.path === "/customer/dashboard" && location.pathname === "/customer");
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition ${
                                        isActive
                                            ? "bg-slate-700/80 text-white font-semibold shadow-inner"
                                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                    }`}
                                >
                                    <Icon className="w-4 h-4 text-slate-300" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition text-left"
                        >
                            <FaSignOutAlt className="w-4 h-4 text-slate-300" />
                            <span>Logout</span>
                        </button>
                    </nav>
                </div>
            </aside>

            {/* Main View Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <main className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default CustomerLayout;
