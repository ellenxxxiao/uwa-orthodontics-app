import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";

import { getWSPort, getWSServer } from "@/lib/ws-server";
import { initializeWSServer } from "@/lib/ws-server";

const prisma = new PrismaClient();

// GET
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  "use server";

  const { userId } = auth();

  if (!userId) {
    return new Response(JSON.stringify({ error: "Not Authorized" }), {
      status: HttpStatusCode.Unauthorized
    });
  }

  const otherUserId = params.id;
  initializeWSServer();

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId!, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId! }
        ]
      }
    });

    const wsPort = getWSPort();

    return new Response(JSON.stringify({ messages, wsPort }), {
      status: HttpStatusCode.Ok,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error }), {
      status: HttpStatusCode.InternalServerError,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// POST
export async function POST(request: Request) {
  try {
    const { senderId, receiverId, text } = await request.json();
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        text
      }
    });

    const wss = getWSServer();

    // Broadcast new messages to all connected clients
    if (wss) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    }

    return new Response(JSON.stringify(message), {
      status: HttpStatusCode.Created,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error }), {
      status: HttpStatusCode.InternalServerError,
      headers: { "Content-Type": "application/json" }
    });
  }
}
