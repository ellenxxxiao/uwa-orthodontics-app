import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";

const prisma = new PrismaClient();

// GET. Example: http://localhost:3000/api/chat-list/0d7e9ae9-dcd9-4bc9-8908-1715778cfaf9
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  try {
    const chats = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }]
      },
      orderBy: {}
    });

    // if (!chats) {
    //   return new Response(JSON.stringify({ error: "User not found" }), {
    //     status: HttpStatusCode.NotFound
    //   });
    // }
    // return new Response(JSON.stringify(user), {
    //   status: HttpStatusCode.Ok
    // });
  } catch (error) {
    // console.error("Error accessing database:", error);
    return new Response(JSON.stringify({ error }), {
      status: HttpStatusCode.InternalServerError
    });
  }
}
