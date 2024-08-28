import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { Resend } from 'resend';
import { EmailTemplate } from '../../components/emailTemplate/email-template';

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
async function sendEmail(subject: string, actionType: 'created' | 'updated' | 'deleted', templateData: any) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'OrthoChat <onboarding@resend.dev>',
      to: ['alian.haidar01@gmail.com'], // Hardcoded email recipient
      subject: subject,
      react: EmailTemplate({ ...templateData, actionType }),
    });

    if (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send email');
    }

    return data;
  } catch (err) {
    console.error('Error sending email:', err);
  }
}

// GET: Fetch reminders
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const setById = url.searchParams.get('setById');
    const setForId = url.searchParams.get('setForId');
    const isReminderActive = url.searchParams.get('isReminderActive') === 'true';

    const conditions: any = {};
    if (setById) conditions.setById = setById;
    if (setForId) conditions.setForId = setForId;
    if (typeof isReminderActive === 'boolean') conditions.isReminderActive = isReminderActive;

    const reminders = await prisma.reminder.findMany({ where: conditions });

    return new Response(JSON.stringify(reminders), {
      status: HttpStatusCode.Ok,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: getErrorMessage(error) }), {
      status: HttpStatusCode.InternalServerError,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// POST: Create a new reminder
export async function POST(request: Request) {
  try {
    const { setById, setForId, scheduledAt, startDate, endDate, description, type, intervalInDays } = await request.json();

    if (!['ALIGNER', 'APPOINTMENT', 'OTHER'].includes(type)) {
      return new Response(JSON.stringify({ error: "Invalid type provided" }), {
        status: HttpStatusCode.BadRequest,
        headers: { "Content-Type": "application/json" },
      });
    }

    const reminder = await prisma.reminder.create({
      data: {
        setById,
        setForId,
        scheduledAt: new Date(scheduledAt),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        description,
        type,
        intervalInDays,
        isReminderActive: true,
      },
    });

    // Send email when a reminder is created
    await sendEmail('New Reminder Created', 'created', {
      firstName: 'Patient',
      description,
      startDate: startDate,
      endDate: endDate,
      type,
      intervalInDays
    });

    return new Response(JSON.stringify(reminder), {
      status: HttpStatusCode.Created,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: getErrorMessage(error) }), {
      status: HttpStatusCode.InternalServerError,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// PUT: Update an existing reminder
export async function PUT(request: Request) {
  try {
    const { id, setById, setForId, scheduledAt, startDate, endDate, description, type, intervalInDays, isReminderActive } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "Reminder ID is required" }), {
        status: HttpStatusCode.BadRequest,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!['ALIGNER', 'APPOINTMENT', 'OTHER'].includes(type)) {
      return new Response(JSON.stringify({ error: "Invalid type provided" }), {
        status: HttpStatusCode.BadRequest,
        headers: { "Content-Type": "application/json" },
      });
    }

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
      },
    });

    // Send email when a reminder is updated
    await sendEmail('Reminder Updated', 'updated', {
      firstName: 'Patient',
      description,
      startDate: startDate,
      endDate: endDate,
      type,
      intervalInDays
    });

    return new Response(JSON.stringify(updatedReminder), {
      status: HttpStatusCode.Ok,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: getErrorMessage(error) }), {
      status: HttpStatusCode.InternalServerError,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// DELETE: Delete an existing reminder
export async function DELETE(request: Request) {
  try {
    const { id, description, startDate, endDate, type, intervalInDays } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "Reminder ID is required" }), {
        status: HttpStatusCode.BadRequest,
        headers: { "Content-Type": "application/json" },
      });
    }

    await prisma.reminder.delete({
      where: { id },
    });

    // Send email when a reminder is deleted
    await sendEmail('Reminder Deleted', 'deleted', {
      firstName: 'Patient',
      description: `Your Reminder has been deleted successfully.`,
      startDate: startDate,
      endDate: endDate,
      type,
      intervalInDays
    });

    return new Response(JSON.stringify({ message: "Reminder deleted successfully" }), {
      status: HttpStatusCode.Ok,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: getErrorMessage(error) }), {
      status: HttpStatusCode.InternalServerError,
      headers: { "Content-Type": "application/json" },
    });
  }
}
