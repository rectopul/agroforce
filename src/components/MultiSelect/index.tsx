import { MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';

interface IMultiSelect {
  id: string;
  name: string;
  title: string;
  data: string[];
  placeholder?: string;
  id_item?: string | number;
  text?: string;
  teste: (e: string) => void;
}

export function MultiSelect(props: IMultiSelect) {
  return (
    <div className="control-styles">
      <h4 className='block text-gray-900 text-sm font-bold mb-2'>
        {props.title}
      </h4>
      <div>
        <MultiSelectComponent
          id={props.id}
          name={props.name}
          onChange={(e: string) => props.teste(e)}
          dataSource={props.data}
          mode="Box"
          fields={{
            text: props.text,
            value: props.id_item?.toString(),
          }}
          placeholder={props.placeholder}
        />
      </div>
    </div>
  );
}
