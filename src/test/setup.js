import { expect, afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// Mock global de Materialize CSS
beforeEach(() => {
  // Mock completo de Materialize
  window.M = {
    toast: vi.fn(),
    Modal: {
      init: vi.fn(() => ({
        open: vi.fn(),
        close: vi.fn(),
        destroy: vi.fn()
      })),
      getInstance: vi.fn(() => ({
        open: vi.fn(),
        close: vi.fn(),
        destroy: vi.fn()
      }))
    },
    FormSelect: {
      init: vi.fn(),
      getInstance: vi.fn()
    },
    Sidenav: {
      init: vi.fn(),
      getInstance: vi.fn()
    },
    Dropdown: {
      init: vi.fn(),
      getInstance: vi.fn()
    },
    Tooltip: {
      init: vi.fn(),
      getInstance: vi.fn()
    },
    Tabs: {
      init: vi.fn(),
      getInstance: vi.fn()
    },
    Datepicker: {
      init: vi.fn(),
      getInstance: vi.fn()
    },
    Carousel: {
      init: vi.fn(),
      getInstance: vi.fn()
    },
    Materialbox: {
      init: vi.fn(),
      getInstance: vi.fn()
    },
    updateTextFields: vi.fn(),
    textareaAutoResize: vi.fn(),
    CharacterCounter: {
      init: vi.fn()
    }
  };

  // Mock de console para evitar ruido en tests
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

// Cleanup después de cada test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
