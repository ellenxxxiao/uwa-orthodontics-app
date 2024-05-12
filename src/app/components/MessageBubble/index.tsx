type Props = {
  key: string;
  text: string;
  isSender: boolean;
};

export default function MessageBubble({ key, text, isSender }: Props) {
  return (
    <div className={`flex ${isSender ? "justify-end" : ""}`}>
      <div
        className={`${
          isSender ? "rounded-br" : "rounded-bl"
        } text-sm md:text-base text-app-black bg-app-white p-4 rounded-2xl max-w-xs md:max-w-md`}
      >
        {text}
      </div>
    </div>
  );
}
