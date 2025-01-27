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
    // history
    deletedRecipes: [{
       userName: {
           type: String,
           required: true
       },
       userRole: {
           type: String,
           required: true
       },
       recipeTitle: {
           type: String,
           required: true
       },
       recipeID: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Recipe",
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
    //history
    deletedUsers: [{
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        userName: {
            type: String,           
            required: true
        },
        userRole: {
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
    //history
    deletedEvents: [{
        userName: {
            type: String,           
            required: true
        },
        userRole: {
            type: String,           
            required: true
        },
        eventID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
        },
        eventTitle: {
            type: String,           
            required: true
        },
        eventStartDate: {
            type: Date,           
            required: true
        },
        eventEndDate: {
            type: Date,           
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
    //history
    passedReports: [{
        reporterName: {
            type: String,           
            required: true
        },
        reporterRole: {
            type: String,           
            required: true
        },
        reportTitle: {
            type: String,           
            required: true
        },
        reportReason: {
            type: String,           
            required: true
        },
        reportedRecipe: {
            type: String,           
            required: true
        },
        reportedUserName: {
            type: String,           
            required: true
        },
        reportedUserRole: {
            type: String,           
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
    }],
    //history
    warnings: [{
        warnedUserID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        warnedUserName: {
            type: String,           
            required: true
        },
        warnedUserRole: {
            type: String,           
            required: true
        },
        warningCount: {
            type: Number,
            required: false
        },
        warnedReason: {
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