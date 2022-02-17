import { ReactNode } from 'react';
import { FaRegUser } from 'react-icons/fa';

import { currentlyMonthYear } from '../../utils/currentlyDate';

interface IMainHeaderProps {
  children: never[] | ReactNode;
}

export function MainHeader({ children }: IMainHeaderProps) {
  return (
    <header className="h-20 w-screen flex items-center  bg-gray-450">
      <div className="w-full flex justify-between items-center px-6 text-4xl">
        <div className='w-64 gap-2 flex justify-between items-center'>
          <h1 className="text-white">TMG</h1>
          <div className='w-6/12 h-9 flex justify-center items-center border border-blue-600 rounded-md'>
            <span className='text-sm text-white' >{currentlyMonthYear()}</span>
          </div>
          <div className='w-6/12 h-9 flex justify-center items-center border border-blue-600 rounded-md'>
            <span className='text-sm text-white' >{currentlyMonthYear()}</span>
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
