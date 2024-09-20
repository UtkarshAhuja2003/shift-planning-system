import express from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/auth.js";
import employeeRoutes from "./routes/employee.js"
import adminRoutes from "./routes/admin.js";
import cors from "cors";

const app = express();

connectDB();

app.use(cors());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/", userRoutes);
app.use("/employee", employeeRoutes);
app.use("/admin", adminRoutes);

export default app;