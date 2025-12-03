-- ============================================
-- CREDIT-LINK - QUERY 12: Platform Statistics (Admin)
-- Section 4.9.1
-- ============================================

-- Query 12.1: Comprehensive platform statistics
SELECT
    (SELECT COUNT(*) FROM users) AS total_users,
    (SELECT COUNT(*) FROM users WHERE role = 'BORROWER') AS total_borrowers,
    (SELECT COUNT(*) FROM users WHERE role = 'LENDER') AS total_lenders,
    (SELECT COUNT(*) FROM kyc_documents WHERE verification_status = 'PENDING') AS pending_kyc,
    (SELECT COUNT(*) FROM loan_applications WHERE status = 'PENDING') AS pending_loans,
    (SELECT COUNT(*) FROM loan_contracts WHERE status = 'ACTIVE') AS active_loans,
    (SELECT COALESCE(SUM(principal_amount), 0) FROM loan_contracts) AS total_disbursed,
    (SELECT COALESCE(SUM(paid_amount), 0) FROM repayment_transactions) AS total_repaid,
    (SELECT COUNT(*) FROM repayment_schedules WHERE status = 'OVERDUE') AS overdue_emis;
