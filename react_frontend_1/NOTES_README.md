# 1. Installation

```bash
npm create vite@latest react_frontend_1 -- --template react
```

# 2. Run app inside docker container

https://medium.com/@kiruthikaganesan757/containerizing-my-react-js-app-with-docker-00814df009b6

create Dockerfile | .dockerignore

```bash
docker build -t react_frontend_1 .
docker run -p 80:80 react_frontend_1
```