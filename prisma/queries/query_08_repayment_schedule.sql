-- ============================================
-- CREDIT-LINK - QUERY 8: Repayment Schedule (EMIs)
-- Section 4.5.3
-- ============================================

-- Query 8.1: View repayment schedule for a specific loan (Rahul's first loan)
SELECT 
    rs.installment_number AS emi_no,
    rs.due_date,
    rs.amount_due AS emi_amount,
    rs.principal_component,
    rs.interest_component,
    rs.status,
    rs.paid_on,
    rs.late_fee
FROM repayment_schedules rs
WHERE rs.loan_id = 'lc000000-0000-0000-0000-000000000001'
ORDER BY rs.installment_number;

-- Query 8.2: View all repayment schedules with loan and borrower details
SELECT 
    u.name AS borrower_name,
    lc.principal_amount AS loan_amount,
    rs.installment_number AS emi_no,
    rs.due_date,
    rs.amount_due,
    rs.status,
    rs.paid_on
FROM repayment_schedules rs
JOIN loan_contracts lc ON rs.loan_id = lc.id
JOIN loan_applications la ON lc.application_id = la.id
JOIN users u ON la.borrower_id = u.id
ORDER BY u.name, rs.installment_number;
