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
            })
            const data = await res.json();
            set((state) => ({ recipes: [...state.recipes, data.data] }));
            return { success: true, message: 'Recipe created successfully.' };
    },


    fetchRecipes: async () => {
        const res = await fetch("/api/recipesinfo");
        const data = await res.json();
        set({ recipes: data.data });
    },



    deleteRecipes: async (rid) => {
        const res = await fetch(`/api/recipesinfo/${rid}`, {
            method: "DELETE",
        });
        const data = await res.json();
        if(!data.success) return { success: false, message: data.message };

        set((state) => ({ recipes: state.recipes.filter((recipe) => recipe._id !== rid) }));
        return { success: true, message: 'Recipe deleted successfully.' };
    }

}));