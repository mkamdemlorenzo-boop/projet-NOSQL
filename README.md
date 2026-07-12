Construisez l'image Docker du projet, puis démarrez les conteneurs avec Docker Compose.

```bash
docker build -t gameproj .
docker compose up -d
```
Ouvrez votre navigateur pour y entrer dans votre barre de recherche
```bash
http://localhost:8080
```

## Répartition des bases de données

* **MySQL** est utilisé pour stocker les utilisateurs et les jeux.
* **MongoDB** est utilisé pour stocker une fiche plus détaillée des jeux (description, genre, éditeur, plateformes, prix, etc.).
* **Redis** est utilisé pour compter le nombre de vues des profils.
* **Neo4j** est utilisé pour gérer les relations d'amitié entre les utilisateurs.
