import {
  registerSchema,
  loginSchema,
  RegisterInput,
  LoginInput,
} from '@/lib/validators/auth';

describe('Auth Validators', () => {
  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData: RegisterInput = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        password: 'securePass123',
        role: 'BORROWER',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept registration without role (defaults to BORROWER)', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        password: 'securePass123',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.role).toBe('BORROWER');
      }
    });

    it('should reject name less than 2 characters', () => {
      const data = {
        name: 'J',
        email: 'john@example.com',
        phone: '1234567890',
        password: 'securePass123',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject invalid email', () => {
      const data = {
        name: 'John Doe',
        email: 'invalid-email',
        phone: '1234567890',
        password: 'securePass123',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject phone with less than 10 digits', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123456789',
        password: 'securePass123',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject phone with more than 10 digits', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '12345678901',
        password: 'securePass123',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject phone with non-numeric characters', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        password: 'securePass123',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject password less than 8 characters', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        password: 'short',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should accept LENDER role', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        password: 'securePass123',
        role: 'LENDER' as const,
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should accept ADMIN role', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        password: 'securePass123',
        role: 'ADMIN' as const,
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject invalid role', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        password: 'securePass123',
        role: 'INVALID_ROLE',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData: LoginInput = {
        email: 'john@example.com',
        password: 'anyPassword',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const data = {
        email: 'invalid-email',
        password: 'anyPassword',
      };

      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const data = {
        email: 'john@example.com',
        password: '',
      };

      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should accept any length password (min 1)', () => {
      const data = {
        email: 'john@example.com',
        password: 'a',
      };

      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject missing email', () => {
      const data = {
        password: 'anyPassword',
      };

      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject missing password', () => {
      const data = {
        email: 'john@example.com',
      };

      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
