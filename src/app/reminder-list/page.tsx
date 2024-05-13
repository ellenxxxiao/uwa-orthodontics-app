"use client";

import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <div className="flex h-screen flex-col">
        {/* main */}
        <div className="w-full flex-1 overflow-y-auto bg-base-100">
          REMINDER MAIN
        </div>

        {/* footer */}
        <Footer />
      </div>
    </>
  );
}
