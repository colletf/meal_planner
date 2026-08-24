/**
 * Tests des conversions d'unités
 */

function runConversionTests() {
    suite('Conversions - Unités de volume', () => {
        test('Convertit tablespoon en c. à soupe', () => {
            const result = convertToMetric(2, 'tablespoon', 'oil');
            assert.equal(result.unit, 'c. à soupe');
            assert.equal(result.amount, 2);
        });

        test('Convertit teaspoon en c. à café', () => {
            const result = convertToMetric(1, 'teaspoon', 'salt');
            assert.equal(result.unit, 'c. à café');
            assert.equal(result.amount, 1);
        });

        test('Convertit tbsp en c. à soupe', () => {
            const result = convertToMetric(3, 'tbsp', 'vinegar');
            assert.equal(result.unit, 'c. à soupe');
        });

        test('Convertit tsp en c. à café', () => {
            const result = convertToMetric(2, 'tsp', 'sugar');
            assert.equal(result.unit, 'c. à café');
        });
    });

    suite('Conversions - Unités de masse', () => {
        test('Convertit ounce en grammes', () => {
            const result = convertToMetric(4, 'ounce', 'cheese');
            assert.equal(result.unit, 'g');
            assert.equal(result.amount, 112); // 4 * 28
        });

        test('Convertit pound en grammes', () => {
            const result = convertToMetric(1, 'pound', 'beef');
            assert.equal(result.unit, 'g');
            assert.equal(result.amount, 454);
        });

        test('Convertit lb en grammes', () => {
            const result = convertToMetric(2, 'lb', 'chicken');
            assert.equal(result.unit, 'g');
            assert.equal(result.amount, 908);
        });

        test('Garde les grammes tels quels', () => {
            const result = convertToMetric(500, 'g', 'flour');
            assert.equal(result.unit, 'g');
            assert.equal(result.amount, 500);
        });

        test('Garde les kg tels quels', () => {
            const result = convertToMetric(1.5, 'kg', 'potatoes');
            assert.equal(result.unit, 'kg');
            assert.equal(result.amount, 1.5);
        });
    });

    suite('Conversions - Cups (solides vs liquides)', () => {
        test('Convertit cup de lait en ml', () => {
            const result = convertToMetric(1, 'cup', 'milk');
            assert.equal(result.unit, 'ml');
            assert.equal(result.amount, 240);
        });

        test('Convertit cup de farine en g (solide)', () => {
            const result = convertToMetric(1, 'cup', 'flour');
            assert.equal(result.unit, 'g');
            assert.equal(result.amount, 150);
        });

        test('Convertit cup de riz en g (solide)', () => {
            const result = convertToMetric(1, 'cup', 'rice');
            assert.equal(result.unit, 'g');
            assert.equal(result.amount, 150);
        });

        test('Convertit cup de poulet en g (solide)', () => {
            const result = convertToMetric(1, 'cup', 'chicken');
            assert.equal(result.unit, 'g');
            assert.equal(result.amount, 150);
        });
    });

    suite('Conversions - Unités comptables', () => {
        test('Convertit slices en nombre sans unité', () => {
            const result = convertToMetric(4, 'slices', 'bread');
            assert.equal(result.unit, '');
            assert.equal(result.amount, 4);
        });

        test('Convertit cloves en nombre sans unité', () => {
            const result = convertToMetric(3, 'cloves', 'garlic');
            assert.equal(result.unit, '');
            assert.equal(result.amount, 3);
        });

        test('Convertit pieces en nombre sans unité', () => {
            const result = convertToMetric(2, 'pieces', 'chicken');
            assert.equal(result.unit, '');
            assert.equal(result.amount, 2);
        });
    });

    suite('Conversions - Cas spéciaux', () => {
        test('Ignore pinch (pincée)', () => {
            const result = convertToMetric(1, 'pinch', 'salt');
            assert.equal(result.amount, 0);
        });

        test('Ignore dash', () => {
            const result = convertToMetric(1, 'dash', 'pepper');
            assert.equal(result.amount, 0);
        });

        test('Gère les unités vides', () => {
            const result = convertToMetric(2, '', 'eggs');
            assert.equal(result.amount, 2);
            assert.equal(result.unit, '');
        });

        test('Arrondit les nombres pour unités comptables', () => {
            const result = convertToMetric(2.7, 'pieces', 'tomato');
            assert.equal(result.amount, 3);
        });
    });

    suite('Conversions - Solides ne doivent pas avoir ml', () => {
        test('Le poulet ne doit pas être en ml', () => {
            const result = convertToMetric(100, 'ml', 'chicken');
            assert.equal(result.unit, 'g');
        });

        test('Le fromage ne doit pas être en ml', () => {
            const result = convertToMetric(50, 'ml', 'cheese');
            assert.equal(result.unit, 'g');
        });

        test('Les épinards ne doivent pas être en ml', () => {
            const result = convertToMetric(200, 'ml', 'spinach');
            assert.equal(result.unit, 'g');
        });

        test('Le lait peut être en ml (liquide)', () => {
            const result = convertToMetric(200, 'ml', 'milk');
            assert.equal(result.unit, 'ml');
        });
    });
}
