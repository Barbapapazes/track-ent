FROM node:12-alpine

WORKDIR /usr/src/app

COPY package.json ./
RUN npm install

COPY . .
EXPOSE 3000

RUN npm run build

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
RUN apk add --no-cache tzdata
ENV TZ=Europe/Paris

CMD [ "npm", "run", "start" ]
