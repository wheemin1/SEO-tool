
import { z } from 'zod';

// Zod schema for type-safe state validation
const SERPStateSchema = z.object({
  title: z.string().min(0).max(200),
  description: z.string().min(0).max(500),
  url: z.string().url().or(z.string().min(0)),
  keywords: z.string().min(0).max(1000),
  viewMode: z.enum(['desktop', 'mobile']),
});

export type SERPState = z.infer<typeof SERPStateSchema>;

const DEFAULT_STATE: SERPState = {
  title: 'Your Page Title Goes Here - Make It Compelling and Descriptive',
  description: 'This is your meta description. It should provide a clear and concise summary of your page content to entice users to click through to your website from search results. Make it compelling and actionable.',
  url: 'https://example.com/your-page-url',
  keywords: '',
  viewMode: 'desktop'
};

// URL parameter compression for cleaner URLs
const encodeState = (state: Partial<SERPState>): Record<string, string> => {
  const params: Record<string, string> = {};
  
  if (state.title && state.title !== DEFAULT_STATE.title) {
    params.t = encodeURIComponent(state.title);
  }
  if (state.description && state.description !== DEFAULT_STATE.description) {
    params.d = encodeURIComponent(state.description);
  }
  if (state.url && state.url !== DEFAULT_STATE.url) {
    params.u = encodeURIComponent(state.url);
  }
  if (state.keywords) {
    params.k = encodeURIComponent(state.keywords);
  }
  if (state.viewMode && state.viewMode !== DEFAULT_STATE.viewMode) {
    params.v = state.viewMode;
  }
  
  return params;
};

const decodeState = (params: URLSearchParams): Partial<SERPState> => {
  const state: Partial<SERPState> = {};
  
  const title = params.get('t') || params.get('title');
  if (title) state.title = decodeURIComponent(title);
  
  const desc = params.get('d') || params.get('desc');
  if (desc) state.description = decodeURIComponent(desc);
  
  const url = params.get('u') || params.get('url');
  if (url) state.url = decodeURIComponent(url);
  
  const keywords = params.get('k') || params.get('keywords');
  if (keywords) state.keywords = decodeURIComponent(keywords);
  
  const viewMode = params.get('v') || params.get('view');
  if (viewMode === 'desktop' || viewMode === 'mobile') {
    state.viewMode = viewMode;
  }
  
  return state;
};

export const getStateFromURL = (): Partial<SERPState> => {
  if (typeof window === 'undefined') return {};
  
  try {
    const params = new URLSearchParams(window.location.search);
    return decodeState(params);
  } catch (error) {
    console.warn('Failed to parse URL state:', error);
    return {};
  }
};

export const getStateFromLocalStorage = (): Partial<SERPState> => {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem('serp-preview-state');
    if (!stored) return {};
    
    const parsed = JSON.parse(stored);
    const result = SERPStateSchema.partial().safeParse(parsed);
    
    return result.success ? result.data : {};
  } catch (error) {
    console.warn('Failed to parse localStorage state:', error);
    // Clear corrupted data
    try {
      localStorage.removeItem('serp-preview-state');
    } catch {}
    return {};
  }
};

export const saveStateToURL = (state: SERPState): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const params = new URLSearchParams();
    const encodedState = encodeState(state);
    
    Object.entries(encodedState).forEach(([key, value]) => {
      params.set(key, value);
    });
    
    const newURL = params.toString() 
      ? `${window.location.pathname}?${params.toString()}` 
      : window.location.pathname;
      
    // Only update if URL actually changed
    if (newURL !== window.location.pathname + window.location.search) {
      window.history.replaceState({}, '', newURL);
    }
  } catch (error) {
    console.warn('Failed to save state to URL:', error);
  }
};

export const saveStateToLocalStorage = (state: SERPState): void => {
  if (typeof window === 'undefined') return;
  
  try {
    // Validate state before saving
    const result = SERPStateSchema.safeParse(state);
    if (result.success) {
      localStorage.setItem('serp-preview-state', JSON.stringify(result.data));
    }
  } catch (error) {
    console.warn('Failed to save state to localStorage:', error);
  }
};

export const getInitialState = (): SERPState => {
  const urlState = getStateFromURL();
  const localState = getStateFromLocalStorage();
  
  const mergedState = {
    ...DEFAULT_STATE,
    ...localState,
    ...urlState // URL state takes precedence
  };
  
  // Validate the merged state
  const result = SERPStateSchema.safeParse(mergedState);
  return result.success ? result.data : DEFAULT_STATE;
};

// Utility for sharing URLs
export const generateShareableURL = (state: SERPState): string => {
  if (typeof window === 'undefined') return '';
  
  const params = new URLSearchParams();
  const encodedState = encodeState(state);
  
  Object.entries(encodedState).forEach(([key, value]) => {
    params.set(key, value);
  });
  
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
};

// Reset to defaults
export const resetState = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('serp-preview-state');
    window.history.replaceState({}, '', window.location.pathname);
  } catch (error) {
    console.warn('Failed to reset state:', error);
  }
};
