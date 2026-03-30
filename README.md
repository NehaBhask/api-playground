# 🚀 API Playground

A cloud-based API testing tool that lets developers send HTTP requests, save collections, track history, and collaborate via shareable links — all from the browser, no installation needed.

> Built as a cloud-based alternative to Postman with microservices architecture, Docker containerization, environment variables, and a stats dashboard.

![Status](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-20-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green) ![Docker](https://img.shields.io/badge/Docker-Containerized-blue) ![Microservices](https://img.shields.io/badge/Architecture-Microservices-orange)

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| Frontend | https://api-playground-frontend.onrender.com |

---

## ✨ Features

- **Request Builder** — Send GET, POST, PUT, PATCH, DELETE requests with custom headers, params, and JSON body
- **Response Viewer** — Syntax-highlighted JSON response with status code, response time, and size
- **Collections** — Save and organize requests into named collections, synced to the cloud
- **Request History** — Every request auto-saved with timestamp, status code, and response time
- **Environment Variables** — Create environments with `{{VARIABLE}}` substitution in URLs, headers, and body
- **Share Collections** — Generate a public link to share collections with teammates
- **Import Collections** — One-click import of shared collections into your account
- **Stats Dashboard** — Analytics showing total requests, success rate, method breakdown, and top APIs
- **User Authentication** — Register/login with JWT-based auth, all data isolated per user

---

## 🏗️ Architecture

### High Level

```
┌─────────────────────────────────────────────────┐
│                   USER BROWSER                   │
│         React + TypeScript + Tailwind CSS        │
│         Served by nginx inside Docker            │
│         Deployed on Render (Docker Container)    │
└─────────────────────┬───────────────────────────┘
                      │ HTTPS REST API
┌─────────────────────▼───────────────────────────┐
│              API GATEWAY (nginx)                 │
│         Single entry point — port 3000           │
│         Routes requests to microservices         │
└──────┬──────────┬────────────┬───────────────────┘
       │          │            │            │
       ▼          ▼            ▼            ▼
  auth-service  collection  history   environment
    :3001        :3002       :3003       :3004
       │          │            │            │
       └──────────┴────────────┴────────────┘
                         │
              ┌──────────▼──────────┐
              │    MongoDB Atlas    │
              │  Cloud Database     │
              │  (AWS ap-south-1)   │
              └─────────────────────┘
```

### Microservices Architecture

```
docker-compose up
       ↓
┌────────────────────────────────────────────────┐
│              app-network (bridge)              │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │         api-gateway (nginx)              │  │
│  │         Port: 3000                       │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  ┌─────────────┐  ┌──────────────────────┐     │
│  │auth-service │  │ collection-service   │     │
│  │Port: 3001   │  │ Port: 3002           │     │
│  └─────────────┘  └──────────────────────┘     │
│                                                │
│  ┌─────────────┐  ┌──────────────────────┐     │
│  │history-     │  │ environment-service  │     │
│  │service:3003 │  │ Port: 3004           │     │
│  └─────────────┘  └──────────────────────┘     │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │    api-playground-frontend (nginx)       │  │
│  │    Port: 8080                            │  │
│  └──────────────────────────────────────────┘  │
└────────────────────────────────────────────────┘
```

### API Gateway Routing

```
/api/auth/*          → auth-service:3001
/api/collections/*   → collection-service:3002
/api/requests/*      → collection-service:3002
/api/history/*       → history-service:3003
/api/environments/*  → environment-service:3004
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS, Zustand, Axios |
| API Gateway | nginx (reverse proxy + load balancer) |
| Auth Service | Node.js, Express, TypeScript, JWT, bcryptjs |
| Collection Service | Node.js, Express, TypeScript, Mongoose |
| History Service | Node.js, Express, TypeScript, Mongoose |
| Environment Service | Node.js, Express, TypeScript, Mongoose |
| Database | MongoDB Atlas |
| Containerization | Docker + Docker Compose |
| Frontend Server | nginx (inside Docker) |
| Cloud Deployment | Render (Docker containers) |
| Version Control | Git + GitHub |
| CI/CD | GitHub → Render (auto deploy on push) |

---

## 📁 Project Structure

```
api-playground/
├── frontend/                      # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── sidebar/           # Sidebar, ShareModal
│   │   │   ├── request/           # RequestPanel, SaveModal
│   │   │   ├── response/          # ResponsePanel
│   │   │   ├── environment/       # EnvironmentManager
│   │   │   └── Layout.tsx
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── StatsPage.tsx
│   │   │   └── ImportPage.tsx
│   │   ├── store/
│   │   │   └── requestStore.ts    # Zustand global state
│   │   └── api/
│   │       ├── client.ts          # Axios with JWT interceptor
│   │       └── sendRequest.ts     # HTTP request sender
│   ├── Dockerfile                 # nginx + React build
│   ├── nginx.conf                 # React Router support
│   └── package.json
│
├── services/                      # Microservices
│   ├── auth-service/              # Login, Register, Token verify
│   │   ├── src/server.ts
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── collection-service/        # Collections + Requests
│   │   ├── src/server.ts
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── history-service/           # History + Stats
│   │   ├── src/server.ts
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── environment-service/       # Environment Variables
│       ├── src/server.ts
│       ├── Dockerfile
│       └── package.json
│
├── api-gateway/                   # nginx API Gateway
│   ├── nginx.conf                 # Routing rules
│   └── Dockerfile
│
├── backend/                       # Legacy monolithic backend
│                                  # (kept for reference + cloud deployment)
│
├── docker-compose.yml             # Orchestrates all 6 containers
├── .env                           # Local environment variables
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Git
- Docker Desktop
- MongoDB Atlas account (free tier)

---

## Option A — Run with Docker Compose (Recommended) 🐳

This starts all 6 containers — frontend, API gateway, and all 4 microservices.

### 1. Clone the repository

```bash
git clone https://github.com/NehaBhask/api-playground.git
cd api-playground
```

### 2. Create `.env` in root folder

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/apiplayground
JWT_SECRET=your_jwt_secret_here
```

### 3. Start Docker Desktop

Make sure Docker Desktop is running (whale icon in taskbar).

### 4. Build and run all containers

```bash
docker-compose up --build
```

### 5. Open the app

| Service | URL |
|---|---|
| Frontend | http://localhost:8080 |
| API Gateway | http://localhost:3000 |
| Auth Service | http://localhost:3001 |
| Collection Service | http://localhost:3002 |
| History Service | http://localhost:3003 |
| Environment Service | http://localhost:3004 |

### 6. Test all health checks

```
http://localhost:3000/health   ← API Gateway
http://localhost:3001/health   ← Auth Service
http://localhost:3002/health   ← Collection Service
http://localhost:3003/health   ← History Service
http://localhost:3004/health   ← Environment Service
```

---

### Useful Docker Commands

```bash
# Run in background
docker-compose up --build -d

# See all running containers
docker ps

# See all logs
docker-compose logs -f

# See specific service logs
docker-compose logs -f auth-service
docker-compose logs -f collection-service
docker-compose logs -f history-service
docker-compose logs -f environment-service
docker-compose logs -f api-gateway

# Stop all containers
docker-compose down

# Rebuild single service
docker-compose up --build auth-service

# Remove all containers and volumes
docker-compose down -v
```

---

## Option B — Run without Docker

### 1. Start each microservice separately

```bash
# Terminal 1 - Auth Service
cd services/auth-service
npm install
npm run dev   # runs on port 3001

# Terminal 2 - Collection Service
cd services/collection-service
npm install
npm run dev   # runs on port 3002

# Terminal 3 - History Service
cd services/history-service
npm install
npm run dev   # runs on port 3003

# Terminal 4 - Environment Service
cd services/environment-service
npm install
npm run dev   # runs on port 3004
```

### 2. Start frontend

```bash
cd frontend
npm install
npm run dev   # runs on port 5173
```

Each service needs its own `.env` file with `MONGODB_URI`, `JWT_SECRET`, and `AUTH_SERVICE_URL`.

---

## ☁️ Cloud Deployment

### Deployed Architecture

The application is deployed on Render using Docker containers:

```
GitHub push → Render auto deploys → Docker containers live in cloud
```

### Deploy Backend → Render (Docker)

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect GitHub repo
3. Set **Root Directory** to `backend`
4. Set **Environment** to `Docker`
5. Add environment variables:
   - `MONGODB_URI` → MongoDB Atlas URI
   - `JWT_SECRET` → secret key
   - `PORT` → `3001`
6. Click **Deploy**

### Deploy Frontend → Render (Docker)

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect GitHub repo
3. Set **Root Directory** to `frontend`
4. Set **Environment** to `Docker`
5. Click **Deploy**

### CI/CD Pipeline

```
git push origin main
        ↓
    GitHub
        ↓
  ┌─────┴──────┐
  ▼            ▼
Render       Render
Docker       Docker
Container    Container
(Frontend)   (Backend)
  ↓            ↓
Browser      MongoDB
             Atlas
```

Every push to `main` automatically rebuilds and redeploys. ✅

---

## 📊 API Endpoints

All requests go through the **API Gateway at port 3000**.

### Auth Service (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/verify` | Verify JWT token (internal) |

### Collection Service (`/api/collections`, `/api/requests`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/collections` | Get all collections |
| POST | `/api/collections` | Create collection |
| DELETE | `/api/collections/:id` | Delete collection |
| POST | `/api/collections/:id/share` | Generate share link |
| POST | `/api/collections/:id/unshare` | Disable share link |
| GET | `/api/collections/shared/:shareId` | Get shared collection (public) |
| POST | `/api/collections/import/:shareId` | Import shared collection |
| POST | `/api/requests` | Save request |
| PUT | `/api/requests/:id` | Update request |
| DELETE | `/api/requests/:id` | Delete request |

### History Service (`/api/history`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/history` | Get request history |
| GET | `/api/history/stats` | Get analytics stats |
| POST | `/api/history` | Save history entry |
| DELETE | `/api/history` | Clear all history |
| DELETE | `/api/history/:id` | Delete single entry |

### Environment Service (`/api/environments`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/environments` | Get all environments |
| POST | `/api/environments` | Create environment |
| PUT | `/api/environments/:id` | Update environment |
| DELETE | `/api/environments/:id` | Delete environment |

---

## 🔐 Security

- Passwords hashed with **bcryptjs** (salt rounds: 10)
- Authentication via **JWT tokens** (7 day expiry)
- Each microservice verifies tokens by calling auth-service `/verify`
- All private routes protected by auth middleware
- Each user can only access their own data
- Shared collections expose only metadata — no auth tokens stored
- HTTPS enforced on all Render deployments
- Docker containers use lightweight alpine images

---

## 📈 Cloud Computing Concepts Demonstrated

| Concept | Implementation |
|---|---|
| **Microservices Architecture** | 4 independent services (auth, collection, history, environment) |
| **API Gateway Pattern** | nginx routes all requests to correct microservice |
| **Service-to-Service Communication** | Services call auth-service to verify tokens |
| **Containerization** | Each service runs in its own Docker container |
| **Container Orchestration** | Docker Compose manages all 6 containers |
| **Infrastructure as Code** | Dockerfiles define reproducible environments |
| **Database as a Service** | MongoDB Atlas (fully managed cloud DB) |
| **Platform as a Service** | Render hosts containers without server management |
| **Continuous Deployment** | GitHub push triggers automatic redeploy |
| **Cloud Storage** | All user data stored in MongoDB Atlas |
| **Multi-tenant SaaS** | Multiple users with fully isolated data |
| **REST API** | Stateless HTTP API with full CRUD |
| **Reverse Proxy** | nginx API Gateway proxies to backend services |
| **Container Networking** | Docker bridge network connects all services |
| **Environment Config** | Cloud env variables — secrets never hardcoded |

---

## 👤 Author

Built as a cloud computing project demonstrating end-to-end cloud application development with microservices architecture, Docker containerization, and CI/CD pipeline.

---

## 📄 License

MIT