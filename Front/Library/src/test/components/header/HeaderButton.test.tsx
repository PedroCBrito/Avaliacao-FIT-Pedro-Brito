import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import HeaderButton from '../../../components/header/HeaderButton';

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe('HeaderButton', () => {
  it('renders as a <button> when onClick is provided', () => {
    renderWithRouter(<HeaderButton onClick={vi.fn()}>Click me</HeaderButton>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('renders as a <Link> when to prop is provided', () => {
    renderWithRouter(<HeaderButton to="/books">Go to Books</HeaderButton>);
    expect(screen.getByRole('link', { name: 'Go to Books' })).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/books');
  });

  it('calls onClick when the button is clicked', () => {
    const handleClick = vi.fn();
    renderWithRouter(<HeaderButton onClick={handleClick}>Action</HeaderButton>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies delete variant text styles when variant="delete"', () => {
    renderWithRouter(<HeaderButton onClick={vi.fn()} variant="delete">Delete</HeaderButton>);
    expect(screen.getByRole('button')).toHaveClass('text-red-800');
  });

  it('applies primary variant styles by default', () => {
    renderWithRouter(<HeaderButton onClick={vi.fn()}>Edit</HeaderButton>);
    expect(screen.getByRole('button')).not.toHaveClass('text-red-800');
  });

  it('renders children content correctly', () => {
    renderWithRouter(<HeaderButton onClick={vi.fn()}>My Label</HeaderButton>);
    expect(screen.getByText('My Label')).toBeInTheDocument();
  });
});
