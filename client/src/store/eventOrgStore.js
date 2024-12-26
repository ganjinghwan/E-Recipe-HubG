import { create } from "zustand";
import axios from "axios";

export const useEventOrgStore = create((set) => ({
    eventOrganizer: null,
    isLoading: false,
    error: null,

    getEventOrganizerInfo: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await axios.get('/api/eventorg/get-EventOrg-information');
            set({
                eventOrganizer: response.data.eventOrganizer,
                error: null,
                isLoading: false
            })
        } catch (error) {
            set({ error: error.response.data.message || "Error getting Event Organizer info", isLoading: false });
            throw error;
        }
    },

    newEventOrganizerInfo: async (orgName, orgDescription, orgContact, orgLocation) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post('/api/eventorg/new-EventOrg-information', { orgName, orgDescription, orgContact, orgLocation });
            set({
                eventOrganizer: response.data.eventOrganizer,
                error: null,
                isLoading: false
            });
        } catch (error) {
            set({ isLoading: false });
            const errorMessage = error.response?.data?.message || [error.message];
            throw { response: { data: { messages: errorMessage } } };
        }
    },

    updateEventOrganizerInfo: async (orgName, orgDescription, orgContact, orgLocation) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post('/api/eventorg/update-EventOrg-information', { orgName, orgDescription, orgContact, orgLocation });
            set({
                eventOrganizer: response.data.eventOrganizer,
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