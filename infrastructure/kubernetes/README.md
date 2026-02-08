# Kubernetes Configuration

Configuration Kubernetes pour le déploiement en production.

## Structure

- À définir

## Services

- Auth Service
- Booking Service
- Accommodation Service
- Restaurant Service
- Transport Service
- Payment Service
- Notification Service
- Resource Core Service
- Service Provider

## Déploiement

```bash
# Appliquer toutes les configurations
kubectl apply -f .

# Déployer un service spécifique
kubectl apply -f deployments/[service-name].yaml

# Vérifier le statut
kubectl get pods
kubectl get services

# Voir les logs
kubectl logs -f [pod-name]
```

## Namespaces

- À définir
