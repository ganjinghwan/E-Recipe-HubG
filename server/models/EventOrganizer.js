import mongoose from "mongoose";

const eventOrganizerSchema = new mongoose.Schema({
    event_org_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    organizationName: {
        type: String,
        required: false
    },
    organizationDescription: {
        type: String,
        required: false
    },
    organizationContact: {
        type: String,
        required: false
    },
    organizationLocation: {
        type: String,
        required: false
    },
    events_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
    }],
    favouriteRecipes: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Recipe",
            }],
    updateResetTimeAt: Date,
}, {timestamps: true});

export const EventOrganizer = mongoose.model("EventOrganizer", eventOrganizerSchema);