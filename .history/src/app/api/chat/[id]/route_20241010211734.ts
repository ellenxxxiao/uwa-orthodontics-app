import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";
// const wssClient = new WebSocket('ws://localhost:3000');

const prisma = new PrismaClient();

// declare global {
//   let io: SocketIO.Server;
// }

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

    // 创建消息
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        text
      }
    });

    // 消息保存成功后，通过 WebSocket 发送消息
    io.to(receiverId).emit("new_message", message);

    // 返回创建成功的消息
    return new Response(JSON.stringify(message), {
      status: HttpStatusCode.Created,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    // 打印详细的错误信息到服务器日志
    console.error("Error creating message:", {
      error: error.message,
      stack: error.stack,
      data: {
        senderId,
        receiverId,
        text
      }
    });

    // 将错误信息以 JSON 形式返回给客户端
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message, // 可选：根据安全考虑决定是否返回给客户端
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined // 开发环境中返回错误堆栈
      }),
      {
        status: HttpStatusCode.InternalServerError,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
