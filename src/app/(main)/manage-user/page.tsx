import { redirect } from "next/navigation";
import { checkRole } from "@/lib/roles";
import { SearchUsers } from "./_search-users";
import { clerkClient } from "@clerk/nextjs/server";
import { setRole } from "./_actions";
import { PrismaClient } from "@prisma/client";
import Header from "@/components/main/Header";
import { LuPlusCircle } from "react-icons/lu";

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
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Name</th>
                <th className="border border-gray-300 p-2 text-left">Email</th>
                <th className="border border-gray-300 p-2 text-left">Role</th>
                <th className="border border-gray-300 p-2 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="border border-gray-300 p-2">{user.email}</td>
                  <td className="border border-gray-300 p-2">
                    {user.role as string}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <div className="flex space-x-2">
                      {["clinician", "patient"].map((role) => (
                        <form key={role} action={setRole} className="inline">
                          <input type="hidden" value={user.id} name="id" />
                          <input type="hidden" value={role} name="role" />
                          <button
                            type="submit"
                            className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
                          >
                            Make {role.charAt(0).toUpperCase() + role.slice(1)}
                          </button>
                        </form>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
