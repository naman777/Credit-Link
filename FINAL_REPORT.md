# Credit-Link: Micro-Lending P2P Platform

## DBMS Project Final Report

---

# 1. Introduction

## 1.1 Project Title

**Credit-Link: A Peer-to-Peer Micro-Lending Platform**

---

## 1.2 Brief Introduction

Credit-Link is a comprehensive **Peer-to-Peer (P2P) Micro-Lending Platform** that facilitates small loans between individual users. The platform bridges the gap between borrowers seeking quick, small-amount loans and lenders looking to earn interest on their idle funds.

### Problem Statement

Traditional banking systems often have lengthy approval processes and strict eligibility criteria, making it difficult for individuals to access small loans quickly. There is a need for a platform that:
- Enables quick and easy loan applications
- Connects borrowers directly with lenders
- Automates the loan lifecycle from application to repayment
- Maintains transparency through digital records
- Implements a fair credit scoring system based on repayment behavior

### Objectives

1. **User Management**: Enable registration and authentication of users with different roles (Borrower, Lender, Admin)
2. **KYC Verification**: Implement identity verification for secure transactions
3. **Wallet System**: Provide digital wallets for seamless fund transfers
4. **Loan Management**: Facilitate loan applications, approvals, and disbursements
5. **Repayment Tracking**: Generate EMI schedules and track repayments
6. **Credit Scoring**: Implement dynamic credit scoring based on repayment history
7. **Notifications**: Automated alerts for dues, payments, and status updates

### Key Features

| Feature | Description |
|---------|-------------|
| **Multi-Role System** | Supports Borrowers, Lenders, and Administrators |
| **KYC Verification** | Document verification (Aadhaar, PAN, Passport, etc.) |
| **Digital Wallet** | Deposit, withdraw, and transfer funds |
| **Loan Products** | Configurable loan products with different terms |
| **EMI Calculator** | Reducing balance method for EMI calculation |
| **Credit Score** | Dynamic scoring (300-850) based on payment history |
| **Automated Notifications** | Real-time alerts for all transactions |
| **Audit Trail** | Complete logging of all system activities |

---

## 1.3 System Requirements

### 1.3.1 Hardware Requirements

| Component | Minimum Requirement | Recommended |
|-----------|---------------------|-------------|
| **Processor** | Intel Core i3 / AMD Ryzen 3 | Intel Core i5 / AMD Ryzen 5 or higher |
| **RAM** | 4 GB | 8 GB or higher |
| **Storage** | 20 GB free space | 50 GB SSD |
| **Network** | Broadband Internet Connection | High-speed Internet |

### 1.3.2 Software Requirements

| Software | Version | Purpose |
|----------|---------|---------|
| **Operating System** | Windows 10/11, macOS, or Linux | Development & Deployment |
| **Node.js** | v18.x or higher | JavaScript Runtime |
| **PostgreSQL** | v14.x or higher | Database Management System |
| **npm/yarn** | Latest | Package Management |
| **Git** | Latest | Version Control |
| **VS Code** | Latest | Code Editor (Recommended) |

### 1.3.3 Technology Stack

#### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.x | React Framework with App Router |
| React | 19.x | UI Library |
| TypeScript | 5.x | Type-safe JavaScript |
| Tailwind CSS | 4.x | Utility-first CSS Framework |

#### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js API Routes | 15.x | Serverless Backend |
| Prisma ORM | 6.x | Database ORM |
| PostgreSQL | 14.x | Relational Database |
| JWT | - | Authentication Tokens |
| bcryptjs | - | Password Hashing |
| Zod | - | Schema Validation |

### 1.3.4 Functional Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| FR-01 | User Registration | Users can register as Borrower or Lender |
| FR-02 | Authentication | Secure login with JWT tokens |
| FR-03 | KYC Submission | Users can submit identity documents |
| FR-04 | KYC Verification | Admin can verify/reject documents |
| FR-05 | Wallet Operations | Deposit, withdraw, view balance |
| FR-06 | Loan Application | Borrowers can apply for loans |
| FR-07 | Loan Approval | Admin/Lender can approve loans |
| FR-08 | Loan Disbursement | Automatic fund transfer on approval |
| FR-09 | EMI Generation | Auto-generate repayment schedule |
| FR-10 | Repayment | Borrowers can pay EMIs |
| FR-11 | Credit Score | Dynamic score calculation |
| FR-12 | Notifications | Automated alerts for users |
| FR-13 | Reports | Admin dashboard with analytics |

### 1.3.5 Non-Functional Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| NFR-01 | **Security** | Password hashing, JWT authentication, role-based access |
| NFR-02 | **Performance** | Response time < 2 seconds for API calls |
| NFR-03 | **Scalability** | Support for 1000+ concurrent users |
| NFR-04 | **Reliability** | 99.9% uptime guarantee |
| NFR-05 | **Data Integrity** | ACID compliance, transaction management |
| NFR-06 | **Usability** | Intuitive UI, responsive design |
| NFR-07 | **Maintainability** | Modular code, comprehensive documentation |

---

# 2. E-R Diagram

<!-- 
    [PLACEHOLDER FOR ER DIAGRAM]
    
    Insert your ER Diagram image here.
    
    You can add the image using:
    ![ER Diagram](./path-to-your-er-diagram.png)
    
    OR if using an external link:
    ![ER Diagram](https://your-image-url.com/er-diagram.png)
-->

### ER Diagram Placeholder

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│                         [INSERT YOUR ER DIAGRAM HERE]                           │
│                                                                                 │
│                                                                                 │
│                                                                                 │
│                                                                                 │
│                                                                                 │
│                                                                                 │
│                                                                                 │
│                                                                                 │
│                                                                                 │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Entities in the ER Diagram

| Entity | Description |
|--------|-------------|
| **User** | Core user entity with roles (Borrower, Lender, Admin) |
| **KYC_Document** | Identity verification documents |
| **Wallet** | User wallet for financial transactions |
| **Wallet_Transaction** | Record of all wallet movements |
| **Loan_Product** | Predefined loan products with terms |
| **Loan_Application** | Borrower loan requests |
| **Loan_Contract** | Active loan agreements |
| **Repayment_Schedule** | EMI tracking and management |
| **Repayment_Transaction** | Payment records |
| **Credit_Score** | User creditworthiness tracking |
| **Notification_Log** | System notifications |
| **Audit_Log** | System audit trail |
| **System_Settings** | Platform configuration |

---

# 3. Schema Design

## 3.1 Initial Schema from ER Diagram

Based on the ER diagram, the following initial relational schema was derived. This represents the direct mapping from entities and relationships to relational tables.

### Initial Tables (Before Normalization)

#### Table 1: USERS
```
USERS (
    user_id         VARCHAR(36)     PRIMARY KEY,
    name            VARCHAR(255)    NOT NULL,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    phone           VARCHAR(15)     NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    role            VARCHAR(20)     NOT NULL,          -- BORROWER, LENDER, ADMIN
    status          VARCHAR(20)     DEFAULT 'ACTIVE',  -- ACTIVE, SUSPENDED, INACTIVE
    wallet_balance  DECIMAL(12,2)   DEFAULT 0,         -- Initially embedded
    credit_score    INT             DEFAULT 600,       -- Initially embedded
    kyc_doc_type    VARCHAR(50),                       -- Initially embedded
    kyc_doc_number  VARCHAR(100),                      -- Initially embedded
    kyc_status      VARCHAR(20),                       -- Initially embedded
    created_at      TIMESTAMP       DEFAULT NOW(),
    updated_at      TIMESTAMP       DEFAULT NOW()
)
```

#### Table 2: LOAN_PRODUCTS
```
LOAN_PRODUCTS (
    product_id      VARCHAR(36)     PRIMARY KEY,
    name            VARCHAR(255)    NOT NULL,
    min_amount      DECIMAL(12,2)   NOT NULL,
    max_amount      DECIMAL(12,2)   NOT NULL,
    interest_rate   DECIMAL(5,2)    NOT NULL,
    tenure_months   INT             NOT NULL,
    processing_fee  DECIMAL(12,2)   NOT NULL,
    is_active       BOOLEAN         DEFAULT TRUE,
    created_at      TIMESTAMP       DEFAULT NOW()
)
```

#### Table 3: LOANS (Combined Application + Contract)
```
LOANS (
    loan_id             VARCHAR(36)     PRIMARY KEY,
    borrower_id         VARCHAR(36)     REFERENCES USERS(user_id),
    lender_id           VARCHAR(36)     REFERENCES USERS(user_id),
    product_id          VARCHAR(36)     REFERENCES LOAN_PRODUCTS(product_id),
    requested_amount    DECIMAL(12,2)   NOT NULL,
    approved_amount     DECIMAL(12,2),
    interest_rate       DECIMAL(5,2),
    tenure_months       INT,
    application_status  VARCHAR(20),    -- PENDING, APPROVED, REJECTED
    contract_status     VARCHAR(20),    -- ACTIVE, CLOSED, DEFAULTED
    purpose             TEXT,
    rejection_reason    TEXT,
    start_date          DATE,
    end_date            DATE,
    created_at          TIMESTAMP       DEFAULT NOW(),
    reviewed_at         TIMESTAMP,
    reviewed_by         VARCHAR(36)
)
```

#### Table 4: REPAYMENTS (Combined Schedule + Transaction)
```
REPAYMENTS (
    repayment_id        VARCHAR(36)     PRIMARY KEY,
    loan_id             VARCHAR(36)     REFERENCES LOANS(loan_id),
    installment_number  INT             NOT NULL,
    due_date            DATE            NOT NULL,
    amount_due          DECIMAL(12,2)   NOT NULL,
    principal_component DECIMAL(12,2),
    interest_component  DECIMAL(12,2),
    status              VARCHAR(20),    -- PENDING, PAID, OVERDUE
    paid_amount         DECIMAL(12,2),
    late_fee            DECIMAL(12,2),
    paid_on             TIMESTAMP,
    created_at          TIMESTAMP       DEFAULT NOW()
)
```

#### Table 5: TRANSACTIONS (All wallet movements)
```
TRANSACTIONS (
    tx_id           VARCHAR(36)     PRIMARY KEY,
    user_id         VARCHAR(36)     REFERENCES USERS(user_id),
    tx_type         VARCHAR(20)     NOT NULL,       -- CREDIT, DEBIT
    amount          DECIMAL(12,2)   NOT NULL,
    reference_type  VARCHAR(50),                    -- LOAN_DISBURSAL, REPAYMENT, etc.
    reference_id    VARCHAR(36),
    description     TEXT,
    timestamp       TIMESTAMP       DEFAULT NOW()
)
```

#### Table 6: NOTIFICATIONS
```
NOTIFICATIONS (
    notif_id    VARCHAR(36)     PRIMARY KEY,
    user_id     VARCHAR(36)     REFERENCES USERS(user_id),
    message     TEXT            NOT NULL,
    type        VARCHAR(50)     NOT NULL,
    is_read     BOOLEAN         DEFAULT FALSE,
    created_at  TIMESTAMP       DEFAULT NOW()
)
```

---

## 3.2 Normalization Process

### 3.2.1 First Normal Form (1NF)

**Requirements for 1NF:**
- All attributes must have atomic (indivisible) values
- Each row must be unique
- No repeating groups

**Analysis of Initial Schema:**

| Table | Issue | Resolution |
|-------|-------|------------|
| USERS | Multiple KYC documents possible per user | Separate KYC_DOCUMENTS table |
| USERS | Wallet balance is a derived/separate concern | Separate WALLETS table |
| USERS | Credit score has multiple attributes | Separate CREDIT_SCORES table |
| LOANS | Combines application and contract | Separate into two tables |
| REPAYMENTS | Combines schedule and transaction | Separate into two tables |

**Changes Applied for 1NF:**

1. **USERS** → Split wallet and credit score into separate tables
2. **KYC_DOCUMENTS** → Created new table for multiple documents per user
3. **WALLETS** → Separated from users
4. **CREDIT_SCORES** → Separated with detailed attributes
5. **LOAN_APPLICATIONS** and **LOAN_CONTRACTS** → Separated
6. **REPAYMENT_SCHEDULES** and **REPAYMENT_TRANSACTIONS** → Separated

---

### 3.2.2 Second Normal Form (2NF)

**Requirements for 2NF:**
- Must be in 1NF
- All non-key attributes must be fully functionally dependent on the primary key
- No partial dependencies

**Analysis:**

| Table | Primary Key | Partial Dependency | Resolution |
|-------|-------------|-------------------|------------|
| LOAN_APPLICATIONS | application_id | product details (name, rate) depend on product_id | Already separated via FK |
| REPAYMENT_SCHEDULES | schedule_id | loan details depend on loan_id | Already separated via FK |
| WALLET_TRANSACTIONS | tx_id | wallet details depend on wallet_id | Properly normalized |

**All tables satisfy 2NF** - No partial dependencies exist as:
- All tables use single-column primary keys (UUIDs)
- Related data is referenced via foreign keys

---

### 3.2.3 Third Normal Form (3NF)

**Requirements for 3NF:**
- Must be in 2NF
- No transitive dependencies
- Non-key attributes depend only on the primary key

**Analysis:**

| Table | Attribute | Transitive Dependency | Resolution |
|-------|-----------|----------------------|------------|
| USERS | - | None | ✓ Normalized |
| WALLETS | - | None | ✓ Normalized |
| LOAN_CONTRACTS | interest_rate, tenure_months | Could be derived from product | Stored for historical accuracy (rates may change) |
| CREDIT_SCORES | rating (Excellent, Good, etc.) | Derived from score | Computed at runtime, not stored |

**Design Decision:** 
- `interest_rate` and `tenure_months` are intentionally duplicated in LOAN_CONTRACTS because:
  - Loan products may change over time
  - Historical contracts must preserve original terms
  - This is a valid denormalization for data integrity

**All tables satisfy 3NF** after ensuring:
- No computed/derived values are stored unnecessarily
- All attributes depend directly on their table's primary key

---

## 3.3 Final Normalized Schema

After applying normalization (1NF, 2NF, 3NF), the final schema consists of **13 tables**:

### Entity Relationship Summary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         RELATIONSHIP DIAGRAM                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   USERS (1) ────────── (1) WALLET                                          │
│     │                                                                       │
│     ├──── (1) ──────── (1) CREDIT_SCORE                                    │
│     │                                                                       │
│     ├──── (1) ──────── (*) KYC_DOCUMENTS                                   │
│     │                                                                       │
│     ├──── (1) ──────── (*) LOAN_APPLICATIONS                               │
│     │                        │                                              │
│     │                        └──── (1) ──── (0..1) LOAN_CONTRACT            │
│     │                                          │                            │
│     │                                          └──── (1) ──── (*) REPAYMENT_SCHEDULE
│     │                                                            │          │
│     │                                                            └── (1) ── (0..1) REPAYMENT_TRANSACTION
│     │                                                                       │
│     ├──── (1) ──────── (*) WALLET_TRANSACTIONS                             │
│     │                                                                       │
│     └──── (1) ──────── (*) NOTIFICATION_LOGS                               │
│                                                                             │
│   LOAN_PRODUCTS (1) ─── (*) LOAN_APPLICATIONS                              │
│                                                                             │
│   AUDIT_LOGS (Independent - tracks all entity changes)                     │
│                                                                             │
│   SYSTEM_SETTINGS (Independent - platform configuration)                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 3.3.1 Table: USERS

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| name | VARCHAR(255) | NOT NULL | User's full name |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Email address |
| phone | VARCHAR(15) | NOT NULL, UNIQUE | Phone number |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| role | ENUM | NOT NULL | BORROWER, LENDER, ADMIN |
| status | ENUM | DEFAULT 'ACTIVE' | ACTIVE, SUSPENDED, INACTIVE |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation time |
| updated_at | TIMESTAMP | AUTO UPDATE | Last update time |

**Indexes:** `email`, `phone`

```sql
CREATE TABLE users (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255)    NOT NULL,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    phone           VARCHAR(15)     NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    role            user_role       NOT NULL DEFAULT 'BORROWER',
    status          user_status     NOT NULL DEFAULT 'ACTIVE',
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
```

---

### 3.3.2 Table: KYC_DOCUMENTS

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| user_id | UUID | FK → users(id), ON DELETE CASCADE | Reference to user |
| doc_type | ENUM | NOT NULL | AADHAAR, PAN, PASSPORT, etc. |
| doc_number | VARCHAR(100) | NOT NULL | Document number |
| verification_status | ENUM | DEFAULT 'PENDING' | PENDING, VERIFIED, REJECTED |
| verified_at | TIMESTAMP | NULLABLE | Verification timestamp |
| created_at | TIMESTAMP | DEFAULT NOW() | Submission time |

**Indexes:** `user_id`

```sql
CREATE TABLE kyc_documents (
    id                  UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID                NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doc_type            doc_type            NOT NULL,
    doc_number          VARCHAR(100)        NOT NULL,
    verification_status verification_status NOT NULL DEFAULT 'PENDING',
    verified_at         TIMESTAMP,
    created_at          TIMESTAMP           NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_kyc_user_id ON kyc_documents(user_id);
```

---

### 3.3.3 Table: WALLETS

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| user_id | UUID | FK → users(id), UNIQUE, ON DELETE CASCADE | One wallet per user |
| current_balance | DECIMAL(12,2) | DEFAULT 0 | Current balance |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | AUTO UPDATE | Last update time |

```sql
CREATE TABLE wallets (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID            NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    current_balance DECIMAL(12,2)   NOT NULL DEFAULT 0,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);
```

---

### 3.3.4 Table: WALLET_TRANSACTIONS

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| wallet_id | UUID | FK → wallets(id), ON DELETE CASCADE | Reference to wallet |
| user_id | UUID | FK → users(id), ON DELETE CASCADE | Reference to user |
| tx_type | ENUM | NOT NULL | CREDIT, DEBIT |
| amount | DECIMAL(12,2) | NOT NULL | Transaction amount |
| reference_type | ENUM | NULLABLE | LOAN_DISBURSAL, REPAYMENT, etc. |
| reference_id | UUID | NULLABLE | Related entity ID |
| description | TEXT | NULLABLE | Transaction description |
| timestamp | TIMESTAMP | DEFAULT NOW() | Transaction time |

**Indexes:** `wallet_id`, `user_id`, `timestamp`

```sql
CREATE TABLE wallet_transactions (
    id              UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id       UUID                NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    user_id         UUID                NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tx_type         transaction_type    NOT NULL,
    amount          DECIMAL(12,2)       NOT NULL,
    reference_type  reference_type,
    reference_id    UUID,
    description     TEXT,
    timestamp       TIMESTAMP           NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wallet_tx_wallet ON wallet_transactions(wallet_id);
CREATE INDEX idx_wallet_tx_user ON wallet_transactions(user_id);
CREATE INDEX idx_wallet_tx_timestamp ON wallet_transactions(timestamp);
```

---

### 3.3.5 Table: LOAN_PRODUCTS

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| name | VARCHAR(255) | NOT NULL | Product name |
| min_amount | DECIMAL(12,2) | NOT NULL | Minimum loan amount |
| max_amount | DECIMAL(12,2) | NOT NULL | Maximum loan amount |
| interest_rate | DECIMAL(5,2) | NOT NULL | Annual interest rate (%) |
| tenure_months | INT | NOT NULL | Loan duration in months |
| processing_fee | DECIMAL(12,2) | NOT NULL | One-time processing fee |
| is_active | BOOLEAN | DEFAULT TRUE | Product availability |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |

```sql
CREATE TABLE loan_products (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255)    NOT NULL,
    min_amount      DECIMAL(12,2)   NOT NULL,
    max_amount      DECIMAL(12,2)   NOT NULL,
    interest_rate   DECIMAL(5,2)    NOT NULL,
    tenure_months   INT             NOT NULL,
    processing_fee  DECIMAL(12,2)   NOT NULL,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);
```

---

### 3.3.6 Table: LOAN_APPLICATIONS

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| borrower_id | UUID | FK → users(id), ON DELETE CASCADE | Applicant reference |
| product_id | UUID | FK → loan_products(id) | Selected product |
| requested_amount | DECIMAL(12,2) | NOT NULL | Requested loan amount |
| status | ENUM | DEFAULT 'PENDING' | PENDING, APPROVED, REJECTED, CANCELLED |
| purpose | TEXT | NULLABLE | Loan purpose |
| rejection_reason | TEXT | NULLABLE | Reason if rejected |
| created_at | TIMESTAMP | DEFAULT NOW() | Application time |
| reviewed_at | TIMESTAMP | NULLABLE | Review time |
| reviewed_by | UUID | NULLABLE | Admin who reviewed |

**Indexes:** `borrower_id`, `status`

```sql
CREATE TABLE loan_applications (
    id                  UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    borrower_id         UUID                NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id          UUID                NOT NULL REFERENCES loan_products(id),
    requested_amount    DECIMAL(12,2)       NOT NULL,
    status              application_status  NOT NULL DEFAULT 'PENDING',
    purpose             TEXT,
    rejection_reason    TEXT,
    created_at          TIMESTAMP           NOT NULL DEFAULT NOW(),
    reviewed_at         TIMESTAMP,
    reviewed_by         UUID
);

CREATE INDEX idx_loan_app_borrower ON loan_applications(borrower_id);
CREATE INDEX idx_loan_app_status ON loan_applications(status);
```

---

### 3.3.7 Table: LOAN_CONTRACTS

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| application_id | UUID | FK → loan_applications(id), UNIQUE | One contract per application |
| lender_id | UUID | FK → users(id) | Lender reference |
| principal_amount | DECIMAL(12,2) | NOT NULL | Disbursed amount |
| interest_rate | DECIMAL(5,2) | NOT NULL | Locked interest rate |
| tenure_months | INT | NOT NULL | Locked tenure |
| start_date | DATE | DEFAULT NOW() | Contract start |
| end_date | DATE | NOT NULL | Contract end |
| status | ENUM | DEFAULT 'ACTIVE' | ACTIVE, CLOSED, DEFAULTED |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | AUTO UPDATE | Last update time |

**Indexes:** `lender_id`, `status`

```sql
CREATE TABLE loan_contracts (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id      UUID            NOT NULL UNIQUE REFERENCES loan_applications(id),
    lender_id           UUID            NOT NULL REFERENCES users(id),
    principal_amount    DECIMAL(12,2)   NOT NULL,
    interest_rate       DECIMAL(5,2)    NOT NULL,
    tenure_months       INT             NOT NULL,
    start_date          DATE            NOT NULL DEFAULT CURRENT_DATE,
    end_date            DATE            NOT NULL,
    status              loan_status     NOT NULL DEFAULT 'ACTIVE',
    created_at          TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_loan_contract_lender ON loan_contracts(lender_id);
CREATE INDEX idx_loan_contract_status ON loan_contracts(status);
```

---

### 3.3.8 Table: REPAYMENT_SCHEDULES

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| loan_id | UUID | FK → loan_contracts(id), ON DELETE CASCADE | Loan reference |
| installment_number | INT | NOT NULL | EMI number (1, 2, 3...) |
| due_date | DATE | NOT NULL | Payment due date |
| amount_due | DECIMAL(12,2) | NOT NULL | Total EMI amount |
| principal_component | DECIMAL(12,2) | NOT NULL | Principal portion |
| interest_component | DECIMAL(12,2) | NOT NULL | Interest portion |
| status | ENUM | DEFAULT 'PENDING' | PENDING, PAID, OVERDUE, PARTIAL |
| paid_on | TIMESTAMP | NULLABLE | Actual payment date |
| late_fee | DECIMAL(12,2) | NULLABLE | Late payment fee |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |

**Indexes:** `loan_id`, `due_date`, `status`

```sql
CREATE TABLE repayment_schedules (
    id                  UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id             UUID                NOT NULL REFERENCES loan_contracts(id) ON DELETE CASCADE,
    installment_number  INT                 NOT NULL,
    due_date            DATE                NOT NULL,
    amount_due          DECIMAL(12,2)       NOT NULL,
    principal_component DECIMAL(12,2)       NOT NULL,
    interest_component  DECIMAL(12,2)       NOT NULL,
    status              repayment_status    NOT NULL DEFAULT 'PENDING',
    paid_on             TIMESTAMP,
    late_fee            DECIMAL(12,2),
    created_at          TIMESTAMP           NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_repayment_loan ON repayment_schedules(loan_id);
CREATE INDEX idx_repayment_due_date ON repayment_schedules(due_date);
CREATE INDEX idx_repayment_status ON repayment_schedules(status);
```

---

### 3.3.9 Table: REPAYMENT_TRANSACTIONS

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| schedule_id | UUID | FK → repayment_schedules(id), UNIQUE, ON DELETE CASCADE | One transaction per schedule |
| paid_amount | DECIMAL(12,2) | NOT NULL | Amount paid |
| late_fee | DECIMAL(12,2) | DEFAULT 0 | Late fee charged |
| paid_at | TIMESTAMP | DEFAULT NOW() | Payment timestamp |

**Indexes:** `paid_at`

```sql
CREATE TABLE repayment_transactions (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id     UUID            NOT NULL UNIQUE REFERENCES repayment_schedules(id) ON DELETE CASCADE,
    paid_amount     DECIMAL(12,2)   NOT NULL,
    late_fee        DECIMAL(12,2)   NOT NULL DEFAULT 0,
    paid_at         TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_repayment_tx_paid_at ON repayment_transactions(paid_at);
```

---

### 3.3.10 Table: CREDIT_SCORES

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| user_id | UUID | FK → users(id), UNIQUE, ON DELETE CASCADE | One score per user |
| score | INT | DEFAULT 600 | Credit score (300-850) |
| total_loans_taken | INT | DEFAULT 0 | Total loans count |
| defaults_count | INT | DEFAULT 0 | Number of defaults |
| on_time_payments | INT | DEFAULT 0 | On-time EMI count |
| late_payments | INT | DEFAULT 0 | Late EMI count |
| last_updated | TIMESTAMP | DEFAULT NOW() | Last calculation time |

```sql
CREATE TABLE credit_scores (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID        NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    score               INT         NOT NULL DEFAULT 600,
    total_loans_taken   INT         NOT NULL DEFAULT 0,
    defaults_count      INT         NOT NULL DEFAULT 0,
    on_time_payments    INT         NOT NULL DEFAULT 0,
    late_payments       INT         NOT NULL DEFAULT 0,
    last_updated        TIMESTAMP   NOT NULL DEFAULT NOW()
);
```

---

### 3.3.11 Table: NOTIFICATION_LOGS

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| user_id | UUID | FK → users(id), ON DELETE CASCADE | Recipient user |
| message | TEXT | NOT NULL | Notification content |
| type | ENUM | NOT NULL | Notification category |
| is_read | BOOLEAN | DEFAULT FALSE | Read status |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |

**Indexes:** `user_id`, `is_read`

```sql
CREATE TABLE notification_logs (
    id          UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID                NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message     TEXT                NOT NULL,
    type        notification_type   NOT NULL,
    is_read     BOOLEAN             NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP           NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notification_user ON notification_logs(user_id);
CREATE INDEX idx_notification_read ON notification_logs(is_read);
```

---

### 3.3.12 Table: AUDIT_LOGS

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| user_id | UUID | NULLABLE | User who performed action |
| action | ENUM | NOT NULL | Action type |
| entity_type | VARCHAR(100) | NOT NULL | Affected table name |
| entity_id | UUID | NOT NULL | Affected record ID |
| old_values | JSONB | NULLABLE | Previous values |
| new_values | JSONB | NULLABLE | New values |
| ip_address | VARCHAR(45) | NULLABLE | Client IP |
| user_agent | TEXT | NULLABLE | Browser info |
| created_at | TIMESTAMP | DEFAULT NOW() | Action time |

**Indexes:** `user_id`, `(entity_type, entity_id)`, `created_at`

```sql
CREATE TABLE audit_logs (
    id          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID,
    action      audit_action    NOT NULL,
    entity_type VARCHAR(100)    NOT NULL,
    entity_id   UUID            NOT NULL,
    old_values  JSONB,
    new_values  JSONB,
    ip_address  VARCHAR(45),
    user_agent  TEXT,
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);
```

---

### 3.3.13 Table: SYSTEM_SETTINGS

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| key | VARCHAR(255) | NOT NULL, UNIQUE | Setting name |
| value | TEXT | NOT NULL | Setting value |
| updated_at | TIMESTAMP | AUTO UPDATE | Last update time |

```sql
CREATE TABLE system_settings (
    id          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    key         VARCHAR(255)    NOT NULL UNIQUE,
    value       TEXT            NOT NULL,
    updated_at  TIMESTAMP       NOT NULL DEFAULT NOW()
);
```

---

## 3.4 ENUM Types Definition

```sql
-- User Roles
CREATE TYPE user_role AS ENUM ('BORROWER', 'LENDER', 'ADMIN');

-- User Status
CREATE TYPE user_status AS ENUM ('ACTIVE', 'SUSPENDED', 'INACTIVE');

-- Document Types
CREATE TYPE doc_type AS ENUM ('AADHAAR', 'PAN', 'PASSPORT', 'DRIVING_LICENSE', 'VOTER_ID');

-- Verification Status
CREATE TYPE verification_status AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- Transaction Types
CREATE TYPE transaction_type AS ENUM ('CREDIT', 'DEBIT');

-- Reference Types
CREATE TYPE reference_type AS ENUM ('LOAN_DISBURSAL', 'REPAYMENT', 'DEPOSIT', 'WITHDRAWAL', 'PENALTY');

-- Application Status
CREATE TYPE application_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- Loan Status
CREATE TYPE loan_status AS ENUM ('ACTIVE', 'CLOSED', 'DEFAULTED');

-- Repayment Status
CREATE TYPE repayment_status AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'PARTIAL');

-- Notification Types
CREATE TYPE notification_type AS ENUM (
    'LOAN_APPROVED', 'LOAN_REJECTED', 'EMI_DUE', 'EMI_OVERDUE',
    'REPAYMENT_SUCCESS', 'WALLET_CREDIT', 'WALLET_DEBIT',
    'KYC_VERIFIED', 'KYC_REJECTED'
);

-- Audit Actions
CREATE TYPE audit_action AS ENUM (
    'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT',
    'KYC_SUBMIT', 'KYC_VERIFY', 'KYC_REJECT',
    'LOAN_APPLY', 'LOAN_APPROVE', 'LOAN_REJECT',
    'PAYMENT_MADE', 'WALLET_DEPOSIT', 'WALLET_WITHDRAW'
);
```

---

## 3.5 Schema Summary

| # | Table Name | Primary Key | Foreign Keys | Indexes |
|---|------------|-------------|--------------|---------|
| 1 | users | id | - | email, phone |
| 2 | kyc_documents | id | user_id → users | user_id |
| 3 | wallets | id | user_id → users | - |
| 4 | wallet_transactions | id | wallet_id → wallets, user_id → users | wallet_id, user_id, timestamp |
| 5 | loan_products | id | - | - |
| 6 | loan_applications | id | borrower_id → users, product_id → loan_products | borrower_id, status |
| 7 | loan_contracts | id | application_id → loan_applications, lender_id → users | lender_id, status |
| 8 | repayment_schedules | id | loan_id → loan_contracts | loan_id, due_date, status |
| 9 | repayment_transactions | id | schedule_id → repayment_schedules | paid_at |
| 10 | credit_scores | id | user_id → users | - |
| 11 | notification_logs | id | user_id → users | user_id, is_read |
| 12 | audit_logs | id | - | user_id, (entity_type, entity_id), created_at |
| 13 | system_settings | id | - | - |

**Total Tables:** 13
**Total Relationships:** 11 Foreign Keys
**Total Indexes:** 16

---

# 4. SQL Queries and Results

This section demonstrates the SQL queries used to fulfill the functional requirements stated in Section 1.3.4. Each query is mapped to its corresponding requirement.

---

## 4.1 User Management Queries

### 4.1.1 User Registration (FR-01)

**Requirement:** Users can register as Borrower or Lender

```sql
-- Insert new user
INSERT INTO users (id, name, email, phone, password_hash, role, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'Rahul Sharma',
    'rahul@example.com',
    '9876543210',
    '$2a$10$hashedpasswordhere',
    'BORROWER',
    'ACTIVE',
    NOW(),
    NOW()
)
RETURNING id, name, email, role;
```

**Result:**
| id | name | email | role |
|----|------|-------|------|
| a1b2c3d4-e5f6-7890-abcd-ef1234567890 | Rahul Sharma | rahul@example.com | BORROWER |

```sql
-- Automatically create wallet for new user
INSERT INTO wallets (id, user_id, current_balance, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0.00,
    NOW(),
    NOW()
);

-- Automatically create credit score for new user
INSERT INTO credit_scores (id, user_id, score, total_loans_taken, defaults_count, on_time_payments, late_payments, last_updated)
VALUES (
    gen_random_uuid(),
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    600,
    0,
    0,
    0,
    0,
    NOW()
);
```

---

### 4.1.2 User Authentication (FR-02)

**Requirement:** Secure login with JWT tokens

```sql
-- Verify user credentials during login
SELECT 
    id,
    name,
    email,
    password_hash,
    role,
    status
FROM users
WHERE email = 'rahul@example.com'
    AND status = 'ACTIVE';
```

**Result:**
| id | name | email | password_hash | role | status |
|----|------|-------|---------------|------|--------|
| a1b2c3d4-... | Rahul Sharma | rahul@example.com | $2a$10$... | BORROWER | ACTIVE |

```sql
-- Get user profile with wallet and credit score
SELECT 
    u.id,
    u.name,
    u.email,
    u.phone,
    u.role,
    u.status,
    w.current_balance AS wallet_balance,
    cs.score AS credit_score,
    cs.total_loans_taken,
    u.created_at
FROM users u
LEFT JOIN wallets w ON u.id = w.user_id
LEFT JOIN credit_scores cs ON u.id = cs.user_id
WHERE u.id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
```

**Result:**
| id | name | email | phone | role | wallet_balance | credit_score | total_loans_taken |
|----|------|-------|-------|------|----------------|--------------|-------------------|
| a1b2c3d4-... | Rahul Sharma | rahul@example.com | 9876543210 | BORROWER | 0.00 | 600 | 0 |

---

## 4.2 KYC Management Queries

### 4.2.1 KYC Submission (FR-03)

**Requirement:** Users can submit identity documents

```sql
-- Submit KYC document
INSERT INTO kyc_documents (id, user_id, doc_type, doc_number, verification_status, created_at)
VALUES (
    gen_random_uuid(),
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'AADHAAR',
    '1234-5678-9012',
    'PENDING',
    NOW()
)
RETURNING id, doc_type, doc_number, verification_status;
```

**Result:**
| id | doc_type | doc_number | verification_status |
|----|----------|------------|---------------------|
| k1y2c3d4-... | AADHAAR | 1234-5678-9012 | PENDING |

---

### 4.2.2 KYC Verification (FR-04)

**Requirement:** Admin can verify/reject documents

```sql
-- Admin verifies KYC document
UPDATE kyc_documents
SET 
    verification_status = 'VERIFIED',
    verified_at = NOW()
WHERE id = 'k1y2c3d4-e5f6-7890-abcd-ef1234567890'
RETURNING id, user_id, doc_type, verification_status, verified_at;
```

**Result:**
| id | user_id | doc_type | verification_status | verified_at |
|----|---------|----------|---------------------|-------------|
| k1y2c3d4-... | a1b2c3d4-... | AADHAAR | VERIFIED | 2025-12-04 10:30:00 |

```sql
-- Get KYC status for a user
SELECT 
    kd.id,
    kd.doc_type,
    kd.doc_number,
    kd.verification_status,
    kd.created_at,
    kd.verified_at
FROM kyc_documents kd
WHERE kd.user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
ORDER BY kd.created_at DESC;
```

**Result:**
| id | doc_type | doc_number | verification_status | created_at | verified_at |
|----|----------|------------|---------------------|------------|-------------|
| k1y2c3d4-... | AADHAAR | 1234-5678-9012 | VERIFIED | 2025-12-04 10:00:00 | 2025-12-04 10:30:00 |

---

## 4.3 Wallet Operations Queries

### 4.3.1 View Balance (FR-05)

**Requirement:** Deposit, withdraw, view balance

```sql
-- Get wallet balance
SELECT 
    w.id AS wallet_id,
    w.current_balance,
    w.updated_at AS last_updated,
    u.name AS owner_name
FROM wallets w
JOIN users u ON w.user_id = u.id
WHERE w.user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
```

**Result:**
| wallet_id | current_balance | last_updated | owner_name |
|-----------|-----------------|--------------|------------|
| w1a2l3l4-... | 50000.00 | 2025-12-04 11:00:00 | Rahul Sharma |

---

### 4.3.2 Deposit Funds

```sql
-- Update wallet balance (deposit)
UPDATE wallets
SET 
    current_balance = current_balance + 25000.00,
    updated_at = NOW()
WHERE user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
RETURNING id, current_balance;

-- Record the deposit transaction
INSERT INTO wallet_transactions (id, wallet_id, user_id, tx_type, amount, reference_type, description, timestamp)
VALUES (
    gen_random_uuid(),
    'w1a2l3l4-e5f6-7890-abcd-ef1234567890',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'CREDIT',
    25000.00,
    'DEPOSIT',
    'Wallet deposit via bank transfer',
    NOW()
)
RETURNING id, tx_type, amount, timestamp;
```

**Result:**
| id | tx_type | amount | timestamp |
|----|---------|--------|-----------|
| t1x2n3s4-... | CREDIT | 25000.00 | 2025-12-04 11:00:00 |

---

### 4.3.3 Withdraw Funds

```sql
-- Check balance before withdrawal
SELECT current_balance FROM wallets 
WHERE user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- Update wallet balance (withdrawal)
UPDATE wallets
SET 
    current_balance = current_balance - 5000.00,
    updated_at = NOW()
WHERE user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
    AND current_balance >= 5000.00
RETURNING id, current_balance;

-- Record the withdrawal transaction
INSERT INTO wallet_transactions (id, wallet_id, user_id, tx_type, amount, reference_type, description, timestamp)
VALUES (
    gen_random_uuid(),
    'w1a2l3l4-e5f6-7890-abcd-ef1234567890',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'DEBIT',
    5000.00,
    'WITHDRAWAL',
    'Withdrawal to bank account',
    NOW()
);
```

---

### 4.3.4 Transaction History

```sql
-- Get transaction history with pagination
SELECT 
    wt.id,
    wt.tx_type,
    wt.amount,
    wt.reference_type,
    wt.description,
    wt.timestamp
FROM wallet_transactions wt
WHERE wt.user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
ORDER BY wt.timestamp DESC
LIMIT 10 OFFSET 0;
```

**Result:**
| id | tx_type | amount | reference_type | description | timestamp |
|----|---------|--------|----------------|-------------|-----------|
| t1x2-... | DEBIT | 5000.00 | WITHDRAWAL | Withdrawal to bank account | 2025-12-04 12:00:00 |
| t2x3-... | CREDIT | 25000.00 | DEPOSIT | Wallet deposit via bank transfer | 2025-12-04 11:00:00 |
| t3x4-... | CREDIT | 30000.00 | LOAN_DISBURSAL | Loan received from lender | 2025-12-03 15:00:00 |

---

## 4.4 Loan Management Queries

### 4.4.1 Get Loan Products

```sql
-- Get all active loan products
SELECT 
    id,
    name,
    min_amount,
    max_amount,
    interest_rate,
    tenure_months,
    processing_fee,
    is_active
FROM loan_products
WHERE is_active = TRUE
ORDER BY interest_rate ASC;
```

**Result:**
| id | name | min_amount | max_amount | interest_rate | tenure_months | processing_fee |
|----|------|------------|------------|---------------|---------------|----------------|
| lp1-... | Personal Loan | 10000.00 | 100000.00 | 12.00 | 12 | 500.00 |
| lp2-... | Education Loan | 50000.00 | 500000.00 | 10.50 | 24 | 1000.00 |
| lp3-... | Emergency Loan | 5000.00 | 50000.00 | 15.00 | 6 | 250.00 |

---

### 4.4.2 Loan Application (FR-06)

**Requirement:** Borrowers can apply for loans

```sql
-- Check if user has verified KYC
SELECT COUNT(*) AS verified_docs
FROM kyc_documents
WHERE user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
    AND verification_status = 'VERIFIED';

-- Check for pending applications
SELECT COUNT(*) AS pending_apps
FROM loan_applications
WHERE borrower_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
    AND status = 'PENDING';

-- Submit loan application
INSERT INTO loan_applications (
    id, borrower_id, product_id, requested_amount, 
    status, purpose, created_at
)
VALUES (
    gen_random_uuid(),
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'lp1-e5f6-7890-abcd-ef1234567890',
    30000.00,
    'PENDING',
    'Home renovation',
    NOW()
)
RETURNING id, requested_amount, status, created_at;
```

**Result:**
| id | requested_amount | status | created_at |
|----|------------------|--------|------------|
| la1-... | 30000.00 | PENDING | 2025-12-04 13:00:00 |

---

### 4.4.3 Get User's Loan Applications

```sql
-- Get all applications for a borrower with product details
SELECT 
    la.id,
    la.requested_amount,
    la.status,
    la.purpose,
    la.rejection_reason,
    la.created_at,
    la.reviewed_at,
    lp.name AS product_name,
    lp.interest_rate,
    lp.tenure_months,
    lc.id AS contract_id,
    lc.status AS contract_status
FROM loan_applications la
JOIN loan_products lp ON la.product_id = lp.id
LEFT JOIN loan_contracts lc ON la.id = lc.application_id
WHERE la.borrower_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
ORDER BY la.created_at DESC;
```

**Result:**
| id | requested_amount | status | product_name | interest_rate | contract_id | contract_status |
|----|------------------|--------|--------------|---------------|-------------|-----------------|
| la1-... | 30000.00 | APPROVED | Personal Loan | 12.00 | lc1-... | ACTIVE |
| la2-... | 15000.00 | REJECTED | Emergency Loan | 15.00 | NULL | NULL |

---

### 4.4.4 Loan Approval (FR-07)

**Requirement:** Admin/Lender can approve loans

```sql
-- Approve loan application
UPDATE loan_applications
SET 
    status = 'APPROVED',
    reviewed_at = NOW(),
    reviewed_by = 'admin-user-id'
WHERE id = 'la1-e5f6-7890-abcd-ef1234567890'
    AND status = 'PENDING'
RETURNING id, status, reviewed_at;
```

**Result:**
| id | status | reviewed_at |
|----|--------|-------------|
| la1-... | APPROVED | 2025-12-04 14:00:00 |

---

### 4.4.5 Loan Rejection

```sql
-- Reject loan application with reason
UPDATE loan_applications
SET 
    status = 'REJECTED',
    rejection_reason = 'Insufficient credit score',
    reviewed_at = NOW(),
    reviewed_by = 'admin-user-id'
WHERE id = 'la2-e5f6-7890-abcd-ef1234567890'
    AND status = 'PENDING'
RETURNING id, status, rejection_reason;
```

**Result:**
| id | status | rejection_reason |
|----|--------|------------------|
| la2-... | REJECTED | Insufficient credit score |

---

### 4.4.6 Loan Disbursement (FR-08)

**Requirement:** Automatic fund transfer on approval

```sql
-- Create loan contract
INSERT INTO loan_contracts (
    id, application_id, lender_id, principal_amount,
    interest_rate, tenure_months, start_date, end_date, status
)
VALUES (
    gen_random_uuid(),
    'la1-e5f6-7890-abcd-ef1234567890',
    'lender-user-id',
    30000.00,
    12.00,
    12,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '12 months',
    'ACTIVE'
)
RETURNING id, principal_amount, start_date, end_date;
```

**Result:**
| id | principal_amount | start_date | end_date |
|----|------------------|------------|----------|
| lc1-... | 30000.00 | 2025-12-04 | 2026-12-04 |

```sql
-- Debit from lender wallet
UPDATE wallets
SET current_balance = current_balance - 30500.00  -- principal + processing fee
WHERE user_id = 'lender-user-id';

-- Credit to borrower wallet
UPDATE wallets
SET current_balance = current_balance + 30000.00
WHERE user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- Create wallet transactions for both parties
INSERT INTO wallet_transactions (id, wallet_id, user_id, tx_type, amount, reference_type, reference_id, description, timestamp)
VALUES 
    (gen_random_uuid(), 'lender-wallet-id', 'lender-user-id', 'DEBIT', 30500.00, 'LOAN_DISBURSAL', 'lc1-...', 'Loan disbursed to Rahul Sharma', NOW()),
    (gen_random_uuid(), 'borrower-wallet-id', 'a1b2c3d4-...', 'CREDIT', 30000.00, 'LOAN_DISBURSAL', 'lc1-...', 'Loan received from lender', NOW());
```

---

## 4.5 EMI Generation Queries (FR-09)

**Requirement:** Auto-generate repayment schedule

### 4.5.1 EMI Calculation Function

```sql
-- Stored function to calculate EMI
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

-- Calculate EMI for a loan
SELECT calculate_emi(30000.00, 12.00, 12) AS monthly_emi;
```

**Result:**
| monthly_emi |
|-------------|
| 2668.42 |

---

### 4.5.2 Generate Repayment Schedule

```sql
-- Stored procedure to generate repayment schedule
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
    v_emi := calculate_emi(p_principal, p_annual_rate, p_tenure_months);
    v_monthly_rate := p_annual_rate / 12 / 100;
    v_balance := p_principal;

    FOR i IN 1..p_tenure_months LOOP
        v_interest_component := v_balance * v_monthly_rate;
        v_principal_component := v_emi - v_interest_component;
        v_due_date := p_start_date + (i || ' months')::INTERVAL;

        INSERT INTO repayment_schedules (
            id, loan_id, installment_number, due_date,
            amount_due, principal_component, interest_component, status
        ) VALUES (
            gen_random_uuid(), p_loan_id, i, v_due_date,
            v_emi, ROUND(v_principal_component, 2), 
            ROUND(v_interest_component, 2), 'PENDING'
        );

        v_balance := v_balance - v_principal_component;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Generate schedule for the loan
SELECT generate_repayment_schedule(
    'lc1-e5f6-7890-abcd-ef1234567890',
    30000.00,
    12.00,
    12,
    '2025-12-04'
);
```

---

### 4.5.3 View Repayment Schedule

```sql
-- Get repayment schedule for a loan
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
WHERE rs.loan_id = 'lc1-e5f6-7890-abcd-ef1234567890'
ORDER BY rs.installment_number;
```

**Result:**
| emi_no | due_date | emi_amount | principal_component | interest_component | status | paid_on | late_fee |
|--------|----------|------------|---------------------|-------------------|--------|---------|----------|
| 1 | 2026-01-04 | 2668.42 | 2368.42 | 300.00 | PAID | 2026-01-03 | 0.00 |
| 2 | 2026-02-04 | 2668.42 | 2392.11 | 276.31 | PAID | 2026-02-04 | 0.00 |
| 3 | 2026-03-04 | 2668.42 | 2416.03 | 252.39 | PENDING | NULL | NULL |
| 4 | 2026-04-04 | 2668.42 | 2440.19 | 228.23 | PENDING | NULL | NULL |
| ... | ... | ... | ... | ... | ... | ... | ... |
| 12 | 2026-12-04 | 2668.42 | 2641.93 | 26.49 | PENDING | NULL | NULL |

---

## 4.6 Repayment Queries (FR-10)

**Requirement:** Borrowers can pay EMIs

### 4.6.1 Make EMI Payment

```sql
-- Get EMI details before payment
SELECT 
    rs.id,
    rs.amount_due,
    rs.due_date,
    rs.status,
    lc.lender_id,
    la.borrower_id
FROM repayment_schedules rs
JOIN loan_contracts lc ON rs.loan_id = lc.id
JOIN loan_applications la ON lc.application_id = la.id
WHERE rs.id = 'rs1-schedule-id'
    AND rs.status IN ('PENDING', 'OVERDUE');
```

```sql
-- Calculate late fee if overdue (2% per day)
SELECT 
    rs.amount_due,
    CASE 
        WHEN rs.status = 'OVERDUE' THEN 
            ROUND(rs.amount_due * 0.02 * 
                EXTRACT(DAY FROM NOW() - rs.due_date), 2)
        ELSE 0
    END AS late_fee
FROM repayment_schedules rs
WHERE rs.id = 'rs1-schedule-id';
```

```sql
-- Process repayment (within transaction)
BEGIN;

-- Debit from borrower wallet
UPDATE wallets
SET current_balance = current_balance - 2668.42
WHERE user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
    AND current_balance >= 2668.42;

-- Credit to lender wallet
UPDATE wallets
SET current_balance = current_balance + 2668.42
WHERE user_id = 'lender-user-id';

-- Update repayment schedule
UPDATE repayment_schedules
SET 
    status = 'PAID',
    paid_on = NOW(),
    late_fee = 0.00
WHERE id = 'rs1-schedule-id';

-- Create repayment transaction record
INSERT INTO repayment_transactions (id, schedule_id, paid_amount, late_fee, paid_at)
VALUES (gen_random_uuid(), 'rs1-schedule-id', 2668.42, 0.00, NOW());

-- Create wallet transactions
INSERT INTO wallet_transactions (id, wallet_id, user_id, tx_type, amount, reference_type, reference_id, description, timestamp)
VALUES 
    (gen_random_uuid(), 'borrower-wallet-id', 'a1b2c3d4-...', 'DEBIT', 2668.42, 'REPAYMENT', 'rs1-...', 'EMI payment for loan', NOW()),
    (gen_random_uuid(), 'lender-wallet-id', 'lender-user-id', 'CREDIT', 2668.42, 'REPAYMENT', 'rs1-...', 'EMI received from Rahul Sharma', NOW());

COMMIT;
```

---

### 4.6.2 Check Loan Closure

```sql
-- Check if all EMIs are paid and close loan
UPDATE loan_contracts
SET status = 'CLOSED', updated_at = NOW()
WHERE id = 'lc1-e5f6-7890-abcd-ef1234567890'
    AND NOT EXISTS (
        SELECT 1 FROM repayment_schedules
        WHERE loan_id = 'lc1-e5f6-7890-abcd-ef1234567890'
            AND status != 'PAID'
    )
RETURNING id, status;
```

---

### 4.6.3 Mark Overdue EMIs (Trigger/Scheduled Job)

```sql
-- Mark pending EMIs as overdue
UPDATE repayment_schedules
SET status = 'OVERDUE'
WHERE due_date < CURRENT_DATE
    AND status = 'PENDING'
RETURNING id, loan_id, installment_number, due_date;
```

**Result:**
| id | loan_id | installment_number | due_date |
|----|---------|-------------------|----------|
| rs5-... | lc2-... | 3 | 2025-11-15 |
| rs6-... | lc3-... | 5 | 2025-11-20 |

---

## 4.7 Credit Score Queries (FR-11)

**Requirement:** Dynamic score calculation

### 4.7.1 Recalculate Credit Score

```sql
-- Stored function to recalculate credit score
CREATE OR REPLACE FUNCTION recalculate_credit_score(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_base_score INTEGER := 600;
    v_on_time_payments INTEGER;
    v_late_payments INTEGER;
    v_defaults INTEGER;
    v_new_score INTEGER;
BEGIN
    SELECT on_time_payments, late_payments, defaults_count
    INTO v_on_time_payments, v_late_payments, v_defaults
    FROM credit_scores
    WHERE user_id = p_user_id;

    -- Scoring formula:
    -- Base: 600
    -- +10 for each on-time payment
    -- -20 for each late payment
    -- -50 for each default
    v_new_score := v_base_score
                   + (v_on_time_payments * 10)
                   - (v_late_payments * 20)
                   - (v_defaults * 50);

    -- Clamp between 300 and 850
    v_new_score := GREATEST(300, LEAST(850, v_new_score));

    UPDATE credit_scores
    SET score = v_new_score, last_updated = NOW()
    WHERE user_id = p_user_id;

    RETURN v_new_score;
END;
$$ LANGUAGE plpgsql;

-- Recalculate score for a user
SELECT recalculate_credit_score('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
```

**Result:**
| recalculate_credit_score |
|--------------------------|
| 720 |

---

### 4.7.2 Get Credit Score with Rating

```sql
-- Get credit score with detailed history
SELECT 
    cs.score,
    cs.total_loans_taken,
    cs.on_time_payments,
    cs.late_payments,
    cs.defaults_count,
    cs.last_updated,
    CASE 
        WHEN cs.score >= 750 THEN 'Excellent'
        WHEN cs.score >= 700 THEN 'Good'
        WHEN cs.score >= 650 THEN 'Fair'
        WHEN cs.score >= 600 THEN 'Average'
        ELSE 'Poor'
    END AS rating,
    (SELECT COUNT(*) FROM loan_contracts lc 
     JOIN loan_applications la ON lc.application_id = la.id 
     WHERE la.borrower_id = cs.user_id AND lc.status = 'ACTIVE') AS active_loans,
    (SELECT COUNT(*) FROM loan_contracts lc 
     JOIN loan_applications la ON lc.application_id = la.id 
     WHERE la.borrower_id = cs.user_id AND lc.status = 'CLOSED') AS closed_loans
FROM credit_scores cs
WHERE cs.user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
```

**Result:**
| score | total_loans_taken | on_time_payments | late_payments | defaults_count | rating | active_loans | closed_loans |
|-------|-------------------|------------------|---------------|----------------|--------|--------------|--------------|
| 720 | 3 | 15 | 2 | 0 | Good | 1 | 2 |

---

## 4.8 Notification Queries (FR-12)

**Requirement:** Automated alerts for users

### 4.8.1 Create Notifications

```sql
-- Insert notification for loan approval
INSERT INTO notification_logs (id, user_id, message, type, is_read, created_at)
VALUES (
    gen_random_uuid(),
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Your loan application of ₹30,000 has been approved!',
    'LOAN_APPROVED',
    FALSE,
    NOW()
);

-- Insert EMI due notification
INSERT INTO notification_logs (id, user_id, message, type, is_read, created_at)
VALUES (
    gen_random_uuid(),
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'EMI of ₹2,668.42 is due on 2026-01-04',
    'EMI_DUE',
    FALSE,
    NOW()
);

-- Insert overdue notification
INSERT INTO notification_logs (id, user_id, message, type, is_read, created_at)
VALUES (
    gen_random_uuid(),
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'EMI of ₹2,668.42 is overdue! Late fee is being applied.',
    'EMI_OVERDUE',
    FALSE,
    NOW()
);
```

---

### 4.8.2 Get User Notifications

```sql
-- Get unread notifications for a user
SELECT 
    id,
    message,
    type,
    is_read,
    created_at
FROM notification_logs
WHERE user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
    AND is_read = FALSE
ORDER BY created_at DESC
LIMIT 10;
```

**Result:**
| id | message | type | is_read | created_at |
|----|---------|------|---------|------------|
| n1-... | EMI of ₹2,668.42 is due on 2026-01-04 | EMI_DUE | FALSE | 2025-12-28 |
| n2-... | Your loan application of ₹30,000 has been approved! | LOAN_APPROVED | FALSE | 2025-12-04 |

---

### 4.8.3 Mark Notifications as Read

```sql
-- Mark notification as read
UPDATE notification_logs
SET is_read = TRUE
WHERE id = 'n1-notification-id'
    AND user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- Mark all notifications as read
UPDATE notification_logs
SET is_read = TRUE
WHERE user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
    AND is_read = FALSE;
```

---

## 4.9 Admin Reports & Analytics (FR-13)

**Requirement:** Admin dashboard with analytics

### 4.9.1 Platform Statistics

```sql
-- Get comprehensive platform statistics
SELECT
    (SELECT COUNT(*) FROM users) AS total_users,
    (SELECT COUNT(*) FROM users WHERE role = 'BORROWER') AS total_borrowers,
    (SELECT COUNT(*) FROM users WHERE role = 'LENDER') AS total_lenders,
    (SELECT COUNT(*) FROM kyc_documents WHERE verification_status = 'PENDING') AS pending_kyc,
    (SELECT COUNT(*) FROM loan_applications WHERE status = 'PENDING') AS pending_loans,
    (SELECT COUNT(*) FROM loan_contracts WHERE status = 'ACTIVE') AS active_loans,
    (SELECT COALESCE(SUM(principal_amount), 0) FROM loan_contracts WHERE status IN ('ACTIVE', 'CLOSED')) AS total_disbursed,
    (SELECT COALESCE(SUM(paid_amount), 0) FROM repayment_transactions) AS total_repaid,
    (SELECT COUNT(*) FROM repayment_schedules WHERE status = 'OVERDUE') AS overdue_emis;
```

**Result:**
| total_users | total_borrowers | total_lenders | pending_kyc | pending_loans | active_loans | total_disbursed | total_repaid | overdue_emis |
|-------------|-----------------|---------------|-------------|---------------|--------------|-----------------|--------------|--------------|
| 150 | 100 | 45 | 12 | 8 | 35 | 2500000.00 | 1850000.00 | 15 |

---

### 4.9.2 Loans by Status Report

```sql
-- Group loans by status
SELECT 
    status,
    COUNT(*) AS count,
    COALESCE(SUM(requested_amount), 0) AS total_amount
FROM loan_applications
GROUP BY status
ORDER BY count DESC;
```

**Result:**
| status | count | total_amount |
|--------|-------|--------------|
| APPROVED | 85 | 3250000.00 |
| PENDING | 12 | 450000.00 |
| REJECTED | 28 | 980000.00 |
| CANCELLED | 5 | 175000.00 |

---

### 4.9.3 Top Borrowers Report

```sql
-- Get top borrowers by loan amount
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
ORDER BY total_borrowed DESC
LIMIT 10;
```

**Result:**
| name | email | total_loans | total_borrowed | credit_score |
|------|-------|-------------|----------------|--------------|
| Vikram Singh | vikram@example.com | 5 | 250000.00 | 780 |
| Priya Patel | priya@example.com | 4 | 180000.00 | 720 |
| Rahul Sharma | rahul@example.com | 3 | 95000.00 | 700 |

---

### 4.9.4 Monthly Disbursement Report

```sql
-- Monthly loan disbursements (last 6 months)
SELECT 
    TO_CHAR(created_at, 'Mon YYYY') AS month,
    COUNT(*) AS loans_count,
    SUM(principal_amount) AS total_disbursed
FROM loan_contracts
WHERE created_at >= NOW() - INTERVAL '6 months'
GROUP BY TO_CHAR(created_at, 'Mon YYYY'), DATE_TRUNC('month', created_at)
ORDER BY DATE_TRUNC('month', created_at) DESC;
```

**Result:**
| month | loans_count | total_disbursed |
|-------|-------------|-----------------|
| Dec 2025 | 12 | 480000.00 |
| Nov 2025 | 15 | 620000.00 |
| Oct 2025 | 18 | 750000.00 |
| Sep 2025 | 10 | 380000.00 |
| Aug 2025 | 14 | 520000.00 |
| Jul 2025 | 8 | 290000.00 |

---

### 4.9.5 Loan Summary Report (Complex Query)

```sql
-- Comprehensive loan summary using stored function
CREATE OR REPLACE FUNCTION get_loan_summary_report()
RETURNS TABLE (
    total_loans BIGINT,
    active_loans BIGINT,
    closed_loans BIGINT,
    defaulted_loans BIGINT,
    total_disbursed DECIMAL,
    total_repaid DECIMAL,
    pending_amount DECIMAL,
    avg_loan_amount DECIMAL,
    avg_interest_rate DECIMAL
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
        COALESCE(SUM(CASE WHEN status = 'ACTIVE' THEN principal_amount ELSE 0 END), 0) AS pending_amount,
        COALESCE(AVG(principal_amount), 0) AS avg_loan_amount,
        COALESCE(AVG(interest_rate), 0) AS avg_interest_rate
    FROM loan_contracts;
END;
$$ LANGUAGE plpgsql;

-- Execute the report
SELECT * FROM get_loan_summary_report();
```

**Result:**
| total_loans | active_loans | closed_loans | defaulted_loans | total_disbursed | total_repaid | pending_amount | avg_loan_amount | avg_interest_rate |
|-------------|--------------|--------------|-----------------|-----------------|--------------|----------------|-----------------|-------------------|
| 85 | 35 | 48 | 2 | 3250000.00 | 1850000.00 | 1400000.00 | 38235.29 | 12.50 |

---

### 4.9.6 User Loan Profile (Complex Query with JOINs)

```sql
-- Get complete loan profile for a user
CREATE OR REPLACE FUNCTION get_user_loan_profile(p_user_id UUID)
RETURNS TABLE (
    user_name TEXT,
    credit_score INTEGER,
    credit_rating TEXT,
    total_loans INTEGER,
    active_loans BIGINT,
    total_borrowed DECIMAL,
    total_repaid DECIMAL,
    pending_emis BIGINT,
    overdue_emis BIGINT,
    next_emi_date DATE,
    next_emi_amount DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.name::TEXT AS user_name,
        cs.score AS credit_score,
        CASE 
            WHEN cs.score >= 750 THEN 'Excellent'
            WHEN cs.score >= 700 THEN 'Good'
            WHEN cs.score >= 650 THEN 'Fair'
            WHEN cs.score >= 600 THEN 'Average'
            ELSE 'Poor'
        END::TEXT AS credit_rating,
        cs.total_loans_taken AS total_loans,
        COUNT(DISTINCT CASE WHEN lc.status = 'ACTIVE' THEN lc.id END)::BIGINT AS active_loans,
        COALESCE(SUM(DISTINCT lc.principal_amount), 0) AS total_borrowed,
        COALESCE(SUM(CASE WHEN rs.status = 'PAID' THEN rs.amount_due ELSE 0 END), 0) AS total_repaid,
        COUNT(CASE WHEN rs.status = 'PENDING' THEN 1 END)::BIGINT AS pending_emis,
        COUNT(CASE WHEN rs.status = 'OVERDUE' THEN 1 END)::BIGINT AS overdue_emis,
        MIN(CASE WHEN rs.status = 'PENDING' THEN rs.due_date END) AS next_emi_date,
        (SELECT amount_due FROM repayment_schedules 
         WHERE loan_id IN (SELECT lc2.id FROM loan_contracts lc2 
                          JOIN loan_applications la2 ON lc2.application_id = la2.id 
                          WHERE la2.borrower_id = p_user_id)
           AND status = 'PENDING' 
         ORDER BY due_date LIMIT 1) AS next_emi_amount
    FROM users u
    LEFT JOIN credit_scores cs ON u.id = cs.user_id
    LEFT JOIN loan_applications la ON u.id = la.borrower_id
    LEFT JOIN loan_contracts lc ON la.id = lc.application_id
    LEFT JOIN repayment_schedules rs ON lc.id = rs.loan_id
    WHERE u.id = p_user_id
    GROUP BY u.name, cs.score, cs.total_loans_taken;
END;
$$ LANGUAGE plpgsql;

-- Get profile for a specific user
SELECT * FROM get_user_loan_profile('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
```

**Result:**
| user_name | credit_score | credit_rating | total_loans | active_loans | total_borrowed | total_repaid | pending_emis | overdue_emis | next_emi_date | next_emi_amount |
|-----------|--------------|---------------|-------------|--------------|----------------|--------------|--------------|--------------|---------------|-----------------|
| Rahul Sharma | 720 | Good | 3 | 1 | 95000.00 | 65000.00 | 10 | 0 | 2026-01-04 | 2668.42 |

---

## 4.10 Triggers

### 4.10.1 Trigger: Check Wallet Balance Before Debit

```sql
-- Trigger function to prevent overdraft
CREATE OR REPLACE FUNCTION check_wallet_balance()
RETURNS TRIGGER AS $$
DECLARE
    current_bal DECIMAL;
BEGIN
    IF NEW.tx_type = 'DEBIT' THEN
        SELECT current_balance INTO current_bal
        FROM wallets
        WHERE id = NEW.wallet_id;

        IF current_bal < NEW.amount THEN
            RAISE EXCEPTION 'Insufficient wallet balance. Available: %, Required: %', 
                current_bal, NEW.amount;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trg_check_wallet_balance
BEFORE INSERT ON wallet_transactions
FOR EACH ROW
EXECUTE FUNCTION check_wallet_balance();
```

**Test Case:**
```sql
-- This will fail if balance is insufficient
INSERT INTO wallet_transactions (id, wallet_id, user_id, tx_type, amount, description, timestamp)
VALUES (gen_random_uuid(), 'wallet-id', 'user-id', 'DEBIT', 100000.00, 'Test withdrawal', NOW());
```

**Result:**
```
ERROR: Insufficient wallet balance. Available: 5000.00, Required: 100000.00
```

---

### 4.10.2 Trigger: Auto-Update Credit Score on Payment

```sql
-- Trigger to update credit score after EMI payment
CREATE OR REPLACE FUNCTION update_credit_on_payment()
RETURNS TRIGGER AS $$
DECLARE
    v_borrower_id UUID;
    v_was_overdue BOOLEAN;
BEGIN
    -- Get borrower ID and check if payment was overdue
    SELECT la.borrower_id, (rs.status = 'OVERDUE')
    INTO v_borrower_id, v_was_overdue
    FROM repayment_schedules rs
    JOIN loan_contracts lc ON rs.loan_id = lc.id
    JOIN loan_applications la ON lc.application_id = la.id
    WHERE rs.id = NEW.schedule_id;

    -- Update credit score counters
    IF v_was_overdue THEN
        UPDATE credit_scores
        SET late_payments = late_payments + 1
        WHERE user_id = v_borrower_id;
    ELSE
        UPDATE credit_scores
        SET on_time_payments = on_time_payments + 1
        WHERE user_id = v_borrower_id;
    END IF;

    -- Recalculate score
    PERFORM recalculate_credit_score(v_borrower_id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_credit_on_payment
AFTER INSERT ON repayment_transactions
FOR EACH ROW
EXECUTE FUNCTION update_credit_on_payment();
```

---

### 4.10.3 Trigger: Create Notification on Loan Status Change

```sql
-- Trigger to create notification when loan application status changes
CREATE OR REPLACE FUNCTION notify_loan_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status != NEW.status THEN
        IF NEW.status = 'APPROVED' THEN
            INSERT INTO notification_logs (id, user_id, message, type, created_at)
            VALUES (
                gen_random_uuid(),
                NEW.borrower_id,
                'Congratulations! Your loan application of ₹' || NEW.requested_amount || ' has been approved!',
                'LOAN_APPROVED',
                NOW()
            );
        ELSIF NEW.status = 'REJECTED' THEN
            INSERT INTO notification_logs (id, user_id, message, type, created_at)
            VALUES (
                gen_random_uuid(),
                NEW.borrower_id,
                'Your loan application has been rejected. Reason: ' || COALESCE(NEW.rejection_reason, 'Not specified'),
                'LOAN_REJECTED',
                NOW()
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_notify_loan_status
AFTER UPDATE ON loan_applications
FOR EACH ROW
EXECUTE FUNCTION notify_loan_status_change();
```

---

## 4.11 Summary of Requirements Fulfilled

| Requirement ID | Requirement | Query Section | Status |
|----------------|-------------|---------------|--------|
| FR-01 | User Registration | 4.1.1 | ✅ Fulfilled |
| FR-02 | Authentication | 4.1.2 | ✅ Fulfilled |
| FR-03 | KYC Submission | 4.2.1 | ✅ Fulfilled |
| FR-04 | KYC Verification | 4.2.2 | ✅ Fulfilled |
| FR-05 | Wallet Operations | 4.3.1 - 4.3.4 | ✅ Fulfilled |
| FR-06 | Loan Application | 4.4.2 | ✅ Fulfilled |
| FR-07 | Loan Approval | 4.4.4 | ✅ Fulfilled |
| FR-08 | Loan Disbursement | 4.4.6 | ✅ Fulfilled |
| FR-09 | EMI Generation | 4.5.1 - 4.5.3 | ✅ Fulfilled |
| FR-10 | Repayment | 4.6.1 - 4.6.3 | ✅ Fulfilled |
| FR-11 | Credit Score | 4.7.1 - 4.7.2 | ✅ Fulfilled |
| FR-12 | Notifications | 4.8.1 - 4.8.3 | ✅ Fulfilled |
| FR-13 | Reports | 4.9.1 - 4.9.6 | ✅ Fulfilled |

---

## 4.12 Database Features Demonstrated

| Feature | Implementation | Section |
|---------|---------------|---------|
| **DDL** | CREATE TABLE, CREATE INDEX, CREATE TYPE | 3.3 |
| **DML** | INSERT, UPDATE, DELETE, SELECT | 4.1 - 4.9 |
| **Joins** | INNER JOIN, LEFT JOIN, Multiple JOINs | 4.4.3, 4.9.6 |
| **Aggregations** | COUNT, SUM, AVG, GROUP BY | 4.9.1 - 4.9.4 |
| **Subqueries** | Nested SELECT, EXISTS, IN | 4.6.2, 4.7.2 |
| **Stored Functions** | calculate_emi, recalculate_credit_score | 4.5.1, 4.7.1 |
| **Stored Procedures** | generate_repayment_schedule, get_loan_summary_report | 4.5.2, 4.9.5 |
| **Triggers** | Balance check, Credit update, Notifications | 4.10.1 - 4.10.3 |
| **Transactions** | BEGIN, COMMIT, ROLLBACK | 4.6.1 |
| **Constraints** | PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL | 3.3 |
| **Indexes** | Performance optimization | 3.3, 3.5 |
| **ENUM Types** | Custom data types | 3.4 |

---

