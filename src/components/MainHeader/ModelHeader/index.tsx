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
      <button
        type='button'
        className='h-20 w-72
        flex items-center justify-around
        border-l border-white
        pl-2
      '
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={String(avatar)} alt={name} className='h-16 w-16
          rounded-bl-full	rounded-br-full	rounded-tr-full	rounded-tl-full border-2 border-white
        '/>
        <span className='w-full text-white text-base'>
          { name }
        </span>
      </button>

      <div className="modal fade right-3/4 fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
        id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog relative w-auto pointer-events-none">
          <div
            className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
            <div
              className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-300 rounded-t-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={String(avatar)} alt={name} className='h-16 w-16
                rounded-bl-full	
                rounded-br-full	
                rounded-tr-full	
                rounded-tl-full 
                border-2 border-gray-300
              '/>
              <h5 className="text-xl 
                pl-2
                font-medium 
                leading-normal 
                text-gray-800" 
                id="exampleModalLabel
                ">
                  {name}
              </h5>
              <button type="button"
                className="btn-close 
                  box-content 
                  w-2 h-2 
                  p-2 
                  text-black 
                  border-none rounded-none 
                  opacity-50 
                  focus:shadow-none focus:outline-none focus:opacity-100
                  transition
                  duration-150
                  hover:text-black hover:opacity-75 hover:no-underline"
                data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="flex items-center gap-1
              pl-4
              p-1
              modal-body
              relative 
            ">
              <FaRegUserCircle size={24} className="text-blue-600" />
              <a href="#" className="text-lg text-gray-600
                transition
                duration-150
                hover:text-blue-800
              ">
                Alterar avatar
              </a>
            </div>

            <div className="flex items-center gap-1
              pl-4
              p-1
              modal-body relative 
            ">
              <RiLockPasswordLine size={24} className="text-yellow-500" />
              <a href="#" className="text-lg text-gray-600
                transition
                duration-150
                hover:text-blue-800
              ">
                Alterar senha
              </a>
            </div>
            <div
              className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-300 rounded-b-md">
              <button type="button" className="px-5
                py-1.5
                bg-blue-600
                text-white
                font-medium
                text-lg
                leading-tight
                rounded
                shadow-md
                transition
                duration-150
                hover:bg-blue-800 hover:shadow-lg
                focus:bg-blue-800 focus:shadow-lg focus:outline-none focus:ring-0
                active:bg-blue-900 active:shadow-lg
                ease-in-out" data-bs-dismiss="modal">Voltar</button>
              <button type="button" className="px-5
                py-1.5
                bg-red-800
                text-white
                font-medium
                text-lg
                leading-tight
                rounded
                shadow-md
                transition
                duration-150
                hover:bg-red-700 hover:shadow-lg
                focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0
                active:bg-red-800 active:shadow-lg
                ease-in-out
                ml-1
              ">
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
