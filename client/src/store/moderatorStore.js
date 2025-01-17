import { create } from "zustand";
import axios from "axios";

export const useModeratorStore = create((set) => ({
    moderator: null,
    isLoading: false,
    error: null,
    deletedRecipes: [],

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
    },


    fetchDeletedRecipes: async () => {
        const res = await fetch('/api/moderator/get-deleted-recipe-history');
        const data = await res.json();
        set({ deletedRecipes: data.data });
    },

    addDeletedRecipeHistory: async (historyData) => {
        try {
            const res = await fetch(`/api/moderator/add-deleted-recipe-history`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(historyData),
            });
    
            const data = await res.json();
    
            if (!data.success) {
                return { success: false, message: data.message };
            }
    
            return { success: true };
        } catch (error) {
            console.error("Error submitting deleted recipe history:", error);
            return { success: false, message: "Failed to submit deleted recipe history." };
        }
    },


}));