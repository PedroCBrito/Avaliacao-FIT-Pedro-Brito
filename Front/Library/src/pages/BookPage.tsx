import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import BookFormModal from '../components/BookFormModal';
import BookHeader from '../components/BookHeader';
import DeleteModal from '../components/DeleteModal';
import BookDetails from '../components/BookDetails';
import { type Book } from '../schemas/book.schemas';

function BookPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [book, setBook] = useState<Book | null>(null);
    const { loading, error, getBookById, updateBook, deleteBook } = useBooks();

    useEffect(() => {
        if (id) {
            getBookById(id).then(setBook).catch(() => {});
        }
    }, [id, getBookById]);

    const handleDeleteBook = async () => {
        if (!book) return;
        await deleteBook(book.id);
        navigate('/books');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="container mx-auto p-6">
                <BookHeader
                    onEditBook={() => setIsEditModalOpen(true)}
                    backToHome={() => navigate('/books')}
                    openDeleteModal={() => setIsDeleteModalOpen(true)}
                />
                {loading && <p>Carregando...</p>}
                {error && <p className="text-red-500">{error}</p>}
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteBook}
                />
                {book && (
                    <>
                        <BookDetails book={book} />
                        <BookFormModal
                            isOpen={isEditModalOpen}
                            onClose={() => setIsEditModalOpen(false)}
                            onSubmit={async (data) => {
                                const updated = await updateBook(book.id, data);
                                setBook(updated);
                            }}
                            initialData={book}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

export default BookPage;
