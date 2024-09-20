import express from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/auth.js";
import employeeRoutes from "./routes/employee.js"

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/", userRoutes);
app.use("/employee", employeeRoutes);

export default app;