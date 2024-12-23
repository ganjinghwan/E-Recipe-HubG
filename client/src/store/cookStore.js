import { create } from "zustand";
import axios from "axios";

export const useCookStore = create((set) => ({
    isLoading: false,
    error: null,
    cook: null,

    getCookInfo: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get("api/cooks/get-cook-information");
            set({
                cook: response.data.cook,
                error: null,
                isLoading: false
            });
        } catch (error) {
            set({ error: error.response.data.message || "Error getting cook info", isLoading: false });
            throw error;
        }
    },

    updateCookInfo: async (specialty, experience) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post("api/cooks/update-cook-information", { specialty, experience });
            set({ 
                cook: response.data.cook,
                error: null, 
                isLoading: false 
            });
        } catch (error) {
            set({ isLoading: false });
            const errorMessage = error.response?.data?.message || [error.message];
            throw { response: { data: { messages: errorMessage } } };
        }
    },
}));