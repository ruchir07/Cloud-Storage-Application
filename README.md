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

## Setup Instructions

### 1. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the `.env.template` and add your MongoDB URI and Cloudinary credentials:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_cluster_uri_here
   JWT_SECRET=your_jwt_secret_here

   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
4. Start the server (development mode):
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add a `.env` file with backend base URL (should match the template):
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend:
   ```bash
   npm run dev
   ```

## Next steps & Deployment
- Deploy the backend API to Heroku/Render matching the ENV configurations.
- Update the Frontend's `.env` production API URl and bundle it (npm run build).
- Host the frontend using Vercel, Netlify, or similar platforms.
