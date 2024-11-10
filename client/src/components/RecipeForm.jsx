import React, { useState, useContext } from 'react';
import { RecipeContext } from '../context/RecipeContext';

const RecipeForm = () => {
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const { addRecipe } = useContext(RecipeContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newRecipe = { title, ingredients, instructions };
        addRecipe(newRecipe);
        console.log('New Recipe added:', newRecipe);

        // Clear form after submission
        setTitle('');
        setIngredients('');
        setInstructions('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Recipe Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
            />
            <textarea
                placeholder="Instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
            />
            <button type="submit">Save Recipe</button>
        </form>
    );
};

export default RecipeForm;
