interface ITabProps {
  label?: string | undefined;
  color: string;
  border: string;
}

export function Tab({
  label,
  color = 'gray-300',
  border = 'border-gray-300'
}: ITabProps) {
  return (
    <div className={`w-6/12 h-9 flex justify-center items-center border ${border} rounded-md bg-${color}`}>
      <span className='text-sm text-white' >{label}</span>
    </div>
  );
}
