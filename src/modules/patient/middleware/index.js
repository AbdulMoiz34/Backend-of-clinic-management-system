import jwt from "jsonwebtoken";
import { ENV } from "../../../constants/index.js";
import { getDataByEmail } from "../db/index.js";
import { StatusCodes } from "http-status-codes";

const { UNAUTHORIZED } = StatusCodes

export const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) return res.status(UNAUTHORIZED).json({ message: "Not authenticated." });

    try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        const user = await getDataByEmail(decoded.email);
        console.log(user);
        if (!user) return res.status(UNAUTHORIZED).json({ message: "Not authenticated." });

        next();
    } catch (err) {
        return res.status(UNAUTHORIZED).json({ message: "Invalid token" });
    }
};