const { createServer } = require("http");
const { Server } = require("socket.io");
const {
  BoomErrorHandler,
  InternalServerError,
} = require("./middlewares/errors.handler");
const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes");

const app = express();
const server = createServer(app);

const io = new Server(server);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

apiRoutes(app);

app.use(BoomErrorHandler);
app.use(InternalServerError);

io.on("connection", (socket) => {});

server.listen(3000, () => {
  console.log("App running at port 3000");
});
