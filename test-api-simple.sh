#!/bin/bash

# Script de test simple pour l'API
# Utilise curl au lieu de node-fetch pour éviter les problèmes d'import

BASE_URL="http://localhost:3000"
ACCESS_TOKEN=""

echo "🚀 Démarrage des tests API simples"
echo "=================================="

# Fonction pour logger les tests
log_test() {
    local test_name="$1"
    local success="$2"
    local details="$3"

    if [ "$success" = "true" ]; then
        echo "✅ PASS $test_name"
        [ -n "$details" ] && echo "   $details"
    else
        echo "❌ FAIL $test_name"
        [ -n "$details" ] && echo "   $details"
    fi
}

# Test 1: Vérification de Swagger
echo "🔍 Test de la documentation Swagger..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api-docs/")
if [ "$response" = "200" ]; then
    log_test "Documentation Swagger" "true" "UI Swagger accessible"
else
    log_test "Documentation Swagger" "false" "Code HTTP: $response"
fi

# Test 2: Test de l'endpoint de santé
echo "🏥 Test de l'endpoint de santé..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health")
if [ "$response" = "200" ]; then
    log_test "Endpoint de santé" "true"
else
    log_test "Endpoint de santé" "false" "Code HTTP: $response (optionnel)"
fi

# Test 3: Connexion utilisateur
echo "🔐 Test de connexion..."
response=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@demo.com","password":"password123"}')

http_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@demo.com","password":"password123"}')

if [ "$http_code" = "200" ]; then
    # Extraire le token de la réponse
    ACCESS_TOKEN=$(echo "$response" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
    if [ -n "$ACCESS_TOKEN" ]; then
        log_test "Connexion utilisateur" "true" "Token obtenu: ${ACCESS_TOKEN:0:20}..."
    else
        log_test "Connexion utilisateur" "false" "Token non trouvé dans la réponse"
    fi
else
    log_test "Connexion utilisateur" "false" "Code HTTP: $http_code"
fi

# Test 4: Lister les entreprises (si token obtenu)
if [ -n "$ACCESS_TOKEN" ]; then
    echo "🏢 Test des entreprises..."
    response=$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" "$BASE_URL/company")
    http_code=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $ACCESS_TOKEN" "$BASE_URL/company")

    if [ "$http_code" = "200" ]; then
        log_test "Lister les entreprises" "true" "Endpoint accessible"
    else
        log_test "Lister les entreprises" "false" "Code HTTP: $http_code"
    fi

    # Test 5: Lister les employés
    echo "👷 Test des employés..."
    response=$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" "$BASE_URL/employees")
    http_code=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $ACCESS_TOKEN" "$BASE_URL/employees")

    if [ "$http_code" = "200" ]; then
        log_test "Lister les employés" "true" "Endpoint accessible"
    else
        log_test "Lister les employés" "false" "Code HTTP: $http_code"
    fi

    # Test 6: KPIs du tableau de bord
    echo "📊 Test du tableau de bord..."
    response=$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" "$BASE_URL/dashboard/kpis")
    http_code=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $ACCESS_TOKEN" "$BASE_URL/dashboard/kpis")

    if [ "$http_code" = "200" ]; then
        log_test "KPIs du tableau de bord" "true" "Données récupérées"
    else
        log_test "KPIs du tableau de bord" "false" "Code HTTP: $http_code"
    fi
else
    echo "⚠️ Tests d'authentification ignorés (pas de token)"
fi

echo ""
echo "🎯 Tests terminés!"
echo "📖 Documentation Swagger: http://localhost:3000/api-docs/"
echo "🔧 Pour plus de tests détaillés, utilisez: npm run test:api (avec node-fetch configuré)"