import { create } from "zustand";
import axios from "axios";

export const useModeratorStore = create((set) => ({
    moderator: null,
    isLoading: false,
    error: null,

    confirmModerator: async(moderatorKey) => {
        set({ isLoading: true });
        try {
            const response = await axios.post('/api/moderator/new-moderator-information', { moderatorKey });
            set({
                moderator: response.data.moderator,
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