-- ============================================
-- CREDIT-LINK - QUERY 5: Loan Products
-- Section 4.4.1
-- ============================================

-- Query 5.1: View all loan products
SELECT 
    id,
    name,
    min_amount,
    max_amount,
    interest_rate,
    tenure_months,
    processing_fee,
    is_active,
    created_at
FROM loan_products
ORDER BY interest_rate ASC;
