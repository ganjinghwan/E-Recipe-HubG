import mongoose from "mongoose";

const eventOrganizerSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    organizationName: {
        type: String,
        required: true
    },
    organizationDescription: {
        type: String,
        required: true
    },
    organizationContact: {
        type: String,
        required: true
    },
    organizationLocation: {
        type: String,
        required: true
    },
    events_list: {
        type: Array,
        required: true
    }
});

export const EventOrganizer = mongoose.model("EventOrganizer", eventOrganizerSchema);