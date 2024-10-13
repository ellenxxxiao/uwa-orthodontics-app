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
  let senderId: string | undefined;
  let receiverId: string | undefined;
  let text: string | undefined;
  try {
    const { senderId, receiverId, text } = await request.json();

    // Creating a Message
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        text
      }
    });

    // After the message is saved successfully, send the message via WebSocket
    io.to(receiverId).emit("new_message", message);

    // Returns a message of successful creation
    return new Response(JSON.stringify(message), {
      status: HttpStatusCode.Created,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    // Print detailed error information to the server log
    console.error("Error creating message:", {
      error: (error as Error).message,
      stack: (error as Error).stack,
      data: {
        senderId,
        receiverId,
        text
      }
    });

    // Return error information to the client in JSON format
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: (error as Error).message,
        details:
          process.env.NODE_ENV === "development"
            ? (error as Error).stack
            : undefined // Return error stack in development environment
      }),
      {
        status: HttpStatusCode.InternalServerError,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
