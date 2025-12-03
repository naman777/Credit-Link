-- ============================================
-- CREDIT-LINK - QUERY 7: Loan Contracts (Active Loans)
-- Section 4.4.6
-- ============================================

-- Query 7.1: View all loan contracts with borrower and lender details
SELECT 
    lc.id AS contract_id,
    borrower.name AS borrower_name,
    lender.name AS lender_name,
    lc.principal_amount,
    lc.interest_rate,
    lc.tenure_months,
    lc.start_date,
    lc.end_date,
    lc.status
FROM loan_contracts lc
JOIN loan_applications la ON lc.application_id = la.id
JOIN users borrower ON la.borrower_id = borrower.id
JOIN users lender ON lc.lender_id = lender.id
ORDER BY lc.created_at DESC;
