# 1. Installation
$ npm i -g @nestjs/cli
$ nest new nest_backend_1
to run the app:
$ cd nest_backend_1
$ npm run start OR $ $ npm run start:dev
than at 'http://localhost:3000/' --> see: 'Hello world!'
# 2. Run app inside docker container
create Dockerfile | docker-compose.yml | .env.example | .env
$ docker compose up --build