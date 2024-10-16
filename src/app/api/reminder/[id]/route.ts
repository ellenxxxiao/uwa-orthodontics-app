import { createClerkClient } from "@clerk/clerk-sdk-node";
import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";

import { UpdateReminderSchema } from "@/schema/reminder";

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
});

const prisma = new PrismaClient();

// GET. Example: http://localhost:3000/api/reminder/26
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  try {
    if (!id) {
      return new Response(
        JSON.stringify({ error: "Reminder ID is required" }),
        {
          status: HttpStatusCode.BadRequest
        }
      );
    }

    const reminder = await prisma.reminder.findUnique({
      where: { id }
    });

    if (!reminder) {
      return new Response(JSON.stringify({ error: "Reminder not found" }), {
        status: HttpStatusCode.NotFound
      });
    }
    return new Response(JSON.stringify(reminder), {
      status: HttpStatusCode.Ok,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error }), {
      status: HttpStatusCode.InternalServerError
    });
  }
}

// PATCH. Update reminder in database.
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  try {
    if (!id) {
      return new Response(
        JSON.stringify({ error: "Reminder ID is required" }),
        {
          status: HttpStatusCode.BadRequest
        }
      );
    }

    const body = await request.json();

    // Safe parse request body for update reminder schema
    const parseResult = UpdateReminderSchema.safeParse(body);

    if (!parseResult.success) {
      return new Response(JSON.stringify({ error: parseResult.error }), {
        status: HttpStatusCode.BadRequest
      });
    }

    const updateUserData = parseResult.data;
    // Update intervalInDays based on repeatType
    switch (updateUserData.repeatType) {
      case "NEVER":
        updateUserData.intervalInDays = 0;
        break;
      case "DAILY":
        updateUserData.intervalInDays = 1;
        break;
      case "WEEKLY":
        updateUserData.intervalInDays = 7;
        break;
      case "FORTNIGHTLY":
        updateUserData.intervalInDays = 14;
        break;
      case "MONTHLY":
        updateUserData.intervalInDays = 30;
        break;
      case "YEARLY":
        updateUserData.intervalInDays = 365;
        break;
      case "CUSTOM":
        if (
          typeof updateUserData.intervalInDays !== "number" ||
          updateUserData.intervalInDays <= 0
        ) {
          return new Response(
            JSON.stringify({
              error: "Invalid intervalInDays for CUSTOM repeatType"
            }),
            { status: HttpStatusCode.BadRequest }
          );
        }
        break;
      default:
        return new Response(JSON.stringify({ error: "Invalid repeatType" }), {
          status: HttpStatusCode.BadRequest
        });
    }

    // Update reminder in database
    const reminder = await prisma.reminder.update({
      where: { id },
      data: updateUserData
    });

    return new Response(
      JSON.stringify({
        reminder
      }),
      {
        status: HttpStatusCode.Ok,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error }), {
      status: HttpStatusCode.InternalServerError
    });
  }
}

// DELETE. Delete reminder in database.
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  try {
    if (!id) {
      return new Response(
        JSON.stringify({ error: "Reminder ID is required" }),
        {
          status: HttpStatusCode.BadRequest
        }
      );
    }

    // Delete reminder in database
    await prisma.reminder.delete({
      where: { id }
    });

    return new Response(
      JSON.stringify({
        message: `Reminder with ID ${id} deleted successfully.`
      }),
      {
        status: HttpStatusCode.Ok,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error }), {
      status: HttpStatusCode.InternalServerError
    });
  }
}
