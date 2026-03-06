import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import BookCard from '../../components/BookCard';
import type { Book } from '../../schemas/book.schemas';

const book: Book = {
  id: 1,
  title: 'Clean Code',
  author: 'Robert C. Martin',
  published_date: '2008-08-01',
  book_description: 'A handbook of agile software craftsmanship.',
  book_img: 'https://example.com/cover.jpg',
};

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe('BookCard', () => {
  it('renders the book title', () => {
    renderWithRouter(<BookCard {...book} />);
    expect(screen.getByText('Clean Code')).toBeInTheDocument();
  });

  it('renders the book description', () => {
    renderWithRouter(<BookCard {...book} />);
    expect(screen.getByText(book.book_description)).toBeInTheDocument();
  });

  it('links to the correct book detail page', () => {
    renderWithRouter(<BookCard {...book} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/book/1');
  });

  it('uses the image src directly when it starts with "http"', () => {
    renderWithRouter(<BookCard {...book} />);
    expect(screen.getByAltText('Clean Code')).toHaveAttribute('src', 'https://example.com/cover.jpg');
  });

  it('uses the image src directly when it starts with "data:image"', () => {
    const dataBook = { ...book, book_img: 'data:image/jpeg;base64,abc123' };
    renderWithRouter(<BookCard {...dataBook} />);
    expect(screen.getByAltText('Clean Code')).toHaveAttribute('src', 'data:image/jpeg;base64,abc123');
  });

  it('prepends data:image/jpeg;base64, prefix for raw base64 strings', () => {
    const rawBase64Book = { ...book, book_img: 'rawbase64string' };
    renderWithRouter(<BookCard {...rawBase64Book} />);
    expect(screen.getByAltText('Clean Code')).toHaveAttribute(
      'src',
      'data:image/jpeg;base64,rawbase64string'
    );
  });
});
