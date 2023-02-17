import { InputHTMLAttributes } from 'react';

type IAllPropsAndDataCheckBox = InputHTMLAttributes<HTMLInputElement> & {
  title?: string;
};

export function CheckBox({ title, ...rest }: IAllPropsAndDataCheckBox) {
  console.log('🚀 ~ file: index.tsx:8 ~ CheckBox ~ rest', rest);
  console.log('🚀 ~ file: index.tsx:8 ~ CheckBox ~ title', title);
  return (
    <label className="w-full inline-flex items-center">
      <input
        {...rest}
        type="checkbox"
        className="form-checkbox text-blue-600"
      />
      <span className="ml-1 text-lx">
        {title}
      </span>
    </label>
  );
}
