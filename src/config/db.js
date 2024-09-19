import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const dbURI = process.env.MONGO_URI;
        await mongoose.connect(dbURI);

        console.log("Database connected");
    } catch (error) {
        console.error("Cannot connect to Database", error.message);
    }
}

export default connectDB;