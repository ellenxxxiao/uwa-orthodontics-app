import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { Resend } from "resend";

import { CreateReminderSchema } from "@/schema/reminder";
import { EmailTemplate } from "../../components/emailTemplate/email-template";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

// Utility function to extract error messages from unknown types
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

// Helper function to send an email via Resend
async function sendEmail(
  subject: string,
  actionType: "created" | "updated" | "deleted",
  templateData: any,
  recipientEmail: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: "OrthoChat <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: subject,
      react: EmailTemplate({ ...templateData, actionType }),
    });

    if (error) {
      throw new Error("Failed to send email");
    }

    return data;
  } catch (err) {
    throw new Error(`Email sending error: ${getErrorMessage(err)}`);
  }
}

// GET: Fetch reminders based on search parameters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Extract search parameters
    const setForId = searchParams.get("setForId");
    const isReminderActive = searchParams.get("isReminderActive") === "true";
    const reminderType = searchParams.get("reminderType");

    // Build Prisma filters
    const filters: any = {};
    if (setForId) filters.setForId = setForId;
    if (isReminderActive !== null) filters.isReminderActive = isReminderActive;
    if (reminderType) filters.reminderType = reminderType;

    // Fetch reminders
    const reminders = await prisma.reminder.findMany({
      where: filters,
    });

    return NextResponse.json(reminders, { status: HttpStatusCode.Ok });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: HttpStatusCode.InternalServerError });
  }
}

// POST: Create a new reminder
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input using Zod schema
    const parseResult = CreateReminderSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: parseResult.error }, { status: HttpStatusCode.BadRequest });
    }

    const reminderData = parseResult.data;

    // Create a new reminder in the database
    const reminder = await prisma.reminder.create({
      data: {
        setById: reminderData.setById,
        setForId: reminderData.setForId,
        scheduledAt: new Date(reminderData.scheduledAt),
        startDate: new Date(reminderData.startDate),
        endDate: new Date(reminderData.endDate),
        description: reminderData.description,
        remindertype: reminderData.reminderType, // Make sure this field exists in the database schema
        repeatType: reminderData.repeatType,
        intervalInDays: reminderData.intervalInDays,
        isReminderActive: true,
      },
    });

    // Optionally send an email notification
    // await sendEmail(
    //   "New Reminder Created",
    //   "created",
    //   {
    //     firstName: "Patient",
    //     description: reminderData.description,
    //     startDate: reminderData.startDate,
    //     endDate: reminderData.endDate,
    //     type: reminderData.reminderType,
    //     intervalInDays: reminderData.intervalInDays,
    //   },
    //   "recipient@example.com" // Update with the correct email address
    // );

    return NextResponse.json(reminder, { status: HttpStatusCode.Created });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: HttpStatusCode.InternalServerError });
  }
}
