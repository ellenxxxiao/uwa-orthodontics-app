import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { LuPlusCircle } from "react-icons/lu";

import Header from "@/components/main/Header";
import { checkRole } from "@/lib/roles";

import { SearchUsers } from "./_search-users";
import UserTable from "./_table";

const prisma = new PrismaClient();

const getUsers = async (query?: string) => {
  if (query) {
    return await prisma.user.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: "insensitive" } },
          { lastName: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } }
        ]
      }
    });
  }
  return await prisma.user.findMany();
};

export default async function AdminDashboard(params: {
  searchParams: { search?: string };
}) {
  if (!checkRole("admin")) {
    redirect("/");
  }

  const query = params.searchParams.search;
  const users = await getUsers(query);

  return (
    <div className="flex h-full flex-col">
      <Header
        nodeRight={
          <LuPlusCircle size={30} strokeWidth={1.3} className="text-primary" />
        }
        nodeTitle={<span>User Management</span>}
      />

      <div className="flex flex-1 flex-col overflow-y-auto bg-app-white p-4">
        <SearchUsers />
        <div className="mt-4 overflow-x-auto">
          <UserTable users={users} />
        </div>
      </div>
    </div>
  );
}
