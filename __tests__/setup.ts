// Jest setup file
import '@testing-library/jest-dom';

// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '7d';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';

// Global test utilities
global.console = {
  ...console,
  // Suppress console.log during tests unless specifically needed
  // log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};
