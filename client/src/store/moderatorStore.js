import { create } from "zustand";
import axios from "axios";
import { deleteImproperUser } from "../../../server/controllers/moderatorController";

export const useModeratorStore = create((set) => ({
    moderator: null,
    isLoading: false,
    error: null,
    deletedRecipes: [],
    deletedUsers: [],

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

    deleteImproperUser: async (uid) => {
        try {
            const res = await fetch(`/api/moderator/${uid}/delete-improper-user`, {
                method: 'DELETE',
            });
    
            const data = await res.json();
    
            if (!data.success) {
                return { success: false, message: data.message };
            }
    
            return { success: true, message: "User deleted successfully." };
        } catch (error) {
            console.error("Error deleting user:", error);
            return { success: false, message: "Failed to delete user." };
        }
    },

    addDeletedUserHistory: async (historyData) => {
        try {
            const res = await fetch(`/api/moderator/add-deleted-user-history`, {
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
            console.error("Error submitting deleted user history:", error);
            return { success: false, message: "Failed to submit deleted user history." };
        }
    },

    fetchDeletedUsers: async () => {
        const res = await fetch('/api/moderator/get-deleted-user-history');
        const data = await res.json();
        set({ deletedUsers: data.data });
    },


}));