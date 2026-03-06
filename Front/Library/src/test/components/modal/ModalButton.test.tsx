import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ModalButton from '../../../components/modal/ModalButton';

describe('ModalButton', () => {
  it('renders children', () => {
    render(<ModalButton>Save</ModalButton>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('applies primary variant styles by default', () => {
    render(<ModalButton>OK</ModalButton>);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600');
  });

  it('applies secondary variant styles when variant="secondary"', () => {
    render(<ModalButton variant="secondary">Cancel</ModalButton>);
    expect(screen.getByRole('button')).toHaveClass('bg-gray-200');
    expect(screen.getByRole('button')).not.toHaveClass('bg-blue-600');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<ModalButton onClick={handleClick}>Click me</ModalButton>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled and cannot be clicked when disabled prop is set', () => {
    const handleClick = vi.fn();
    render(<ModalButton onClick={handleClick} disabled>Save</ModalButton>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('merges custom className without removing base classes', () => {
    render(<ModalButton className="extra-class">Save</ModalButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('extra-class');
    expect(button).toHaveClass('bg-blue-600');
  });
});
