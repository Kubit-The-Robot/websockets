const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const port = process.env.PORT || 8080;
const app = express();
const httpServer = http.createServer(app);

const wss = new WebSocket.Server({
  server: httpServer,
});

function noop() {}

function heartbeat() {
  this.isAlive = true;
}

wss.on("connection", function connection(ws) {
  ws.isAlive = true;
  ws.on("pong", heartbeat);

  ws.on("message", function incoming(data) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 30000);

wss.on("close", function close() {
  clearInterval(interval);
});

httpServer.listen(port, function () {
  console.log(`Server is listening on ${port}!`);
});
