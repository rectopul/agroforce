import { ReactNode } from "react";

interface IContentProps {
  children: never[] | ReactNode;
}

export function Content({ children }: IContentProps) {
  return (
    <div className="flex flex-col
      w-container-all-main-contents
      
      border border-gray-700
      bg-gray-300
    ">
      { children }
    </div>
  );
}
