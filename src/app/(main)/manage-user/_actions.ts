"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { Role } from "@prisma/client";
import { HttpStatusCode } from "axios";

import { checkRole } from "@/lib/roles";

const prisma = new PrismaClient();

export async function setRole(formData: FormData) {
  // Check that the user trying to set the role is an admin
  if (!checkRole("admin")) {
    return { message: "Not Authorized", status: HttpStatusCode.Unauthorized };
  }

  const userId = formData.get("id") as string;
  const newRole = formData.get("role") as string;

  const roleMap: Record<string, Role> = {
    admin: Role.ADMIN,
    clinician: Role.CLINICIAN,
    patient: Role.PATIENT
  } as const;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: roleMap[newRole] }
    });
  } catch (err) {
    console.log(err);
    return {
      message: "Prisma error",
      status: HttpStatusCode.InternalServerError
    };
  }

  try {
    await clerkClient().users.updateUser(userId, {
      publicMetadata: { role: newRole }
    });
    return { message: "Clerk success", status: HttpStatusCode.Ok };
  } catch (err) {
    return {
      message: "Clerk error",
      status: HttpStatusCode.InternalServerError
    };
  }
}
