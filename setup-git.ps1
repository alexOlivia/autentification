# Configuration Git pour le projet Booking System

Write-Host " Configuration Git pour le projet Booking System" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Configurer le template de commit
Write-Host " Configuration du template de commit..." -ForegroundColor Yellow
git config commit.template .gitmessage
Write-Host " Template de commit configuré" -ForegroundColor Green

# Configurer les hooks
Write-Host ""
Write-Host " Configuration des hooks Git..." -ForegroundColor Yellow

# Créer le dossier hooks s'il n'existe pas
New-Item -ItemType Directory -Force -Path .git/hooks | Out-Null

# Pre-commit hook
$preCommitContent = @'
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

echo " Vérifications passées!"
'@

Set-Content -Path .git/hooks/pre-commit -Value $preCommitContent
Write-Host " Pre-commit hook configuré" -ForegroundColor Green

# Commit-msg hook pour vérifier le format
$commitMsgContent = @'
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
'@

Set-Content -Path .git/hooks/commit-msg -Value $commitMsgContent
Write-Host " Commit-msg hook configuré" -ForegroundColor Green

# Configuration additionnelle
Write-Host ""
Write-Host "  Configuration additionnelle..." -ForegroundColor Yellow

# Configurer le comportement de pull
git config pull.rebase false

# Configurer le comportement de push
git config push.default simple

# Activer les couleurs
git config color.ui auto

Write-Host " Configuration additionnelle terminée" -ForegroundColor Green

# Résumé
Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " Configuration terminée!" -ForegroundColor Green
Write-Host ""
Write-Host " Ce qui a été configuré:" -ForegroundColor Cyan
Write-Host "   - Template de commit (.gitmessage)"
Write-Host "   - Pre-commit hook (vérification des fichiers sensibles)"
Write-Host "   - Commit-msg hook (validation du format de commit)"
Write-Host "   - Paramètres Git additionnels"
Write-Host ""
Write-Host " Prochaines étapes:" -ForegroundColor Cyan
Write-Host "   1. Lisez CONTRIBUTING.md pour les conventions"
Write-Host "   2. Configurez votre identité Git:"
Write-Host "      git config user.name 'Votre Nom'"
Write-Host "      git config user.email 'votre.email@example.com'"
Write-Host "   3. Testez un commit pour vérifier la configuration"
Write-Host ""
Write-Host " Bon développement!" -ForegroundColor Green
