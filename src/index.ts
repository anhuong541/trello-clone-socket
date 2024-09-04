import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import http from "http";

import { viewTasksProject, generateUidByString, checkUserIsAllowJoiningProject } from "./lib/auth";
import config from "./config";

const corsWebAllow = ["http://localhost:3000", "https://trello-clone-backend-1uko.onrender.com"];
const corsOptions = {
  origin: corsWebAllow,
  optionsSuccessStatus: 200,
  credentials: true, // enable set cookie
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

const httpServer = http.createServer();
export const io = new Server(httpServer, {
  cors: corsOptions,
});

const wssport = 8080;

const getCookieValue = (name: string, cookies: string) =>
  cookies.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";

// Setup Socket.IO connection
io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  const cookies = socket?.handshake?.headers?.cookie ?? "";

  socket.on("join_project_room", async (projectId: string) => {
    socket.join(projectId);
    // console.log("User: " + socket.id + " joined " + projectId);

    const userSesstionCookie = getCookieValue("user_session", cookies);

    // console.log("=>> ", userSesstionCookie);

    if (userSesstionCookie) {
      let verify: any = null;

      try {
        verify = jwt.verify(userSesstionCookie, config.jwtSecret);
      } catch (error) {
        console.log("verify error at join_project_room", error);
        return;
      }

      const userId = generateUidByString(verify?.email ?? "");
      const check = await checkUserIsAllowJoiningProject(userId, projectId);

      if (check) {
        const data = await viewTasksProject(projectId);
        io.to(projectId).emit("view_project", data);
      } else {
        io.to(projectId).emit("view_project", {
          error: "User didn't allow to join this project",
          status: "fail",
        });
      }
    }
  });

  socket.on("call_update_project", (projectId, data) => {
    io.to(projectId).emit("view_project", data);
  });

  socket.on("user_disconnect", () => {
    socket.disconnect();
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

httpServer.listen(wssport, () => {
  console.log(`listen to port 8080`);
});

module.exports = httpServer;
