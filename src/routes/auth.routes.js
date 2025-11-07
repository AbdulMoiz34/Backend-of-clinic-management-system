import { Router } from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", auth, (req, res) => {
    res.json({ success: true, user: req.user });
});


export default router;