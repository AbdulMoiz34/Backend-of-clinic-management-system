import { FORBIDDEN } from "../constants/index.js";

export const authorize = (role) => {
    return (req, res, next) => {
        if (role !== req.user?.role) {
            return res.status(FORBIDDEN).json({ message: "Access denied" });
        }
        next();
    };
};