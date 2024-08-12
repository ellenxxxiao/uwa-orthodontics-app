import { SignIn } from "@clerk/nextjs";
export default function Page() {
  return (
    <div className="flex h-screen w-screen items-center">
      <SignIn
        appearance={{
          elements: {
            logoBox: "h-16",
            rootBox: "w-screen",
            headerTitle: "text-lg",
            cardBox: "h-3/4 sm:w-96 mx-auto shadow-none border",
            card: "h-full shadow-none rounded-none border-none",
            button: "border-none outline-none",
            formButtonPrimary: "bg-primary"
          }
        }}
      />
    </div>
  );
}
