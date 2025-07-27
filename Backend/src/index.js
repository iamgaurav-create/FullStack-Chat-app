import express from 'express';
import authroute from "./routes/auth.route.js";
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import messageauth from "./routes/message.route.js";
import cors from "cors";
import { app, server } from './lib/socket.js';
import path from 'path';

dotenv.config();


// ✅ Set payload limits only ONCE here
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

app.use(cookieParser());

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use("/api/auth", authroute);
app.use("/api/messages", messageauth);

if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname, "../Frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"));
  })

}

server.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
  connectDB();
});
