# ProofChain

## AI-Powered Evidence Auditing for Accountable Decisions

ProofChain is an AI-powered claim-to-evidence auditing application that helps organizations, researchers, and decision-makers verify statements in reports, proposals, and AI-generated content.

It analyzes claims against provided evidence and identifies whether each claim is:

- ✅ Supported
- ⚠️ Partially Supported
- ❌ Contradicted
- 📄 No Evidence

## 🚀 Live Demo

https://proofchain-beta.vercel.app

---

# Problem

Reports and proposals often contain many claims that require verification. Manually checking every statement against source evidence is slow, difficult, and error-prone.

ProofChain automates this process by creating structured, evidence-grounded audits.

---

# Features

## 🔍 Claim Analysis

Extracts and evaluates individual claims from documents and reports.

## 🤖 AI Evidence Reasoning

Uses Google Gemini AI to compare claims against supplied evidence while following evidence-only reasoning rules.

## 📊 Deterministic Numeric Verification

Automatically verifies numerical claims using calculations instead of relying only on AI judgment.

Example:

Claim:
> Student participation increased by 60%

Evidence:
> 100 participants → 140 participants

Result:
> ❌ Contradicted

Actual increase:
> 40%

## 📋 Structured Audit Reports

Generates:

- Audit summary
- Claim-by-claim results
- Evidence excerpts
- Reasoning explanations
- Numeric verification details

---

# How It Works

```
User Input
    |
    ↓
Claims + Evidence Submitted
    |
    ↓
AI Claim Extraction
    |
    ↓
Gemini Evidence Analysis
    |
    ↓
Deterministic Verification Layer
    |
    ↓
Structured Audit Report
```

---

# Architecture

## Frontend

- Next.js
- React
- Tailwind CSS

## AI Layer

- Google Gemini API

## Verification Layer

- Evidence-grounded claim evaluation
- Numeric verification engine

## Deployment

- Vercel

---

# Example Audit

## Claim

"85% of all program participants reported improved confidence after training."

## Evidence

- Survey responses received: 200
- Improved confidence responses: 170
- Total participants: 500

## Result

❌ Contradicted

Reason:

85% applies only to survey respondents, not all participants.

Actual documented percentage:

34%

---

# Project Structure

```
proofchain/
│
├── app/
│   ├── api/
│   │   └── audit/
│   ├── page.js
│   └── layout.js
│
├── lib/
│   ├── audit-schema.js
│   ├── audit-prompt.js
│   └── numeric-verification.js
│
└── SPEC.md
```

---

# Getting Started Locally

Clone the repository:

```bash
git clone https://github.com/IrfanKhan154/proofchain.git
```

Install dependencies:

```bash
npm install
```

Create environment variables:

```
GEMINI_API_KEY=your_api_key_here
```

Run development server:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

# Future Improvements

- PDF and document upload support
- Multi-document evidence search
- User authentication
- Audit history storage
- Export reports as PDF
- Advanced RAG-based evidence retrieval

---

# Built With

- Next.js
- React
- Google Gemini AI
- Vercel
- JavaScript

---

# Author

Irfan Uddin

AI Engineer | Agentic AI Developer

GitHub:
https://github.com/IrfanKhan154