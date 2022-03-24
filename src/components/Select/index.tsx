import { SelectHTMLAttributes } from "react";

type ITypeSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  values: Array<string | object>;
  selected: any
}

export function Select({ selected, values, ...rest }: ITypeSelectProps) {
  return (
    <select
      { ...rest }
      className="h-full w-full
      form-select form-select-sm
      shadow
      text-base
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
       values.map((value: string | object | any, index) => {
         let itemSelected: any = selected == value.id ? 'selected' : '';
         return (
           <option selected={itemSelected} key={index} value={value.id}>{value.name.toString()}</option>
         )
       })
     }
    </select>
  );
}
