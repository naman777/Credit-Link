import {
  loanApplicationSchema,
  approveLoanSchema,
  rejectLoanSchema,
  LoanApplicationInput,
  ApproveLoanInput,
  RejectLoanInput,
} from '@/lib/validators/loan';

describe('Loan Validators', () => {
  describe('loanApplicationSchema', () => {
    it('should validate correct loan application data', () => {
      const validData: LoanApplicationInput = {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        requested_amount: 50000,
        purpose: 'Home renovation',
      };

      const result = loanApplicationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept loan application without purpose', () => {
      const data = {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        requested_amount: 50000,
      };

      const result = loanApplicationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject invalid product_id (not UUID)', () => {
      const data = {
        product_id: 'invalid-id',
        requested_amount: 50000,
      };

      const result = loanApplicationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject zero amount', () => {
      const data = {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        requested_amount: 0,
      };

      const result = loanApplicationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject negative amount', () => {
      const data = {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        requested_amount: -1000,
      };

      const result = loanApplicationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should accept very large amounts', () => {
      const data = {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        requested_amount: 10000000,
      };

      const result = loanApplicationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should accept decimal amounts', () => {
      const data = {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        requested_amount: 50000.50,
      };

      const result = loanApplicationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject missing product_id', () => {
      const data = {
        requested_amount: 50000,
      };

      const result = loanApplicationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject missing requested_amount', () => {
      const data = {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const result = loanApplicationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('approveLoanSchema', () => {
    it('should validate correct approval data', () => {
      const validData: ApproveLoanInput = {
        application_id: '123e4567-e89b-12d3-a456-426614174000',
        lender_id: '223e4567-e89b-12d3-a456-426614174000',
      };

      const result = approveLoanSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid application_id', () => {
      const data = {
        application_id: 'invalid-uuid',
        lender_id: '223e4567-e89b-12d3-a456-426614174000',
      };

      const result = approveLoanSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject invalid lender_id', () => {
      const data = {
        application_id: '123e4567-e89b-12d3-a456-426614174000',
        lender_id: 'invalid-uuid',
      };

      const result = approveLoanSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject missing application_id', () => {
      const data = {
        lender_id: '223e4567-e89b-12d3-a456-426614174000',
      };

      const result = approveLoanSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject missing lender_id', () => {
      const data = {
        application_id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const result = approveLoanSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('rejectLoanSchema', () => {
    it('should validate correct rejection data', () => {
      const validData: RejectLoanInput = {
        application_id: '123e4567-e89b-12d3-a456-426614174000',
        rejection_reason: 'Insufficient credit score for this loan amount',
      };

      const result = rejectLoanSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid application_id', () => {
      const data = {
        application_id: 'invalid-uuid',
        rejection_reason: 'Insufficient credit score for this loan amount',
      };

      const result = rejectLoanSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject rejection_reason less than 10 characters', () => {
      const data = {
        application_id: '123e4567-e89b-12d3-a456-426614174000',
        rejection_reason: 'Too short',
      };

      const result = rejectLoanSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should accept rejection_reason exactly 10 characters', () => {
      const data = {
        application_id: '123e4567-e89b-12d3-a456-426614174000',
        rejection_reason: '1234567890',
      };

      const result = rejectLoanSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject missing application_id', () => {
      const data = {
        rejection_reason: 'Insufficient credit score',
      };

      const result = rejectLoanSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject missing rejection_reason', () => {
      const data = {
        application_id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const result = rejectLoanSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
