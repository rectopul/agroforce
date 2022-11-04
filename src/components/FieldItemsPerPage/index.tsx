interface FieldItemsPerPageProps {
  label?: string;
  selected: any;
  onChange: Function;
  widthClass?: string;
}

const items = [
  { id: 10, name: 10 },
  { id: 50, name: 50 },
  { id: 100, name: 100 },
  { id: 200, name: 200 },
  { id: 500, name: 500 },
  { id: 1000, name: 1000 },
];

export function FieldItemsPerPage({
  label = "Itens por página",
  selected,
  onChange,
  widthClass = "w-1/3",
}: FieldItemsPerPageProps) {
  return (
    <div className={`h-7 ${widthClass} ml-2`}>
      <label className="block text-gray-900 text-sm font-bold mb-1">
        {label}
      </label>
      <select
        className="h-full w-full
      form-select form-select-sm
      shadow
      text-sm
      text-gray-900
      bg-white bg-no-repeat
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        aria-label=".form-select-sm example
    "
        value={selected}
        onChange={(e) => onChange(e.target.value)}
      >
        {items?.map((item: any) => (
          <option value={item?.id}>{item?.name}</option>
        ))}
      </select>
    </div>
  );
}
