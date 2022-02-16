import { FaRegUser } from 'react-icons/fa';

import { currentlyMonthYear } from '../../utils/currentlyDate';

interface IMainHeaderProps {
  safra: string;
  date: string;
}

export function MainHeader() {
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

        <div className='w-content-main-header text-white'>
          <h1>Content</h1>
        </div>

        <FaRegUser className='w-10 text-white'  />
      </div>
    </header>
  );
}
