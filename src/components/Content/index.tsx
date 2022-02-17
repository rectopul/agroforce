import { ReactNode } from "react";

interface IContentProps {
  children: never[] | ReactNode;
}

export function Content({ children }: IContentProps) {
  return (
    <div className="flex w-container-all-main-contents border border-gray-700
    ">
      { children }
    </div>
  );
}
