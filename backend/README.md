# alum-net

## Usefull commands to manage docker
### Run the project
- docker compose -f backend-compose.yml -f keycloak-compose.yml up -d
### Re-build the backend container
- docker compose -f backend-compose.yml build --no-cache backend
- docker compose up -d --force-recreate backend
### Reload any container to refresh env variables
- docker compose -f <file_describing_container> up -d --force-recreate <container>
### Destroy all the containers
- docker compose -f backend-compose.yml -f keycloak-compose.yml down -v