import mongoose from "mongoose";

const { ObjectId, String, Date } = mongoose.Schema.Types;

const AppointmentSchema = new mongoose.Schema({
    patientId: {
        type: ObjectId,
        ref: "User"
    },
    doctorId: {
        type: ObjectId,
        ref: "User"
    },
    status: String,
    date: Date,
    patientDisease: String,
    prescription: String
})

export default mongoose.model("Appointment", AppointmentSchema);