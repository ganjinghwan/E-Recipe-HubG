import { create } from "zustand";
import axios from "axios";

export const useEventStore = create((set) => ({
    isLoading: false,
    error: null,
    events: [],
    attendeesList: [],
    inviteNeeded: null,
    eventExpired: false,

    isEventExpired: async (eventId) => {
        try {
            const response = await axios.get(`/api/events/is-expired/${eventId}`);
            
            if (response.status === 200) {
                set({ eventExpired: response.data.expired }); 
                return response.data.expired;
            } else {
                set({ error: "Unable to check event expiration" });
                return false;
            }
        } catch (error) {
            set({ error: error.response?.data?.message || "Error checking event expiration" });
            return false;
        }
    },


    getAllSpecificEventOrgEvents: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get("/api/events/get-EventOrgRelated-events");
            
            if (response.status === 200) {
                set({
                    events: response.data.events,
                    error: null,
                    isLoading: false
                })
            } else {
                set({ error: response.data.message, isLoading: false });
            }
        } catch (error) {
            set({ error: error.response.data.message || "Error getting Event", isLoading: false });
            throw error;
        }
    },

    getAllEvents: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get("/api/events/get-all-events");
            
            if (response.status === 200) {
                set({
                    events: response.data.Allevents,
                    error: null,
                    isLoading: false
                })
            } else {
                set({ error: response.data.message, isLoading: false });
            }
        } catch (error) {
            set({ error: error.response.data.message || "Error getting All Event", isLoading: false });
            throw error;
        }
    },

    getEventInfo: async (specificEventURL) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`/api/events/${specificEventURL}`);
            set({
                events: response.data.allEventInfo,
                error: null,
                isLoading: false
            })
        } catch (error) {
            set({ error: error.response.data.message || "Error getting Event Information", isLoading: false });
            throw error;
        }
    },

    createNewEvent: async (event_name, event_description, start_date, end_date, event_image) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post("/api/events/new-event", { event_name, event_description, start_date, end_date, event_image });
            set({ 
                events: response.data.newEventInfo,
                error: null, 
                isLoading: false
            });
        } catch (error) {
            set({ isLoading: false });
            const errorMessage = error.response?.data?.message || [error.message];
            throw { response: { data: { messages: errorMessage } } };
        }
    },

    updateEvent: async (newEvent_name, newEvent_description, newStart_date, newEnd_date, newEvent_image, specificEventURL) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`/api/events/update-event/${specificEventURL}`, { newEvent_name, newEvent_description, newStart_date, newEnd_date, newEvent_image });
            set({
                events: response.data.updatedEventInfo,
                error: null,
                isLoading: false
            });
        } catch (error) {
            set({ isLoading: false });
            const errorMessage = error.response?.data?.message || [error.message];
            throw { response: { data: { messages: errorMessage } } };
        } 
    },

    deleteEvent: async (specificEventURL) => {
        set({ isLoading: true, error: null });
        try {
            await axios.delete(`/api/events/delete-event/${specificEventURL}`);
            set({
                events: null,
                error: null,
                isLoading: false,
            })
        } catch (error) {
            set({ error: error.response.data.message || "Error deleting account", isLoading: false });
            throw error;
        }
    },

    joinEvent: async (specificEventURL) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`/api/events/join/${specificEventURL}`);
            set({
                events: response.data.specificEventInfo,
                error: null,
                isLoading: false,
            })
        } catch (error) {
            set({ error: error.response.data.message || "Error joining event", isLoading: false });
            throw error;
        }
    },

    getInviteAttendeesList: async (specificEventURL) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`/api/events/get-event-attendeesList/${specificEventURL}`);
            set({
                attendeesList: response.data.invitableUserInfo,
                error: null,
                isLoading: false,
            })
        } catch (error) {
            set({ error: error.response.data.message || "Error getting invite attendees list", isLoading: false });
            throw error;
        }
    },

    sendInviteEventReq: async (specificEventURL, invitedAttendeesID) => {
        set({ inviteNeeded: null, error: null });
        try {
            const response = await axios.post(`/api/events/invite/${specificEventURL}`, { invitedAttendeesID });
            set({
                error: null,
                inviteNeeded: response.data.inviteInboxRequired
            });
            return response.data.inviteInboxRequired;
        } catch (error) {
            set({ error: error.response.data.message || "Error sending invite attendees request", isLoading: false });
            throw error;
        }
    },

    rejectEventInviteReq: async (specificEventURL) => {
        set({ error: null });
        try {
            await axios.post(`api/events/invite/rejectInvite/${specificEventURL}`);
            set({
                error: null,
            });
        } catch (error) {
            set({ error: error.response.data.message || "Error rejecting invite", isLoading: false });
            throw error;
        }
    }
}));