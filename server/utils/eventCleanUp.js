import { Event } from "../models/Event.js";
import { EventOrganizer } from "../models/EventOrganizer.js";

export const eventCleanUpExpiredEvents = async () => {
    try {
        const now = new Date();
        const expiredEvents = await Event.find({ end_date: { $lt: now } });

        if (expiredEvents.length === 0) {
            console.log("No expired events found.");
            return;
        }

        const expiredEventIds = expiredEvents.map(event => event._id);

        // Find organizers with these events
        const eventOrganizers = await EventOrganizer.find({ 
            events_list: { $in: expiredEventIds } 
        });

        // Remove expired events from each organizer's events_list
        await Promise.all(eventOrganizers.map(async (organizer) => {
            organizer.events_list = organizer.events_list.filter(
                eventId => !expiredEventIds.includes(eventId.toString())
            );
            await organizer.save();
        }));

        // Delete expired events
        await Event.deleteMany({ _id: { $in: expiredEventIds } });

        console.log(`Successfully cleaned up ${expiredEvents.length} expired events.`);
    } catch (error) {
        console.error("Error cleaning up expired events:", error);
    }
};
