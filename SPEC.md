# ProofChain — Product Specification

## 1. Product Vision

ProofChain is an AI-powered claim-to-evidence auditing application.

It helps users answer one important question:

> "Does the evidence actually support what is being claimed?"

Users provide:
1. A document, report, article, proposal, or set of claims they want to audit.
2. Supporting evidence or source material that is supposed to justify those claims.

ProofChain uses AI to identify verifiable claims, trace them against the supplied evidence, and produce a structured audit showing what is supported, contradicted, only partially supported, or unsupported.

ProofChain is not a generic chatbot, summarizer, plagiarism detector, or fact-checker that searches the internet.

Its core purpose is evidence traceability.

---

## 2. Real-World Problem

Reports, research documents, proposals, presentations, AI-generated writing, and organizational documents often contain claims that appear credible but may:

- have no supporting evidence,
- exaggerate what a source actually says,
- misrepresent numerical evidence,
- omit important qualifications,
- or contradict the evidence being cited.

Manually checking every claim against supporting material is slow and difficult.

This problem affects:

- students and researchers reviewing academic work,
- NGOs checking reports and impact claims,
- journalists reviewing source-backed statements,
- analysts checking reports,
- teams reviewing AI-generated content,
- organizations reviewing evidence-based documents.

ProofChain makes the relationship between a claim and its evidence visible and auditable.

---

## 3. Core User Workflow

### Step 1 — Create an Audit

The user creates a new audit and enters:

- Audit title
- Claim document / text to audit
- Evidence / source text

For the MVP, pasted text is the primary supported input.

---

### Step 2 — AI Claim Extraction

The AI analyzes the claim document and extracts only meaningful, externally verifiable claims.

Examples:

- numerical claims,
- factual claims,
- comparative claims,
- causal claims,
- measurable outcome claims.

The AI should ignore:

- opinions,
- greetings,
- headings,
- purely subjective statements,
- obvious formatting text.

Each extracted claim receives a unique claim ID.

---

### Step 3 — Claim-to-Evidence Analysis

For each extracted claim, the AI searches only within the evidence supplied by the user.

Each claim receives one of four verdicts:

- SUPPORTED
- PARTIALLY_SUPPORTED
- CONTRADICTED
- NO_EVIDENCE

The system must never invent evidence.

Each verdict should contain:

- original claim,
- verdict,
- relevant evidence excerpt when available,
- concise reasoning,
- confidence level.

---

### Step 4 — Deterministic Numeric Verification

When a claim and its evidence contain comparable numerical values, deterministic JavaScript logic should verify the numbers where practical.

Example:

Claim:
"Program participation increased by 60%."

Evidence:
"Participation increased from 100 participants to 140."

Deterministic calculation:

((140 - 100) / 100) × 100 = 40%

Result:

CONTRADICTED

The AI performs semantic understanding.

Code performs mathematical verification where possible.

This hybrid AI + deterministic architecture is a core ProofChain feature.

---

### Step 5 — Prove It Dashboard

The audit results page displays:

- total claims audited,
- number supported,
- number partially supported,
- number contradicted,
- number with no evidence,
- an overall evidence coverage percentage.

Each claim appears as an audit card.

The user can inspect:

- the original claim,
- verdict,
- exact supporting or contradicting evidence excerpt,
- reasoning,
- numerical verification when applicable.

The interface should make it easy to answer:

"Show me exactly why ProofChain gave this verdict."

---

## 4. Core MVP Features

The final MVP must include:

1. Professional landing/dashboard interface
2. Create New Audit
3. Claim/document text input
4. Evidence Vault text input
5. AI-powered claim extraction
6. AI-powered claim-to-evidence matching
7. Four verdict classifications
8. Evidence excerpts for traceability
9. Reasoning/explanation for each verdict
10. Deterministic numerical verification where applicable
11. Audit summary dashboard
12. Claim-level "Prove It" inspection
13. Saved audit history using Supabase
14. Ability to reopen a previous audit
15. Demo/example audit for graders
16. Responsive and professional UI
17. Error and loading states

---

## 5. AI Feature

AI is essential to ProofChain.

The AI is responsible for:

- understanding natural-language documents,
- identifying verifiable claims,
- classifying claim types,
- finding semantically relevant evidence,
- determining the relationship between claim and evidence,
- generating concise reasoning.

The AI must NOT:

- invent missing evidence,
- search outside the evidence supplied by the user unless a future feature explicitly enables external verification,
- automatically treat similar wording as proof,
- perform deterministic arithmetic when code can verify it more reliably.

The model should return structured JSON that the application validates before displaying.

---

## 6. AI Safety and Reliability Rules

ProofChain must clearly communicate:

- AI analysis can make mistakes.
- A SUPPORTED verdict means supported by the evidence supplied to ProofChain, not universally proven true.
- NO_EVIDENCE means no sufficient evidence was found in the supplied material.
- Users should inspect original sources before making high-stakes decisions.

Evidence excerpts must be displayed whenever evidence is used for a verdict.

---

## 7. Technology Stack

### Frontend
- Next.js
- React
- JavaScript
- Tailwind CSS

### Backend
- Next.js Route Handlers / API routes

### AI
- Google Gemini API
- Structured JSON responses

The exact Gemini model should be selected based on currently available API models, reliability, structured-output support, speed, and cost.

Do not hard-code a deprecated model without verifying availability.

### Database
- Supabase
- PostgreSQL

Supabase will store persistent audit data.

### Deployment
- Vercel

### Version Control
- Git
- Public GitHub repository

---

## 8. Database Scope

For the MVP, Supabase should store:

### audits

- id
- title
- claim_text
- evidence_text
- summary/result data
- created_at

### claims

- id
- audit_id
- claim_text
- claim_type
- verdict
- evidence_excerpt
- reasoning
- confidence
- numeric_check data when applicable

Authentication is NOT required for the initial MVP unless all core functionality is already complete and stable.

The priority is a complete working product.

---

## 9. Demo Scenario

ProofChain must include a strong preloaded demo that immediately demonstrates its value.

Example:

Claim document:

"After launching the program, student participation increased by 60%. The program reached 500 rural students. Survey results showed that 85% of participants reported improved confidence."

Evidence:

"Participation increased from 100 students in 2025 to 140 students in 2026. Program attendance records show 500 registered students, of whom 320 were classified as rural. In the post-program survey, 85% of respondents reported increased confidence."

Expected audit:

Claim:
"Student participation increased by 60%."

Verdict:
CONTRADICTED

Why:
The evidence shows an increase from 100 to 140, which is a 40% increase, not 60%.

Claim:
"The program reached 500 rural students."

Verdict:
CONTRADICTED or PARTIALLY_SUPPORTED depending on exact interpretation.

Why:
Evidence shows 500 total registered students but only 320 classified as rural.

Claim:
"85% of participants reported improved confidence."

Verdict:
SUPPORTED or PARTIALLY_SUPPORTED with an important qualification.

Why:
The source says 85% of survey respondents, which may not mean 85% of all participants.

This demo should showcase semantic reasoning, numerical verification, and evidence traceability.

---

## 10. Professional UI Direction

ProofChain should look like a serious evidence-auditing product, not a student form or generic chatbot.

Suggested visual direction:

- clean professional dashboard,
- restrained typography,
- strong information hierarchy,
- clear verdict badges,
- evidence-focused cards,
- summary statistics,
- expandable claim inspection,
- generous spacing,
- responsive layout.

Verdict states:

- Supported
- Partially Supported
- Contradicted
- No Evidence

Do not rely only on color to communicate verdicts. Use labels and icons/text as well.

---

## 11. Scope We Will NOT Build Before Submission

Unless the entire MVP is already complete, tested, deployed, and documented, do NOT add:

- user authentication,
- payments,
- subscriptions,
- team collaboration,
- browser extensions,
- mobile apps,
- OCR,
- complex PDF parsing,
- live web fact-checking,
- vector databases,
- RAG infrastructure,
- multi-agent architecture,
- unnecessary animations,
- social features.

These are future possibilities, not MVP requirements.

---

## 12. Definition of Done

ProofChain is complete only when:

1. A grader can open the public live URL.
2. A grader can run the preloaded demo without setup.
3. A grader can enter their own claim text and evidence.
4. Gemini extracts and audits claims successfully.
5. Results clearly show claim-to-evidence relationships.
6. Numerical claims are deterministically checked where supported.
7. Evidence excerpts and explanations are visible.
8. Audits can be saved and reopened from Supabase.
9. Errors are handled gracefully.
10. No API keys exist in the public repository.
11. The GitHub repository is public.
12. The README contains:
   - app name and problem,
   - target users,
   - live URL,
   - complete feature list,
   - AI feature explanation,
   - system prompt/instructions,
   - architecture/technology stack,
   - 3+ screenshots,
   - local setup instructions.
13. The live application is tested in an incognito/private browser before submission.

---

## 13. Build Priority

Always prioritize in this order:

1. One complete end-to-end audit
2. Accurate AI structured output
3. Evidence traceability
4. Deterministic verification
5. Professional results UI
6. Database persistence
7. Error handling and testing
8. Deployment
9. README and screenshots
10. Optional polish

Never sacrifice completion for unnecessary features.