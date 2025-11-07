import { Router } from "express";
const router = Router();

router.get("/me", (req , res)=> {
    res.send("heeloo")
});

export default router;