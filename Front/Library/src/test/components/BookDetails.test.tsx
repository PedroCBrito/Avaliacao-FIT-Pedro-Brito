import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BookDetails from '../../components/BookDetails';
import type { Book } from '../../schemas/book.schemas';

const book: Book = {
  id: 1,
  title: 'Clean Code',
  author: 'Robert C. Martin',
  published_date: '2008-08-01',
  book_description: 'A handbook of agile software craftsmanship.',
  book_img: 'https://example.com/cover.jpg',
};

describe('BookDetails', () => {
  it('renders null when book prop is null', () => {
    const { container } = render(<BookDetails book={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the book title', () => {
    render(<BookDetails book={book} />);
    expect(screen.getByRole('heading', { name: 'Clean Code' })).toBeInTheDocument();
  });

  it('renders the author name', () => {
    render(<BookDetails book={book} />);
    expect(screen.getByText(/Robert C. Martin/)).toBeInTheDocument();
  });

  it('renders the published date formatted in Brazilian style', () => {
    render(<BookDetails book={book} />);
    // 2008-08-01 → 01/08/2008
    expect(screen.getByText(/01\/08\/2008/)).toBeInTheDocument();
  });

  it('renders the book description', () => {
    render(<BookDetails book={book} />);
    expect(screen.getByText(book.book_description)).toBeInTheDocument();
  });

  it('uses the image src directly when it starts with "http"', () => {
    render(<BookDetails book={book} />);
    expect(screen.getByAltText('Clean Code')).toHaveAttribute('src', 'https://example.com/cover.jpg');
  });

  it('uses the image src directly when it starts with "data:image"', () => {
    const dataBook = { ...book, book_img: 'data:image/jpeg;base64,abc' };
    render(<BookDetails book={dataBook} />);
    expect(screen.getByAltText('Clean Code')).toHaveAttribute('src', 'data:image/jpeg;base64,abc');
  });

  it('prepends data:image/jpeg;base64, for raw base64 strings', () => {
    const rawBook = { ...book, book_img: 'rawbase64' };
    render(<BookDetails book={rawBook} />);
    expect(screen.getByAltText('Clean Code')).toHaveAttribute(
      'src',
      'data:image/jpeg;base64,rawbase64'
    );
  });
});
