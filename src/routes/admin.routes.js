import { Router } from "express";
import { addDoctor } from "../controllers/doctor.controller.js";

const router = Router();

router.post("/add-doctor", addDoctor);

export default router;