interface IButtonProps {
  title: string;
  textColor: string;
  bgColor: string;
  onClick: (() => void);
}

export function Button({ title, textColor, bgColor, onClick }: IButtonProps) {
  return (
    <button 
      type="submit" 
      onClick={() => onClick}
      className={`h-10 w-32
      inline-block
      px-6 py-2.5 
      bg-${bgColor} text-${textColor}
      font-medium text-xs
      leading-tight 
      uppercase 
      rounded-full 
      shadow-md 
      hover:bg-blue-700 
      hover:shadow-lg 
      focus:bg-blue-700 
      focus:shadow-lg 
      focus:outline-none 
      focus:ring-0 
      active:bg-blue-800 
      active:shadow-lg 
      transition duration-150 
      ease-in-out
    `}>
      { title }
    </button>
  );
}
