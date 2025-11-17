-- ============================================
-- CREDIT-LINK PLATFORM
-- Triggers and Stored Procedures for PostgreSQL
-- ============================================

-- ============================================
-- 1. TRIGGER: Check wallet balance before debit
-- ============================================
CREATE OR REPLACE FUNCTION check_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tx_type = 'DEBIT' THEN
        -- Get current wallet balance
        DECLARE
            current_bal DECIMAL;
        BEGIN
            SELECT current_balance INTO current_bal
            FROM wallets
            WHERE id = NEW.wallet_id;

            -- Check if sufficient balance
            IF current_bal < NEW.amount THEN
                RAISE EXCEPTION 'Insufficient wallet balance';
            END IF;
        END;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_wallet_balance
BEFORE INSERT ON wallet_transactions
FOR EACH ROW
EXECUTE FUNCTION check_wallet_balance();

-- ============================================
-- 2. TRIGGER: Auto-mark overdue EMIs
-- This would typically run on a schedule (daily cron job)
-- But can also be triggered on repayment schedule queries
-- ============================================
CREATE OR REPLACE FUNCTION mark_overdue_emis()
RETURNS TRIGGER AS $$
BEGIN
    -- Update all pending EMIs that are past due date
    UPDATE repayment_schedules
    SET status = 'OVERDUE'
    WHERE due_date < CURRENT_DATE
      AND status = 'PENDING';

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- This can be called via a daily cron job or manually
CREATE OR REPLACE FUNCTION run_overdue_check()
RETURNS void AS $$
BEGIN
    UPDATE repayment_schedules
    SET status = 'OVERDUE'
    WHERE due_date < CURRENT_DATE
      AND status = 'PENDING';

    -- Create notifications for overdue EMIs
    INSERT INTO notification_logs (user_id, message, type, created_at)
    SELECT
        lc.lender_id,
        CONCAT('EMI of ₹', rs.amount_due, ' is overdue for loan ', rs.loan_id),
        'EMI_OVERDUE',
        NOW()
    FROM repayment_schedules rs
    JOIN loan_contracts lc ON rs.loan_id = lc.id
    WHERE rs.status = 'OVERDUE'
      AND rs.due_date = CURRENT_DATE - INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 3. TRIGGER: Auto-update wallet balance on transaction
-- ============================================
CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tx_type = 'CREDIT' THEN
        UPDATE wallets
        SET current_balance = current_balance + NEW.amount,
            updated_at = NOW()
        WHERE id = NEW.wallet_id;
    ELSIF NEW.tx_type = 'DEBIT' THEN
        UPDATE wallets
        SET current_balance = current_balance - NEW.amount,
            updated_at = NOW()
        WHERE id = NEW.wallet_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: This trigger is commented out as we handle wallet updates in application code
-- to maintain transaction atomicity across multiple operations
-- CREATE TRIGGER trg_update_wallet_balance
-- AFTER INSERT ON wallet_transactions
-- FOR EACH ROW
-- EXECUTE FUNCTION update_wallet_balance();

-- ============================================
-- 4. STORED PROCEDURE: Calculate EMI
-- ============================================
CREATE OR REPLACE FUNCTION calculate_emi(
    p_principal DECIMAL,
    p_annual_rate DECIMAL,
    p_tenure_months INTEGER
)
RETURNS DECIMAL AS $$
DECLARE
    v_monthly_rate DECIMAL;
    v_emi DECIMAL;
BEGIN
    v_monthly_rate := p_annual_rate / 12 / 100;

    v_emi := (p_principal * v_monthly_rate * POWER(1 + v_monthly_rate, p_tenure_months)) /
             (POWER(1 + v_monthly_rate, p_tenure_months) - 1);

    RETURN ROUND(v_emi, 2);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. STORED PROCEDURE: Generate Repayment Schedule
-- ============================================
CREATE OR REPLACE FUNCTION generate_repayment_schedule(
    p_loan_id UUID,
    p_principal DECIMAL,
    p_annual_rate DECIMAL,
    p_tenure_months INTEGER,
    p_start_date DATE
)
RETURNS void AS $$
DECLARE
    v_emi DECIMAL;
    v_monthly_rate DECIMAL;
    v_balance DECIMAL;
    v_interest_component DECIMAL;
    v_principal_component DECIMAL;
    v_due_date DATE;
    i INTEGER;
BEGIN
    -- Calculate EMI
    v_emi := calculate_emi(p_principal, p_annual_rate, p_tenure_months);
    v_monthly_rate := p_annual_rate / 12 / 100;
    v_balance := p_principal;

    -- Generate schedule for each month
    FOR i IN 1..p_tenure_months LOOP
        v_interest_component := v_balance * v_monthly_rate;
        v_principal_component := v_emi - v_interest_component;
        v_due_date := p_start_date + (i || ' months')::INTERVAL;

        INSERT INTO repayment_schedules (
            id,
            loan_id,
            installment_number,
            due_date,
            amount_due,
            principal_component,
            interest_component,
            status,
            created_at
        ) VALUES (
            gen_random_uuid(),
            p_loan_id,
            i,
            v_due_date,
            v_emi,
            ROUND(v_principal_component, 2),
            ROUND(v_interest_component, 2),
            'PENDING',
            NOW()
        );

        v_balance := v_balance - v_principal_component;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. STORED PROCEDURE: Recalculate Credit Score
-- ============================================
CREATE OR REPLACE FUNCTION recalculate_credit_score(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_base_score INTEGER := 600;
    v_on_time_payments INTEGER;
    v_late_payments INTEGER;
    v_defaults INTEGER;
    v_new_score INTEGER;
BEGIN
    -- Get payment history
    SELECT
        on_time_payments,
        late_payments,
        defaults_count
    INTO
        v_on_time_payments,
        v_late_payments,
        v_defaults
    FROM credit_scores
    WHERE user_id = p_user_id;

    -- Calculate score
    -- +10 points for each on-time payment
    -- -20 points for each late payment
    -- -50 points for each default
    v_new_score := v_base_score
                   + (v_on_time_payments * 10)
                   - (v_late_payments * 20)
                   - (v_defaults * 50);

    -- Ensure score is between 300 and 850
    v_new_score := GREATEST(300, LEAST(850, v_new_score));

    -- Update credit score
    UPDATE credit_scores
    SET score = v_new_score,
        last_updated = NOW()
    WHERE user_id = p_user_id;

    RETURN v_new_score;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. STORED PROCEDURE: Disburse Loan
-- ============================================
CREATE OR REPLACE FUNCTION disburse_loan(
    p_application_id UUID,
    p_lender_id UUID
)
RETURNS UUID AS $$
DECLARE
    v_contract_id UUID;
    v_borrower_id UUID;
    v_principal DECIMAL;
    v_interest_rate DECIMAL;
    v_tenure_months INTEGER;
    v_processing_fee DECIMAL;
    v_start_date DATE;
    v_end_date DATE;
    v_borrower_wallet_id UUID;
    v_lender_wallet_id UUID;
    v_lender_balance DECIMAL;
BEGIN
    -- Get application details
    SELECT
        la.borrower_id,
        la.requested_amount,
        lp.interest_rate,
        lp.tenure_months,
        lp.processing_fee
    INTO
        v_borrower_id,
        v_principal,
        v_interest_rate,
        v_tenure_months,
        v_processing_fee
    FROM loan_applications la
    JOIN loan_products lp ON la.product_id = lp.id
    WHERE la.id = p_application_id;

    -- Check if application is approved
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Loan application not found or not approved';
    END IF;

    -- Get wallet IDs
    SELECT id INTO v_borrower_wallet_id
    FROM wallets WHERE user_id = v_borrower_id;

    SELECT id, current_balance INTO v_lender_wallet_id, v_lender_balance
    FROM wallets WHERE user_id = p_lender_id;

    -- Check lender balance
    IF v_lender_balance < (v_principal + v_processing_fee) THEN
        RAISE EXCEPTION 'Lender has insufficient balance';
    END IF;

    -- Set dates
    v_start_date := CURRENT_DATE;
    v_end_date := v_start_date + (v_tenure_months || ' months')::INTERVAL;

    -- Create loan contract
    v_contract_id := gen_random_uuid();
    INSERT INTO loan_contracts (
        id,
        application_id,
        lender_id,
        principal_amount,
        interest_rate,
        tenure_months,
        start_date,
        end_date,
        status,
        created_at
    ) VALUES (
        v_contract_id,
        p_application_id,
        p_lender_id,
        v_principal,
        v_interest_rate,
        v_tenure_months,
        v_start_date,
        v_end_date,
        'ACTIVE',
        NOW()
    );

    -- Generate repayment schedule
    PERFORM generate_repayment_schedule(
        v_contract_id,
        v_principal,
        v_interest_rate,
        v_tenure_months,
        v_start_date
    );

    -- Transfer funds
    -- Debit from lender
    UPDATE wallets
    SET current_balance = current_balance - (v_principal + v_processing_fee)
    WHERE id = v_lender_wallet_id;

    -- Credit to borrower
    UPDATE wallets
    SET current_balance = current_balance + v_principal
    WHERE id = v_borrower_wallet_id;

    -- Create wallet transactions
    INSERT INTO wallet_transactions (id, wallet_id, user_id, tx_type, amount, reference_type, reference_id, description, timestamp)
    VALUES
        (gen_random_uuid(), v_lender_wallet_id, p_lender_id, 'DEBIT', v_principal + v_processing_fee, 'LOAN_DISBURSAL', v_contract_id, 'Loan disbursed', NOW()),
        (gen_random_uuid(), v_borrower_wallet_id, v_borrower_id, 'CREDIT', v_principal, 'LOAN_DISBURSAL', v_contract_id, 'Loan received', NOW());

    -- Update credit score
    UPDATE credit_scores
    SET total_loans_taken = total_loans_taken + 1
    WHERE user_id = v_borrower_id;

    RETURN v_contract_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. COMPLEX QUERY: Get Loan Summary Report
-- ============================================
CREATE OR REPLACE FUNCTION get_loan_summary_report()
RETURNS TABLE (
    total_loans BIGINT,
    active_loans BIGINT,
    closed_loans BIGINT,
    defaulted_loans BIGINT,
    total_disbursed DECIMAL,
    total_repaid DECIMAL,
    pending_amount DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT AS total_loans,
        COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END)::BIGINT AS active_loans,
        COUNT(CASE WHEN status = 'CLOSED' THEN 1 END)::BIGINT AS closed_loans,
        COUNT(CASE WHEN status = 'DEFAULTED' THEN 1 END)::BIGINT AS defaulted_loans,
        COALESCE(SUM(principal_amount), 0) AS total_disbursed,
        COALESCE(SUM(CASE WHEN status = 'CLOSED' THEN principal_amount ELSE 0 END), 0) AS total_repaid,
        COALESCE(SUM(CASE WHEN status = 'ACTIVE' THEN principal_amount ELSE 0 END), 0) AS pending_amount
    FROM loan_contracts;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 9. COMPLEX QUERY: Get User Loan Profile
-- ============================================
CREATE OR REPLACE FUNCTION get_user_loan_profile(p_user_id UUID)
RETURNS TABLE (
    user_name TEXT,
    credit_score INTEGER,
    total_loans INTEGER,
    active_loans BIGINT,
    total_borrowed DECIMAL,
    total_repaid DECIMAL,
    pending_emis BIGINT,
    overdue_emis BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.name AS user_name,
        cs.score AS credit_score,
        cs.total_loans_taken AS total_loans,
        COUNT(CASE WHEN lc.status = 'ACTIVE' THEN 1 END)::BIGINT AS active_loans,
        COALESCE(SUM(lc.principal_amount), 0) AS total_borrowed,
        COALESCE(SUM(CASE WHEN rs.status = 'PAID' THEN rs.amount_due ELSE 0 END), 0) AS total_repaid,
        COUNT(CASE WHEN rs.status = 'PENDING' THEN 1 END)::BIGINT AS pending_emis,
        COUNT(CASE WHEN rs.status = 'OVERDUE' THEN 1 END)::BIGINT AS overdue_emis
    FROM users u
    LEFT JOIN credit_scores cs ON u.id = cs.user_id
    LEFT JOIN loan_applications la ON u.id = la.borrower_id
    LEFT JOIN loan_contracts lc ON la.id = lc.application_id
    LEFT JOIN repayment_schedules rs ON lc.id = rs.loan_id
    WHERE u.id = p_user_id
    GROUP BY u.name, cs.score, cs.total_loans_taken;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Usage Examples:
-- ============================================

-- Calculate EMI:
-- SELECT calculate_emi(10000, 12, 12);

-- Recalculate credit score for a user:
-- SELECT recalculate_credit_score('user-uuid-here');

-- Run overdue check:
-- SELECT run_overdue_check();

-- Get loan summary report:
-- SELECT * FROM get_loan_summary_report();

-- Get user loan profile:
-- SELECT * FROM get_user_loan_profile('user-uuid-here');
