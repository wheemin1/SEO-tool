import { describe, it, expect } from 'vitest';
import { 
  analyzeSEO, 
  calculateReadabilityScore, 
  calculateKeywordDensity 
} from '../utils/seoAnalysis';

describe('SEO Analysis Utils', () => {
  describe('analyzeSEO', () => {
    it('should return high score for optimized content', () => {
      const result = analyzeSEO(
        'Best SEO Tools 2024 - Complete Guide',
        'Discover the best SEO tools for 2024. Our comprehensive guide covers keyword research, analytics, and optimization tools to boost your rankings.',
        'https://example.com/seo-tools-guide',
        ['SEO tools', 'keyword research', 'optimization']
      );

      expect(result.score).toBeGreaterThan(70);
      expect(result.issues).toHaveLength(0);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    it('should identify issues with too long title', () => {
      const result = analyzeSEO(
        'This is an extremely long title that definitely exceeds the recommended character limit for SEO',
        'Good description',
        'https://example.com',
        ['keyword']
      );

      expect(result.score).toBeLessThan(80);
      expect(result.issues.some(issue => issue.field === 'title')).toBe(true);
    });

    it('should identify missing keywords in content', () => {
      const result = analyzeSEO(
        'Generic Title',
        'Generic description without target keywords',
        'https://example.com',
        ['missing keyword', 'not found']
      );

      expect(result.score).toBeLessThan(60);
      expect(result.issues.length).toBeGreaterThan(0);
    });
  });

  describe('calculateReadabilityScore', () => {
    it('should return high score for simple text', () => {
      const text = 'This is a simple sentence. It is easy to read.';
      const score = calculateReadabilityScore(text);
      
      expect(score).toBeGreaterThan(70);
    });

    it('should return lower score for complex text', () => {
      const text = 'The implementation of sophisticated algorithmic methodologies necessitates comprehensive analytical frameworks.';
      const score = calculateReadabilityScore(text);
      
      expect(score).toBeLessThan(50);
    });
  });

  describe('calculateKeywordDensity', () => {
    it('should calculate keyword density correctly', () => {
      const text = 'SEO is important for SEO optimization. SEO helps websites rank better.';
      const density = calculateKeywordDensity(text, 'SEO');
      
      expect(density).toBeCloseTo(23.08, 1); // 3 out of 13 words
    });

    it('should be case insensitive', () => {
      const text = 'Seo is important for seo optimization. SEO helps websites.';
      const density = calculateKeywordDensity(text, 'SEO');
      
      expect(density).toBeGreaterThan(20);
    });

    it('should return 0 for non-existent keywords', () => {
      const text = 'This text does not contain the target keyword.';
      const density = calculateKeywordDensity(text, 'missing');
      
      expect(density).toBe(0);
    });
  });
});
