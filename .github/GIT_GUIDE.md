# Règles Git - Booking System

##  Quick Reference

### Format de commit
```
<type>(<scope>): <description>
```

### Types
`feat` `fix` `docs` `style` `refactor` `perf` `test` `chore` `build` `ci`

### Scopes
`auth` `booking` `accommodation` `restaurant` `transport` `payment` `notification` `resource-core` `service-provider` `mobile` `infra` `docs` `global`

### Exemples
```bash
 feat(auth): ajout de l'authentification OAuth2
 fix(booking): correction du calcul de disponibilité
 docs(readme): mise à jour des instructions
 update code
 fix bug
 wip
```

##  Configuration rapide

### 1. Configurer Git
```bash
# Windows
.\setup-git.ps1

# Linux/Mac
chmod +x setup-git.sh
./setup-git.sh
```

### 2. Configurer votre identité
```bash
git config user.name "Votre Nom"
git config user.email "votre.email@example.com"
```

### 3. Créer une branche
```bash
git checkout -b feature/description
```

### 4. Commiter
```bash
git add fichiers
git commit  # Le template s'ouvrira automatiquement
```

### 5. Push
```bash
git push origin nom-branche
```

##  Documentation complète

Consultez [CONTRIBUTING.md](CONTRIBUTING.md) pour la documentation complète.

##  Règles importantes

-  Jamais de push direct sur `master`
-  Toujours créer une Pull Request
-  Au moins 1 reviewer requis
-  Tests doivent passer avant merge
-  Pas de fichiers sensibles (.env, secrets)
-  Messages de commit clairs et descriptifs

## 🛠️ Commandes utiles

```bash
# Voir le statut
git status

# Voir les changements
git diff

# Annuler le dernier commit (garde les changements)
git reset --soft HEAD~1

# Mettre à jour avec master
git pull --rebase origin master

# Voir l'historique
git log --oneline --graph

# Nettoyer les branches locales
git branch --merged | grep -v "master" | xargs git branch -d
```

## 🆘 Besoin d'aide ?

1. Consultez [CONTRIBUTING.md](CONTRIBUTING.md)
2. Demandez à l'équipe
3. Créez une issue avec le label `question`
