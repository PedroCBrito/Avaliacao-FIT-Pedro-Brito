import { describe, it, expect, vi, beforeAll, beforeEach, afterAll } from 'vitest';
import type { FastifyInstance } from 'fastify';

// ─── Mock the service before any app import ───────────────────────────────────
const { mockService } = vi.hoisted(() => {
  return {
    mockService: {
      listAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };
});

vi.mock('../../services/BookService', () => {
  return {
    BookService: function () {
      return mockService;
    },
  };
});

// Mock repository and DB so no real DB connection is attempted
vi.mock('../../repositories/BookRepository', () => ({ BookRepository: function () { return {}; } }));
vi.mock('../../database/connection', () => ({ default: vi.fn() }));

import { buildApp } from '../helpers/buildApp';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const validBook = {
  title: 'Clean Code',
  author: 'Robert C. Martin',
  published_date: '2008-08-01',
  book_description: 'A Handbook of Agile Software Craftsmanship',
  book_img: 'https://example.com/clean-code.jpg',
};

const savedBook = {
  id: 1,
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
      mockService.listAll.mockResolvedValueOnce([]);

      const response = await app.inject({ method: 'GET', url: '/books' });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual([]);
      expect(mockService.listAll).toHaveBeenCalledOnce();
    });

    it('should return a list of books', async () => {
      const books = [savedBook, { ...savedBook, id: 2, title: 'The Pragmatic Programmer' }];
      mockService.listAll.mockResolvedValueOnce(books);

      const response = await app.inject({ method: 'GET', url: '/books' });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.json()).toEqual(books);
      expect(response.json()).toHaveLength(2);
    });

    it('should return 500 when the service throws an error', async () => {
      mockService.listAll.mockRejectedValueOnce(new Error('DB connection failed'));

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
      mockService.findById.mockResolvedValueOnce(savedBook);

      const response = await app.inject({
        method: 'GET',
        url: '/books/1',
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.json()).toEqual(savedBook);
      expect(mockService.findById).toHaveBeenCalledWith(1);
    });

    it('should return 404 when the book is not found', async () => {
      mockService.findById.mockResolvedValueOnce(null);

      const response = await app.inject({
        method: 'GET',
        url: '/books/999',
      });

      expect(response.statusCode).toBe(404);
      expect(response.json()).toEqual({ message: 'Book not found' });
    });

    it('should return 500 when the service throws an error', async () => {
      mockService.findById.mockRejectedValueOnce(new Error('DB error'));

      const response = await app.inject({
        method: 'GET',
        url: '/books/1',
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
      mockService.create.mockResolvedValueOnce(savedBook);

      const response = await app.inject({
        method: 'POST',
        url: '/books',
        payload: validBook,
      });

      expect(response.statusCode).toBe(201);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.json()).toEqual(savedBook);
      expect(response.json()).toHaveProperty('id');
      expect(mockService.create).toHaveBeenCalledWith(validBook);
    });

    it('should accept an optional id field', async () => {
      const bookWithId = { id: 1, ...validBook };
      mockService.create.mockResolvedValueOnce(savedBook);

      const response = await app.inject({
        method: 'POST',
        url: '/books',
        payload: bookWithId,
      });

      expect(response.statusCode).toBe(201);
      expect(mockService.create).toHaveBeenCalledWith(bookWithId);
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

    it('should return 500 when service.create throws', async () => {
      mockService.create.mockRejectedValueOnce(new Error('Insert failed'));

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
      mockService.update.mockResolvedValueOnce(updatedBook);

      const response = await app.inject({
        method: 'PUT',
        url: '/books/1',
        payload: { id: 1, ...validBook, title: 'Clean Code 2nd Ed' },
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.json()).toEqual(updatedBook);
      expect(mockService.update).toHaveBeenCalledWith(1, { id: 1, ...validBook, title: 'Clean Code 2nd Ed' });
    });

    it('should return 404 when the book to update does not exist', async () => {
      mockService.update.mockResolvedValueOnce(undefined);

      const response = await app.inject({
        method: 'PUT',
        url: '/books/1',
        payload: { ...validBook },
      });

      expect(response.statusCode).toBe(404);
      expect(response.json()).toEqual({ message: 'Book not found' });
    });

    it('should return 400 when body is empty', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: '/books/1',
      });

      expect(response.statusCode).toBe(400);
      expect(response.json().message).toBe('Validation Error');
    });

    it('should return 500 when service.update throws', async () => {
      mockService.update.mockRejectedValueOnce(new Error('Update failed'));

      const response = await app.inject({
        method: 'PUT',
        url: '/books/1',
        payload: { ...validBook },
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
      mockService.delete.mockResolvedValueOnce(1);

      const response = await app.inject({
        method: 'DELETE',
        url: '/books/1',
      });

      expect(response.statusCode).toBe(204);
      expect(mockService.delete).toHaveBeenCalledWith(1);
      expect(response.body).toBe('');
    });

    it('should return 204 even when book does not exist (no rows deleted)', async () => {
      mockService.delete.mockResolvedValueOnce(0);

      const response = await app.inject({
        method: 'DELETE',
        url: '/books/1',
      });

      // Current implementation always returns 204 regardless of rows affected
      expect(response.statusCode).toBe(204);
    });

    it('should return 500 when service.delete throws', async () => {
      mockService.delete.mockRejectedValueOnce(new Error('Delete failed'));

      const response = await app.inject({
        method: 'DELETE',
        url: '/books/1',
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toEqual({ message: 'Server Error' });
    });

  });
});
