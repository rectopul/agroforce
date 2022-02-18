/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'

import { FaRegUserCircle } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineExitToApp } from "react-icons/md";

interface IModelProps {
  name: string | undefined;
  imagem?: string;
}


export function ModelHeader({ name, imagem: avatar }: IModelProps) {
  function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
  }
  
  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <div>

          <Menu.Button
            type='button'
            className='h-20 w-72
              flex items-center justify-around
             
              pl-2
            '
            // rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500
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
          </Menu.Button>
        </div>
    
      
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <div className='flex items-center justify-start border 
              border-b-gray-300
              border-t-white
              border-r-white
              border-l-white
            '>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={String(avatar)} alt={name} className='h-12 w-12
                rounded-bl-full	rounded-br-full	rounded-tr-full	rounded-tl-full border-2 border-white
              '/>
              <span className='text-xs'>{name}</span>
            </div>

            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-gray-100 text-red-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Editar avatar
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Editar senha
                </a>
              )}
            </Menu.Item>
            <form method="POST" action="#">
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="submit"
                    className={classNames(
                      active ? 'bg-gray-100 text-red-600' : 'text-red-800',
                      'block w-full text-left px-4 py-2 text-sm'
                    )}
                  >
                    Sair
                  </button>
                )}
              </Menu.Item>
            </form>
          </div>
        </Menu.Items>
      </Transition>
      </Menu>
    </>
  )
}
