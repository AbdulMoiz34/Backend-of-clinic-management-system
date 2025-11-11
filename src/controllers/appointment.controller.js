import { BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MESSAGE, OK } from "../constants/index.js";
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
    try {
        const patientId = req.user._id;

        const appointments = await Appointment.find({ patient: patientId })
            .populate({
                path: "doctor",
                populate: {
                    path: "user",
                    select: "fullName email"
                },
                select: "specialization imgUrl"
            })
            .populate("patient", "fullName email")
            .sort({ date: -1 });

        const formatted = appointments.map(appt => {
            const doctor = appt.doctor;
            return {
                ...appt._doc,
                doctor: {
                    _id: doctor._id,
                    fullName: doctor.user?.fullName,
                    specialization: doctor.specialization,
                    imgUrl: doctor.imgUrl
                }
            };
        });

        return res.status(OK).json(formatted);

    } catch (err) {
        console.log(err);
        return res.status(INTERNAL_SERVER_ERROR).json({ message: INTERNAL_SERVER_ERROR_MESSAGE });
    }
};

const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const user = req.user;

        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (user.role === "patient") {
            if (appointment.patient.toString() !== user._id) {
                return res.status(FORBIDDEN).json({ message: "Not your appointment" });
            }
            if (status !== "cancelled") {
                return res.status(FORBIDDEN).json({ message: "Patients can only cancel" });
            }
        }

        if (user.role === "doctor") {
            if (appointment.doctor.toString() !== user._id) {
                return res.status(FORBIDDEN).json({ message: "Not your appointment" });
            }
            if (!["Checked-In", "completed"].includes(status)) {
                return res.status(FORBIDDEN).json({ message: "Invalid status for doctor" });
            }
        }

        appointment.status = status;
        await appointment.save();

        res.json({ message: "Status updated successfully", appointment });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};


export { createAppointment, getAppointments, updateAppointmentStatus };