import { createElement } from 'react';
import type { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useBookList, useBook } from '../../hooks/useBooks';
import { api } from '../../api/api';

vi.mock('../../api/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockApi = api as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

const mockBook = {
  id: 1,
  title: 'Clean Code',
  author: 'Robert C. Martin',
  published_date: '2008-08-01',
  book_description: 'A handbook of agile software craftsmanship.',
  book_img: 'data:image/jpeg;base64,abc',
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useBookList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts in loading state and returns books after successful fetch', async () => {
    mockApi.get.mockResolvedValueOnce({ data: [mockBook] });
    const { result } = renderHook(() => useBookList(), { wrapper: createWrapper() });

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.books).toHaveLength(1);
    expect(result.current.books[0].title).toBe('Clean Code');
    expect(result.current.error).toBeNull();
  });

  it('returns error message when the API call fails', async () => {
    mockApi.get.mockRejectedValueOnce(new Error('Network failure'));
    const { result } = renderHook(() => useBookList(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Network failure');
    expect(result.current.books).toHaveLength(0);
  });

  it('returns an empty array by default before data loads', () => {
    mockApi.get.mockResolvedValueOnce({ data: [] });
    const { result } = renderHook(() => useBookList(), { wrapper: createWrapper() });
    expect(result.current.books).toEqual([]);
  });

  it('calls api.post and invalidates [books] query on createBook', async () => {
    mockApi.get.mockResolvedValue({ data: [] });
    mockApi.post.mockResolvedValueOnce({ data: mockBook });

    const { result } = renderHook(() => useBookList(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await result.current.createBook({
      title: 'Clean Code',
      author: 'Robert C. Martin',
      published_date: '2008-08-01',
      book_description: 'A handbook of agile software craftsmanship.',
      book_img: 'data:image/jpeg;base64,abc',
    });

    expect(mockApi.post).toHaveBeenCalledWith('/books', expect.objectContaining({ title: 'Clean Code' }));
    // After creation the query is invalidated, triggering a refetch
    expect(mockApi.get).toHaveBeenCalledTimes(2);
  });
});

describe('useBook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not fetch when id is undefined', () => {
    const { result } = renderHook(() => useBook(undefined), { wrapper: createWrapper() });
    expect(mockApi.get).not.toHaveBeenCalled();
    expect(result.current.book).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('fetches the book by id and returns it', async () => {
    mockApi.get.mockResolvedValueOnce({ data: mockBook });
    const { result } = renderHook(() => useBook('1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(mockApi.get).toHaveBeenCalledWith('/books/1');
    expect(result.current.book?.title).toBe('Clean Code');
    expect(result.current.error).toBeNull();
  });

  it('returns error message when fetching a book fails', async () => {
    mockApi.get.mockRejectedValueOnce(new Error('Not found'));
    const { result } = renderHook(() => useBook('99'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Not found');
    expect(result.current.book).toBeNull();
  });

  it('calls api.put and updates query cache on updateBook', async () => {
    mockApi.get.mockResolvedValueOnce({ data: mockBook });
    const updatedBook = { ...mockBook, title: 'Updated Title' };
    mockApi.put.mockResolvedValueOnce({ data: updatedBook });

    const { result } = renderHook(() => useBook('1'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await result.current.updateBook(1, { title: 'Updated Title' });

    expect(mockApi.put).toHaveBeenCalledWith('/books/1', expect.objectContaining({ title: 'Updated Title' }));
  });

  it('calls api.delete on deleteBook', async () => {
    mockApi.get.mockResolvedValueOnce({ data: mockBook });
    mockApi.delete.mockResolvedValueOnce({});
    // Need a second get for the invalidated [books] query
    mockApi.get.mockResolvedValue({ data: [] });

    const { result } = renderHook(() => useBook('1'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await result.current.deleteBook(1);

    expect(mockApi.delete).toHaveBeenCalledWith('/books/1');
  });

  it('exposes deleteError when the delete mutation fails', async () => {
    mockApi.get.mockResolvedValueOnce({ data: mockBook });
    mockApi.delete.mockRejectedValueOnce(new Error('Delete failed'));

    const { result } = renderHook(() => useBook('1'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await expect(result.current.deleteBook(1)).rejects.toThrow();

    await waitFor(() => expect(result.current.deleteError).toBe('Delete failed'));
  });
});
