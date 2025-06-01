import { useState, useEffect, useCallback, useMemo } from 'react';
import { measureTextWidth } from '@/utils/textMeasurement';
import { getInitialState, saveStateToURL, saveStateToLocalStorage, SERPState } from '@/utils/urlState';

export interface SERPMetrics {
  titlePixelWidth: number;
  descriptionPixelWidth: number;
  titleStatus: 'good' | 'warning' | 'error';
  descriptionStatus: 'good' | 'warning' | 'error';
}

export interface SERPLimits {
  TITLE_CHAR_LIMIT: number;
  DESCRIPTION_CHAR_LIMIT: number;
  TITLE_PIXEL_LIMIT: number;
  DESCRIPTION_PIXEL_LIMIT: number;
}

export const useSERPState = () => {
  const [state, setState] = useState<SERPState>(getInitialState);
  const [metrics, setMetrics] = useState<SERPMetrics>({
    titlePixelWidth: 0,
    descriptionPixelWidth: 0,
    titleStatus: 'good',
    descriptionStatus: 'good',
  });

  // Constants
  const limits = useMemo((): SERPLimits => ({
    TITLE_CHAR_LIMIT: 60,
    DESCRIPTION_CHAR_LIMIT: 160,
    TITLE_PIXEL_LIMIT: state.viewMode === 'desktop' ? 600 : 920,
    DESCRIPTION_PIXEL_LIMIT: state.viewMode === 'desktop' ? 920 : 1200,
  }), [state.viewMode]);

  // Debounced state saving
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveStateToURL(state);
      saveStateToLocalStorage(state);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [state]);

  // Calculate metrics when text or view mode changes
  const calculateMetrics = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;

    const titleFont = state.viewMode === 'desktop' ? '20px Arial' : '18px Arial';
    const descFont = state.viewMode === 'desktop' ? '14px Arial' : '13px Arial';

    const titlePixelWidth = measureTextWidth(state.title, titleFont, canvas);
    const descriptionPixelWidth = measureTextWidth(state.description, descFont, canvas);

    const titleStatus = getTitleStatus(titlePixelWidth);
    const descriptionStatus = getDescriptionStatus(descriptionPixelWidth);

    setMetrics({
      titlePixelWidth,
      descriptionPixelWidth,
      titleStatus,
      descriptionStatus,
    });
  }, [state.title, state.description, state.viewMode, limits]);

  const getTitleStatus = useCallback((pixelWidth: number): 'good' | 'warning' | 'error' => {
    if (state.title.length > limits.TITLE_CHAR_LIMIT || pixelWidth > limits.TITLE_PIXEL_LIMIT) {
      return 'error';
    }
    if (state.title.length > limits.TITLE_CHAR_LIMIT * 0.9 || pixelWidth > limits.TITLE_PIXEL_LIMIT * 0.9) {
      return 'warning';
    }
    return 'good';
  }, [state.title, limits]);

  const getDescriptionStatus = useCallback((pixelWidth: number): 'good' | 'warning' | 'error' => {
    if (state.description.length > limits.DESCRIPTION_CHAR_LIMIT || pixelWidth > limits.DESCRIPTION_PIXEL_LIMIT) {
      return 'error';
    }
    if (state.description.length > limits.DESCRIPTION_CHAR_LIMIT * 0.9 || pixelWidth > limits.DESCRIPTION_PIXEL_LIMIT * 0.9) {
      return 'warning';
    }
    return 'good';
  }, [state.description, limits]);

  // Optimized update functions
  const updateTitle = useCallback((title: string) => {
    setState(prev => ({ ...prev, title }));
  }, []);

  const updateDescription = useCallback((description: string) => {
    setState(prev => ({ ...prev, description }));
  }, []);

  const updateUrl = useCallback((url: string) => {
    setState(prev => ({ ...prev, url }));
  }, []);

  const updateKeywords = useCallback((keywords: string) => {
    setState(prev => ({ ...prev, keywords }));
  }, []);

  const updateViewMode = useCallback((viewMode: 'desktop' | 'mobile') => {
    setState(prev => ({ ...prev, viewMode }));
  }, []);

  // Parsed keywords
  const keywordArray = useMemo(() => 
    state.keywords.split(',').map(k => k.trim()).filter(k => k),
    [state.keywords]
  );

  return {
    state,
    metrics,
    limits,
    keywordArray,
    updateTitle,
    updateDescription,
    updateUrl,
    updateKeywords,
    updateViewMode,
    calculateMetrics,
  };
};
