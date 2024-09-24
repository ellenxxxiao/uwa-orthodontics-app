type Props = {
  nodeRight?: React.ReactNode;
  nodeTitle?: React.ReactNode;
};

export default function Header({ nodeRight, nodeTitle }: Props) {
  return (
    <div className="sticky top-0 flex h-20 w-full items-center justify-between bg-white px-4">
      {/* Title aligned to the left */}
      <div className="flex-grow text-3xl font-bold text-accent-focus">
        {nodeTitle}
      </div>

      {/* Icon aligned to the right */}
      <div className="flex items-center">{nodeRight}</div>
    </div>
  );
}
