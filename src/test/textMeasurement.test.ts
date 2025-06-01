import { describe, it, expect, beforeEach } from 'vitest';
import { measureTextWidth, truncateText } from '../utils/textMeasurement';

describe('Text Measurement Utils', () => {
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    canvas = document.createElement('canvas');
  });

  describe('measureTextWidth', () => {
    it('should return a positive width for non-empty text', () => {
      const width = measureTextWidth('Hello World', '16px Arial', canvas);
      expect(width).toBeGreaterThan(0);
    });

    it('should return 0 for empty text', () => {
      const width = measureTextWidth('', '16px Arial', canvas);
      expect(width).toBe(0);
    });

    it('should handle different font sizes', () => {
      const smallWidth = measureTextWidth('Test', '12px Arial', canvas);
      const largeWidth = measureTextWidth('Test', '24px Arial', canvas);
      
      expect(largeWidth).toBeGreaterThan(smallWidth);
    });
  });

  describe('truncateText', () => {
    it('should truncate text that exceeds pixel limit', () => {
      const longText = 'This is a very long text that should be truncated';
      const result = truncateText(longText, 100, '16px Arial', canvas);
      
      expect(result.truncated).toBe(true);
      expect(result.text.length).toBeLessThan(longText.length);
      expect(result.text).toMatch(/\.\.\.$/);
    });

    it('should not truncate text within pixel limit', () => {
      const shortText = 'Short';
      const result = truncateText(shortText, 1000, '16px Arial', canvas);
      
      expect(result.truncated).toBe(false);
      expect(result.text).toBe(shortText);
    });

    it('should handle empty text', () => {
      const result = truncateText('', 100, '16px Arial', canvas);
      
      expect(result.truncated).toBe(false);
      expect(result.text).toBe('');
    });
  });
});
