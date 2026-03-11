# 🚀 API Playground

A cloud-based API testing tool that lets developers send HTTP requests, save collections, track history, and collaborate via shareable links — all from the browser, no installation needed.

> Built as a cloud-based alternative to Postman with full cloud sync, Docker containerization, environment variables, and a stats dashboard.

![Status](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-20-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green) ![Docker](https://img.shields.io/badge/Docker-Containerized-blue)

---

## 🌐 Live Demo

https://api-playground-frontend.onrender.com

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

```
┌─────────────────────────────────────────────────┐
│                   USER BROWSER                   │
│         React + TypeScript + Tailwind CSS        │
│         Served by nginx inside Docker            │
│         Deployed on Render (Docker Container)    │
└─────────────────────┬───────────────────────────┘
                      │ HTTPS REST API
┌─────────────────────▼───────────────────────────┐
│                 BACKEND SERVER                   │
│           Node.js + Express + TypeScript         │
│           Running inside Docker Container        │
│              Deployed on Render                  │
└─────────────────────┬───────────────────────────┘
                      │ Mongoose ODM
┌─────────────────────▼───────────────────────────┐
│               MONGODB ATLAS                      │
│         Cloud Database (AWS ap-south-1)          │
│   Users │ Requests │ Collections │ History       │
│         Environments │ Share Tokens              │
└─────────────────────────────────────────────────┘
```

---

## 🐳 Docker Architecture

```
docker-compose up
       ↓
┌──────────────────────────────────────┐
│         app-network (bridge)         │
│                                      │
│  ┌─────────────────────────────┐     │
│  │   api-playground-frontend   │     │
│  │   nginx:alpine              │     │
│  │   Port: 8080:80             │     │
│  └─────────────────────────────┘     │
│                                      │
│  ┌─────────────────────────────┐     │
│  │   api-playground-backend    │     │
│  │   node:20-alpine            │     │
│  │   Port: 3001:3001           │     │
│  └─────────────────────────────┘     │
└──────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS, Zustand, Axios |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB Atlas |
| Authentication | JWT (JSON Web Tokens) + bcryptjs |
| Containerization | Docker + Docker Compose |
| Frontend Server | nginx (inside Docker) |
| Frontend Hosting | Render (Docker container) |
| Backend Hosting | Render (Docker container) |
| Version Control | Git + GitHub |
| CI/CD | GitHub → Render (auto deploy on push) |

---

## 📁 Project Structure

```
api-playground/
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── sidebar/       # Sidebar, ShareModal
│   │   │   ├── request/       # RequestPanel, SaveModal
│   │   │   ├── response/      # ResponsePanel
│   │   │   ├── environment/   # EnvironmentManager
│   │   │   └── Layout.tsx
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── StatsPage.tsx
│   │   │   └── ImportPage.tsx
│   │   ├── store/
│   │   │   └── requestStore.ts  # Zustand global state
│   │   └── api/
│   │       ├── client.ts        # Axios instance with JWT
│   │       └── sendRequest.ts   # HTTP request sender
│   ├── Dockerfile               # Frontend Docker image (nginx)
│   ├── nginx.conf               # nginx config for React Router
│   └── package.json
│
├── backend/                   # Node.js backend
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Request.ts
│   │   │   ├── Collection.ts
│   │   │   ├── History.ts
│   │   │   └── Environment.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── requests.ts
│   │   │   ├── collections.ts
│   │   │   ├── history.ts
│   │   │   └── environments.ts
│   │   ├── middleware/
│   │   │   └── auth.ts          # JWT middleware
│   │   ├── db.ts                # MongoDB connection
│   │   └── server.ts            # Express app
│   ├── Dockerfile               # Backend Docker image
│   └── package.json
│
├── docker-compose.yml         # Run all services locally
├── .env                       # Local environment variables
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Git
- Docker Desktop (for running with Docker)
- MongoDB Atlas account (free tier)

---

## Option A — Run with Docker (Recommended) 🐳

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

Make sure Docker Desktop is running on your machine.

### 4. Build and run all containers

```bash
docker-compose up --build
```

### 5. Open the app

| Service | URL |
|---|---|
| Frontend | http://localhost:8080 |
| Backend API | http://localhost:3001 |
| Health Check | http://localhost:3001/health |

---

### Useful Docker Commands

```bash
# Run in background (detached mode)
docker-compose up --build -d

# See all running containers
docker ps

# See all logs
docker-compose logs -f

# See backend logs only
docker-compose logs -f backend

# See frontend logs only
docker-compose logs -f frontend

# Stop all containers
docker-compose down

# Rebuild a single service
docker-compose up --build backend

# Remove all containers and volumes
docker-compose down -v
```

---

## Option B — Run without Docker

### 1. Clone the repository

```bash
git clone https://github.com/NehaBhask/api-playground.git
cd api-playground
```

### 2. Set up Backend

```bash
cd backend
npm install
```

Create `backend/.env`:
```
PORT=3001
JWT_SECRET=your_jwt_secret_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/apiplayground
```

Start backend:
```bash
npm run dev
```

Backend runs at: `http://localhost:3001`

### 3. Set up Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:3001
```

Start frontend:
```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## ☁️ Cloud Deployment (Docker Containers on Render)

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
nginx        Node.js
  ↓            ↓
Browser      MongoDB
             Atlas
```

Every push to `main` automatically rebuilds and redeploys both Docker containers. ✅

---

## 📊 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |

### Collections
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/collections` | Get all collections |
| POST | `/api/collections` | Create collection |
| DELETE | `/api/collections/:id` | Delete collection |
| POST | `/api/collections/:id/share` | Generate share link |
| POST | `/api/collections/:id/unshare` | Disable share link |
| GET | `/api/collections/shared/:shareId` | Get shared collection (public) |
| POST | `/api/collections/import/:shareId` | Import shared collection |

### Requests
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/requests` | Save request |
| PUT | `/api/requests/:id` | Update request |
| DELETE | `/api/requests/:id` | Delete request |

### History
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/history` | Get request history |
| GET | `/api/history/stats` | Get analytics stats |
| POST | `/api/history` | Save history entry |
| DELETE | `/api/history` | Clear all history |
| DELETE | `/api/history/:id` | Delete single entry |

### Environments
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
- All private routes protected by auth middleware
- Each user can only access their own data
- Shared collections expose only request metadata — no auth tokens stored
- HTTPS enforced on all Render deployments
- Docker containers run as non-root where possible

---

## 📈 Cloud Computing Concepts Demonstrated

| Concept | Implementation |
|---|---|
| Containerization | Docker packages frontend and backend into isolated containers |
| Container Orchestration | Docker Compose runs and networks all services together |
| Infrastructure as Code | Dockerfile defines reproducible environments |
| Database as a Service | MongoDB Atlas (fully managed cloud DB) |
| Platform as a Service | Render hosts Docker containers without server management |
| Reverse Proxy | nginx serves React app and handles routing inside container |
| Continuous Deployment | GitHub push triggers automatic redeploy on Render |
| Cloud Storage | All user data stored in MongoDB Atlas cloud |
| Multi-tenant SaaS | Multiple users with fully isolated data |
| REST API | Stateless HTTP API with full CRUD |
| Environment Config | Cloud env variables for secrets — never hardcoded |
| Container Networking | Docker bridge network connects frontend and backend |

---

## 👤 Author

Built as a cloud computing project demonstrating end-to-end cloud application development with Docker containerization, CI/CD, and cloud deployment.

---

## 📄 License

MIT
