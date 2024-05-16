import http from "http";
import { Server, Socket } from "socket.io";
import app from "./app";
import { api, db, client } from "./config/config";
import verifySocketJwt from "./middleware/verifySocketJwt";
import mongoose from "mongoose";
import connectionHandler from "./socket-handlers/connectionHandler";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: client.url,
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  },
});

io.use(verifySocketJwt).on("connection", (socket: Socket) => {
  console.info("User connected");

  connectionHandler.joinAndSendChannels(socket);

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
