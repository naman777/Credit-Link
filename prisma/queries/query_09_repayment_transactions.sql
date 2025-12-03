-- ============================================
-- CREDIT-LINK - QUERY 9: Repayment Transactions
-- Section 4.6
-- ============================================

-- Query 9.1: View all repayment transactions with details
SELECT 
    rt.id,
    u.name AS borrower_name,
    lc.principal_amount AS loan_amount,
    rs.installment_number AS emi_no,
    rt.paid_amount,
    rt.late_fee,
    rt.paid_at
FROM repayment_transactions rt
JOIN repayment_schedules rs ON rt.schedule_id = rs.id
JOIN loan_contracts lc ON rs.loan_id = lc.id
JOIN loan_applications la ON lc.application_id = la.id
JOIN users u ON la.borrower_id = u.id
ORDER BY rt.paid_at DESC;
