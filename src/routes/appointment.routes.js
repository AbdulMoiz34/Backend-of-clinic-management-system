import { Router } from "express";
import { createAppointment, getAppointments } from "../controllers/appointment.controller.js";
import { updatePatientProfile, getPatientProfile } from "../controllers/auth.controller.js";
const router = Router();

router.post("/create-appointment", createAppointment);
router.get("/appointments", getAppointments);
router.patch("/updateProfile", updatePatientProfile);
router.get("/me", getPatientProfile);

export default router;