import { ReactNode } from "react";

type ITabProps = {
  value: string | ReactNode | never[];
  active: (() => boolean);
  title: string;
  onClick: (() => void);
}

export function TabHeader({
  value,
  active,
  title,
  onClick
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
    <button className="h-full
      flex items-center gap-1
    ">
      <div className={`h-3/5 w-12
        flex justify-center items-center
        border ${border} rounded-md ${bg}
        rounded-bl-full	rounded-br-full	rounded-tr-full	rounded-tl-full
      `}>
        <span className={`${color} text-2xl`}>{value}</span>
      </div>

      <span className={`${border} text-sm`}>{title}</span>
    </button>
  );
}