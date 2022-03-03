import { InputHTMLAttributes } from 'react';

type IAllPropsAndDataCheckBox = InputHTMLAttributes<HTMLInputElement> & {
  title: string;
  id: number
};

export function CheckBox({ title, id, ...rest }: IAllPropsAndDataCheckBox) {
  return (
    <label className="w-auto inline-flex items-center">
      <input
        { ...rest }
        type="checkbox"
        className="form-checkbox text-blue-600"
        value={id}
      />
      <span className="ml-1 text-lx">
        { title }
      </span>
    </label>
  );
}
