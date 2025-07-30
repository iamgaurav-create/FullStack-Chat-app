import express from 'express';
import authroute from "./routes/auth.route.js";
import messageauth from "./routes/message.route.js";
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from "cors";
import { app, server } from './lib/socket.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Set payload limits
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(cookieParser());

// Cross-platform __dirname (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use environment-based CORS
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

// API routes
app.use("/api/auth", authroute);
app.use("/api/messages", messageauth);

// Serve frontend in production / on Render
if (process.env.RENDER === "true" || process.env.NODE_ENV === "production") {
const frontendPath = path.join(__dirname, "../../Frontend/dist");

  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
  connectDB();
});
