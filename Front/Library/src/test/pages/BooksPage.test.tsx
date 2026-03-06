import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BooksPage from '../../pages/BooksPage';
import { useBookList } from '../../hooks/useBooks';

vi.mock('../../hooks/useBooks');

const mockUseBookList = vi.mocked(useBookList);

const sampleBooks = [
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
    book_description: 'Your journey to mastery.',
    book_img: 'https://example.com/cover2.jpg',
  },
];

const renderBooksPage = () =>
  render(
    <MemoryRouter>
      <BooksPage />
    </MemoryRouter>
  );

describe('BooksPage', () => {
  beforeEach(() => {
    mockUseBookList.mockReturnValue({
      books: sampleBooks,
      loading: false,
      error: null,
      createBook: vi.fn().mockResolvedValue(undefined),
    });
  });

  it('renders the Livros heading', () => {
    renderBooksPage();
    expect(screen.getByRole('heading', { name: 'Livros' })).toBeInTheDocument();
  });

  it('renders book cards for each book returned by the hook', () => {
    renderBooksPage();
    expect(screen.getByText('Clean Code')).toBeInTheDocument();
    expect(screen.getByText('The Pragmatic Programmer')).toBeInTheDocument();
  });

  it('shows the loading spinner when loading is true', () => {
    mockUseBookList.mockReturnValue({
      books: [],
      loading: true,
      error: null,
      createBook: vi.fn(),
    });
    const { container } = renderBooksPage();
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows the error message when error is provided', () => {
    mockUseBookList.mockReturnValue({
      books: [],
      loading: false,
      error: 'Failed to load books',
      createBook: vi.fn(),
    });
    renderBooksPage();
    expect(screen.getByText('Failed to load books')).toBeInTheDocument();
  });

  it('opens the BookFormModal when the Novo button is clicked', () => {
    renderBooksPage();
    expect(screen.queryByText('Novo Livro')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Novo/i }));
    expect(screen.getByText('Novo Livro')).toBeInTheDocument();
  });

  it('closes the BookFormModal when the cancel button is clicked', () => {
    renderBooksPage();
    fireEvent.click(screen.getByRole('button', { name: /Novo/i }));
    expect(screen.getByText('Novo Livro')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));
    expect(screen.queryByText('Novo Livro')).not.toBeInTheDocument();
  });

  it('filters books based on the search query after debounce', async () => {
    vi.useFakeTimers();
    renderBooksPage();

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Buscar'), { target: { value: 'clean' } });
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Clean Code')).toBeInTheDocument();
    expect(screen.queryByText('The Pragmatic Programmer')).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it('shows all books when the search query is cleared', async () => {
    vi.useFakeTimers();
    renderBooksPage();

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Buscar'), { target: { value: 'clean' } });
      vi.advanceTimersByTime(300);
    });

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Buscar'), { target: { value: '' } });
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Clean Code')).toBeInTheDocument();
    expect(screen.getByText('The Pragmatic Programmer')).toBeInTheDocument();

    vi.useRealTimers();
  });
});
