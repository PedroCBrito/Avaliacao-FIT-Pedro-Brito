import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DeleteModal from '../../../components/modal/DeleteModal';

describe('DeleteModal', () => {
  it('renders nothing when isOpen is false', () => {
    render(
      <DeleteModal isOpen={false} onClose={vi.fn()} onConfirm={vi.fn()} />
    );
    expect(screen.queryByText('Tem Certeza?')).not.toBeInTheDocument();
  });

  it('renders confirmation message when isOpen is true', () => {
    render(
      <DeleteModal isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} />
    );
    expect(screen.getByText('Tem Certeza?')).toBeInTheDocument();
    expect(screen.getByText(/Ao excluir este livro/i)).toBeInTheDocument();
  });

  it('renders the error message when error prop is provided', () => {
    render(
      <DeleteModal isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} error="Deletion failed" />
    );
    expect(screen.getByText('Deletion failed')).toBeInTheDocument();
  });

  it('does not render an error message when error is absent', () => {
    render(
      <DeleteModal isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} />
    );
    expect(screen.queryByText('Deletion failed')).not.toBeInTheDocument();
  });

  it('shows "Excluindo..." and disables both buttons when loading is true', () => {
    render(
      <DeleteModal isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} loading={true} />
    );
    expect(screen.getByText('Excluindo...')).toBeInTheDocument();
    screen.getAllByRole('button').forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it('calls onConfirm when the delete button is clicked', () => {
    const handleConfirm = vi.fn();
    render(
      <DeleteModal isOpen={true} onClose={vi.fn()} onConfirm={handleConfirm} />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the cancel button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <DeleteModal isOpen={true} onClose={handleClose} onConfirm={vi.fn()} />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
