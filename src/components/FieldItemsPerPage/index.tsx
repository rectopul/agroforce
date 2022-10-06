import { Select } from "../";

interface FieldItemsPerPageProps {
  selected: any;
  onChange: Function;
  widthClass?: string;
}

export function FieldItemsPerPage({
  selected,
  onChange,
  widthClass = "w-1/3",
}: FieldItemsPerPageProps) {
  return (
    <div className={`h-7 ${widthClass} ml-2`}>
      <label className="block text-gray-900 text-sm font-bold mb-1">
        Itens por página
      </label>
      <Select
        values={[
          { id: 10, name: 10 },
          { id: 50, name: 50 },
          { id: 100, name: 100 },
          { id: 200, name: 200 },
          { id: 500, name: 500 },
          { id: 1000, name: 1000 },
        ]}
        selected={selected}
        onChange={(e: any) => onChange(e.target.value)}
      />
    </div>
  );
}
