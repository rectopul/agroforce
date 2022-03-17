/* This example requires Tailwind CSS v2.0+ */
import { Fragment, ReactNode } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'

import { FaRegEdit, FaRegUserCircle } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineExitToApp } from "react-icons/md";

import { userService } from "../../../services";
import { useState, useEffect } from 'react';
import { BiUser } from 'react-icons/bi';
import { Observer } from 'react-hook-form/dist/utils/createSubject';
 
interface IModelProps {
  name: string;
  avatar: string | ReactNode;
}


export function ModelHeader({ name, avatar }: IModelProps) {
  function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
  }
  
  const [user, setUser] = useState <any>();

  useEffect(() => {
      const subscription = userService.user.subscribe(x => setUser(x));
      return () => subscription.unsubscribe();
  }, []);

  function logout() {
    userService.logout();
  }

  // only show nav when logged in
  if (!user) return null;
  
  return (
    <>
      <Menu as="div" className="relative inline-block text-left shadow z-50">
        <div>
          <Menu.Button
            type='button'
            className='h-20 w-72
              flex items-center justify-around
            '
            // rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500
            id="menu-button"
            aria-expanded="true"
            aria-haspopup="true"
          >
            
            {
              !avatar || avatar === '' ? (
                <div className='h-16 w-20
                  flex items-center justify-center
                  rounded-bl-full	rounded-br-full	rounded-tr-full	rounded-tl-full border-2 border-white
                '>
                   <img src='/images/logo-agro-branco.png' alt={name} className='h-14 w-14
                      rounded-bl-full	rounded-br-full	rounded-tr-full	rounded-tl-full border-2 border-white
                    '/>
                </div>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={String(avatar)} alt={name} className='h-16 w-16
                  rounded-bl-full	rounded-br-full	rounded-tr-full	rounded-tl-full border-2 border-white
                '/>
              )
            }
            <span style={{textAlign:'left', marginLeft: '10px'}} className='w-full text-white text-base'>
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
          <Menu.Items className="w-64 origin-top-right 
           mr-7 absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 
            ring-black ring-opacity-5 focus:outline-none
          ">
            <div className="py-1">
              <div className='flex items-center justify-start gap-1
                border 
                border-b-gray-300
                border-t-white
                border-r-white
                border-l-white
                py-2
                px-2
              '>
                {
                  !avatar || avatar === '' ? (
                    <div className='
                      flex items-center justify-center
                      rounded-bl-full	rounded-br-full	rounded-tr-full	rounded-tl-full border-2 border-gray-700
                    '>
                      <img src='/images/logo-agro-escuro.png' alt={name} className='h-14 w-14
                      rounded-bl-full	rounded-br-full	rounded-tr-full	rounded-tl-full border-2 border-white
                    '/>
                    </div>
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={String(avatar)} alt={name} className='h-14 w-14
                      rounded-bl-full	rounded-br-full	rounded-tr-full	rounded-tl-full border-2 border-white
                    '/>
                  )
                }
                <strong className='text-xs text-gray-700'>{name}</strong>
              </div>

              <Menu.Item>
                {({ active }) => (
                  <a
                  href="#"
                  className={classNames(
                    active ? 'bg-gray-100 text-blue-600' : 'text-gray-700',
                    'block px-4 py-2 text-base flex flex-row items-center gap-1'
                    )}
                    >
                    <FaRegUserCircle />
                    <span>Perfil</span>
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-100 text-blue-600' : 'text-gray-700',
                      'block px-4 py-2 text-base flex items-center gap-1'
                    )}
                  >
                    <FaRegEdit />
                    Alterar dados pessoais
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-100 text-blue-600' : 'text-gray-700',
                      'block px-4 py-2 text-base flex items-center gap-1'
                    )}
                  >
                    <RiLockPasswordLine />
                    Editar senha
                  </a>
                )}
              </Menu.Item>
              <form method="POST" action="#" className='mt-2 border-t border-gray-300'>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="submit"
                      className={classNames(
                        active ? 'bg-gray-100 text-red-600' : 'text-red-800',
                        'block w-full text-left px-4 py-2 text-base flex items-center gap-1'
                      )}
                      onClick={logout}
                    >
                      <MdOutlineExitToApp />
                      <strong>Sair</strong>
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
