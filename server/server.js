import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDb } from "./lib/db.js";
import userRouter from "./routes/routes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

// creating ap using expres and http
const app = express();
const server = http.createServer(app);

// initiealizing the socoket io
export const io = new Server(server, {
  cors: { origin: "*" },
});

// this for to store user online
export const userSocketMap = {}; // {userId: socketId}

// Socket,io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("user connected", userId);
  if (userId) userSocketMap[userId] = socket.id;

  // emit online users to all connected users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// middle ware apps
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// route setupd yeah
app.use("/api/status", (req, res) => {
  res.send("Server is live.");
});
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// connecteditn to mongdb
await connectDb();

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => {
    console.log("Server is runnig on port:", PORT);
  });
}

// export "server" for vercel
export default server;
