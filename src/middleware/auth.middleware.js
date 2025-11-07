import jwt from "jsonwebtoken";
import { FORBIDDEN, UNAUTHORIZED } from "../constants/index.js";
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
        res.clearCookie("token");
        return res.status(UNAUTHORIZED).json({ message: "Invalid token" });
    }
};

export const authorize = (role) => {
    return (req, res, next) => {
        if (role !== req.user?.role) {
            return res.status(FORBIDDEN).json({ message: "Access denied" });
        }
        next();
    };
};