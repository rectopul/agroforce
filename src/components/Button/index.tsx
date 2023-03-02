import { useRouter } from 'next/router';
import { ButtonHTMLAttributes, ReactNode } from 'react';

type ITypeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  value?: string;
  title?: string;
  type?: string;
  onClick: () => any;
  style?: any;
  icon?: string | ReactNode;
  bgColor?: string;
  textColor?: string;
  hoverBgColor?: string;
  hoverTextColor?: string;
  href?: string | any;
  disabled?: boolean;
  rounder?: string | any;
};

export function Button({
  value,
  title,
  type,
  icon,
  onClick,
  style,
  textColor,
  bgColor,
  hoverBgColor,
  hoverTextColor,
  href,
  disabled,
  rounder,
}: ITypeButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(href);
  };

  return !href ? (
    <button
      title={title}
      disabled={disabled}
      type={type}
      onClick={onClick}
      style={style}
      className={`w-full h-full
        flex justify-center items-center gap-2
        px-3 
        ${bgColor}
        text-${textColor}
        text-base
        leading-tight
        rounded-lg
        shadow-md
        border-1 border-${textColor}
        transition duration-150
        hover:${hoverBgColor}
        hover:shadow-lg
        hover:text-${hoverTextColor}
        hover:shadow-lg
				${rounder}
      `}
    >
      {icon}
      {value}
    </button>
  ) : (
    <button
      title={title}
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={`w-full h-full
        flex justify-center items-center gap-2
        px-3 
        ${bgColor}
        text-${textColor}
        text-base
        leading-tight
        rounded-lg
        shadow-md
        border-1 border-${textColor}
        transition duration-150
        hover:${hoverBgColor}
        hover:shadow-lg
        hover:text-${hoverTextColor}
        hover:shadow-lg
      `}
    >
      {icon}
      {value}
    </button>
  );
}
