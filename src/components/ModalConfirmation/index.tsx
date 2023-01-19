import Modal from "react-modal";

interface IModalConfirmationProps {
  isOpen: boolean;
  text: string;
  onPress: Function;
  onCancel: Function;
}

export function ModalConfirmation({
  isOpen,
  text,
  onPress,
  onCancel,
}: IModalConfirmationProps) {
  return (
    <Modal
      isOpen={isOpen}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      onRequestClose={() => {
        onCancel();
      }}
      style={{ overlay: { zIndex: 1000 } }}
      overlayClassName="fixed inset-0 flex bg-transparent justify-center items-center bg-white/75"
      className="flex flex-col w-full h-44 max-w-xl bg-white rounded-3xl pt-2 pb-4 px-8 relative shadow-lg shadow-gray-900/50"
    >
      <div className="flex-1 flex-col font-bold text-center">
        <div className="flex-1 text-xl mt-2">{text}</div>
        <div
          className="flex justify-center"
          style={{ bottom: 20, left: 160, position: "absolute" }}
        >
          <div className="w-28 h-9 rounded-full flex justify-center items-center bg-blue-900 text-base text-white font-normal">
            <button
              className="flex-1"
              type="button"
              onClick={() => {
                onPress();
                onCancel();
              }}
            >
              SIM
            </button>
          </div>
          <div style={{ width: 50 }} />
          <div className="w-28 h-9 rounded-full flex justify-center items-center bg-white border-2 border-blue-900 text-base font-normal">
            <button className="flex-1" type="button" onClick={() => onCancel()}>
              NÃO
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
