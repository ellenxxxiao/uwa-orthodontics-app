import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";

import NavBar from "@/components/main/NavBar";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OrthoChat",
  description: "UWA Orthodontics Chat App"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true
        },
        variables: {
          colorPrimary: "#2A8BF2"
        }
      }}
    >
      <html lang="en">
        <body className="flex h-screen bg-base-100">
          <ClerkLoading>
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-xl">Loading...</p>
            </div>
          </ClerkLoading>
          <ClerkLoaded>
            <NavBar />
            <main className="shadow-standard my-4 mr-4 flex-1 overflow-auto rounded-xl md:max-2xl:m-8 md:max-2xl:ml-0">
              {children}
            </main>
          </ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  );
}
