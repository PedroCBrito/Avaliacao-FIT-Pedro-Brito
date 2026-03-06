import Modal from './Modal';
import ModalButton from './ModalButton';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
    error?: string | null;
}

function DeleteModal({ isOpen, onClose, onConfirm, loading = false, error }: DeleteModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Tem Certeza?">
            <p className="text-center text-gray-600 text-base">
                Ao excluir este livro não será possível recuperá-lo. Realmente deseja excluí-lo?
            </p>
            {error && <p className="text-center text-red-500 text-sm">{error}</p>}
            <div className="flex justify-center gap-4">
                <ModalButton variant="secondary" onClick={onClose} disabled={loading}>
                    Cancelar
                </ModalButton>
                <ModalButton
                    variant="primary"
                    className="bg-red-600 hover:bg-red-700 disabled:bg-red-300"
                    onClick={onConfirm}
                    disabled={loading}
                >
                    {loading ? 'Excluindo...' : 'Excluir'}
                </ModalButton>
            </div>
        </Modal>
    );
}

export default DeleteModal;
