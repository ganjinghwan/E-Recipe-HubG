import create from "zustand";
import axios from "axios";

export const useCookStore = create((set) => ({
    isLoading: false,
    error: null,
    cook: null,

    newInfo: async (specialty, experience) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post("api/cooks/create-cook-information", { specialty, experience });
            set({ 
                cook: response.data.cook,
                error: null, 
                isLoading: false 
            });
        } catch (error) {
            set({ error: error.response.data.message || "Error adding new info", isLoading: false });
            throw error;
        }
    },
}));