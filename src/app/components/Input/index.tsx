import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({ label, value, onChange, ...rest }: Props) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      {...rest}
      className="h-full w-full flex-1 rounded-lg border border-base-200 px-3 text-base text-accent-focus focus:outline-none"
    />
  );
}
