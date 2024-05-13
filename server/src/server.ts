import http from "http";
import { Server, Socket } from "socket.io";
import app from "./app";
import { api, db, client } from "./config/config";
import { sendMessage } from "./handlers/messages";
import mongoose from "mongoose";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: client.url,
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  },
});

io.on("connection", (socket: Socket) => {
  console.info("User connected");

  sendMessage(socket);

  socket.on("disconnect", () => {
    console.info("User disconnected");
  });
});

(async () => {
  try {
    server.listen(api.port, () => {
      console.info(`Server started on ${api.port}`);
    });

    if (!db.mongoUri) {
      throw new Error("Mongo URI is not provided");
    }
    await mongoose.connect(db.mongoUri);

    console.info("MongoDB connected");
  } catch (error) {
    console.error(error);
  }
})();
