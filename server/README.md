# Track ENT

> Pour capturer et communiquer quand les services de l'ENT sont UP ! 👀

Le serveur effectue la capture du statut des services en utilisant une requête à chaque URL. Si ce dernier change, alors le serveur tweet l'état du service.

## Build Setup

### Exigences

- [Node](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Compose](https://docs.docker.com/compose/)

### Env

Copier 2 fois le fichier `.env.local` et les renommer `.env` et `.env.dev` et les compléter en fonction du mode, prod ou dev.

### Bot

Le bot twitter n'est pas actif en développement. Ses tweets sont simplement affichés dans la console.

### Utilisation manuelle

```bash
# install dependencies
$ npm install

# lunch server in development mode
$ npm run dev

# launch server in production mode
$ npm run start
```

### Utilisation de docker

Afin de créer au mieux le container, il est préférable d'utiliser `compose` pour créer le client et le server !
