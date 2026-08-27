/**
 * Parser PDF pour les recettes Marmiton
 * Utilise pdf.js pour extraire le texte et parser le format Marmiton
 */

const MarmitonParser = {
    /**
     * Parse un fichier PDF Marmiton et retourne un objet recette
     */
    async parsePDF(file) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = '';
        let imageDataUrl = null;

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + ' ';

            // Rendre la première page en image
            if (i === 1 && !imageDataUrl) {
                imageDataUrl = await this.renderPageAsImage(page);
            }
        }

        const recipe = this.parseMarmitonText(fullText);
        if (imageDataUrl) {
            recipe.image = imageDataUrl;
        }
        return recipe;
    },

    /**
     * Rend la première page du PDF en image (capture d'écran de la page)
     */
    async renderPageAsImage(page) {
        try {
            const scale = 1.0; // Réduire pour économiser de l'espace
            const viewport = page.getViewport({ scale });

            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');

            await page.render({
                canvasContext: ctx,
                viewport: viewport
            }).promise;

            // Extraire seulement la partie supérieure (image du plat)
            const cropHeight = Math.min(viewport.height * 0.4, 300);
            const cropCanvas = document.createElement('canvas');
            cropCanvas.width = viewport.width;
            cropCanvas.height = cropHeight;
            const cropCtx = cropCanvas.getContext('2d');

            cropCtx.drawImage(canvas, 0, 0, viewport.width, cropHeight, 0, 0, viewport.width, cropHeight);

            const dataUrl = cropCanvas.toDataURL('image/jpeg', 0.7);
            console.log('Image extraite du PDF, taille:', Math.round(dataUrl.length / 1024), 'KB');
            return dataUrl;
        } catch (e) {
            console.error('Erreur extraction image PDF:', e);
        }
        return null;
    },

    /**
     * Parse le texte extrait d'un PDF Marmiton
     */
    parseMarmitonText(text) {
        const recipe = {
            id: 'custom_' + Date.now(),
            title: '',
            image: 'https://via.placeholder.com/300x200?text=Recette+Marmiton',
            readyInMinutes: 30,
            servings: 4,
            cuisines: ['Française'],
            diets: [],
            dishTypes: [],
            instructions: '',
            ingredients: [],
            source: 'marmiton'
        };

        // 1. Extraire le titre - chercher après le dernier ">"
        const titleMatch = text.match(/>\s*([A-ZÀ-Ÿ][A-Za-zÀ-ÿ\s'''-]{5,60}?)(?:\s+i\s+|\s+\d+\/\d+)/);
        if (titleMatch) {
            let title = titleMatch[1].trim();
            // Nettoyer les titres dupliqués (ex: "Blanquette de veau Blanquette de veau")
            title = this.removeDuplicateTitle(title);
            recipe.title = title;
        }

        // 2. Extraire le nombre de personnes
        const servingsMatch = text.match(/(\d+)\s*personnes?\s*\+/i);
        if (servingsMatch) {
            recipe.servings = parseInt(servingsMatch[1]);
        }

        // 3. Extraire les temps
        const prepMatch = text.match(/Préparation\s*:?\s*(\d+)\s*min/i);
        const cookMatch = text.match(/Cuisson\s*:?\s*(\d+)\s*(min|h)/i);
        if (prepMatch) recipe.readyInMinutes = parseInt(prepMatch[1]);
        if (cookMatch) {
            recipe.readyInMinutes += cookMatch[2] === 'h' ? parseInt(cookMatch[1]) * 60 : parseInt(cookMatch[1]);
        }

        // 4. Extraire les ingrédients
        recipe.ingredients = this.parseIngredients(text);

        // 5. Extraire les instructions
        recipe.instructions = this.parseInstructions(text);

        return recipe;
    },

    /**
     * Parse les ingrédients - recherche très flexible
     */
    parseIngredients(text) {
        const ingredients = [];
        const seen = new Set();

        // Liste des patterns à chercher
        const patterns = [
            // "1 kg de blanquette de veau" - unité métrique + de + nom
            /(\d+(?:[,\.]\d+)?)\s*(kg|g|ml|cl|l)\s+de\s+([a-zA-ZÀ-ÿœ][a-zA-ZÀ-ÿœ\s'''-]{2,35})/gi,
            // "10 g de beurre doux" - même pattern
            /(\d+(?:[,\.]\d+)?)\s*(kg|g|ml|cl|l)\s+de\s+([a-zA-ZÀ-ÿœ][a-zA-ZÀ-ÿœ\s'''-]{2,35})/gi,
            // "25 cl de vin blanc"
            /(\d+)\s*(cl|ml|l)\s+de\s+([a-zA-ZÀ-ÿœ][a-zA-ZÀ-ÿœ\s'''-]{2,25})/gi,
            // "2 cuillères à soupe de farine"
            /(\d+)\s*cuillères?\s*à\s*(soupe|café)\s+de\s+([a-zA-ZÀ-ÿœ][a-zA-ZÀ-ÿœ\s'''-]{2,25})/gi,
            // "1 cube de bouillon"
            /(\d+)\s*(cube|pot|boîte|sachet)s?\s+de\s+([a-zA-ZÀ-ÿœ][a-zA-ZÀ-ÿœ\s'''-]{2,30})/gi,
            // "2 carottes", "1 oignon jaune" - nombre + nom simple
            /(\d+)\s+(oignons?|carottes?|tomates?|pommes?|oeufs?|jaunes?\s+d['']oeuf|gousses?\s+d['']ail|citrons?|oranges?)(?:\s+[a-zA-ZÀ-ÿ]+)?/gi,
        ];

        // Mots à exclure
        const excluded = new Set([
            'personnes', 'minutes', 'heures', 'étape', 'étapes',
            'min', 'recette', 'recettes', 'avis', 'cookeo'
        ]);

        for (const pattern of patterns) {
            pattern.lastIndex = 0;
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const amount = parseFloat(match[1].replace(',', '.'));
                let unit = (match[2] || '').toLowerCase();
                let name = (match[3] || '').toLowerCase().trim();

                // Si pas de groupe 3, le groupe 2 est le nom (pattern simple)
                if (!match[3] && match[2]) {
                    name = match[2].toLowerCase().trim();
                    unit = ''; // Pas d'unité pour les patterns simples
                }

                // Nettoyer le nom
                name = name.replace(/\s+/g, ' ').trim();

                // Tronquer si trop long
                if (name.length > 30) {
                    name = name.split(' ').slice(0, 3).join(' ');
                }

                // Vérifications
                if (name.length < 2) continue;
                if (excluded.has(name)) continue;
                if (seen.has(name)) continue;
                // Éviter les ingrédients mal parsés avec "sel" dedans
                if (name.includes('sel et') && name.length > 15) continue;

                seen.add(name);

                // Normaliser l'unité
                if (unit === 'soupe') unit = 'c. à soupe';
                else if (unit === 'café') unit = 'c. à café';
                else if (['cube', 'pot', 'boîte', 'sachet'].includes(unit)) unit = '';
                // Si l'unité ressemble à un ingrédient, c'est une erreur
                else if (/oignon|carotte|tomate|jaune|oeuf/i.test(unit)) unit = '';

                ingredients.push({
                    id: ingredients.length,
                    name: name,
                    amount: amount,
                    unit: unit,
                    aisle: 'Other',
                    original: match[0].trim()
                });
            }
        }

        // Cas spécial: "sel et poivre"
        if (/sel\s+(et|&)\s+poivre/i.test(text) && !seen.has('sel et poivre')) {
            ingredients.push({
                id: ingredients.length,
                name: 'sel et poivre',
                amount: 1,
                unit: '',
                aisle: 'Other',
                original: 'sel et poivre'
            });
        }

        return ingredients;
    },

    /**
     * Parse les instructions
     */
    parseInstructions(text) {
        // Chercher le pattern "ÉTAPE X" suivi de texte
        const steps = [];

        // Regex pour trouver chaque étape - ÉTAPE ou Étape suivi d'un numéro
        // Capture tout jusqu'à la prochaine ÉTAPE ou fin de section
        const stepRegex = /[ÉE][Tt][Aa][Pp][Ee]\s*(\d+)\s*([\s\S]*?)(?=[ÉE][Tt][Aa][Pp][Ee]\s*\d|Marmiton|Note de l'auteur|La recette en bref|Vous aimerez|$)/gi;

        let match;
        const seenSteps = new Set();

        while ((match = stepRegex.exec(text)) !== null) {
            const stepNum = match[1];
            let content = match[2].trim();

            // Éviter les doublons
            if (seenSteps.has(stepNum)) continue;
            seenSteps.add(stepNum);

            // Nettoyer le contenu
            content = content
                .replace(/\s+/g, ' ')
                .replace(/stoppez avant l['']étape \d+\.?/gi, '')
                .replace(/avant l['']étape \d+\.?/gi, '')
                .trim();

            // Supprimer le junk de fin
            content = content
                .replace(/Marmiton.*$/i, '')
                .replace(/Voir toutes.*$/i, '')
                .replace(/Note de l'auteur.*$/i, '')
                .trim();

            if (content.length > 10) {
                steps.push({ num: parseInt(stepNum), content });
            }
        }

        // Trier par numéro d'étape
        steps.sort((a, b) => a.num - b.num);

        // Formater
        const instructions = steps.map(s => `**Étape ${s.num}**\n${s.content}`).join('\n\n');

        return instructions || 'Instructions non disponibles.';
    },

    /**
     * Supprime les titres dupliqués (ex: "Blanquette de veau Blanquette de veau" -> "Blanquette de veau")
     */
    removeDuplicateTitle(title) {
        const words = title.split(' ');
        const len = words.length;

        // Vérifier si la deuxième moitié est identique à la première
        if (len >= 4 && len % 2 === 0) {
            const half = len / 2;
            const firstHalf = words.slice(0, half).join(' ');
            const secondHalf = words.slice(half).join(' ');
            if (firstHalf.toLowerCase() === secondHalf.toLowerCase()) {
                return firstHalf;
            }
        }

        // Vérifier pour des répétitions partielles
        for (let i = 2; i <= Math.floor(len / 2); i++) {
            const firstPart = words.slice(0, i).join(' ');
            const secondPart = words.slice(i, i * 2).join(' ');
            if (firstPart.toLowerCase() === secondPart.toLowerCase()) {
                return firstPart;
            }
        }

        return title;
    }
};
