import { ClerkLoaded,ClerkLoading } from "@clerk/nextjs";

import NavBar from "@/components/main/NavBar";

export default function MainLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="flex h-screen bg-base-100">
        <ClerkLoading>
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-xl">Loading...</p>
          </div>
        </ClerkLoading>
        <ClerkLoaded>
          <NavBar />
          <div className="my-4 mr-4 flex-1 overflow-auto rounded-xl shadow-standard md:max-2xl:m-8 md:max-2xl:ml-0">
            {children}
          </div>
        </ClerkLoaded>
      </div>
    </div>
  );
}
