import { useEffect } from "react";
import { useBooks } from "../hooks/useBooks";
import BookItemFrame from "./BookItemFrame";

function BooksContainer() {
    const { books, loading, error, fetchBooks } = useBooks();

    useEffect(() => {
        fetchBooks().catch(() => {});
    }, [fetchBooks]);

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
                <BookItemFrame key={book.id} {...book} />
            ))}
        </div>
    );
}

export default BooksContainer;
