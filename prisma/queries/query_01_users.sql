-- ============================================
-- CREDIT-LINK - QUERY 1: User Registration & Profile
-- Section 4.1.1 & 4.1.2
-- ============================================

-- Query 1.1: View all registered users
SELECT 
    id,
    name,
    email,
    phone,
    role,
    status,
    created_at
FROM users
ORDER BY created_at DESC;
