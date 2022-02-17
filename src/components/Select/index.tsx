interface ISelectProps {
  items: Array<string | Date>;
}

export function Select({ items }: ISelectProps) {
  return (
    <select className="
      rounded
      text-sm bg-light

      form-select form-select-sm
      appearance-none
      block
      w-full
      px-2
      py-1
      text-sm
      font-normal
      text-gray-700
      bg-white bg-clip-padding bg-no-repeat
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label=".form-select-sm example
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
