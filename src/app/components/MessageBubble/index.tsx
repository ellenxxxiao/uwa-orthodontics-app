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
  isSender
}: Props) {
  return (
    <div key={key} className={`flex ${isSender ? "justify-end" : ""}`}>
      <div className="flex flex-col">
        <div
          className={`${
            isSender ? "rounded-br" : "rounded-bl"
          } max-w-xs rounded-2xl bg-app-white p-4 text-sm text-app-black md:max-w-md md:text-base`}
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
