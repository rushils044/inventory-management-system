import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import Root from './components/root.jsx';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';
import ProtectedRoutes from './utils/ProtectedRoutes.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import CategoryList from './pages/admin/CategoryList.jsx';
import SupplierList from './pages/admin/SupplierList.jsx';
import ProductList from './pages/admin/ProductList.jsx';
import OrderList from './pages/admin/OrderList.jsx';
import UserList from './pages/admin/UserList.jsx';
import AdminProfile from './pages/admin/AdminProfile.jsx';

import CustomerLayout from './components/CustomerLayout.jsx';
import CustomerProducts from './pages/customer/CustomerProducts.jsx';
import CustomerOrders from './pages/customer/CustomerOrders.jsx';
import CustomerProfile from './pages/customer/CustomerProfile.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes matching screenshot */}
        <Route
          path="/admin"
          element={
            <ProtectedRoutes requiredRole={["admin"]}>
              <AdminLayout />
            </ProtectedRoutes>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="categories" element={<CategoryList />} />
          <Route path="suppliers" element={<SupplierList />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="users" element={<UserList />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* Customer Routes matching screenshot */}
        <Route
          path="/customer"
          element={
            <ProtectedRoutes requiredRole={["customer"]}>
              <CustomerLayout />
            </ProtectedRoutes>
          }
        >
          <Route index element={<Navigate to="/customer/dashboard" replace />} />
          <Route path="dashboard" element={<CustomerProducts />} />
          <Route path="orders" element={<CustomerOrders />} />
          <Route path="profile" element={<CustomerProfile />} />
        </Route>

        <Route
          path="/unauthorized"
          element={
            <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-600 font-bold text-xl">
              Unauthorized Access. Please login with proper credentials.
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
