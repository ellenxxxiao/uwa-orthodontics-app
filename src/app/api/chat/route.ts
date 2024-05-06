import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(request: Request) {
  const messages = await prisma.message.findMany({
    where: {
      senderId: "b4896590-a2b8-4f3a-b24f-96d22968a5f8",
      receiverId: "b18d54a8-c032-4356-912b-ae56d28e973a",
    },
  });
  return Response.json(messages);
}

// POST
export async function POST(request: Request) {
  const { senderId, receiverId, text } = await request.json();
  const message = await prisma.message.create({
    data: {
      senderId,
      receiverId,
      text,
    },
  });
  return Response.json(message);
}
