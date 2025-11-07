import express from "express";
import helmet from "helmet";
import connectDB from "./src/config/db.js";
import routes from "./src/routes/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(helmet());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(cookieParser());

app.use("/api", routes);

app.listen(3000, () => {
    console.log("server is running.");
});

connectDB();