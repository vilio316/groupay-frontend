# GrouPay — CBN-Compliant KYC Flow

**Version 1.0 | May 2026**

---

## 1. Regulatory Framework

GrouPay operates under the Central Bank of Nigeria (CBN) regulatory framework for fintechs and payment service providers, specifically:

- **CBN Regulatory Framework for BVN (2014, updated 2022)**
- **CBN Tiered KYC Guidelines for Financial Inclusion (2013, revised 2023)**
- **CBN AML/CFT Regulations 2022**
- **NDPR (Nigeria Data Protection Regulation) 2019**
- **CBN Guidelines on Electronic Payment & Collection 2022**
- **FCCPC Consumer Protection Framework 2020**

---

## 2. CBN Account / Wallet Tiers

### Tier 1 — Basic (Self-Declaration)

| Attribute          | Limit                    |
| ------------------ | ------------------------ |
| Single deposit     | ₦50,000                  |
| Daily transaction  | ₦50,000                  |
| Cumulative balance | ₦300,000                 |
| Required           | Phone number + Name only |

### Tier 2 — Mid (Lite KYC)

| Attribute          | Limit             |
| ------------------ | ----------------- |
| Single deposit     | ₦200,000          |
| Daily transaction  | ₦200,000          |
| Cumulative balance | ₦500,000          |
| Required           | BVN + Tier 1 data |

### Tier 3 — Full (Enhanced KYC)

| Attribute          | Limit                                                               |
| ------------------ | ------------------------------------------------------------------- |
| Single deposit     | Unlimited                                                           |
| Daily transaction  | ₦5,000,000                                                          |
| Cumulative balance | Unlimited                                                           |
| Required           | BVN + Valid Government ID + Address Verification + Facial Biometric |

---

## 3. KYC Flow Steps

### Step 0 — Account Creation (Pre-KYC)

- Collect: Full name, email, phone, password
- Assign: Tier 1 wallet automatically
- Send OTP to phone (NIBSS / Termii)

### Step 1 — Phone Verification (OTP)

- 6-digit OTP sent via SMS
- OTP valid for 5 minutes, max 3 resends
- Provider: **Termii API** or **Twilio**
- On success: Tier 1 unlocked

### Step 2 — BVN Verification (Tier 2 unlock)

- User enters 11-digit BVN
- System validates via **NIBSS BVN API** (or **Prembly / YouVerify**)
- Data matched: name, date of birth, phone
- Liveness check: selfie vs BVN photo (optional at Tier 2)
- On success: Tier 2 unlocked

### Step 3 — Government ID Verification (Tier 3 unlock)

- Accepted IDs (per CBN): NIN Slip, Voter's Card, International Passport, Driver's Licence
- Document capture: front + back (JPEG/PDF, max 5MB)
- OCR extraction via **Prembly IdentityPass** or **Smile Identity**
- Manual fallback review queue (SLA: 24h)
- On success: proceed to Step 4

### Step 4 — Facial Biometric / Liveness Check

- Real-time selfie capture in-browser (WebRTC)
- Liveness detection: blink / head-turn prompt
- Face match against ID document photo + BVN photo
- Provider: **Smile Identity** or **Prembly**
- Confidence threshold: ≥ 80%
- On success: proceed to Step 5

### Step 5 — Address Verification

- User enters residential address
- Upload of utility bill / bank statement / tenancy agreement (≤ 3 months old)
- Document verification via **Prembly** or manual review
- On success: Tier 3 fully unlocked

### Step 6 — PEP & Sanctions Screening

- Automatic screening against:
  - OFAC SDN List
  - UN Sanctions List
  - CBN Watchlist
  - Nigerian EFCC watchlist
- Provider: **ComplyAdvantage** or **Smile Identity AML**
- Triggered: on BVN verification AND on Tier 3 completion
- Ongoing: periodic rescreening (weekly)

### Step 7 — KYC Review & Approval (Backend)

- All Tier 3 applications reviewed by compliance team dashboard
- Auto-approve if: ID confidence ≥ 90%, face match ≥ 85%, no PEP/sanctions hit
- Manual review if: any score below threshold
- User notified via email + in-app notification

---

## 4. APIs & Providers

| Function              | Primary API          | Fallback           |
| --------------------- | -------------------- | ------------------ |
| Phone OTP             | Termii               | Twilio             |
| BVN Verification      | NIBSS via Prembly    | YouVerify          |
| NIN Verification      | NIMC via Prembly     | Smile Identity     |
| Driver's Licence      | FRSC via Prembly     | YouVerify          |
| Voter's Card          | INEC via Prembly     | —                  |
| Int'l Passport        | NIS via Prembly      | —                  |
| Face Match / Liveness | Smile Identity       | Prembly            |
| Document OCR          | Prembly IdentityPass | Smile Identity     |
| Address Verification  | Prembly              | Manual review      |
| AML / PEP Screening   | ComplyAdvantage      | Smile Identity AML |
| Data Storage          | Encrypted S3 (AWS)   | —                  |

---

## 5. Data Security & Compliance

- All PII encrypted at rest (AES-256) and in transit (TLS 1.3)
- KYC documents stored in isolated encrypted S3 bucket, region: af-south-1
- Access logs for all KYC data access (NDPR Article 2.6)
- Right to erasure: supported within 30 days of account closure
- Data retention: 5 years post account closure (CBN AML/CFT Rule 5.3)
- Consent captured explicitly at each tier upgrade step

---

## 6. Edge Cases & Error Handling

| Scenario                    | Handling                                      |
| --------------------------- | --------------------------------------------- |
| BVN not found               | Retry prompt + support link                   |
| Name mismatch (BVN vs form) | User can update name OR submit dispute        |
| Face match fail (<80%)      | 2 retries, then manual review                 |
| ID expired                  | Reject + prompt alternative ID                |
| Sanctions hit               | Account frozen; compliance team alerted       |
| PEP detected                | Enhanced Due Diligence (EDD) triggered        |
| Document unreadable         | Re-upload prompt + quality guide              |
| Timeout / API failure       | Graceful error + retry with session preserved |
