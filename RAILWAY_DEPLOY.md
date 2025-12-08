# Railway Deployment

Ce projet utilise Socket.io qui nécessite une connexion WebSocket persistante, incompatible avec les plateformes serverless comme Vercel.

## Déployer sur Railway

### Méthode 1 : Interface web

1. Va sur https://railway.app
2. Connecte ton compte GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Sélectionne ce repo
5. Deploy automatique

### Méthode 2 : CLI

```bash
# Installer Railway CLI
npm i -g @railway/cli

# Se connecter
railway login

# Initialiser le projet
railway init

# Déployer
railway up
```

## Variables d'environnement

Railway détecte automatiquement Next.js. Aucune variable spéciale n'est nécessaire.

Optionnel pour désactiver la télémétrie :

```
NEXT_TELEMETRY_DISABLED=1
```

## Coût

- **Free tier** : 500 heures d'exécution/mois (suffisant pour un projet personnel)
- **Hobby plan** : $5/mois (illimité)

## Pourquoi pas Vercel ?

Vercel utilise des fonctions serverless qui ne peuvent pas maintenir de connexions WebSocket longue durée, nécessaires pour Socket.io.
