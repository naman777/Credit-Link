// Shared types for the Credit-Link application

export type UserRole = 'BORROWER' | 'LENDER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type LoanStatus = 'ACTIVE' | 'CLOSED' | 'DEFAULTED';
export type RepaymentStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'PARTIAL';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type DocType = 'AADHAAR' | 'PAN' | 'PASSPORT' | 'DRIVING_LICENSE' | 'VOTER_ID';
export type TransactionType = 'CREDIT' | 'DEBIT';
export type ReferenceType = 'LOAN_DISBURSAL' | 'REPAYMENT' | 'DEPOSIT' | 'WITHDRAWAL' | 'PENALTY';
export type NotificationType = 'LOAN_APPROVED' | 'LOAN_REJECTED' | 'EMI_DUE' | 'EMI_OVERDUE' |
  'REPAYMENT_SUCCESS' | 'WALLET_CREDIT' | 'WALLET_DEBIT' | 'KYC_VERIFIED' | 'KYC_REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  current_balance: number;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  user_id: string;
  tx_type: TransactionType;
  amount: number;
  reference_type?: ReferenceType;
  reference_id?: string;
  timestamp: string;
  description?: string;
}

export interface LoanProduct {
  id: string;
  name: string;
  min_amount: number;
  max_amount: number;
  interest_rate: number;
  tenure_months: number;
  processing_fee: number;
  is_active: boolean;
  created_at: string;
}

export interface LoanApplication {
  id: string;
  borrower_id: string;
  product_id: string;
  requested_amount: number;
  status: ApplicationStatus;
  purpose?: string;
  rejection_reason?: string;
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  product?: LoanProduct;
}

export interface LoanContract {
  id: string;
  application_id: string;
  lender_id: string;
  principal_amount: number;
  interest_rate: number;
  tenure_months: number;
  start_date: string;
  end_date: string;
  status: LoanStatus;
  created_at: string;
  updated_at: string;
  application?: LoanApplication;
}

export interface RepaymentSchedule {
  id: string;
  loan_id: string;
  installment_number: number;
  due_date: string;
  amount_due: number;
  principal_component: number;
  interest_component: number;
  status: RepaymentStatus;
  paid_on?: string;
  late_fee?: number;
  created_at: string;
}

export interface CreditScore {
  id: string;
  user_id: string;
  score: number;
  total_loans_taken: number;
  defaults_count: number;
  on_time_payments: number;
  late_payments: number;
  last_updated: string;
}

export interface KYCDocument {
  id: string;
  user_id: string;
  doc_type: DocType;
  doc_number: string;
  verification_status: VerificationStatus;
  verified_at?: string;
  created_at: string;
}

export interface NotificationLog {
  id: string;
  user_id: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
}
