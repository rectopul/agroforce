import { HiOutlineClipboardList, HiOutlineMail } from 'react-icons/hi';
import { IoFingerPrintSharp } from 'react-icons/io5';
import { BiSearchAlt } from 'react-icons/bi';
import { GiThreeLeaves } from 'react-icons/gi';
import { VscGraph } from 'react-icons/vsc';
import { BsGear } from 'react-icons/bs';

export function Aside() {
  return (
    <aside className="h-aside w-32
      bg-gray-700 
      border-r border-r-white
    ">
      <nav className="flex flex-col gap-6
        pt-4
        text-gray-300
      ">
        <a href="#" id="lista" className="flex flex-col content-center items-center text-sm	 transition delay-150 hover:-translate-y-1 hover:text-blue-600 hover:scale-110 hover:bg-indigo-500 duration-300">
          <HiOutlineClipboardList size={32} />
          Lista
        </a>
        <a href="#" id="lista" className="flex flex-col content-center items-center text-sm transition delay-150 hover:-translate-y-1 hover:text-blue-600 hover:scale-110 hover:bg-indigo-500 duration-300">
          <IoFingerPrintSharp size={32} />
          Ensaio
        </a>

        <a href="#" id="lista" className="flex flex-col text-sm items-center text-sm transition delay-150 hover:-translate-y-1 hover:text-blue-600 hover:scale-110 hover:bg-indigo-500 duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Sorteio
        </a>

        <a href="#" id="lista" className="flex flex-col text-sm items-center text-sm transition delay-150 hover:-translate-y-1 hover:text-blue-600 hover:scale-110 hover:bg-indigo-500 duration-300">
          <BiSearchAlt size={32} />
          Experimento
        </a>

        <a href="#" id="lista" className="flex flex-col text-sm items-center text-sm transition delay-150 hover:-translate-y-1 hover:text-blue-600 hover:scale-110 hover:bg-indigo-500 duration-300">
          <HiOutlineMail size={32} />
          Envelope
        </a>

        <a href="#" id="lista" className="flex flex-col text-sm items-center text-sm transition delay-150 hover:-translate-y-1 hover:text-blue-600 hover:scale-110 hover:bg-indigo-500 duration-300">
          <GiThreeLeaves size={32} />
          Plantio
        </a>

        <a href="#" id="lista" className="flex flex-col text-center items-center text-sm transition delay-150 hover:-translate-y-1 hover:text-blue-600 hover:scale-110 hover:bg-indigo-500 duration-300">
          <VscGraph size={32} />
          Notificações e Relatórios
        </a>

        <a href="#" id="lista" className="flex flex-col text-sm items-center text-sm transition delay-150 hover:-translate-y-1 hover:text-blue-600 hover:scale-110 hover:bg-indigo-500 duration-300">
          <BsGear size={32} />
          Configurações
        </a>
      </nav>
    </aside>
  );
}
