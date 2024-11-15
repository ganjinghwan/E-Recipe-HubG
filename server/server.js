import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import recipeRoutes from './routes/recipes.js';
import path from "path";

dotenv.config();

const app = express();

const __dirname = path.resolve();

app.use(express.json()); // allows us to accepts JSON data in the req.body

app.use("/api/recipesinfo", recipeRoutes);

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