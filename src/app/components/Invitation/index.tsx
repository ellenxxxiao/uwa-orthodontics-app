import { useState } from "react";

interface InvitationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (email: string) => void;
}

export default function InvitationDialog({ isOpen, onClose, onSend }: InvitationDialogProps) {
  const [email, setEmail] = useState("");

  const handleSendClick = () => {
    onSend(email);
    setEmail(""); // Reset email input after sending
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-purple-50 p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold text-black">Invitation</h2>
        <p className="mt-1 text-sm text-gray-600">Add a patient.</p>
        <div className="mt-4">
          <label htmlFor="email" className="block text-sm font-medium text-black">
            Email
          </label>
          <div className="relative mt-1">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="example.demo@gmail.com"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-3 py-1 flex items-center text-gray-500 hover:text-black"
              onClick={() => setEmail("")}
            >
              &#x2715;
            </button>
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleSendClick}
            className="px-4 py-2 bg-transparent text-purple-600 rounded-md hover:bg-purple-600 hover:text-white focus:bg-purple-600 focus:text-white focus:outline-none"
          >
            Send
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-transparent text-purple-600 rounded-md hover:bg-purple-600 hover:text-white focus:bg-purple-600 focus:text-white focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
