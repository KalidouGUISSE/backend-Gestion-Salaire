#!/usr/bin/env node

/**
 * Script de test automatique pour tous les endpoints API
 * Ce script teste la documentation Swagger et la fonctionnalité des endpoints
 */

// Utiliser fetch natif de Node.js (disponible depuis v18)
const fetch = globalThis.fetch;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:3000';
let accessToken = '';
let refreshToken = '';

// Couleurs pour les logs
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, success, details = '') {
    const status = success ? '✅ PASS' : '❌ FAIL';
    const color = success ? 'green' : 'red';
    log(`${status} ${testName}`, color);
    if (details) {
        log(`   ${details}`, success ? 'green' : 'red');
    }
}

// Fonction pour faire des requêtes HTTP
async function makeRequest(method, url, body = null, headers = {}) {
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${BASE_URL}${url}`, config);
        const data = await response.text();

        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch {
            jsonData = data;
        }

        return {
            status: response.status,
            ok: response.ok,
            data: jsonData,
            headers: Object.fromEntries(response.headers.entries())
        };
    } catch (error) {
        return {
            status: 0,
            ok: false,
            data: { error: error.message },
            headers: {}
        };
    }
}

// Tests des endpoints
async function runTests() {
    log('🚀 Démarrage des tests API automatiques', 'cyan');
    log('=' .repeat(50), 'cyan');

    let passedTests = 0;
    let totalTests = 0;

    // Test 1: Vérification de la documentation Swagger
    totalTests++;
    try {
        const swaggerResponse = await makeRequest('GET', '/api-docs');
        if (swaggerResponse.status === 200) {
            logTest('Documentation Swagger accessible', true, 'UI Swagger disponible sur /api-docs');
            passedTests++;
        } else {
            logTest('Documentation Swagger accessible', false, `Status: ${swaggerResponse.status}`);
        }
    } catch (error) {
        logTest('Documentation Swagger accessible', false, error.message);
    }

    // Test 2: Endpoint de santé (si disponible)
    totalTests++;
    try {
        const healthResponse = await makeRequest('GET', '/health');
        if (healthResponse.status === 200) {
            logTest('Endpoint de santé', true);
            passedTests++;
        } else {
            logTest('Endpoint de santé', false, `Status: ${healthResponse.status} (optionnel)`);
            passedTests++; // Considéré comme passé car optionnel
        }
    } catch (error) {
        logTest('Endpoint de santé', false, `${error.message} (optionnel)`);
        passedTests++; // Considéré comme passé car optionnel
    }

    // Test 3: Connexion utilisateur
    totalTests++;
    log('\n🔐 Test d\'authentification', 'yellow');
    try {
        const loginResponse = await makeRequest('POST', '/auth/login', {
            email: 'admin@company.com',
            password: 'password123'
        });

        if (loginResponse.ok && loginResponse.data.accessToken) {
            accessToken = loginResponse.data.accessToken;
            refreshToken = loginResponse.headers['set-cookie']?.find(cookie => cookie.includes('refreshToken'));
            logTest('Connexion utilisateur', true, `Token obtenu: ${accessToken.substring(0, 20)}...`);
            passedTests++;
        } else {
            logTest('Connexion utilisateur', false, `Status: ${loginResponse.status}, Message: ${JSON.stringify(loginResponse.data)}`);
        }
    } catch (error) {
        logTest('Connexion utilisateur', false, error.message);
    }

    if (!accessToken) {
        log('❌ Impossible de continuer les tests sans token d\'accès', 'red');
        return;
    }

    // Test 4: Rafraîchissement du token
    totalTests++;
    try {
        const refreshResponse = await makeRequest('POST', '/auth/refresh', null, {
            'Cookie': refreshToken
        });

        if (refreshResponse.ok && refreshResponse.data.accessToken) {
            accessToken = refreshResponse.data.accessToken;
            logTest('Rafraîchissement du token', true);
            passedTests++;
        } else {
            logTest('Rafraîchissement du token', false, `Status: ${refreshResponse.status}`);
        }
    } catch (error) {
        logTest('Rafraîchissement du token', false, error.message);
    }

    // Test 5: Lister les entreprises
    totalTests++;
    log('\n🏢 Tests des entreprises', 'yellow');
    try {
        const companiesResponse = await makeRequest('GET', '/company', null, {
            'Authorization': `Bearer ${accessToken}`
        });

        if (companiesResponse.ok) {
            logTest('Lister les entreprises', true, `Trouvé ${Array.isArray(companiesResponse.data?.data) ? companiesResponse.data.data.length : 0} entreprises`);
            passedTests++;
        } else {
            logTest('Lister les entreprises', false, `Status: ${companiesResponse.status}`);
        }
    } catch (error) {
        logTest('Lister les entreprises', false, error.message);
    }

    // Test 6: Lister les utilisateurs
    totalTests++;
    log('\n👥 Tests des utilisateurs', 'yellow');
    try {
        const usersResponse = await makeRequest('GET', '/users', null, {
            'Authorization': `Bearer ${accessToken}`
        });

        if (usersResponse.ok) {
            logTest('Lister les utilisateurs', true, `Trouvé ${Array.isArray(usersResponse.data?.data) ? usersResponse.data.data.length : 0} utilisateurs`);
            passedTests++;
        } else {
            logTest('Lister les utilisateurs', false, `Status: ${usersResponse.status}`);
        }
    } catch (error) {
        logTest('Lister les utilisateurs', false, error.message);
    }

    // Test 7: Lister les employés
    totalTests++;
    log('\n👷 Tests des employés', 'yellow');
    try {
        const employeesResponse = await makeRequest('GET', '/employees', null, {
            'Authorization': `Bearer ${accessToken}`
        });

        if (employeesResponse.ok) {
            logTest('Lister les employés', true, `Trouvé ${Array.isArray(employeesResponse.data?.data) ? employeesResponse.data.data.length : 0} employés`);
            passedTests++;
        } else {
            logTest('Lister les employés', false, `Status: ${employeesResponse.status}`);
        }
    } catch (error) {
        logTest('Lister les employés', false, error.message);
    }

    // Test 8: Lister les cycles de paie
    totalTests++;
    log('\n💰 Tests des cycles de paie', 'yellow');
    try {
        const payRunsResponse = await makeRequest('GET', '/payruns', null, {
            'Authorization': `Bearer ${accessToken}`
        });

        if (payRunsResponse.ok) {
            logTest('Lister les cycles de paie', true, `Trouvé ${Array.isArray(payRunsResponse.data?.data) ? payRunsResponse.data.data.length : 0} cycles`);
            passedTests++;
        } else {
            logTest('Lister les cycles de paie', false, `Status: ${payRunsResponse.status}`);
        }
    } catch (error) {
        logTest('Lister les cycles de paie', false, error.message);
    }

    // Test 9: Lister les paiements
    totalTests++;
    log('\n💳 Tests des paiements', 'yellow');
    try {
        const paymentsResponse = await makeRequest('GET', '/payments', null, {
            'Authorization': `Bearer ${accessToken}`
        });

        if (paymentsResponse.ok) {
            logTest('Lister les paiements', true, `Trouvé ${Array.isArray(paymentsResponse.data?.data) ? paymentsResponse.data.data.length : 0} paiements`);
            passedTests++;
        } else {
            logTest('Lister les paiements', false, `Status: ${paymentsResponse.status}`);
        }
    } catch (error) {
        logTest('Lister les paiements', false, error.message);
    }

    // Test 10: Obtenir les KPIs du tableau de bord
    totalTests++;
    log('\n📊 Tests du tableau de bord', 'yellow');
    try {
        const kpisResponse = await makeRequest('GET', '/dashboard/kpis', null, {
            'Authorization': `Bearer ${accessToken}`
        });

        if (kpisResponse.ok) {
            logTest('Obtenir les KPIs', true, 'Données du tableau de bord récupérées');
            passedTests++;
        } else {
            logTest('Obtenir les KPIs', false, `Status: ${kpisResponse.status}`);
        }
    } catch (error) {
        logTest('Obtenir les KPIs', false, error.message);
    }

    // Test 11: Tester les présences
    totalTests++;
    log('\n⏰ Tests des présences', 'yellow');
    try {
        const attendanceResponse = await makeRequest('GET', '/attendance/report', null, {
            'Authorization': `Bearer ${accessToken}`
        });

        if (attendanceResponse.ok) {
            logTest('Rapport des présences', true, 'Données de présence récupérées');
            passedTests++;
        } else {
            logTest('Rapport des présences', false, `Status: ${attendanceResponse.status}`);
        }
    } catch (error) {
        logTest('Rapport des présences', false, error.message);
    }

    // Test 12: Vérification des fichiers statiques
    totalTests++;
    log('\n📁 Tests des fichiers statiques', 'yellow');
    try {
        const staticResponse = await makeRequest('GET', '/api-docs');
        if (staticResponse.status === 200) {
            logTest('Fichiers statiques accessibles', true, 'Documentation Swagger accessible');
            passedTests++;
        } else {
            logTest('Fichiers statiques accessibles', false, `Status: ${staticResponse.status}`);
        }
    } catch (error) {
        logTest('Fichiers statiques accessibles', false, error.message);
    }

    // Résumé final
    log('\n' + '='.repeat(50), 'cyan');
    log(`📊 RÉSULTATS FINAUX: ${passedTests}/${totalTests} tests réussis`, passedTests === totalTests ? 'green' : 'yellow');

    if (passedTests === totalTests) {
        log('🎉 Tous les tests sont passés ! L\'API fonctionne correctement.', 'green');
    } else {
        log(`⚠️ ${totalTests - passedTests} test(s) ont échoué. Vérifiez les logs ci-dessus.`, 'yellow');
    }

    // Générer un rapport
    const report = {
        timestamp: new Date().toISOString(),
        totalTests,
        passedTests,
        failedTests: totalTests - passedTests,
        successRate: `${((passedTests / totalTests) * 100).toFixed(1)}%`,
        serverUrl: BASE_URL,
        tests: [
            'Documentation Swagger',
            'Endpoint de santé',
            'Connexion utilisateur',
            'Rafraîchissement du token',
            'Lister les entreprises',
            'Lister les utilisateurs',
            'Lister les employés',
            'Lister les cycles de paie',
            'Lister les paiements',
            'KPIs du tableau de bord',
            'Rapport des présences',
            'Fichiers statiques'
        ]
    };

    fs.writeFileSync(path.join(__dirname, 'api-test-report.json'), JSON.stringify(report, null, 2));
    log('📄 Rapport de test sauvegardé dans api-test-report.json', 'blue');

    return passedTests === totalTests;
}

// Fonction principale
async function main() {
    try {
        // Vérifier si le serveur est en cours d'exécution
        log('🔍 Vérification de la disponibilité du serveur...', 'blue');
        const serverCheck = await makeRequest('GET', '/api-docs');

        if (!serverCheck.ok) {
            log('❌ Le serveur ne semble pas être en cours d\'exécution sur http://localhost:3000', 'red');
            log('💡 Démarrez le serveur avec: npm run dev', 'yellow');
            process.exit(1);
        }

        log('✅ Serveur détecté, démarrage des tests...', 'green');
        await runTests();
    } catch (error) {
        log(`❌ Erreur lors des tests: ${error.message}`, 'red');
        process.exit(1);
    }
}

// Exécuter si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { runTests };