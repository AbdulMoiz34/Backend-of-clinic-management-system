import { Router } from "express";
import { auth } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import authRoutes from "./auth.routes.js";
import adminRoutes from "./admin.routes.js";
import doctorRoutes from "./doctor.routes.js";
import patientRoutes from "./appointment.routes.js";
import { updateAppointmentStatus } from "../controllers/appointment.controller.js";

const router = Router();

router.get("/", (req, res) => {
    res.send("API is running...");
});

router.use("/auth", authRoutes);
router.use("/doctors", doctorRoutes);
router.use("/admin", auth, authorize("admin"), adminRoutes);
router.use("/patient", auth, authorize("patient"), patientRoutes);
router.use("/appointments/:id/status", auth , updateAppointmentStatus);

export default router;