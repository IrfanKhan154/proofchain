# ProofChain

## AI-Powered Evidence Auditing for Accountable Decisions

ProofChain is an AI-powered claim-to-evidence auditing application that analyzes reports, proposals, and AI-generated content by comparing claims directly against supplied evidence.

It identifies what is:

- ✅ Supported
- ⚠️ Partially Supported
- ❌ Contradicted
- ❓ Missing Evidence

Live Demo:
https://proofchain-beta.vercel.app


## Problem

Organizations, researchers, and decision-makers often rely on reports containing many claims. Manually verifying every statement against source evidence is slow and error-prone.

ProofChain helps automate this process by creating structured, evidence-grounded audits.


## Features

### 🔍 Claim Analysis
Extracts and evaluates individual claims from documents.

### 🤖 AI Evidence Reasoning
Uses Gemini AI to compare claims against provided evidence while following strict evidence-only rules.

### 📊 Deterministic Numeric Verification
Automatically verifies numerical claims such as:

- Percentage changes
- Direct comparisons
- Reported statistics

Example:

Claim:
"Participation increased by 60%"

Evidence:
100 participants → 140 participants

Result:
Contradicted (actual increase: 40%)


### 📋 Structured Audit Reports

Generates:

- Audit summary
- Claim-by-claim results
- Evidence excerpts
- Reasoning
- Numeric verification details


## How It Works
