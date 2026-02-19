# Guide de Contribution - Booking System

## Table des matières
1. [Convention de Commits](#convention-de-commits)
2. [Workflow Git](#workflow-git)
3. [Règles de Branches](#règles-de-branches)
4. [Process de Review](#process-de-review)
5. [Standards de Code](#standards-de-code)

## Convention de Commits

### Format des messages de commit

Utilisez le format suivant pour tous vos commits :

```
<type>(<scope>): <description>

[corps optionnel]

[footer optionnel]
```

### Types de commits

- **feat**: Nouvelle fonctionnalité
- **fix**: Correction de bug
- **docs**: Modifications de documentation
- **style**: Changements de formatage (espaces, points-virgules, etc.)
- **refactor**: Refactorisation du code sans changement de fonctionnalité
- **perf**: Amélioration des performances
- **test**: Ajout ou modification de tests
- **chore**: Tâches de mastertenance (mise à jour dépendances, config, etc.)
- **build**: Changements affectant le système de build
- **ci**: Changements dans la configuration CI/CD

### Scope (Portée)

Le scope indique quel service ou partie du projet est affecté :

- `auth`: Auth Service
- `booking`: Booking Service
- `accommodation`: Accommodation Service
- `restaurant`: Restaurant Service
- `transport`: Transport Service
- `payment`: Payment Service
- `notification`: Notification Service
- `resource-core`: Resource Core Service
- `service-provider`: Service Provider
- `mobile`: Application mobile
- `infra`: Infrastructure
- `docs`: Documentation
- `global`: Changements globaux

### Exemples de commits

```bash
#  BON
feat(auth): ajout de l'authentification OAuth2
fix(booking): correction du calcul de disponibilité
docs(readme): mise à jour des instructions d'installation
refactor(payment): simplification du traitement des paiements
test(restaurant): ajout des tests unitaires pour les réservations

#  MAUVAIS
update code
fix bug
wip
modification
```

### Règles pour les messages

1. **Description** (obligatoire)
   - Maximum 72 caractères
   - Commencer par un verbe à l'impératif présent
   - Pas de point final
   - En minuscule après le type et scope

2. **Corps** (optionnel)
   - Expliquer POURQUOI et non COMMENT
   - Séparer la description du corps par une ligne vide
   - Limiter à 100 caractères par ligne

3. **Footer** (optionnel)
   - Référencer les issues : `Refs: #123`
   - Breaking changes : `BREAKING CHANGE: description`
   - Fermer des issues : `Closes: #123`

### Exemple complet

```
feat(booking): ajout de la réservation multi-ressources

Permet de réserver plusieurs ressources en une seule transaction
pour améliorer l'expérience utilisateur lors de réservations groupées.

- Ajout d'une nouvelle API endpoint
- Modification du modèle de réservation
- Mise à jour de la documentation

Refs: #456
```

## Workflow Git

### 1. Avant de commencer

```bash
# Toujours partir de la branche master à jour
git checkout master
git pull origin master

# Créer une nouvelle branche
git checkout -b <type>/<description>
```

### 2. Pendant le développement

```bash
# Commiter régulièrement avec des messages clairs
git add <fichiers>
git commit -m "type(scope): description"

# Garder votre branche à jour avec master
git fetch origin
git rebase origin/master
```

### 3. Avant de pusher

**Checklist obligatoire :**

- [ ] Le code compile sans erreur
- [ ] Tous les tests passent
- [ ] Le code respecte les standards du projet
- [ ] La documentation est à jour
- [ ] Les fichiers sensibles ne sont pas inclus
- [ ] Le `.gitignore` est respecté
- [ ] Les messages de commit suivent la convention

```bash
# Vérifier le statut
git status

# Vérifier les changements
git diff

# Pusher la branche
git push origin <nom-branche>
```

### 4. Pull Request

1. Créer une Pull Request sur GitHub/GitLab
2. Remplir le template de Pull Request
3. Assigner au moins 1 reviewer
4. Attendre l'approbation avant de merger
5. Résoudre tous les commentaires
6. Merger avec "Squash and Merge" si plusieurs commits

## Règles de Branches

### Nomenclature des branches

```
<type>/<description-courte>
```

**Types de branches :**

- `feature/` - Nouvelles fonctionnalités
- `fix/` - Corrections de bugs
- `hotfix/` - Corrections urgentes en production
- `refactor/` - Refactorisation
- `docs/` - Documentation
- `test/` - Ajout ou modification de tests
- `chore/` - Tâches de mastertenance

**Exemples :**

```bash
feature/auth-oauth2
fix/booking-availability-calculation
hotfix/payment-critical-bug
refactor/notification-service-architecture
docs/api-documentation
test/restaurant-unit-tests
chore/update-dependencies
```

### Règles de nommage

- Utiliser uniquement des lettres minuscules
- Séparer les mots par des tirets (-)
- Être descriptif mais concis
- Pas de caractères spéciaux sauf tirets

### Protection des branches

#### Branch `master`
-  Push direct interdit
-  Merge uniquement via Pull Request
-  Au moins 1 approbation requise
-  Tous les tests CI doivent passer
-  Branche toujours déployable

#### Branch `develop` (si utilisée)
-  Push direct déconseillé
-  Merge via Pull Request recommandé
-  Tests CI doivent passer


## Standards de Code

### Commits atomiques

- Un commit = une modification logique
- Si vous utilisez "et" dans votre message, c'est probablement trop de changements

### Éviter

 **À NE PAS FAIRE :**

```bash
# Commits vagues
git commit -m "update"
git commit -m "fix"
git commit -m "wip"
git commit -m "modifications"

# Push de code qui ne compile pas
git push origin feature/broken-code

# Commits avec des fichiers sensibles
git add .env
git add secrets.json

# Modifier l'historique d'une branche partagée
git push --force origin master
```

### Best Practices

 **À FAIRE :**

```bash
# Vérifier avant de commit
git status
git diff

# Ajouter uniquement les fichiers nécessaires
git add src/service.py
git add tests/test_service.py

# Message de commit descriptif
git commit -m "feat(auth): ajout de la validation JWT"

# Pusher régulièrement
git push origin feature/my-feature

# Mettre à jour avec rebase
git pull --rebase origin master
```

### Fichiers à ne jamais committer

- Fichiers de configuration locale (`.env`, `.vscode/settings.json`)
- Fichiers de build (`node_modules/`, `dist/`, `build/`)
- Logs (`*.log`)
- Fichiers temporaires (`.DS_Store`, `Thumbs.db`)
- Secrets et credentials
- Dépendances (utiliser `package.json`, `requirements.txt`, etc.)

### En cas d'erreur

**Commit push par erreur :**
```bash
# Annuler le dernier commit (garde les changements)
git reset --soft HEAD~1

# Annuler le dernier commit (supprime les changements)
git reset --hard HEAD~1
```

**Fichier sensible committé :**
```bash
# Supprimer de l'historique (dangereux !)
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch <fichier>' \
  --prune-empty --tag-name-filter cat -- --all

# Puis force push (seulement si vous êtes sûr !)
git push origin --force --all
```

**Conflits lors du rebase :**
```bash
# Résoudre les conflits
git status  # voir les fichiers en conflit
# Éditer les fichiers
git add <fichiers-résolus>
git rebase --continue

# Abandonner le rebase si nécessaire
git rebase --abort
```

## Outils et Automation

### Git Hooks recommandés

Créez un fichier `.git/hooks/pre-commit` :

```bash
#!/bin/sh
# Vérifier le code avant le commit

echo " Vérification du code..."

# Lancer les tests
npm test || exit 1

# Vérifier le linting
npm run lint || exit 1

echo " Vérifications passées !"
```

### Template de commit

Créez un fichier `.gitmessage` :

```
# <type>(<scope>): <description>
# 
# [corps optionnel]
# 
# [footer optionnel]
# 
# Types: feat, fix, docs, style, refactor, perf, test, chore, build, ci
# Scopes: auth, booking, accommodation, restaurant, transport, payment, notification, resource-core, service-provider, mobile, infra, docs, global
```

Configurez Git pour l'utiliser :
```bash
git config commit.template .gitmessage
```

## Questions ?

En cas de doute, n'hésitez pas à :
- Consulter ce guide
- Demander à l'équipe
- Consulter la documentation Git
- Créer une issue pour discuter

---

**Dernière mise à jour :** Février 2026
