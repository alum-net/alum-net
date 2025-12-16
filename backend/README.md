# Backend — Alum-net

This is the **backend service** of the *Alum-net* Virtual Learning Environment (VLE). It is implemented in **Java**, uses a **hexagonal architecture** (also known as Ports & Adapters), and is managed with **Gradle** and Docker.

### Overview

The backend:

* Implements core business logic and domain services.
* Uses **PostgreSQL** and **MongoDB** for persistence.
* Applies a **hexagonal architecture** pattern to separate **domain logic** from **infrastructure and external dependencies** (adapters and frameworks). ([GitHub][1])
* Exposes REST APIs for frontend clients (web SPA and mobile).
* Is containerized for development and deployment.

---

Here’s a **clear block explaining how to run the backend project**, including using a `.env` file in the `/docker-config` directory so that your Docker Compose setup picks up all necessary environment variables:

---

### 📌 How to Run the Backend

1. **Create your `.env` file**

   * Inside the `docker-config/` folder, create a file named `.env`.
   * Add all required environment variables there (e.g., DB credentials, service URLs, secrets).
   * This file will be automatically used by Docker Compose to inject environment variables into the containers. ([docs.rapidminer.com][1])

2. **Recreate the Docker network**

   ```
   docker network create red-alumnet
   ```

3. **Start backend and its dependencies**

   ```
   docker compose -f db-compose.yml -f keycloak-compose.yml -f backend-compose.yml -f frontend-compose.yml up -d --build
   ```

4. **Rebuild only the backend container** (if needed)

   ```
   docker compose -f backend-compose.yml build --no-cache backend
   docker compose up -d --force-recreate backend
   ```

5. **Refresh a specific container’s environment variables**

   ```
   docker compose -f <compose-file> up -d --force-recreate <container>
   ```

6. **Stop and remove all backend-related containers and volumes**

   ```
   docker compose -f db-compose.yml -f keycloak-compose.yml -f backend-compose.yml -f frontend-compose.yml down -v
   ```
---

## Project Structure (high level)

```
backend/
├── src/                  ← Java source with application layers
├── build.gradle / gradle/ ← Gradle build configuration
├── docker/               ← Docker resources for backend
├── config/               ← Config files (env, properties)
└── …                    ← Supporting scripts and resources
```

> The backend separates core application logic from external concerns via a hexagonal architecture (Ports & Adapters), which isolates domain logic from details like databases and APIs. ([GitHub][1])
