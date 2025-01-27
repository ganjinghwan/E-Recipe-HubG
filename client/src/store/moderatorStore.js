import { create } from "zustand";
import axios from "axios";
import { addWarning } from "../../../server/controllers/moderatorController";

export const useModeratorStore = create((set) => ({
    moderator: null,
    isLoading: false,
    error: null,
    deletedRecipes: [],
    deletedUsers: [],
    deletedEvents: [],
    passedReports: [],
    warnings: [],

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

    addDeletedEventHistory: async (historyData) => {
        try {
            const res = await fetch(`/api/moderator/add-deleted-event-history`, {
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
            console.error("Error submitting deleted event history:", error);
            return { success: false, message: "Failed to submit deleted event history." };
        }
    },


    fetchDeletedEvents: async () => {
        const res = await fetch('/api/moderator/get-deleted-event-history');
        const data = await res.json();
        set({ deletedEvents: data.data });
    },

    deleteEvent: async (evid) => {
        try {
            const res = await fetch(`/api/moderator/${evid}/delete-event`, {
                method: 'DELETE',
            });
    
            const data = await res.json();
    
            if (!data.success) {
                return { success: false, message: data.message };
            }
    
            return { success: true, message: "Event deleted successfully." };
        } catch (error) {
            console.error("Error deleting event:", error);
            return { success: false, message: "Failed to delete event." };
        }
    },

    addPassedReport: async (historyData) => {
        try {
            const res = await fetch(`/api/moderator/add-passed-report`, {
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
            console.error("Error submitting passed report:", error);
            return { success: false, message: "Failed to submit passed report." };
        }
    },

    fetchPassedReports: async () => {
        const res = await fetch('/api/moderator/get-report-history');
        const data = await res.json();
        set({ passedReports: data.data });
    },

    addWarning: async (historyData) => {
        try {
          const res = await fetch(`/api/moderator/add-warning`, {
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
      
          // Return additional data if warning threshold is exceeded
          return {
            success: true,
            warningThresholdExceeded: data.warningThresholdExceeded,
            message: data.message,
          };
        } catch (error) {
          console.error("Error submitting warning:", error);
          return { success: false, message: "Failed to submit warning." };
        }
      },
      

    fetchWarnings: async () => {
        const res = await fetch('/api/moderator/get-warning-history');
        const data = await res.json();
        set({ warnings: data.data });
    },
}));