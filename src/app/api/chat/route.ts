import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";

const prisma = new PrismaClient();

export const IDs = {
  senderId: "0d7e9ae9-dcd9-4bc9-8908-1715778cfaf9",
  receiverId: "8a35ed21-2acd-4846-acab-3a42fb1aa733"
};

// GET
export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: IDs.senderId, receiverId: IDs.receiverId },
          { senderId: IDs.receiverId, receiverId: IDs.senderId }
        ]
      }
    });
    return new Response(JSON.stringify(messages), {
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
