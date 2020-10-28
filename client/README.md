# Track ENT

> Pour visualiser quand les services de l'ENT sont UP ! 👀

## Build Setup

### Exigence

- [Node](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Compose](https://docs.docker.com/compose/)

### Env

Copier le fichier `.env.local` et le renommer `.env`. Mettre l'URL de votre serveur en production ! Cette URL n'est utilisée que lorsque le client est mise en production

### Utilisation manuelle

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

### Utilisation de docker

Afin de créer au mieux le container, il est préférable d'utiliser `compose` pour créer le client et le server !
