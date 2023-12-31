/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link';
import { ReactNode } from 'react';
import { perm_can_do } from '../../shared/utils/perm_can_do';

interface IDropDownProps {
  label: string;
  href: string;
  icon: string | ReactNode;
}

export function DropDown({ label, href, icon }: IDropDownProps) {
  return (
    <>
      {perm_can_do(`${href}`, 'view') ? (
        <ul
          className="
      h-7
      px-2
      bg-white mb-0.5
    "
          style={{ maxWidth: '300px' }}
        >
          <li>
            <Link href={href}>
              <a
                className="
              flex
              items-center
              gap-2
              text-base
              text-gray-900
              duration-300
              hover:text-blue-600
              "
                href={href}
              >
                {icon}
                {label}
              </a>
            </Link>
          </li>
        </ul>
      ) : (
        <></>
      )}
    </>
  );
}
