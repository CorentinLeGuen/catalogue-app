# 📚 Catalogue de Livres

Ce projet est une application frontend développée avec **SvelteKit**. Elle permet de consulter, ajouter et supprimer des livres.

[![Netlify Status](https://api.netlify.com/api/v1/badges/476a6acb-dbae-4e86-b7b2-383b00825e7b/deploy-status)](https://app.netlify.com/sites/catalogue-lexum/deploys)

## ✨ Fonctionnalités

- [x] Consulter, ajouter, modifier et supprimer des livres
- [x] Ajout des champs d'un livre automatique à partir de l’ISBN (via [OpenLibrary API](https://openlibrary.org/developers/api)).
- [x] Génération d'un résumé automatique (via [OpenAPI](https://openai.com))

## ⚙️ Installation & configuration

- ⚠️ Adapter [la configuration d'environnement](.env.example) avec vos propres service. 

```bash
git clone https://github.com/CorentinLeGuen/catalogue-app.git
cd catalogue-app
npm install
npm run dev
```

## 📜 LICENSES

[Les logos SVG](static/) viennent de [SVGrepo.com](svgrepo.com).