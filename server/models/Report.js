import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    reporter_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reporter_name: {
        type: String,
        required: true
    },
    reporter_role:{
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
    reportedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reportedRecipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
},{
    timestamps: true
});

export const Report = mongoose.model("Report", reportSchema);