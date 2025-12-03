import {
  kycSubmitSchema,
  kycVerifySchema,
  KYCSubmitInput,
  KYCVerifyInput,
} from '@/lib/validators/kyc';

describe('KYC Validators', () => {
  describe('kycSubmitSchema', () => {
    it('should validate correct KYC submission with AADHAAR', () => {
      const validData: KYCSubmitInput = {
        doc_type: 'AADHAAR',
        doc_number: '123456789012',
      };

      const result = kycSubmitSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate correct KYC submission with PAN', () => {
      const validData: KYCSubmitInput = {
        doc_type: 'PAN',
        doc_number: 'ABCDE1234F',
      };

      const result = kycSubmitSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate correct KYC submission with PASSPORT', () => {
      const validData: KYCSubmitInput = {
        doc_type: 'PASSPORT',
        doc_number: 'A12345678',
      };

      const result = kycSubmitSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate correct KYC submission with DRIVING_LICENSE', () => {
      const validData: KYCSubmitInput = {
        doc_type: 'DRIVING_LICENSE',
        doc_number: 'DL-0420190001234',
      };

      const result = kycSubmitSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate correct KYC submission with VOTER_ID', () => {
      const validData: KYCSubmitInput = {
        doc_type: 'VOTER_ID',
        doc_number: 'ABC1234567',
      };

      const result = kycSubmitSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid doc_type', () => {
      const data = {
        doc_type: 'INVALID_TYPE',
        doc_number: '123456789012',
      };

      const result = kycSubmitSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject doc_number less than 5 characters', () => {
      const data = {
        doc_type: 'PAN',
        doc_number: '1234',
      };

      const result = kycSubmitSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should accept doc_number exactly 5 characters', () => {
      const data = {
        doc_type: 'PAN',
        doc_number: '12345',
      };

      const result = kycSubmitSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject missing doc_type', () => {
      const data = {
        doc_number: '123456789012',
      };

      const result = kycSubmitSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject missing doc_number', () => {
      const data = {
        doc_type: 'AADHAAR',
      };

      const result = kycSubmitSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject empty doc_number', () => {
      const data = {
        doc_type: 'AADHAAR',
        doc_number: '',
      };

      const result = kycSubmitSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('kycVerifySchema', () => {
    it('should validate correct verification with VERIFIED status', () => {
      const validData: KYCVerifyInput = {
        kyc_id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'VERIFIED',
      };

      const result = kycVerifySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate correct verification with REJECTED status', () => {
      const validData: KYCVerifyInput = {
        kyc_id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'REJECTED',
      };

      const result = kycVerifySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid kyc_id (not UUID)', () => {
      const data = {
        kyc_id: 'invalid-id',
        status: 'VERIFIED',
      };

      const result = kycVerifySchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject invalid status', () => {
      const data = {
        kyc_id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'PENDING',
      };

      const result = kycVerifySchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject missing kyc_id', () => {
      const data = {
        status: 'VERIFIED',
      };

      const result = kycVerifySchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject missing status', () => {
      const data = {
        kyc_id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const result = kycVerifySchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should be case sensitive for status', () => {
      const data = {
        kyc_id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'verified',
      };

      const result = kycVerifySchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
