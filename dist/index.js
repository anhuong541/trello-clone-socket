"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const tslib_1 = require("tslib");
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const http_1 = tslib_1.__importDefault(require("http"));
const auth_1 = require("./lib/auth");
const config_1 = tslib_1.__importDefault(require("./config"));
const corsWebAllow = ["http://localhost:3000", "https://trello-clone-backend-1uko.onrender.com"];
const corsOptions = {
    origin: corsWebAllow,
    optionsSuccessStatus: 200,
    credentials: true, // enable set cookie
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
};
const httpServer = http_1.default.createServer();
exports.io = new socket_io_1.Server(httpServer, {
    cors: corsOptions,
});
const wssport = 8080;
const getCookieValue = (name, cookies) => { var _a; return ((_a = cookies.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")) === null || _a === void 0 ? void 0 : _a.pop()) || ""; };
// Setup Socket.IO connection
exports.io.on("connection", (socket) => {
    var _a, _b, _c;
    console.log("a user connected:", socket.id);
    const cookies = (_c = (_b = (_a = socket === null || socket === void 0 ? void 0 : socket.handshake) === null || _a === void 0 ? void 0 : _a.headers) === null || _b === void 0 ? void 0 : _b.cookie) !== null && _c !== void 0 ? _c : "";
    socket.on("join_project_room", (projectId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a;
        socket.join(projectId);
        // console.log("User: " + socket.id + " joined " + projectId);
        const userSesstionCookie = getCookieValue("user_session", cookies);
        // console.log("=>> ", userSesstionCookie);
        if (userSesstionCookie) {
            let verify = null;
            try {
                verify = jsonwebtoken_1.default.verify(userSesstionCookie, config_1.default.jwtSecret);
            }
            catch (error) {
                console.log("verify error at join_project_room", error);
                return;
            }
            const userId = (0, auth_1.generateUidByString)((_a = verify === null || verify === void 0 ? void 0 : verify.email) !== null && _a !== void 0 ? _a : "");
            const check = yield (0, auth_1.checkUserIsAllowJoiningProject)(userId, projectId);
            if (check) {
                const data = yield (0, auth_1.viewTasksProject)(projectId);
                exports.io.to(projectId).emit("view_project", data);
            }
            else {
                exports.io.to(projectId).emit("view_project", {
                    error: "User didn't allow to join this project",
                    status: "fail",
                });
            }
        }
    }));
    socket.on("call_update_project", (projectId, data) => {
        exports.io.to(projectId).emit("view_project", data);
    });
    socket.on("realtime_update_project", (projectId, data) => {
        exports.io.to(projectId).emit("realtime_update_project_client", data);
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
//# sourceMappingURL=index.js.map