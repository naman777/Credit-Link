import { z } from 'zod';

export const loanApplicationSchema = z.object({
  product_id: z.string().uuid('Invalid product ID'),
  requested_amount: z.number().positive('Amount must be positive'),
  purpose: z.string().optional(),
});

export const approveLoanSchema = z.object({
  application_id: z.string().uuid('Invalid application ID'),
  lender_id: z.string().uuid('Invalid lender ID'),
});

export const rejectLoanSchema = z.object({
  application_id: z.string().uuid('Invalid application ID'),
  rejection_reason: z.string().min(10, 'Rejection reason must be at least 10 characters'),
});

export type LoanApplicationInput = z.infer<typeof loanApplicationSchema>;
export type ApproveLoanInput = z.infer<typeof approveLoanSchema>;
export type RejectLoanInput = z.infer<typeof rejectLoanSchema>;
