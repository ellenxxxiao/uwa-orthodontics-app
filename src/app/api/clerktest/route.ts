// pages/api/updateUserTest.ts
import { createClerkClient } from "@clerk/clerk-sdk-node";
import { HttpStatusCode } from "axios";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
});

// POST
export async function POST(request: Request) {
  try {
    const { userId, firstName } = await request.json();

    await clerkClient.users.updateUser(userId, {
      firstName
    });

    return new Response("success", {
      status: HttpStatusCode.Ok,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error }), {
      status: HttpStatusCode.InternalServerError,
      headers: { "Content-Type": "application/json" }
    });
  }
}
