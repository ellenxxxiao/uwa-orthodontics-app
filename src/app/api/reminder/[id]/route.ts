import { createClerkClient } from "@clerk/clerk-sdk-node";
import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { UpdateReminderSchema } from "@/schema/reminder";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; // Use Clerk's auth helper
import { Resend } from "resend";
import { EmailTemplate } from "@/app/components/emailTemplate/email-template";

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
});
const resend = new Resend(process.env.RESEND_API_KEY);
const prisma = new PrismaClient();

// Helper function to send emails
async function sendEmail(
  subject: string,
  actionType: "created" | "updated" | "deleted",
  recipientEmail: string,
  firstName: string,
  description?: string,
  startDate?: string,
  endDate?: string,
  type?: string,
  intervalInDays?: number
) {
  try {
    await resend.emails.send({
      from: "OrthoChat <onboarding@resend.dev>",
      to: ["alian.haidar01@gmail.com"],
      subject,
      react: EmailTemplate({
        firstName,
        actionType,
        description,
        startDate,
        endDate,
        type,
        intervalInDays
      })
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

// GET: Fetch reminders for the logged-in user and send an email notification
export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401
      });
    }

    const reminders = await prisma.reminder.findMany({
      where: { setForId: userId }
    });

    if (reminders.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "No reminders found" }),
        { status: 404 }
      );
    }

    // Send email notification for fetching reminders (THIS IS CODED OUT TO TEST EMAIL FUNCTIONALITY)
    //const user = await clerk.users.getUser(userId);
    //const email = user.emailAddresses[0].emailAddress;
    //await sendEmail("Reminder Fetch", "updated", email, user.firstName || "User");

    return new NextResponse(JSON.stringify(reminders), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch reminders" }),
      { status: 500 }
    );
  }
}

// PATCH: Update a reminder and send an email notification
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401
      });
    }

    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: "Reminder ID is required" }),
        { status: 400 }
      );
    }

    const body = await request.json();
    const parseResult = UpdateReminderSchema.safeParse(body);
    if (!parseResult.success) {
      return new NextResponse(JSON.stringify({ error: parseResult.error }), {
        status: 400
      });
    }

    const updateUserData = parseResult.data;

    const updatedReminder = await prisma.reminder.update({
      where: { id },
      data: updateUserData
    });

    const user = await clerk.users.getUser(userId);
    const email = user.emailAddresses[0].emailAddress;
    await sendEmail(
      "Reminder Updated",
      "updated",
      email,
      user.firstName || "User"
    );

    return new NextResponse(
      JSON.stringify({
        message: `Reminder with ID ${id} updated successfully.`
      }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Failed to update reminder" }),
      { status: 500 }
    );
  }
}

// DELETE: Delete a reminder and send an email notification
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401
      });
    }

    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: "Reminder ID is required" }),
        { status: 400 }
      );
    }

    const reminder = await prisma.reminder.findUnique({ where: { id } });
    if (!reminder) {
      return new NextResponse(JSON.stringify({ error: "Reminder not found" }), {
        status: 404
      });
    }

    await prisma.reminder.delete({ where: { id } });

    const user = await clerk.users.getUser(userId);
    const email = user.emailAddresses[0].emailAddress;
    await sendEmail(
      "Reminder Deleted",
      "deleted",
      email,
      user.firstName || "User"
    );

    return new NextResponse(
      JSON.stringify({
        message: `Reminder with ID ${id} deleted successfully.`
      }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Failed to delete reminder" }),
      { status: 500 }
    );
  }
}
