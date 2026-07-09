import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";

import authRoutes from "./routes/auth.js";
import otpRoutes from "./routes/otp.js";
import itemRoutes from "./routes/itemRoutes.js";
import claimRoutes from "./routes/claimRoute.js";
import chatRoutes from "./routes/chatRoutes.js";

import initSocket from "./socket.js";

const app = express();

const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/claim", claimRoutes);
app.use("/api/chat", chatRoutes);

// ERROR HANDLER
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message || "Server Error",
  });
});

const server = http.createServer(app);

initSocket(server);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");

    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
