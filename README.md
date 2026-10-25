[README.md](https://github.com/user-attachments/files/33932038/README.md)
# 📦 Full-Stack Inventory Management System

[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Express Version](https://img.shields.io/badge/Express-5.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%209-brightgreen.svg)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF.svg)](https://vitejs.dev/)

A modern, full-stack **Inventory Management System (IMS)** built with the **MERN** stack (MongoDB, Express.js, React 19, Node.js) and styled with **TailwindCSS v4**. The system features comprehensive role-based access control (RBAC), robust inventory tracking, supplier and category management, a customer ordering portal, and interactive administrative dashboard analytics.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [Administrative Features](#-administrative-features)
  - [Customer Features](#-customer-features)
  - [Security & Architecture](#-security--architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Default Seed Accounts](#-default-seed-accounts)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Seed Database](#3-seed-database)
  - [4. Frontend Setup](#4-frontend-setup)
- [Environment Variables](#-environment-variables)
- [Deployment Guide](#-deployment-guide)
- [Documentation & Resources](#-documentation--resources)
- [License](#-license)

---

## 🌟 Overview

This application bridges warehouse/store administration and end-consumer order processing:
- **Admins** have 360-degree visibility over product inventory levels, profit/revenue summaries, supplier logs, categorized stock items, user roles, and order fulfillment status.
- **Customers** can browse product catalogs, inspect real-time stock availability, place orders, and review past order history with dynamic status badges.

---

## ✨ Key Features

### 🛡️ Administrative Features
- **Interactive Dashboard**: Real-time summaries of total revenue, total orders, active inventory valuation, low stock warnings, and recent transaction activities.
- **Product Management**: Full CRUD capabilities for products, including SKU/barcode, unit pricing, real-time stock quantity, supplier relations, and category classifications.
- **Stock Control & Alerts**: Automated warnings for low stock levels to prevent stockouts.
- **Supplier & Category Management**: Maintain supplier contact details, logistics metadata, and hierarchical category structures.
- **Order Fulfillment**: Track and update customer orders across multiple stages (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
- **User Management**: View registered users and manage user roles (`admin` vs. `customer`).

### 🛒 Customer Features
- **Storefront & Product Catalog**: Explore products with descriptions, pricing, and live availability.
- **Order Placement**: Place orders with automatic total calculation and address auto-fill.
- **Order History**: Track order progression in real-time with granular status updates.
- **Profile Management**: Update personal credentials, shipping addresses, and contact numbers.

### 🔒 Security & Architecture
- **Role-Based Access Control (RBAC)**: Route guarding on both frontend (`ProtectedRoutes.jsx`) and backend (`authMiddleware.js`).
- **Authentication**: Stateless authentication using JSON Web Tokens (JWT) stored client-side.
- **Password Security**: Salted password hashing via `bcrypt`.
- **CORS Configured**: Strict origin headers configured for seamless client-server interaction.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router DOM v8](https://reactrouter.com/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express.js v5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose v9](https://mongoosejs.com/)
- **Security & Utilities**: `jsonwebtoken`, `bcrypt`, `cors`, `nodemon`

---

## 📂 Project Structure

```text
inventory-management-system/
├── frontend/                     # React 19 Frontend application (Vite)
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/           # Shared UI & Layout wrappers
│   │   │   ├── AdminLayout.jsx   # Admin sidebar & navigation
│   │   │   ├── CustomerLayout.jsx# Customer navigation & layout
│   │   │   └── root.jsx          # Root redirection wrapper
│   │   ├── context/
│   │   │   └── authcontext.jsx   # React Context for global user auth state
│   │   ├── pages/
│   │   │   ├── admin/            # Admin dashboard, products, suppliers, orders, users
│   │   │   ├── customer/         # Customer dashboard, store catalog, orders, profile
│   │   │   ├── login.jsx         # Login portal
│   │   │   └── register.jsx      # New account registration
│   │   ├── utils/
│   │   │   └── ProtectedRoutes.jsx # Route authorization checks
│   │   ├── config.js             # Base API URL configuration
│   │   ├── App.jsx               # Application routes
│   │   └── main.jsx              # React DOM initialization
│   ├── package.json
│   └── vite.config.js
│
├── server/                       # Express.js REST API Backend
│   ├── connection.js/
│   │   └── conn.js               # MongoDB connection handler
│   ├── controllers/              # Request handlers & business logic
│   │   ├── authcontroller.js     # Auth (login, register, me)
│   │   ├── categoryController.js # Category CRUD
│   │   ├── dashboardController.js# Aggregated statistics & revenue metrics
│   │   ├── orderController.js    # Order lifecycle & customer orders
│   │   ├── productController.js  # Product catalog & stock management
│   │   ├── supplierController.js # Supplier logistics management
│   │   └── userController.js     # User list & role updates
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification & Admin guards
│   ├── models/                   # Mongoose schemas
│   │   ├── user.js
│   │   ├── category.js
│   │   ├── product.js
│   │   ├── supplier.js
│   │   └── order.js
│   ├── routes/                   # API endpoint route files
│   ├── seed.js                   # Mock database seeder
│   ├── render.yaml               # Render deployment blueprint
│   ├── package.json
│   └── index.js                  # Server entry point
│
├── file_flowchart.md             # Detailed visual architecture diagrams
├── inventory_management_explained.md # Comprehensive line-by-line guide
└── README.md                     # Project documentation
```

---

## 🔌 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (Bearer Token) |

### 📊 Dashboard (`/api/dashboard`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/dashboard/stats` | Aggregate metrics (revenue, orders, low stock) | Yes (Admin) |

### 📦 Products (`/api/products`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/products` | Fetch all products (with Category/Supplier populated) | Yes |
| `GET` | `/api/products/:id` | Fetch single product details | Yes |
| `POST` | `/api/products` | Create a new product entry | Yes (Admin) |
| `PUT` | `/api/products/:id` | Update product details or stock | Yes (Admin) |
| `DELETE` | `/api/products/:id` | Remove product | Yes (Admin) |

### 🏷️ Categories (`/api/categories`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/categories` | List all categories | Yes |
| `POST` | `/api/categories` | Add a new category | Yes (Admin) |
| `PUT` | `/api/categories/:id` | Update category details | Yes (Admin) |
| `DELETE` | `/api/categories/:id` | Delete category | Yes (Admin) |

### 🚚 Suppliers (`/api/suppliers`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/suppliers` | List all suppliers | Yes |
| `POST` | `/api/suppliers` | Add a new supplier | Yes (Admin) |
| `PUT` | `/api/suppliers/:id` | Update supplier information | Yes (Admin) |
| `DELETE` | `/api/suppliers/:id` | Delete supplier | Yes (Admin) |

### 📋 Orders (`/api/orders`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/orders` | Retrieve all orders | Yes (Admin) |
| `GET` | `/api/orders/my-orders` | Retrieve current user's orders | Yes (Customer) |
| `POST` | `/api/orders` | Place a new order | Yes |
| `PUT` | `/api/orders/:id/status`| Update status (`Shipped`, `Delivered`, etc.) | Yes (Admin) |

### 👥 Users (`/api/users`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/users` | List all registered users | Yes (Admin) |
| `PUT` | `/api/users/:id` | Update user details or role | Yes (Admin) |
| `DELETE` | `/api/users/:id` | Remove user | Yes (Admin) |

---

## 🔑 Default Seed Accounts

The project includes pre-configured demo credentials generated via `server/seed.js`:

| Role | Email | Password | Access Scope |
|---|---|---|---|
| **Admin** | `admin@example.com` | `admin` | Full system access, management & analytics |
| **Customer** | `customer@example.com` | `customer` | Product browsing, order placement & tracking |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas URI)
- [Git](https://git-scm.com/)

---

### 1. Clone Repository

```bash
git clone https://github.com/rushils044/inventory-management-system.git
cd inventory-management-system
```

---

### 2. Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create and configure your environment file (`.env`):
   ```env
   PORT=3000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/inventory?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key
   ```

---

### 3. Seed Database (Optional but Recommended)

Populate default categories, suppliers, demo products, and test accounts:

```bash
node seed.js
```

Start the backend server in development mode:

```bash
npm run dev
```

*The server will start listening at `http://localhost:3000`.*

---

### 4. Frontend Setup

1. Open a new terminal tab and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Create a `.env` file in `frontend/` if connecting to a custom backend URL:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

*The frontend application will be accessible at `http://localhost:5173`.*

---

### Frontend (`frontend/.env`)
| Variable | Description | Example / Default |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:3000` |

---

## 🌐 Deployment Guide

### Backend Deployment (Render)
1. Link your GitHub repository to [Render](https://render.com/).
2. Use the provided [`render.yaml`](file:///server/render.yaml) or configure a Web Service manually:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Add Environment Variables in the Render dashboard:
   - `PORT`: `3000`
   - `MONGODB_URI`: `<Your MongoDB Atlas Connection String>`
   - `JWT_SECRET`: `<Your Production JWT Secret>`

### Frontend Deployment (Vercel)
1. Import the repository in [Vercel](https://vercel.com/).
2. Select the `frontend` directory as the project root.
3. Framework Preset: **Vite**.
4. Configure Environment Variable:
   - `VITE_API_URL`: `https://your-backend-service.onrender.com`
5. Deploy!

---

## 📚 Documentation & Resources

For detailed architectural flowcharts and code explanations, refer to:
- [`file_flowchart.md`](file_flowchart.md) — Comprehensive ASCII / Mermaid flowcharts showing request lifecycles.
- [`inventory_management_explained.md`](inventory_management_explained.md) — Line-by-line documentation of every model, controller, route, and React view.

---

## 📄 License

This project is open-source and available under the [ISC License](LICENSE).
