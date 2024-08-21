import { WebSocketServer } from "ws";

let wss: WebSocketServer | null = null;
let wsPort: number | null = null;

export function initializeWSServer() {
  if (!wss) {
    wss = new WebSocketServer({ port: 0 }); 
    wss.on('listening', () => {
      wsPort = wss!.address().port;
      console.log(`WebSocket server is listening on port ${wsPort}`);
    });

    wss.on('connection', (ws) => {
      console.log('Client connected');
      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });
  }
  
  return { wss, wsPort };
}

export function getWSPort() {
  return wsPort;
}

export function getWSServer() {
  return wss;
}
