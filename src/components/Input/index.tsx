import { InputHTMLAttributes, ReactNode } from "react";

type ITypeInputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ ...rest }: ITypeInputProps) {
  return (
    <input
      className="shadow
        appearance-none
        bg-white bg-no-repeat
        border border-solid border-gray-300
        rounded
        w-full
        py-2 px-3
        text-gray-900
        leading-tight
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
      { ...rest }
    />
  );
}
