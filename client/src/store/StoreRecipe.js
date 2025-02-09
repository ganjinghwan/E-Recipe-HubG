import {create} from 'zustand';
import { useAuthStore } from "../store/authStore";


export const useStoreRecipe = create((set) => ({
    recipes: [],
    eventRecipes: [],
    userRecipes: [],
    favoriteRecipes:[],
    recipesWithoutEvent: [],
    selectedFoodGlobal: null,
    eventRecipeCounts : {},

    setSelectedFoodGlobal: (recipe) => set({ selectedFoodGlobal: recipe }),

    // Function to reset eventRecipes
    setEventRecipes: (newRecipes) => set({ eventRecipes: newRecipes }),


    setRecipes: (recipes) => set({ recipes }),
    createRecipe: async (newRecipe) =>{
        console.log("Recipe being sent:", newRecipe);
        if (
            !newRecipe.title ||
            !newRecipe.ingredients.length ||
            !newRecipe.instructions.length ||
            !newRecipe.prepTime ||
            !newRecipe.category ||
            !newRecipe.image
        ) {
              return { success: false, message: 'All fields are required [except video-URL].' };
        }
        const res = await fetch("/api/recipesinfo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newRecipe)
            });
            const data = await res.json();

            if (!data.success) {
                return { success: false, message: data.message };
            }

            set((state) => ({ recipes: [...state.recipes, data.data] }));
            return { success: true, message: 'Recipe created successfully.' };
    },
        
    fetchRecipesWithoutEvent: async () => {
        try {
            const res = await fetch('/api/recipesinfo/withoutEvent');
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            const data = await res.json();
            set({ recipesWithoutEvent: data.data });
        } catch (error) {
            console.error("Error fetching recipes without event:", error);
        }
    },

    /* only for cook recipe fetching purpose */
    
    fetchRecipes: async () => {
        const res = await fetch("/api/recipesinfo");
        const data = await res.json();
        set({ recipes: data.data });
    },

    
    

    /* Fetch all recipes */
    fetchAllRecipes: async () => {
        const res = await fetch("/api/recipesinfo/all");
        const data = await res.json();
        set({ recipes: data.data });
    },
    // recipeCount:() => get().recipes.length,

    /* Fetch recipe by ID */
    fetchRecipeById: async (rid) => {
        try {
            const res = await fetch(`/api/recipesinfo/${rid}`);
            const data = await res.json();
    
            if (!data.success) {
                return { success: false, message: data.message };
            }
    
            // Optionally add the fetched recipe to the store if necessary
            set((state) => ({
                recipes: state.recipes.some((recipe) => recipe._id === rid)
                    ? state.recipes.map((recipe) => recipe._id === rid ? data.data : recipe)
                    : [...state.recipes, data.data],
            }));
    
            return { success: true, data: data.data };
        } catch (error) {
            console.error("Error fetching recipe by ID:", error);
            return { success: false, message: "Failed to fetch recipe." };
        }
    },

    fetchRecipesByUserId: async (user_id) => {
        try {
            const res = await fetch(`/api/recipesinfo/${user_id}/userRecipes`);
            const data = await res.json();
    
            if (!data.success) {
                return { success: false, message: data.message };
            }
    
            set({ userRecipes: data.data });
    
            return { success: true, data: data.data };
        } catch (error) {
            console.error("Error fetching recipes by user ID:", error);
            return { success: false, message: "Failed to fetch recipes." };
        }
    },
    
    fetchEventRecipes: async (event_id) => {
        try {
            if (!event_id) {
                return { success: true, data: [] }; // No event_id, return empty list
            }

            const res = await fetch(`/api/recipesinfo/${event_id}/eventRecipes`);
            const data = await res.json();

            if (!data.success) {
                return { success: false, message: data.message };
            }

            set({ eventRecipes: data.data }); // Store fetched event recipes

            return { success: true, data: data.data };
        } catch (error) {
            console.error("Error fetching event recipes:", error);
            return { success: false, message: "Failed to fetch event recipes." };
        }
    },

    fetchEventRecipeCount: async (event_id) => {
        try {
          if (!event_id) {
            return { success: true, count: 0 }; // No event_id, return count 0
          }
    
          const res = await fetch(`/api/recipesinfo/${event_id}/eventRecipeCount`);
          const data = await res.json();
    
          if (!data.success) {
            return { success: false, message: data.message };
          }
    
          // Store the count in the store
          set((state) => {
            const updatedCounts = { ...state.eventRecipeCounts, [event_id]: data.count };
            return { eventRecipeCounts: updatedCounts };
          });

          return { success: true, count: data.count };
        } catch (error) {
          console.error("Error fetching event recipe count:", error);
          return { success: false, message: "Failed to fetch event recipe count." };
        }
      },


    deleteRecipes: async (rid) => {
        const res = await fetch(`/api/recipesinfo/${rid}`, {
            method: "DELETE",
        });
        const data = await res.json();
        if(!data.success) return { success: false, message: data.message };

        set((state) => ({ recipes: state.recipes.filter((recipe) => recipe._id !== rid) }));
        return { success: true, message: 'Recipe deleted successfully.' };
    },

    updateRecipes: async (rid,updatedRecipe) => {
        const res = await fetch(`/api/recipesinfo/${rid}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedRecipe)
            })
            const data = await res.json();
            if(!data.success) return { success: false, message: data.message };
            
            set((state) => ({ recipes: state.recipes.map((recipe) => recipe._id === rid ? data.data : recipe) }));
            return { success: true, message: 'Recipe updated successfully.' };
    },

    addComment: async (rid,comment) => {
        const res = await fetch(`/api/recipesinfo/${rid}/comment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(comment)
            })
            const data = await res.json();
            if(!data.success) return { success: false, message: data.message };
            
            set((state) => ({ recipes: state.recipes.map((recipe) => recipe._id === rid ? data.data : recipe) }));
            return { success: true, message: 'Comment added successfully.' };
    },

    addReport: async (reportData) => {
        try {
            const res = await fetch(`/api/recipesinfo/report`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reportData),
            });
    
            const data = await res.json();
    
            if (!data.success) {
                return { success: false, message: data.message };
            }
    
            return { success: true, message: "Report submitted successfully." };
        } catch (error) {
            console.error("Error submitting report:", error);
            return { success: false, message: "Failed to submit report." };
        }
    },

    addReportUser: async (reportData) => {
        try {
            const res = await fetch(`/api/recipesinfo/reportUser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reportData),
            });
    
            const data = await res.json();
    
            if (!data.success) {
                return { success: false, message: data.message };
            }
    
            return { success: true, message: "Report submitted successfully." };
        } catch (error) {
            console.error("Error submitting report:", error);
            return { success: false, message: "Failed to submit report." };
        }
    },
    

    addRate: async (rid, rateData) => {
        const res = await fetch(`/api/recipesinfo/${rid}/rate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rateData),
        });
      
        const data = await res.json();
        if (!data.success) {
            return { success: false, message: data.message, previousRating: data.previousRating };
        }
      
        set((state) => ({
          recipes: state.recipes.map((recipe) =>
            recipe._id === rid ? { ...recipe, ratings: data.data.ratings } : recipe
          ),
        }));
      
        return { success: true, message: "Rating added successfully." };
      },


      fetchFavoriteRecipes: async () => {
        const { user } = useAuthStore.getState(); // Get the current user from the auth store
        let endpoint;
    
        // Determine the endpoint based on the user's role
        if (user?.role === "guest") {
            endpoint = "/api/guests/Gfavorites";
        } else if (user?.role === "cook") {
            endpoint = "/api/cooks/favorites";
        } else {
            console.error("Unknown user role or user is not authenticated");
            return { success: false, data: [] };
        }
    
        try {
            // Fetch data from the determined endpoint
            const res = await fetch(endpoint);
            const data = await res.json();
    
            if (data.success) {
                set({ favoriteRecipes: data.data });
                return data; // Explicitly return the data for external usage
            }
    
            return { success: false, data: [] }; // Fallback for failure
        } catch (error) {
            console.error("Error fetching favorite recipes:", error);
            return { success: false, data: [] }; // Fallback for network or other errors
        }
    },
    
    

    toggleFavorite: async (rid) => {
        const { user } = useAuthStore.getState(); // Get the current user from the auth store
        if (!user) {
            console.error("User not authenticated");
            return { success: false, message: "User not authenticated" };
        }

        const { role: userRole } = user; // Extract user role and ID

        console.log("RID passed to toggleFavorite:", rid);
        console.log("User Role:", userRole);

        const res = await fetch("/api/recipesinfo/togglefav", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ rid, userRole }),
        });

        const data = await res.json();

        if (data.success) {
            set((state) => ({
                favoriteRecipes: data.favouriteRecipes,
                recipes: state.recipes.map((recipe) =>
                    recipe._id === rid
                        ? { ...recipe, isFavorite: data.favouriteRecipes.includes(rid) }
                        : recipe
                ),
            }));
        }
    
        return { success: data.success, message: data.message };
    },
    
      

}));