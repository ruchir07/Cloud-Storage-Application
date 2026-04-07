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

EC2 Deployment Guide (Complete Step-by-Step)
1️⃣ Launch EC2 Instance
Ubuntu 22.04
Instance type: t2.micro
Allow inbound security group rules:
Port 22 → SSH
Port 80 → HTTP
Port 5000 → Backend API
SSH into instance:
ssh -i your-key.pem ubuntu@your-public-ip
2️⃣ Install Required Software
Update server
sudo apt update && sudo apt upgrade -y
Install Node.js & npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
Install PM2
sudo npm install -g pm2
🗂️ 3️⃣ Clone the Project
git clone https://github.com/ruchir07/Cloud-Storage-Application.git
cd Cloud-Storage-Application
🛠️ 4️⃣ Backend Setup

Go into the backend folder:

cd backend
Install dependencies:
npm install
Create .env
MONGO_URI=your-mongo-uri
JWT_SECRET=your-secret
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
PORT=5000
Start backend using PM2:
pm2 start server.js --name cloud-backend
pm2 save

Check logs:

pm2 logs cloud-backend
🎨 5️⃣ Frontend Setup (Vite + NGINX)

Go to frontend folder:

cd ../frontend
Install dependencies:
npm install
⚠️ Create frontend .env

This fixes the earlier bug where Vite client was still calling localhost:5000.

Create:

.env

Add:

VITE_API_URL=http://YOUR_PUBLIC_IP:5000/api
Build production frontend:
npm run build

This creates a dist/ folder.

🌐 6️⃣ Install & Configure NGINX
Install NGINX:
sudo apt install nginx -y
Configure nginx to serve frontend

Open config:

sudo nano /etc/nginx/sites-available/default

Replace content with:

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

Save → Reload nginx:

sudo systemctl restart nginx
🔥 7️⃣ Verify Deployment
Frontend → http://YOUR_PUBLIC_IP
Backend → http://YOUR_PUBLIC_IP:5000/api/auth/login (POST)

Everything should work smoothly.

🐞 Issues Faced & How They Were Fixed
❌ Issue 1 — API kept calling localhost:5000

Cause: React frontend had fallback code:

import.meta.env.VITE_API_URL || "http://localhost:5000/api"

In AWS, this made browser hit:

localhost:5000

…which caused the error:

"resource is in more-private address space loopback"

Fix:
Created .env in frontend:

VITE_API_URL=http://PUBLIC_IP:5000/api

Then rebuilt:

npm run build
sudo systemctl restart nginx
❌ Issue 2 — Frontend dist/ not found

Cause: No build was executed before deployment.
Fix:
Ran:

npm run build

This generated the production folder.

❌ Issue 3 — NGINX not serving frontend

Cause: Wrong root directory or wrong location block.
Fix: Updated nginx config:

root /home/ubuntu/Cloud-Storage-Application/frontend/dist;
try_files $uri /index.html;
❌ Issue 4 — CORS Errors

Root cause: frontend talking to backend on localhost instead of public IP.

Fix: Correct API URL in frontend .env.

📌 Commands Cheat Sheet
Task	Command
Restart NGINX	sudo systemctl restart nginx
PM2 logs	pm2 logs cloud-backend
PM2 restart	pm2 restart cloud-backend
Build frontend	npm run build
