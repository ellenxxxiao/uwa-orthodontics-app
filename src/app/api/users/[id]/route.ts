import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";

const prisma = new PrismaClient();

// GET. Example: http://localhost:3000/api/user/0d7e9ae9-dcd9-4bc9-8908-1715778cfaf9
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  // console.log("Received ID:", id);

  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      // console.error("User not found for ID:", id);
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: HttpStatusCode.NotFound
      });
    }
    // console.log("User found:", user);
    return new Response(JSON.stringify(user), {
      status: HttpStatusCode.Ok
    });
  } catch (error) {
    // console.error("Error accessing database:", error);
    return new Response(JSON.stringify({ error }), {
      status: HttpStatusCode.InternalServerError
    });
  }
}
