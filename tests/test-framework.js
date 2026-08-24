/**
 * Mini framework de test pour Meal Planner
 */

const TestFramework = {
    results: [],
    currentSuite: null,

    /**
     * Définit une suite de tests
     */
    suite(name, fn) {
        this.currentSuite = { name, tests: [] };
        fn();
        this.results.push(this.currentSuite);
        this.currentSuite = null;
    },

    /**
     * Définit un test
     */
    test(name, fn) {
        const result = { name, pass: false, error: null };
        try {
            fn();
            result.pass = true;
        } catch (e) {
            result.pass = false;
            result.error = e.message;
        }
        if (this.currentSuite) {
            this.currentSuite.tests.push(result);
        }
    },

    /**
     * Assertions
     */
    assert: {
        equal(actual, expected, message = '') {
            if (actual !== expected) {
                throw new Error(`${message} Expected "${expected}", got "${actual}"`);
            }
        },

        deepEqual(actual, expected, message = '') {
            if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                throw new Error(`${message} Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
            }
        },

        true(value, message = '') {
            if (value !== true) {
                throw new Error(`${message} Expected true, got ${value}`);
            }
        },

        false(value, message = '') {
            if (value !== false) {
                throw new Error(`${message} Expected false, got ${value}`);
            }
        },

        includes(array, item, message = '') {
            if (!array.includes(item)) {
                throw new Error(`${message} Expected array to include "${item}"`);
            }
        },

        notIncludes(array, item, message = '') {
            if (array.includes(item)) {
                throw new Error(`${message} Expected array to NOT include "${item}"`);
            }
        },

        contains(string, substring, message = '') {
            if (!string.includes(substring)) {
                throw new Error(`${message} Expected "${string}" to contain "${substring}"`);
            }
        },

        notContains(string, substring, message = '') {
            if (string.includes(substring)) {
                throw new Error(`${message} Expected "${string}" to NOT contain "${substring}"`);
            }
        },

        greaterThan(actual, expected, message = '') {
            if (actual <= expected) {
                throw new Error(`${message} Expected ${actual} > ${expected}`);
            }
        },

        lessThan(actual, expected, message = '') {
            if (actual >= expected) {
                throw new Error(`${message} Expected ${actual} < ${expected}`);
            }
        },

        notNull(value, message = '') {
            if (value === null || value === undefined) {
                throw new Error(`${message} Expected value to not be null/undefined`);
            }
        },

        isNull(value, message = '') {
            if (value !== null && value !== undefined) {
                throw new Error(`${message} Expected null/undefined, got ${value}`);
            }
        }
    },

    /**
     * Affiche les résultats
     */
    render() {
        const container = document.getElementById('test-results');
        container.innerHTML = '';

        let passCount = 0;
        let failCount = 0;

        for (const suite of this.results) {
            const suiteDiv = document.createElement('div');
            suiteDiv.className = 'test-suite';
            suiteDiv.innerHTML = `<h2>${suite.name}</h2>`;

            for (const test of suite.tests) {
                if (test.pass) passCount++;
                else failCount++;

                const testDiv = document.createElement('div');
                testDiv.className = `test-result ${test.pass ? 'pass' : 'fail'}`;
                testDiv.innerHTML = `
                    <span class="icon">${test.pass ? '✓' : '✗'}</span>
                    <span class="name">${test.name}</span>
                    ${test.error ? `<span class="details">${test.error}</span>` : ''}
                `;
                suiteDiv.appendChild(testDiv);
            }

            container.appendChild(suiteDiv);
        }

        document.getElementById('pass-count').textContent = passCount;
        document.getElementById('fail-count').textContent = failCount;
    },

    /**
     * Reset les résultats
     */
    reset() {
        this.results = [];
    }
};

// Raccourcis globaux
const suite = (name, fn) => TestFramework.suite(name, fn);
const test = (name, fn) => TestFramework.test(name, fn);
const assert = TestFramework.assert;

function runAllTests() {
    TestFramework.reset();

    // Les suites de tests s'enregistrent automatiquement
    if (typeof runTranslationTests === 'function') runTranslationTests();
    if (typeof runStorageTests === 'function') runStorageTests();
    if (typeof runConversionTests === 'function') runConversionTests();
    if (typeof runOpenFoodsTests === 'function') runOpenFoodsTests();

    TestFramework.render();
}
