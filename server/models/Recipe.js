/* Define recipe schema with fields like title, ingredients, and user ID. */
import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    ingredients: {
        type: Array,
        required: true
    },
    instructions: {
        type: String,
        required: true
    },
    prepTime: {
        type: String,
        required: true
    },
    steps: {
        type: Array,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,// Store image URL or file path
        required: true
    }
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // }
},{
    timestamps: true
});


const Recipe = mongoose.model('Recipe', recipeSchema);  

export default Recipe;