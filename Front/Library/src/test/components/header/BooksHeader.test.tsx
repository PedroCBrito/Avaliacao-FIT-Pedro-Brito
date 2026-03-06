import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import BooksHeader from '../../../components/header/BooksHeader';

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe('BooksHeader', () => {
  it('renders the "Livros" heading', () => {
    renderWithRouter(<BooksHeader onAddBook={vi.fn()} onSearch={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'Livros' })).toBeInTheDocument();
  });

  it('renders the Novo button', () => {
    renderWithRouter(<BooksHeader onAddBook={vi.fn()} onSearch={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Novo/i })).toBeInTheDocument();
  });

  it('renders the SearchBar', () => {
    renderWithRouter(<BooksHeader onAddBook={vi.fn()} onSearch={vi.fn()} />);
    expect(screen.getByPlaceholderText('Buscar')).toBeInTheDocument();
  });

  it('calls onAddBook when the Novo button is clicked', () => {
    const onAddBook = vi.fn();
    renderWithRouter(<BooksHeader onAddBook={onAddBook} onSearch={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /Novo/i }));
    expect(onAddBook).toHaveBeenCalledTimes(1);
  });

  it('calls onSearch with the typed value when user types in the search bar', () => {
    const onSearch = vi.fn();
    renderWithRouter(<BooksHeader onAddBook={vi.fn()} onSearch={onSearch} />);
    fireEvent.change(screen.getByPlaceholderText('Buscar'), { target: { value: 'react' } });
    expect(onSearch).toHaveBeenCalledWith('react');
  });
});
