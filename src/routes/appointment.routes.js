import { Router } from "express";
import { createAppointment, getAppointments } from "../controllers/appointment.controller.js";

const router = Router();

router.post("/create-appointment", createAppointment);
router.get("/appointments", getAppointments);

export default router;