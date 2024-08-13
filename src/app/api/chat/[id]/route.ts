import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { auth } from "@clerk/nextjs/server";

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

  console.log(params);
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
    return new Response(JSON.stringify(messages), {
      status: HttpStatusCode.Ok,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.log(error);
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
