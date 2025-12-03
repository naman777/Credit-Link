import {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  extractToken,
  JWTPayload,
} from '@/lib/utils/auth';

describe('Auth Utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testPassword123';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'testPassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      // Bcrypt generates different salts, so hashes should be different
      expect(hash1).not.toBe(hash2);
    });

    it('should generate hash with bcrypt format', async () => {
      const password = 'testPassword123';
      const hash = await hashPassword(password);

      // Bcrypt hashes start with $2a$ or $2b$
      expect(hash).toMatch(/^\$2[ab]\$/);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'testPassword123';
      const hash = await hashPassword(password);

      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword123';
      const hash = await hashPassword(password);

      const isValid = await verifyPassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });

    it('should handle empty password', async () => {
      const password = 'testPassword123';
      const hash = await hashPassword(password);

      const isValid = await verifyPassword('', hash);
      expect(isValid).toBe(false);
    });

    it('should be case sensitive', async () => {
      const password = 'TestPassword123';
      const hash = await hashPassword(password);

      const isValid = await verifyPassword('testpassword123', hash);
      expect(isValid).toBe(false);
    });
  });

  describe('generateToken', () => {
    const mockPayload: JWTPayload = {
      userId: 'user-123',
      email: 'test@example.com',
      role: 'BORROWER',
    };

    it('should generate a valid JWT token', () => {
      const token = generateToken(mockPayload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      // JWT format: header.payload.signature
      expect(token.split('.')).toHaveLength(3);
    });

    it('should include payload data in token', () => {
      const token = generateToken(mockPayload);
      const decoded = verifyToken(token);

      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.role).toBe(mockPayload.role);
    });

    it('should generate different tokens for different payloads', () => {
      const payload1: JWTPayload = { userId: 'user-1', email: 'a@test.com', role: 'BORROWER' };
      const payload2: JWTPayload = { userId: 'user-2', email: 'b@test.com', role: 'LENDER' };

      const token1 = generateToken(payload1);
      const token2 = generateToken(payload2);

      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyToken', () => {
    const mockPayload: JWTPayload = {
      userId: 'user-123',
      email: 'test@example.com',
      role: 'ADMIN',
    };

    it('should verify a valid token', () => {
      const token = generateToken(mockPayload);
      const decoded = verifyToken(token);

      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.role).toBe(mockPayload.role);
    });

    it('should throw error for invalid token', () => {
      expect(() => verifyToken('invalid-token')).toThrow('Invalid or expired token');
    });

    it('should throw error for tampered token', () => {
      const token = generateToken(mockPayload);
      const tamperedToken = token.slice(0, -5) + 'xxxxx';

      expect(() => verifyToken(tamperedToken)).toThrow('Invalid or expired token');
    });

    it('should throw error for empty token', () => {
      expect(() => verifyToken('')).toThrow();
    });
  });

  describe('extractToken', () => {
    it('should extract token from valid Bearer header', () => {
      const token = 'valid-jwt-token';
      const header = `Bearer ${token}`;

      expect(extractToken(header)).toBe(token);
    });

    it('should return null for null header', () => {
      expect(extractToken(null)).toBeNull();
    });

    it('should return null for header without Bearer prefix', () => {
      expect(extractToken('some-token')).toBeNull();
    });

    it('should return null for header with wrong prefix', () => {
      expect(extractToken('Basic some-token')).toBeNull();
    });

    it('should return null for empty header', () => {
      expect(extractToken('')).toBeNull();
    });

    it('should handle Bearer with extra spaces correctly', () => {
      // Only exact "Bearer " prefix should work
      expect(extractToken('Bearer  token-with-extra-space')).toBe(' token-with-extra-space');
    });

    it('should extract token with special characters', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';
      const header = `Bearer ${token}`;

      expect(extractToken(header)).toBe(token);
    });
  });
});
