import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSERPState } from '../hooks/useSERPState';

// Mock the URL state utility
vi.mock('../utils/urlState', () => ({
  getInitialState: () => ({
    title: '',
    description: '',
    url: '',
    keywords: '',
    viewMode: 'desktop' as const,
  }),
  saveStateToURL: vi.fn(),
  saveStateToLocalStorage: vi.fn(),
}));

describe('useSERPState', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useSERPState());
    
    expect(result.current.state.title).toBe('');
    expect(result.current.state.description).toBe('');
    expect(result.current.state.url).toBe('');
    expect(result.current.state.keywords).toBe('');
    expect(result.current.state.viewMode).toBe('desktop');
  });

  it('should update title correctly', () => {
    const { result } = renderHook(() => useSERPState());
    
    act(() => {
      result.current.updateTitle('New Title');
    });
    
    expect(result.current.state.title).toBe('New Title');
  });

  it('should update description correctly', () => {
    const { result } = renderHook(() => useSERPState());
    
    act(() => {
      result.current.updateDescription('New Description');
    });
    
    expect(result.current.state.description).toBe('New Description');
  });

  it('should parse keywords correctly', () => {
    const { result } = renderHook(() => useSERPState());
    
    act(() => {
      result.current.updateKeywords('keyword1, keyword2, keyword3');
    });
    
    expect(result.current.keywordArray).toEqual(['keyword1', 'keyword2', 'keyword3']);
  });

  it('should handle empty keywords', () => {
    const { result } = renderHook(() => useSERPState());
    
    act(() => {
      result.current.updateKeywords('');
    });
    
    expect(result.current.keywordArray).toEqual([]);
  });

  it('should calculate limits based on view mode', () => {
    const { result } = renderHook(() => useSERPState());
    
    // Desktop mode
    expect(result.current.limits.TITLE_PIXEL_LIMIT).toBe(600);
    expect(result.current.limits.DESCRIPTION_PIXEL_LIMIT).toBe(920);
    
    // Switch to mobile
    act(() => {
      result.current.updateViewMode('mobile');
    });
    
    expect(result.current.limits.TITLE_PIXEL_LIMIT).toBe(920);
    expect(result.current.limits.DESCRIPTION_PIXEL_LIMIT).toBe(1200);
  });

  it('should return correct status for title length', () => {
    const { result } = renderHook(() => useSERPState());
    
    // Good status
    act(() => {
      result.current.updateTitle('Short title');
    });
    
    // Mock canvas and calculate metrics
    const canvas = document.createElement('canvas');
    act(() => {
      result.current.calculateMetrics(canvas);
    });
    
    expect(result.current.metrics.titleStatus).toBe('good');
    
    // Error status (too long)
    act(() => {
      result.current.updateTitle('This is a very long title that exceeds the recommended character limit for SEO purposes');
    });
    
    act(() => {
      result.current.calculateMetrics(canvas);
    });
    
    expect(result.current.metrics.titleStatus).toBe('error');
  });
});
