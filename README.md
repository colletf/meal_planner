# Meal Planner - Planificateur de repas

Application web mobile pour planifier vos repas de la semaine et générer automatiquement une liste de courses.

## Fonctionnalités

- **Découverte de recettes** : Parcourez des milliers de recettes via l'API Spoonacular
- **Filtres avancés** : Filtrez par cuisine (française, italienne, etc.), régime (végétarien, sans gluten) et type de plat
- **Exclusion d'ingrédients** : Excluez les ingrédients que vous n'aimez pas
- **Planning hebdomadaire** : Planifiez déjeuners et dîners pour chaque jour de la semaine
- **Repas réutilisables** : Ajoutez le même repas plusieurs fois dans la semaine
- **Portions ajustables** : Choisissez le nombre de personnes (1-10) pour chaque repas
- **Liste de courses** : Génération automatique avec ingrédients en français, triés par rayon

## Installation sur Android (PWA)

1. Ouvrez l'application dans Chrome sur votre téléphone
2. Appuyez sur le menu (⋮) en haut à droite
3. Sélectionnez "Ajouter à l'écran d'accueil"
4. L'application apparaît comme une app native

## Utilisation

### Onglet "Repas"

1. **Parcourir** : Les repas s'affichent automatiquement au démarrage
2. **Rechercher** : Tapez dans la barre de recherche pour trouver un plat
3. **Filtrer** : Cliquez sur "Filtres" pour affiner par cuisine, régime ou type
4. **Exclure** : Cliquez sur "Exclusions" pour masquer les recettes avec certains ingrédients
5. **Recharger** : Cliquez sur "Nouveaux repas" pour découvrir d'autres recettes
6. **Voir détails** : Icône œil pour voir la recette complète
7. **Ajouter** : Icône + pour ajouter au planning

### Onglet "Planning"

- Visualisez votre semaine avec déjeuners et dîners
- Supprimez un repas avec l'icône ×
- "Tout effacer" pour recommencer à zéro
- Un même repas peut apparaître plusieurs fois dans la semaine

### Onglet "Courses"

- Liste générée automatiquement depuis le planning
- Ingrédients en français avec quantités en unités métriques (g, ml, kg)
- Triés par rayon de supermarché (Boucherie, Fruits & Légumes, etc.)
- Prix estimés en euros
- Total affiché en bas

## Lancer l'application localement

```bash
cd webapp
python -m http.server 8080
```

Puis ouvrir http://localhost:8080

## Structure des fichiers

```
webapp/
├── index.html          # Page principale
├── manifest.json       # Configuration PWA
├── service-worker.js   # Cache pour mode hors-ligne
├── css/
│   └── style.css       # Styles mobile-first
├── js/
│   ├── config.js       # Configuration API
│   ├── translations.js # Traductions et prix français
│   ├── api.js          # Client Spoonacular
│   ├── storage.js      # Stockage local
│   └── app.js          # Logique principale
└── icons/
    └── icon-192.svg    # Icône PWA
```

## API

L'application utilise l'API Spoonacular. La clé API est incluse dans `js/config.js`.
