-- ============================================
-- CREDIT-LINK - QUERY 13: Loans by Status Report
-- Section 4.9.2
-- ============================================

-- Query 13.1: Group loan applications by status
SELECT 
    status,
    COUNT(*) AS count,
    COALESCE(SUM(requested_amount), 0) AS total_amount
FROM loan_applications
GROUP BY status
ORDER BY count DESC;
