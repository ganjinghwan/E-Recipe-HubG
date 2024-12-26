import { User } from "../models/User.js";
import { EventOrganizer } from "../models/EventOrganizer.js";

export const getEventOrganizerInformation = async (req, res) => {
    try {
        const eventOrganizerID = await User.findById(req.user._id);
        const eventOrganizerInfo = await EventOrganizer.findOne({ event_org_id: eventOrganizerID._id });

        if (!eventOrganizerInfo) {
            return res.status(404).json({ success: false, message: ["Event organization information not found"] });
        }

        res.json({ eventOrganizer: eventOrganizerInfo });
    } catch (error) {
        res.status(500).json({ success: false, message: [error.message] });
    }
}

export const newEventOrganizerInformation = async (req, res) => {
    const { orgName, orgDescription, orgContact, orgLocation } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: ["User not found"] });
        }

        if (!orgName || !orgDescription || !orgContact || !orgLocation) {
            return res.status(400).json({ success: false, message: ["Please fill in all fields"] });
        }

        const newEventOrgInfo = new EventOrganizer({
            event_org_id: user._id,
            organizationName: orgName,
            organizationDescription: orgDescription,
            organizationContact: orgContact,
            organizationLocation: orgLocation,
            events_list: [],
            favouriteRecipes: [],
        });

        await newEventOrgInfo.save();

        res.status(200).json({
            success: true,
            message: "Event Organizer Info Created Successfully",
            newEventOrgInfo: {
                ...newEventOrgInfo._doc,
            }

        });
    } catch (error) {
        console.log("Failed to create event organization information", error.message);
        res.status(500).json({ success: false, message: [error.message] });
    }
}

export const updateEventOrganizerInformation = async (req, res) => {
    const { orgName, orgDescription, orgContact, orgLocation } = req.body;

    try { 
        if (!orgName && !orgDescription && !orgContact && !orgLocation) {
            return res.status(400).json({ success: false, message: ["Please provide at least one field to update"] });
        }

        const eventOrgID = await User.findById(req.user._id);

        if (!eventOrgID) {
            return res.status(404).json({ success: false, message: ["Event organization not found"] });
        }

        const eventOrgError = [];

        if (eventOrgID.role !== "event-organizer") {
            eventOrgError.push("User is not an event organizer");
        }

        const eventOrgInfo = await EventOrganizer.findOne({ event_org_id: eventOrgID._id });

        if (eventOrgInfo.updateResetTimeAt && eventOrgInfo.updateResetTimeAt > Date.now()) {
            const updateResetTime = new Date(eventOrgInfo.updateResetTimeAt).toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });

            return res.status(400).json({ success: false, message: ["Event organization information update is on cooldown. Please try again later. You can reset at " + updateResetTime] });
        }

        if (!eventOrgInfo) {
            eventOrgError.push("Event organization information not found");
        }

        if (orgName) {
            if (orgName === eventOrgInfo.organizationName) {
                eventOrgError.push("Same organization name, please choose a different one");
            } else {
                eventOrgInfo.organizationName = orgName;
            }
        }

        if (orgDescription) {
            if (orgDescription === eventOrgInfo.organizationDescription) {
                eventOrgError.push("Same organization description, please put a new one");
            } else {
                eventOrgInfo.organizationDescription = orgDescription;
            }
        }

        if (orgContact) {
            if (orgContact === eventOrgInfo.organizationContact) {
                eventOrgError.push("Same organization contact, please put a new one");
            } else {
                eventOrgInfo.organizationContact = orgContact;
            }
        }

        if (orgLocation) {
            if (orgLocation === eventOrgInfo.organizationLocation) {
                eventOrgError.push("Same organization location, please put a new one");
            } else {
                eventOrgInfo.organizationLocation = orgLocation;
            }
        }

        //Role update cooldown time
        eventOrgInfo.updateResetTimeAt = Date.now() + 5 * 60 * 1000; // 5 minutes

        if (eventOrgError.length > 0) {
            return res.status(400).json({ success: false, message: eventOrgError });
        }

        await eventOrgInfo.save();

        res.status(200).json({
            success: true,
            message: "Event organization information updated successfully",
            eventOrgInfo: {
                ...eventOrgInfo._doc,
            },
        })
    } catch (error) {
        console.log("Failed to update event organization information", error.message);
        res.status(500).json({ success: false, message: [error.message] });
    }
};



    export const getEOFavoriteRecipes = async (req, res) => {    
        const userId = req.userId;

    try {
        const eventOrg = await EventOrganizer.findOne({ event_org_id: userId }).populate('favouriteRecipes');
        
        if (!eventOrg) {
            return res.status(404).json({ success: false, message: "EventOrganizer not found" });
        }

        // `favouriteRecipes` is already populated with full recipe details
        res.status(200).json({ success: true, data: eventOrg.favouriteRecipes });
    } catch (error) {
        console.error("Error fetching favorite recipes:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};