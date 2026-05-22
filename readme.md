# Veterinaria App

Veterinary management system for tracking owners, pets, vaccines, and consultations.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + Tailwind CSS |
| Backend | Node.js + Express 5 + Sequelize 6 |
| Database | MySQL 8 (Docker) / SQLite (local development) |
| Proxy | Nginx |
| Containers | Docker Compose |

## Structure

```
veterinaria/
├── backend/          # REST API (Express)
├── frontend/         # SPA (React + Vite)
├── nginx/
│   └── nginx.conf    # Reverse proxy
└── docker-compose.yml
```

## Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — for the Docker environment
- Node.js 20+ — only for local development

## Running with Docker

```bash
# Enter the project directory
cd veterinaria

# (Optional) Create a .env file with your values
cp backend/.env.example .env

# Build and start all services
docker compose up --build -d
```

The app will be available at **http://localhost**.

### Environment variables (`.env`)

```env
DB_NAME=veterinaria
DB_USER=vet_user
DB_PASS=vet_pass
DB_ROOT_PASS=rootpassword
JWT_SECRET=change_this_in_production
JWT_EXPIRES_IN=7d
```

If no `.env` file is provided, Docker Compose falls back to the default values defined in `docker-compose.yml`.

### Services

| Service | Container | Internal port |
|---|---|---|
| MySQL 8 | `vet_db` | 3306 |
| Node.js API | `vet_backend` | 4001 |
| React frontend | `vet_frontend` | 80 |
| Nginx proxy | `vet_nginx` | **80 → public** |

### Useful commands

```bash
# Check container status
docker compose ps

# Stream backend logs
docker compose logs -f backend

# Stop all services
docker compose down

# Stop and remove volumes (database)
docker compose down -v
```

## Local Development (without Docker)

### Backend

```bash
cd backend
npm install
cp .env.example .env   # edit as needed
npm run dev            # http://localhost:4001
```

> Without `DB_HOST` in `.env`, Sequelize automatically uses SQLite (`database.sqlite`).

### Frontend

```bash
cd frontend
npm install
npm run dev            # http://localhost:5174
```

Vite's dev proxy forwards `/api` and `/uploads` to the backend at `localhost:4001`.

## API Endpoints

### Owners `/api/owners`

| Method | Route | Description |
|---|---|---|
| GET | `/api/owners` | List all owners |
| GET | `/api/owners/:id` | Get owner by ID |
| POST | `/api/owners` | Create owner |
| PUT | `/api/owners/:id` | Update owner |
| DELETE | `/api/owners/:id` | Delete owner |

### Pets `/api/pets`

| Method | Route | Description |
|---|---|---|
| GET | `/api/pets` | List all pets |
| GET | `/api/pets/:id` | Get pet by ID |
| POST | `/api/pets` | Create pet |
| PUT | `/api/pets/:id` | Update pet |
| DELETE | `/api/pets/:id` | Delete pet |

### Vaccines `/api/pets/:petId/vaccines`

| Method | Route | Description |
|---|---|---|
| GET | `/api/pets/:petId/vaccines` | List vaccines for a pet |
| POST | `/api/pets/:petId/vaccines` | Register vaccine |
| DELETE | `/api/pets/:petId/vaccines/:id` | Delete vaccine |

### Consultations `/api/pets/:petId/consultations`

| Method | Route | Description |
|---|---|---|
| GET | `/api/pets/:petId/consultations` | List consultations for a pet |
| POST | `/api/pets/:petId/consultations` | Register consultation |
| DELETE | `/api/pets/:petId/consultations/:id` | Delete consultation |

## Data Models

### Owner
| Field | Type |
|---|---|
| id | INTEGER PK |
| name | STRING |
| email | STRING (unique) |
| phone | STRING |
| address | STRING |

### Pet
| Field | Type |
|---|---|
| id | INTEGER PK |
| ownerId | FK → Owner |
| name | STRING |
| species | ENUM (dog, cat, bird, rabbit, other) |
| breed | STRING |
| age | FLOAT (years) |
| weight | FLOAT (kg) |
| sex | ENUM (male, female) |
| color | STRING |
| photo | STRING (path) |
| notes | TEXT |

## Docker Architecture

```
Internet
    │
    ▼
 nginx:80  (vet_nginx)
    ├── /api/*      → backend:4001  (vet_backend)
    ├── /uploads/*  → backend:4001
    └── /*          → frontend:80   (vet_frontend)

 backend ──→ db:3306 (vet_db — MySQL 8)
```

All services communicate through the internal `vet_net` bridge network.
