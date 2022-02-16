import { ReactNode } from "react";

interface ITabProps {
  value: string | ReactNode;
  active: (() => boolean);
  title: string;
}

export function TabHeader({
  value,
  active,
  title
}: ITabProps) {
  let bg;
  let color;
  let border;

  if (active() === true) {
    bg = 'bg-blue-600';
    color = 'text-white';
    border = 'border-white';
  } else {
    bg = 'bg-gray-300';
    color = 'text-gray-700';
    border = 'border-gray-300';
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`w-14 h-14 flex justify-center items-center border ${border} rounded-md ${bg}
        rounded-bl-full	rounded-br-full	rounded-tr-full	rounded-tl-full
      `}>
        <span className={`${color} text-2xl`}>{value}</span>
      </div>

      <span className={`${border} text-lg`}>{title}</span>
    </div>
  );
}
