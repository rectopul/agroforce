import Link from "next/link";
import { FaRegUserCircle } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineExitToApp } from "react-icons/md";

interface IModelProps {
  name: string | undefined;
  imagem?: string;
}

export function ModelHeader({ name, imagem: avatar }: IModelProps) {
  return (
    <>
      <div className="relative inline-block text-left">

        <button
          type='button'
          className='h-20 w-72
          flex items-center justify-around
          border-l border-white
          pl-2
          rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500
        '
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
        >
          
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={String(avatar)} alt={name} className='h-16 w-16
            rounded-bl-full	rounded-br-full	rounded-tr-full	rounded-tl-full border-2 border-white
          '/>
          <span className='w-full text-white text-base'>
            { name }
          </span>
        </button>
      </div>
      
      <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
        <div className="py-1" role="none">
          {/* Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" */}
          <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex={-1} id="menu-item-0">Account settings</a>
          <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex={-1} id="menu-item-1">Support</a>
          <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex={-1} id="menu-item-2">License</a>
          <form method="POST" action="#" role="none">
            <button type="submit" className="text-gray-700 block w-full text-left px-4 py-2 text-sm" role="menuitem" tabIndex={-1} id="menu-item-3">Sign out</button>
          </form>
        </div>
      </div>
    </>
  )
}
