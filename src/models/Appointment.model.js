import mongoose from "mongoose";

const { ObjectId, String, Date } = mongoose.Schema.Types;

const AppointmentSchema = new mongoose.Schema({
    patient: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    doctor: {
        type: ObjectId,
        ref: "Doctor",
        required: true
    },
    status: {
        type: String,
        default: "Booked",
        enum: ["Booked", "Checked-In", "Completed", "Cancelled"]
    },
    date: Date,
    time: String,
    patientDisease: String,
    prescription: String
})

export default mongoose.model("Appointment", AppointmentSchema);