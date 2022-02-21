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
            <span className="bg-text">
              { icon }
            </span>
            <input
              {...rest}
              className="h-full w-full
              px-2
              flex-1 
              block
              caret-blue-600
              sm:text-sm
              rounded-lg
              shadow-lg
              border border-gray-300
              hover:shadow-lg
            "
            />
          </>
        ) : (
          <>
            <span className="inline-flex 
              items-center
              px-3
              rounded-l-md 
              border 
              border-r-0 
              text-sm
              bg-gray-200
              border-gray-200
            ">
              { icon }
            </span>
            <input
              {...rest}
              name="company-website"
              id="company-website"
              className="h-full w-full
              px-2
              flex-1 
              block
              rounded-none
              rounded-r-md 
              sm:text-sm
              bg-gray-200
            "/>
          </>
          
        )
      }
    </div>
  );
}

{/* <input 
       className="form-control
         block
         w-full
         px-3
         py-1.5
         text-base
         font-normal
         text-gray-700
         bg-white bg-clip-padding
         border border-solid border-gray-300
         rounded
         transition
         ease-in-out
         m-0
         focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
         id="floatingPassword" 
       { ...rest }
     /> */}