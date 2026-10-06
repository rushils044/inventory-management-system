import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "./models/user.js";
import Category from "./models/category.js";
import Supplier from "./models/supplier.js";
import Product from "./models/product.js";
import connectDB from "./connection.js/conn.js";

const seedDatabase = async () => {
    try {
        await connectDB();
        console.log("Seeding default data...");

        // 1. Seed Admin & Customer Users if they don't exist
        const adminExists = await User.findOne({ email: "admin@example.com" });
        if (!adminExists) {
            const hashPassword = await bcrypt.hash("admin", 10);
            await User.create({
                name: "Admin User",
                email: "admin@example.com",
                password: hashPassword,
                address: "Admin HQ",
                role: "admin"
            });
            console.log("✔ Admin user created (admin@example.com / admin)");
        }

        const customerExists = await User.findOne({ email: "customer@example.com" });
        if (!customerExists) {
            const hashPassword = await bcrypt.hash("customer", 10);
            await User.create({
                name: "John Customer",
                email: "customer@example.com",
                password: hashPassword,
                address: "123 Main Street",
                role: "customer"
            });
            console.log("✔ Customer user created (customer@example.com / customer)");
        }

        // 2. Seed Categories
        const categoriesData = [
            { name: "Tech", description: "Computers, gadgets & tech accessories" },
            { name: "Electronic", description: "Electronic appliances and components" },
            { name: "Fashion", description: "Clothing, personal care and fashion items" }
        ];

        const seededCategories = {};
        for (const cat of categoriesData) {
            let existing = await Category.findOne({ name: cat.name });
            if (!existing) {
                existing = await Category.create(cat);
            }
            seededCategories[cat.name] = existing._id;
        }
        console.log("✔ Categories created (Tech, Electronic, Fashion)");

        // 3. Seed Suppliers
        const suppliersData = [
            { name: "TechCorp Logistics", email: "contact@techcorp.com", phone: "+1 555-0101", address: "Silicon Valley, CA" },
            { name: "Global Electronics Inc", email: "sales@globalelectronics.com", phone: "+1 555-0202", address: "New York, NY" },
            { name: "StyleSupply Co", email: "info@stylesupply.com", phone: "+1 555-0303", address: "Los Angeles, CA" }
        ];

        const seededSuppliers = {};
        for (const sup of suppliersData) {
            let existing = await Supplier.findOne({ name: sup.name });
            if (!existing) {
                existing = await Supplier.create(sup);
            }
            seededSuppliers[sup.name] = existing._id;
        }
        console.log("✔ Suppliers created");

        // 4. Seed Products
        const productsData = [
            { name: "Mouse", category: seededCategories["Tech"], supplier: seededSuppliers["TechCorp Logistics"], price: 10, quantity: 20, description: "Ergonomic Optical Mouse" },
            { name: "Hair Oil", category: seededCategories["Fashion"], supplier: seededSuppliers["StyleSupply Co"], price: 15, quantity: 20, description: "Organic Hair Care Oil" },
            { name: "LED Light", category: seededCategories["Electronic"], supplier: seededSuppliers["Global Electronics Inc"], price: 5, quantity: 5, description: "Energy Saving LED Bulb" },
            { name: "Monitor", category: seededCategories["Electronic"], supplier: seededSuppliers["Global Electronics Inc"], price: 150, quantity: 3, description: "24-inch HD LED Display" },
            { name: "PC", category: seededCategories["Tech"], supplier: seededSuppliers["TechCorp Logistics"], price: 800, quantity: 3, description: "Desktop Workstation Tower" },
            { name: "RAM", category: seededCategories["Tech"], supplier: seededSuppliers["TechCorp Logistics"], price: 45, quantity: 2, description: "16GB DDR4 RAM Module" },
            { name: "Screen", category: seededCategories["Electronic"], supplier: seededSuppliers["Global Electronics Inc"], price: 120, quantity: 0, description: "Replacement Screen Panel (Out of Stock Demo)" }
        ];

        for (const prod of productsData) {
            const existing = await Product.findOne({ name: prod.name });
            if (!existing) {
                await Product.create(prod);
            }
        }
        console.log("✔ Default Products created (Mouse, Hair Oil, LED Light, Monitor, PC, RAM, Screen)");

        console.log("All default data seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding default data:", error);
        process.exit(1);
    }
};

seedDatabase();