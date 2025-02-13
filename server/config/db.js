import mongoose from "mongoose";
import { authCleanUpUnverifiedUsers } from "../utils/authCleanUp.js";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });

        console.log("Date now:", new Date());
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        authCleanUpUnverifiedUsers();
        setInterval(authCleanUpUnverifiedUsers, 60 * 1000); // Run every minute
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit the process with failure
    }
}