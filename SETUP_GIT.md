# Setup Git - Instructions

## Pour tous les collaborateurs

Avant de commencer à travailler sur le projet, chaque collaborateur DOIT exécuter le script de configuration :

### Sur Windows (PowerShell)

```powershell
.\setup-git.ps1
```

### Sur Linux/Mac (Bash)

```bash
chmod +x setup-git.sh
./setup-git.sh
```

## Ce que fait le script

1. **Configure le template de commit**
   - Utilise `.gitmessage` comme template
   - Vous aide à suivre les conventions de commit

2. **Installe les Git hooks**
   - **pre-commit** : Vérifie qu'aucun fichier sensible n'est committé
   - **commit-msg** : Valide le format de vos messages de commit

3. **Configure les paramètres Git**
   - Comportement de pull/push
   - Couleurs dans le terminal
   - Autres paramètres utiles

## Configuration de votre identité

Après avoir exécuté le script, configurez votre identité :

```bash
git config user.name "Votre Nom Complet"
git config user.email "votre.email@example.com"
```

## Tester la configuration

Essayez de créer un commit pour vérifier que tout fonctionne :

```bash
# Créer une branche de test
git checkout -b test/verification-config

# Modifier un fichier
echo "Test" > test.txt
git add test.txt

# Essayer de commiter (le template devrait s'ouvrir)
git commit

# Tester avec un message direct (devrait valider le format)
git commit -m "test(docs): vérification de la configuration"

# Nettoyer
git checkout master
git branch -D test/verification-config
rm test.txt
```

## Problèmes courants

### Les hooks ne s'exécutent pas (Windows)

Sur Windows, Git Bash peut avoir des problèmes avec les hooks. Solutions :

1. **Vérifier que Git Bash est installé**
2. **Utiliser WSL (Windows Subsystem for Linux)**
3. **Assurez-vous que les hooks ont les bonnes permissions**

### Le template de commit ne s'affiche pas

```bash
# Vérifier la configuration
git config commit.template

# Réappliquer si nécessaire
git config commit.template .gitmessage
```

### Erreur "permission denied" sur les hooks

```bash
# Linux/Mac : donner les permissions d'exécution
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/commit-msg
```

## Désactiver temporairement les hooks

Si vous devez temporairement contourner les hooks (déconseillé) :

```bash
# Skip pre-commit hook
git commit --no-verify

# Utiliser avec précaution !
```

## Pour les responsables de projet

### Forcer la configuration pour tous

Ajoutez au README principal :

```markdown
##  IMPORTANT - Première installation

Avant tout commit, exécutez :
- Windows: `.\setup-git.ps1`
- Linux/Mac: `./setup-git.sh`
```

### Vérifier la configuration des collaborateurs

Avant d'accepter une PR, vérifiez que :
- [ ] Les messages de commit suivent le format
- [ ] Aucun fichier sensible n'est committé
- [ ] Le `.gitignore` est respecté

## Ressources

- [CONTRIBUTING.md](CONTRIBUTING.md) - Guide complet
- [.github/GIT_GUIDE.md](.github/GIT_GUIDE.md) - Référence rapide
- [.gitmessage](.gitmessage) - Template de commit
