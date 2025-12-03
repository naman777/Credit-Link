import { requireRole } from '@/lib/utils/middleware';
import { JWTPayload } from '@/lib/utils/auth';

describe('Middleware Utilities', () => {
  describe('requireRole', () => {
    it('should return true when user has the required role', () => {
      const user: JWTPayload = {
        userId: 'user-123',
        email: 'admin@test.com',
        role: 'ADMIN',
      };

      const result = requireRole(user, ['ADMIN']);
      expect(result).toBe(true);
    });

    it('should return true when user has one of multiple allowed roles', () => {
      const user: JWTPayload = {
        userId: 'user-123',
        email: 'lender@test.com',
        role: 'LENDER',
      };

      const result = requireRole(user, ['ADMIN', 'LENDER']);
      expect(result).toBe(true);
    });

    it('should return false when user does not have required role', () => {
      const user: JWTPayload = {
        userId: 'user-123',
        email: 'borrower@test.com',
        role: 'BORROWER',
      };

      const result = requireRole(user, ['ADMIN']);
      expect(result).toBe(false);
    });

    it('should return false when user role is not in allowed roles list', () => {
      const user: JWTPayload = {
        userId: 'user-123',
        email: 'borrower@test.com',
        role: 'BORROWER',
      };

      const result = requireRole(user, ['ADMIN', 'LENDER']);
      expect(result).toBe(false);
    });

    it('should be case sensitive for role matching', () => {
      const user: JWTPayload = {
        userId: 'user-123',
        email: 'admin@test.com',
        role: 'admin', // lowercase
      };

      const result = requireRole(user, ['ADMIN']); // uppercase
      expect(result).toBe(false);
    });

    it('should return false for empty allowed roles array', () => {
      const user: JWTPayload = {
        userId: 'user-123',
        email: 'admin@test.com',
        role: 'ADMIN',
      };

      const result = requireRole(user, []);
      expect(result).toBe(false);
    });

    it('should work with BORROWER role', () => {
      const user: JWTPayload = {
        userId: 'user-123',
        email: 'borrower@test.com',
        role: 'BORROWER',
      };

      const result = requireRole(user, ['BORROWER']);
      expect(result).toBe(true);
    });

    it('should allow admin access to borrower-only routes when admin is included', () => {
      const user: JWTPayload = {
        userId: 'user-123',
        email: 'admin@test.com',
        role: 'ADMIN',
      };

      const result = requireRole(user, ['BORROWER', 'ADMIN']);
      expect(result).toBe(true);
    });
  });
});
