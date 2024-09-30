import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";
// const wssClient = new WebSocket('ws://localhost:3000');

const prisma = new PrismaClient();

declare global {
  let io: SocketIO.Server; // 告诉 TypeScript 有一个全局的 io 变量
}

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

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId!, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId! }
        ]
      }
    });

    return new Response(JSON.stringify({ messages }), {
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

    io.to(receiverId).emit("new_message", message);

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
