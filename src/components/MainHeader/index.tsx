import { ReactNode } from 'react';
import { FaRegUser } from 'react-icons/fa';

import { currentlyMonthYear } from '../../utils/currentlyDate';
import { Select } from '../Select';

interface IMainHeaderProps {
  children: never[] | ReactNode;
}

export function MainHeader({ children }: IMainHeaderProps) {
  const plantas = [ "Milho", "Algodão", "Sojá" ];
  const safras = [ "03/19", "04/20", "03/21" ];

  return (
    <header className="h-20 w-screen flex items-center  bg-gray-450">
      <div className="w-full flex justify-between items-center px-6 text-4xl">
        <div className='w-64 gap-2 flex justify-between items-center'>
          <h1 className="text-white">TMG</h1>
          <div className='w-6/12 h-9 flex justify-center items-center border border-blue-600 rounded-md'>
            <Select items={plantas} />
          </div>
          <div className='w-6/12 h-9 flex justify-center items-center border border-blue-600 rounded-md'>
            <Select items={safras} />
          </div>
        </div>

        <div className='flex gap-4 w-content-main-header text-white'>
          { children }
        </div>

        <FaRegUser className='w-10 text-white'  />
      </div>
    </header>
  );
}
