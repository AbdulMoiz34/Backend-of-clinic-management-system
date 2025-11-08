import bcrypt from "bcrypt";
import User from "../models/User.model.js";
import Doctor from "../models/Doctor.model.js";
import { StatusCodes } from "http-status-codes";

const { CREATED, BAD_REQUEST, CONFLICT, INTERNAL_SERVER_ERROR } = StatusCodes;

export const addDoctor = async (req, res) => {
    const { fullName, email, password, dateOfBirth, gender, phone, address, specialization, about, availability, imgUrl } = req.body;

    if (!fullName || !email || !password || !specialization) {
        return res.status(BAD_REQUEST).json({ message: "Required fields are missing." });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(CONFLICT).json({ message: "Email already in use!" });

        const hashPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            fullName,
            email,
            password: hashPassword,
            role: "doctor"
        });

        const doctor = await Doctor.create({
            dateOfBirth,
            gender,
            phone,
            address,
            specialization,
            about,
            availability,
            imgUrl,
            status: "available",
            user: user._id
        });

        return res.status(CREATED).json({
            message: "Doctor added successfully!",
            doctor
        });

    } catch (error) {
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: "Internal server error."
        });
    }
};
