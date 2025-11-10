import { BAD_REQUEST, INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MESSAGE, OK } from "../constants/index.js";
import Appointment from "../models/Appointment.model.js";

const createAppointment = async (req, res) => {
    try {
        const { docId, date, time, patientId, patientDisease, status } = req.body;

        if (!docId || !date || !time || !patientId) {
            return res.status(BAD_REQUEST).json({ message: "All fields are required" });
        }

        const isAppointmentExist = await Appointment.findOne({
            doctor: docId,
            patient: patientId,
            date,
            time,
            status: "Booked"
        });

        if (isAppointmentExist) {
            return res.status(BAD_REQUEST).json({ message: "This appointment already exists" });
        }

        await Appointment.create({
            patient: patientId,
            doctor: docId,
            patientDisease,
            date,
            time,
            status: status || "Booked",
        });

        return res.status(OK).json({ message: "Appointment created successfully" });

    } catch (err) {
        console.error("Appointment Error:", err);
        return res.status(INTERNAL_SERVER_ERROR).json({ message: INTERNAL_SERVER_ERROR_MESSAGE });
    }
};

const getAppointments = async (req, res) => {
    const { patientId } = req.params;

    try {
        const appointments = await Appointment.find({ patient: patientId })
            .populate("doctor", "specialization imgUrl")
            .populate("patient", "fullName email")
            .sort({ date : -1});
        res.status(OK).json(appointments);
    } catch (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR).json({ message: INTERNAL_SERVER_ERROR_MESSAGE });
    }
    console.log(req.user._id);
    res.status(OK).json();
}

export { createAppointment, getAppointments };