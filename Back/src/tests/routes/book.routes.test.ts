import { describe, it, expect, vi, beforeAll, beforeEach, afterAll } from 'vitest';
import type { FastifyInstance } from 'fastify';

// ─── Mock the repository before any app import ───────────────────────────────
const { mockRepository } = vi.hoisted(() => {
  return {
    mockRepository: {
      listAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };
});

vi.mock('../../repositories/BookRepository', () => {
  return {
    BookRepository: function () {
      return mockRepository;
    },
  };
});

// Also mock the DB connection so it never touches a real database
vi.mock('../../database/connection', () => ({ default: vi.fn() }));

import { buildApp } from '../helpers/buildApp';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const validBook = {
  title: 'Clean Code',
  author: 'Robert C. Martin',
  published_date: '2008-08-01',
  book_description: 'A Handbook of Agile Software Craftsmanship',
};

const savedBook = {
  id: 'abc-123',
  ...validBook,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// ─── Test Suite ───────────────────────────────────────────────────────────────
describe('Book Routes', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // GET /books
  // ═══════════════════════════════════════════════════════════════════════════
  describe('GET /books', () => {
    it('should return an empty array when there are no books', async () => {
      mockRepository.listAll.mockResolvedValueOnce([]);

      const response = await app.inject({ method: 'GET', url: '/books' });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual([]);
      expect(mockRepository.listAll).toHaveBeenCalledOnce();
    });

    it('should return a list of books', async () => {
      const books = [savedBook, { ...savedBook, id: 'def-456', title: 'The Pragmatic Programmer' }];
      mockRepository.listAll.mockResolvedValueOnce(books);

      const response = await app.inject({ method: 'GET', url: '/books' });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.json()).toEqual(books);
      expect(response.json()).toHaveLength(2);
    });

    it('should return 500 when the repository throws an error', async () => {
      mockRepository.listAll.mockRejectedValueOnce(new Error('DB connection failed'));

      const response = await app.inject({ method: 'GET', url: '/books' });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toEqual({ message: 'Server Error' });
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // GET /books/:id
  // ═══════════════════════════════════════════════════════════════════════════
  describe('GET /books/:id', () => {
    it('should return a book when found', async () => {
      mockRepository.findById.mockResolvedValueOnce(savedBook);

      const response = await app.inject({
        method: 'GET',
        url: '/books/abc-123',
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.json()).toEqual(savedBook);
      expect(mockRepository.findById).toHaveBeenCalledWith('abc-123');
    });

    it('should return 404 when the book is not found', async () => {
      mockRepository.findById.mockResolvedValueOnce(null);

      const response = await app.inject({
        method: 'GET',
        url: '/books/nonexistent',
      });

      expect(response.statusCode).toBe(404);
      expect(response.json()).toEqual({ message: 'Book not found' });
    });

    it('should return 500 when the repository throws an error', async () => {
      mockRepository.findById.mockRejectedValueOnce(new Error('DB error'));

      const response = await app.inject({
        method: 'GET',
        url: '/books/abc-123',
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toEqual({ message: 'Server Error' });
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // POST /books
  // ═══════════════════════════════════════════════════════════════════════════
  describe('POST /books', () => {
    it('should create a book with valid data and return 201', async () => {
      mockRepository.create.mockResolvedValueOnce(savedBook);

      const response = await app.inject({
        method: 'POST',
        url: '/books',
        payload: validBook,
      });

      expect(response.statusCode).toBe(201);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.json()).toEqual(savedBook);
      expect(response.json()).toHaveProperty('id');
      expect(mockRepository.create).toHaveBeenCalledWith(validBook);
    });

    it('should accept an optional id field', async () => {
      const bookWithId = { id: 'custom-id', ...validBook };
      mockRepository.create.mockResolvedValueOnce({ ...savedBook, id: 'custom-id' });

      const response = await app.inject({
        method: 'POST',
        url: '/books',
        payload: bookWithId,
      });

      expect(response.statusCode).toBe(201);
      expect(mockRepository.create).toHaveBeenCalledWith(bookWithId);
    });

    it('should return 400 when body is empty', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/books',
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toHaveProperty('message', 'Validation Error');
    });

    it('should return 400 when multiple fields are invalid', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/books',
        payload: {
          title: 'AB',
          author: 'X',
          published_date: 'invalid',
          book_description: 'short',
        },
      });

      expect(response.statusCode).toBe(400);
      const body = response.json();
      expect(body.message).toBe('Validation Error');
      // All four invalid fields must appear in the errors map
      expect(body.errors).toHaveProperty('title');
      expect(body.errors).toHaveProperty('author');
      expect(body.errors).toHaveProperty('published_date');
      expect(body.errors).toHaveProperty('book_description');
    });

    it('should return 500 when repository.create throws', async () => {
      mockRepository.create.mockRejectedValueOnce(new Error('Insert failed'));

      const response = await app.inject({
        method: 'POST',
        url: '/books',
        payload: validBook,
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toEqual({ message: 'Server Error' });
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // PUT /books/:id
  // ═══════════════════════════════════════════════════════════════════════════
  describe('PUT /books/:id', () => {
    it('should update a book with valid data', async () => {
      const updatedBook = { ...savedBook, title: 'Clean Code 2nd Ed' };
      mockRepository.update.mockResolvedValueOnce(updatedBook);

      const response = await app.inject({
        method: 'PUT',
        url: '/books/abc-123',
        payload: { id: 'abc-123', ...validBook, title: 'Clean Code 2nd Ed' },
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.json()).toEqual(updatedBook);
      expect(mockRepository.update).toHaveBeenCalledWith({ ...validBook, id: 'abc-123', title: 'Clean Code 2nd Ed' });
    });

    it('should return 404 when the book to update does not exist', async () => {
      mockRepository.update.mockResolvedValueOnce(undefined);

      const response = await app.inject({
        method: 'PUT',
        url: '/books/abc-123',
        payload: { id: 'nonexistent-id', ...validBook },
      });

      expect(response.statusCode).toBe(404);
      expect(response.json()).toEqual({ message: 'Book not found' });
    });

    it('should return 400 when body is empty', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: '/books/abc-123',
      });

      expect(response.statusCode).toBe(400);
      expect(response.json().message).toBe('Validation Error');
    });

    it('should return 500 when repository.update throws', async () => {
      mockRepository.update.mockRejectedValueOnce(new Error('Update failed'));

      const response = await app.inject({
        method: 'PUT',
        url: '/books/abc-123',
        payload: { id: 'abc-123', ...validBook },
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toEqual({ message: 'Server Error' });
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // DELETE /books/:id
  // ═══════════════════════════════════════════════════════════════════════════
  describe('DELETE /books/:id', () => {
    it('should delete a book and return 204', async () => {
      mockRepository.delete.mockResolvedValueOnce(1);

      const response = await app.inject({
        method: 'DELETE',
        url: '/books/abc-123',
      });

      expect(response.statusCode).toBe(204);
      expect(mockRepository.delete).toHaveBeenCalledWith('abc-123');
      expect(response.body).toBe('');
    });

    it('should return 204 even when book does not exist (no rows deleted)', async () => {
      mockRepository.delete.mockResolvedValueOnce(0);

      const response = await app.inject({
        method: 'DELETE',
        url: '/books/abc-123',
      });

      // Current implementation always returns 204 regardless of rows affected
      expect(response.statusCode).toBe(204);
    });

    it('should return 500 when repository.delete throws', async () => {
      mockRepository.delete.mockRejectedValueOnce(new Error('Delete failed'));

      const response = await app.inject({
        method: 'DELETE',
        url: '/books/abc-123',
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toEqual({ message: 'Server Error' });
    });

  });
});
