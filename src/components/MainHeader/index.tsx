import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';
import { ModelHeader } from './ModelHeader';


interface IMainHeaderProps {
  headerSelects: ReactNode;
  children: ReactNode;
  name: string;
  avatar: string;
}

export function MainHeader({ children, name, avatar, headerSelects }: IMainHeaderProps) {
  return (
    <header className="h-20 w-screen
      flex items-center
      bg-gray-450 
    ">
      <div className="w-full 
        flex justify-between items-center text-center
        pr-2
        text-4xl
      ">
        <div className='lg:w-2/6 md:w-5/12 gg:w-[580px] sm:w-[400px] gap-1 flex  items-center pr-3 mr-5'>
          <Link passHref href="/">
            <Image src="/images/logo-tmg.png" alt="TMG" width={160} height={150} />
          </Link>
          {headerSelects}
        </div>

        <div className='h-20
          flex gap-8
          w-content-main-header
          text-white
        '>
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
