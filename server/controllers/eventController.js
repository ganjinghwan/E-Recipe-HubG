import { User } from "../models/User.js";
import { Event } from "../models/Event.js";
import { EventOrganizer } from "../models/EventOrganizer.js";
import { v4 as uuidv4 } from 'uuid';
import cloudinary from "../cloudinary/cloudinary.js";

export const getEventOrganizerCreatedEvents = async (req, res) => {
    try {
        const eventOrg = await EventOrganizer.findOne({ event_org_id: req.user._id });

        if (!eventOrg) {
            return res.status(404).json({message: ["Event organization information not found"]});
        }

        const events = await Event.find({ eventBelongs_id: req.user._id });

        res.status(200).json({ 
            success: true,
            message: "Events retrieved successfully",
            events,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: [error.message] });
    }
}

export const getAllEvents = async (req, res) => {
    try {
        const Allevents = await Event.find({
            //eventStartDate: { $gte: Date.now() }
        })

        res.status(200).json({
            success: true,
            message: "All events retrieved successfully",
            Allevents,
        })
    } catch (error) {
        res.status(500).json({ success: false, message: [error.message] });
    }
}

export const getInvitableUserList = async (req, res) => {
    try {
        const {specificEventURL} = req.params;

        const actualBelongsToEventOrg = await Event.findOne({
            eventBelongs_id: req.user._id,
            eventSpecificEndUrl: specificEventURL
        })

        if (!actualBelongsToEventOrg) {
            return res.status(404).json({message: ["No actual event organizer"]});
        }

        // Combine attendees and invited into a single array
        const excludedUsers = [
            ...(actualBelongsToEventOrg.attendees || []),
            ...(actualBelongsToEventOrg.invited || []),
            ...(actualBelongsToEventOrg.rejected || [])
        ];

        // Fetch users not already in attended or invited
        const invitableUserInfo = await User.find({
            role: { $in: ["cook", "guest"] },
            _id: { $nin: excludedUsers }, // Exclude users in both attendees and invited
        });

        // If no users are found, return an empty array
        if (!invitableUserInfo || invitableUserInfo.length === 0) {
            return res.status(200).json({
                success: true,
                invitableUserInfo: [], // Return an empty array
                message: ["No users available to invite"],
            });
        }

        res.status(200).json({ 
            success: true, 
            invitableUserInfo
        });
    } catch (error) {
        res.status(500).json({ success: false, message: [error.message] });
    }
}

export const createEvent = async (req, res) => {
    const {event_name, event_description, start_date, end_date, event_image} = req.body;

    try {
        const user = await User.findById(req.user._id);
        const eventOrg = await EventOrganizer.findOne({ event_org_id: user._id });
        
        if (!user) {
            return res.status(404).json({message: ["User not found"]});
        }
        
        if (!eventOrg) {
            return res.status(404).json({message: ["Event organization information not found"]});
        }
        
        if (!event_name || !event_description || !start_date || !end_date || !event_image) {
            return res.status(400).json({message: ["Please fill in all fields to create."]});
        }
        
        const createEventErrors = [];
        
        const eventNameExists = await Event.findOne({ event_name });
        
        const eventStartDate = new Date(start_date);
        const eventEndDate = new Date(end_date);

        if (eventNameExists) {
            createEventErrors.push("Event name already exists.");
        }

        if (isNaN(eventStartDate.getTime())) {
            createEventErrors.push("Invalid start date.");
        }

        if (isNaN(eventEndDate.getTime())) {
            createEventErrors.push("Invalid end date.");
        }

        if (eventStartDate.getTime() === eventEndDate.getTime()) {
            createEventErrors.push("Start date and end date cannot be the same.");
        }

        if (eventStartDate > eventEndDate) {
            createEventErrors.push("Start date cannot be after end date.");
        }

        if (eventStartDate < Date.now()) {
            createEventErrors.push("Start date cannot be in the past.");
        }

        if (createEventErrors.length > 0) {
            return res.status(400).json({ success: false, message: createEventErrors });
        }

        const EventPicture = await cloudinary.uploader.upload(event_image);

        const newEventInfo = new Event({
            eventBelongs_id: user._id,
            event_name,
            event_description,
            start_date,
            end_date,
            event_thumbnail: EventPicture.secure_url,
            eventSpecificEndUrl: uuidv4(),
        });

        eventOrg.events_list.push(newEventInfo._id);

        await newEventInfo.save();

        await eventOrg.save();

        res.status(200).json ({
            success: true,
            message: "Event created successfully",
            newEventInfo: {
                ...newEventInfo._doc,
            }
        });
    } catch (error) {
        console.log("Failed to create event organization information", error.message);
        res.status(500).json({ success: false, message: [error.message] });
    }
};

export const getSpecificEventDetails = async (req, res) => {
    try {
        const {specificEventURL} = req.params;

        if (!specificEventURL) {
            return res.status(404).json({message: ["Please provide a specific event URL"]});
        }

        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({message: ["User not found"]});
        }

        const specificEventInfo = await Event.findOne({
            eventSpecificEndUrl: specificEventURL
        })

        // Check which event organizer created this event
        const eventOrgInfo = await EventOrganizer.findOne({ event_org_id: specificEventInfo.eventBelongs_id });
        const userInfo = await User.findOne({ _id: specificEventInfo.eventBelongs_id });

        if (!eventOrgInfo) {
            return res.status(404).json({message: ["Event organization information not found"]});
        }

        if (!userInfo) {
            return res.status(404).json({message: ["User information not found"]});
        }

        if (!specificEventInfo) {
            return res.status(404).json({message: ["Event not found, please provide specific event URL"]});
        }

        const visualEventStartDate = new Date(specificEventInfo.start_date).toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

        const visualEventEndDate = new Date(specificEventInfo.end_date).toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

        res.status(200).json({
            success: true,
            message: "Specific event details retrieved successfully",
            allEventInfo: {                
                specificEventInfo,
                eventOrgInfo: {
                    orgName: eventOrgInfo.organizationName,
                    orgContact: eventOrgInfo.organizationContact,
                },
                userInfo: {
                    username: userInfo.name
                },
                visualEventStartDate,
                visualEventEndDate
            }
        });
    } catch (error) {
        console.log("Failed to retrieve event information", error.message);
        res.status(500).json({ success: false, message: [error.message] });
    }
};

export const updateEvents = async (req, res) => {
    const {newEvent_name, newEvent_description, newStart_date, newEnd_date, newEvent_image} = req.body;

    try {        
        const {specificEventURL} = req.params;

        if (!specificEventURL) {
            return res.status(404).json({message: ["Please provide a specific event URL"]});
        }

        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({message: ["User not found"]});
        }

        const specificEventValid = await Event.findOne({ 
            eventBelongs_id: user._id,
            eventSpecificEndUrl: specificEventURL,
        });

        if (!specificEventValid) {
            return res.status(404).json({message: ["Event not found, please provide specific event URL"]});
        }

        if (!newEvent_name && !newEvent_description && !newStart_date && !newEnd_date && !newEvent_image) {
            return res.status(400).json({message: ["Please fill in any of the fields to update."]});
        }

        const updateEventErrors = [];

        if (newEvent_name) {
            if (specificEventValid.event_name === newEvent_name) {
                updateEventErrors.push("Same event name, please use a different one");
            } else {
                const eventNameExists = await Event.findOne({ event_name: newEvent_name });
                if (eventNameExists) {
                    updateEventErrors.push("Event name already exists.");
                } else {
                    specificEventValid.event_name = newEvent_name;
                }
            }
        }

        if (newEvent_description) {
            if (specificEventValid.event_description === newEvent_description) {
                updateEventErrors.push("Same event description, please use a different one");
            } else {
                specificEventValid.event_description = newEvent_description;
            }
        }

        if (newStart_date && newEnd_date) {
            const updateNewEventStartDate = new Date(newStart_date);
            const updateNewEventEndDate = new Date(newEnd_date);

            if (isNaN(updateNewEventStartDate.getTime())) {
                updateEventErrors.push("Invalid start date.");
            }

            if (isNaN(updateNewEventEndDate.getTime())) {
                updateEventErrors.push("Invalid end date.");
            }

            if (specificEventValid.start_date.getTime() === updateNewEventStartDate.getTime() && specificEventValid.end_date.getTime() === updateNewEventEndDate.getTime()) {
                updateEventErrors.push("Same start and end date, please use a different one");
            }

            if (updateNewEventStartDate.getTime() === updateNewEventEndDate.getTime()) {
                updateEventErrors.push("Start date and end date cannot be the same.");
            }

            if (updateNewEventStartDate > updateNewEventEndDate) {
                updateEventErrors.push("Start date cannot be after end date.");
            }

            if (updateNewEventStartDate < Date.now()) {
                updateEventErrors.push("Start date cannot be in the past.");
            }
        }

        if (newEvent_image) {
            const newEventPicture = await cloudinary.uploader.upload(newEvent_image);
            specificEventValid.event_thumbnail = newEventPicture.secure_url;
        }

        if (updateEventErrors.length > 0) {
            return res.status(400).json({ success: false, message: updateEventErrors });
        } else {
            if (newStart_date && newEnd_date) {
                specificEventValid.start_date = newStart_date;
                specificEventValid.end_date = newEnd_date;
            }
        }

        await specificEventValid.save();

        res.status(200).json ({
            success: true,
            message: "Event updated successfully",
            updatedEventInfo: {
                ...specificEventValid._doc,
            }
        });
    } catch (error) {
        console.log("Failed to update event organization information", error.message);
        res.status(500).json({ success: false, message: [error.message] });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const {specificEventURL} = req.params;

        const user = await User.findById(req.user._id);
        const eventOrgInfo = await EventOrganizer.findOne({ event_org_id: user._id });
        
        if (!user) {
            return res.status(404).json({message: ["User not found"]});
        }
        
        if (!eventOrgInfo) {
            return res.status(404).json({message: ["Event organization information not found"]});
        }

        const specificEventValid = await Event.findOne({ 
            eventBelongs_id: user._id,
            eventSpecificEndUrl: specificEventURL,
        });

        if (!specificEventValid) {
            return res.status(404).json({message: ["Event not found, please provide specific event URL"]});
        }

        // remove the event id from the events_list array in eventOrgInfo
        eventOrgInfo.events_list = eventOrgInfo.events_list.filter(eventId => eventId.toString() !== specificEventValid._id.toString());

        // Delete the event
        await specificEventValid.deleteOne();

        await eventOrgInfo.save();

        res.status(200).json({ success: true, message: "Event deleted successfully" });
    } catch (error) {
        console.log("Failed to delete event", error.message);
        res.status(500).json({ success: false, message: [error.message] });
    }
};

export const joinEvent = async (req, res) => {
    try {
        const {specificEventURL} = req.params;
        
        const specificEventInfo = await Event.findOne({
            eventSpecificEndUrl: specificEventURL
        });

        if (!specificEventInfo) {
            return res.status(404).json({message: ["Event not found, please provide specific event URL"]});
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({message: ["User not found"]});
        }

        if (!specificEventInfo.attendees.includes(user._id)) {            
            specificEventInfo.attendees.push(user._id);
        }

        if (specificEventInfo.invited.includes(user._id)) {
            specificEventInfo.invited = specificEventInfo.invited.filter(invitedId => invitedId.toString() !== user._id.toString());
        }

        await specificEventInfo.save();

        res.status(200).json({ 
            success: true, 
            message: "Event joined successfully",
            specificEventInfo: {
                eventName: specificEventInfo.event_name,
                eventAttendees: specificEventInfo.attendees
            }
        });
    } catch (error) {
        console.log("Failed to join event", error.message);
        res.status(500).json({ success: false, message: [error.message] });
    }
};

export const inviteAttendees = async (req, res) => {
    try {
        const {specificEventURL} = req.params;
  
        const specificEventInfo = await Event.findOne({
            eventSpecificEndUrl: specificEventURL
        });

        if (!specificEventInfo) {
            return res.status(404).json({message: ["Event not found, please provide specific event URL"]});
        }

        const { invitedAttendeesID } = req.body;

        if (!invitedAttendeesID) {
            return res.status(400).json({ success: false, message: ["Please provide invited attendees"] });
        }

        if (specificEventInfo.attendees.includes(invitedAttendeesID)) {
            return res.status(400).json({ success: false, message: ["User already attended"] });
        }

        if (specificEventInfo.invited.includes(invitedAttendeesID)) {
            return res.status(400).json({ success: false, message: ["User already invited"] });
        }

        // The person that was invited information
        const designatedUserInfo = await User.findById(invitedAttendeesID);

        // Sender information
        const senderInfo = await User.findById(req.user._id);

        if (!designatedUserInfo) {
            return res.status(404).json({message: ["User not found"]});
        } 

        if (!senderInfo) {
            return res.status(404).json({message: ["Sender not found"]});
        }

        // Add user id into the invited array of the event
        specificEventInfo.invited.push(invitedAttendeesID);

        await specificEventInfo.save();

        console.log("Attendees invited list", specificEventInfo.invited);

        res.status(200).json({
            success: true,
            message: "Attendees invited successfully",
            inviteInboxRequired: {
                senderInfo: {
                    senderName: senderInfo.name,
                    senderRole: senderInfo.role,
                },
                specificEventInfo
            }
        })
    } catch (error) {
        console.log("Failed to invite attendees", error.message);
        res.status(500).json({ success: false, message: [error.message] });
    }
};

export const rejectEventInvite = async (req, res) => {
    try {
        const {specificEventURL} = req.params;
  
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({message: ["User not found"]});
        }

        const specificEventInfo = await Event.findOne({
            eventSpecificEndUrl: specificEventURL
        });

        if (!specificEventInfo) {
            return res.status(404).json({message: ["Event not found, please provide specific event URL"]});
        }

        specificEventInfo.invited = specificEventInfo.invited.filter(invitedId => invitedId.toString() !== user._id.toString());

        specificEventInfo.rejected.push(user._id);

        await specificEventInfo.save();

        res.status(200).json({
            success: true,
            message: "Event invite rejected successfully",
        })
    } catch (error) {
        console.log("Failed to reject event invite", error.message);
        res.status(500).json({ success: false, message: [error.message] });
    }
};