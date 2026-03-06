import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FormField from '../../../components/ui/FormField';

describe('FormField', () => {
  it('renders the child element', () => {
    render(
      <FormField>
        <input type="text" placeholder="Title" />
      </FormField>
    );
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
  });

  it('injects a unique id onto the child element', () => {
    render(
      <FormField>
        <input type="text" placeholder="Title" />
      </FormField>
    );
    const input = screen.getByPlaceholderText('Title');
    expect(input).toHaveAttribute('id');
    expect(input.getAttribute('id')).not.toBe('');
  });

  it('renders the error message when the error prop is provided', () => {
    render(
      <FormField error="This field is required">
        <input type="text" placeholder="Title" />
      </FormField>
    );
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('does not render an error message when error prop is absent', () => {
    render(
      <FormField>
        <input type="text" placeholder="Title" />
      </FormField>
    );
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });
});
