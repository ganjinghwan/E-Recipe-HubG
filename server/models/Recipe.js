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
        type: Array,
        required: true
    },
    prepTime: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,// Store image URL or file path
        required: true
    },
    video: {
        type: String,
        required: false
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: false
    },
    ratings: [
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
        },
    ],
    AveRating: { 
        type: Number, 
        default: 0 
    },
    comments: [
        {
            user: {
                type: String, // Username
                required: true
            },
            text: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
},{
    timestamps: true
});


const Recipe = mongoose.model('Recipe', recipeSchema);  

export default Recipe;