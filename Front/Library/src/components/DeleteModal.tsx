import Modal from './ui/Modal';
import ModalButton from './ui/ModalButton';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

function DeleteModal({ isOpen, onClose, onConfirm }: DeleteModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Tem Certeza?">
            <p className="text-center text-gray-600 text-base">
                Ao excluir este livro não será possível recuperá-lo. Realmente deseja excluí-lo?
            </p>
            <div className="flex justify-center gap-4">
                <ModalButton variant="secondary" onClick={onClose}>
                    Cancelar
                </ModalButton>
                <ModalButton
                    variant="primary"
                    className="bg-red-600 hover:bg-red-700 disabled:bg-red-300"
                    onClick={onConfirm}
                >
                    Excluir
                </ModalButton>
            </div>
        </Modal>
    );
}

export default DeleteModal;
