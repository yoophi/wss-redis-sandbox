var util = require("util"),
  opts = require("opts"),
  redis = require("redis"),
  subscriber = redis.createClient(6379, "localhost"),
  publisher = redis.createClient(6379, "localhost");

// var { WebSocketServer } = require("ws");

const express = require("express");
const path = require("path");
const morgan = require("morgan");
const webSocket = require("./socket");
const { Queue } = require("bullmq");
var cors = require("cors");
const queue = new Queue("my-queue");

opts.parse([
  {
    short: "p",
    long: "port",
    description: "WebSocket Port",
    value: true,
    required: true,
  },
]);

// var wss = new WebSocketServer({
//   port: opts.get("port"),
// });

const app = express();
app.set("port", opts.get("port") || 8000);
app.use(cors());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.post("/job", (req, res) => {
  console.log("POST /job");
  queue.add("my-queue", { color: "blue" });
  // queue.close();

  res.send({ ok: true });
});

app.use("/", (req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

subscriber.on("error", function (err) {
  util.debug(err);
});

publisher.on("error", function (err) {
  util.debug(err);
});

// subscriber.subscribe("chat");
// subscriber.on("message", function (channel, message) {
//   util.puts(message);
//   wss.broadcast(message);
// });

// wss.on("connection", function (connection) {
//   util.puts("client connected: " + connection.id);

//   connection.addListener("message", function (message) {
//     publisher.publish("chat", message);
//   });
// });

// wss.on("close", function (connection) {
//   util.puts("client disconnected: " + connection.id);
// });
const server = app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
webSocket(server, subscriber, publisher);
