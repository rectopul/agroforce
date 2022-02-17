import { ReactNode } from 'react';
import { FaRegUser } from 'react-icons/fa';

import { Select } from '../Select';

interface IMainHeaderProps {
  children: never[] | ReactNode;
  avatar: string | ReactNode;
}

export function MainHeader({ children, avatar }: IMainHeaderProps) {
  const plantas = [ "Milho", "Algodão", "Sojá" ];
  const safras = [ "03/19", "04/20", "03/21" ];

  avatar = '/images/person.jpg';

  return (
    <header className="h-20 w-screen 
      flex items-center
      border-b border-white
      bg-gray-700
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
          <Select items={plantas} />
          <Select items={safras} />
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
            <div className='h-20 w-72
              flex items-center justify-around
              border-l border-white
              pl-2
            '>
              
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={String(avatar)} alt="Avatar" className='h-16 w-16
                rounded-bl-full	rounded-br-full	rounded-tr-full	rounded-tl-full border-2 border-white
              '/>
              <span className='w-full text-white text-base'>
                Juliana Aparecia da Silva
              </span>
            </div>
          )
        }
      </div>
    </header>
  );
}
