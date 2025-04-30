# 📚 Catalogue de Livres — Frontend SvelteKit

Ce projet est une application frontend développée avec **SvelteKit**. Elle permet de consulter, ajouter et supprimer des livres.

## ✨ Fonctionnalités

- [x] Liste des livres disponibles
- [x] Ajout de nouveaux livres via un formulaire intelligent
- [x] Suppression de livres existants
- [x] Remplissage automatique à partir de l’ISBN (via [OpenLibrary API](https://openlibrary.org/developers/api))
- [x] Génération d'un résumé automatique (via [OpenAPI](https://openai.com))

## ⚙️ Installation & configuration

- ⚠️ Adapter [la configuration d'environnement](.env.example) avec vos propres service. 

```bash
git clone https://github.com/CorentinLeGuen/catalogue-app.git
cd catalogue-app
npm install
npm run dev
```

