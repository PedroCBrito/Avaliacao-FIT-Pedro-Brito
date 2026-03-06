import { useState, useMemo, useEffect } from 'react';
import { useBookList } from '../hooks/useBooks';
import BooksContainer from '../components/BooksContainer';
import BooksHeader from '../components/header/BooksHeader';
import BookFormModal from '../components/modal/BookFormModal';

function BooksPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const { books, loading, error, createBook } = useBookList();

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const filteredBooks = useMemo(
        () => books.filter((b) => b.title.toLowerCase().includes(debouncedQuery.toLowerCase())),
        [books, debouncedQuery]
    );

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
            <div className="container mx-auto px-2 sm:px-6 py-4 sm:py-6">
                <BooksHeader onAddBook={() => setIsModalOpen(true)} onSearch={setSearchQuery} />
                <BooksContainer books={filteredBooks} loading={loading} error={error} />
            </div>

            <BookFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={createBook}
            />
        </div>
    );
}

export default BooksPage;
