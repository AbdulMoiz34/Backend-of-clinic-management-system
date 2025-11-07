import mongoose from "mongoose";
import { ENV } from "../constants/index.js";

const connectDB = async () => {
    try {
        await mongoose.connect(ENV.DB_URI);
        console.log("MongoDB connected.");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

export default connectDB;