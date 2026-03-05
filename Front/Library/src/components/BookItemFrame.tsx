import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { Book } from '../schemas/book.schemas';

const BookItemFrame = memo(function BookItemFrame({ id, title, book_description, book_img }: Book) {
    const imageSrc = book_img?.startsWith('http') || book_img?.startsWith('data:image') 
        ? book_img 
        : `data:image/jpeg;base64,${book_img}`;

    return (
        <Link to={`/book/${id}`} className="flex flex-col rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="flex items-center justify-center bg-gray-200 p-6">
                <img src={imageSrc} alt={title} className="w-24 h-32 object-cover rounded" />
            </div>

            <div className="flex flex-col gap-2 bg-white p-4">
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                <p className="text-gray-500 text-sm text-justify">{book_description}</p>
            </div>
        </Link>
    );
});

export default BookItemFrame;
