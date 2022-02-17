interface ISelectProps {
  items: Array<string | Date>;
}

export function Select({ items }: ISelectProps) {
  return (
    <select className="w-full h-full text-sm bg-gray-300 
    ">
      {
        items.map((value) => {
          return (
            <option key={value.toString()}>{value}</option>
          )
        })
      }
    </select>
  );
}
