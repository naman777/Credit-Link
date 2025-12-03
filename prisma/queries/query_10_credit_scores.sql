-- ============================================
-- CREDIT-LINK - QUERY 10: Credit Scores with Rating
-- Section 4.7
-- ============================================

-- Query 10.1: View credit scores with calculated rating
SELECT 
    u.name,
    u.email,
    cs.score,
    CASE 
        WHEN cs.score >= 750 THEN 'Excellent'
        WHEN cs.score >= 700 THEN 'Good'
        WHEN cs.score >= 650 THEN 'Fair'
        WHEN cs.score >= 600 THEN 'Average'
        ELSE 'Poor'
    END AS rating,
    cs.total_loans_taken,
    cs.on_time_payments,
    cs.late_payments,
    cs.defaults_count,
    cs.last_updated
FROM credit_scores cs
JOIN users u ON cs.user_id = u.id
WHERE u.role = 'BORROWER'
ORDER BY cs.score DESC;
