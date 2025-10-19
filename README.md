Comandos para limpiar y volver a cargar los contenedores (tras cambio de init o alguna config):
```
cd ./docker-config
docker compose -f .\keycloak-compose.yml -f .\db-compose.yml down
docker compose -f .\keycloak-compose.yml -f .\db-compose.yml down --volumes
docker network create red-alumnet
docker compose -f .\backend-compose.yml up -d --build
```
