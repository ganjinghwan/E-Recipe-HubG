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
    isRoleInfoCreated: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    tempName: String,
    tempPassword: String,
    tempPhoneNumber: String,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
}, {timestamps: true});

export const User = mongoose.model("User", userSchema);