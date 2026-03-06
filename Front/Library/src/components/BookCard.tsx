import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { Book } from '../schemas/book.schemas';

const BookCard = memo(function BookCard({ id, title, book_description, book_img }: Book) {
    const imageSrc = book_img?.startsWith('http') || book_img?.startsWith('data:image') 
        ? book_img 
        : `data:image/jpeg;base64,${book_img}`;

    return (
        <Link to={`/book/${id}`} className="flex flex-col rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="flex items-center justify-center bg-gray-200 p-6 h-48 shrink-0">
                <img src={imageSrc} alt={title} className="w-24 h-32 object-cover rounded" />
            </div>

            <div className="flex flex-col gap-2 bg-white p-4 flex-1 min-h-0 overflow-hidden">
                <h2 className="text-xl font-bold text-gray-900 truncate">{title}</h2>
                <p className="text-gray-600 text-sm text-justify line-clamp-6">{book_description}</p>
            </div>
        </Link>
    );
});

export default BookCard;
