-- ============================================
-- CREDIT-LINK - QUERY 15: Loan Summary Report (Complex)
-- Section 4.9.5
-- ============================================

-- Query 15.1: Comprehensive loan summary
SELECT
    COUNT(*) AS total_loans,
    COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) AS active_loans,
    COUNT(CASE WHEN status = 'CLOSED' THEN 1 END) AS closed_loans,
    COUNT(CASE WHEN status = 'DEFAULTED' THEN 1 END) AS defaulted_loans,
    COALESCE(SUM(principal_amount), 0) AS total_disbursed,
    COALESCE(SUM(CASE WHEN status = 'CLOSED' THEN principal_amount ELSE 0 END), 0) AS total_repaid,
    COALESCE(SUM(CASE WHEN status = 'ACTIVE' THEN principal_amount ELSE 0 END), 0) AS pending_amount,
    COALESCE(ROUND(AVG(principal_amount), 2), 0) AS avg_loan_amount,
    COALESCE(ROUND(AVG(interest_rate), 2), 0) AS avg_interest_rate
FROM loan_contracts;
