import { User } from "../models/User.js";
import { EventOrganizer } from "../models/EventOrganizer.js";
import dotenv from "dotenv";

dotenv.config();

export const createOrgnizationInformation = async (req, res) => {
    const { orgName, orgDescription, orgContact, orgLocation } = req.body;

    try {
        const eventOrganizerID = await User.findOne(req.user._id);

        if (!eventOrganizerID) {
            return res.status(404).json({ success: false, message: ["Event organization not found"] });
        }

        const eventOrgError = [];

        const eventOrgNameRepeat = await EventOrganizer.findOne({ organizationName: orgName });
        console.log("Repeated event organization name", eventOrgNameRepeat);

        const eventOrgContactRepeat = await EventOrganizer.findOne({ contactNumber: orgContact });
        console.log("Repeated event organization contact", eventOrgContactRepeat);

        if (eventOrgNameRepeat) {
            eventOrgError.push("Event organization name already exists. Please registered another name.");
        }

        if (eventOrgContactRepeat) {
            eventOrgError.push("Repeated contact number.");
        }

        if (eventOrgError.length > 0) {
            return res.status(400).json({ success: false, message: eventOrgError });
        }
        
        const eventOrgInfo = new EventOrganizer({
            user_id: eventOrganizerID,
            organizationName: orgName,
            description: orgDescription,
            contactNumber: orgContact,
            location: orgLocation,
        });
        await eventOrgInfo.save();

        res.status(200).json({
            success: true,
            message: "Event organization information created successfully",
            eventOrgInfo: {
                ...eventOrgInfo._doc,
            },
        });

    } catch (error) {
        console.log("Failed to create event organization information", error.message);
        res.status(500).json({ success: false, message: [error.message] });
    }
};
