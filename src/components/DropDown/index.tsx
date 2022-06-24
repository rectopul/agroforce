
import Link from 'next/link';
import { ReactNode } from 'react';

interface IDropDownProps {
  label: string;
  href: string;
  icon: string | ReactNode;
}

export function DropDown({ label, href, icon }: IDropDownProps) {
  return (
    <ul className="
      h-7 w-40
      px-2
      bg-white mb-2
    "
    >
      <li>
        <Link href={href}>
          <a className="
            flex
            items-center
            gap-1
            text-lg
            text-gray-900
            duration-300
            hover:text-blue-600
            "
          >
            {icon}
            {label}
          </a>
        </Link>
      </li>
    </ul>
  );
}
