import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton
} from "@clerk/nextjs";

import "./globals.css";
import NavBar from "@/components/main/NavBar";

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
          <NavBar />
          <main className="m-8 flex-1 overflow-hidden rounded-xl shadow-md">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
