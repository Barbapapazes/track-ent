# Track ENT, client et server

> Outils de capture, de visualisation et de communication de l'état des services de l'ENT !

## Build Setup

### Exigence

- [Node](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Compose](https://docs.docker.com/compose/)

### Utilisation de Compose

```bash
# construit les images des services du .yml
$ docker-compose build
# crée et (re)démarre les conteneurs des services du .yml
$ docker-compose up
# met en pause les conteneurs des services du .yml
$ docker-compose stop
# arrête et détruit les conteneurs des services du .yml
$ docker-compose down
```
