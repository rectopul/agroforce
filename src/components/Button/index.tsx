import { ReactNode } from "react";

interface IButtonProps {
  title?: string;
  onClick: (() => any);
  icon?: string | ReactNode;
  bgColor?: string;
  textColor?: string;
  hoverBgColor?: string;
  hoverTextColor?: string;
}

export function Button({
  title,
  icon,
  onClick,
  textColor,
  bgColor,
  hoverBgColor,
  hoverTextColor
}: IButtonProps) {
  return (
    <button 
      type="submit" 
      onClick={onClick}
      className={`w-full h-full
      flex justify-center items-center gap-2
      px-4 
      ${bgColor}
      text-${textColor}
      font-medium text-xs
      leading-tight
      rounded-lg
      shadow-md
      border-2 border-${textColor}
      transition duration-150
      hover:${hoverBgColor}
      hover:shadow-lg
      hover:text-${hoverTextColor}
      hover:shadow-lg
    `}>
      {icon}
      { title }
    </button>
  );
}
