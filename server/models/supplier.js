import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

const Supplier = mongoose.model("Supplier", supplierSchema);
export default Supplier;
