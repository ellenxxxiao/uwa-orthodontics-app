import { clerkClient, createClerkClient } from "@clerk/clerk-sdk-node";
import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";

import { UpdateUserSchema } from "@/schema/user";

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
});

const prisma = new PrismaClient();

// GET. Example: http://localhost:3000/api/user/0d7e9ae9-dcd9-4bc9-8908-1715778cfaf9
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    if (!id) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: HttpStatusCode.BadRequest
      });
    }

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: HttpStatusCode.NotFound
      });
    }
    return new Response(JSON.stringify(user), {
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
// PATCH. Update user in both database and Clerk.
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    if (!id) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: HttpStatusCode.BadRequest
      });
    }

    const body = await request.json();

    // Safe parse request body for update user schema
    const parseResult = UpdateUserSchema.safeParse(body);

    if (!parseResult.success) {
      return new Response(JSON.stringify({ error: parseResult.error }), {
        status: HttpStatusCode.BadRequest
      });
    }

    const updateUserData = parseResult.data;

    // Update user in Clerk
    await clerkClient.users.updateUser(id, updateUserData);

    return new Response(
      JSON.stringify({ message: `User with ID ${id} updated successfully.` }),
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

// DELETE. Delete user in both database and Clerk.
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    if (!id) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: HttpStatusCode.BadRequest
      });
    }

    // Delete user in Clerk
    await clerkClient.users.deleteUser(id);

    return new Response(
      JSON.stringify({ message: `User with ID ${id} deleted successfully.` }),
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
