import axios from 'axios';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/api';
import { bookSchema, bookResponseSchema, type Book, type BookInput } from '../schemas/book.schemas';

const getErrorMessage = (err: unknown, defaultMessage: string): string => {
  if (err instanceof z.ZodError) {
    return err.issues.map((issue) => issue.message).join(', ');
  }
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || err.message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return defaultMessage;
};

export function useBookList() {
  const queryClient = useQueryClient();

  const { data: books = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const response = await api.get<Book[]>('/books');
      return bookResponseSchema.array().parse(response.data);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (bookData: BookInput) => {
      const validatedData = bookSchema.parse(bookData);
      const response = await api.post<Book>('/books', validatedData);
      return bookResponseSchema.parse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  return {
    books,
    loading,
    error: queryError ? getErrorMessage(queryError, 'Error fetching books') : null,
    createBook: createMutation.mutateAsync,
  };
}

export function useBook(id: string | undefined) {
  const queryClient = useQueryClient();

  const { data: book, isLoading: loading, error: queryError } = useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      const response = await api.get<Book>(`/books/${id}`);
      return bookResponseSchema.parse(response.data);
    },
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ bookId, data }: { bookId: number; data: Partial<BookInput> }) => {
      const validatedData = bookSchema.partial().parse(data);
      const response = await api.put<Book>(`/books/${bookId}`, validatedData);
      return bookResponseSchema.parse(response.data);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['book', String(updated.id)], updated);
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (bookId: number) => {
      await api.delete(`/books/${bookId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  return {
    book: book ?? null,
    loading,
    error: queryError ? getErrorMessage(queryError, 'Error fetching book') : null,
    updateBook: (bookId: number, data: Partial<BookInput>) =>
      updateMutation.mutateAsync({ bookId, data }),
    deleteBook: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error
      ? getErrorMessage(deleteMutation.error, 'Error deleting book')
      : null,
  };
}
