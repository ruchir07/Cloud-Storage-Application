# Personal Cloud Storage App

A full-stack MERN application for personal file storage and management.

## Tech Stack
- **Frontend**: React (Vite), TailwindCSS, React Router, Axios
- **Backend**: Node.js, Express, MongoDB Atlas, Cloudinary, Multer
- **Authentication**: JWT & bcrypt

## Features
- User registration and authentication
- Clean, responsive glass-morphic/modern UI
- File uploads (any format) via Cloudinary integration
- File viewer grid with image previews and dynamic icons
- Quick download and deletion actions

# ☁️ Cloud Storage Application — EC2 Deployment Guide

A complete step-by-step guide to deploying the Cloud Storage Application on an AWS EC2 instance using Node.js, PM2, and NGINX.

---

## 📋 Table of Contents

- [1. Launch EC2 Instance](#1️⃣-launch-ec2-instance)
- [2. Install Required Software](#2️⃣-install-required-software)
- [3. Clone the Project](#3️⃣-clone-the-project)
- [4. Backend Setup](#4️⃣-backend-setup)
- [5. Frontend Setup](#5️⃣-frontend-setup-vite--nginx)
- [6. Install & Configure NGINX](#6️⃣-install--configure-nginx)
- [7. Verify Deployment](#7️⃣-verify-deployment)
- [🐞 Issues Faced & Fixes](#-issues-faced--how-they-were-fixed)
- [📌 Commands Cheat Sheet](#-commands-cheat-sheet)

---

## 1️⃣ Launch EC2 Instance

- **OS:** Ubuntu 22.04
- **Instance type:** `t2.micro`
- **Inbound Security Group Rules:**

| Port | Protocol | Purpose      |
|------|----------|--------------|
| 22   | TCP      | SSH          |
| 80   | TCP      | HTTP         |
| 5000 | TCP      | Backend API  |

**SSH into your instance:**

```bash
ssh -i your-key.pem ubuntu@your-public-ip
```

---

## 2️⃣ Install Required Software

**Update the server:**

```bash
sudo apt update && sudo apt upgrade -y
```

**Install Node.js & npm:**

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

**Install PM2:**

```bash
sudo npm install -g pm2
```

---

## 🗂️ 3️⃣ Clone the Project

```bash
git clone https://github.com/ruchir07/Cloud-Storage-Application.git
cd Cloud-Storage-Application
```

---

## 🛠️ 4️⃣ Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
MONGO_URI=your-mongo-uri
JWT_SECRET=your-secret
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
PORT=5000
```

Start the backend using PM2:

```bash
pm2 start server.js --name cloud-backend
pm2 save
```

Check logs:

```bash
pm2 logs cloud-backend
```

---

## 🎨 5️⃣ Frontend Setup (Vite + NGINX)

Navigate to the frontend folder:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

> ⚠️ **Important:** Create a `.env` file in the frontend directory.  
> This fixes the bug where the Vite client was still calling `localhost:5000`.

```env
VITE_API_URL=http://YOUR_PUBLIC_IP:5000/api
```

Build the production frontend:

```bash
npm run build
```

This generates the `dist/` folder used by NGINX.

---

## 🌐 6️⃣ Install & Configure NGINX

**Install NGINX:**

```bash
sudo apt install nginx -y
```

**Open the default config:**

```bash
sudo nano /etc/nginx/sites-available/default
```

**Replace the content with:**

```nginx
server {
    listen 80;
    server_name _;

    root /home/ubuntu/Cloud-Storage-Application/frontend/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:5000/api/;
    }
}
```

**Save and reload NGINX:**

```bash
sudo systemctl restart nginx
```

---

## 🔥 7️⃣ Verify Deployment

| What        | URL                                          |
|-------------|----------------------------------------------|
| Frontend    | `http://YOUR_PUBLIC_IP`                      |
| Backend API | `http://YOUR_PUBLIC_IP:5000/api/auth/login` (POST) |

Everything should now be working smoothly. ✅

---

## 🐞 Issues Faced & How They Were Fixed

### ❌ Issue 1 — API kept calling `localhost:5000`

**Cause:** React frontend had fallback code:

```js
import.meta.env.VITE_API_URL || "http://localhost:5000/api"
```

In AWS, this made the browser hit `localhost:5000`, causing the error:

```
resource is in more-private address space `loopback`
```

**Fix:** Created `.env` in the frontend directory:

```env
VITE_API_URL=http://PUBLIC_IP:5000/api
```

Then rebuilt:

```bash
npm run build
sudo systemctl restart nginx
```

---

### ❌ Issue 2 — Frontend `dist/` not found

**Cause:** No build was executed before deployment.

**Fix:** Ran:

```bash
npm run build
```

This generated the production `dist/` folder.

---

### ❌ Issue 3 — NGINX not serving frontend

**Cause:** Wrong root directory or incorrect location block.

**Fix:** Updated NGINX config:

```nginx
root /home/ubuntu/Cloud-Storage-Application/frontend/dist;
try_files $uri /index.html;
```

---

### ❌ Issue 4 — CORS Errors

**Root cause:** Frontend was talking to the backend on `localhost` instead of the public IP.

**Fix:** Set the correct API URL in the frontend `.env`:

```env
VITE_API_URL=http://YOUR_PUBLIC_IP:5000/api
```

---

## 📌 Commands Cheat Sheet

| Task              | Command                          |
|-------------------|----------------------------------|
| Restart NGINX     | `sudo systemctl restart nginx`   |
| PM2 logs          | `pm2 logs cloud-backend`         |
| PM2 restart       | `pm2 restart cloud-backend`      |
| Build frontend    | `npm run build`                  |
