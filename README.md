<div align="center">

  <img src="https://raw.githubusercontent.com/iamgaurav-create/FullStack-Chat-app/main/assets/banner.png" alt="FullStack Chat App Banner" width="100%" />

  <h1>💬 FullStack Chat App</h1>
  <p>A real-time chat application with modern full-stack technologies</p>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" />
  <img src="https://img.shields.io/badge/Node.js-18-green?logo=node.js" />
  <img src="https://img.shields.io/badge/Socket.IO-black?logo=socket.io" />
  <img src="https://img.shields.io/badge/MongoDB-47a248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38b2ac?logo=tailwind-css&logoColor=white" />
</div>

---

## 📸 Preview

> 📷 *Replace these image links with your own screenshots or demo GIFs.*

<img src="https://user-images.githubusercontent.com/00000000/chat-demo-1.png" width="700" />
<img src="https://user-images.githubusercontent.com/00000000/chat-demo-2.png" width="700" />

---

## 🚀 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, DaisyUI
- **Backend**: Node.js, Express.js
- **Realtime Engine**: Socket.IO
- **Database**: MongoDB with Mongoose (or Drizzle + DragonflyDB)
- **Authentication**: JWT, bcrypt
- **State Management**: Zustand or React Context
- **Media**: Multer, Cloudinary *(optional)*

---

## ✨ Features

- 🔐 User Authentication with JWT
- 💬 Real-Time Messaging via Socket.IO
- 🏠 Room-based Conversations
- 👥 User Presence and Typing Indicators
- 🕓 Chat History with Persistent Storage
- 🎨 Clean, Responsive UI using Tailwind + DaisyUI
- 🖼️ Optional profile image upload (Cloudinary)

---

## 🛠️ Getting Started

### ⚙️ Prerequisites

- Node.js ≥ 18
- MongoDB URI
- Optional: Cloudinary API (for image uploads)

### 📦 Installation

```bash
# Clone the repository
git clone https://github.com/iamgaurav-create/FullStack-Chat-app.git
cd FullStack-Chat-app

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install


🔐 Environment Variables
Create a .env file in the /backend folder with the following:

PORT=5001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

▶️ Running the App

# Start the backend server
cd backend
npm run dev

# Start the frontend app
cd ../frontend
npm run dev

Access the app at: http://localhost:5173

📁 Folder Structure

FullStack-Chat-app/
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.jsx
├── backend/
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── models/
│       └── server.js


⭐ Show Support
🙌 Acknowledgements
📬 Stay in Touch






