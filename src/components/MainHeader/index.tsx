import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';
import { ModelHeader } from './ModelHeader';

interface IMainHeaderProps {
  headerSelects: ReactNode
  children: ReactNode
  name: string
  avatar: string
}

export function MainHeader({
  children, name, avatar, headerSelects,
}: IMainHeaderProps) {
  return (
    <header className="
			h-20
			w-res-1366-768
      flex
			items-center
      bg-gray-450
    "
    >
      <div className="
				w-full
        flex
				justify-center
				items-center
				text-center
        pr-2
        text-4xl
      "
      >
        <div className="w-6/12 gap-1 flex items-center">
          <Link passHref href="/">
            <Image src="/images/logo-tmg.png" alt="TMG" width={130} height={130} />
          </Link>
          {headerSelects}
        </div>

        <div className="
          flex
					gap-4
          w-content-main-header
          text-white
        "
        >
          {children}
        </div>

        <ModelHeader
          name={name}
          avatar={avatar}
        />

      </div>
    </header>
  );
}
