import React from "react";
import { useAuth } from "../../context/authcontext.jsx";

const AdminProfile = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Profile</h1>

            <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                    <p className="text-base font-semibold text-gray-800 bg-gray-50 p-2.5 rounded border">
                        {user?.name || "Admin User"}
                    </p>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                    <p className="text-base font-semibold text-gray-800 bg-gray-50 p-2.5 rounded border">
                        {user?.email || "admin@example.com"}
                    </p>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role</label>
                    <p className="text-base font-semibold text-green-600 bg-gray-50 p-2.5 rounded border capitalize">
                        {user?.role || "admin"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
