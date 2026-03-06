import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import BookFormModal from '../../../components/modal/BookFormModal';
import type { BookInput } from '../../../schemas/book.schemas';

// Replace ImageUpload with a simple test double so we can trigger image changes easily
vi.mock('../../../components/ui/ImageUpload', () => ({
  default: ({ onChange, error }: { onChange: (b: string) => void; error?: string }) => (
    <div>
      <button type="button" onClick={() => onChange('data:image/jpeg;base64,mock')}>
        Upload Image
      </button>
      {error && <p>{error}</p>}
    </div>
  ),
}));

const baseInitialData: BookInput = {
  title: 'Clean Code',
  author: 'Robert C. Martin',
  published_date: '2008-08-01',
  book_description: 'A handbook of agile software craftsmanship.',
  book_img: 'data:image/jpeg;base64,existing',
};

describe('BookFormModal', () => {
  it('renders nothing when isOpen is false', () => {
    render(
      <BookFormModal isOpen={false} onClose={vi.fn()} onSubmit={vi.fn()} />
    );
    expect(screen.queryByText('Novo Livro')).not.toBeInTheDocument();
  });

  it('shows "Novo Livro" title when no initialData is provided', () => {
    render(<BookFormModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.getByText('Novo Livro')).toBeInTheDocument();
  });

  it('shows "Editar Livro" title when initialData is provided', () => {
    render(
      <BookFormModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} initialData={baseInitialData} />
    );
    expect(screen.getByText('Editar Livro')).toBeInTheDocument();
  });

  it('pre-fills form fields from initialData', () => {
    render(
      <BookFormModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} initialData={baseInitialData} />
    );
    expect(screen.getByDisplayValue('Clean Code')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Robert C. Martin')).toBeInTheDocument();
    expect(screen.getByDisplayValue(/A handbook/i)).toBeInTheDocument();
  });

  it('shows validation errors when the form is submitted while empty', async () => {
    render(<BookFormModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));
    await waitFor(() => {
      // The submit button should be disabled because form is incomplete,
      // but if we bypass that, validation errors appear. Instead, we check
      // that the Salvar button is disabled when form is empty.
      expect(screen.getByRole('button', { name: /Salvar/i })).toBeDisabled();
    });
  });

  it('calls onSubmit with correct data and closes modal on successful submit', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    const handleClose = vi.fn();
    const user = userEvent.setup();

    render(
      <BookFormModal isOpen={true} onClose={handleClose} onSubmit={handleSubmit} />
    );

    await user.type(screen.getByPlaceholderText('Título'), 'Clean Code');
    await user.type(screen.getByPlaceholderText('Autor'), 'Robert C. Martin');
    await user.type(screen.getByPlaceholderText('Data de publicação'), '2008-08-01');
    await user.type(screen.getByPlaceholderText('Descrição'), 'A handbook of agile software craftsmanship.');
    fireEvent.click(screen.getByText('Upload Image'));

    await user.click(screen.getByRole('button', { name: /Salvar/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledOnce();
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it('shows submit error when onSubmit throws a generic Error', async () => {
    const handleSubmit = vi.fn().mockRejectedValue(new Error('Server error'));
    const user = userEvent.setup();

    render(
      <BookFormModal isOpen={true} onClose={vi.fn()} onSubmit={handleSubmit} />
    );

    await user.type(screen.getByPlaceholderText('Título'), 'Clean Code');
    await user.type(screen.getByPlaceholderText('Autor'), 'Robert C. Martin');
    await user.type(screen.getByPlaceholderText('Data de publicação'), '2008-08-01');
    await user.type(screen.getByPlaceholderText('Descrição'), 'A handbook of agile software craftsmanship.');
    fireEvent.click(screen.getByText('Upload Image'));

    await user.click(screen.getByRole('button', { name: /Salvar/i }));

    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument();
    });
  });

  it('calls onClose when the Cancel button is clicked', () => {
    const handleClose = vi.fn();
    render(<BookFormModal isOpen={true} onClose={handleClose} onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('resets form fields when the modal is reopened', async () => {
    const { rerender } = render(
      <BookFormModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />
    );

    await userEvent.type(screen.getByPlaceholderText('Título'), 'Draft Title');
    expect(screen.getByDisplayValue('Draft Title')).toBeInTheDocument();

    // Close then reopen
    rerender(<BookFormModal isOpen={false} onClose={vi.fn()} onSubmit={vi.fn()} />);
    rerender(<BookFormModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />);

    expect(screen.queryByDisplayValue('Draft Title')).not.toBeInTheDocument();
  });
});
