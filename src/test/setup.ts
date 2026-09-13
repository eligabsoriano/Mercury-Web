import '@testing-library/jest-dom';

// Polyfill window.matchMedia for JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Polyfill ResizeObserver for Recharts ResponsiveContainer in JSDOM
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Polyfill URL.createObjectURL and URL.revokeObjectURL for JSDOM
if (typeof URL !== 'undefined') {
  if (!URL.createObjectURL) {
    URL.createObjectURL = () => 'blob:mock-url';
  }
  if (!URL.revokeObjectURL) {
    URL.revokeObjectURL = () => {};
  }
}

// Polyfill navigator.clipboard for JSDOM
if (typeof navigator !== 'undefined') {
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: async () => Promise.resolve(),
    },
    writable: true,
    configurable: true,
  });
}

// Polyfill Element.prototype.scrollIntoView for JSDOM
if (typeof Element !== 'undefined') {
  Element.prototype.scrollIntoView = () => {};
}
if (typeof window !== 'undefined' && window.HTMLElement) {
  window.HTMLElement.prototype.scrollIntoView = () => {};
}
