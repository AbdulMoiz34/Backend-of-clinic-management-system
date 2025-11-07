import { Router } from "express";
import postController from "./controllers/post.js";
import { authMiddleware } from "./middleware/index.js";

const router = Router();

router.post("/register", postController);
router.post("/login",);

router.get("/abc", authMiddleware, (req, res) => {
    res.send("Hello world");
});

export default router;