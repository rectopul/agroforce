import { InputHTMLAttributes } from 'react';
import CurrencyInput from 'react-currency-masked-input';

type ITypeInputProps = InputHTMLAttributes<HTMLInputElement>;

export function InputMoney({ value, onChange, ...rest }: ITypeInputProps) {
  return (
    <CurrencyInput
      className="shadow
        appearance-none
        bg-white bg-no-repeat
        border border-solid border-gray-300
        rounded
        w-full
        py-1 px-2
        text-gray-900
        text-xs
        leading-tight
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
        "
      {...rest}
      defaultValue={value}
      onChange={(e, mask) => onChange(mask)}
    />
  );
}
