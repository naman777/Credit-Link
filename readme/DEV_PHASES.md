Nice, let’s turn this into a **clear roadmap** so you know *exactly* what to do, in what order, for both:

* **College / DBMS marks** (ERD, SQL, triggers, procedures)
* **Resume** (Next.js app with real features, manual SQL)

I’ll break it into **phases → steps → concrete deliverables**.

---

## 🔵 Phase 0 – Setup & Team Alignment

**Goal:** Everyone in the group knows the idea, roles, and tools.

1. **Finalize project name**

   * e.g. `LendWise – Micro-Lending & Credit Scoring Platform`.

2. **Decide tools**

   * Backend + frontend: **Next.js (TypeScript)**
   * DB: **MySQL** (raw SQL, triggers, stored procedures)
   * Node DB library: `mysql2`

3. **Create a GitHub repo**

   * `micro-lending-platform`
   * Branches: `main`, `backend`, `frontend`, `db`.

4. **Rough role split (4–5 members)**
   Example:

   * Member 1 – Requirements, ERD, docs.
   * Member 2 – DB schema, SQL scripts.
   * Member 3 – Procedures/triggers, credit score logic.
   * Member 4 – APIs in Next.js.
   * Member 5 – Frontend UI.

---

## 🟢 Phase 1 – Requirements & Use Cases (Paper/Docs Only)

**Goal:** Clear idea of what the system does.

1. Write **problem statement** (half–1 page):

   * What is micro-lending?
   * Who are your users? (borrower, lender, admin)
   * What problems you solve (peer loans, EMI tracking, credit scoring).

2. List **core features** (MVP):

   * User registration & login.
   * Wallet for each user (balance, transactions).
   * Create loan request (borrower).
   * Approve/disburse loan (admin/lender).
   * EMI schedule auto-generation.
   * EMI repayment.
   * Simple credit score update.
   * Basic reports (active loans, defaults, top borrowers).

3. Draw **main flows** (in words or simple diagrams):

   * Flow 1: Register → Login → Complete KYC.
   * Flow 2: Apply for loan → Admin approves → Money credited → EMIs generated.
   * Flow 3: Pay EMI → Wallet debited → EMI marked paid → Score updated.

**Deliverable:**
A small requirements document (will help in final project report too).

---

## 🟡 Phase 2 – ER Diagram Design (For MST Submission)

**Goal:** Complete ERD that covers all needed entities & relationships.

1. Decide entities (tables):
   At minimum:

   * `User`
   * `Wallet`
   * `Wallet_Transaction`
   * `Loan_Product`
   * `Loan_Application`
   * `Loan_Contract`
   * `Repayment_Schedule`
   * `Repayment_Transaction`
   * `Credit_Score`
   * `Notification_Log`
   * (Optional) `KYC_Document`

2. For each entity, define **attributes**:

   * Example `User`:

     * `user_id` (PK), `name`, `email`, `phone`, `password_hash`, `role`, `status`, `created_at`.

3. Define **relationships** with cardinality:

   * User 1–1 Wallet
   * User 1–N Wallet_Transaction
   * User 1–N Loan_Application
   * Loan_Application 1–1 Loan_Contract
   * Loan_Contract 1–N Repayment_Schedule
   * Repayment_Schedule 1–0/1 Repayment_Transaction
   * User 1–1 Credit_Score

4. Draw the ER Diagram in a tool:

   * Lucidchart / dbdiagram / draw.io / college tool.

**Deliverable for prof (before MST):**

* Final ER Diagram with entities, attributes, and relationships.

---

## 🟠 Phase 3 – Relational Schema & Normalization

**Goal:** Convert ERD to tables and ensure good DB design.

1. Convert ERD → **Relational schema**:

   * Write each table as:

     * `USER(user_id PK, name, email UNIQUE, phone, password_hash, role, status, created_at)`
     * `LOAN_APPLICATION(application_id PK, borrower_id FK, product_id FK, requested_amount, status, created_at, ...)`
     * etc.

2. Check **normalization**:

   * Make sure no repeating groups → 1NF.
   * No partial dependency (non-key depending on part of composite key) → 2NF.
   * No transitive dependency (A → B → C) → 3NF.

3. Decide **constraints**:

   * `CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'))`
   * Foreign keys with `ON DELETE RESTRICT` or `ON DELETE CASCADE` where needed.

**Deliverable:**

* A doc or section in report listing:

  * All tables with columns, PK, FK.
  * Short note on normalization.

---

## 🔴 Phase 4 – SQL Scripts (schema.sql, procedures.sql, triggers.sql)

**Goal:** Build the database fully with manual SQL.

### 4.1. `schema.sql` – Create All Tables

1. Write `CREATE DATABASE micro_lending_db;`
2. Write `CREATE TABLE` for every entity:

   * Include:

     * data types,
     * `PRIMARY KEY`,
     * `FOREIGN KEY`,
     * `UNIQUE`, `CHECK`, default values.
3. Execute the script in MySQL.

### 4.2. `seed.sql` – Dummy Data

1. Insert:

   * 3–4 users (borrowers, lenders, admin).
   * Few loan products.
   * Dummy wallets with some balance.

### 4.3. `procedures.sql` – Stored Procedures

Create at least:

1. `disburse_loan(application_id)`:

   * Check application status.
   * Create a row in `loan_contracts`.
   * Generate `repayment_schedule` rows.
   * Credit borrower’s wallet (insert `wallet_transaction`, update balance).
   * Set application to `APPROVED`.

2. `make_repayment(user_id, schedule_id, amount)`:

   * Check wallet balance & due amount.
   * Debit wallet.
   * Insert into `repayment_transactions`.
   * Update `repayment_schedule.status` to `PAID`.
   * Call `recalculate_credit_score(user_id)`.

3. `recalculate_credit_score(user_id)`:

   * Query count of on-time vs overdue/default EMIs.
   * Simple formula → update `credit_scores`.

### 4.4. `triggers.sql` – Triggers

At least:

1. **Overdue EMI Trigger (event-based or scheduled logic)**:

   * After update/insert on `repayment_schedule`:

     * If `due_date < CURRENT_DATE` and status still `PENDING` → set status `OVERDUE` and insert into `notification_log`.

2. **Wallet Balance Protection**:

   * BEFORE INSERT on `wallet_transactions`:

     * If `tx_type = 'DEBIT'` and `amount > wallet.current_balance` → prevent insert (signal error).

3. **Auto-init Credit Score**:

   * AFTER INSERT on `users`:

     * Insert default score row into `credit_scores` with base score.

**Deliverable:**

* These `.sql` files run without errors and create a working DB.

---

## 🟣 Phase 5 – Next.js Project Setup

**Goal:** Have a running Next.js + DB connection.

1. Create Next.js app:

```bash
npx create-next-app lendwise --typescript
cd lendwise
npm install mysql2 jsonwebtoken bcryptjs
npm install -D tailwindcss postcss autoprefixer
```

2. Setup Tailwind (init + config + import in `globals.css`).

3. Create `src/lib/db.ts` with MySQL pool and helper functions.

4. Add `.env.local`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=micro_lending_db
JWT_SECRET=supersecret
```

**Deliverable:**

* `npm run dev` works.
* You can log something from a test API route to confirm DB connection.

---

## 🟤 Phase 6 – Auth & User Management

**Goal:** Basic login/registration with DB.

1. **API routes:**

   * `POST /api/auth/register`

     * Validate input.
     * Hash password (bcrypt).
     * `INSERT INTO users (...)`.
   * `POST /api/auth/login`

     * Check credentials.
     * If ok, sign JWT with `user_id` + `role`.
     * Return token (or set HTTP-only cookie).

2. **Frontend pages:**

   * `/register` – form → calls register API.
   * `/login` – form → calls login API.

3. **Add auth utility** in `lib/auth.ts`:

   * `signToken(payload)`, `verifyToken(token)`.

**Deliverable:**

* New users can register and log in.
* You can see them in DB.

---

## 🧿 Phase 7 – Core Loan Lifecycle (Backend APIs)

**Goal:** Make the lending logic work end-to-end using your procedures.

1. **Apply for Loan – `POST /api/loans/apply`**

   * Auth required (borrower).
   * Request: `product_id`, `amount`.
   * `INSERT INTO loan_applications`.

2. **Admin Approves & Disburses – `POST /api/admin/approve-loan`**

   * Auth required (admin).
   * Body: `application_id`.
   * Calls `CALL disburse_loan(?);`.

3. **View Loans – `GET /api/loans`**

   * Auth required (borrower).
   * Returns joined data:
     -`loan_contracts` + `repayment_schedule` by borrower.

4. **Make Repayment – `POST /api/loans/repay`**

   * Auth required.
   * Body: `schedule_id`, `amount`.
   * Calls `CALL make_repayment(?, ?, ?);`.

**Deliverable:**

* From Postman, you can:

  * Apply loan → approve → get schedule → repay → see DB updates.

---

## ⚫ Phase 8 – Frontend Screens (User, Admin)

**Goal:** Make it usable for demo.

**Borrower side:**

1. Dashboard (`/` or `/dashboard`):

   * Show wallet balance, credit score, active loans.
2. Apply Loan (`/loans/apply`):

   * Form → calls `/api/loans/apply`.
3. Loan Details (`/loans`):

   * Cards/tables for each loan.
   * For each EMI: due date, amount, status, pay button.

**Admin side:**

1. Admin Dashboard (`/admin`):

   * List pending applications → “Approve” button → calls approve API.
   * List of all active/defaulted loans.

**Deliverable:**

* You can do a click-based full demo without touching Postman.

---

## 🔵 Phase 9 – Reports, Joins & Analytics (for DBMS Marks)

**Goal:** Show complex SQL + joins.

Add one page `/reports` (even admin-only) and some queries:

1. **Top N borrowers by on-time payments.**
2. **List of defaulted loans with borrower info.**
3. **Total lending volume per month.**

These will be `SELECT ... JOIN ... GROUP BY ...` queries, which your prof will like.

---

## 🟢 Phase 10 – Testing, Polish & Documentation

**Goal:** Make it presentable as a team DBMS project.

1. **Test scenarios:**

   * New borrower registers.
   * Applies for loan.
   * Admin approves.
   * Borrower pays EMIs on time and late.
   * See credit score change.

2. **Prepare documentation:**

   * Problem statement.
   * ER diagram.
   * Relational schema.
   * Normalization.
   * Screenshots of UI.
   * List of triggers & procedures (with explanation).
   * Module-wise member contributions.

3. **Prepare demo script:**

   * Who will speak what.
   * Which flow to show in 5–10 minutes.

---

If you want, next I can:
👉 help you write a **very concrete `schema.sql` skeleton** (all tables with columns + keys) that you and your team can directly refine and run.
