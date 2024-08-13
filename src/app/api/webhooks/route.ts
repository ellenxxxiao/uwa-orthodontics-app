import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent, UserJSON } from "@clerk/nextjs/server";
import { PrismaClient, Role } from "@prisma/client";
import { HttpStatusCode } from "axios";

const prisma = new PrismaClient();

// Handles user related Clerk webhooks
export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.log("Error occured -- no svix headers");
    return new Response("Error occured -- no svix headers", {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400
    });
  }

  const eventType = evt.type;
  const clerkUser = evt.data as UserJSON;

  // User created event
  switch (eventType) {
    case "user.created":
      console.log("User created event");
      try {
        const user = await prisma.user.create({
          data: {
            id: clerkUser.id,
            createdAt: new Date(clerkUser.created_at),
            updatedAt: new Date(clerkUser.updated_at),
            email: clerkUser.email_addresses[0].email_address,
            firstName: clerkUser.first_name!,
            lastName: clerkUser.last_name!,
            role: Role.PATIENT
          }
        });
        return new Response(JSON.stringify(user), {
          status: HttpStatusCode.Created,
          headers: { "Content-Type": "application/json" }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error }), {
          status: HttpStatusCode.InternalServerError,
          headers: { "Content-Type": "application/json" }
        });
      }
    case "user.updated":
      console.log("User updated event");
      try {
        const user = await prisma.user.update({
          where: {
            id: clerkUser.id
          },
          data: {
            updatedAt: new Date(clerkUser.updated_at),
            email: clerkUser.email_addresses[0].email_address,
            firstName: clerkUser.first_name!,
            lastName: clerkUser.last_name!
          }
        });
        return new Response(JSON.stringify(user), {
          status: HttpStatusCode.Ok,
          headers: { "Content-Type": "application/json" }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error }), {
          status: HttpStatusCode.InternalServerError,
          headers: { "Content-Type": "application/json" }
        });
      }
    case "user.deleted":
      console.log("User deleted event");
      try {
        const user = await prisma.user.delete({
          where: {
            id: clerkUser.id
          }
        });
        return new Response(JSON.stringify(user), {
          status: HttpStatusCode.Ok,
          headers: { "Content-Type": "application/json" }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error }), {
          status: HttpStatusCode.InternalServerError,
          headers: { "Content-Type": "application/json" }
        });
      }
    default:
      console.log("Unknown event type");
  }

  return new Response("", { status: 200 });
}
