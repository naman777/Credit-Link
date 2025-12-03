-- ============================================
-- CREDIT-LINK - QUERY 6: Loan Applications
-- Section 4.4.2 & 4.4.3
-- ============================================

-- Query 6.1: View all loan applications with borrower and product details
SELECT 
    la.id,
    u.name AS borrower_name,
    lp.name AS product_name,
    la.requested_amount,
    la.status,
    la.purpose,
    la.rejection_reason,
    la.created_at,
    la.reviewed_at
FROM loan_applications la
JOIN users u ON la.borrower_id = u.id
JOIN loan_products lp ON la.product_id = lp.id
ORDER BY la.created_at DESC;
