"use client";

import { User } from "@prisma/client";
import { HttpStatusCode } from "axios";

import { useToast } from "@/hooks/use-toast";

import { setRole } from "./_actions";

type props = {
  users: User[];
};

export default function UserTable({ users }: props) {
  const { toast } = useToast();

  const handleSetRole = async (formData: FormData) => {
    const res = await setRole(formData);
    if (res.status === HttpStatusCode.Ok) {
      toast({
        title: "Success",
        description: "Role updated successfully"
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Role update failed"
      });
    }
  };

  return (
    <>
      <table className="min-w-full border-collapse border border-base-300">
        <thead>
          <tr className="bg-base-100">
            <th className="border border-base-300 p-2 text-left">Name</th>
            <th className="border border-base-300 p-2 text-left">Email</th>
            <th className="border border-base-300 p-2 text-left">Role</th>
            <th className="border border-base-300 p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="border border-base-300 p-2">
                {user.firstName} {user.lastName}
              </td>
              <td className="border border-base-300 p-2">{user.email}</td>
              <td className="border border-base-300 p-2">
                {user.role as string}
              </td>
              <td className="border border-base-300 p-2">
                <div className="flex space-x-2">
                  {["clinician", "patient"].map((role) => (
                    <form key={role} action={handleSetRole} className="inline">
                      <input type="hidden" value={user.id} name="id" />
                      <input type="hidden" value={role} name="role" />
                      <button
                        type="submit"
                        className="rounded bg-[#92c3f4] px-2 py-1 text-white hover:bg-[#53a3f3]"
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
    </>
  );
}
