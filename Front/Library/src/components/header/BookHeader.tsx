
import HeaderButton from './HeaderButton';

interface BookHeaderProps {
    onEditBook: () => void;
    backToHome: () => void;
    openDeleteModal: () => void;
}

function BookHeader({ onEditBook, backToHome, openDeleteModal }: BookHeaderProps) {
    return (
        <div className="mb-6">
            <nav className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6">
                <HeaderButton onClick={backToHome} variant="primary">
                    <i className="fa-solid fa-angle-left mr-2"></i>
                    Voltar
                </HeaderButton>
                <div className="flex gap-3 sm:gap-4">
                    <HeaderButton onClick={onEditBook} variant="primary">
                        Editar
                    </HeaderButton>
                    <HeaderButton onClick={openDeleteModal} variant="delete">
                        Excluir
                    </HeaderButton>
                </div>
            </nav>
        </div>
    );
}

export default BookHeader;