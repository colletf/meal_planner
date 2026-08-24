class SpoonacularAPI {
    constructor() {
        this.baseUrl = CONFIG.BASE_URL;
        this.apiKey = CONFIG.API_KEY;
    }

    async request(endpoint, params = {}) {
        params.apiKey = this.apiKey;
        const queryString = new URLSearchParams(params).toString();
        const url = `${this.baseUrl}${endpoint}?${queryString}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async getRandomMeals(count = 10, filters = {}) {
        const params = {
            number: count,
            instructionsRequired: true,
            addRecipeInformation: true,
            fillIngredients: true
        };

        if (filters.cuisine) params.tags = filters.cuisine;
        if (filters.diet) params.tags = params.tags ? `${params.tags},${filters.diet}` : filters.diet;
        if (filters.type) params.tags = params.tags ? `${params.tags},${filters.type}` : filters.type;

        const data = await this.request('/recipes/random', params);
        return data.recipes || [];
    }

    async searchMeals(query, filters = {}) {
        const params = {
            query: query,
            number: CONFIG.MEALS_PER_PAGE,
            instructionsRequired: true,
            addRecipeInformation: true,
            fillIngredients: true
        };

        if (filters.cuisine) params.cuisine = filters.cuisine;
        if (filters.diet) params.diet = filters.diet;
        if (filters.type) params.type = filters.type;

        const data = await this.request('/recipes/complexSearch', params);

        if (data.results && data.results.length > 0) {
            const ids = data.results.map(r => r.id).join(',');
            const detailed = await this.request('/recipes/informationBulk', { ids: ids });
            return detailed || [];
        }
        return [];
    }

    async getMealById(id) {
        return await this.request(`/recipes/${id}/information`, {
            includeNutrition: false
        });
    }

    formatMeal(recipe) {
        return {
            id: recipe.id,
            title: recipe.title,
            image: recipe.image || 'https://via.placeholder.com/300x200?text=Pas+d%27image',
            readyInMinutes: recipe.readyInMinutes || 30,
            servings: recipe.servings || 4,
            cuisines: recipe.cuisines || [],
            diets: recipe.diets || [],
            dishTypes: recipe.dishTypes || [],
            instructions: this.formatInstructions(recipe),
            ingredients: this.formatIngredients(recipe)
        };
    }

    formatIngredients(recipe) {
        if (!recipe.extendedIngredients) return [];
        return recipe.extendedIngredients.map(ing => ({
            id: ing.id,
            name: ing.name || ing.originalName,
            amount: ing.amount,
            unit: ing.unit || '',
            aisle: ing.aisle || 'Other',
            original: ing.original
        }));
    }

    formatInstructions(recipe) {
        if (recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0) {
            const steps = recipe.analyzedInstructions[0].steps || [];
            return steps.map(s => `${s.number}. ${s.step}`).join('\n\n');
        }
        if (recipe.instructions) {
            return recipe.instructions.replace(/<[^>]*>/g, '').trim();
        }
        return 'Instructions non disponibles.';
    }

    hasDislikedIngredient(meal, dislikedIngredients) {
        if (!dislikedIngredients || dislikedIngredients.length === 0) return false;

        const dislikedLower = dislikedIngredients.map(d => d.toLowerCase());

        for (const ing of meal.ingredients) {
            const nameLower = ing.name.toLowerCase();
            const translatedLower = translateIngredient(ing.name).toLowerCase();

            for (const disliked of dislikedLower) {
                if (nameLower.includes(disliked) || translatedLower.includes(disliked) ||
                    disliked.includes(nameLower) || disliked.includes(translatedLower)) {
                    return true;
                }
            }
        }
        return false;
    }
}

const api = new SpoonacularAPI();
