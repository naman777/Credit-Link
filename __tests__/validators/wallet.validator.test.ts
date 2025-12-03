import {
  depositSchema,
  withdrawSchema,
  makeRepaymentSchema,
  DepositInput,
  WithdrawInput,
  MakeRepaymentInput,
} from '@/lib/validators/wallet';

describe('Wallet Validators', () => {
  describe('depositSchema', () => {
    it('should validate correct deposit data', () => {
      const validData: DepositInput = {
        amount: 1000,
      };

      const result = depositSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept decimal amounts', () => {
      const data = {
        amount: 1000.50,
      };

      const result = depositSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should accept very small positive amounts', () => {
      const data = {
        amount: 0.01,
      };

      const result = depositSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject zero amount', () => {
      const data = {
        amount: 0,
      };

      const result = depositSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject negative amount', () => {
      const data = {
        amount: -100,
      };

      const result = depositSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject missing amount', () => {
      const data = {};

      const result = depositSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject non-numeric amount', () => {
      const data = {
        amount: 'thousand',
      };

      const result = depositSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should accept large amounts', () => {
      const data = {
        amount: 10000000,
      };

      const result = depositSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('withdrawSchema', () => {
    it('should validate correct withdrawal data', () => {
      const validData: WithdrawInput = {
        amount: 500,
      };

      const result = withdrawSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept decimal amounts', () => {
      const data = {
        amount: 500.75,
      };

      const result = withdrawSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject zero amount', () => {
      const data = {
        amount: 0,
      };

      const result = withdrawSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject negative amount', () => {
      const data = {
        amount: -50,
      };

      const result = withdrawSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject missing amount', () => {
      const data = {};

      const result = withdrawSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('makeRepaymentSchema', () => {
    it('should validate correct repayment data', () => {
      const validData: MakeRepaymentInput = {
        schedule_id: '123e4567-e89b-12d3-a456-426614174000',
        amount: 5000,
      };

      const result = makeRepaymentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid schedule_id (not UUID)', () => {
      const data = {
        schedule_id: 'invalid-id',
        amount: 5000,
      };

      const result = makeRepaymentSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject zero amount', () => {
      const data = {
        schedule_id: '123e4567-e89b-12d3-a456-426614174000',
        amount: 0,
      };

      const result = makeRepaymentSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject negative amount', () => {
      const data = {
        schedule_id: '123e4567-e89b-12d3-a456-426614174000',
        amount: -100,
      };

      const result = makeRepaymentSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should accept partial payment amounts', () => {
      const data = {
        schedule_id: '123e4567-e89b-12d3-a456-426614174000',
        amount: 2500.50,
      };

      const result = makeRepaymentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject missing schedule_id', () => {
      const data = {
        amount: 5000,
      };

      const result = makeRepaymentSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject missing amount', () => {
      const data = {
        schedule_id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const result = makeRepaymentSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
