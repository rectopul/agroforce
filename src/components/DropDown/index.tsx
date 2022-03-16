import Link from 'next/link';

interface IDropDownProps {
  label: string;
  href: string;
}

export function DropDown({ label, href }: IDropDownProps) {
  return (
    <ul className='
      h-7 w-40 
      px-2 
      bg-white mb-2
    '>
      <li>
        <Link href={href}>
          <a className='
            text-lg 
            text-gray-900
            duration-300
            hover:text-blue-600
          '
          >
            {label}
          </a>
        </Link>
      </li>
    </ul>
  )
}
