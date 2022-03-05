import { InputHTMLAttributes } from 'react';

type IAllPropsAndDataCheckBox = InputHTMLAttributes<HTMLInputElement> & {
  title?: string;
};

export function CheckBox({ title, ...rest }: IAllPropsAndDataCheckBox) {
  return (
      <label className="w-auto inline-flex items-center">
        <input
          { ...rest }
          type="checkbox"
          className="form-checkbox text-blue-600"
        />
        <span className="ml-1 text-lx">
          { title }
        </span>
      </label>
  );
}
