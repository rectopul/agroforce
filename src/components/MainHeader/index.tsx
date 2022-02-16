import { FaRegUser } from 'react-icons/fa';

import { currentlyMonthYear } from '../../utils/currentlyDate';

export function MainHeader() {
  return (
    <header className="h-20 w-screen flex items-center  bg-gray-850">
      <div className="w-full flex justify-between items-center px-6 text-4xl">
        <h1 className="text-white">TMG</h1>

        <div className='w-40 flex justify-between items-center border-blue-600'>
          <div className='w-6/12 h-9 flex justify-center items-center border border-blue-600 rounded-md'>
            <span className='text-sm text-white' >{currentlyMonthYear()}</span>
          </div>
          <FaRegUser className='text-white'  />
        </div>
      </div>
    </header>
  );
}
