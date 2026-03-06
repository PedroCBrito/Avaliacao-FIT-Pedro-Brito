import type { Book } from '../schemas/book.schemas';
import BookCard from './BookCard';

interface BooksContainerProps {
    books: Book[];
    loading: boolean;
    error: string | null;
}

function BooksContainer({ books, loading, error }: BooksContainerProps) {
    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return <p className="text-red-500 text-center py-10">{error}</p>;
    }

    if (books.length === 0) {
        return <p className="text-gray-500 text-center py-10">No books found.</p>;
    }

    return (
        <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
                <BookCard key={book.id} {...book} />
            ))}
        </div>
    );
}

export default BooksContainer;
