
import HeaderButton from './HeaderButton';
import SearchBar from './SearchBar';

interface BooksHeaderProps {
    onAddBook: () => void;
}

function BooksHeader({ onAddBook }: BooksHeaderProps) {
    return (
        <div className="mb-6">
            <nav className="flex items-center justify-between pb-4 mb-6">
                <h1 className='font-bold text-4xl text-gray-900'>Livros</h1>
                <div className="flex gap-4">
                    <HeaderButton onClick={onAddBook} variant="primary">
                        Novo
                    </HeaderButton>
                </div>
            </nav>

            <SearchBar className="w-full" />
        </div>
    );
}

export default BooksHeader;