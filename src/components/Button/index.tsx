import { useRouter } from "next/router";
import { ButtonHTMLAttributes, ReactNode } from "react";

type ITypeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  value?: string;
  title?: string;
  onClick: (() => any);
  icon?: string | ReactNode;
  bgColor?: string;
  textColor?: string;
  hoverBgColor?: string;
  hoverTextColor?: string;
  href?: string | any;
  disabled?: boolean;
}

export function Button({
  value,
  title,
  icon,
  onClick,
  textColor,
  bgColor,
  hoverBgColor,
  hoverTextColor,
  href,
  disabled
}: ITypeButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(href);
  }

  return (
    !href ? (
      <button
        title={title}
        disabled={disabled}
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
        { value }
      </button>
    ) : (
      <button
        title={title}
        type="submit" 
        disabled={disabled}
        onClick={handleClick}
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
        { value }
      </button>
    )
  );
}
