"use server";

import { checkRole } from "@/lib/roles";
import { clerkClient } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { Role } from "@prisma/client";

const prisma = new PrismaClient();

export async function setRole(formData: FormData) {
  // Check that the user trying to set the role is an admin
  if (!checkRole("admin")) {
    return { message: "Not Authorized" };
  }

  const userId = formData.get("id") as string;
  const newRole = formData.get("role") as string;

  try {
    const dbRes = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole as Role }
    });

    const res = await clerkClient().users.updateUser(userId, {
      publicMetadata: { role: newRole }
    });
    return {
      message: dbRes
    };
  } catch (err) {
    return { message: "An error occurred" };
  }
}
