import { InputHTMLAttributes, ReactNode } from "react";

type ITypeInputProps = InputHTMLAttributes<HTMLInputElement>

interface InputProps {
  icon?: string | ReactNode;
}

export function Input({ icon, ...rest }: InputProps & ITypeInputProps) {
  return (
    <div className="w-full h-full
      flex rounded-md shadow-sm">
      {
        !icon ? (
          <>
            <span>
              { icon }
            </span>
            <input
              {...rest}
              className="h-full w-full
              text-gray-900
              px-2
              bg-gray-50
              rounded-r-md
              focus:border-blue-600
              focus:outline-none
            "
            />
          </>
        ) : (
          <>
            <span className="inline-flex 
              items-center
              px-3
              rounded-l-md
              bg-gray-200 bg-no-repeat
              text-blue-600
              border-solid border-gray-300
            ">
              { icon }
            </span>
            <input
              {...rest}
              className="h-full w-full
              text-gray-900
              px-2
              bg-gray-200
              rounded-r-md
              focus:border-blue-600
              focus:outline-none
            "/>
          </>
          
        )
      }
    </div>
  );
}
