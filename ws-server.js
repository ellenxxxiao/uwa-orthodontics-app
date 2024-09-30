// const WebSocket = require('ws');
// const PORT = 8080;

// const wss = new WebSocket.Server({ port: PORT }, () => {
//   console.log(`WebSocket server is running on ws://localhost:${PORT}`);
// });

// wss.on('connection', function connection(ws) {
//   console.log('A new client connected.');
//   ws.on('message', function incoming(message) {
//     console.log('received: %s', message);
//     // Broadcasting the message to all connected clients including the sender
//     wss.clients.forEach(function each(client) {
//       if (client !== ws && client.readyState === WebSocket.OPEN) {
//         client.send(message);
//       }
//     });
//   });

//   ws.on('close', () => { 
//     console.log('Client disconnected');
//   });

//   wss.on('error', (error) => {
//     console.error('WebSocket server error:', error);
//   });

// });

const express = require('express');
const next = require('next');
const { Server } = require('socket.io');
const http = require('http');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Handle HTTP requests
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const httpServer = http.createServer(server);
  const io = new Server(httpServer, {
    cors: {
      origin: true,
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });
  
  // 将 io 实例设置为全局变量
  global.io = io;

  io.on('connection', (socket) => {
    console.log('A new client connected.');

    socket.on('new_message', (newMessage) => {
      console.log('received: %s', newMessage);
      // Broadcasting the message to all connected clients
      socket.broadcast.emit('new_message', newMessage);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});


