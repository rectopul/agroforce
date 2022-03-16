import { SelectHTMLAttributes } from "react";

interface ISelectProps {
  id: number;
  name?: string;
}

type ITypeSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  data: ISelectProps[];
  selected: any
}

export function Select2({ selected, data, ...rest }: ITypeSelectProps) {
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
      <option value="">Selecione opções...</option>
     {
       data.map((item, index) => {
         let itemSelected: any = selected === item.id ? "selected" : "";
         return (
           <option {...itemSelected} key={index}value={item.id}>{item.name}</option>
         )
       })
     }
    </select>
  );
}
