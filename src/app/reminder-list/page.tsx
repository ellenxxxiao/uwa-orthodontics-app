"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <div className="flex flex-col h-screen">
        {/* main */}
        <div className="w-full flex-1 bg-base-100 overflow-y-auto">
          REMINDER MAIN
        </div>

        {/* footer */}
        <Footer />
      </div>
    </>
  );
}
