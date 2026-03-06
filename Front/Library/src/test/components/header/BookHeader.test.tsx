import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import BookHeader from '../../../components/header/BookHeader';

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe('BookHeader', () => {
  it('renders the Voltar, Editar and Excluir buttons', () => {
    renderWithRouter(
      <BookHeader onEditBook={vi.fn()} backToHome={vi.fn()} openDeleteModal={vi.fn()} />
    );
    expect(screen.getByRole('button', { name: /Voltar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Editar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Excluir/i })).toBeInTheDocument();
  });

  it('calls backToHome when the Voltar button is clicked', () => {
    const backToHome = vi.fn();
    renderWithRouter(
      <BookHeader onEditBook={vi.fn()} backToHome={backToHome} openDeleteModal={vi.fn()} />
    );
    fireEvent.click(screen.getByRole('button', { name: /Voltar/i }));
    expect(backToHome).toHaveBeenCalledTimes(1);
  });

  it('calls onEditBook when the Editar button is clicked', () => {
    const onEditBook = vi.fn();
    renderWithRouter(
      <BookHeader onEditBook={onEditBook} backToHome={vi.fn()} openDeleteModal={vi.fn()} />
    );
    fireEvent.click(screen.getByRole('button', { name: /Editar/i }));
    expect(onEditBook).toHaveBeenCalledTimes(1);
  });

  it('calls openDeleteModal when the Excluir button is clicked', () => {
    const openDeleteModal = vi.fn();
    renderWithRouter(
      <BookHeader onEditBook={vi.fn()} backToHome={vi.fn()} openDeleteModal={openDeleteModal} />
    );
    fireEvent.click(screen.getByRole('button', { name: /Excluir/i }));
    expect(openDeleteModal).toHaveBeenCalledTimes(1);
  });
});
