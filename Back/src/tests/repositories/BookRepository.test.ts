import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Build a chainable mock that mimics Knex's query builder ─────────────────
const CHAINABLE_METHODS = ['select', 'where', 'orderBy', 'first', 'insert', 'returning', 'update', 'delete'];

const mockBuilder: Record<string, any> = {};
for (const method of CHAINABLE_METHODS) {
  mockBuilder[method] = vi.fn().mockReturnValue(mockBuilder);
}

// Mock the DB connection module: connection('books') → returns our mock builder
vi.mock('../../database/connection', () => ({
  default: vi.fn(() => mockBuilder),
}));

import { BookRepository, type Book } from '../../repositories/BookRepository';

// ─── Test data ────────────────────────────────────────────────────────────────
const bookData: Book = {
  title: 'Clean Code',
  author: 'Robert C. Martin',
  published_date: '2008-08-01',
  book_description: 'A Handbook of Agile Software Craftsmanship',
};

const savedBook = {
  id: 'abc-123',
  ...bookData,
  created_at: new Date(),
  updated_at: new Date(),
};

// ─── Tests ────────────────────────────────────────────────────────────────────
describe('BookRepository', () => {
  let repository: BookRepository;

  beforeEach(() => {
    // Reset all chainable methods to return the builder (fresh state)
    for (const method of CHAINABLE_METHODS) {
      (mockBuilder[method] as ReturnType<typeof vi.fn>).mockReset().mockReturnValue(mockBuilder);
    }

    repository = new BookRepository();
  });

  // ═════════════════════════════════════════════════════════════════════════
  // listAll
  // ═════════════════════════════════════════════════════════════════════════
  describe('listAll', () => {
    it('should call select(*) and orderBy(created_at, desc)', async () => {
      mockBuilder.orderBy.mockResolvedValueOnce([savedBook]);

      const result = await repository.listAll();

      expect(mockBuilder.select).toHaveBeenCalledWith('*');
      expect(mockBuilder.orderBy).toHaveBeenCalledWith('created_at', 'desc');
      expect(result).toEqual([savedBook]);
    });

    it('should return an empty array when no books exist', async () => {
      mockBuilder.orderBy.mockResolvedValueOnce([]);

      const result = await repository.listAll();

      expect(result).toEqual([]);
    });
  });

  // ═════════════════════════════════════════════════════════════════════════
  // findById
  // ═════════════════════════════════════════════════════════════════════════
  describe('findById', () => {
    it('should query by id and return the book', async () => {
      mockBuilder.first.mockResolvedValueOnce(savedBook);

      const result = await repository.findById('abc-123');

      expect(mockBuilder.where).toHaveBeenCalledWith({ id: 'abc-123' });
      expect(mockBuilder.first).toHaveBeenCalled();
      expect(result).toEqual(savedBook);
    });

    it('should return undefined when the book is not found', async () => {
      mockBuilder.first.mockResolvedValueOnce(undefined);

      const result = await repository.findById('nonexistent');

      expect(result).toBeUndefined();
    });
  });

  // ═════════════════════════════════════════════════════════════════════════
  // create
  // ═════════════════════════════════════════════════════════════════════════
  describe('create', () => {
    it('should insert data and return the created book', async () => {
      mockBuilder.returning.mockResolvedValueOnce([savedBook]);

      const result = await repository.create(bookData);

      expect(mockBuilder.insert).toHaveBeenCalledWith(bookData);
      expect(mockBuilder.returning).toHaveBeenCalledWith('*');
      expect(result).toEqual(savedBook);
    });
  });

  // ═════════════════════════════════════════════════════════════════════════
  // update
  // ═════════════════════════════════════════════════════════════════════════
  describe('update', () => {
    it('should update the book by id and return the updated record', async () => {
      const updateData: Book = { id: 'abc-123', ...bookData };
      mockBuilder.update.mockResolvedValueOnce(1);
      mockBuilder.first.mockResolvedValueOnce(savedBook);

      const result = await repository.update(updateData);

      expect(mockBuilder.where).toHaveBeenCalledWith({ id: 'abc-123' });
      expect(mockBuilder.update).toHaveBeenCalledWith(bookData); // id is stripped
      expect(result).toEqual(savedBook);
    });

    it('should throw an error when id is not provided', async () => {
      await expect(repository.update(bookData)).rejects.toThrow('ID is required');
    });
  });

  // ═════════════════════════════════════════════════════════════════════════
  // delete
  // ═════════════════════════════════════════════════════════════════════════
  describe('delete', () => {
    it('should delete the book by id', async () => {
      mockBuilder.delete.mockResolvedValueOnce(1);

      const result = await repository.delete('abc-123');

      expect(mockBuilder.where).toHaveBeenCalledWith({ id: 'abc-123' });
      expect(mockBuilder.delete).toHaveBeenCalled();
      expect(result).toBe(1);
    });

    it('should return 0 when the book does not exist', async () => {
      mockBuilder.delete.mockResolvedValueOnce(0);

      const result = await repository.delete('nonexistent');

      expect(result).toBe(0);
    });
  });
});
