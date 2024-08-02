export type ChatListItem = {
  contactUser: {
    id: string;
    firstName: string;
    lastName: string;
  };
  lastMessage: {
    text: string;
    sentAt: Date;
  };
};
