import { useState, useEffect } from 'react';
import { useBooks } from '../hooks/useBooks';
import BooksContainer from '../components/BooksContainer';
import BooksHeader from '../components/BooksHeader';
import AddBookModal from '../components/AddBookModal';

function BooksPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { books, loading, error, fetchBooks, createBook } = useBooks();

    useEffect(() => {
        fetchBooks().catch(() => {});
    }, [fetchBooks]);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="container mx-auto p-6">
                <BooksHeader onAddBook={() => setIsModalOpen(true)} />
                <BooksContainer books={books} loading={loading} error={error} />
            </div>

            <AddBookModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={createBook}
            />
        </div>
    );
}

export default BooksPage;
