import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { EmailTemplate } from '../../components/emailTemplate/email-template';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, role, createdById, expiresInMinutes } = await request.json();

    // Check if the user has permission to create invites
    const creator = await prisma.user.findUnique({ where: { id: createdById } });

    if (!creator || creator.role !== 'CLINICIAN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if an invite already exists for this email
    const existingInvite = await prisma.invitation.findUnique({ where: { email } });
    if (existingInvite && !existingInvite.isUsed) {
      return NextResponse.json({ error: 'An invite already exists for this email.' }, { status: 400 });
    }

    // Create a new invitation
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60000); // Expires in given minutes
    const newInvite = await prisma.invitation.create({
      data: {
        email,
        createdById,
        expiresAt,
        isUsed: false,
      },
    });

    // Create an invitation link (for example purposes, we'll assume a frontend URL)
    const invitationLink = `https://yourapp.com/register?inviteId=${newInvite.id}`;

    // Send the invitation email
    await resend.emails.send({
      from: 'OrthoChat <onboarding@resend.dev>',
      to: [email],
      subject: 'You have been invited to join OrthoChat',
      react: <EmailTemplate firstName="User" actionType="created" description={`You have been invited to join OrthoChat as a ${role}.`} />,
    });

    return NextResponse.json({ message: 'Invitation sent successfully', invitationLink });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to send invitation' }, { status: 500 });
  }
}
