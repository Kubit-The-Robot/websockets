const express = require('express')
const http = require('http')
const WebSocket = require('ws')

const port = process.env.PORT || 8080;
const app = express();
const httpServer = http.createServer(app);

const wss = new WebSocket.Server({
  'server': httpServer
});

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    })
  })
})

httpServer.listen(port, function() {
  console.log(`Server is listening on ${port}!`)
});