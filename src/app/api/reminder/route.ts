import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { RepeatType } from "@prisma/client";
import { HttpStatusCode } from "axios";

import { Resend } from "resend";
import { CreateReminderSchema } from "@/schema/reminder";


const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

// Utility function to safely extract error messages from unknown errors
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error); // Fallback for non-Error objects
}

// Helper function to send emails via Resend
async function sendEmail(subject: string, body: JSX.Element, recipientEmail: string) {
  try {
    await resend.emails.send({
      from: "OrthoChat <onboarding@resend.dev>",
      to: [recipientEmail],
      subject,
      react: body,  // JSX element from EmailTemplate
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

// GET: Fetch reminders
export async function GET(request: NextRequest) {
  "use server";

  const { userId } = auth();

  if (!userId) {
    return new Response(JSON.stringify({ error: "Not Authorized" }), {
      status: HttpStatusCode.Unauthorized
    });
  }

  try {
    // Get search params from the URL
    const searchParams = request.nextUrl.searchParams;

    // Extract individual search parameters
    const setForId = searchParams.get("setForId");
    const isReminderActive = searchParams.get("isReminderActive");
    const reminderType = searchParams.get("reminderType");

    // Construct filter object for Prisma
    const filters: any = {};

    // filter all reminders set by the user
    filters.setById = userId;

    if (setForId) {
      filters.setForId = parseInt(setForId);
    }
    if (isReminderActive !== null) {
      filters.isReminderActive = isReminderActive === "true"; // Convert string to boolean
    }
    if (reminderType) {
      filters.reminderType = reminderType;
    }

    // Fetch reminders from the database based on filters
    const reminders = await prisma.reminder.findMany({
      where: filters,
      include: {
        SetFor: true
      }
    });

    const formattedReminders = reminders.map((reminder) => ({
      reminderId: reminder.id,
      patientId: reminder.setForId,
      patientName: `${reminder.SetFor.firstName} ${reminder.SetFor.lastName}`, // Concatenating first and last names
      startDate: reminder.startDate,
      endDate: reminder.endDate || undefined, // Handling optional endDate
      intervalInDays: reminder.intervalInDays,
      reminderType: reminder.reminderType,
      description: reminder.description,
      repeatType: reminder.repeatType
    }));

    return new Response(JSON.stringify(formattedReminders), {
      status: HttpStatusCode.Ok,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: getErrorMessage(error) }), {
      status: HttpStatusCode.InternalServerError,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// POST: Create a new reminder
export async function POST(request: Request) {
  try {
    // Parse the incoming request body as JSON
    const body = await request.json();
    const parseResult = CreateReminderSchema.safeParse(body);

    if (!parseResult.success) {
      return new Response(JSON.stringify({ error: parseResult.error }), {
        status: HttpStatusCode.BadRequest,
        headers: { "Content-Type": "application/json" }
      });
    }

    const createReminderData = parseResult.data;

    const getIntervalInDays = (
      repeatType: string,
      startDate?: Date,
      endDate?: Date
    ) => {
      if (!startDate || !endDate) return 0; // Default if dates are not provided
      const diffInTime = endDate.getTime() - startDate.getTime();
      const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));

      switch (repeatType) {
        case RepeatType.DAILY:
          return 1;
        case RepeatType.WEEKLY:
          return 7;
        case RepeatType.FORTNIGHTLY:
          return 14;
        case RepeatType.MONTHLY:
          return 30; // Approximate
        case RepeatType.YEARLY:
          return 365; // Approximate
        case RepeatType.CUSTOM:
          return diffInDays; // Return calculated difference for custom
        case RepeatType.NEVER:
        default:
          return -1; // Assuming never doesn't require an interval
      }
    };

    // create reminder in the database
    const reminder = await prisma.reminder.create({
      data: {
        setById: createReminderData.setById,
        setForId: createReminderData.setForId,
        scheduledAt: createReminderData.scheduledAt,
        startDate: createReminderData.startDate,
        endDate: createReminderData.endDate ?? createReminderData.startDate,
        description: createReminderData.description,
        reminderType: createReminderData.reminderType,
        repeatType: createReminderData.repeatType,
        intervalInDays: getIntervalInDays(
          createReminderData.repeatType,
          new Date(createReminderData.startDate),
          new Date(createReminderData.endDate ?? createReminderData.startDate)
        ),
        isReminderActive: true
      }
    });

    


    return new Response(JSON.stringify(reminder), {
      status: HttpStatusCode.Created,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: getErrorMessage(error) }), {
      status: HttpStatusCode.InternalServerError,
      headers: { "Content-Type": "application/json" }
    });
  }
}
