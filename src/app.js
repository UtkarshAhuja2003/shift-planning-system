import express from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/auth.js";

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/", userRoutes);

export default app;