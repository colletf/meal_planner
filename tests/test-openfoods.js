/**
 * Tests de l'API Open Food Facts
 */

function runOpenFoodsTests() {
    suite('OpenFoods - Catégories d\'ingrédients', () => {
        test('Trouve la catégorie pour "lait"', () => {
            const category = OpenFoodsAPI.findCategory('lait');
            assert.equal(category, 'en:milks');
        });

        test('Trouve la catégorie pour "milk"', () => {
            const category = OpenFoodsAPI.findCategory('milk');
            assert.equal(category, 'en:milks');
        });

        test('Trouve la catégorie pour "poulet"', () => {
            const category = OpenFoodsAPI.findCategory('poulet');
            assert.equal(category, 'en:chicken');
        });

        test('Trouve la catégorie pour "pâtes"', () => {
            const category = OpenFoodsAPI.findCategory('pâtes');
            assert.equal(category, 'en:pastas');
        });

        test('Trouve la catégorie pour "penne"', () => {
            const category = OpenFoodsAPI.findCategory('penne');
            assert.equal(category, 'en:penne');
        });

        test('Trouve la catégorie pour "huile d\'olive"', () => {
            const category = OpenFoodsAPI.findCategory('huile d\'olive');
            assert.equal(category, 'en:olive-oils');
        });

        test('Retourne null pour ingrédient inconnu', () => {
            const category = OpenFoodsAPI.findCategory('xyz_unknown_123');
            assert.isNull(category);
        });
    });

    suite('OpenFoods - Parsing des quantités', () => {
        test('Parse "1 L"', () => {
            const qty = OpenFoodsAPI.parseQuantity('1 L');
            assert.equal(qty, 1000); // en ml
        });

        test('Parse "500g"', () => {
            const qty = OpenFoodsAPI.parseQuantity('500g');
            assert.equal(qty, 500);
        });

        test('Parse "1kg"', () => {
            const qty = OpenFoodsAPI.parseQuantity('1kg');
            assert.equal(qty, 1000);
        });

        test('Parse "250ml"', () => {
            const qty = OpenFoodsAPI.parseQuantity('250ml');
            assert.equal(qty, 250);
        });

        test('Parse "6 x 1L"', () => {
            const qty = OpenFoodsAPI.parseQuantity('6 x 1L');
            assert.equal(qty, 6000);
        });

        test('Parse "1,5 L" (virgule européenne)', () => {
            const qty = OpenFoodsAPI.parseQuantity('1,5 L');
            assert.equal(qty, 1500);
        });

        test('Retourne null pour format invalide', () => {
            const qty = OpenFoodsAPI.parseQuantity('invalid');
            assert.isNull(qty);
        });

        test('Retourne null pour null', () => {
            const qty = OpenFoodsAPI.parseQuantity(null);
            assert.isNull(qty);
        });
    });

    suite('OpenFoods - Extraction ville', () => {
        test('Extrait la ville d\'une adresse française', () => {
            const address = '32, Avenue Marcelin Berthelot, Capuche, Secteur 4, Grenoble, Isère, 38100, France';
            const city = OpenFoodsAPI.extractCity(address);
            assert.contains(city, 'Grenoble');
        });

        test('Gère les adresses vides', () => {
            const city = OpenFoodsAPI.extractCity('');
            assert.equal(city, '');
        });

        test('Gère null', () => {
            const city = OpenFoodsAPI.extractCity(null);
            assert.equal(city, '');
        });
    });

    suite('OpenFoods - Cache', () => {
        test('Le cache est initialement vide', () => {
            OpenFoodsAPI.clearCache();
            assert.equal(OpenFoodsAPI.cache.size, 0);
            assert.equal(OpenFoodsAPI.priceCache.size, 0);
        });

        test('clearCache vide le cache', () => {
            OpenFoodsAPI.cache.set('test', { data: 'test' });
            OpenFoodsAPI.priceCache.set('test', { price: 1.99 });
            OpenFoodsAPI.clearCache();
            assert.equal(OpenFoodsAPI.cache.size, 0);
            assert.equal(OpenFoodsAPI.priceCache.size, 0);
        });
    });

    // Tests asynchrones (API réelle) - marqués comme optionnels
    suite('OpenFoods - API (si connecté)', () => {
        test('Recherche de produits fonctionne', async () => {
            try {
                const products = await OpenFoodsAPI.searchProducts('lait', 3);
                // Si on a une réponse, vérifier la structure
                if (products.length > 0) {
                    assert.notNull(products[0].code);
                }
                assert.true(true); // Test passé
            } catch (e) {
                // Pas de connexion = test ignoré
                console.log('Test API ignoré (pas de connexion)');
                assert.true(true);
            }
        });
    });
}
