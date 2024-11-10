import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Recipe from './models/Recipe.js';
import mongoose from 'mongoose';
import recipeRoutes from './routes/recipes.js';

dotenv.config();

const app = express();

app.use(express.json()); // allows us to accepts JSON data in the req.body

app.use("/api/recipesinfo", recipeRoutes);

// console.log(process.env.MONGO_URI);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectDB();
    console.log(`E-Recipes Hub Server running on port ${PORT}`)
});