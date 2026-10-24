# 📦 Inventory Management System — Complete File-by-File Explanation

> This is a full-stack Inventory Management System built with:
> - **Backend**: Node.js + Express + MongoDB (Mongoose) + JWT Auth
> - **Frontend**: React (Vite) + TailwindCSS + React Router + Axios

---

## 🗂️ Project Structure Overview

```
inventory management/
│
├── server/                  ← Backend (Node.js + Express)
│   ├── .env
│   ├── index.js             ← Entry point
│   ├── package.json
│   ├── seed.js              ← Database seeder
│   ├── connection.js/
│   │   └── conn.js          ← MongoDB connection
│   ├── models/              ← Mongoose schemas
│   │   ├── user.js
│   │   ├── category.js
│   │   ├── product.js
│   │   ├── supplier.js
│   │   └── order.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── controllers/         ← Business logic
│   │   ├── authcontroller.js
│   │   ├── categoryController.js
│   │   ├── productController.js
│   │   ├── supplierController.js
│   │   ├── orderController.js
│   │   ├── dashboardController.js
│   │   └── userController.js
│   └── routes/              ← URL definitions
│       ├── auth.js
│       ├── category.js
│       ├── product.js
│       ├── supplier.js
│       ├── order.js
│       ├── dashboard.js
│       └── user.js
│
└── frontend/                ← React (Vite) App
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx         ← React entry point
        ├── App.jsx          ← Routing hub
        ├── config.js        ← API URL config
        ├── context/
        │   └── authcontext.jsx  ← Auth state (global)
        ├── utils/
        │   └── ProtectedRoutes.jsx
        ├── components/
        │   ├── root.jsx
        │   ├── AdminLayout.jsx
        │   └── CustomerLayout.jsx
        └── pages/
            ├── login.jsx
            ├── register.jsx
            ├── admin/
            │   ├── AdminDashboard.jsx
            │   ├── AdminProfile.jsx
            │   ├── CategoryList.jsx
            │   ├── SupplierList.jsx
            │   ├── ProductList.jsx
            │   ├── OrderList.jsx
            │   └── UserList.jsx
            └── customer/
                ├── CustomerDashboard.jsx
                ├── CustomerProducts.jsx
                ├── CustomerOrders.jsx
                └── CustomerProfile.jsx
```

---

# 🖥️ PART 1 — BACKEND (server/)

---

## Step 1️⃣ — `server/package.json`

```json
{
  "name": "server",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "nodemon --env-file=.env index.js"
  },
  "dependencies": {
    "bcrypt": "^6.0.0",
    "cors": "^2.8.6",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.10.2",
    "nodemon": "^3.1.14"
  }
}
```

**What this file does:**
- `"type": "module"` — tells Node.js to use ES Module syntax (`import`/`export`) instead of CommonJS (`require`)
- `"start"` script — runs the server using `nodemon` (auto-restarts on file save) and loads the `.env` file for environment variables
- **Dependencies explained:**
  - `express` → the web framework (handles HTTP requests)
  - `mongoose` → library to talk to MongoDB
  - `bcrypt` → hashes passwords before storing them
  - `jsonwebtoken` → creates/verifies JWT tokens for authentication
  - `cors` → allows the React frontend (on a different port) to call this server
  - `nodemon` → watches files and restarts the server automatically during development

---

## Step 2️⃣ — `server/.env`

```
PORT=3000
MONGODB_URI="mongodb://..."
JWT_SECRET="your_jwt_secret_key"
```

**What this file does:**
- Stores **sensitive configuration** that should NOT be committed to Git (notice `server/.gitignore` excludes it)
- `PORT` → which port the Express server listens on
- `MONGODB_URI` → the connection string to your MongoDB Atlas cloud database
- `JWT_SECRET` → the secret key used to sign and verify JWT tokens (think of it like a password for your tokens — **keep it secret!**)
- These values are accessed in code via `process.env.PORT`, `process.env.MONGODB_URI`, etc.

> [!CAUTION]
> Never share your `.env` file publicly. It contains your database credentials and JWT secret.

---

## Step 3️⃣ — `server/connection.js/conn.js` — Database Connection

```js
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mydatabase";
        await mongoose.connect(uri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

export default connectDB;
```

**What this file does:**
- Exports a single function `connectDB` that connects to MongoDB using Mongoose
- `process.env.MONGODB_URI` reads the URI from `.env`. If not set, it falls back to localhost
- `mongoose.connect()` establishes the connection — it's `async` because connecting to a database takes time
- The `try/catch` handles connection errors gracefully instead of crashing the server
- This function is called **inside** `index.js` when the server starts

---

## Step 4️⃣ — `server/index.js` — The Server Entry Point

```js
import express from "express";
import cors from "cors";
import connectDB from "./connection.js/conn.js";
import authRoutes from "./routes/auth.js";
// ... more route imports

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
// ... more routes

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});
```

**What this file does, line by line:**
1. `const app = express()` — creates the Express application
2. `app.use(cors())` — allows cross-origin requests (so your React app on port 5173 can talk to this server on port 3000)
3. `app.use(express.json())` — tells Express to parse incoming JSON bodies automatically (so `req.body` works)
4. `app.use("/api/auth", authRoutes)` — mounts the auth router: any URL starting with `/api/auth` is handled by `authRoutes`
5. `app.listen(PORT, ...)` — starts the server and connects to the database

**How routes map to URLs:**
| Mounted at | File handles |
|---|---|
| `/api/auth` | `routes/auth.js` |
| `/api/categories` | `routes/category.js` |
| `/api/suppliers` | `routes/supplier.js` |
| `/api/products` | `routes/product.js` |
| `/api/orders` | `routes/order.js` |
| `/api/dashboard` | `routes/dashboard.js` |
| `/api/users` | `routes/user.js` |

---

## Step 5️⃣ — Models (Mongoose Schemas)

Models define the **shape of data** stored in MongoDB. Think of them like table definitions in SQL.

---

### `models/user.js`

```js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  role: { type: String, enum: ["customer", "admin"], default: "customer" }
});
const User = mongoose.model("User", userSchema);
```

**Key points:**
- `required: true` → MongoDB will reject a save if this field is missing
- `unique: true` → No two users can have the same name or email
- `role` field uses `enum` — it **only** accepts `"customer"` or `"admin"`. Default is `"customer"` so new registrations are always customers
- The **password is stored hashed** (handled in the controller, not here)

---

### `models/category.js`

```js
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});
```

**Key points:**
- Simple schema — just name, description, and a creation timestamp
- `default: Date.now` → automatically sets the date when a category is created (no need to pass it manually)

---

### `models/supplier.js`

```js
const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});
```

**Key points:**
- Represents a vendor/supplier of products
- All contact info (email, phone) is required
- Address is optional (defaults to empty string)

---

### `models/product.js` ⭐ Important — Uses References

```js
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0 },
  description: { type: String, default: "" },
  image: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});
```

**Key points:**
- `category` and `supplier` are **ObjectId references** — instead of duplicating data, they store the ID of a Category/Supplier document. This is like a **foreign key** in SQL
- `ref: "Category"` tells Mongoose which model to look up when you call `.populate()` (replaces the ID with the full object)
- `quantity` tracks stock — gets decremented when orders are placed

---

### `models/order.js` ⭐ Most Complex Model

```js
const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" },
  orderDate: { type: Date, default: Date.now }
});
```

**Key points:**
- `customer` references a User (the person who placed the order)
- `products` is an **array of embedded sub-documents** — each item in the order has: which product, how many, and the price at time of purchase
- `price` is stored per item so historical order prices are preserved even if the product price changes later
- `status` enum: `"Pending"` → `"Completed"` or `"Cancelled"`

---

## Step 6️⃣ — `middleware/authMiddleware.js`

```js
const verifyUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    // Must be "Bearer <token>"
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    req.user = user;   // attach user to the request
    next();            // allow the request to continue
};

const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "Access denied. Admin role required." });
    }
};
```

**What middleware does:**
Middleware runs **between** receiving a request and handling it. Think of it as a security checkpoint.

**`verifyUser` step-by-step:**
1. Reads the `Authorization` header (format: `Bearer eyJhbGci...`)
2. Extracts the token part (after "Bearer ")
3. Verifies the token using the JWT secret (proves it wasn't tampered with)
4. Looks up the user from the database by the ID stored in the token
5. Attaches the user object to `req.user` so downstream controllers know who's making the request
6. Calls `next()` to pass control to the next handler

**`verifyAdmin`:**
- Runs **after** `verifyUser` (so `req.user` already exists)
- Checks if the user's role is `"admin"`. If not → 403 Forbidden

**Usage:** `router.post("/add", verifyUser, verifyAdmin, addCategory)`
→ The request must pass both checkpoints before `addCategory` runs.

---

## Step 7️⃣ — Controllers

Controllers contain the **actual business logic** for each API endpoint.

---

### `controllers/authcontroller.js`

**`login` function:**
```js
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });       // find by email
    const isMatch = await bcrypt.compare(password, user.password);  // compare hashed password
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "10d" });
    return res.json({ success: true, token, user: {...} });
};
```

- Finds user by email
- Uses `bcrypt.compare()` to check readable password against the stored hash — **never store plain-text passwords!**
- Creates a JWT token containing the user's `id` and `role` (expires in 10 days)
- Returns the token + user info to the frontend

**`register` function:**
```js
const register = async (req, res) => {
    const hashPassword = await bcrypt.hash(password, 10);  // 10 = salt rounds
    const newUser = new User({ name, email, password: hashPassword, ... });
    await newUser.save();
};
```

- Hashes the password before saving (salt rounds = 10 means very secure)
- Saves to MongoDB
- New users are always `"customer"` by default

---

### `controllers/categoryController.js`

**4 functions: `addCategory`, `getCategories`, `updateCategory`, `deleteCategory`**

Key feature — **smart delete protection:**
```js
const deleteCategory = async (req, res) => {
    const productsCount = await Product.countDocuments({ category: id });
    if (productsCount > 0) {
        return res.status(400).json({
            message: `Cannot delete category because ${productsCount} product(s) are assigned to it.`
        });
    }
    // only delete if no products are linked
};
```
- Before deleting a category, it checks if any products use it
- If yes → block the delete with an error message
- This prevents **orphaned products** (products with no valid category)

---

### `controllers/productController.js`

**5 functions: `addProduct`, `getProducts`, `getProductById`, `updateProduct`, `deleteProduct`**

Key feature — **validation before save:**
```js
if (Number(price) <= 0) {
    return res.status(400).json({ message: "Price must be a positive number greater than 0" });
}
```

Key feature — **populate (join) related data:**
```js
const products = await Product.find()
    .populate("category", "name")    // replace category ObjectId with { name: "Tech" }
    .populate("supplier", "name")    // same for supplier
```
This is like a SQL JOIN — instead of returning `category: "64abc123..."`, it returns `category: { name: "Electronics" }`.

---

### `controllers/supplierController.js`

**4 functions: `addSupplier`, `getSuppliers`, `updateSupplier`, `deleteSupplier`**

Same smart delete protection as categories:
```js
const productsCount = await Product.countDocuments({ supplier: id });
if (productsCount > 0) {
    // block delete — products depend on this supplier
}
```

---

### `controllers/orderController.js` ⭐ Most Complex Controller

**`createOrder` — step-by-step:**
1. Gets the array of `{ productId, quantity }` from request body
2. For each product: checks it exists, checks stock is sufficient
3. Calculates `totalAmount` by summing `price × quantity` for each item
4. Creates the Order document in MongoDB
5. **Decrements stock** for each ordered product: `$inc: { quantity: -item.quantity }`
6. Returns the populated order (with full product info, not just IDs)

**`updateOrderStatus` — smart stock restoration:**
```js
if (status === "Cancelled" && oldStatus !== "Cancelled") {
    for (const item of order.products) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: { quantity: item.quantity }  // restore stock!
        });
    }
}
```
When an order is **cancelled**, the stock is automatically **added back** to inventory. Very important for data consistency!

**`getCustomerOrders`** — customers can only see their **own** orders (filtered by `req.user._id`).

---

### `controllers/dashboardController.js`

**`getDashboardStats` returns:**
| Stat | How calculated |
|---|---|
| Total Products | `Product.countDocuments()` |
| Total Stock | Sum of all product quantities |
| Orders Today | Count orders where `orderDate >= today midnight` |
| Revenue | Sum of `totalAmount` of all Completed orders |
| Out of Stock | Products where `quantity === 0` |
| Low Stock | Products where `0 < quantity <= 5` |
| Highest Sale Product | From Completed Orders — which product has max total units sold |

---

### `controllers/userController.js`

**3 functions: `getUsers`, `addUser`, `deleteUser`**

Key feature — **delete protection for admins:**
```js
// Cannot delete yourself
if (req.user._id.toString() === id) {
    return res.status(400).json({ message: "You cannot delete your own account." });
}
// Cannot delete the last admin
if (targetUser.role === "admin") {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
        return res.status(400).json({ message: "Cannot delete the last remaining admin." });
    }
}
```
This prevents accidentally locking yourself out of the system.

---

## Step 8️⃣ — Routes

Routes connect **URL paths + HTTP methods** to **controller functions**.

### `routes/auth.js`
```js
router.post("/login", login);
router.post("/register", register);
```
- No middleware — anyone can access login/register (they're public endpoints)
- Combined with `app.use("/api/auth", ...)`: full URLs become `/api/auth/login` and `/api/auth/register`

---

### `routes/category.js`
```js
router.get("/", verifyUser, getCategories);               // any logged-in user
router.post("/add", verifyUser, verifyAdmin, addCategory); // admin only
router.put("/:id", verifyUser, verifyAdmin, updateCategory);
router.delete("/:id", verifyUser, verifyAdmin, deleteCategory);
```
- GET is accessible to all users (customers need to see categories when shopping)
- POST/PUT/DELETE require **admin role**
- `/:id` is a **URL parameter** — e.g. `/api/categories/64abc123`

---

### `routes/product.js`
```js
router.get("/", verifyUser, getProducts);
router.get("/:id", verifyUser, getProductById);
router.post("/add", verifyUser, verifyAdmin, addProduct);
router.put("/:id", verifyUser, verifyAdmin, updateProduct);
router.delete("/:id", verifyUser, verifyAdmin, deleteProduct);
```
- Same pattern: reads are for all authenticated users, writes are admin-only

---

### `routes/order.js`
```js
router.post("/create", verifyUser, createOrder);                   // any user can order
router.get("/customer-orders", verifyUser, getCustomerOrders);     // own orders only
router.get("/", verifyUser, verifyAdmin, getOrders);               // all orders (admin)
router.put("/:id/status", verifyUser, verifyAdmin, updateOrderStatus); // admin only
```

> [!NOTE]
> `/customer-orders` must be defined **before** `/:id` otherwise Express would interpret "customer-orders" as an ID parameter.

---

### `routes/dashboard.js`
```js
router.get("/summary", verifyUser, verifyAdmin, getDashboardStats);
```
- Admin-only — customers don't need to see inventory statistics

---

### `routes/user.js`
```js
router.get("/", verifyUser, verifyAdmin, getUsers);
router.post("/add", verifyUser, verifyAdmin, addUser);
router.delete("/:id", verifyUser, verifyAdmin, deleteUser);
```
- All user management is admin-only

---

## Step 9️⃣ — `server/seed.js` — Database Seeder

```js
const seedDatabase = async () => {
    await connectDB();
    // 1. Create admin user (admin@example.com / admin)
    // 2. Create customer user (customer@example.com / customer)
    // 3. Create 3 categories (Tech, Electronic, Fashion)
    // 4. Create 3 suppliers
    // 5. Create 7 sample products
};
```

**What this file does:**
- A one-time script to **pre-populate** the database with sample data so you can test the app immediately
- Each section checks `if (!existing)` before creating — **idempotent** (safe to run multiple times without creating duplicates)
- Creates a "Screen" product with `quantity: 0` to demo the "Out of Stock" card on the dashboard
- Run with: `node seed.js`

---

# ⚛️ PART 2 — FRONTEND (frontend/)

---

## Step 10️⃣ — `frontend/package.json`

```json
{
  "dependencies": {
    "axios": "^1.20.0",       ← HTTP client to call the backend
    "react": "^19.2.8",       ← The UI library
    "react-dom": "^19.2.8",   ← Renders React to the browser DOM
    "react-icons": "^5.7.0",  ← Icon components (FaHome, FaBox, etc.)
    "react-router": "^8.4.0", ← Client-side routing (page navigation without reload)
    "tailwindcss": "^4.3.3"   ← Utility-first CSS framework
  }
}
```

- `"dev": "vite"` → starts the development server with hot module replacement (instant updates as you save)

---

## Step 11️⃣ — `frontend/vite.config.js`

```js
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**What this does:**
- Vite is the **build tool** and **dev server** (much faster than webpack)
- `react()` plugin enables JSX transformation and Fast Refresh (live updates)
- `tailwindcss()` plugin integrates TailwindCSS directly into Vite (no separate PostCSS config needed in v4)

---

## Step 12️⃣ — `frontend/index.html`

```html
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
```

**What this is:**
- The **only real HTML file** in the entire project (it's a Single Page Application)
- `<div id="root">` is the empty container where React **injects** all the UI
- `<script type="module" src="/src/main.jsx">` loads the React app
- Everything you see in the browser is actually rendered by JavaScript into this single `<div>`

---

## Step 13️⃣ — `src/config.js`

```js
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
```

**What this does:**
- Defines the **backend server URL** in one place
- `import.meta.env.VITE_API_URL` reads from a `.env` file (Vite convention — must start with `VITE_`)
- Falls back to `localhost:3000` if not set
- Every API call in the app imports and uses this instead of hardcoding the URL — so if you deploy the backend, you only change one file

---

## Step 14️⃣ — `src/context/authcontext.jsx` ⭐ Global State

```jsx
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user')
        return storedUser ? JSON.parse(storedUser) : null
    })

    const login = (userData, token) => {
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', token)
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext)
```

**What this does:**
This is the **global authentication state** — the most important file in the frontend.

**`useState` with lazy initializer:**
```js
const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
})
```
- On first render, checks `localStorage` for a saved user
- If found (from a previous session), sets `user` immediately — **this is why you stay logged in after refreshing the page!**

**`login(userData, token)`:**
- Updates React state (causes re-render)
- Saves user data and JWT token to `localStorage` (persists across page refreshes)

**`logout()`:**
- Clears state and removes from `localStorage`

**`useAuth` custom hook:**
```js
export const useAuth = () => useContext(AuthContext)
```
- Any component can call `const { user, login, logout } = useAuth()` to access auth state
- Much cleaner than passing props down through many components

---

## Step 15️⃣ — `src/main.jsx` — React Entry Point

```jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
)
```

**What this does:**
- `createRoot(...).render(...)` — tells React to take control of the `<div id="root">` from `index.html`
- `<StrictMode>` — a development helper that detects potential problems (runs effects twice in dev)
- `<AuthProvider>` — wraps the entire app so **every component** can access auth state via `useAuth()`
- `<App />` — the main application component (routing lives here)

**The nesting order matters:**
`StrictMode` → `AuthProvider` → `App` → all pages

This means AuthContext is available everywhere inside App.

---

## Step 16️⃣ — `src/App.jsx` — The Routing Hub

```jsx
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin section — protected */}
        <Route path="/admin" element={
          <ProtectedRoutes requiredRole={["admin"]}>
            <AdminLayout />
          </ProtectedRoutes>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<ProductList />} />
          {/* ...more */}
        </Route>

        {/* Customer section — protected */}
        <Route path="/customer" element={
          <ProtectedRoutes requiredRole={["customer"]}>
            <CustomerLayout />
          </ProtectedRoutes>
        }>
          <Route path="dashboard" element={<CustomerProducts />} />
          {/* ...more */}
        </Route>
      </Routes>
    </Router>
  );
}
```

**Key concepts:**

**Nested Routes:**
- `/admin` renders `AdminLayout` (which includes the sidebar)
- `/admin/dashboard` renders `AdminDashboard` **inside** the `AdminLayout` (via `<Outlet />`)
- This means the sidebar is always visible and only the main content changes

**`<Navigate to="/admin/dashboard" replace />`:**
- When you visit `/admin`, redirect immediately to `/admin/dashboard`

**Route protection pattern:**
- `<ProtectedRoutes requiredRole={["admin"]}>` wraps entire admin section
- If you're not admin, you get redirected before AdminLayout even renders

**URL structure:**
| URL | Component shown |
|---|---|
| `/` | Root (smart redirect) |
| `/login` | Login page |
| `/register` | Register page |
| `/admin/dashboard` | AdminLayout + AdminDashboard |
| `/admin/products` | AdminLayout + ProductList |
| `/customer/dashboard` | CustomerLayout + CustomerProducts |

---

## Step 17️⃣ — `src/utils/ProtectedRoutes.jsx`

```jsx
const ProtectedRoutes = ({ children, requiredRole }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        if (!requiredRole.includes(user.role)) {
            navigate("/unauthorized");
            return;
        }
    }, [user, navigate, requiredRole])

    if (!user) return null;
    if (!requiredRole.includes(user.role)) return null;
    return children;
}
```

**What this does:**
- A **guard component** — if conditions aren't met, it renders nothing and redirects
- `requiredRole` is an array like `["admin"]` or `["customer"]`
- Two checks:
  1. Is the user logged in? If not → redirect to `/login`
  2. Does the user's role match? If not → redirect to `/unauthorized`
- Returns `children` only when both checks pass

> [!NOTE]
> There are two layers of the same check: `useEffect` (for navigation) and `return null` (prevents rendering while navigation is pending). This prevents a flash of unauthorized content.

---

## Step 18️⃣ — `src/components/root.jsx`

```jsx
const Root = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/customer/dashboard");
            }
        } else {
            navigate("/login");
        }
    }, [user, navigate]);

    return null;  // renders nothing
};
```

**What this does:**
- Handles the root URL `/`
- Acts as a **smart redirect** based on who's logged in:
  - Not logged in → `/login`
  - Admin → `/admin/dashboard`
  - Customer → `/customer/dashboard`
- Returns `null` (nothing visible) because its job is just to redirect

---

## Step 19️⃣ — `src/components/AdminLayout.jsx` & `CustomerLayout.jsx`

```jsx
const AdminLayout = () => {
    const navItems = [
        { name: "Dashboard", path: "/admin/dashboard", icon: FaHome },
        { name: "Products", path: "/admin/products", icon: FaBox },
        // ...
    ];

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-[#1e293b] text-white flex flex-col">
                <div>Inventory MS</div>
                <nav>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link to={item.path} className={isActive ? "active-style" : "normal-style"}>
                                <Icon /> <span>{item.name}</span>
                            </Link>
                        );
                    })}
                    <button onClick={handleLogout}>Logout</button>
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto p-8">
                <Outlet />   {/* ← child routes render here */}
            </main>
        </div>
    );
};
```

**Key concepts:**

**`<Outlet />`:**
- This is where nested route components are injected
- When you visit `/admin/dashboard`, React renders `AdminLayout` and places `<AdminDashboard />` inside the `<Outlet />`

**Active link highlighting:**
```js
const isActive = location.pathname === item.path;
```
- `useLocation()` gives the current URL
- Compares it to each nav item's path
- Applies a highlighted style to the active link

**`CustomerLayout` differences:**
- Only 3 nav items: Products, Orders, Profile (no Categories/Suppliers/Users management)
- Same sidebar design — dark slate background

---

## Step 20️⃣ — `src/pages/login.jsx`

```jsx
const handleSubmit = async (e) => {
    e.preventDefault();             // prevent page reload
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
    if (response.data.success) {
        login(response.data.user, response.data.token);  // save to context + localStorage
        if (response.data.user.role === "admin") {
            navigate("/admin/dashboard");
        } else {
            navigate("/customer/dashboard");
        }
    }
};
```

**State variables:**
| State | Purpose |
|---|---|
| `email` | Controlled input value |
| `password` | Controlled input value |
| `error` | Shows error message to user |
| `loading` | Disables button while request is in progress |

**Flow:**
1. User fills form and clicks Login
2. `handleSubmit` fires → calls backend `/api/auth/login`
3. On success: saves user+token with `login()` from `useAuth()`
4. Navigates to the correct dashboard based on role

---

## Step 21️⃣ — `src/pages/register.jsx`

Similar to login but:
- 4 inputs: Name, Email, Password, Address
- Role is **hardcoded to `"customer"`** — users can't register as admin
- On success: shows a success message for 1.5 seconds, then redirects to `/login`
```js
setSuccess("Registered successfully! Redirecting to login...");
setTimeout(() => navigate("/login"), 1500);
```

---

## Step 22️⃣ — `src/pages/admin/AdminDashboard.jsx`

```jsx
useEffect(() => {
    const fetchDashboardData = async () => {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/api/dashboard/summary`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data.stats);
    };
    fetchDashboardData();
}, []);  // empty array = run once on mount
```

**What it displays:**
- **4 colored summary cards**: Total Products (blue), Total Stock (green), Orders Today (yellow), Revenue (purple)
- **3 white detail cards**: Out of Stock Products, Highest Sale Product, Low Stock Products

**Pattern used throughout the app:**
```js
const token = localStorage.getItem("token");
// attach token to every request:
headers: { Authorization: `Bearer ${token}` }
```

---

## Step 23️⃣ — `src/pages/admin/AdminProfile.jsx`

```jsx
const { user } = useAuth();
// Displays: Name, Email, Role from the logged-in user
```
- Very simple — just reads from `useAuth()` and displays the info
- No API call needed because user data is already in context/localStorage

---

## Step 24️⃣ — `src/pages/admin/CategoryList.jsx` — The Pattern for All CRUD Pages

This page demonstrates the **full CRUD pattern** used by every admin list page:

**State:**
```js
const [categories, setCategories] = useState([]);   // the data
const [searchTerm, setSearchTerm] = useState("");    // search filter
const [loading, setLoading] = useState(true);        // loading state
const [isModalOpen, setIsModalOpen] = useState(false); // modal visibility
const [editingCategory, setEditingCategory] = useState(null); // null = adding, object = editing
const [formData, setFormData] = useState({ name: "", description: "" }); // form inputs
```

**`handleOpenModal(category = null)`:**
- Called with `null` → Add mode (clears form)
- Called with a category object → Edit mode (pre-fills form with existing data)
- One modal handles both operations

**`handleSubmit`:**
```js
if (editingCategory) {
    await axios.put(`/api/categories/${editingCategory._id}`, formData, ...);  // update
} else {
    await axios.post(`/api/categories/add`, formData, ...);  // create
}
fetchCategories();  // refresh list
```

**Client-side search filter:**
```js
const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
);
```
- Filters locally (no extra API call) — fast and responsive

**Same pattern** is used in: `SupplierList`, `ProductList`, `OrderList`, `UserList`

---

## Step 25️⃣ — `src/pages/admin/SupplierList.jsx`

- Same CRUD pattern as CategoryList
- Form has 4 fields: Name, Email, Phone, Address
- Search filters by name **or** email:
```js
sup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
sup.email.toLowerCase().includes(searchTerm.toLowerCase())
```

---

## Step 26️⃣ — `src/pages/admin/AdminProfile.jsx`

Simple read-only profile page that displays the logged-in admin's Name, Email, and Role from `useAuth()`.

---

## 🛒 Customer Pages

---

## Step 27️⃣ — `src/pages/customer/CustomerProducts.jsx` (Customer Dashboard)

- Shows all available products in a card/grid layout
- Each product shows image, name, category, supplier, price, and stock
- Has a **cart mechanism**: customers select products + quantities and place orders
- Calls `/api/products` (GET) and `/api/orders/create` (POST)

---

## Step 28️⃣ — `src/pages/customer/CustomerOrders.jsx`

- Shows the logged-in customer's own orders
- Calls `/api/orders/customer-orders`
- Displays order date, products ordered, total amount, and status badge

---

## Step 29️⃣ — `src/pages/customer/CustomerProfile.jsx`

- Same concept as AdminProfile but styled for customers
- Shows Name, Email, Role from `useAuth()`

---

# 🔗 How Everything Connects — The Full Request Flow

```
User fills Login form
  ↓
Login.jsx submits → axios.post("/api/auth/login")
  ↓
server/routes/auth.js → login controller
  ↓
authcontroller.js → bcrypt.compare → jwt.sign → return token
  ↓
Login.jsx: login(user, token) → saves to localStorage + Context
  ↓
navigate("/admin/dashboard")
  ↓
App.jsx: ProtectedRoutes checks user.role === "admin" ✓
  ↓
AdminLayout renders (sidebar visible)
  ↓
AdminDashboard renders inside <Outlet />
  ↓
AdminDashboard: axios.get("/api/dashboard/summary", { Authorization: Bearer token })
  ↓
server → verifyUser (decode token) → verifyAdmin (check role) → getDashboardStats → return JSON
  ↓
AdminDashboard: setStats(data) → re-renders with stats
```

---

# 🔑 Key Concepts Summary

| Concept | Used for |
|---|---|
| **JWT Token** | Stateless authentication — proves who you are on every request |
| **bcrypt** | Secure password hashing — never store plain text passwords |
| **Mongoose populate** | Like SQL JOIN — replace ObjectIds with actual document data |
| **React Context** | Global state shared across all components without prop drilling |
| **Protected Routes** | Guard component that blocks unauthorized access |
| **Nested Routes + Outlet** | Shared layout (sidebar) with swappable content area |
| **Controlled Inputs** | React controls input values via `useState` — `value={state}` + `onChange` |
| **useEffect + []** | Fetch data once when a component first mounts |
| **Admin/Customer split** | Two completely separate route trees with different permissions |
