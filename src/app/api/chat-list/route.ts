import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";

import { ChatListItem } from "@/types/chat";

const prisma = new PrismaClient();

// GET. Example: http://localhost:3000/api/chat-list/
export async function GET() {
  "use server";

  const { userId } = auth();

  if (!userId) {
    return new Response(JSON.stringify({ error: "Not Authorized" }), {
      status: HttpStatusCode.Unauthorized
    });
  }

  try {
    const messages = await prisma.message.findMany({
      relationLoadStrategy: "join",
      select: {
        id: true,
        text: true,
        sentAt: true,
        Sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        Receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }]
      },
      orderBy: {
        sentAt: "desc"
      }
    });

    // Map to store the last messages with each contact
    const chatMap = new Map<string, ChatListItem>();

    messages.forEach((message) => {
      const contactId =
        message.Sender.id === userId ? message.Receiver.id : message.Sender.id;
      const contact =
        message.Sender.id === userId ? message.Receiver : message.Sender;

      if (!chatMap.has(contactId)) {
        chatMap.set(contactId, {
          contactUser: {
            id: contact.id,
            firstName: contact.firstName,
            lastName: contact.lastName
          },
          lastMessage: {
            text: message.text,
            sentAt: message.sentAt
          }
        });
      }
    });

    const chatList = Array.from(chatMap.values());

    return new Response(JSON.stringify(chatList), {
      status: HttpStatusCode.Ok,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    // console.error("Error accessing database:", error);
    return new Response(JSON.stringify({ error }), {
      status: HttpStatusCode.InternalServerError
    });
  }
}
