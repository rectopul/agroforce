import { SelectHTMLAttributes } from "react";

type ITypeSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  values: Array<string | object>;
}

export function Select({ values, ...rest }: ITypeSelectProps) {
  return (
    <select
      { ...rest }
      className="h-full w-full
      rounded
      form-select form-select-sm
      text-sm
      shadow
      font-normal
      text-gray-900
      bg-white bg-no-repeat
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label=".form-select-sm example
    ">
      <option value="">Selecione...</option>
     {
       values.map((value: string | object, index) => {
         return (
           <option key={index} value={value.toString()}>{value.toString()}</option>
         )
       })
     }
    </select>
  );
}
