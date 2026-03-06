import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import BooksContainer from '../../components/BooksContainer';
import type { Book } from '../../schemas/book.schemas';

const books: Book[] = [
  {
    id: 1,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    published_date: '2008-08-01',
    book_description: 'A handbook of agile software craftsmanship.',
    book_img: 'https://example.com/cover.jpg',
  },
  {
    id: 2,
    title: 'The Pragmatic Programmer',
    author: 'David Thomas',
    published_date: '1999-10-20',
    book_description: 'Your journey to mastery in software development.',
    book_img: 'https://example.com/cover2.jpg',
  },
];

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe('BooksContainer', () => {
  it('shows a loading spinner when loading is true', () => {
    const { container } = renderWithRouter(
      <BooksContainer books={[]} loading={true} error={null} />
    );
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows the error message when error is provided', () => {
    renderWithRouter(
      <BooksContainer books={[]} loading={false} error="Failed to fetch books" />
    );
    expect(screen.getByText('Failed to fetch books')).toBeInTheDocument();
  });

  it('shows "No books found." when the books array is empty and not loading', () => {
    renderWithRouter(<BooksContainer books={[]} loading={false} error={null} />);
    expect(screen.getByText('No books found.')).toBeInTheDocument();
  });

  it('renders a card for each book', () => {
    renderWithRouter(<BooksContainer books={books} loading={false} error={null} />);
    expect(screen.getByText('Clean Code')).toBeInTheDocument();
    expect(screen.getByText('The Pragmatic Programmer')).toBeInTheDocument();
  });

  it('renders the correct number of book links', () => {
    renderWithRouter(<BooksContainer books={books} loading={false} error={null} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
  });

  it('does not show the spinner or empty message when books are present', () => {
    const { container } = renderWithRouter(
      <BooksContainer books={books} loading={false} error={null} />
    );
    expect(container.querySelector('.animate-spin')).not.toBeInTheDocument();
    expect(screen.queryByText('No books found.')).not.toBeInTheDocument();
  });
});
