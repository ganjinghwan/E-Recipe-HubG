import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import recipeRoutes from './routes/recipes.js';
import authRoutes from './routes/auth.js';
import guestRoutes from './routes/guest_rt.js';
import cookRoutes from './routes/cook_rt.js';
import organizerRoutes from './routes/eventOrg_rt.js';
import moderatorRoutes from './routes/moderator_rt.js';
import eventRoutes from './routes/event_rt.js'
import reportRoutes from './routes/report.js';
import cookieParser from 'cookie-parser';
import path from "path";

dotenv.config();

const app = express();
const __dirname = path.resolve();

//Increase payload size limit
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({limit: '10mb', extended: true}));

app.use(express.json()); // allows us to accepts JSON data in the req.body
app.use(cookieParser()); // allows up to parse incoming cookies

app.use("/api/recipesinfo", recipeRoutes);
app.use("/api/auth", authRoutes);

//Roles
app.use("/api/guests", guestRoutes);
app.use("/api/cooks", cookRoutes);
app.use("/api/eventorg", organizerRoutes);
app.use("/api/moderator", moderatorRoutes);

//Events
app.use("/api/events", eventRoutes);

//Reports
app.use("/api/reports", reportRoutes);


// console.log(process.env.MONGO_URI);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/client/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectDB();
    console.log(`E-Recipes Hub Server running on port ${PORT}`)
});