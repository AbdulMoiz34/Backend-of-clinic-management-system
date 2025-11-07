import jwt from "jsonwebtoken";
import { ENV } from "../constants/index.js";

const generateToken = (id) => {
    return jwt.sign({id}, ENV.JWT_SECRET);
}

export { generateToken };