import { InputHTMLAttributes } from 'react';

interface IProfile {
  id: number;
  name?: string;
  created_by: number;
}

type IAllPropsAndDataCheckBox = InputHTMLAttributes<HTMLInputElement> & {
  data: IProfile[];
};

export function CheckBox({ data, ...rest }: IAllPropsAndDataCheckBox) {
  return (
    <>
      {
        data.map((item, index) => (
          <>
            <label key={index} className="w-auto inline-flex items-center">
              <input
                { ...rest }
                type="checkbox"
                className="form-checkbox text-blue-600"
                value={item.id}
              />
              <span className="ml-1 text-lx">
                { item.name }
              </span>
            </label>
          </>
        ))
      }
    </>
  );
}
