interface IButtonProps {
  title: string;
  onClick: (() => void);
}

export function Button({ title, onClick }: IButtonProps) {
  return (
    <button
      type='submit'
      onClick={onClick}
      className='h-10 w-32 rounded-full bg-blue-600 text-white button-animation
    '>
      { title }
    </button>
  );
}
