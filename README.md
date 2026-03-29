# Cuisine Courier - Catering Services App

A full-stack catering management platform connecting **Clients**, **Providers**, and **Administrators**.

- Clients can browse services and book events  
- Providers can manage offerings and bookings  
- Admins oversee the entire system  

Built with **React + Vite + TypeScript (Frontend)** and **Python FastAPI (Backend)**.

---

##  Table of Contents

- Features  
- Prerequisites  
- Project Structure  
- Setup Guide  
  - Clone the Repository  
  - Backend Setup  
  - Frontend Setup  
- Environment Variables  
- Running the Application  
- Deployment  
- Troubleshooting  

---

## Features

- **User Roles:** Clients, Providers, Admin dashboards  
- **Service Management:** Add/Edit/Delete services with images  
- **Booking System:** Book with date, guests, and location  
- **Payments:** Stripe + Mobile Money + Bank  
- **Reviews:** Clients can rate and review services  
- **Authentication:** JWT-based login system  
- **Admin Panel:** Manage users and system  

---

## Prerequisites

Make sure you have:

- Git  
- Node.js (v18 or higher)  
- Python (v3.10 or higher)  
- VS Code (Recommended)  

---

## Project Structure

```bash
catering_services_app/
│
├── backend/                  # FastAPI Backend
│   ├── app/
│   │   ├── main.py          # Entry point
│   │   ├── models.py        # Database models
│   │   └── ...
│   ├── .env                 # Create this
│   └── requirements.txt
│
└── frontend/
    └── cuisinecourier/      # React Frontend
        ├── src/
        │   ├── api.ts
        │   └── views/
        ├── .env             # Create this
        └── package.json
```

---

## Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/SMunganyinka/catering_services_app.git
cd catering_services_app
```

---

### 2. Backend Setup

```bash
cd backend
```

#### Create Virtual Environment

**Windows**
```bash
python -m venv venv
venv\Scripts\activate
```

**Mac/Linux**
```bash
python3 -m venv venv
source venv/bin/activate
```

#### Install Dependencies

```bash
pip install -r requirements.txt
```

#### Create `.env`

```env
DATABASE_URL=sqlite:///./catering.db
SECRET_KEY=your-super-secret-random-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

#### Run Backend

```bash
uvicorn app.main:app --reload
```

Backend runs on:  
http://127.0.0.1:8000

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend/cuisinecourier
```

#### Install Dependencies

```bash
npm install
```

#### Create `.env`

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

#### Run Frontend

```bash
npm run dev
```

Frontend runs on:  
 http://localhost:5173

---

##  Running the Application

- Open browser  
- Visit: http://localhost:5173  

### Default Role
- First registered user = **Client**

### Create Admin

1. Go to:
```
src/views/AuthView.tsx
```

2. Change:
```ts
role: "CLIENT"
```

to:
```ts
role: "ADMIN"
```

3. Register  
4. Revert back  

---

## Environment Variables

### Backend

| Variable | Description |
|--------|------------|
| DATABASE_URL | Database connection |
| SECRET_KEY | JWT secret |
| ALGORITHM | Encryption algorithm |
| ACCESS_TOKEN_EXPIRE_MINUTES | Token expiry |

### Frontend

| Variable | Description |
|--------|------------|
| VITE_API_BASE_URL | Backend API URL |

---

##  Deployment

- **Backend:** Render  
- **Frontend:** Netlify  

Check:
- `netlify.toml`
- Deployment docs  

---

## Troubleshooting

### Backend Errors
- Activate virtual environment  
- Reinstall dependencies  

### Frontend Env Issues
- Ensure `.env` is inside:
```
frontend/cuisinecourier/
```
- Restart server  

### CORS Errors
- Update `backend/app/main.py`
- Add frontend domain  

### Database Locked
- Avoid multiple writes (SQLite limitation)  

---

##  License

This project is **private**.  
All rights reserved.