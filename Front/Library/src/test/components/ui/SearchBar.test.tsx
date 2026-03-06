import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SearchBar from '../../../components/ui/SearchBar';

describe('SearchBar', () => {
  it('renders an input with the default "Buscar" placeholder', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText('Buscar')).toBeInTheDocument();
  });

  it('renders an input with a custom placeholder', () => {
    render(<SearchBar placeholder="Search books..." />);
    expect(screen.getByPlaceholderText('Search books...')).toBeInTheDocument();
  });

  it('calls onChange when the user types in the input', async () => {
    const handleChange = vi.fn();
    render(<SearchBar onChange={handleChange} />);
    await userEvent.type(screen.getByPlaceholderText('Buscar'), 'react');
    expect(handleChange).toHaveBeenCalled();
  });

  it('applies additional className to the wrapper', () => {
    const { container } = render(<SearchBar className="w-full" />);
    expect(container.firstChild).toHaveClass('w-full');
  });

  it('forwards extra input props (e.g. value, readOnly)', () => {
    render(<SearchBar value="hello" readOnly onChange={vi.fn()} />);
    expect(screen.getByDisplayValue('hello')).toBeInTheDocument();
  });
});
