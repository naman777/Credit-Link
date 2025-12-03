-- ============================================
-- CREDIT-LINK - QUERY 14: Top Borrowers Report
-- Section 4.9.3
-- ============================================

-- Query 14.1: Get top borrowers by loan amount
SELECT 
    u.name,
    u.email,
    COUNT(la.id) AS total_loans,
    SUM(la.requested_amount) AS total_borrowed,
    cs.score AS credit_score
FROM users u
JOIN loan_applications la ON u.id = la.borrower_id
LEFT JOIN credit_scores cs ON u.id = cs.user_id
WHERE la.status = 'APPROVED'
GROUP BY u.id, u.name, u.email, cs.score
ORDER BY total_borrowed DESC;
