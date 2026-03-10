# API Playground

A cloud-based API testing tool that lets developers send HTTP requests, save collections, track history, and collaborate via shareable links — all from the browser, no installation needed.

> Built as an alternative to Postman with full cloud sync, environment variables, and a stats dashboard.

![API Playground](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-20-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

---

## Live Demo

| Service | URL |
|---|---|
| Frontend | https://your-app.vercel.app |
| Backend | https://your-backend.onrender.com |

---

## Features

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

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   USER BROWSER                   │
│         React + TypeScript + Tailwind CSS        │
│              Deployed on Vercel (CDN)            │
└─────────────────────┬───────────────────────────┘
                      │ HTTPS REST API
┌─────────────────────▼───────────────────────────┐
│                 BACKEND SERVER                   │
│           Node.js + Express + TypeScript         │
│              Deployed on Render                  │
└─────────────────────┬───────────────────────────┘
                      │ Mongoose ODM
┌─────────────────────▼───────────────────────────┐
│               MONGODB ATLAS                      │
│         Cloud Database (AWS ap-south-1)          │
│   Users │ Requests │ Collections │ History       │
│         │ Environments │ Share Tokens            │
└─────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS, Zustand, Axios |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB Atlas |
| Authentication | JWT (JSON Web Tokens) + bcryptjs |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Version Control | Git + GitHub |
| CI/CD | GitHub → Vercel + Render (auto deploy) |

---

## Project Structure

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
│   └── package.json
│
└── README.md
```

---

## Local Development

### Prerequisites

- Node.js 18+
- Python 3.10+ (optional, not required for this project)
- Git
- MongoDB Atlas account (free tier)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/api-playground.git
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

## ☁️ Cloud Deployment

### Frontend → Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import repo
3. Set **Root Directory** to `frontend`
4. Add environment variable: `VITE_API_URL` = your Render backend URL
5. Deploy — Vercel auto-deploys on every push 

### Backend → Render

1. Go to [render.com](https://render.com) → New Web Service
2. Connect GitHub repo
3. Set **Root Directory** to `backend`
4. Set **Build Command**: `npm install; npm run build`
5. Set **Start Command**: `npm start`
6. Add environment variables:
   - `MONGODB_URI` → MongoDB Atlas connection string
   - `JWT_SECRET` → your secret key
   - `PORT` → `3001`
7. Deploy — Render auto-deploys on every push 

---

## 🔄 CI/CD Pipeline

```
git push origin main
        ↓
    GitHub
        ↓
  ┌─────┴─────┐
  ▼           ▼
Vercel      Render
  ↓           ↓
Frontend    Backend
deploys     deploys
~1 min      ~3 mins
```

Every push to `main` automatically deploys both frontend and backend with zero manual steps.

---

## API Endpoints

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

## Security

- Passwords hashed with **bcryptjs** (salt rounds: 10)
- Authentication via **JWT tokens** (7 day expiry)
- All private routes protected by auth middleware
- Each user can only access their own data
- Shared collections expose only request metadata — no auth tokens or sensitive header values stored

---

## Cloud Computing Concepts Demonstrated

| Concept | Implementation |
|---|---|
| Database as a Service | MongoDB Atlas (managed cloud DB) |
| Platform as a Service | Vercel + Render (no server management) |
| CDN | Vercel edge network serves frontend globally |
| Continuous Deployment | GitHub push triggers auto deploy |
| Cloud Storage | All data in cloud — no local files |
| Multi-tenant SaaS | Multiple users with isolated data |
| REST API | Stateless HTTP API |
| Environment Config | Cloud env variables for secrets |

---

## Author

Built as a cloud computing project demonstrating end-to-end cloud application development.

---

## 📄 License

MIT
