# 🗺️ File Communication Flowcharts — Inventory Management System

---

## 📌 Diagram 1 — Overall Architecture (Big Picture)

```mermaid
flowchart TB
    subgraph BROWSER["🌐 Browser"]
        USER["👤 User"]
    end

    subgraph FRONTEND["⚛️ Frontend (React / Vite — Port 5173)"]
        indexHTML["index.html\n(single HTML shell)"]
        mainJSX["main.jsx\n(React entry point)"]
        authCtx["authcontext.jsx\n(Global Auth State)"]
        appJSX["App.jsx\n(Router + Routes)"]
        pages["Pages & Components"]
        configJS["config.js\n(API_BASE_URL)"]
    end

    subgraph BACKEND["🖥️ Backend (Express — Port 3000)"]
        indexJS["index.js\n(Server Entry)"]
        routes["routes/*.js\n(URL Definitions)"]
        middleware["authMiddleware.js\n(JWT Guards)"]
        controllers["controllers/*.js\n(Business Logic)"]
        models["models/*.js\n(Mongoose Schemas)"]
    end

    subgraph DATABASE["🗄️ MongoDB Atlas"]
        DB[("MongoDB\nCollections")]
    end

    USER -->|"visits URL"| indexHTML
    indexHTML -->|"loads"| mainJSX
    mainJSX -->|"wraps with"| authCtx
    authCtx -->|"provides user state to"| appJSX
    appJSX -->|"renders"| pages
    pages -->|"reads API URL from"| configJS
    pages -->|"HTTP requests\n(axios + JWT token)"| indexJS

    indexJS -->|"routes request to"| routes
    routes -->|"runs middleware"| middleware
    middleware -->|"attaches user, calls next()"| controllers
    controllers -->|"query/save data"| models
    models <-->|"read/write"| DB
    controllers -->|"JSON response"| pages
```

---

## 📌 Diagram 2 — Backend File Communication

```mermaid
flowchart TD
    ENV[".env\n(PORT, MONGODB_URI, JWT_SECRET)"]
    PKG["package.json\n(dependencies + scripts)"]

    subgraph ENTRY["Entry Layer"]
        IDX["index.js\n(Express app setup)"]
        CONN["connection.js/conn.js\n(mongoose.connect)"]
    end

    subgraph ROUTES["Routes Layer\n(URL → Handler mapping)"]
        R_AUTH["routes/auth.js\nPOST /login\nPOST /register"]
        R_CAT["routes/category.js\nGET / POST /add\nPUT /:id DELETE /:id"]
        R_PROD["routes/product.js\nGET / GET /:id\nPOST /add PUT /:id DELETE /:id"]
        R_SUP["routes/supplier.js\nGET / POST /add\nPUT /:id DELETE /:id"]
        R_ORD["routes/order.js\nPOST /create\nGET / GET /customer-orders\nPUT /:id/status"]
        R_DASH["routes/dashboard.js\nGET /summary"]
        R_USR["routes/user.js\nGET / POST /add DELETE /:id"]
    end

    subgraph MW["Middleware Layer"]
        VU["verifyUser()\n(decode JWT → attach req.user)"]
        VA["verifyAdmin()\n(check role === admin)"]
    end

    subgraph CTRL["Controller Layer\n(Business Logic)"]
        C_AUTH["authcontroller.js\nlogin() register()"]
        C_CAT["categoryController.js\naddCategory() getCategories()\nupdateCategory() deleteCategory()"]
        C_PROD["productController.js\naddProduct() getProducts()\ngetProductById() updateProduct()\ndeleteProduct()"]
        C_SUP["supplierController.js\naddSupplier() getSuppliers()\nupdateSupplier() deleteSupplier()"]
        C_ORD["orderController.js\ncreateOrder() getOrders()\ngetCustomerOrders() updateOrderStatus()"]
        C_DASH["dashboardController.js\ngetDashboardStats()"]
        C_USR["userController.js\ngetUsers() addUser() deleteUser()"]
    end

    subgraph MODELS["Model Layer\n(Mongoose Schemas)"]
        M_USER["models/user.js\nUser Schema\nname, email, password,\naddress, role"]
        M_CAT["models/category.js\nCategory Schema\nname, description, createdAt"]
        M_PROD["models/product.js\nProduct Schema\nname, category→ref,\nsupplier→ref, price,\nquantity, image"]
        M_SUP["models/supplier.js\nSupplier Schema\nname, email, phone, address"]
        M_ORD["models/order.js\nOrder Schema\ncustomer→ref, products[],\ntotalAmount, status"]
    end

    DB[("🗄️ MongoDB Atlas")]
    SEED["seed.js\n(One-time DB populator)"]

    ENV -->|"process.env.*"| IDX
    ENV -->|"process.env.MONGODB_URI"| CONN
    PKG -->|"defines start script"| IDX

    IDX -->|"app.listen() then calls"| CONN
    IDX -->|"app.use('/api/auth')"| R_AUTH
    IDX -->|"app.use('/api/categories')"| R_CAT
    IDX -->|"app.use('/api/products')"| R_PROD
    IDX -->|"app.use('/api/suppliers')"| R_SUP
    IDX -->|"app.use('/api/orders')"| R_ORD
    IDX -->|"app.use('/api/dashboard')"| R_DASH
    IDX -->|"app.use('/api/users')"| R_USR

    R_AUTH -->|"no middleware needed"| C_AUTH
    R_CAT -->|"verifyUser"| VU
    R_CAT -->|"verifyAdmin (for write)"| VA
    R_PROD --> VU
    R_PROD --> VA
    R_SUP --> VU
    R_SUP --> VA
    R_ORD --> VU
    R_ORD --> VA
    R_DASH --> VU
    R_DASH --> VA
    R_USR --> VU
    R_USR --> VA

    VU -->|"reads JWT secret from"| ENV
    VU -->|"User.findById(decoded.id)"| M_USER
    VA -->|"checks req.user.role"| VU

    VU --> C_CAT
    VA --> C_CAT
    VU --> C_PROD
    VA --> C_PROD
    VU --> C_SUP
    VA --> C_SUP
    VU --> C_ORD
    VA --> C_ORD
    VU --> C_DASH
    VA --> C_DASH
    VU --> C_USR
    VA --> C_USR

    C_AUTH -->|"bcrypt + jwt"| M_USER
    C_CAT -->|"CRUD operations"| M_CAT
    C_CAT -->|"check if products exist"| M_PROD
    C_PROD -->|"CRUD operations"| M_PROD
    C_SUP -->|"CRUD operations"| M_SUP
    C_SUP -->|"check if products exist"| M_PROD
    C_ORD -->|"CRUD operations"| M_ORD
    C_ORD -->|"update stock quantity"| M_PROD
    C_ORD -->|"validate product"| M_PROD
    C_DASH -->|"count + aggregate"| M_PROD
    C_DASH -->|"count + aggregate"| M_ORD
    C_USR -->|"CRUD operations"| M_USER

    M_USER <-->|"mongoose CRUD"| DB
    M_CAT <-->|"mongoose CRUD"| DB
    M_PROD <-->|"mongoose CRUD"| DB
    M_SUP <-->|"mongoose CRUD"| DB
    M_ORD <-->|"mongoose CRUD"| DB

    SEED -->|"imports + calls connectDB"| CONN
    SEED -->|"creates test data"| M_USER
    SEED -->|"creates test data"| M_CAT
    SEED -->|"creates test data"| M_SUP
    SEED -->|"creates test data"| M_PROD
```

---

## 📌 Diagram 3 — Frontend File Communication

```mermaid
flowchart TD
    subgraph BUILD["Build Layer"]
        PKG_F["package.json\n(React, Axios, TailwindCSS,\nreact-router, react-icons)"]
        VITE["vite.config.js\n(react plugin + tailwind plugin)"]
        HTML["index.html\n(has div#root)"]
    end

    subgraph BOOTSTRAP["App Bootstrap"]
        MAIN["main.jsx\n(createRoot + render)"]
        AUTH_P["authcontext.jsx\n(AuthProvider wraps everything)"]
        APP["App.jsx\n(BrowserRouter + Routes)"]
    end

    subgraph SHARED["Shared / Utility Files"]
        CFG["config.js\n(API_BASE_URL)"]
        AUTH_CTX["authcontext.jsx\nuser state\nlogin() logout()\nuseAuth() hook"]
        PROT["utils/ProtectedRoutes.jsx\n(role-based guard)"]
        ROOT_C["components/root.jsx\n(smart redirect on /)"]
    end

    subgraph LAYOUTS["Layout Components"]
        ADM_L["components/AdminLayout.jsx\nSidebar + nav items\n+ Outlet"]
        CUS_L["components/CustomerLayout.jsx\nSidebar + nav items\n+ Outlet"]
    end

    subgraph AUTH_PAGES["Auth Pages"]
        LOGIN["pages/login.jsx"]
        REG["pages/register.jsx"]
    end

    subgraph ADMIN_PAGES["Admin Pages"]
        A_DASH["pages/admin/\nAdminDashboard.jsx"]
        A_PROF["pages/admin/\nAdminProfile.jsx"]
        A_CAT["pages/admin/\nCategoryList.jsx"]
        A_SUP["pages/admin/\nSupplierList.jsx"]
        A_PROD["pages/admin/\nProductList.jsx"]
        A_ORD["pages/admin/\nOrderList.jsx"]
        A_USR["pages/admin/\nUserList.jsx"]
    end

    subgraph CUST_PAGES["Customer Pages"]
        C_DASH["pages/customer/\nCustomerProducts.jsx"]
        C_ORD["pages/customer/\nCustomerOrders.jsx"]
        C_PROF["pages/customer/\nCustomerProfile.jsx"]
    end

    BACKEND["🖥️ Backend API\n(localhost:3000)"]

    HTML -->|"loads script"| MAIN
    PKG_F -->|"provides libraries"| MAIN
    VITE -->|"builds + serves"| HTML

    MAIN -->|"wraps in"| AUTH_P
    AUTH_P -->|"provides context to"| APP

    APP -->|"Route /"| ROOT_C
    APP -->|"Route /login"| LOGIN
    APP -->|"Route /register"| REG
    APP -->|"Route /admin → guarded by"| PROT
    APP -->|"Route /customer → guarded by"| PROT

    PROT -->|"reads user from"| AUTH_CTX
    PROT -->|"if ok, renders"| ADM_L
    PROT -->|"if ok, renders"| CUS_L

    ROOT_C -->|"reads user from"| AUTH_CTX

    ADM_L -->|"Outlet renders"| A_DASH
    ADM_L -->|"Outlet renders"| A_CAT
    ADM_L -->|"Outlet renders"| A_SUP
    ADM_L -->|"Outlet renders"| A_PROD
    ADM_L -->|"Outlet renders"| A_ORD
    ADM_L -->|"Outlet renders"| A_USR
    ADM_L -->|"Outlet renders"| A_PROF
    ADM_L -->|"calls logout() from"| AUTH_CTX

    CUS_L -->|"Outlet renders"| C_DASH
    CUS_L -->|"Outlet renders"| C_ORD
    CUS_L -->|"Outlet renders"| C_PROF
    CUS_L -->|"calls logout() from"| AUTH_CTX

    LOGIN -->|"calls login() from"| AUTH_CTX
    LOGIN -->|"reads URL from"| CFG
    LOGIN -->|"axios POST /api/auth/login"| BACKEND

    REG -->|"reads URL from"| CFG
    REG -->|"axios POST /api/auth/register"| BACKEND

    A_DASH -->|"reads URL from"| CFG
    A_DASH -->|"axios GET /api/dashboard/summary"| BACKEND
    A_CAT -->|"reads URL from"| CFG
    A_CAT -->|"axios GET/POST/PUT/DELETE /api/categories"| BACKEND
    A_SUP -->|"axios GET/POST/PUT/DELETE /api/suppliers"| BACKEND
    A_PROD -->|"axios GET/POST/PUT/DELETE /api/products"| BACKEND
    A_ORD -->|"axios GET/PUT /api/orders"| BACKEND
    A_USR -->|"axios GET/POST/DELETE /api/users"| BACKEND

    A_PROF -->|"reads user from"| AUTH_CTX
    C_PROF -->|"reads user from"| AUTH_CTX

    C_DASH -->|"reads URL from"| CFG
    C_DASH -->|"axios GET /api/products"| BACKEND
    C_DASH -->|"axios POST /api/orders/create"| BACKEND
    C_ORD -->|"axios GET /api/orders/customer-orders"| BACKEND
```

---

## 📌 Diagram 4 — Authentication Flow (Login Request)

```mermaid
sequenceDiagram
    actor User
    participant Login as login.jsx
    participant AuthCtx as authcontext.jsx
    participant Config as config.js
    participant Backend as index.js (Express)
    participant AuthRoute as routes/auth.js
    participant AuthCtrl as authcontroller.js
    participant UserModel as models/user.js
    participant MongoDB as 🗄️ MongoDB

    User->>Login: Fills email + password, clicks Login
    Login->>Config: reads API_BASE_URL
    Login->>Backend: axios.POST /api/auth/login {email, password}
    Backend->>AuthRoute: matches /api/auth → login handler
    Note over AuthRoute: No middleware — public route
    AuthRoute->>AuthCtrl: calls login(req, res)
    AuthCtrl->>UserModel: User.findOne({ email })
    UserModel->>MongoDB: db.users.findOne(...)
    MongoDB-->>UserModel: user document
    UserModel-->>AuthCtrl: user object
    AuthCtrl->>AuthCtrl: bcrypt.compare(password, user.password)
    AuthCtrl->>AuthCtrl: jwt.sign({ id, role }, JWT_SECRET, 10d)
    AuthCtrl-->>Login: { success: true, token, user: {id, name, email, role} }
    Login->>AuthCtx: login(userData, token)
    AuthCtx->>AuthCtx: setUser(userData)
    AuthCtx->>AuthCtx: localStorage.setItem('user', ...)
    AuthCtx->>AuthCtx: localStorage.setItem('token', ...)
    Login->>Login: navigate('/admin/dashboard') or '/customer/dashboard'
```

---

## 📌 Diagram 5 — Protected Route + Data Fetch Flow

```mermaid
sequenceDiagram
    actor User
    participant App as App.jsx
    participant Prot as ProtectedRoutes.jsx
    participant AuthCtx as authcontext.jsx
    participant Layout as AdminLayout.jsx
    participant Page as AdminDashboard.jsx
    participant Config as config.js
    participant Backend as index.js
    participant MW as authMiddleware.js
    participant Ctrl as dashboardController.js
    participant Prod as models/product.js
    participant Ord as models/order.js
    participant DB as 🗄️ MongoDB

    User->>App: navigates to /admin/dashboard
    App->>Prot: renders ProtectedRoutes requiredRole=["admin"]
    Prot->>AuthCtx: useAuth() → get user from localStorage/state
    AuthCtx-->>Prot: { user: { role: "admin", ... } }
    
    alt User is not logged in
        Prot->>App: navigate("/login")
    else User is wrong role
        Prot->>App: navigate("/unauthorized")
    else User is admin ✓
        Prot->>Layout: renders AdminLayout
        Layout->>Page: renders AdminDashboard via Outlet
        Page->>Config: reads API_BASE_URL
        Page->>Backend: axios.GET /api/dashboard/summary\nHeaders: Authorization: Bearer <token>
        Backend->>MW: verifyUser()
        MW->>MW: jwt.verify(token, JWT_SECRET)
        MW->>MW: User.findById(decoded.id)
        MW->>Backend: req.user = user → next()
        Backend->>MW: verifyAdmin()
        MW->>MW: req.user.role === "admin" ✓
        MW->>Ctrl: getDashboardStats(req, res)
        Ctrl->>Prod: Product.countDocuments()
        Prod->>DB: query
        DB-->>Prod: count
        Ctrl->>Ord: Order.find({ status: "Completed" })
        Ord->>DB: query
        DB-->>Ord: orders array
        Ctrl-->>Page: { success: true, stats: {...} }
        Page->>Page: setStats(data) → re-renders cards
    end
```

---

## 📌 Diagram 6 — CRUD Flow (Category Example)

```mermaid
flowchart LR
    subgraph FE["⚛️ Frontend"]
        CL["CategoryList.jsx"]
        CFG["config.js"]
        LS["localStorage\n(token)"]
    end

    subgraph BE["🖥️ Backend"]
        RT["routes/category.js"]
        MW_U["verifyUser()"]
        MW_A["verifyAdmin()"]
        CC["categoryController.js"]
        PM["models/product.js\n(for delete check)"]
        CM["models/category.js"]
    end

    DB[("🗄️ MongoDB")]

    CL -->|"reads"| CFG
    CL -->|"reads token"| LS
    CL -->|"GET /api/categories\n+ Bearer token"| RT
    CL -->|"POST /api/categories/add\n+ Bearer token"| RT
    CL -->|"PUT /api/categories/:id\n+ Bearer token"| RT
    CL -->|"DELETE /api/categories/:id\n+ Bearer token"| RT

    RT -->|"1. verifyUser"| MW_U
    MW_U -->|"ok →"| MW_A
    MW_A -->|"admin ✓ →"| CC

    CC -->|"getCategories()"| CM
    CC -->|"addCategory()"| CM
    CC -->|"updateCategory()"| CM
    CC -->|"deleteCategory() first checks"| PM
    PM -->|"countDocuments where category=id"| DB
    CC -->|"if count=0, then"| CM
    CM <-->|"CRUD"| DB
    CC -->|"JSON response"| CL
    CL -->|"fetchCategories()\nupdates state → re-renders table"| CL
```

---

## 📌 Diagram 7 — Order Placement Flow (Stock Management)

```mermaid
flowchart TD
    CDP["CustomerProducts.jsx\n(customer selects items + qty)"]
    CFG["config.js\n(API_BASE_URL)"]
    LS["localStorage (token)"]
    
    subgraph BE["🖥️ Backend"]
        OR["routes/order.js\nPOST /create"]
        VU["verifyUser()\n(attaches req.user)"]
        OC["orderController.js\ncreateOrder()"]
        
        subgraph LOGIC["Business Logic"]
            CHECK["For each product:\n1. Does product exist?\n2. Is stock sufficient?"]
            CALC["Calculate totalAmount\n= sum(price × qty)"]
            SAVE["Create Order document\nstatus: Completed"]
            DEDUCT["$inc: { quantity: -qty }\nfor each ordered product"]
        end
        
        PM["models/product.js"]
        OM["models/order.js"]
    end

    DB[("🗄️ MongoDB")]
    CDP -->|"reads"| CFG
    CDP -->|"reads token"| LS
    CDP -->|"axios POST /api/orders/create\n{ products: [{productId, qty}] }"| OR
    OR -->|"middleware"| VU
    VU -->|"req.user = customer"| OC
    OC --> CHECK
    CHECK -->|"Product.findById()"| PM
    PM <--> DB
    CHECK --> CALC
    CALC --> SAVE
    SAVE -->|"Order.save()"| OM
    OM --> DB
    SAVE --> DEDUCT
    DEDUCT -->|"Product.findByIdAndUpdate\n($inc: quantity: -qty)"| PM
    OC -->|"populated order JSON"| CDP
    CDP -->|"show success message"| CDP
```

---

## 📌 Diagram 8 — Complete File Dependency Map

```mermaid
flowchart LR
    subgraph CONFIG["⚙️ Config Files"]
        ENV[".env"]
        PKG_S["server/package.json"]
        PKG_F["frontend/package.json"]
        VITE["vite.config.js"]
        CFG["config.js"]
    end

    subgraph FRONTEND_CORE["⚛️ Frontend Core"]
        HTML["index.html"]
        MAIN["main.jsx"]
        APP["App.jsx"]
        AUTH["authcontext.jsx"]
        PROT["ProtectedRoutes.jsx"]
        ROOT["root.jsx"]
    end

    subgraph LAYOUTS_G["📐 Layouts"]
        AL["AdminLayout.jsx"]
        CL["CustomerLayout.jsx"]
    end

    subgraph ADMIN_G["🔐 Admin Pages"]
        AD["AdminDashboard"]
        AP["AdminProfile"]
        CAT["CategoryList"]
        SUP["SupplierList"]
        PROD["ProductList"]
        ORD["OrderList"]
        USR["UserList"]
    end

    subgraph CUSTOMER_G["🛒 Customer Pages"]
        CP["CustomerProducts"]
        CO["CustomerOrders"]
        CPR["CustomerProfile"]
        LOGIN["login.jsx"]
        REG["register.jsx"]
    end

    subgraph SERVER_CORE["🖥️ Server Core"]
        SIDX["index.js"]
        CONN["conn.js"]
        SEED["seed.js"]
    end

    subgraph ROUTES_G["🔀 Routes"]
        RA["routes/auth.js"]
        RC["routes/category.js"]
        RS["routes/supplier.js"]
        RP["routes/product.js"]
        RO["routes/order.js"]
        RD["routes/dashboard.js"]
        RU["routes/user.js"]
    end

    subgraph MW_G["🛡️ Middleware"]
        MW["authMiddleware.js"]
    end

    subgraph CTRL_G["⚙️ Controllers"]
        CA["authcontroller.js"]
        CC["categoryController.js"]
        CSP["supplierController.js"]
        CPD["productController.js"]
        CO2["orderController.js"]
        CD["dashboardController.js"]
        CU["userController.js"]
    end

    subgraph MODELS_G["📊 Models"]
        MU["user.js"]
        MC["category.js"]
        MS["supplier.js"]
        MP["product.js"]
        MO["order.js"]
    end

    DB[("🗄️ MongoDB")]

    %% Config connections
    ENV --> SIDX
    ENV --> CONN
    VITE --> HTML
    CFG --> AD & CAT & SUP & PROD & ORD & USR & CP & CO & LOGIN & REG

    %% Frontend bootstrap
    HTML --> MAIN
    MAIN --> AUTH
    MAIN --> APP
    AUTH --> APP
    AUTH --> PROT & ROOT & AL & CL & AP & CPR & LOGIN

    %% Routing
    APP --> ROOT & LOGIN & REG & PROT
    PROT --> AL & CL

    %% Layouts to pages
    AL --> AD & AP & CAT & SUP & PROD & ORD & USR
    CL --> CP & CO & CPR

    %% Frontend to backend (HTTP)
    LOGIN -->|"POST /api/auth/login"| SIDX
    REG -->|"POST /api/auth/register"| SIDX
    AD -->|"GET /api/dashboard/summary"| SIDX
    CAT -->|"CRUD /api/categories"| SIDX
    SUP -->|"CRUD /api/suppliers"| SIDX
    PROD -->|"CRUD /api/products"| SIDX
    ORD -->|"GET+PUT /api/orders"| SIDX
    USR -->|"CRUD /api/users"| SIDX
    CP -->|"GET /api/products"| SIDX
    CP -->|"POST /api/orders/create"| SIDX
    CO -->|"GET /api/orders/customer-orders"| SIDX

    %% Server routing
    SIDX --> CONN
    SIDX --> RA & RC & RS & RP & RO & RD & RU

    %% Routes to middleware to controllers
    RA --> CA
    RC --> MW --> CC
    RS --> MW --> CSP
    RP --> MW --> CPD
    RO --> MW --> CO2
    RD --> MW --> CD
    RU --> MW --> CU

    %% Middleware reads user model
    MW --> MU

    %% Controllers to models
    CA --> MU
    CC --> MC & MP
    CSP --> MS & MP
    CPD --> MP
    CO2 --> MO & MP
    CD --> MP & MO
    CU --> MU

    %% Seed
    SEED --> CONN & MU & MC & MS & MP

    %% Models to DB
    MU & MC & MS & MP & MO <--> DB
```
