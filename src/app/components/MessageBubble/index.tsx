import { format } from "date-fns";

type Props = {
  key: string;
  text: string;
  isSender: boolean;
  time: Date;
  showTime: boolean;
};

const formatTime = (time: Date) => {
  return format(time, "hh:mm aa");
};

export default function MessageBubble({
  key,
  time,
  showTime,
  text,
  isSender,
}: Props) {
  return (
    <div key={key} className={`flex ${isSender ? "justify-end" : ""}`}>
      <div className="flex flex-col">
        <div
          className={`${
            isSender ? "rounded-br" : "rounded-bl"
          } text-sm md:text-base text-app-black bg-app-white p-4 rounded-2xl max-w-xs md:max-w-md`}
        >
          {text}
        </div>

        {showTime && (
          <div
            className={`mt-1 text-xs text-app-black text-opacity-50 ${
              isSender ? "place-self-end" : "place-self-start"
            }`}
          >
            {formatTime(time)}
          </div>
        )}
      </div>
    </div>
  );
}
