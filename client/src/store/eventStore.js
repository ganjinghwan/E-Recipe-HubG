import { create } from "zustand";
import axios from "axios";

export const useEventStore = create((set) => ({
    isLoading: false,
    error: null,
    events: [],

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
                console.log(response.data.events);
            } else {
                set({ error: response.data.message, isLoading: false });
            }
        } catch (error) {
            set({ error: error.response.data.message || "Error getting All Event", isLoading: false });
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
    }
}));