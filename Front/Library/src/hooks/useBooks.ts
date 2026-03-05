import { useState, useCallback } from 'react';
import axios from 'axios';
import { z } from 'zod';
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

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Book[]>('/books');
      const parsed = bookResponseSchema.array().parse(response.data);
      setBooks(parsed);
      return parsed;
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'Error fetching books');
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBookById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Book>(`/books/${id}`);
      return bookResponseSchema.parse(response.data);
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'Error fetching book');
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createBook = useCallback(async (bookData: BookInput) => {
    setLoading(true);
    setError(null);
    try {
      const validatedData = bookSchema.parse(bookData);
      const response = await api.post<Book>('/books', validatedData);
      const created = bookResponseSchema.parse(response.data);
      setBooks((prev) => [...prev, created]);
      return created;
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'Error creating book');
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBook = useCallback(async (id: number, bookData: Partial<BookInput>) => {
    setLoading(true);
    setError(null);
    try {
      const validatedData = bookSchema.partial().parse(bookData);
      const response = await api.put<Book>(`/books/${id}`, validatedData);
      const updated = bookResponseSchema.parse(response.data);
      setBooks((prev) => prev.map((book) => (book.id === id ? updated : book)));
      return updated;
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'Error updating book');
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBook = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/books/${id}`);
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'Error deleting book');
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    books,
    loading,
    error,
    fetchBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
  };
};
