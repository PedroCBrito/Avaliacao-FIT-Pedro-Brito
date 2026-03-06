import { describe, it, expect } from 'vitest';
import { bookSchema, bookResponseSchema } from '../../schemas/book.schemas';

const validInput = {
  title: 'Clean Code',
  author: 'Robert C. Martin',
  published_date: '2008-08-01',
  book_description: 'A handbook of agile software craftsmanship.',
  book_img: 'data:image/jpeg;base64,abc123',
};

describe('bookSchema', () => {
  it('accepts a fully valid book input', () => {
    expect(() => bookSchema.parse(validInput)).not.toThrow();
  });

  describe('title', () => {
    it('rejects a title shorter than 3 characters', () => {
      const result = bookSchema.safeParse({ ...validInput, title: 'AB' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('O título deve ter pelo menos 3 caracteres');
      }
    });

    it('rejects a title longer than 255 characters', () => {
      const result = bookSchema.safeParse({ ...validInput, title: 'A'.repeat(256) });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('O título deve ter no máximo 255 caracteres');
      }
    });

    it('accepts a title of exactly 3 characters', () => {
      expect(() => bookSchema.parse({ ...validInput, title: 'ABC' })).not.toThrow();
    });

    it('accepts a title of exactly 255 characters', () => {
      expect(() => bookSchema.parse({ ...validInput, title: 'A'.repeat(255) })).not.toThrow();
    });
  });

  describe('author', () => {
    it('rejects an author shorter than 3 characters', () => {
      const result = bookSchema.safeParse({ ...validInput, author: 'AB' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('O nome do autor é obrigatório');
      }
    });

    it('rejects an author longer than 255 characters', () => {
      const result = bookSchema.safeParse({ ...validInput, author: 'A'.repeat(256) });
      expect(result.success).toBe(false);
    });

    it('accepts an author of exactly 3 characters', () => {
      expect(() => bookSchema.parse({ ...validInput, author: 'ABC' })).not.toThrow();
    });
  });

  describe('published_date', () => {
    it('rejects an invalid date string', () => {
      const result = bookSchema.safeParse({ ...validInput, published_date: 'not-a-date' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid date format');
      }
    });

    it('accepts a valid ISO date string', () => {
      expect(() => bookSchema.parse({ ...validInput, published_date: '2023-01-15T00:00:00Z' })).not.toThrow();
    });
  });

  describe('book_description', () => {
    it('rejects a description shorter than 10 characters', () => {
      const result = bookSchema.safeParse({ ...validInput, book_description: 'Short' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('A descrição deve ter pelo menos 10 caracteres');
      }
    });

    it('rejects a description longer than 5000 characters', () => {
      const result = bookSchema.safeParse({ ...validInput, book_description: 'A'.repeat(5001) });
      expect(result.success).toBe(false);
    });

    it('accepts a description of exactly 10 characters', () => {
      expect(() => bookSchema.parse({ ...validInput, book_description: 'A'.repeat(10) })).not.toThrow();
    });
  });

  describe('book_img', () => {
    it('rejects an empty book_img', () => {
      const result = bookSchema.safeParse({ ...validInput, book_img: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('A imagem é obrigatória');
      }
    });

    it('accepts any non-empty string for book_img', () => {
      expect(() =>
        bookSchema.parse({ ...validInput, book_img: 'https://example.com/cover.jpg' })
      ).not.toThrow();
    });
  });
});

describe('bookResponseSchema', () => {
  const validResponse = { ...validInput, id: 1 };

  it('accepts a valid book response with id', () => {
    expect(() => bookResponseSchema.parse(validResponse)).not.toThrow();
  });

  it('accepts optional created_at and updated_at fields', () => {
    expect(() =>
      bookResponseSchema.parse({
        ...validResponse,
        created_at: '2023-01-01',
        updated_at: '2023-06-01',
      })
    ).not.toThrow();
  });

  it('rejects a response missing the id field', () => {
    const result = bookResponseSchema.safeParse(validInput);
    expect(result.success).toBe(false);
  });

  it('rejects a non-numeric id', () => {
    const result = bookResponseSchema.safeParse({ ...validResponse, id: 'abc' });
    expect(result.success).toBe(false);
  });
});
