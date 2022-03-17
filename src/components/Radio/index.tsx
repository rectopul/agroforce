import { InputHTMLAttributes } from "react";

type IAllPropsAndDataRadio = InputHTMLAttributes<HTMLInputElement>  & {
  title: string;
}

export function Radio({ title, ...rest }: IAllPropsAndDataRadio) {
  return (
    <div className="flex justify-center">
      <div>
        <div className="form-check">
          <input 
            className="form-check-input 
              appearance-none 
              rounded-full 
              h-4 w-4 
              border 
              border-gray-300 
              bg-white 
              checked:bg-blue-600 
              checked:border-gray-50
              checked: shadow-lg
              focus:outline-none 
              transition 
              duration-200 
              mt-1 align-top 
              bg-no-repeat 
              bg-center 
              bg-contain 
              float-left 
              mr-2 
              cursor-pointer
            " 
            type="radio" 
            { ...rest }
          />
          <label className="form-check-label inline-block text-gray-900">
            { title }
          </label>
        </div>
      </div>
    </div>
  );
}
