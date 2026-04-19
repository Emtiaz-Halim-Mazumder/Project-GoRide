import dotenv from "dotenv";
import validateEnv from "./src/lib/env.js";
dotenv.config({ path: ".env.local" });
validateEnv();
import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Make io accessible globally for API routes if needed
  global._io = io;

  io.on("connection", (socket) => {
    console.log("[Socket.io] Client connected:", socket.id);

    // Join a ride chat room
    socket.on("join-ride", (rideId) => {
      socket.join(`ride-${rideId}`);
      console.log(`[Socket.io] ${socket.id} joined ride-${rideId}`);
    });

    // Leave a ride chat room
    socket.on("leave-ride", (rideId) => {
      socket.leave(`ride-${rideId}`);
    });

    // Relay chat message to the ride room (broadcast to everyone EXCEPT the sender)
    socket.on("send-message", (data) => {
      // data: { rideId, senderName, senderRole, content, _id, createdAt }
      // socket.to() excludes the sender so they don't get a duplicate echo
      socket.to(`ride-${data.rideId}`).emit("new-message", data);
    });

    // Broadcast ride status change to everyone
    socket.on("ride-status-update", (data) => {
      // data: { rideId, status, origin, destination }
      io.emit("ride-status-changed", data);
    });

    socket.on("disconnect", () => {
      console.log("[Socket.io] Client disconnected:", socket.id);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
