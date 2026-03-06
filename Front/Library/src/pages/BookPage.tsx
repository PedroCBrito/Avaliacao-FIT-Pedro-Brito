import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBook } from '../hooks/useBooks';
import BookFormModal from '../components/modal/BookFormModal';
import BookHeader from '../components/header/BookHeader';
import DeleteModal from '../components/modal/DeleteModal';
import BookDetails from '../components/BookDetails';

function BookPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { book, loading, error, updateBook, deleteBook, isDeleting, deleteError } = useBook(id);

    const handleDeleteBook = async () => {
        if (!book) return;
        try {
            await deleteBook(book.id);
            navigate('/books');
        } catch {
            // deleteError is surfaced via the hook state
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
            <div className="container mx-auto px-2 sm:px-6 py-4 sm:py-6">
                <BookHeader
                    onEditBook={() => setIsEditModalOpen(true)}
                    backToHome={() => navigate('/books')}
                    openDeleteModal={() => setIsDeleteModalOpen(true)}
                />
                {loading && <p>Carregando...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {book && <BookDetails book={book} />}
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteBook}
                    loading={isDeleting}
                    error={deleteError}
                />
                <BookFormModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={async (data) => {
                        if (book) await updateBook(book.id, data);
                    }}
                    initialData={book ?? undefined}
                />
            </div>
        </div>
    );
}

export default BookPage;
