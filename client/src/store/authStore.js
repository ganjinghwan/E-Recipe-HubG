import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;
export const useAuthStore = create((set) => ({
    user: null,
    selectedUserId: null, // ✅ Add selectedUserId to global state
    cooks:[],
    CGEs:[],
    dailyLogins: [],
    isAuthenticated: false,
    isVerifiedRequired: false,
    isRoleInfoCreated: false,
    errors: null,
    isLoading: false,
    isCheckingAuth: true,
    isUploadingProfilePicture: false,
    message: null,

    setSelectedUserId: (id) => set({ selectedUserId: id }), // ✅ Function to update item in global state

    fetchUserInbox: async () => {
        try {
          const res = await axios.get("/api/auth/get-inbox");
          const sortedInbox = res.data.inbox.sort(
            (a, b) => new Date(b.date) - new Date(a.date) // Sort by date (latest first)
          );
          set({ userInbox: sortedInbox });
        } catch (error) {
          console.error("Failed to fetch user inbox:", error.message);
        }
      },
      

    fetchDailyLogins: async () => {
        try {
          const res = await axios.get("/api/auth/daily-logins");
          set({ dailyLogins: res.data.data });
        //   console.log("Fetched daily logins:", res.data.data);
        } catch (error) {
          console.error("Failed to fetch daily logins:", error);
        }
      },

    fetchCGE: async () => {
        try {
            const res = await axios.get("/api/auth/get-CGE-users");
            set({ CGEs: res.data.data }); 
            // console.log("Fetched CGEs:", res.data.data);
        } catch (error) {
            console.error("Failed to fetch CGEs:", error);
        }
    },
    // userCGesCount: () => get().CGEs.length,

    fetchCook: async () => {
        try {
            const res = await axios.get("/api/auth/fetch-cook");
            set({ cooks: res.data.data }); 
            console.log("Fetched cooks:", res.data.data);
        } catch (error) {
            console.error("Failed to fetch cooks:", error);
        }
    },
    
    addInbox: async (userId, senderRole, senderName, messageTitle, messageContent, additionalInformation) => {
        set({ isLoading: true, error: null })
        try {
            const response = await axios.post(`/api/auth/add-inbox-message`, { userId, senderRole, senderName, messageTitle, messageContent, additionalInformation });
            set({
                inviteUpdate: response.data,
                isLoading: false,
                error: null
            })
        } catch (error) {
            set({ isLoading: false });
            console.error("Failed to add inbox message:", error);
        }
    },

    setInboxRead: async (messageIndex) => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`/api/auth/set-inbox-read`, { messageIndex });
            set({
                isLoading: false,
                error: null
            })
        } catch (error) {
            set({ isLoading: false });
            console.error("Failed to set inbox message as read:", error);
        }
    },

    checkAcceptInviteStatus: async (eventURL) => {
        set({ error: null });
        try {
            const response = await axios.get(`/api/auth/check-inbox-accept-invite/${eventURL}`);

            if (response.data.eventUnavailable) {
                return { unavailable: true, expired: false, alreadyJoined: false };
            }

            if (response.data.eventExpired) {
                return { unavailable: false, expired: true, alreadyRejected: false };
            }

            return { unavailable: false, expired: false, alreadyJoined: response.data.alreadyJoined };
        } catch (error) {
            console.error("Failed to check accept invite status:", error);
        }
    },

    checkDeclineInviteStatus: async (eventURL) => {
        set({ error: null });
        try {
            const response = await axios.get(`/api/auth/check-inbox-decline-invite/${eventURL}`);

            if (response.data.eventUnavailable) {
                return { unavailable: true, expired: false, alreadyRejected: false };
            }

            if (response.data.eventExpired) {
                return { unavailable: false, expired: true, alreadyRejected: false };
            }

            return { unavailable: false, expired: false, alreadyRejected: response.data.alreadyRejected };
        } catch (error) {
            console.error("Failed to check decline invite status:", error);
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null, isVerifiedRequired: true });
        try {
            const response = await axios.post(`/api/auth/login`, { email, password });
            set({
                isAuthenticated: true,
                isVerifiedRequired: false,
                isRoleInfoCreated: response.data.user.isRoleInfoCreated, 
                user: response.data.user,
                error: null,
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
            const errorMessage = error.response?.data?.message || [error.message];
            throw { response: { data: { messages: errorMessage } } };
        }
    },

    signup: async (email, password, name, role) => {
        set({ isLoading: true, error: null, isVerifiedRequired: false });
        try {
            const response = await axios.post(`/api/auth/signup`, { email, password, name, role });
            set ({ user: response.data.user, isAuthenticated: false, isLoading: false, isVerifiedRequired: true });
        } catch (error) {
            set({isLoading: false });
            const errorMessage = error.response?.data?.message || [error.message];
            throw { response: { data: { messages: errorMessage } } };
        }
    },
    
	verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
		try {
            const response = await axios.post(`/api/auth/verify-email`, { code });
			set({ 
                user: response.data.user, 
                isAuthenticated: true, 
                isVerifiedRequired: false, 
                isRoleInfoCreated: response.data.user.isRoleInfoCreated,
                isLoading: false 
            });
			return response.data;
		} catch (error) {
            set({ error: error.response.data.message || "Error verifying email", isLoading: false, isVerifiedRequired: true });
			throw error;
		}
	},

    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            // console.log('Checking auth...'); // Debug log
            const response = await axios.get(`/api/auth/check-auth`, {
                withCredentials: true
            });
            // console.log('Auth response:', response); // Debug log
            set({
                user: response.data.user, 
                isAuthenticated: true, 
                isVerifiedRequired: false,
                isRoleInfoCreated: response.data.user.isRoleInfoCreated,
                isCheckingAuth: false 
            });
        } catch (error) {
            set({ 
                error: null, 
                isCheckingAuth: false, 
                isAuthenticated: false, 
                isVerifiedRequired: false, 
                isRoleInfoCreated: false 
            });
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null});
    try {
        await axios.post(`/api/auth/logout`);
        set({ 
            user: null, 
            selectedUserId: null,
            isAuthenticated: false, 
            isLoading: false, 
            isVerifiedRequired: false, 
            isRoleInfoCreated: false 
        });
    } catch (error) {
        set({ error: "Failed to logout", isLoading: false });
        throw error;
    }
    },

    forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`/api/auth/forgot-password`, { email });
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.message || "Error resetting password", isLoading: false });
            throw error;
        }
    },

    resetPassword: async (token, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`/api/auth/reset-password/${token}`, {password});
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            set({ 
                isLoading: false, 
                error: error.response.data.message || "Error resetting password",
            });
            throw error;
        }
    },

    resetState: () =>  {
        console.log("Reset state called");
        set ({ isLoading: false, error: null});
    },

    updateProfile: async (name, password, phone) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`/api/auth/update-profile`, { name, password, phone });
            set({ user: response.data.user, isLoading: false, isVerifiedRequired: true });
        } catch (error) {
            set({ isLoading: false });
            const errorMessage = error.response?.data?.message || [error.message];
            throw { response: { data: { messages: errorMessage } } };
        }
    }, 

    uploadProfilePicture: async (file) => {
        set({isUploadingProfilePicture: true, error: null});
        try {
            const response = await axios.put(`/api/auth/upload-profile-picture`, file);
            set({ user: response.data.user, isAuthenticated: true });
        } catch (error) {
            set({ error: error.response.data.message || "Error uploading profile picture", isUploadingProfilePicture: false });
            throw error;
        } finally {
            set({ isUploadingProfilePicture: false });
        }
    },

    verifyUpdate: async (code) => {
        set({ isLoading: true, error: null, isVerifiedRequired: true });
        try {
            const response = await axios.post(`/api/auth/verify-update`, {code});
            set({ 
                user: response.data.user, 
                isAuthenticated: true,
                isVerifiedRequired: false,
                isRoleInfoCreated: response.data.user.isRoleInfoCreated, 
                isLoading: false 
            });
            return response.data;
        } catch (error) {
            set({ error: error.response.data.message || "Error verifying update", isLoading: false });
            throw error;
        }
    },

    deleteAccount: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.delete(`/api/auth/delete-account`);
            set({ 
                user: null, 
                isAuthenticated: false, 
                isVerifiedRequired: false,
                isRoleInfoCreated: false,
                isLoading: false 
            });
        } catch (error) {
            set({ error: error.response.data.message || "Error deleting account", isLoading: false });
            throw error;
        }
    }
}));