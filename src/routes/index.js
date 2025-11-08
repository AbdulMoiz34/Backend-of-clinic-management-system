import { Router } from "express";
import { auth } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import authRoutes from "./auth.routes.js";
import adminRoutes from "./admin.routes.js";
// import patientRoutes from "../modules/patient/routes.js";
// import authRoutes from "../modules/auth/routes.js";
// import doctorRoutes from "../modules/doctor/routes.js";
// import adminRoutes from "../modules/admin/routes.js";

const router = Router();

router.get("/", (req, res) => {
    res.send("API is running...");
});

// router.use("/patients", patientRoutes);
router.use("/auth", authRoutes);
router.use("/admin", auth, authorize("admin"), adminRoutes);
// router.use("/doctors", doctorRoutes);
// router.use("/admin", adminRoutes);

export default router;