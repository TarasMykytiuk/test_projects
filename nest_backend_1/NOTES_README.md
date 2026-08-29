# 1. Installation

```bash
npm i -g @nestjs/cli
nest new nest_backend_1
```

to run the app:

```bash
cd nest_backend_1
npm run start OR $ $ npm run start:dev
```

than at 'http://localhost:3000/' --> see: 'Hello world!'

# 2. Run app inside docker container

create Dockerfile | docker-compose.yml | .env.example | .env

```bash
docker compose up --build
```

# 3. Add Prisma 7 database

modify docker-compose.yml | .env.example | .env | Dockerfile

inside nest_backend_1 folder:

```bash
npm install -D prisma@^7.0.0
npm install @prisma/client@^7.0.0 @prisma/adapter-pg pg
npm install -D @types/pg
```

modify ./prisma/schema.prisma file
rename prisma7.config.ts into prisma.config.ts and modify
modify tsconfig.json

```bash
npx prisma generate 
npx nest g module prisma
npx nest g service prisma --no-spec
```

modify prisma.service.ts | prisma.module.ts

```bash
npm install prisma@^7.0.0 --save-prod ???
docker compose exec api npm install
docker compose exec api npx prisma generate
docker compose exec api npx prisma migrate dev --name init
docker compose up --build
```

than at 'http://localhost:3000/' --> see: 'Hello! This message is changed.'

# 4. Create auth module

modify schema.prisma

inside docker container:

```bash
docker compose exec api npx prisma migrate dev --name add_user_model
docker compose exec api npx prisma generate
```

inside nest_backend_1 folder:

```bash
npm install cookie-parser
npm install @nestjs/jwt
npm install @nestjs/passport passport passport-jwt bcrypt
npm install --save-dev @types/cookie-parser @types/passport-jwt @types/bcrypt
npm install @nestjs/swagger swagger-ui-express
npm install class-validator class-transformer
npx @nestjs/cli generate module auth
npx @nestjs/cli generate service auth
npx @nestjs/cli generate controller auth
```

create files: src/auth/guards/jwt-auth.guard.ts

---------------------------------

```bash
curl -s -D /dev/stderr -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "First User",
    "email": "first@email.com",
    "password": "1234qwer!Q"
  }' | jq
```

---------------------------------

modify main.ts --> add swagger
modify auth.controller.ts | auth.service.ts | auth.module.ts

---------------------------------

```bash
curl -i -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "first@email.com",
    "password": "1234qwer!Q"
  }'
```

---------------------------------