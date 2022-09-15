import { ReactNode } from 'react';
import Modal from 'react-modal';
import { RiCloseCircleFill } from 'react-icons/ri';

interface ModalComponentProps {
  isOpen: boolean;
  children?: ReactNode;
  onPress: Function;
  onCancel: Function;
}

export function ModalComponent({
  isOpen,
  children,
  onPress,
  onCancel,
}: ModalComponentProps) {
  return (
    <Modal
      isOpen={isOpen}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      onRequestClose={() => { onCancel(); }}
      overlayClassName="fixed inset-0 flex bg-transparent justify-center items-center bg-white/75"
      className="flex flex-col w-full h-64 max-w-xl bg-gray-50 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-2xl pt-2 pb-4 px-8 relative shadow-lg shadow-gray-900/50"
    >
      <button
        type="button"
        className="flex absolute top-4 right-3 justify-end"
        onClick={() => { onCancel(); }}
      >
        <RiCloseCircleFill size={35} className="fill-red-600 hover:fill-red-800" />
      </button>
      {children}

      {/* <div className="flex justify-end py-11"> */}
      <div className="flex absolute bottom-10 right-8">
        <div className="h-10 w-40">
          <button
            type="submit"
            value="Cadastrar"
            className="w-full h-full ml-auto mt-6 bg-green-600 text-white px-8 rounded-lg text-sm hover:bg-green-800"
            onClick={(e) => onPress(e)}
          >
            Confirmar
          </button>
        </div>
      </div>
    </Modal>
  );
}
