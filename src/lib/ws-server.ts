import { AddressInfo, WebSocketServer } from "ws";

let wss: WebSocketServer | null = null;
let wsPort: number | null = null;

export function initializeWSServer() {
  if (!wss) {
    wss = new WebSocketServer({ port: 0 });
    wss.on("listening", () => {
      const address = wss!.address();
      if (address && typeof address !== "string") {
        wsPort = (address as AddressInfo).port;
        console.log(`WebSocket server is listening on port ${wsPort}`);
      } else {
        console.error("Failed to retrieve the WebSocket server port.");
      }
    });

    wss.on("connection", (ws) => {
      console.log("Client connected");
      ws.on("close", () => {
        console.log("Client disconnected");
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
