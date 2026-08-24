const Storage = {
    KEYS: {
        PLAN: 'meal_planner_plan',
        EXCLUSIONS: 'meal_planner_exclusions',
        FILTERS: 'meal_planner_filters',
        FAVORITES: 'meal_planner_favorites',
        CUSTOM_RECIPES: 'meal_planner_custom_recipes'
    },

    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Storage save error:', e);
        }
    },

    load(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('Storage load error:', e);
            return defaultValue;
        }
    },

    getWeeklyPlan() {
        const defaultPlan = {};
        DAYS_FR.forEach(day => {
            defaultPlan[day] = { lunch: null, dinner: null };
        });
        return this.load(this.KEYS.PLAN, defaultPlan);
    },

    saveWeeklyPlan(plan) {
        this.save(this.KEYS.PLAN, plan);
    },

    addMealToPlan(day, mealType, meal, servings) {
        const plan = this.getWeeklyPlan();
        plan[day][mealType] = {
            meal: meal,
            servings: servings
        };
        this.saveWeeklyPlan(plan);
        return plan;
    },

    removeMealFromPlan(day, mealType) {
        const plan = this.getWeeklyPlan();
        plan[day][mealType] = null;
        this.saveWeeklyPlan(plan);
        return plan;
    },

    clearPlan() {
        const emptyPlan = {};
        DAYS_FR.forEach(day => {
            emptyPlan[day] = { lunch: null, dinner: null };
        });
        this.saveWeeklyPlan(emptyPlan);
        return emptyPlan;
    },

    getExclusions() {
        return this.load(this.KEYS.EXCLUSIONS, []);
    },

    saveExclusions(exclusions) {
        this.save(this.KEYS.EXCLUSIONS, exclusions);
    },

    addExclusion(ingredient) {
        const exclusions = this.getExclusions();
        const lower = ingredient.toLowerCase().trim();
        if (lower && !exclusions.includes(lower)) {
            exclusions.push(lower);
            this.saveExclusions(exclusions);
        }
        return exclusions;
    },

    removeExclusion(ingredient) {
        let exclusions = this.getExclusions();
        exclusions = exclusions.filter(e => e !== ingredient.toLowerCase());
        this.saveExclusions(exclusions);
        return exclusions;
    },

    getFilters() {
        return this.load(this.KEYS.FILTERS, {
            cuisines: [],
            diets: [],
            types: []
        });
    },

    saveFilters(filters) {
        this.save(this.KEYS.FILTERS, filters);
    },

    // Favoris
    getFavorites() {
        return this.load(this.KEYS.FAVORITES, []);
    },

    saveFavorites(favorites) {
        this.save(this.KEYS.FAVORITES, favorites);
    },

    addFavorite(meal) {
        const favorites = this.getFavorites();
        if (!favorites.find(f => f.id === meal.id)) {
            favorites.push(meal);
            this.saveFavorites(favorites);
        }
        return favorites;
    },

    removeFavorite(mealId) {
        let favorites = this.getFavorites();
        favorites = favorites.filter(f => f.id !== mealId);
        this.saveFavorites(favorites);
        return favorites;
    },

    isFavorite(mealId) {
        const favorites = this.getFavorites();
        return favorites.some(f => f.id === mealId);
    },

    // Recettes personnalisées (importées)
    getCustomRecipes() {
        return this.load(this.KEYS.CUSTOM_RECIPES, []);
    },

    saveCustomRecipes(recipes) {
        this.save(this.KEYS.CUSTOM_RECIPES, recipes);
    },

    addCustomRecipe(recipe) {
        const recipes = this.getCustomRecipes();
        recipes.push(recipe);
        this.saveCustomRecipes(recipes);
        return recipes;
    },

    removeCustomRecipe(recipeId) {
        let recipes = this.getCustomRecipes();
        recipes = recipes.filter(r => r.id !== recipeId);
        this.saveCustomRecipes(recipes);
        return recipes;
    }
};
