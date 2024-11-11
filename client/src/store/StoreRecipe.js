import {create} from 'zustand';

export const useStoreRecipe = create((set) => ({
    recipes: [],
    setRecipes: (recipes) => set({ recipes }),
    createRecipe: async (newRecipe) =>{
        console.log("Recipe being sent:", newRecipe);
        if (
            !newRecipe.title ||
            !newRecipe.ingredients.length ||
            !newRecipe.instructions ||
            !newRecipe.prepTime ||
            !newRecipe.steps.length ||
            !newRecipe.category ||
            !newRecipe.image
        ) {
              return { success: false, message: 'All fields are required.' };
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
    }
}));