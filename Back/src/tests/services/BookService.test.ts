import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Mock the BookRepository before any imports ───────────────────────────────
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

vi.mock('../../repositories/BookRepository', () => ({
  BookRepository: function () {
    return mockRepository;
  },
}));

vi.mock('../../database/connection', () => ({ default: vi.fn() }));

import { BookService } from '../../services/BookService';
import { BookRepository } from '../../repositories/BookRepository';

// ─── Test data ─────────────────────────────────────────────────────────────────
const bookInput = {
  title: 'Clean Code',
  author: 'Robert C. Martin',
  published_date: '2008-08-01',
  book_description: 'A Handbook of Agile Software Craftsmanship',
  book_img: 'https://example.com/clean-code.jpg',
};

const savedBook = {
  id: 1,
  ...bookInput,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// ─── Tests ─────────────────────────────────────────────────────────────────────
describe('BookService', () => {
  let service: BookService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new BookService(new BookRepository());
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // listAll
  // ═══════════════════════════════════════════════════════════════════════════
  describe('listAll', () => {
    it('should return all books from the repository', async () => {
      mockRepository.listAll.mockResolvedValueOnce([savedBook]);

      const result = await service.listAll();

      expect(mockRepository.listAll).toHaveBeenCalledOnce();
      expect(result).toEqual([savedBook]);
    });

    it('should return an empty array when no books exist', async () => {
      mockRepository.listAll.mockResolvedValueOnce([]);

      const result = await service.listAll();

      expect(result).toEqual([]);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // findById
  // ═══════════════════════════════════════════════════════════════════════════
  describe('findById', () => {
    it('should return a book when found', async () => {
      mockRepository.findById.mockResolvedValueOnce(savedBook);

      const result = await service.findById(1);

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(savedBook);
    });

    it('should return undefined when the book is not found', async () => {
      mockRepository.findById.mockResolvedValueOnce(undefined);

      const result = await service.findById(999);

      expect(result).toBeUndefined();
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // create
  // ═══════════════════════════════════════════════════════════════════════════
  describe('create', () => {
    it('should create and return a new book', async () => {
      mockRepository.create.mockResolvedValueOnce(savedBook);

      const result = await service.create(bookInput);

      expect(mockRepository.create).toHaveBeenCalledWith(bookInput);
      expect(result).toEqual(savedBook);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // update
  // ═══════════════════════════════════════════════════════════════════════════
  describe('update', () => {
    it('should forward id + data to repository.update and return the updated book', async () => {
      const updatedBook = { ...savedBook, title: 'Clean Code 2nd Ed' };
      mockRepository.update.mockResolvedValueOnce(updatedBook);

      const result = await service.update(1, { ...bookInput, title: 'Clean Code 2nd Ed' });

      expect(mockRepository.update).toHaveBeenCalledWith({
        ...bookInput,
        id: 1,
        title: 'Clean Code 2nd Ed',
      });
      expect(result).toEqual(updatedBook);
    });

    it('should return undefined when the book is not found', async () => {
      mockRepository.update.mockResolvedValueOnce(undefined);

      const result = await service.update(999, bookInput);

      expect(result).toBeUndefined();
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // delete
  // ═══════════════════════════════════════════════════════════════════════════
  describe('delete', () => {
    it('should call repository.delete with the given id', async () => {
      mockRepository.delete.mockResolvedValueOnce(1);

      await service.delete(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should return 0 when no book was deleted', async () => {
      mockRepository.delete.mockResolvedValueOnce(0);

      const result = await service.delete(999);

      expect(result).toBe(0);
    });
  });
});
