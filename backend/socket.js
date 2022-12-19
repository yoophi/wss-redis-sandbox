const WebSocket = require("ws");
// const util = require("util");

module.exports = async (server, subscriber, publisher) => {
  const wss = new WebSocket.Server({ server });

  wss.broadcast = function broadcast(msg) {
    console.log(msg);
    wss.clients.forEach(function each(client) {
      client.send(msg);
    });
  };

  await Promise.all([publisher.connect(), subscriber.connect()]);

  subscriber.subscribe("chat", function (message) {
    // util.puts(message);
    console.log({ arguments });
    console.log(`message: ${message}`);
    wss.broadcast(message);
  });
  wss.on("connection", (ws, req) => {
    // 웹 소켓 연결 시
    console.log("client connected: " + ws.id);
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log("새로운 클라이언트 접속", ip);
    ws.on("message", async (message) => {
      // 클라이언트로부터 메시지 수신 시
      //   await publisher.publish("chat", message);
      console.log("ws.on message", message);
      console.log("ws.on message", message.toString());
      await publisher.publish("chat", message.toString());
    });
    ws.on("error", (err) => {
      // 에러 발생 시
      console.error(err);
    });
    ws.on("close", () => {
      // 연결 종료 시
      console.log("클라이언트 접속 해제", ip);
      console.log("client disconnected: " + ws.id);
      clearInterval(ws.interval);
    });

    ws.interval = setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        ws.send("서버에서 클라이언트로 메시지를 보냅니다.");
      }
    }, 3000);
  });
};
