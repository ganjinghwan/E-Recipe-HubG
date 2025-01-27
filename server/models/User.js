import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        required: true,
        enum: ["guest", "cook", "event-organizer", "moderator"],
        default: ""
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isRoleInfoCreated: {
        type: Boolean,
        default: false
    },
    inbox: [{
        senderRole: {
            type: String,
            required: true
        },
        senderName: {
            type: String,
            required: true
        },
        messageTitle: {
            type: String,
            required: true
        },
        messageContent:{
            type: String,
            required: true
        },
        date:{
            type: Date,
            default: Date.now
        },
        readStatus:{
            type: Boolean,
            default: false
        },
        additionalInformation:{
            type: String,
            default: "",
            required: false
        }
    }],
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    tempName: String,
    tempPassword: String,
    tempPhoneNumber: String,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
}, {timestamps: true});

export const User = mongoose.model("User", userSchema);