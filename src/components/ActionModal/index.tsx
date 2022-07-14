import Modal from 'react-bootstrap/Modal';
import { FiUserPlus } from 'react-icons/fi';
import readXlsxFile from 'read-excel-file';
import Swal from 'sweetalert2';
import { importService } from '../../services';
import { Button } from '../Button';
import { Input } from '../Input';

function ActionModal(props) {
  return (
    <Modal
      className="flex justify-center text-center align-items-center"
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton />
      <Modal.Body>
        <form
          className="w-full bg-white shadow-md rounded p-8 overflow-y-scroll"
          onSubmit={() => { }}
        >
          <div className="w-full h-10">
            <label className="block text-gray-900 text-sm font-bold mb-2">
              *Excel
            </label>
            <Input
              type="file"
              required
              id="inputFile"
              name="inputFile"
            />
          </div>
          <div className="
              h-10 w-full
              flex
              gap-3
              justify-center
              mt-10
            "
          >

            <div className="w-40">
              <Button
                type="submit"
                value="Cadastrar"
                bgColor="bg-blue-600"
                textColor="white"
                icon={<FiUserPlus size={18} />}
                onClick={() => { }}
              />
            </div>
          </div>
        </form>

      </Modal.Body>
      <Modal.Footer />
    </Modal>
  );
}

export default ActionModal;
