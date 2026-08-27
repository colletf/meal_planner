console.log('=== Meal Planner v8 chargé ===');

class MealPlannerApp {
    constructor() {
        this.currentMeals = [];
        this.selectedMeal = null;
        this.filters = Storage.getFilters();

        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupModals();
        this.setupMealsTab();
        this.setupPlanTab();
        this.setupGroceriesTab();

        // Nettoyer les titres dupliqués dans les données existantes
        this.cleanupDuplicateTitles();

        // Charger les favoris par défaut (au lieu de Spoonacular)
        this.loadFavorites();

        // Vérifier si une URL a été partagée (Android Share)
        this.checkSharedURL();
    }

    cleanupDuplicateTitles() {
        const removeDuplicate = (title) => {
            if (!title) return title;

            // Méthode 1: Regex pour détecter "X X" où X est identique
            const match = title.match(/^(.+?)\s+\1$/i);
            if (match) {
                console.log('Titre dupliqué corrigé:', title, '->', match[1]);
                return match[1];
            }

            // Méthode 2: Comparaison par mots
            const words = title.split(' ');
            const len = words.length;
            if (len >= 4 && len % 2 === 0) {
                const half = len / 2;
                const firstHalf = words.slice(0, half).join(' ');
                const secondHalf = words.slice(half).join(' ');
                if (firstHalf.toLowerCase() === secondHalf.toLowerCase()) {
                    console.log('Titre dupliqué corrigé (mots):', title, '->', firstHalf);
                    return firstHalf;
                }
            }
            return title;
        };

        // Nettoyer les favoris
        let favorites = Storage.getFavorites();
        let favChanged = false;
        favorites.forEach(f => {
            const clean = removeDuplicate(f.title);
            if (clean !== f.title) { f.title = clean; favChanged = true; }
        });
        if (favChanged) Storage.saveFavorites(favorites);

        // Nettoyer les recettes custom
        let customs = Storage.getCustomRecipes();
        let custChanged = false;
        customs.forEach(c => {
            const clean = removeDuplicate(c.title);
            if (clean !== c.title) { c.title = clean; custChanged = true; }
        });
        if (custChanged) Storage.saveCustomRecipes(customs);

        // Nettoyer le planning
        let plan = Storage.getWeeklyPlan();
        let planChanged = false;
        for (const day of Object.keys(plan)) {
            for (const type of ['lunch', 'dinner']) {
                if (plan[day]?.[type]?.meal?.title) {
                    const clean = removeDuplicate(plan[day][type].meal.title);
                    if (clean !== plan[day][type].meal.title) {
                        plan[day][type].meal.title = clean;
                        planChanged = true;
                    }
                }
            }
        }
        if (planChanged) Storage.saveWeeklyPlan(plan);
    }

    loadFavorites() {
        const favorites = Storage.getFavorites();
        const customRecipes = Storage.getCustomRecipes();
        this.currentMeals = [...favorites, ...customRecipes];
        this.renderMeals(this.currentMeals);
        this.updateFilterStatus();
    }

    checkSharedURL() {
        const params = new URLSearchParams(window.location.search);
        const sharedUrl = params.get('shared_url') || params.get('url') || params.get('text');

        if (sharedUrl && sharedUrl.includes('marmiton')) {
            // Nettoyer l'URL
            const cleanUrl = this.extractMarmitonURL(sharedUrl);
            if (cleanUrl) {
                // Supprimer les paramètres de l'URL pour éviter de reimporter au refresh
                window.history.replaceState({}, '', window.location.pathname);
                // Importer la recette
                this.importFromSharedURL(cleanUrl);
            }
        }
    }

    extractMarmitonURL(text) {
        // Extraire l'URL Marmiton du texte partagé
        const urlMatch = text.match(/(https?:\/\/[^\s]*marmiton\.org[^\s]*)/i);
        return urlMatch ? urlMatch[1] : null;
    }

    async importFromSharedURL(url) {
        this.showToast('Import de la recette en cours...', '');

        try {
            const recipe = await MarmitonScraper.importFromURL(url);

            if (recipe && recipe.title) {
                Storage.addCustomRecipe(recipe);
                this.showToast(`"${recipe.title}" importée !`, 'success');

                // Proposer d'ajouter au planning
                this.currentMeals = [recipe];
                setTimeout(() => this.showAddModal(recipe.id), 500);
            } else {
                throw new Error('Recette non reconnue');
            }
        } catch (error) {
            console.error('Import error:', error);
            this.showToast('Erreur: ' + error.message, 'error');
        }
    }

    setupNavigation() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });
    }

    switchTab(tabName) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.toggle('active', tab.id === `${tabName}-tab`);
        });

        if (tabName === 'plan') this.renderWeeklyPlan();
        if (tabName === 'groceries') this.renderGroceryList();
    }

    setupModals() {
        const overlay = document.getElementById('modal-overlay');
        overlay.addEventListener('click', () => this.closeAllModals());

        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });
    }

    openModal(modalId) {
        document.getElementById('modal-overlay').classList.remove('hidden');
        const modal = document.getElementById(modalId);
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.add('active'), 10);
    }

    closeAllModals() {
        document.getElementById('modal-overlay').classList.add('hidden');
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
            setTimeout(() => modal.classList.add('hidden'), 300);
        });
    }

    formatInstructions(instructions) {
        if (!instructions) return 'Instructions non disponibles.';

        let formatted = translateInstructions(instructions);

        // Convertir **texte** en <strong>texte</strong>
        formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

        return formatted;
    }

    showToast(message, type = '') {
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    setupMealsTab() {
        document.getElementById('reload-btn').addEventListener('click', () => this.loadFavorites());
        document.getElementById('filter-btn').addEventListener('click', () => this.showFilterModal());
        document.getElementById('exclude-btn').addEventListener('click', () => this.showExcludeModal());
        document.getElementById('favorites-btn').addEventListener('click', () => this.showFavoritesModal());
        document.getElementById('import-btn').addEventListener('click', () => this.showImportModal());

        // PDF file input handler
        document.getElementById('pdf-input').addEventListener('change', (e) => this.handlePDFImport(e));

        const searchInput = document.getElementById('search-input');
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (e.target.value.trim()) {
                    this.searchMeals(e.target.value.trim());
                } else {
                    this.loadMeals(true);
                }
            }, 500);
        });
    }

    async loadMeals(reload = false) {
        if (!reload && this.currentMeals.length > 0) {
            this.renderMeals(this.currentMeals);
            return;
        }

        const mealsList = document.getElementById('meals-list');
        mealsList.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <div>Chargement des repas...</div>
            </div>
        `;

        try {
            const filters = {};
            if (this.filters.cuisines.length) filters.cuisine = this.filters.cuisines[0];
            if (this.filters.diets.length) filters.diet = this.filters.diets[0];
            if (this.filters.types.length) filters.type = this.filters.types[0];

            const recipes = await api.getRandomMeals(CONFIG.MEALS_PER_PAGE, filters);
            this.currentMeals = recipes.map(r => api.formatMeal(r));

            const exclusions = Storage.getExclusions();
            this.currentMeals = this.currentMeals.filter(m => !api.hasDislikedIngredient(m, exclusions));

            this.renderMeals(this.currentMeals);
            this.updateFilterStatus();
        } catch (error) {
            mealsList.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <div>Erreur de chargement. Vérifiez votre connexion.</div>
                </div>
            `;
        }
    }

    async searchMeals(query) {
        const mealsList = document.getElementById('meals-list');
        mealsList.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <div>Recherche en cours...</div>
            </div>
        `;

        try {
            const filters = {};
            if (this.filters.cuisines.length) filters.cuisine = this.filters.cuisines[0];
            if (this.filters.diets.length) filters.diet = this.filters.diets[0];
            if (this.filters.types.length) filters.type = this.filters.types[0];

            const recipes = await api.searchMeals(query, filters);
            this.currentMeals = recipes.map(r => api.formatMeal(r));

            const exclusions = Storage.getExclusions();
            this.currentMeals = this.currentMeals.filter(m => !api.hasDislikedIngredient(m, exclusions));

            this.renderMeals(this.currentMeals);
        } catch (error) {
            mealsList.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <div>Erreur de recherche.</div>
                </div>
            `;
        }
    }

    renderMeals(meals) {
        const mealsList = document.getElementById('meals-list');

        if (meals.length === 0) {
            mealsList.innerHTML = `
                <div class="loading">
                    <i class="fas fa-utensils" style="opacity: 0.3"></i>
                    <div>Aucun repas trouvé</div>
                </div>
            `;
            return;
        }

        mealsList.innerHTML = meals.map(meal => {
            const isFav = Storage.isFavorite(meal.id);
            return `
            <div class="meal-card" data-id="${meal.id}">
                <img class="meal-card-image" src="${meal.image}" alt="${meal.title}"
                     onerror="this.src='https://via.placeholder.com/100?text=?'">
                <div class="meal-card-content">
                    <div class="meal-card-title">${meal.title}</div>
                    <div class="meal-card-meta">
                        <span><i class="fas fa-clock"></i> ${meal.readyInMinutes} min</span>
                        <span><i class="fas fa-users"></i> ${meal.servings} pers.</span>
                    </div>
                </div>
                <div class="meal-card-actions">
                    <button class="fav-btn ${isFav ? 'active' : ''}" onclick="app.toggleFavorite('${meal.id}')" title="${isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="view-btn" onclick="app.showMealDetail('${meal.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="add-btn" onclick="app.showAddModal('${meal.id}')">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `}).join('');
    }

    toggleFavorite(mealId) {
        const meal = this.currentMeals.find(m => String(m.id) === String(mealId));
        if (!meal) return;

        const wasActive = Storage.isFavorite(mealId);

        if (wasActive) {
            Storage.removeFavorite(mealId);
            this.showToast('Retiré des favoris', '');
        } else {
            Storage.addFavorite(meal);
            this.showToast('Ajouté aux favoris !', 'success');
        }

        // Mettre à jour uniquement le bouton coeur sans recharger la liste
        const card = document.querySelector(`.meal-card[data-id="${mealId}"]`);
        if (card) {
            const favBtn = card.querySelector('.fav-btn');
            if (favBtn) {
                favBtn.classList.toggle('active', !wasActive);
                favBtn.title = wasActive ? 'Ajouter aux favoris' : 'Retirer des favoris';
            }
        }
    }

    updateFilterStatus() {
        const status = document.getElementById('filter-status');
        const parts = [];

        if (this.filters.cuisines.length) {
            const labels = this.filters.cuisines.map(c => CUISINES.find(x => x.id === c)?.label || c);
            parts.push(labels.join(', '));
        }
        if (this.filters.diets.length) {
            const labels = this.filters.diets.map(d => DIETS.find(x => x.id === d)?.label || d);
            parts.push(labels.join(', '));
        }
        if (this.filters.types.length) {
            const labels = this.filters.types.map(t => MEAL_TYPES.find(x => x.id === t)?.label || t);
            parts.push(labels.join(', '));
        }

        if (parts.length > 0) {
            status.innerHTML = `<i class="fas fa-filter"></i> ${parts.join(' • ')}`;
            status.classList.remove('hidden');
        } else {
            status.classList.add('hidden');
        }
    }

    showMealDetail(mealId) {
        const meal = this.currentMeals.find(m => String(m.id) === String(mealId));
        if (!meal) return;

        document.getElementById('meal-modal-title').textContent = meal.title;

        const body = document.getElementById('meal-modal-body');
        body.innerHTML = `
            <img class="meal-detail-image" src="${meal.image}" alt="${meal.title}"
                 onerror="this.src='https://via.placeholder.com/300x200?text=Pas+d%27image'">

            <div class="meal-detail-meta">
                <span><i class="fas fa-clock"></i> ${meal.readyInMinutes} minutes</span>
                <span><i class="fas fa-users"></i> ${meal.servings} personnes</span>
                ${meal.cuisines.length ? `<span><i class="fas fa-globe"></i> ${meal.cuisines[0]}</span>` : ''}
            </div>

            <div class="meal-detail-section">
                <h3><i class="fas fa-carrot"></i> Ingrédients</h3>
                <ul>
                    ${meal.ingredients.map(ing => {
                        const converted = convertToMetric(ing.amount || 0, ing.unit, ing.name);
                        const displayAmount = converted.amount > 0 ? (converted.amount < 10 ? converted.amount.toFixed(1) : Math.round(converted.amount)) : '';
                        return `<li>${displayAmount} ${converted.unit} ${translateIngredient(ing.name)}</li>`;
                    }).join('')}
                </ul>
            </div>

            <div class="meal-detail-section">
                <h3><i class="fas fa-list-ol"></i> Préparation</h3>
                <div class="meal-detail-instructions">${this.formatInstructions(meal.instructions)}</div>
            </div>

            <div class="meal-detail-actions">
                <button class="btn btn-success btn-block" onclick="app.addFromDetail('${meal.id}')">
                    <i class="fas fa-calendar-plus"></i> Ajouter au planning
                </button>
            </div>
        `;

        this.openModal('meal-modal');
    }

    addFromDetail(mealId) {
        this.closeAllModals();
        setTimeout(() => this.showAddModal(mealId), 350);
    }

    showAddModal(mealId) {
        const meal = this.currentMeals.find(m => m.id == mealId);
        if (!meal) return;

        this.selectedMeal = meal;
        this.selectedSlots = [];

        // Récupérer le planning actuel pour savoir quels slots sont occupés
        const currentPlan = Storage.getWeeklyPlan();

        const body = document.getElementById('add-modal-body');
        body.innerHTML = `
            <p style="margin-bottom: 16px; font-weight: 500;">${meal.title}</p>

            <h4 style="margin-bottom: 12px;">Sélectionnez les créneaux</h4>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">
                Vous pouvez sélectionner plusieurs créneaux pour ce repas
            </p>

            <div class="slots-selector" id="slots-selector">
                ${DAYS_FR.map(day => {
                    const dayPlan = currentPlan[day] || { lunch: null, dinner: null };
                    const lunchOccupied = dayPlan.lunch !== null;
                    const dinnerOccupied = dayPlan.dinner !== null;

                    return `
                    <div class="slot-day">
                        <div class="slot-day-name">${day}</div>
                        <div class="slot-day-options">
                            <button class="slot-btn ${lunchOccupied ? 'occupied' : ''}"
                                    data-day="${day}" data-type="lunch"
                                    ${lunchOccupied ? 'disabled' : ''}>
                                <i class="fas fa-sun"></i>
                                ${lunchOccupied ? '<i class="fas fa-check"></i>' : 'Déj.'}
                            </button>
                            <button class="slot-btn ${dinnerOccupied ? 'occupied' : ''}"
                                    data-day="${day}" data-type="dinner"
                                    ${dinnerOccupied ? 'disabled' : ''}>
                                <i class="fas fa-moon"></i>
                                ${dinnerOccupied ? '<i class="fas fa-check"></i>' : 'Dîner'}
                            </button>
                        </div>
                    </div>
                `}).join('')}
            </div>

            <div class="servings-selector">
                <label>Nombre de personnes</label>
                <div class="servings-control">
                    <button onclick="app.changeServings(-1)"><i class="fas fa-minus"></i></button>
                    <span id="servings-value">${CONFIG.DEFAULT_SERVINGS}</span>
                    <button onclick="app.changeServings(1)"><i class="fas fa-plus"></i></button>
                </div>
            </div>

            <button class="btn btn-success btn-block mt-16" onclick="app.confirmAddMeal()">
                <i class="fas fa-check"></i> Confirmer
            </button>
        `;

        body.querySelectorAll('.slot-btn:not(.occupied)').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('selected');
            });
        });

        this.openModal('add-modal');
    }

    changeServings(delta) {
        const el = document.getElementById('servings-value');
        let value = parseInt(el.textContent) + delta;
        value = Math.max(1, Math.min(10, value));
        el.textContent = value;
    }

    confirmAddMeal() {
        const body = document.getElementById('add-modal-body');
        const selectedSlots = body.querySelectorAll('.slot-btn.selected');
        const servings = parseInt(document.getElementById('servings-value').textContent);

        if (selectedSlots.length === 0 || !this.selectedMeal) {
            this.showToast('Sélectionnez au moins un créneau', '');
            return;
        }

        selectedSlots.forEach(slot => {
            const day = slot.dataset.day;
            const mealType = slot.dataset.type;
            Storage.addMealToPlan(day, mealType, this.selectedMeal, servings);
        });

        this.closeAllModals();
        const plural = selectedSlots.length > 1 ? 's' : '';
        this.showToast(`Repas ajouté à ${selectedSlots.length} créneau${plural} !`, 'success');
    }

    showFilterModal() {
        const body = document.getElementById('filter-modal-body');
        body.innerHTML = `
            <div class="filter-section">
                <h4>Cuisine</h4>
                <div class="filter-chips">
                    ${CUISINES.map(c => `
                        <button class="filter-chip ${this.filters.cuisines.includes(c.id) ? 'selected' : ''}"
                                data-type="cuisines" data-value="${c.id}">${c.label}</button>
                    `).join('')}
                </div>
            </div>

            <div class="filter-section">
                <h4>Régime</h4>
                <div class="filter-chips">
                    ${DIETS.map(d => `
                        <button class="filter-chip ${this.filters.diets.includes(d.id) ? 'selected' : ''}"
                                data-type="diets" data-value="${d.id}">${d.label}</button>
                    `).join('')}
                </div>
            </div>

            <div class="filter-section">
                <h4>Type de plat</h4>
                <div class="filter-chips">
                    ${MEAL_TYPES.map(t => `
                        <button class="filter-chip ${this.filters.types.includes(t.id) ? 'selected' : ''}"
                                data-type="types" data-value="${t.id}">${t.label}</button>
                    `).join('')}
                </div>
            </div>

            <div class="filter-actions">
                <button class="btn btn-danger" onclick="app.clearFilters()">
                    <i class="fas fa-times"></i> Effacer
                </button>
                <button class="btn btn-success" style="flex: 1" onclick="app.applyFilters()">
                    <i class="fas fa-check"></i> Appliquer
                </button>
            </div>
        `;

        body.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                chip.classList.toggle('selected');
            });
        });

        this.openModal('filter-modal');
    }

    applyFilters() {
        const body = document.getElementById('filter-modal-body');
        this.filters = {
            cuisines: [...body.querySelectorAll('.filter-chip[data-type="cuisines"].selected')].map(c => c.dataset.value),
            diets: [...body.querySelectorAll('.filter-chip[data-type="diets"].selected')].map(c => c.dataset.value),
            types: [...body.querySelectorAll('.filter-chip[data-type="types"].selected')].map(c => c.dataset.value)
        };
        Storage.saveFilters(this.filters);
        this.closeAllModals();
        this.loadMeals(true);
    }

    clearFilters() {
        this.filters = { cuisines: [], diets: [], types: [] };
        Storage.saveFilters(this.filters);
        this.closeAllModals();
        this.loadMeals(true);
    }

    showExcludeModal() {
        const exclusions = Storage.getExclusions();
        const body = document.getElementById('exclude-modal-body');
        body.innerHTML = `
            <div class="exclude-input-row">
                <input type="text" id="exclude-input" placeholder="Ex: coriandre, noix...">
                <button class="btn btn-success" onclick="app.addExclusion()">
                    <i class="fas fa-plus"></i>
                </button>
            </div>

            <div class="exclude-list" id="exclude-list">
                ${exclusions.length === 0 ? '<span class="exclude-empty">Aucun ingrédient exclu</span>' :
                exclusions.map(e => `
                    <span class="exclude-tag">
                        ${e}
                        <button onclick="app.removeExclusion('${e}')"><i class="fas fa-times"></i></button>
                    </span>
                `).join('')}
            </div>
        `;

        document.getElementById('exclude-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addExclusion();
        });

        this.openModal('exclude-modal');
    }

    addExclusion() {
        const input = document.getElementById('exclude-input');
        const value = input.value.trim();
        if (value) {
            Storage.addExclusion(value);
            input.value = '';
            this.showExcludeModal();
            this.loadMeals(true);
        }
    }

    removeExclusion(ingredient) {
        Storage.removeExclusion(ingredient);
        this.showExcludeModal();
        this.loadMeals(true);
    }

    // ============================================
    // FAVORIS
    // ============================================

    showFavoritesModal() {
        const favorites = Storage.getFavorites();
        const customRecipes = Storage.getCustomRecipes();
        const allFavorites = [...favorites, ...customRecipes];

        const body = document.getElementById('favorites-modal-body');

        if (allFavorites.length === 0) {
            body.innerHTML = `
                <div class="empty-favorites">
                    <i class="fas fa-heart" style="font-size: 48px; opacity: 0.3; margin-bottom: 16px;"></i>
                    <p>Aucun favori pour l'instant</p>
                    <p style="font-size: 14px; color: var(--text-muted);">
                        Cliquez sur <i class="fas fa-heart"></i> sur une recette pour l'ajouter aux favoris,
                        ou importez une recette PDF.
                    </p>
                </div>
            `;
        } else {
            body.innerHTML = `
                <div class="favorites-list">
                    ${allFavorites.map(meal => `
                        <div class="favorite-item" data-id="${meal.id}">
                            <img src="${meal.image}" alt="${meal.title}"
                                 onerror="this.src='https://via.placeholder.com/60?text=?'">
                            <div class="favorite-item-content">
                                <div class="favorite-item-title">${meal.title}</div>
                                <div class="favorite-item-meta">
                                    ${meal.source === 'marmiton' ? '<span class="badge badge-marmiton">Marmiton</span>' : ''}
                                    <span>${meal.readyInMinutes} min</span>
                                    <span>${meal.servings} pers.</span>
                                </div>
                            </div>
                            <div class="favorite-item-actions">
                                <button class="btn-icon" onclick="app.useFavorite('${meal.id}')" title="Utiliser cette recette">
                                    <i class="fas fa-plus"></i>
                                </button>
                                <button class="btn-icon btn-icon-danger" onclick="app.removeFavoriteItem('${meal.id}')" title="Supprimer">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        this.openModal('favorites-modal');
    }

    useFavorite(mealId) {
        const favorites = Storage.getFavorites();
        const customRecipes = Storage.getCustomRecipes();
        const meal = [...favorites, ...customRecipes].find(m => m.id == mealId);

        if (meal) {
            this.currentMeals = [meal];
            this.closeAllModals();
            setTimeout(() => this.showAddModal(meal.id), 350);
        }
    }

    removeFavoriteItem(mealId) {
        // Essayer de supprimer des favoris
        Storage.removeFavorite(mealId);
        // Essayer aussi des recettes custom
        Storage.removeCustomRecipe(mealId);
        this.showFavoritesModal();
        this.showToast('Recette supprimée', '');
    }

    // ============================================
    // IMPORT PDF
    // ============================================

    showImportModal() {
        const body = document.getElementById('import-modal-body');
        body.innerHTML = `
            <div class="import-tabs">
                <button class="import-tab active" data-tab="url">
                    <i class="fas fa-link"></i> Via URL
                </button>
                <button class="import-tab" data-tab="pdf">
                    <i class="fas fa-file-pdf"></i> Via PDF
                </button>
            </div>

            <div id="import-url-section" class="import-section">
                <div class="import-info">
                    <i class="fas fa-info-circle"></i>
                    <p>Collez l'URL d'une recette Marmiton :</p>
                </div>
                <input type="url" id="url-input" class="url-input" placeholder="https://www.marmiton.org/recettes/...">
                <button class="btn btn-success btn-block mt-16" onclick="app.importFromURLInput()">
                    <i class="fas fa-download"></i> Importer
                </button>
            </div>

            <div id="import-pdf-section" class="import-section hidden">
                <div class="import-info">
                    <i class="fas fa-info-circle"></i>
                    <p>Importez un PDF Marmiton :</p>
                    <ol>
                        <li>Sur Marmiton, cliquez "Imprimer"</li>
                        <li>Choisissez "Enregistrer en PDF"</li>
                        <li>Importez le PDF ici</li>
                    </ol>
                </div>
                <button class="btn btn-success btn-block" onclick="document.getElementById('pdf-input').click()">
                    <i class="fas fa-file-pdf"></i> Sélectionner un PDF
                </button>
            </div>

            <div id="import-preview" class="import-preview hidden"></div>
        `;

        // Setup tabs
        body.querySelectorAll('.import-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                body.querySelectorAll('.import-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const tabName = tab.dataset.tab;
                document.getElementById('import-url-section').classList.toggle('hidden', tabName !== 'url');
                document.getElementById('import-pdf-section').classList.toggle('hidden', tabName !== 'pdf');
            });
        });

        this.openModal('import-modal');
    }

    async importFromURLInput() {
        const input = document.getElementById('url-input');
        const url = input.value.trim();

        if (!url) {
            this.showToast('Entrez une URL Marmiton', '');
            return;
        }

        if (!url.includes('marmiton.org')) {
            this.showToast('Ce n\'est pas une URL Marmiton', '');
            return;
        }

        const preview = document.getElementById('import-preview');
        preview.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Import en cours...</span>
            </div>
        `;
        preview.classList.remove('hidden');

        try {
            const recipe = await MarmitonScraper.importFromURL(url);
            this.pendingImportRecipe = recipe;

            preview.innerHTML = `
                <h4>Recette importée :</h4>
                <div class="import-recipe-preview">
                    <strong>${recipe.title}</strong>
                    <p>${recipe.readyInMinutes} min • ${recipe.servings} personnes</p>
                    <p>${recipe.ingredients.length} ingrédients</p>
                </div>
                <div class="import-actions">
                    <button class="btn btn-success" onclick="app.confirmImport()">
                        <i class="fas fa-check"></i> Ajouter aux favoris
                    </button>
                    <button class="btn btn-danger" onclick="app.cancelImport()">
                        <i class="fas fa-times"></i> Annuler
                    </button>
                </div>
            `;
        } catch (error) {
            console.error('Import error:', error);
            preview.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Erreur: ${error.message}</p>
                </div>
            `;
        }
    }

    async handlePDFImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const preview = document.getElementById('import-preview');
        preview.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Analyse du PDF en cours...</span>
            </div>
        `;
        preview.classList.remove('hidden');

        try {
            const recipe = await MarmitonParser.parsePDF(file);
            this.pendingImportRecipe = recipe;

            preview.innerHTML = `
                <h4>Recette détectée :</h4>
                <div class="import-recipe-preview">
                    <strong>${recipe.title}</strong>
                    <p>${recipe.readyInMinutes} min • ${recipe.servings} personnes</p>
                    <p>${recipe.ingredients.length} ingrédients détectés</p>
                </div>

                <div class="import-actions">
                    <button class="btn btn-success" onclick="app.confirmImport()">
                        <i class="fas fa-check"></i> Importer
                    </button>
                    <button class="btn btn-danger" onclick="app.cancelImport()">
                        <i class="fas fa-times"></i> Annuler
                    </button>
                </div>
            `;
        } catch (error) {
            console.error('PDF parsing error:', error);
            preview.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Erreur lors de l'analyse du PDF.</p>
                    <p style="font-size: 12px;">Vérifiez que c'est bien un PDF Marmiton.</p>
                </div>
            `;
        }

        // Reset file input
        event.target.value = '';
    }

    confirmImport() {
        if (!this.pendingImportRecipe) return;

        Storage.addCustomRecipe(this.pendingImportRecipe);
        this.showToast('Recette importée !', 'success');
        this.closeAllModals();
        this.pendingImportRecipe = null;

        // Rafraîchir la liste pour afficher la nouvelle recette
        this.loadFavorites();
    }

    cancelImport() {
        this.pendingImportRecipe = null;
        document.getElementById('import-preview').classList.add('hidden');
    }

    setupPlanTab() {
        document.getElementById('clear-plan-btn').addEventListener('click', () => {
            if (confirm('Voulez-vous vraiment effacer tout le planning ?')) {
                Storage.clearPlan();
                this.renderWeeklyPlan();
                this.showToast('Planning effacé', 'success');
            }
        });
    }

    renderWeeklyPlan() {
        const plan = Storage.getWeeklyPlan();
        const container = document.getElementById('weekly-plan');

        container.innerHTML = DAYS_FR.map(day => {
            const dayPlan = plan[day] || { lunch: null, dinner: null };

            return `
                <div class="day-card">
                    <div class="day-card-header">${day}</div>

                    <div class="meal-slot">
                        <i class="meal-slot-icon lunch fas fa-sun"></i>
                        <span class="meal-slot-label">Déjeuner</span>
                        ${dayPlan.lunch ? `
                            <span class="meal-slot-content">
                                ${dayPlan.lunch.meal.title}
                                <small style="color: var(--text-muted)"> (${dayPlan.lunch.servings} pers.)</small>
                            </span>
                            <button class="meal-slot-view" onclick="app.showPlanMealDetail('${day}', 'lunch')" title="Voir la recette">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="meal-slot-delete" onclick="app.removeMeal('${day}', 'lunch')">
                                <i class="fas fa-times"></i>
                            </button>
                        ` : `<span class="meal-slot-content empty">Non planifié</span>`}
                    </div>

                    <div class="meal-slot">
                        <i class="meal-slot-icon dinner fas fa-moon"></i>
                        <span class="meal-slot-label">Dîner</span>
                        ${dayPlan.dinner ? `
                            <span class="meal-slot-content">
                                ${dayPlan.dinner.meal.title}
                                <small style="color: var(--text-muted)"> (${dayPlan.dinner.servings} pers.)</small>
                            </span>
                            <button class="meal-slot-view" onclick="app.showPlanMealDetail('${day}', 'dinner')" title="Voir la recette">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="meal-slot-delete" onclick="app.removeMeal('${day}', 'dinner')">
                                <i class="fas fa-times"></i>
                            </button>
                        ` : `<span class="meal-slot-content empty">Non planifié</span>`}
                    </div>
                </div>
            `;
        }).join('');
    }

    removeMeal(day, mealType) {
        Storage.removeMealFromPlan(day, mealType);
        this.renderWeeklyPlan();
    }

    showPlanMealDetail(day, mealType) {
        const plan = Storage.getWeeklyPlan();
        const dayPlan = plan[day];
        if (!dayPlan || !dayPlan[mealType]) return;

        const planned = dayPlan[mealType];
        const meal = planned.meal;
        const servings = planned.servings;

        document.getElementById('meal-modal-title').textContent = meal.title;

        const body = document.getElementById('meal-modal-body');
        body.innerHTML = `
            <img class="meal-detail-image" src="${meal.image}" alt="${meal.title}"
                 onerror="this.src='https://via.placeholder.com/300x200?text=Pas+d%27image'">

            <div class="meal-detail-meta">
                <span><i class="fas fa-clock"></i> ${meal.readyInMinutes} minutes</span>
                <span><i class="fas fa-users"></i> ${servings} personnes</span>
                ${meal.cuisines && meal.cuisines.length ? `<span><i class="fas fa-globe"></i> ${meal.cuisines[0]}</span>` : ''}
            </div>

            <div class="meal-detail-section">
                <h3><i class="fas fa-carrot"></i> Ingrédients (pour ${servings} pers.)</h3>
                <ul>
                    ${meal.ingredients.map(ing => {
                        const ratio = servings / (meal.servings || 4);
                        const adjustedAmount = (ing.amount || 0) * ratio;
                        const converted = convertToMetric(adjustedAmount, ing.unit, ing.name);
                        const displayAmount = converted.amount > 0 ? (converted.amount < 10 ? converted.amount.toFixed(1) : Math.round(converted.amount)) : '';
                        return `<li>${displayAmount} ${converted.unit} ${translateIngredient(ing.name)}</li>`;
                    }).join('')}
                </ul>
            </div>

            <div class="meal-detail-section">
                <h3><i class="fas fa-list-ol"></i> Préparation</h3>
                <div class="meal-detail-instructions">${this.formatInstructions(meal.instructions)}</div>
            </div>
        `;

        this.openModal('meal-modal');
    }

    setupGroceriesTab() {
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderGroceryList(btn.dataset.sort);
            });
        });

        // Store owned ingredients (ingredients already at home)
        this.ownedIngredients = new Set(Storage.load('owned_ingredients', []));
        // Store manual quantity overrides
        this.quantityOverrides = new Map(Object.entries(Storage.load('quantity_overrides', {})));
    }

    toggleOwned(ingredientId) {
        if (this.ownedIngredients.has(ingredientId)) {
            this.ownedIngredients.delete(ingredientId);
        } else {
            this.ownedIngredients.add(ingredientId);
        }
        Storage.save('owned_ingredients', Array.from(this.ownedIngredients));

        // Update UI
        const el = document.querySelector(`.grocery-item[data-id="${ingredientId}"]`);
        if (el) {
            el.classList.toggle('owned', this.ownedIngredients.has(ingredientId));
        }
    }

    showQuantityModal(index) {
        const ing = this.currentGroceryIngredients[index];
        if (!ing) return;

        const currentQty = this.quantityOverrides.get(ing.id) || ing.displayAmount || 1;

        const body = document.getElementById('add-modal-body');
        body.innerHTML = `
            <p style="margin-bottom: 16px; font-weight: 500;">Modifier la quantité</p>
            <p style="margin-bottom: 16px; color: var(--text-muted);">${ing.nameFr}</p>

            <div class="quantity-editor">
                <button class="qty-btn" onclick="app.adjustQuantityModal(-1)">
                    <i class="fas fa-minus"></i>
                </button>
                <input type="number" id="qty-input" value="${currentQty.toFixed(1)}" min="0" step="0.5">
                <span class="qty-unit">${ing.displayUnit || ''}</span>
                <button class="qty-btn" onclick="app.adjustQuantityModal(1)">
                    <i class="fas fa-plus"></i>
                </button>
            </div>

            <div style="display: flex; gap: 12px; margin-top: 20px;">
                <button class="btn btn-danger" onclick="app.closeAllModals()" style="flex: 1;">
                    Annuler
                </button>
                <button class="btn btn-success" onclick="app.saveQuantity(${index})" style="flex: 1;">
                    <i class="fas fa-check"></i> Valider
                </button>
            </div>
        `;

        document.getElementById('meal-modal-title').textContent = 'Quantité';
        this.openModal('add-modal');
    }

    adjustQuantityModal(delta) {
        const input = document.getElementById('qty-input');
        let value = parseFloat(input.value) + delta;
        value = Math.max(0, value);
        input.value = value.toFixed(1);
    }

    saveQuantity(index) {
        const ing = this.currentGroceryIngredients[index];
        if (!ing) return;

        const newQty = parseFloat(document.getElementById('qty-input').value);
        if (newQty > 0) {
            this.quantityOverrides.set(ing.id, newQty);
            ing.displayAmount = newQty;
        } else {
            this.quantityOverrides.delete(ing.id);
        }

        Storage.save('quantity_overrides', Object.fromEntries(this.quantityOverrides));
        this.closeAllModals();
        this.renderGroceryList(this.currentSortBy || 'aisle');
    }

    renderGroceryList(sortBy = 'aisle') {
        const plan = Storage.getWeeklyPlan();
        const ingredientsMap = new Map();
        const ingredientsByRecipe = new Map(); // Pour le tri par recette

        // Ingrédients à exclure de la liste de courses (mots exacts uniquement)
        const EXCLUDED_INGREDIENTS = [
            'water', 'ice', 'glaçons', 'glace',
            'tap water', 'cold water', 'hot water', 'warm water',
            'boiling water', 'ice water'
        ];

        // Fonction pour vérifier si c'est un ingrédient exclu (mot exact, pas substring)
        const isExcludedIngredient = (name) => {
            const lower = name.toLowerCase().trim();
            if (lower === 'eau') return true;
            return EXCLUDED_INGREDIENTS.some(excl => lower === excl);
        };

        // Normalisation des noms d'ingrédients pour éviter les doublons
        const normalizeIngredientKey = (name) => {
            let key = name.toLowerCase().trim();

            const normalizations = [
                [/pepper|black pepper|ground pepper|white pepper|freshly ground.*pepper|poivre.*|ground black pepper/i, 'pepper'],
                [/salt|sea salt|kosher salt|table salt|fine salt|sel.*|gros sel/i, 'salt'],
                [/olive oil|extra virgin olive oil|vegetable oil|canola oil|cooking oil|huile.*/i, 'oil'],
                [/garlic|garlic clove|garlic cloves|minced garlic|ail|gousse.*ail/i, 'garlic'],
                [/egg|eggs|large egg|large eggs|medium egg|oeuf|oeufs/i, 'egg'],
                [/flour|all-purpose flour|plain flour|farine.*/i, 'flour'],
                [/onion|onions|yellow onion|white onion|red onion|oignon.*/i, 'onion'],
                [/butter|unsalted butter|salted butter|beurre.*/i, 'butter'],
                [/sugar|white sugar|granulated sugar|sucre.*/i, 'sugar'],
                [/milk|whole milk|skim milk|lait.*/i, 'milk'],
                [/cream|heavy cream|whipping cream|sour cream|crème.*/i, 'cream'],
                [/tomato|tomatoes|cherry tomato|tomate.*/i, 'tomato'],
                [/lemon|lemon juice|lemon zest|citron(?! vert).*/i, 'lemon'],
                [/parmesan|parmigiano|parmesan cheese/i, 'parmesan'],
            ];

            for (const [pattern, normalized] of normalizations) {
                if (pattern.test(key)) {
                    return normalized;
                }
            }

            return key.replace(/s$/, '');
        };

        for (const day of DAYS_FR) {
            const dayPlan = plan[day];
            if (!dayPlan) continue;

            for (const mealType of ['lunch', 'dinner']) {
                const planned = dayPlan[mealType];
                if (!planned || !planned.meal) continue;

                const servingsRatio = planned.servings / (planned.meal.servings || 4);
                const recipeKey = `${day}_${mealType}`;
                const recipeTitle = planned.meal.title;

                if (!ingredientsByRecipe.has(recipeKey)) {
                    ingredientsByRecipe.set(recipeKey, {
                        title: recipeTitle,
                        day: day,
                        mealType: mealType,
                        ingredients: []
                    });
                }

                for (const ing of planned.meal.ingredients) {
                    if (isExcludedIngredient(ing.name)) {
                        continue;
                    }

                    const key = normalizeIngredientKey(ing.name);
                    const converted = convertToMetric((ing.amount || 1) * servingsRatio, ing.unit, ing.name);

                    // Pour tri par recette : garder les ingrédients par recette
                    ingredientsByRecipe.get(recipeKey).ingredients.push({
                        id: `${recipeKey}_${key}`,
                        name: ing.name,
                        nameFr: translateIngredient(ing.name),
                        displayAmount: converted.amount,
                        displayUnit: converted.unit,
                        category: getGroceryCategory(ing.aisle, ing.name)
                    });

                    // Pour tri agrégé
                    if (ingredientsMap.has(key)) {
                        const existing = ingredientsMap.get(key);
                        const existingConverted = convertToMetric(existing.amount, existing.unit, existing.name);

                        if (existingConverted.unit === converted.unit) {
                            existing.amount = existingConverted.amount + converted.amount;
                            existing.unit = existingConverted.unit;
                        } else {
                            existing.amount += (ing.amount || 1) * servingsRatio;
                        }
                        existing.recipes.add(recipeTitle);
                    } else {
                        ingredientsMap.set(key, {
                            id: key,
                            name: ing.name,
                            amount: (ing.amount || 1) * servingsRatio,
                            unit: ing.unit,
                            aisle: ing.aisle || 'Other',
                            recipes: new Set([recipeTitle])
                        });
                    }
                }
            }
        }

        const container = document.getElementById('grocery-list');

        // Affichage par recette
        if (sortBy === 'recipe') {
            if (ingredientsByRecipe.size === 0) {
                container.innerHTML = `
                    <div class="grocery-empty">
                        <i class="fas fa-shopping-basket"></i>
                        <div>Aucun repas planifié</div>
                        <div style="font-size: 14px; margin-top: 8px;">
                            Ajoutez des repas au planning pour générer la liste de courses
                        </div>
                    </div>
                `;
                return;
            }

            let html = '';
            let index = 0;
            const allIngredients = [];

            for (const [recipeKey, recipeData] of ingredientsByRecipe) {
                html += `<div class="grocery-category-header"><i class="fas fa-utensils"></i> ${recipeData.title}</div>`;

                for (const ing of recipeData.ingredients) {
                    const displayAmount = ing.displayAmount > 0
                        ? (ing.displayAmount < 10 ? ing.displayAmount.toFixed(1) : Math.round(ing.displayAmount))
                        : '';

                    const isOwned = this.ownedIngredients.has(ing.id);
                    allIngredients.push(ing);

                    html += `
                        <div class="grocery-item ${isOwned ? 'owned' : ''}" data-id="${ing.id}" data-index="${index}">
                            <button class="grocery-own-btn ${isOwned ? 'active' : ''}" onclick="app.toggleOwned('${ing.id}')" title="J'ai déjà">
                                <i class="fas fa-check"></i>
                            </button>
                            <div class="grocery-item-main">
                                <div class="grocery-item-name">${ing.nameFr}</div>
                                <div class="grocery-item-quantity">${displayAmount} ${ing.displayUnit}</div>
                            </div>
                            <button class="grocery-edit-btn" onclick="app.showQuantityModal(${index})" title="Modifier quantité">
                                <i class="fas fa-pen"></i>
                            </button>
                        </div>
                    `;
                    index++;
                }
            }

            container.innerHTML = html;
            this.currentGroceryIngredients = allIngredients;
            this.currentSortBy = sortBy;
            return;
        }

        // Affichage agrégé (par rayon ou nom)
        let ingredients = Array.from(ingredientsMap.values()).map(ing => {
            const converted = convertToMetric(ing.amount, ing.unit, ing.name);
            const category = getGroceryCategory(ing.aisle, ing.name);

            const overrideQty = this.quantityOverrides?.get(ing.id);
            const finalAmount = overrideQty !== undefined ? overrideQty : converted.amount;

            return {
                ...ing,
                nameFr: translateIngredient(ing.name),
                displayAmount: finalAmount,
                displayUnit: converted.unit,
                category: category,
                categoryOrder: getCategoryOrder(category)
            };
        });

        if (sortBy === 'aisle') {
            ingredients.sort((a, b) => {
                if (a.categoryOrder !== b.categoryOrder) {
                    return a.categoryOrder - b.categoryOrder;
                }
                return a.nameFr.localeCompare(b.nameFr);
            });
        } else {
            ingredients.sort((a, b) => a.nameFr.localeCompare(b.nameFr));
        }

        if (ingredients.length === 0) {
            container.innerHTML = `
                <div class="grocery-empty">
                    <i class="fas fa-shopping-basket"></i>
                    <div>Aucun repas planifié</div>
                    <div style="font-size: 14px; margin-top: 8px;">
                        Ajoutez des repas au planning pour générer la liste de courses
                    </div>
                </div>
            `;
            return;
        }

        let html = '';
        let currentCategory = '';

        for (let i = 0; i < ingredients.length; i++) {
            const ing = ingredients[i];

            if (sortBy === 'aisle' && ing.category !== currentCategory) {
                currentCategory = ing.category;
                html += `<div class="grocery-category-header"><i class="fas fa-tag"></i> ${currentCategory}</div>`;
            }

            const displayAmount = ing.displayAmount > 0
                ? (ing.displayAmount < 10 ? ing.displayAmount.toFixed(1) : Math.round(ing.displayAmount))
                : '';

            const isOwned = this.ownedIngredients.has(ing.id);

            html += `
                <div class="grocery-item ${isOwned ? 'owned' : ''}" data-id="${ing.id}" data-index="${i}">
                    <button class="grocery-own-btn ${isOwned ? 'active' : ''}" onclick="app.toggleOwned('${ing.id}')" title="J'ai déjà">
                        <i class="fas fa-check"></i>
                    </button>
                    <div class="grocery-item-main">
                        <div class="grocery-item-name">${ing.nameFr}</div>
                        <div class="grocery-item-quantity">${displayAmount} ${ing.displayUnit}</div>
                    </div>
                    <button class="grocery-edit-btn" onclick="app.showQuantityModal(${i})" title="Modifier quantité">
                        <i class="fas fa-pen"></i>
                    </button>
                </div>
            `;
        }

        container.innerHTML = html;
        this.currentGroceryIngredients = ingredients;
        this.currentSortBy = sortBy;
    }

}

const app = new MealPlannerApp();
