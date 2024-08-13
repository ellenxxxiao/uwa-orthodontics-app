// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { LuChevronLeft, LuUserPlus } from "react-icons/lu";

// import Footer from "@/app/components/Footer";
// import Header from "@/app/components/Header";
// import InvitationDialog from "@/app/components/Invitation"; 

// interface Contact {
//   id: string;
//   firstName: string;
//   lastName: string;
//   avatarUrl: string;
// }

// export default function ContactList() {
//   const router = useRouter();
//   const [showDialog, setShowDialog] = useState(false);
//   const [showSuccessMessage, setShowSuccessMessage] = useState(false);

//   const mockContacts: Contact[] = [
//     { id: "1", firstName: "Alian", lastName: "Haidar", avatarUrl: "/default-avatar.png" },
//     { id: "2", firstName: "Ellen", lastName: "Xiao", avatarUrl: "/default-avatar.png" },
//     { id: "3", firstName: "Eric", lastName: "Xiao", avatarUrl: "/default-avatar.png" },
//     { id: "4", firstName: "Neha", lastName: "", avatarUrl: "/default-avatar.png" },
//     { id: "5", firstName: "Runtian", lastName: "Liang", avatarUrl: "/default-avatar.png" },
//     { id: "6", firstName: "Zimu", lastName: "Zhang", avatarUrl: "/default-avatar.png" },
//   ];

//   const [contacts, setContacts] = useState<Contact[]>(mockContacts);
//   const [searchQuery, setSearchQuery] = useState("");

//   const filteredContacts = contacts.filter((contact) =>
//     `${contact.firstName} ${contact.lastName}`
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase())
//   );

//   const handleLetterClick = (letter: string) => {
//     const section = document.getElementById(letter);
//     if (section) {
//       section.scrollIntoView({ behavior: "smooth", block: "start" });
//     }
//   };

//   const handleSendInvitation = (email: string) => {
//     console.log("Sending invitation to:", email);
//     setShowDialog(false);
//     setShowSuccessMessage(true);
//     setTimeout(() => {
//       setShowSuccessMessage(false);
//     }, 3000);
//   };

//   return (
//     <div className="flex h-screen flex-col bg-white relative">
//       <Header
//         type="primary"
//         iconLeft={
//           <LuChevronLeft
//             size={30}
//             strokeWidth={1.3}
//             className="text-primary"
//             onClick={() => router.back()}
//           />
//         }
//         iconRight={
//           <LuUserPlus
//             size={30}
//             strokeWidth={1.3}
//             className="text-primary"
//             onClick={() => setShowDialog(true)}
//           />
//         }
//         title="Contacts"
//       />

//       {showSuccessMessage && (
//         <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-purple-100 text-purple-600 px-4 py-2 rounded-lg shadow-lg">
//           Invitation sent
//         </div>
//       )}

//       <div className="p-4">
//         <div className="relative">
//           <input
//             type="text"
//             className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 text-sm focus:outline-none"
//             placeholder="Search for someone..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto">
//         {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
//           const contactsForLetter = filteredContacts.filter((contact) => {
//             const firstLetter = contact.lastName[0] || contact.firstName[0];
//             return firstLetter.toUpperCase() === letter;
//           });

//           return (
//             contactsForLetter.length > 0 && (
//               <div key={letter}>
//                 <div
//                   id={letter}
//                   className="px-4 py-2 text-gray-500 font-bold"
//                 >
//                   {letter}
//                 </div>
//                 {contactsForLetter.map((contact, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center px-4 py-3 cursor-pointer border-b"
//                     onClick={() => router.push(`/chat/${contact.id}`)}
//                   >
//                     <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
//                       <Image
//                         src={contact.avatarUrl}
//                         alt={`${contact.firstName} ${contact.lastName}`}
//                         width={40}
//                         height={40}
//                         className="object-cover"
//                       />
//                     </div>
//                     <div className="ml-4 text-lg text-black font-medium">
//                       {contact.firstName} {contact.lastName}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )
//           );
//         })}
//       </div>

//       <div className="fixed right-0 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-1 text-blue-500">
//         {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
//           <button
//             key={letter}
//             onClick={() => handleLetterClick(letter)}
//             className="text-xs focus:outline-none"
//           >
//             {letter}
//           </button>
//         ))}
//       </div>

//       <Footer />
      
//       <InvitationDialog
//         isOpen={showDialog}
//         onClose={() => setShowDialog(false)}
//         onSend={handleSendInvitation}
//       />
//     </div>
//   );
// }
