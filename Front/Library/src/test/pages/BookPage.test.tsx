import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BookPage from '../../pages/BookPage';
import { useBook } from '../../hooks/useBooks';

vi.mock('../../hooks/useBooks');

const mockUseBook = vi.mocked(useBook);

const sampleBook = {
  id: 1,
  title: 'Clean Code',
  author: 'Robert C. Martin',
  published_date: '2008-08-01',
  book_description: 'A handbook of agile software craftsmanship.',
  book_img: 'https://example.com/cover.jpg',
};

const renderBookPage = (id = '1') =>
  render(
    <MemoryRouter initialEntries={[`/book/${id}`]}>
      <Routes>
        <Route path="/book/:id" element={<BookPage />} />
        <Route path="/books" element={<div>Books List Page</div>} />
      </Routes>
    </MemoryRouter>
  );

describe('BookPage', () => {
  beforeEach(() => {
    mockUseBook.mockReturnValue({
      book: sampleBook,
      loading: false,
      error: null,
      updateBook: vi.fn().mockResolvedValue(undefined),
      deleteBook: vi.fn().mockResolvedValue(undefined),
      isDeleting: false,
      deleteError: null,
    });
  });

  it('renders the book details when a book is loaded', () => {
    renderBookPage();
    expect(screen.getByRole('heading', { name: 'Clean Code' })).toBeInTheDocument();
    expect(screen.getByText(/Robert C. Martin/)).toBeInTheDocument();
  });

  it('shows a loading message when loading is true', () => {
    mockUseBook.mockReturnValue({
      book: null,
      loading: true,
      error: null,
      updateBook: vi.fn(),
      deleteBook: vi.fn(),
      isDeleting: false,
      deleteError: null,
    });
    renderBookPage();
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('shows an error message when error is provided', () => {
    mockUseBook.mockReturnValue({
      book: null,
      loading: false,
      error: 'Book not found',
      updateBook: vi.fn(),
      deleteBook: vi.fn(),
      isDeleting: false,
      deleteError: null,
    });
    renderBookPage();
    expect(screen.getByText('Book not found')).toBeInTheDocument();
  });

  it('opens the delete modal when the Excluir button is clicked', () => {
    renderBookPage();
    expect(screen.queryByText('Tem Certeza?')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Excluir/i }));
    expect(screen.getByText('Tem Certeza?')).toBeInTheDocument();
  });

  it('closes the delete modal when the Cancelar button is clicked', () => {
    renderBookPage();
    fireEvent.click(screen.getByRole('button', { name: /Excluir/i }));
    expect(screen.getByText('Tem Certeza?')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));
    expect(screen.queryByText('Tem Certeza?')).not.toBeInTheDocument();
  });

  it('opens the edit modal when the Editar button is clicked', () => {
    renderBookPage();
    expect(screen.queryByText('Editar Livro')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Editar/i }));
    expect(screen.getByText('Editar Livro')).toBeInTheDocument();
  });

  it('navigates to /books after successful deletion', async () => {
    const deleteBook = vi.fn().mockResolvedValue(undefined);
    mockUseBook.mockReturnValue({
      book: sampleBook,
      loading: false,
      error: null,
      updateBook: vi.fn(),
      deleteBook,
      isDeleting: false,
      deleteError: null,
    });

    renderBookPage();
    fireEvent.click(screen.getByRole('button', { name: /Excluir/i }));
    // Two "Excluir" buttons are now visible: the header one and the modal confirm one.
    // Click the last rendered one (modal confirm button).
    const excluirButtons = screen.getAllByRole('button', { name: /^Excluir$/i });
    fireEvent.click(excluirButtons[excluirButtons.length - 1]);

    await waitFor(() => {
      expect(screen.getByText('Books List Page')).toBeInTheDocument();
    });
  });

  it('shows deleteError in the delete modal when deletion fails', async () => {
    mockUseBook.mockReturnValue({
      book: sampleBook,
      loading: false,
      error: null,
      updateBook: vi.fn(),
      deleteBook: vi.fn().mockRejectedValue(new Error('Delete failed')),
      isDeleting: false,
      deleteError: 'Delete failed',
    });

    renderBookPage();
    fireEvent.click(screen.getByRole('button', { name: /Excluir/i }));
    expect(screen.getByText('Delete failed')).toBeInTheDocument();
  });

  it('renders the Voltar button that navigates back', () => {
    renderBookPage();
    expect(screen.getByRole('button', { name: /Voltar/i })).toBeInTheDocument();
  });

  it('navigates to /books when the Voltar button is clicked', () => {
    renderBookPage();
    fireEvent.click(screen.getByRole('button', { name: /Voltar/i }));
    expect(screen.getByText('Books List Page')).toBeInTheDocument();
  });
});
