import { type } from "express/lib/response";
import mongoose from "mongoose";

const moderatorSchema = new mongoose.Schema({
    moderator_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // All users excluding the moderator
    userlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    deletedRecipes: [{
       recipeID: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Recipe",
       },
       recipeName: {
           type: String,
           required: true
       },
       reason: {
           type: String,
           required: true
       },
       date: {
           type: Date,
           default: Date.now
       },
    }],
    deletedUsers: [{
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        userName: {
            type: String,           
            required: true
        },
        reason: {
            type: String,           
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
    }],
    warnings: [{
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        userName: {
            type: String,           
            required: true
        },
        warningCount: {
            type: Number,
            required: true
        },
        reason: {
            type: String,           
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
    }]


});

export const Moderator = mongoose.model("Moderator", moderatorSchema);