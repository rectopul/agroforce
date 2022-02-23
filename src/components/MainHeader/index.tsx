import { ReactNode } from 'react';
import { FaRegUser } from 'react-icons/fa';

import { Select } from '../Select';
import { ModelHeader } from './ModelHeader';

interface IMainHeaderProps {
  children: never[] | ReactNode;
  name: string;
  avatar: string | ReactNode;
}

export function MainHeader({ children, name, avatar }: IMainHeaderProps) {
  const plantas = [ "Milho", "Algodão", "Sojá" ];
  const safras = [ "03/19", "04/20", "03/21" ];

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
          <Select values={plantas} />
          <Select values={safras}/>
        </div>

        <div className='h-20
          flex gap-4
          w-content-main-header
          text-white
        '>
          { children }
        </div>

        {
          !avatar ? (
            avatar = <FaRegUser className='w-44 text-white' />
          ) : (
            <ModelHeader
              name={name}
              imagem={String(avatar)}
            />
          )
        }
      </div>
    </header>
  );
}