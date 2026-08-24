/**
 * Tests des traductions d'ingrédients
 */

function runTranslationTests() {
    suite('Traductions - Ingrédients de base', () => {
        test('Traduit "chicken" en "poulet"', () => {
            assert.equal(translateIngredient('chicken'), 'poulet');
        });

        test('Traduit "beef" en "bœuf"', () => {
            assert.equal(translateIngredient('beef'), 'bœuf');
        });

        test('Traduit "milk" en "lait"', () => {
            assert.equal(translateIngredient('milk'), 'lait');
        });

        test('Traduit "butter" en "beurre"', () => {
            assert.equal(translateIngredient('butter'), 'beurre');
        });

        test('Traduit "egg" en "œuf"', () => {
            assert.equal(translateIngredient('egg'), 'œuf');
        });

        test('Traduit "eggs" en "œufs"', () => {
            assert.equal(translateIngredient('eggs'), 'œufs');
        });

        test('Traduit "onion" en "oignon"', () => {
            assert.equal(translateIngredient('onion'), 'oignon');
        });

        test('Traduit "garlic" en "ail"', () => {
            assert.equal(translateIngredient('garlic'), 'ail');
        });
    });

    suite('Traductions - Ingrédients composés', () => {
        test('Traduit "olive oil" en "huile d\'olive"', () => {
            assert.equal(translateIngredient('olive oil'), 'huile d\'olive');
        });

        test('Traduit "chicken broth" en "bouillon de poulet"', () => {
            assert.equal(translateIngredient('chicken broth'), 'bouillon de poulet');
        });

        test('Traduit "seafood broth" en "bouillon de fruits de mer"', () => {
            assert.equal(translateIngredient('seafood broth'), 'bouillon de fruits de mer');
        });

        test('Traduit "soy sauce" en "sauce soja"', () => {
            assert.equal(translateIngredient('soy sauce'), 'sauce soja');
        });

        test('Traduit "black pepper" en "poivre noir"', () => {
            assert.equal(translateIngredient('black pepper'), 'poivre noir');
        });

        test('Traduit "old bay seasoning" en "épices Old Bay"', () => {
            assert.equal(translateIngredient('old bay seasoning'), 'épices Old Bay');
        });
    });

    suite('Traductions - Cas particuliers', () => {
        test('Gère les majuscules', () => {
            assert.equal(translateIngredient('CHICKEN'), 'poulet');
        });

        test('Gère les espaces en trop', () => {
            assert.equal(translateIngredient('  chicken  '), 'poulet');
        });

        test('Retourne le nom original si non trouvé', () => {
            const unknown = 'xyz_unknown_ingredient_123';
            assert.equal(translateIngredient(unknown), unknown);
        });

        test('Gère les valeurs null/undefined', () => {
            assert.equal(translateIngredient(null), null);
            assert.equal(translateIngredient(undefined), undefined);
        });
    });

    suite('Traductions - Fruits de mer', () => {
        test('Traduit "shrimp" en "crevettes"', () => {
            assert.equal(translateIngredient('shrimp'), 'crevettes');
        });

        test('Traduit "salmon" en "saumon"', () => {
            assert.equal(translateIngredient('salmon'), 'saumon');
        });

        test('Traduit "clams" en "palourdes"', () => {
            assert.equal(translateIngredient('clams'), 'palourdes');
        });

        test('Traduit "squid" en "calamar"', () => {
            assert.equal(translateIngredient('squid'), 'calamar');
        });
    });

    suite('Traductions - Légumes', () => {
        test('Traduit "spinach" en "épinards"', () => {
            assert.equal(translateIngredient('spinach'), 'épinards');
        });

        test('Traduit "zucchini" en "courgette"', () => {
            assert.equal(translateIngredient('zucchini'), 'courgette');
        });

        test('Traduit "eggplant" en "aubergine"', () => {
            assert.equal(translateIngredient('eggplant'), 'aubergine');
        });

        test('Traduit "brussels sprouts" en "choux de Bruxelles"', () => {
            assert.equal(translateIngredient('brussels sprouts'), 'choux de Bruxelles');
        });

        test('Traduit "leek" en "poireau"', () => {
            assert.equal(translateIngredient('leek'), 'poireau');
        });
    });

    suite('Catégories de courses', () => {
        test('Classifie le poulet en Boucherie', () => {
            assert.equal(getGroceryCategory('meat', 'chicken'), 'Boucherie');
        });

        test('Classifie le saumon en Poissonnerie', () => {
            assert.equal(getGroceryCategory('seafood', 'salmon'), 'Poissonnerie');
        });

        test('Classifie les tomates en Fruits & Légumes', () => {
            assert.equal(getGroceryCategory('produce', 'tomatoes'), 'Fruits & Légumes');
        });

        test('Classifie le lait en Crémerie', () => {
            assert.equal(getGroceryCategory('dairy', 'milk'), 'Crémerie');
        });

        test('Classifie les pâtes en Épicerie', () => {
            assert.equal(getGroceryCategory('pasta', 'penne'), 'Épicerie');
        });
    });
}
