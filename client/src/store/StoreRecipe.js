import {create} from 'zustand';

export const useStoreRecipe = create((set) => ({
    recipes: [],
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
            set((state) => ({ recipes: [...state.recipes, data.data] }));
            return { success: true, message: 'Recipe created successfully.' };
    },


    fetchRecipes: async () => {
        const res = await fetch("/api/recipesinfo");
        const data = await res.json();
        set({ recipes: data.data });
    },

    fetchAllRecipes: async () => {
        const res = await fetch("/api/recipesinfo/all");
        const data = await res.json();
        set({ recipes: data.data });
    },

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

    addRate: async (rid, rateData) => {
        const res = await fetch(`/api/recipesinfo/${rid}/rate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rateData),
        });
      
        const data = await res.json();
        if (!data.success) return { success: false, message: data.message };
      
        set((state) => ({
          recipes: state.recipes.map((recipe) =>
            recipe._id === rid ? { ...recipe, ratings: data.data.ratings } : recipe
          ),
        }));
      
        return { success: true, message: "Rating added successfully." };
      },
      

}));