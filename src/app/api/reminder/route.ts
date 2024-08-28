import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";

const prisma = new PrismaClient();

// Utility function to safely extract error messages from unknown errors
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error); // Fallback for non-Error objects
}

// GET: Fetch reminders based on criteria like setById, setForId, isReminderActive, etc.
export async function GET(request: Request) {
  try {
    // Parse the query parameters from the URL
    const url = new URL(request.url);
    const setById = url.searchParams.get('setById');
    const setForId = url.searchParams.get('setForId');
    const isReminderActive = url.searchParams.get('isReminderActive') === 'true';

    // Build conditions for Prisma query based on available query parameters
    const conditions: any = {};
    if (setById) conditions.setById = setById;
    if (setForId) conditions.setForId = setForId;
    if (typeof isReminderActive === 'boolean') conditions.isReminderActive = isReminderActive;

    // Fetch reminders from the database
    const reminders = await prisma.reminder.findMany({
      where: conditions,
    });

    // Return the fetched reminders as a response
    return new Response(JSON.stringify(reminders), {
      status: HttpStatusCode.Ok,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    // Handle errors safely by extracting the message from the error
    return new Response(JSON.stringify({ error: getErrorMessage(error) }), {
      status: HttpStatusCode.InternalServerError,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// POST: Create a new reminder in the database
export async function POST(request: Request) {
  try {
    const { setById, setForId, scheduledAt, startDate, endDate, description, type, intervalInDays } = await request.json();

    if (!['ALIGNER', 'APPOINTMENT', 'OTHER'].includes(type)) {
      return new Response(JSON.stringify({ error: "Invalid type provided" }), {
        status: HttpStatusCode.BadRequest,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Create a new reminder in the database
    const reminder = await prisma.reminder.create({
      data: {
        setById,
        setForId,
        scheduledAt: new Date(scheduledAt),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        description,
        type, // Must match one of the enum values
        intervalInDays,
        isReminderActive: true, // Initially mark the reminder as active
      }
    });

    // Return the created reminder as a response
    return new Response(JSON.stringify(reminder), {
      status: HttpStatusCode.Created,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    // Handle errors safely by extracting the message from the error
    return new Response(JSON.stringify({ error: getErrorMessage(error) }), {
      status: HttpStatusCode.InternalServerError,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// PUT: Update an existing reminder
export async function PUT(request: Request) {
  try {
    const { id, setById, setForId, scheduledAt, startDate, endDate, description, type, intervalInDays, isReminderActive } = await request.json();

    // Ensure the reminder ID is provided
    if (!id) {
      return new Response(JSON.stringify({ error: "Reminder ID is required" }), {
        status: HttpStatusCode.BadRequest,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Validate reminder type
    if (!['ALIGNER', 'APPOINTMENT', 'OTHER'].includes(type)) {
      return new Response(JSON.stringify({ error: "Invalid type provided" }), {
        status: HttpStatusCode.BadRequest,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Update the reminder in the database
    const updatedReminder = await prisma.reminder.update({
      where: { id },
      data: {
        setById,
        setForId,
        scheduledAt: new Date(scheduledAt),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        description,
        type,
        intervalInDays,
        isReminderActive,
      }
    });

    // Return the updated reminder as a response
    return new Response(JSON.stringify(updatedReminder), {
      status: HttpStatusCode.Ok,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    // Handle errors safely by extracting the message from the error
    return new Response(JSON.stringify({ error: getErrorMessage(error) }), {
      status: HttpStatusCode.InternalServerError,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// DELETE: Delete an existing reminder and return a success message
export async function DELETE(request: Request) {
    try {
      const { id } = await request.json();
  
      // Ensure the reminder ID is provided
      if (!id) {
        return new Response(JSON.stringify({ error: "Reminder ID is required" }), {
          status: HttpStatusCode.BadRequest,
          headers: { "Content-Type": "application/json" }
        });
      }
  
      // Delete the reminder from the database
      await prisma.reminder.delete({
        where: { id }
      });
  
      // Return success message
      return new Response(JSON.stringify({ message: "Reminder deleted successfully" }), {
        status: HttpStatusCode.Ok,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      // Handle errors safely by extracting the message from the error
      return new Response(JSON.stringify({ error: getErrorMessage(error) }), {
        status: HttpStatusCode.InternalServerError,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
  
