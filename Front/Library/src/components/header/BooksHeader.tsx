
import HeaderButton from './HeaderButton';
import SearchBar from '../ui/SearchBar';

interface BooksHeaderProps {
    onAddBook: () => void;
    onSearch: (query: string) => void;
}

function BooksHeader({ onAddBook, onSearch }: BooksHeaderProps) {
    return (
        <div className="mb-6">
            <nav className="flex items-center justify-between pb-4 mb-6">
                <h1 className='font-bold text-2xl sm:text-4xl text-gray-900'>Livros</h1>
                <div className="flex gap-4">
                    <HeaderButton onClick={onAddBook} variant="primary">
                        Novo
                    </HeaderButton>
                </div>
            </nav>

            <SearchBar className="w-full" onChange={(e) => onSearch(e.target.value)} />
        </div>
    );
}

export default BooksHeader;