// hooks/useUsers.ts
import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const useUsers = (query?: string) => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        let usersData;

        // If there is a query, fetch users matching the query; otherwise, fetch all users
        if (query) {
          usersData = await prisma.user.findMany({
            where: {
              OR: [
                { firstName: { contains: query, mode: "insensitive" } },
                { lastName: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } }
              ]
            }
          });
        } else {
          usersData = await prisma.user.findMany();
        }

        setUsers(usersData);
      } catch (error) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [query]);

  return { users, error, loading };
};
