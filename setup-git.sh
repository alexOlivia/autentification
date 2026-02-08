#!/bin/bash

echo " Configuration Git pour le projet Booking System"
echo "=================================================="
echo ""

# Configurer le template de commit
echo " Configuration du template de commit..."
git config commit.template .gitmessage
echo " Template de commit configuré"

# Configurer les hooks
echo ""
echo " Configuration des hooks Git..."

# Créer le dossier hooks s'il n'existe pas
mkdir -p .git/hooks

# Pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh

echo " Vérification avant commit..."

# Vérifier qu'il n'y a pas de fichiers sensibles
FORBIDDEN_FILES=".env .env.local .env.production secrets.json *.key *.pem"

for file in $FORBIDDEN_FILES; do
    if git diff --cached --name-only | grep -q "$file"; then
        echo " ERREUR: Fichier sensible détecté: $file"
        echo "   Retirez-le avec: git reset HEAD $file"
        exit 1
    fi
done

# Vérifier qu'il n'y a pas de console.log ou debugger (optionnel pour JS/TS)
# if git diff --cached --name-only | grep -E '\.(js|ts|jsx|tsx)$' | xargs grep -n "console\.log\|debugger" > /dev/null; then
#     echo "  ATTENTION: console.log ou debugger détecté"
#     echo "   Voulez-vous continuer ? (y/n)"
#     read response
#     if [ "$response" != "y" ]; then
#         exit 1
#     fi
# fi

echo " Vérifications passées!"
EOF

chmod +x .git/hooks/pre-commit
echo " Pre-commit hook configuré"

# Commit-msg hook pour vérifier le format
cat > .git/hooks/commit-msg << 'EOF'
#!/bin/sh

COMMIT_MSG_FILE=$1
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

# Ignorer les commits de merge
if echo "$COMMIT_MSG" | grep -q "^Merge"; then
    exit 0
fi

# Vérifier le format: type(scope): description
if ! echo "$COMMIT_MSG" | grep -qE "^(feat|fix|docs|style|refactor|perf|test|chore|build|ci)\([a-z-]+\): .+"; then
    echo " ERREUR: Format de commit invalide!"
    echo ""
    echo "Format attendu: <type>(<scope>): <description>"
    echo ""
    echo "Types valides: feat, fix, docs, style, refactor, perf, test, chore, build, ci"
    echo "Scopes valides: auth, booking, accommodation, restaurant, transport, payment,"
    echo "                notification, resource-core, service-provider, mobile, infra, docs, global"
    echo ""
    echo "Exemples:"
    echo "  feat(auth): ajout de l'authentification OAuth2"
    echo "  fix(booking): correction du calcul de disponibilité"
    echo ""
    echo "Consultez CONTRIBUTING.md pour plus d'informations"
    exit 1
fi

# Vérifier la longueur de la première ligne (max 72 caractères)
FIRST_LINE=$(echo "$COMMIT_MSG" | head -n1)
if [ ${#FIRST_LINE} -gt 72 ]; then
    echo "  ATTENTION: Le message de commit est trop long (${#FIRST_LINE} caractères, max 72)"
    echo "   Message: $FIRST_LINE"
fi

echo " Format de commit valide"
EOF

chmod +x .git/hooks/commit-msg
echo " Commit-msg hook configuré"

# Configuration additionnelle
echo ""
echo "  Configuration additionnelle..."

# Configurer le comportement de pull
git config pull.rebase false

# Configurer le comportement de push
git config push.default simple

# Activer les couleurs
git config color.ui auto

echo " Configuration additionnelle terminée"

# Résumé
echo ""
echo "=================================================="
echo " Configuration terminée!"
echo ""
echo " Ce qui a été configuré:"
echo "   - Template de commit (.gitmessage)"
echo "   - Pre-commit hook (vérification des fichiers sensibles)"
echo "   - Commit-msg hook (validation du format de commit)"
echo "   - Paramètres Git additionnels"
echo ""
echo " Prochaines étapes:"
echo "   1. Lisez CONTRIBUTING.md pour les conventions"
echo "   2. Configurez votre identité Git:"
echo "      git config user.name 'Votre Nom'"
echo "      git config user.email 'votre.email@example.com'"
echo "   3. Testez un commit pour vérifier la configuration"
echo ""
echo " Bon développement!"
