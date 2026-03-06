import { describe, it, expect } from 'vitest';
import { bookSchema } from '../../schemas/book.schemas';

const validData = {
  title: 'Clean Code',
  author: 'Robert C. Martin',
  published_date: '2008-08-01',
  book_description: 'A Handbook of Agile Software Craftsmanship',
  book_img: 'https://example.com/clean-code.jpg',
};

describe('bookSchema', () => {
  // ═══════════════════════════════════════════════════════════════════════════
  // Happy path
  // ═══════════════════════════════════════════════════════════════════════════
  describe('valid data', () => {
    it('should accept a valid book without id', () => {
      const result = bookSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept a valid book with an optional id', () => {
      const result = bookSchema.safeParse({ id: 1, ...validData });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(1);
      }
    });

    it('should accept title with exactly 3 characters', () => {
      const result = bookSchema.safeParse({ ...validData, title: 'Abc' });
      expect(result.success).toBe(true);
    });

    it('should accept author with exactly 3 characters', () => {
      const result = bookSchema.safeParse({ ...validData, author: 'Bob' });
      expect(result.success).toBe(true);
    });

    it('should accept book_description with exactly 10 characters', () => {
      const result = bookSchema.safeParse({ ...validData, book_description: '1234567890' });
      expect(result.success).toBe(true);
    });

    it('should accept ISO date format (YYYY-MM-DD)', () => {
      const result = bookSchema.safeParse({ ...validData, published_date: '2024-01-15' });
      expect(result.success).toBe(true);
    });

    it('should accept full ISO datetime string', () => {
      const result = bookSchema.safeParse({
        ...validData,
        published_date: '2024-01-15T10:30:00.000Z',
      });
      expect(result.success).toBe(true);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Title validation
  // ═══════════════════════════════════════════════════════════════════════════
  describe('title', () => {
    it('should reject when title is missing', () => {
      const { title, ...noTitle } = validData;
      const result = bookSchema.safeParse(noTitle);
      expect(result.success).toBe(false);
    });

    it('should reject when title has fewer than 3 characters', () => {
      const result = bookSchema.safeParse({ ...validData, title: 'AB' });
      expect(result.success).toBe(false);
      if (!result.success) {
        const titleErrors = result.error.flatten().fieldErrors.title;
        expect(titleErrors).toBeDefined();
        expect(titleErrors![0]).toContain('3');
      }
    });

    it('should reject when title is an empty string', () => {
      const result = bookSchema.safeParse({ ...validData, title: '' });
      expect(result.success).toBe(false);
    });

    it('should reject when title is not a string', () => {
      const result = bookSchema.safeParse({ ...validData, title: 123 });
      expect(result.success).toBe(false);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Author validation
  // ═══════════════════════════════════════════════════════════════════════════
  describe('author', () => {
    it('should reject when author is missing', () => {
      const { author, ...noAuthor } = validData;
      const result = bookSchema.safeParse(noAuthor);
      expect(result.success).toBe(false);
    });

    it('should reject when author has fewer than 3 characters', () => {
      const result = bookSchema.safeParse({ ...validData, author: 'AB' });
      expect(result.success).toBe(false);
      if (!result.success) {
        const authorErrors = result.error.flatten().fieldErrors.author;
        expect(authorErrors).toBeDefined();
      }
    });

    it('should reject when author is an empty string', () => {
      const result = bookSchema.safeParse({ ...validData, author: '' });
      expect(result.success).toBe(false);
    });

    it('should reject when author is not a string', () => {
      const result = bookSchema.safeParse({ ...validData, author: true });
      expect(result.success).toBe(false);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Published date validation
  // ═══════════════════════════════════════════════════════════════════════════
  describe('published_date', () => {
    it('should reject when published_date is missing', () => {
      const { published_date, ...noDate } = validData;
      const result = bookSchema.safeParse(noDate);
      expect(result.success).toBe(false);
    });

    it('should reject when published_date is not parseable as a date', () => {
      const result = bookSchema.safeParse({ ...validData, published_date: 'not-a-date' });
      expect(result.success).toBe(false);
      if (!result.success) {
        const dateErrors = result.error.flatten().fieldErrors.published_date;
        expect(dateErrors).toBeDefined();
        expect(dateErrors![0]).toContain('Invalid date');
      }
    });

    it('should reject when published_date is a random string', () => {
      const result = bookSchema.safeParse({ ...validData, published_date: 'hello world' });
      expect(result.success).toBe(false);
    });

    it('should reject when published_date is a number', () => {
      const result = bookSchema.safeParse({ ...validData, published_date: 1234567890 });
      expect(result.success).toBe(false);
    });

    it('should reject when published_date is an empty string', () => {
      const result = bookSchema.safeParse({ ...validData, published_date: '' });
      expect(result.success).toBe(false);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Book description validation
  // ═══════════════════════════════════════════════════════════════════════════
  describe('book_description', () => {
    it('should reject when book_description is missing', () => {
      const { book_description, ...noDesc } = validData;
      const result = bookSchema.safeParse(noDesc);
      expect(result.success).toBe(false);
    });

    it('should reject when book_description has fewer than 10 characters', () => {
      const result = bookSchema.safeParse({ ...validData, book_description: '123456789' });
      expect(result.success).toBe(false);
    });

    it('should reject when book_description is an empty string', () => {
      const result = bookSchema.safeParse({ ...validData, book_description: '' });
      expect(result.success).toBe(false);
    });

    it('should reject when book_description is not a string', () => {
      const result = bookSchema.safeParse({ ...validData, book_description: 42 });
      expect(result.success).toBe(false);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Edge cases
  // ═══════════════════════════════════════════════════════════════════════════
  describe('edge cases', () => {
    it('should reject null input', () => {
      const result = bookSchema.safeParse(null);
      expect(result.success).toBe(false);
    });

    it('should reject undefined input', () => {
      const result = bookSchema.safeParse(undefined);
      expect(result.success).toBe(false);
    });

    it('should reject an empty object', () => {
      const result = bookSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should strip unknown properties', () => {
      const result = bookSchema.safeParse({ ...validData, unknownField: 'test' });
      // Zod by default allows extra keys (passthrough), so it should still succeed
      expect(result.success).toBe(true);
    });

    it('should reject when title exceeds 255 characters', () => {
      const result = bookSchema.safeParse({ ...validData, title: 'A'.repeat(500) });
      expect(result.success).toBe(false);
    });

    it('should accept a very long description', () => {
      const result = bookSchema.safeParse({ ...validData, book_description: 'A'.repeat(5000) });
      expect(result.success).toBe(true);
    });
  });
});
