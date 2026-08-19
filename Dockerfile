FROM node:20.15.1-alpine3.19

ENV DOCKERIZE_VERSION v0.7.0
RUN apk update --no-cache \
    && apk add --no-cache wget openssl \
    && wget -O - https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz | tar xzf - -C /usr/local/bin \
    && apk del wget

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx prisma generate

EXPOSE 3000

RUN ["chmod", "+x", "./docker-entrypoint.sh"]
ENTRYPOINT ["sh", "./docker-entrypoint.sh"]
