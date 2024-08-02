import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";

const prisma = new PrismaClient();

// GET. Example: http://localhost:3000/api/contacts/0d7e9ae9-dcd9-4bc9-8908-1715778cfaf9
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  try {
    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: HttpStatusCode.BadRequest
      });
    }

    const connections = await prisma.connection.findMany({
      where: {
        OR: [{ clinicianId: userId }, { patientId: userId }]
      },
      include: {
        Clinician: true,
        Patient: true
      }
    });

    const contacts = connections.map((connection) => {
      return connection.Clinician.id === userId
        ? connection.Patient
        : connection.Clinician;
    });

    contacts.sort((a, b) => a.lastName.localeCompare(b.lastName));

    return new Response(JSON.stringify(contacts), {
      status: HttpStatusCode.Ok,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    // console.error("Error accessing database:", error);
    return new Response(JSON.stringify({ error }), {
      status: HttpStatusCode.InternalServerError
    });
  }
}
