import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
            minlength: 3
        },
        cnic: {
            type: String,
            optional: true,
            // unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },
        address: {
            type: String,
            trim: true,
            optional: true
        },
        contactNo: {
            type: String,
            optional: true
        },
        emergencyNo: {
            type: String,
            optional: true
        },
        age: {
            type: Number,
            min: 0,
            max: 120,
            optional: true
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
        },
        appointments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Appointment",
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    }
);

export default mongoose.model("Patient", patientSchema);
