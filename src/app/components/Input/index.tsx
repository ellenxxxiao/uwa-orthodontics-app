type Props = {
  label: string;
  placeholder: string;
};

export default function Input({ label, placeholder }: Props) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="flex-1 border border-base-200 rounded-lg h-full px-3 text-base w-full focus:outline-none text-accent-focus"
    />
  );
}
