import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidCourse } from './validation';

describe('validation', () => {
  describe('isValidEmail', () => {
    it('returns true for a valid email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('returns false for an invalid email', () => {
      expect(isValidEmail('not-an-email')).toBe(false);
    });
  });

  describe('isValidCourse', () => {
    it('returns true for a valid course', () => {
      const result = isValidCourse({
        title: 'Front End Developer',
        courseNumber: 'FE101',
        days: 5,
        price: 1000,
      });

      expect(result).toBe(true);
    });

    it('returns false when title is missing', () => {
      const result = isValidCourse({
        title: '',
        courseNumber: 'FE101',
        days: 5,
        price: 1000,
      });

      expect(result).toBe(false);
    });
  });
});