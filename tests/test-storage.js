/**
 * Tests du stockage local
 */

function runStorageTests() {
    // Nettoyer le localStorage avant les tests
    const originalPlan = localStorage.getItem(Storage.KEYS.PLAN);
    const originalExclusions = localStorage.getItem(Storage.KEYS.EXCLUSIONS);
    const originalFilters = localStorage.getItem(Storage.KEYS.FILTERS);

    suite('Storage - Plan hebdomadaire', () => {
        test('Retourne un plan vide par défaut', () => {
            localStorage.removeItem(Storage.KEYS.PLAN);
            const plan = Storage.getWeeklyPlan();
            assert.notNull(plan);
            assert.notNull(plan['Lundi']);
            assert.isNull(plan['Lundi'].lunch);
            assert.isNull(plan['Lundi'].dinner);
        });

        test('Contient tous les jours de la semaine', () => {
            const plan = Storage.getWeeklyPlan();
            const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
            for (const day of days) {
                assert.notNull(plan[day], `Le jour ${day} doit exister`);
            }
        });

        test('Ajoute un repas au planning', () => {
            const mockMeal = { id: 1, title: 'Test Meal', ingredients: [] };
            Storage.addMealToPlan('Lundi', 'lunch', mockMeal, 4);
            const plan = Storage.getWeeklyPlan();
            assert.notNull(plan['Lundi'].lunch);
            assert.equal(plan['Lundi'].lunch.meal.title, 'Test Meal');
            assert.equal(plan['Lundi'].lunch.servings, 4);
        });

        test('Supprime un repas du planning', () => {
            Storage.removeMealFromPlan('Lundi', 'lunch');
            const plan = Storage.getWeeklyPlan();
            assert.isNull(plan['Lundi'].lunch);
        });

        test('Efface tout le planning', () => {
            const mockMeal = { id: 1, title: 'Test', ingredients: [] };
            Storage.addMealToPlan('Mardi', 'dinner', mockMeal, 2);
            Storage.clearPlan();
            const plan = Storage.getWeeklyPlan();
            assert.isNull(plan['Mardi'].dinner);
        });
    });

    suite('Storage - Exclusions', () => {
        test('Retourne une liste vide par défaut', () => {
            localStorage.removeItem(Storage.KEYS.EXCLUSIONS);
            const exclusions = Storage.getExclusions();
            assert.deepEqual(exclusions, []);
        });

        test('Ajoute une exclusion', () => {
            localStorage.removeItem(Storage.KEYS.EXCLUSIONS);
            Storage.addExclusion('coriandre');
            const exclusions = Storage.getExclusions();
            assert.includes(exclusions, 'coriandre');
        });

        test('N\'ajoute pas de doublons', () => {
            localStorage.removeItem(Storage.KEYS.EXCLUSIONS);
            Storage.addExclusion('noix');
            Storage.addExclusion('noix');
            Storage.addExclusion('NOIX');
            const exclusions = Storage.getExclusions();
            const count = exclusions.filter(e => e === 'noix').length;
            assert.equal(count, 1);
        });

        test('Supprime une exclusion', () => {
            localStorage.removeItem(Storage.KEYS.EXCLUSIONS);
            Storage.addExclusion('gluten');
            Storage.removeExclusion('gluten');
            const exclusions = Storage.getExclusions();
            assert.notIncludes(exclusions, 'gluten');
        });

        test('Normalise en minuscules', () => {
            localStorage.removeItem(Storage.KEYS.EXCLUSIONS);
            Storage.addExclusion('CACAHUÈTES');
            const exclusions = Storage.getExclusions();
            assert.includes(exclusions, 'cacahuètes');
        });
    });

    suite('Storage - Filtres', () => {
        test('Retourne des filtres vides par défaut', () => {
            localStorage.removeItem(Storage.KEYS.FILTERS);
            const filters = Storage.getFilters();
            assert.deepEqual(filters.cuisines, []);
            assert.deepEqual(filters.diets, []);
            assert.deepEqual(filters.types, []);
        });

        test('Sauvegarde les filtres', () => {
            const testFilters = {
                cuisines: ['french', 'italian'],
                diets: ['vegetarian'],
                types: ['main course']
            };
            Storage.saveFilters(testFilters);
            const loaded = Storage.getFilters();
            assert.deepEqual(loaded.cuisines, ['french', 'italian']);
            assert.deepEqual(loaded.diets, ['vegetarian']);
        });
    });

    // Restaurer le localStorage
    suite('Storage - Nettoyage', () => {
        test('Restaure l\'état original', () => {
            if (originalPlan) localStorage.setItem(Storage.KEYS.PLAN, originalPlan);
            else localStorage.removeItem(Storage.KEYS.PLAN);
            if (originalExclusions) localStorage.setItem(Storage.KEYS.EXCLUSIONS, originalExclusions);
            else localStorage.removeItem(Storage.KEYS.EXCLUSIONS);
            if (originalFilters) localStorage.setItem(Storage.KEYS.FILTERS, originalFilters);
            else localStorage.removeItem(Storage.KEYS.FILTERS);
            assert.true(true);
        });
    });
}
