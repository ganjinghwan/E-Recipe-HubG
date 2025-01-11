import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    //event_id
    eventBelongs_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // Invite attendees list
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    event_name: {
        type: String,
        required: true
    },
    event_description: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    /*event_date: {
        type: Date,
        required: true
    },*/
    event_thumbnail: {
        type: String,
        required: true
    },
    comments: {
        type: Array,
        required: false
    },
    updateEventToken: String,
    eventSpecificEndUrl: String,
}, {
    timestamps: true
});

export const Event = mongoose.model("Event", eventSchema);