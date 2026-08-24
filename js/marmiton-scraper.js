/**
 * Scraper pour les recettes Marmiton via URL
 * Utilise un proxy CORS pour contourner les restrictions du navigateur
 */

const MarmitonScraper = {
    // Proxies CORS gratuits (fallback si l'un ne marche pas)
    CORS_PROXIES: [
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?',
    ],

    /**
     * Importe une recette depuis une URL Marmiton
     */
    async importFromURL(url) {
        // Vérifier que c'est bien une URL Marmiton
        if (!url.includes('marmiton.org')) {
            throw new Error('Cette URL n\'est pas une recette Marmiton');
        }

        // Essayer les différents proxies
        let html = null;
        let lastError = null;

        for (const proxy of this.CORS_PROXIES) {
            try {
                const response = await fetch(proxy + encodeURIComponent(url));
                if (response.ok) {
                    html = await response.text();
                    break;
                }
            } catch (e) {
                lastError = e;
                console.log('Proxy failed:', proxy, e.message);
            }
        }

        if (!html) {
            throw new Error('Impossible de récupérer la recette. Vérifiez votre connexion.');
        }

        return this.parseHTML(html, url);
    },

    /**
     * Parse le HTML d'une page Marmiton
     */
    parseHTML(html, sourceUrl) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const recipe = {
            id: 'marmiton_' + Date.now(),
            title: '',
            image: 'https://via.placeholder.com/300x200?text=Recette+Marmiton',
            readyInMinutes: 30,
            servings: 4,
            cuisines: ['Française'],
            diets: [],
            dishTypes: [],
            instructions: '',
            ingredients: [],
            source: 'marmiton',
            sourceUrl: sourceUrl
        };

        // Extraire le titre
        const titleEl = doc.querySelector('h1');
        if (titleEl) {
            recipe.title = titleEl.textContent.trim();
        }

        // Extraire l'image
        const imgEl = doc.querySelector('img[src*="recipe"]') || doc.querySelector('.recipe-media img');
        if (imgEl && imgEl.src) {
            recipe.image = imgEl.src;
        }

        // Extraire le nombre de personnes
        const servingsEl = doc.querySelector('[class*="servings"], [class*="yield"]');
        if (servingsEl) {
            const match = servingsEl.textContent.match(/(\d+)/);
            if (match) recipe.servings = parseInt(match[1]);
        }

        // Extraire les temps
        const timeEls = doc.querySelectorAll('[class*="time"], [class*="duration"]');
        let totalTime = 0;
        timeEls.forEach(el => {
            const text = el.textContent;
            const minMatch = text.match(/(\d+)\s*min/i);
            const hourMatch = text.match(/(\d+)\s*h/i);
            if (minMatch) totalTime += parseInt(minMatch[1]);
            if (hourMatch) totalTime += parseInt(hourMatch[1]) * 60;
        });
        if (totalTime > 0) recipe.readyInMinutes = totalTime;

        // Extraire les ingrédients
        recipe.ingredients = this.parseIngredients(doc);

        // Extraire les instructions
        recipe.instructions = this.parseInstructions(doc);

        return recipe;
    },

    /**
     * Parse les ingrédients depuis le DOM
     */
    parseIngredients(doc) {
        const ingredients = [];

        // Sélecteurs possibles pour les ingrédients Marmiton
        const selectors = [
            '.recipe-ingredients__list__item',
            '[class*="ingredient-item"]',
            '.ingredient-list li',
            '[data-ingredient]'
        ];

        let ingredientEls = [];
        for (const selector of selectors) {
            ingredientEls = doc.querySelectorAll(selector);
            if (ingredientEls.length > 0) break;
        }

        // Fallback: chercher dans le texte
        if (ingredientEls.length === 0) {
            return this.parseIngredientsFromText(doc.body.textContent);
        }

        ingredientEls.forEach((el, index) => {
            const text = el.textContent.trim();
            const parsed = this.parseIngredientText(text);
            if (parsed) {
                ingredients.push({
                    id: index,
                    ...parsed,
                    aisle: 'Other',
                    original: text
                });
            }
        });

        return ingredients;
    },

    /**
     * Parse une ligne d'ingrédient
     */
    parseIngredientText(text) {
        // Patterns pour extraire quantité, unité, nom
        const patterns = [
            /^(\d+(?:[,\.]\d+)?)\s*(kg|g|ml|cl|l)\s+(?:de\s+|d[''])?(.+)$/i,
            /^(\d+)\s*(cuillères?\s*à\s*(?:soupe|café))\s+(?:de\s+|d[''])?(.+)$/i,
            /^(\d+)\s*(pot|boîte|sachet|cube)s?\s+(?:de\s+|d[''])?(.+)$/i,
            /^(\d+)\s+(.+)$/i,
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                let unit = (match[2] || '').toLowerCase();
                let name = (match[3] || match[2] || '').toLowerCase().trim();

                // Normaliser
                if (/cuillère.*soupe/i.test(unit)) unit = 'c. à soupe';
                else if (/cuillère.*café/i.test(unit)) unit = 'c. à café';
                else if (/pot|boîte|sachet|cube/i.test(unit)) unit = '';

                return {
                    amount: parseFloat(match[1].replace(',', '.')),
                    unit: unit,
                    name: name
                };
            }
        }

        // Si pas de pattern, retourner le texte comme nom
        if (text.length > 2 && text.length < 50) {
            return { amount: 1, unit: '', name: text.toLowerCase() };
        }

        return null;
    },

    /**
     * Fallback: parse les ingrédients depuis le texte brut
     */
    parseIngredientsFromText(text) {
        // Réutiliser la logique du parser PDF
        if (typeof MarmitonParser !== 'undefined') {
            return MarmitonParser.parseIngredients(text);
        }
        return [];
    },

    /**
     * Parse les instructions depuis le DOM
     */
    parseInstructions(doc) {
        const steps = [];

        // Sélecteurs possibles pour les étapes
        const selectors = [
            '.recipe-steps__list__item',
            '[class*="step-item"]',
            '.recipe-preparation li',
            '.recipe-step'
        ];

        let stepEls = [];
        for (const selector of selectors) {
            stepEls = doc.querySelectorAll(selector);
            if (stepEls.length > 0) break;
        }

        if (stepEls.length === 0) {
            // Fallback: chercher "Étape X" dans le texte
            const text = doc.body.textContent;
            const stepRegex = /[ÉE]tape\s*(\d+)\s*[:\-]?\s*([^É]+?)(?=[ÉE]tape\s*\d|$)/gi;
            let match;
            while ((match = stepRegex.exec(text)) !== null) {
                const content = match[2].trim().replace(/\s+/g, ' ');
                if (content.length > 10) {
                    steps.push(`**Étape ${match[1]}**\n${content}`);
                }
            }
        } else {
            stepEls.forEach((el, index) => {
                const text = el.textContent.trim().replace(/\s+/g, ' ');
                if (text.length > 10) {
                    steps.push(`**Étape ${index + 1}**\n${text}`);
                }
            });
        }

        return steps.join('\n\n') || 'Instructions non disponibles.';
    }
};
