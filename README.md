# Track ENT, client et server

> Outils de capture, de stockage, de visualisation et de communication de l'état des services de l'ENT !

## Fonctionnement

Le serveur met en place une API pour recevoir et donner accès à de la data. Il gère aussi les bases de données. Le client permet de visualiser la data qui se trouve dans la base de données. Cron permet de réaliser des tâches à temps régulier comme regarder le fonctionnement des services ou la création de tweet. Bot permet de réaliser des tweets via une API, en lui envoyant un peut de data sur le endpoint.

- cron: capture
- server: stockage
- client: visualisation
- bot: communication

## Build Setup

### Exigences

- [Node](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Compose](https://docs.docker.com/compose/)

### Env

Créer un fichier `.env` à partir du `.env.local` pour gérer les tags.

### Utilisation de Compose

```bash
# construit les images des services du .yml
$ docker-compose --env-file .env build
# crée et (re)démarre les conteneurs des services du .yml
$ docker-compose --env-file .env up
# met en pause les conteneurs des services du .yml
$ docker-compose stop
# arrête et détruit les conteneurs des services du .yml
$ docker-compose down
```
