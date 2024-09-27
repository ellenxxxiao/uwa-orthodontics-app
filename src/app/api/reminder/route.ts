import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { Resend } from "resend";

import { CreateReminderSchema } from "@/schema/reminder";

import { EmailTemplate } from "../../components/emailTemplate/email-template";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

// Utility function to safely extract error messages from unknown errors
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error); // Fallback for non-Error objects
}

// Helper function to send an email via Resend
async function sendEmail(
  subject: string,
  actionType: "created" | "updated" | "deleted",
  templateData: any
) {
  try {
    const { data, error } = await resend.emails.send({
      from: "OrthoChat <onboarding@resend.dev>",
      to: ["alian.haidar01@gmail.com"], // Hardcoded email recipient
      subject: subject,
      react: EmailTemplate({ ...templateData, actionType })
    });

    if (error) {
      console.error("Failed to send email:", error);
      throw new Error("Failed to send email");
    }

    return data;
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

// GET: Fetch reminders
export async function GET(request: NextRequest) {
  try {
    // Get search params from the URL
    const searchParams = request.nextUrl.searchParams;

    // Extract individual search parameters
    const setForId = searchParams.get("setForId");
    const isReminderActive = searchParams.get("isReminderActive");
    const reminderType = searchParams.get("reminderType");

    // Construct filter object for Prisma
    const filters: any = {};

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
      where: filters
    });

    return new Response(JSON.stringify(reminders), {
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

    // create reminder in the database
    const reminder = await prisma.reminder.create({
      data: {
        setById: createReminderData.setById,
        setForId: createReminderData.setForId,
        scheduledAt: createReminderData.scheduledAt,
        startDate: createReminderData.startDate,
        endDate: createReminderData.endDate,
        description: createReminderData.description,
        reminderType: createReminderData.reminderType,
        repeatType: createReminderData.repeatType,
        intervalInDays: createReminderData.intervalInDays,
        isReminderActive: true
      }
    });

    // Send email when a reminder is created
    // await sendEmail("New Reminder Created", "created", {
    //   firstName: "Patient",
    //   description,
    //   startDate: startDate,
    //   endDate: endDate,
    //   type,
    //   intervalInDays
    // });

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
