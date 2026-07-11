import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock scrollIntoView for ref elements
Element.prototype.scrollIntoView = vi.fn();

// Cleanup after each test
afterEach(() => {
  cleanup();
});
