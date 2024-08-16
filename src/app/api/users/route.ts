import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";

const prisma = new PrismaClient();
export async function GET() {
  const users = await prisma.user.findMany();
  return new Response(JSON.stringify(users), {
    status: HttpStatusCode.Ok,
    headers: { "Content-Type": "application/json" }
  });
}
