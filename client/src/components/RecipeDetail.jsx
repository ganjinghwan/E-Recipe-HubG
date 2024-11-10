// src/components/RecipeDetail.js

import React from 'react';
import { useParams } from 'react-router-dom';

const RecipeDetail = () => {
    const { id } = useParams();
    // Placeholder content for a recipe detail
    const recipe = {
        title: 'Sample Recipe',
        ingredients: 'Ingredients here...',
        instructions: 'Instructions here...',
    };

    return (
        <div>
            <h2>{recipe.title}</h2>
            <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
            <p><strong>Instructions:</strong> {recipe.instructions}</p>
        </div>
    );
};

export default RecipeDetail;
