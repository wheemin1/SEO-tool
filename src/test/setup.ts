import '@testing-library/jest-dom';

// Mock canvas for text measurement tests
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: () => ({
    measureText: (text: string) => ({ width: text.length * 8 }), // Simple mock
    font: '',
  }),
});

// Mock URL and localStorage for state management tests
Object.defineProperty(window, 'location', {
  value: {
    search: '',
    href: 'http://localhost:3000',
  },
  writable: true,
});

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});
