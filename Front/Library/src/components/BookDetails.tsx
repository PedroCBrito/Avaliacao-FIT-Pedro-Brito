import { memo } from 'react';
import type { Book } from '../schemas/book.schemas';
import { formatDateBR } from '../lib/dateUtils';

interface BookDetailsProps {
    book: Book | null;
}

function BookCover({ src, title }: { src: string; title: string }) {
    const imageSrc =
        src.startsWith('http') || src.startsWith('data:image')
            ? src
            : `data:image/jpeg;base64,${src}`;

    return (
        <div className="flex items-center justify-center h-full">
            <img
                src={imageSrc}
                alt={title}
                className="w-60 h-64 object-cover"
            />
        </div>
    );
}

function BookMeta({ author, published_date }: { author: string; published_date: string }) {
    const formattedDate = formatDateBR(published_date);

    return (
        <div className="flex items-start justify-between">
            <div>
                <p className="text-base text-black">Por {author}</p>
            </div>
            <div className="text-right">
                <p className="text-base text-lg text-black">Publicado em {formattedDate}</p>
            </div>
        </div>
    );
}

function BookDescription({ description }: { description: string }) {
    return (
        <div className='mt-6'>
            <p className="text-gray-600 text-base leading-relaxed text-justify whitespace-pre-wrap">{description}</p>
        </div>
    );
}

const BookDetails = memo(function BookDetails({ book }: BookDetailsProps) {
    if (!book) return null;

    return (
        <div className="flex gap-8 p-8">
            <div className="flex flex-col gap-6 w-2/3">
                <h1 className="text-4xl font-bold text-gray-900 leading-tight">{book.title}</h1>
                <BookMeta author={book.author} published_date={book.published_date} />
            
                <BookDescription description={book.book_description} />
            </div>
            
            <div className="w-1/3 shrink-0">
                <BookCover src={book.book_img} title={book.title} />
            </div>
        </div>
    );
});

export default BookDetails;
