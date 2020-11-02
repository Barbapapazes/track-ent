# Track ENT

> Pour capturer quand les services de l'ENT sont UP ! 👀

Cron permet de réaliser des tâches à des moments bien déterminé, comme récupérer le statut des services ou réaliser le contenu pour les tweets.

## Build Setup

### Exigences

- [Node](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Compose](https://docs.docker.com/compose/)

### Env

Copier 2 fois le fichier `.env.local` et les renommer `.env` et `.env.dev` et les compléter en fonction du mode, prod ou dev.

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
