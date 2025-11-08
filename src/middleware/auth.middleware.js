import jwt from "jsonwebtoken";
import { UNAUTHORIZED } from "../constants/index.js";
import User from "../models/User.model.js";

export const auth = async (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) return res.status(UNAUTHORIZED).json({ message: "Not authenticated" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) return res.status(UNAUTHORIZED).json({ message: "User not found" });
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        return res.status(UNAUTHORIZED).json({ message: "Invalid token" });
    }
};