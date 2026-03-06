import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ImageUpload from '../../../components/ui/ImageUpload';

// Mock FileReader so readAsDataURL triggers onload synchronously in tests
class MockFileReader {
  onload: ((e: ProgressEvent<FileReader>) => void) | null = null;
  result: string | null = null;

  readAsDataURL() {
    this.result = 'data:image/jpeg;base64,mockedbase64';
    if (this.onload) {
      this.onload({ target: this } as unknown as ProgressEvent<FileReader>);
    }
  }
}

const OriginalFileReader = globalThis.FileReader;

beforeEach(() => {
  Object.defineProperty(globalThis, 'FileReader', {
    writable: true,
    value: MockFileReader,
  });
});

afterEach(() => {
  Object.defineProperty(globalThis, 'FileReader', {
    writable: true,
    value: OriginalFileReader,
  });
});

describe('ImageUpload', () => {
  it('renders the placeholder text when no preview is provided', () => {
    render(<ImageUpload preview={null} onChange={vi.fn()} />);
    expect(screen.getByText('Escolher Imagem')).toBeInTheDocument();
  });

  it('renders the preview image when a preview URL is provided', () => {
    render(<ImageUpload preview="data:image/jpeg;base64,test" onChange={vi.fn()} />);
    expect(screen.getByAltText('Preview da capa')).toBeInTheDocument();
  });

  it('renders the error message when error prop is provided', () => {
    render(<ImageUpload preview={null} onChange={vi.fn()} error="A imagem é obrigatória" />);
    expect(screen.getByText('A imagem é obrigatória')).toBeInTheDocument();
  });

  it('shows size error and does not call onChange when file exceeds 5MB', () => {
    const handleChange = vi.fn();
    render(<ImageUpload preview={null} onChange={handleChange} />);

    const oversizedFile = new File(['x'.repeat(6 * 1024 * 1024)], 'big.jpg', { type: 'image/jpeg' });
    Object.defineProperty(oversizedFile, 'size', { value: 6 * 1024 * 1024 });

    const input = screen.getByLabelText('Upload de imagem da capa');
    fireEvent.change(input, { target: { files: [oversizedFile] } });

    expect(screen.getByText(/máximo 5MB/i)).toBeInTheDocument();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('calls onChange with base64 string when a valid file is selected', () => {
    const handleChange = vi.fn();
    render(<ImageUpload preview={null} onChange={handleChange} />);

    const file = new File(['img'], 'cover.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText('Upload de imagem da capa');
    fireEvent.change(input, { target: { files: [file] } });

    expect(handleChange).toHaveBeenCalledWith('data:image/jpeg;base64,mockedbase64');
  });

  it('clicking the upload area triggers the hidden file input', () => {
    render(<ImageUpload preview={null} onChange={vi.fn()} />);
    const uploadArea = screen.getByRole('button');
    const input = screen.getByLabelText('Upload de imagem da capa') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, 'click');
    fireEvent.click(uploadArea);
    expect(clickSpy).toHaveBeenCalled();
  });
});
