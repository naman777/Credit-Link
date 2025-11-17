import { z } from 'zod';

export const kycSubmitSchema = z.object({
  doc_type: z.enum(['AADHAAR', 'PAN', 'PASSPORT', 'DRIVING_LICENSE', 'VOTER_ID']),
  doc_number: z.string().min(5, 'Document number must be at least 5 characters'),
});

export const kycVerifySchema = z.object({
  kyc_id: z.string().uuid('Invalid KYC ID'),
  status: z.enum(['VERIFIED', 'REJECTED']),
});

export type KYCSubmitInput = z.infer<typeof kycSubmitSchema>;
export type KYCVerifyInput = z.infer<typeof kycVerifySchema>;
