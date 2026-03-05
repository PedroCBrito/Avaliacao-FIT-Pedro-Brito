
import HeaderButton from './HeaderButton';
import SearchBar from './SearchBar';

function BooksHeader() {
    return (
        <div className="mb-6">
            <nav className="flex items-center justify-between pb-4 mb-6">
                <h1 className='font-bold text-4xl text-gray-900'>Livros</h1>
                <div className="flex gap-4">
                    <HeaderButton to="/add-book" variant="primary">
                        Novo
                    </HeaderButton>
                </div>
            </nav>

            <SearchBar className="w-full" />
        </div>
    );
}

export default BooksHeader;