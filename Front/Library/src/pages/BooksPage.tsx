import { useState, useEffect, useMemo } from 'react';
import { useBooks } from '../hooks/useBooks';
import BooksContainer from '../components/BooksContainer';
import BooksHeader from '../components/BooksHeader';
import BookFormModal from '../components/BookFormModal';

function BooksPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { books, loading, error, fetchBooks, createBook } = useBooks();

    useEffect(() => {
        fetchBooks().catch(() => {});
    }, [fetchBooks]);

    const filteredBooks = useMemo(
        () => books.filter((b) => b.title.toLowerCase().includes(searchQuery.toLowerCase())),
        [books, searchQuery]
    );

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="container mx-auto p-6">
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
