FROM node:12-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 4000

# set the correct timezone for date
RUN apk add --no-cache tzdata
ENV TZ=Europe/Paris

CMD ["npm", "run", "start"]