import { describe, it, expect } from 'vitest';
import { toInputDate, formatDateBR } from '../../lib/dateUtils';

describe('toInputDate', () => {
  it('returns the same string when already in yyyy-MM-dd format', () => {
    expect(toInputDate('2023-01-15')).toBe('2023-01-15');
  });

  it('converts a UTC ISO-8601 string to yyyy-MM-dd', () => {
    expect(toInputDate('2023-01-15T00:00:00.000Z')).toBe('2023-01-15');
  });

  it('converts a noon UTC ISO string preserving the correct date', () => {
    expect(toInputDate('2023-06-20T12:00:00Z')).toBe('2023-06-20');
  });

  it('returns the original string when it cannot be parsed as a date', () => {
    expect(toInputDate('not-a-date')).toBe('not-a-date');
  });

  it('handles single-digit months and days with zero-padding', () => {
    expect(toInputDate('2023-04-05T00:00:00.000Z')).toBe('2023-04-05');
  });
});

describe('formatDateBR', () => {
  it('formats a yyyy-MM-dd string to dd/MM/yyyy', () => {
    expect(formatDateBR('2023-01-15')).toBe('15/01/2023');
  });

  it('formats a UTC ISO string to Brazilian dd/MM/yyyy', () => {
    expect(formatDateBR('2023-01-15T00:00:00.000Z')).toBe('15/01/2023');
  });

  it('formats a date with single-digit day and month correctly', () => {
    expect(formatDateBR('2023-04-05')).toBe('05/04/2023');
  });

  it('formats December 31 correctly', () => {
    expect(formatDateBR('1999-12-31')).toBe('31/12/1999');
  });
});
