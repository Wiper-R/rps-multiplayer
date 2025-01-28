import express from "express";
import { Server as SocketServer } from "socket.io";
import http from "http";
import { router } from "./api/v1";
import env from "./env";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { Player } from "./socket/player";

const app = express();
app.all("/api/v1/auth/*", toNodeHandler(auth));
app.use(express.json());

app.use("/api/v1", router);
const server = http.createServer(app);

const io = new SocketServer(server);

io.on("connection", async (socket) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(socket.handshake.headers),
  });
  if (!session) return socket.disconnect();
  const user = session.user;
  const player = new Player({
    id: user.id,
    image: user.image || null,
    name: user.name,
    socket,
  });

  socket.on("disconnect", () => {
    player.destory();
  });
});

if (process.env.NODE_ENV != "test") {
  server.listen(env.PORT);
  console.log("Server is running on port 5000");
}
