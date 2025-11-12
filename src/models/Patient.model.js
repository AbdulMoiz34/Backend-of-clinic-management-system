import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
    phone: String,
    dateOfBirth: String,
    gender: String,
    bloodGroup: String,
    address: String,
    emergencyContact: String,
    imgUrl: String,
    medicalHistory: [String],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true });

export default mongoose.model("Patient", PatientSchema);