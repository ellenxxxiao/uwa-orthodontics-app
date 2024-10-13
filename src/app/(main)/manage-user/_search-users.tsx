"use client";

import { usePathname, useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa"; // Import search icon from react-icons

export const SearchUsers = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex justify-center">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const formData = new FormData(form);
          const queryTerm = formData.get("search") as string;
          router.push(pathname + "?search=" + queryTerm);
        }}
        className="flex items-center overflow-hidden rounded-lg border border-base-200"
      >
        <label htmlFor="search" className="sr-only">
          Search for Users
        </label>
        <div className="flex items-center px-3">
          <FaSearch className="text-accent-focus" />
        </div>
        <input
          id="search"
          name="search"
          type="text"
          placeholder="Search for Users..."
          className="w-64 border-none px-3 py-2 placeholder-gray-400 outline-none"
        />
        <button
          type="submit"
          className="bg-primary px-4 py-2 text-white transition duration-200 hover:bg-primary-focus"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
