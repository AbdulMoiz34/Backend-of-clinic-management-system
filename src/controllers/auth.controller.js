import bcrypt from "bcrypt";
import { generateToken } from "../helpers/index.js";
import User from "../models/User.model.js";
import Appointment from "../models/Appointment.model.js";
import Patient from "../models/Patient.model.js";
import { BAD_REQUEST, CONFLICT, CREATED, FORBIDDEN, INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MESSAGE, OK, UNAUTHORIZED } from "../constants/index.js";

const signup = async (req, res) => {

    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password)
        return res.status(BAD_REQUEST).json({ message: "All fields are required" });

    try {

        const existing = await User.findOne({ email });

        if (existing) return res.status(CONFLICT).json({ message: "Email exists" });

        const hash = await bcrypt.hash(password, 12);

        const user = await User.create({
            fullName,
            email,
            password: hash,
            role: "patient",
        });

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        return res.status(CREATED).json({
            message: "User registered successfully",
            user: { id: user._id, fullName, email, role: user.role }
        });
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).send({ status: INTERNAL_SERVER_ERROR, message: INTERNAL_SERVER_ERROR_MESSAGE });
    }
};

const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(UNAUTHORIZED).json({ message: "Invalid credientials." });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(UNAUTHORIZED).json({ message: "Invalid credientials." });

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        res.json({
            message: "Login successful",
            user: { id: user._id, fullName: user.fullName, email, role: user.role }
        });
    } catch (err) {
        return res.status(INTERNAL_SERVER_ERROR).json({ status: INTERNAL_SERVER_ERROR, message: err.message });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(OK).json({ message: "Logged out successfully!" });
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Something went wrong!" });
    }
}

const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(FORBIDDEN).json({ message: "All fields are required." });
        }
        const user = await User.findById(req.user._id);
        if (!user) return res.status(UNAUTHORIZED).json({ message: "User not found." });

        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) return res.status(UNAUTHORIZED).json({ message: "current password is incorrect." });

        if (newPassword !== confirmPassword) {
            return res.status(FORBIDDEN).json({ message: "New password & confirm password must be same" });
        }

        const samePassword = await bcrypt.compare(newPassword, user.password);
        if (samePassword) return res.status(FORBIDDEN).json({ message: "New password cannot be same as current password." });


        const hash = await bcrypt.hash(newPassword, 12);
        user.password = hash;
        await user.save();


        res.status(OK).json({ message: "Password updated successfully." });
    } catch (err) {
        console.error("Error updating password:", err);
        res.status(INTERNAL_SERVER_ERROR).json({ message: INTERNAL_SERVER_ERROR_MESSAGE });
    }
}

const updatePatientProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const {
            fullName,
            phone,
            dateOfBirth,
            gender,
            bloodGroup,
            address,
            emergencyContact,
            imgUrl,
        } = req.body;

        console.log(userId)
        const updatedUser = await User.findByIdAndUpdate(userId,
            fullName ? { fullName } : {},
            { new: true } // return updated doc
        );

        // Update or create Patient document
        let patient = await Patient.findOne({ user: userId });
        if (!patient) patient = new Patient({ user: userId });

        patient.phone = phone || patient.phone;
        patient.dateOfBirth = dateOfBirth || patient.dateOfBirth;
        patient.gender = gender || patient.gender;
        patient.bloodGroup = bloodGroup || patient.bloodGroup;
        patient.address = address || patient.address;
        patient.emergencyContact = emergencyContact || patient.emergencyContact;
        patient.imgUrl = imgUrl || patient.imgUrl;

        await patient.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
            patient,
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

const deleteAcc = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(req.user)

        if (id.toString() !== req.user._id.toString()) {
            return res.status(FORBIDDEN).json({ message: "You are not authorized to delete this account" });
        }

        await Patient.deleteOne({ user: id });
        await Appointment.deleteMany({ patient: id });
        await User.findByIdAndDelete(id);
        res.clearCookie("token");
        return res.status(OK).json({ message: "Account deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: INTERNAL_SERVER_ERROR_MESSAGE,
            error: err.message,
        });
    }
};

const getPatientProfile = async (req, res) => {
    try {
        const patient = await Patient.findOne({ user: req.user._id })
            .populate("user", "fullName email");

        if (!patient) return res.status(404).json({ message: "Patient profile not found" });

        res.status(200).json(patient);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


export { signup, login, logout, updatePassword, updatePatientProfile, deleteAcc, getPatientProfile };