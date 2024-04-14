const { createServer } = require("http");
const { Server } = require("socket.io");
const {
  BoomErrorHandler,
  InternalServerError,
} = require("./middlewares/errors.handler");
const express = require("express");
const cors = require("cors");
const apiRouter = require("./routes");
const SocketFunctions = require("./socket/socket.functions");

require("./auth");

const app = express();
const server = createServer(app);

const io = new Server(server);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

apiRouter(app);

app.use(BoomErrorHandler);
app.use(InternalServerError);

io.on("connection", (socket) => {
  SocketFunctions(io, socket);
});

server.listen(3000, () => {
  console.log("App running at port 3000");
});
