Perfect, that actually fits your DBMS goals nicely: **Next.js full-stack + pure SQL + stored procedures/triggers in DB**. No ORM, just you and the database 😈

I’ll give you a **very concrete plan**:

1. Final **tech stack** (locked-in).
2. Suggested **folder structure**.
3. How to handle **SQL, triggers, procedures** cleanly.
4. A **step-by-step roadmap** (what to do first, second, etc.).
5. A tiny **code sketch** so you see how raw SQL fits into Next.js.

---

## 1️⃣ Final Tech Stack (Aligned with your skills)

### Frontend + Backend (single codebase)

* **Framework:** Next.js (App Router) with **TypeScript**
* **UI:** Tailwind CSS (+ optional shadcn/ui for components)
* **Auth:** Custom JWT-based auth (login → get token → store in HTTP-only cookie or local storage)
* **API:** Next.js Route Handlers under `app/api/*` (these act as your backend)

### Database

* **DB:** MySQL 8 (great for: triggers, stored procedures, views)
* **Client:** [`mysql2`](https://www.npmjs.com/package/mysql2) package with **connection pool**
* **Everything via raw SQL:**

  * `CREATE TABLE ...`
  * `CREATE TRIGGER ...`
  * `CREATE PROCEDURE ...`
  * `CALL procedure_name(...)`
  * `SELECT ... JOIN ...` etc.

> For the DBMS course, you’ll **showcase**: ERD, schema, normalization, triggers, procedures, and manual SQL queries. No ORM anywhere.

---

## 2️⃣ Project Structure (High-Level)

Something like this:

```txt
project/
  sql/
    schema.sql          -- tables, constraints
    seed.sql            -- dummy data
    procedures.sql      -- stored procedures & functions
    triggers.sql        -- triggers
  src/
    lib/
      db.ts             -- mysql2 pool + helper function
      auth.ts           -- JWT helpers (sign, verify)
    app/
      layout.tsx
      page.tsx          -- dashboard / home
      login/
        page.tsx
      register/
        page.tsx
      loans/
        apply/page.tsx
        [loanId]/page.tsx
      admin/
        page.tsx
      api/
        auth/
          login/route.ts
          register/route.ts
        loans/
          apply/route.ts
          list/route.ts
          repay/route.ts
        admin/
          approve-loan/route.ts
          users/route.ts
```

* **All DB logic** in `db.ts` + SQL files.
* **UI + pages** in `app/`.
* **Business logic** in `/api/*` route handlers.

---

## 3️⃣ How You’ll Use SQL, Triggers & Procedures

### 3.1. `sql/schema.sql`

All your table definitions:

* `users`, `wallets`, `wallet_transactions`
* `loan_products`, `loan_applications`, `loan_contracts`
* `repayment_schedule`, `repayment_transactions`
* `credit_scores`, `notification_log`

You’ll run this once:

```bash
mysql -u root -p micro_lending_db < sql/schema.sql
```

---

### 3.2. `sql/procedures.sql`

Examples you’ll implement:

* `CREATE PROCEDURE disburse_loan(IN p_application_id INT) ...`
* `CREATE PROCEDURE make_repayment(IN p_user_id INT, IN p_schedule_id INT, IN p_amount DECIMAL(10,2)) ...`
* `CREATE PROCEDURE recalculate_credit_score(IN p_user_id INT) ...`

You then call them from Next.js like:

```ts
await pool.query('CALL disburse_loan(?)', [applicationId]);
```

---

### 3.3. `sql/triggers.sql`

Examples:

* When an EMI goes overdue → mark as OVERDUE + insert into `notification_log`.
* When `repayment_transactions` is inserted → update `repayment_schedule.status`, possibly call `recalculate_credit_score`.

Run this file once as well.

---

## 4️⃣ `lib/db.ts`: Single DB Helper (Raw SQL Only)

```ts
// src/lib/db.ts
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}

export async function callProcedure<T = any>(name: string, params: any[] = []): Promise<T[]> {
  const placeholders = params.map(() => "?").join(",");
  const [rows] = await pool.query(`CALL ${name}(${placeholders});`, params);
  // MySQL returns [ [rows], [meta] ] for CALL; pick first result set
  // @ts-ignore
  return rows[0] as T[];
}

export default pool;
```

You’ll use `query()` for simple selects/inserts and `callProcedure()` for your PL/SQL-style procedures in MySQL.

---

## 5️⃣ Roadmap: What You Should Do in Order

Think in **phases**:

---

### 🔹 Phase 1 – Pure DBMS / Theory Side (do this first)

1. **Freeze core features for MST**:

   * User registration & wallet
   * Loan apply → approve → disburse
   * Repayment + credit score update
2. **Design ER Diagram** (on paper or draw.io / dbdiagram etc.)

   * Use the entities we discussed earlier.
3. **Normalize** your tables (1NF → 2NF → 3NF).
4. Write:

   * `schema.sql` (tables + PK/FK + CHECK where needed)
   * `procedures.sql` (at least 3 meaningful procedures)
   * `triggers.sql` (2–3 non-trivial triggers)

This is what you’ll **submit before MST** (ERD especially).

---

### 🔹 Phase 2 – Set Up Next.js + DB Connection

1. Create a new Next.js app with TS:

```bash
npx create-next-app micro-lending --typescript
cd micro-lending
npm install mysql2 jsonwebtoken bcryptjs
npm install -D tailwindcss postcss autoprefixer
```

2. Configure Tailwind.

3. Add `.env.local`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=micro_lending_db
JWT_SECRET=supersecretkey
```

4. Add `src/lib/db.ts` as shown above.

---

### 🔹 Phase 3 – Auth + Basic Pages

1. **`users` table** in DB (from `schema.sql`).

2. API route: `POST /api/auth/register`

   * Hash password with `bcryptjs`
   * `INSERT INTO users (...) VALUES (...)`

3. API route: `POST /api/auth/login`

   * Check password
   * Generate JWT (with `JWT_SECRET`)
   * Send token back (cookie or JSON)

4. Frontend pages:

   * `/register` – form → POST to `/api/auth/register`
   * `/login` – form → POST to `/api/auth/login`

---

### 🔹 Phase 4 – Loan Flow (MVP)

Backend routes:

* `POST /api/loans/apply`

  * Inserts into `loan_applications`.
* `GET /api/loans` (for borrower)

  * `SELECT ... FROM loan_contracts JOIN repayment_schedule ... WHERE borrower_id = ?`
* `POST /api/admin/approve-loan`

  * Calls `CALL disburse_loan(?);`
* `POST /api/loans/repay`

  * Calls `CALL make_repayment(?, ?, ?);`

Frontend pages:

* `/loans/apply` – apply form.
* `/loans` – list all active loans + EMIs.
* `/admin` – simple list of pending applications + an Approve button.

---

### 🔹 Phase 5 – Credit Score & Reports

* API to fetch user’s credit score:

  * `GET /api/profile` → `SELECT * FROM credit_scores WHERE user_id = ?`
* Analytics queries (for report/demo):

  * Total defaults per user.
  * Top N good borrowers.
  * Loans status distribution.

These are **JOIN-heavy** and great to show your professor.

---

## 6️⃣ Tiny Example: One API Route Using Raw SQL

Example: get loans for logged-in user:

```ts
// src/app/api/loans/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyToken } from "@/lib/auth"; // you’ll write this

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token); // { userId: number }
    const userId = payload.userId;

    const loans = await query(
      `
      SELECT lc.loan_id, lc.principal_amount, lc.status,
             rs.schedule_id, rs.due_date, rs.amount_due, rs.status AS emi_status
      FROM loan_contracts lc
      JOIN repayment_schedule rs ON lc.loan_id = rs.loan_id
      WHERE lc.borrower_id = ?
      ORDER BY rs.due_date ASC
      `,
      [userId]
    );

    return NextResponse.json({ loans });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
```

That’s **pure SQL**, no ORM, and it hits the JOIN requirement nicely.

---

If you want, next we can:

* Draft a **minimal `schema.sql`** with all main tables & keys, or
* Design the **exact ERD table list** with attributes so you can directly draw it and submit it.
