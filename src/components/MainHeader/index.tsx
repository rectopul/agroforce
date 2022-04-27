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
        <div className='w-96 gap-2 flex justify-between items-center pr-3'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-tmg.png" alt="TMG" className='w-32 h-24
          '/>
          { headerSelects }
        </div>

        <div className='h-20
          flex gap-4
          w-content-main-header
          text-white
        '>
          { children }
        </div>

        <ModelHeader
          name={name}
          avatar={avatar}
        />

      </div>
    </header>
  );
}
