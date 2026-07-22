"use client";

import { useRef, useState } from "react";

const DEMO_AUDIT_TITLE = "Community Skills Program — 2026 Impact Report Audit";

const DEMO_CLAIMS_TEXT = `Community Skills Program — 2026 Impact Report

Our 2026 training initiative produced exceptional results across underserved communities.

Student participation increased by 60% compared with the previous year.

The post-program confidence survey received 200 responses.

The program reached 500 rural students.

85% of all program participants reported improved confidence after completing the training.

The program also significantly improved employment outcomes for participants.`;

const DEMO_EVIDENCE_TEXT = `Community Skills Program — Monitoring and Evaluation Records, 2026

Program enrollment records:
- 2025 participants: 100
- 2026 participants: 140

2026 participant location records:
- Total registered participants: 500
- Participants classified as rural: 320
- Participants classified as urban or other: 180

Post-program confidence survey:
- Survey responses received: 200
- 170 respondents reported improved confidence.
- The program had 500 registered participants in total.

Employment outcomes:
No post-program employment tracking data was collected during the 2026 reporting period.`;

export default function Home() {
  const formSectionRef = useRef(null);
  const resultsSectionRef = useRef(null);
  const auditTitleInputRef = useRef(null);

  const [auditTitle, setAuditTitle] = useState("");
  const [claimText, setClaimText] = useState("");
  const [evidenceText, setEvidenceText] = useState("");

  const [errors, setErrors] = useState({
    auditTitle: "",
    claimText: "",
    evidenceText: "",
  });
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [auditResult, setAuditResult] = useState(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [apiError, setApiError] = useState(null);

  const scrollToAuditForm = (focusTitle = false) => {
    if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (focusTitle) {
      window.setTimeout(() => {
        auditTitleInputRef.current?.focus();
      }, 350);
    }
  };

  const scrollToResults = () => {
    if (resultsSectionRef.current) {
      resultsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const formatConfidence = (confidence) => {
    if (typeof confidence !== "number" || Number.isNaN(confidence)) {
      return "N/A";
    }
    return `${Math.round(confidence * 100)}%`;
  };

  const formatVerdictLabel = (verdict) => {
    if (typeof verdict !== "string") {
      return "Unknown";
    }
    return verdict.replaceAll("_", " ");
  };

  const verdictClassName = (verdict) => {
    if (verdict === "SUPPORTED") {
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    }
    if (verdict === "PARTIALLY_SUPPORTED") {
      return "border-amber-200 bg-amber-50 text-amber-900";
    }
    if (verdict === "CONTRADICTED") {
      return "border-red-200 bg-red-50 text-red-800";
    }
    return "border-slate-300 bg-slate-100 text-slate-800";
  };

  const getSafeApiMessage = (errorCode) => {
    if (errorCode === "AI_TEMPORARILY_UNAVAILABLE") {
      return "The audit engine is temporarily busy. Please try again shortly.";
    }
    return "We couldn't complete this audit. Please try again.";
  };

  const formatNumericValue = (value, calculationType) => {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return "N/A";
    }

    if (calculationType === "PERCENT_CHANGE") {
      return `${value}%`;
    }

    return `${value}`;
  };

  const runAuditRequest = async () => {
    const payload = {
      auditTitle: auditTitle.trim(),
      claimText: claimText.trim(),
      evidenceText: evidenceText.trim(),
    };

    setIsAuditing(true);
    setApiError(null);
    setAuditResult(null);
    setFormStatus({ type: "", message: "" });

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        const errorCode = data?.error || "AUDIT_REQUEST_FAILED";
        setApiError({
          code: errorCode,
          message: getSafeApiMessage(errorCode),
        });
        return;
      }

      setAuditResult(data);
      setFormStatus({
        type: "success",
        message: "Audit complete. Review the claim-by-claim evidence analysis.",
      });

      window.setTimeout(() => {
        scrollToResults();
      }, 120);
    } catch {
      setApiError({
        code: "NETWORK_ERROR",
        message: "We couldn't complete this audit. Please try again.",
      });
    } finally {
      setIsAuditing(false);
    }
  };

  const handleTryDemo = () => {
    setAuditTitle(DEMO_AUDIT_TITLE);
    setClaimText(DEMO_CLAIMS_TEXT);
    setEvidenceText(DEMO_EVIDENCE_TEXT);
    setErrors({ auditTitle: "", claimText: "", evidenceText: "" });
    setAuditResult(null);
    setApiError(null);
    setFormStatus({ type: "", message: "" });
    scrollToAuditForm();
  };

  const handleStartNewAudit = () => {
    setAuditResult(null);
    setApiError(null);
    setFormStatus({ type: "", message: "" });
    scrollToAuditForm(true);
  };

  const handleAuditClaims = (event) => {
    event.preventDefault();

    const nextErrors = {
      auditTitle: auditTitle.trim() ? "" : "Audit Title is required.",
      claimText: claimText.trim() ? "" : "Claims / Document to Audit is required.",
      evidenceText: evidenceText.trim() ? "" : "Evidence Vault is required.",
    };

    setErrors(nextErrors);

    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (hasErrors) {
      setFormStatus({
        type: "error",
        message:
          "Please complete Audit Title, Claims / Document to Audit, and Evidence Vault before auditing.",
      });
      return;
    }

    runAuditRequest();
  };

  const handleRetryAudit = () => {
    const nextErrors = {
      auditTitle: auditTitle.trim() ? "" : "Audit Title is required.",
      claimText: claimText.trim() ? "" : "Claims / Document to Audit is required.",
      evidenceText: evidenceText.trim() ? "" : "Evidence Vault is required.",
    };

    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      setFormStatus({
        type: "error",
        message:
          "Please complete Audit Title, Claims / Document to Audit, and Evidence Vault before auditing.",
      });
      scrollToAuditForm(true);
      return;
    }

    runAuditRequest();
  };

  const hasStatusMessage = Boolean(formStatus.message);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-lg font-semibold tracking-tight text-slate-900">ProofChain</p>
            <p className="text-sm text-slate-600">
              Claim-to-evidence auditing for accountable decisions
            </p>
          </div>
          <p className="hidden rounded-full border border-slate-300 px-3 py-1 text-xs font-medium uppercase tracking-wider text-slate-700 sm:inline-flex">
            Audit Workspace
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="mb-3 inline-flex rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700">
            Main Audit Workspace
          </p>
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Audit claims against evidence. See what is supported, contradicted, or missing.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
            Run structured evidence audits on reports, proposals, and AI-generated content by
            comparing claims directly against your source material.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleTryDemo}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
            >
              Try Demo
            </button>
            <button
              type="button"
              onClick={handleStartNewAudit}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            >
              Start New Audit
            </button>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <article
            id="new-audit"
            ref={formSectionRef}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">New Evidence Audit</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Provide the claim content and source evidence. ProofChain will evaluate each
              verifiable claim only against the evidence entered here.
            </p>

            <form className="mt-6 space-y-5" aria-label="New Evidence Audit form" onSubmit={handleAuditClaims}>
              <div>
                <label htmlFor="audit-title" className="block text-sm font-medium text-slate-800">
                  Audit Title
                </label>
                <p className="mt-1 text-xs text-slate-500">
                  Name this audit so it is easy to identify in your audit history later.
                </p>
                <input
                  ref={auditTitleInputRef}
                  id="audit-title"
                  name="auditTitle"
                  type="text"
                  placeholder="Q3 Program Impact Report Audit"
                  value={auditTitle}
                  onChange={(event) => setAuditTitle(event.target.value)}
                  aria-invalid={Boolean(errors.auditTitle)}
                  aria-describedby={errors.auditTitle ? "audit-title-error" : undefined}
                  className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                />
                {errors.auditTitle ? (
                  <p id="audit-title-error" className="mt-2 text-sm font-medium text-red-700">
                    {errors.auditTitle}
                  </p>
                ) : null}
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                <label
                  htmlFor="claims-document"
                  className="block text-sm font-medium text-slate-800"
                >
                  Claims / Document to Audit
                </label>
                <p className="mt-1 text-xs text-slate-600">
                  Paste the report, proposal, or statements that contain the claims you want
                  verified.
                </p>
                <textarea
                  id="claims-document"
                  name="claimsDocument"
                  rows={9}
                  placeholder="Paste claim document text here..."
                  value={claimText}
                  onChange={(event) => setClaimText(event.target.value)}
                  aria-invalid={Boolean(errors.claimText)}
                  aria-describedby={errors.claimText ? "claims-document-error" : undefined}
                  className="mt-2 block w-full rounded-lg border border-blue-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                />
                {errors.claimText ? (
                  <p id="claims-document-error" className="mt-2 text-sm font-medium text-red-700">
                    {errors.claimText}
                  </p>
                ) : null}
              </div>

              <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4">
                <label htmlFor="evidence-vault" className="block text-sm font-medium text-slate-800">
                  Evidence Vault
                </label>
                <p className="mt-1 text-xs text-slate-600">
                  Paste the source material, records, or references that should support or
                  contradict the claims.
                </p>
                <textarea
                  id="evidence-vault"
                  name="evidenceVault"
                  rows={10}
                  placeholder="Paste evidence text here..."
                  value={evidenceText}
                  onChange={(event) => setEvidenceText(event.target.value)}
                  aria-invalid={Boolean(errors.evidenceText)}
                  aria-describedby={errors.evidenceText ? "evidence-vault-error" : undefined}
                  className="mt-2 block w-full rounded-lg border border-teal-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                />
                {errors.evidenceText ? (
                  <p id="evidence-vault-error" className="mt-2 text-sm font-medium text-red-700">
                    {errors.evidenceText}
                  </p>
                ) : null}
              </div>

              {hasStatusMessage ? (
                <div
                  role={formStatus.type === "error" ? "alert" : "status"}
                  aria-live={formStatus.type === "error" ? "assertive" : "polite"}
                  className={`rounded-lg border px-4 py-3 text-sm ${
                    formStatus.type === "error"
                      ? "border-red-200 bg-red-50 text-red-800"
                      : "border-slate-200 bg-slate-50 text-slate-700"
                  }`}
                >
                  {formStatus.message}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-slate-600">
                  ProofChain evaluates claims only against the evidence supplied in this audit.
                  AI outputs should be reviewed before high-stakes use.
                </p>
                <button
                  type="submit"
                  disabled={isAuditing}
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
                >
                  {isAuditing ? "Auditing Evidence..." : "Audit Claims"}
                </button>
              </div>
            </form>
          </article>

          <aside
            ref={resultsSectionRef}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">Audit Results</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This workspace will display structured claim-by-claim results after an audit runs.
            </p>

            <div className="sr-only" role="status" aria-live="polite">
              {isAuditing ? "Audit in progress." : ""}
            </div>

            {isAuditing ? (
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700"
                  />
                  <p className="text-sm font-medium text-slate-800">Auditing evidence...</p>
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  ProofChain is analyzing claims only against your supplied Evidence Vault.
                </p>
              </div>
            ) : null}

            {!isAuditing && apiError ? (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6">
                <p className="text-sm font-semibold text-red-800">Audit request failed</p>
                <p className="mt-2 text-sm text-red-700">{apiError.message}</p>
                <button
                  type="button"
                  onClick={handleRetryAudit}
                  className="mt-4 inline-flex h-10 items-center justify-center rounded-lg border border-red-300 bg-white px-4 text-sm font-semibold text-red-700 transition hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
                >
                  Retry Audit
                </button>
              </div>
            ) : null}

            {!isAuditing && !apiError && !auditResult ? (
              <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
                <p className="text-sm font-semibold text-slate-800">No audit has been run yet</p>
                <p className="mt-2 text-sm text-slate-600">
                  Submit an audit to view verdict summary, claim-level reasoning, evidence traces,
                  and deterministic numeric verification when available.
                </p>
              </div>
            ) : null}

            {!isAuditing && !apiError && auditResult ? (
              <div className="mt-6 space-y-6">
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                    Audit Summary
                  </h3>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Total Claims
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-slate-900">
                        {auditResult.summary?.totalClaims ?? 0}
                      </p>
                    </div>
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                        Supported
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-emerald-900">
                        {auditResult.summary?.supported ?? 0}
                      </p>
                    </div>
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">
                        Partially Supported
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-amber-950">
                        {auditResult.summary?.partiallySupported ?? 0}
                      </p>
                    </div>
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-red-800">
                        Contradicted
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-red-900">
                        {auditResult.summary?.contradicted ?? 0}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-300 bg-slate-100 p-4 sm:col-span-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                        No Evidence
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-slate-900">
                        {auditResult.summary?.noEvidence ?? 0}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                    Claim Results
                  </h3>

                  {Array.isArray(auditResult.claims) && auditResult.claims.length > 0 ? (
                    auditResult.claims.map((claim, index) => {
                      const numericCheck = claim.numericCheck || {};
                      const hasNumeric = numericCheck.applicable === true;
                      const calcType = numericCheck.calculationType || "";

                      return (
                        <article
                          key={claim.id || `${claim.claimText}-${index}`}
                          className="rounded-xl border border-slate-200 bg-white p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-slate-900">
                              Claim {index + 1} {claim.id ? `• ${claim.id}` : ""}
                            </p>
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${verdictClassName(claim.verdict)}`}
                            >
                              {formatVerdictLabel(claim.verdict)}
                            </span>
                          </div>

                          <p className="mt-3 text-sm leading-6 text-slate-900">{claim.claimText}</p>

                          <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-slate-700">
                            <span className="rounded-md border border-slate-300 bg-slate-50 px-2 py-1">
                              Type: {claim.claimType || "N/A"}
                            </span>
                            <span className="rounded-md border border-slate-300 bg-slate-50 px-2 py-1">
                              Confidence: {formatConfidence(claim.confidence)}
                            </span>
                          </div>

                          <section className="mt-4">
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                              Evidence Match
                            </h4>
                            <dl className="mt-2 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                              <div><dt className="inline font-medium text-slate-900">Supports: </dt><dd className="inline">{claim.evidenceMatch?.supporting || "No supporting evidence identified."}</dd></div>
                              <div><dt className="inline font-medium text-slate-900">Contradicts: </dt><dd className="inline">{claim.evidenceMatch?.contradicting || "No contradicting evidence identified."}</dd></div>
                              <div><dt className="inline font-medium text-slate-900">Missing: </dt><dd className="inline">{claim.evidenceMatch?.missing || "No additional information identified."}</dd></div>
                            </dl>
                          </section>

                          <section className="mt-4">
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                              Reasoning
                            </h4>
                            <p className="mt-1 text-sm leading-6 text-slate-700">{claim.reasoning}</p>
                          </section>

                          <section className="mt-4">
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                              Evidence
                            </h4>
                            {claim.evidenceExcerpt ? (
                              <blockquote className="mt-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-700">
                                {claim.evidenceExcerpt}
                              </blockquote>
                            ) : (
                              <p className="mt-1 text-sm text-slate-600">
                                No supporting or contradicting evidence was found in the supplied
                                Evidence Vault.
                              </p>
                            )}
                          </section>

                          {hasNumeric ? (
                            <section className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                                Numeric Verification
                              </h4>
                              <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-slate-700 sm:grid-cols-2">
                                <p>
                                  <span className="font-medium text-slate-900">Calculation Type:</span>{" "}
                                  {calcType ? calcType.replaceAll("_", " ") : "N/A"}
                                </p>
                                {typeof numericCheck.inputs?.previousValue === "number" ? (
                                  <p>
                                    <span className="font-medium text-slate-900">Previous value:</span>{" "}
                                    {numericCheck.inputs.previousValue}
                                  </p>
                                ) : null}
                                {typeof numericCheck.inputs?.currentValue === "number" ? (
                                  <p>
                                    <span className="font-medium text-slate-900">Current value:</span>{" "}
                                    {numericCheck.inputs.currentValue}
                                  </p>
                                ) : null}
                                {numericCheck.calculatedValue !== null &&
                                numericCheck.calculatedValue !== undefined ? (
                                  <p>
                                    <span className="font-medium text-slate-900">Calculated value:</span>{" "}
                                    {formatNumericValue(numericCheck.calculatedValue, calcType)}
                                  </p>
                                ) : null}
                                {numericCheck.claimedValue !== null &&
                                numericCheck.claimedValue !== undefined ? (
                                  <p>
                                    <span className="font-medium text-slate-900">Claimed value:</span>{" "}
                                    {formatNumericValue(numericCheck.claimedValue, calcType)}
                                  </p>
                                ) : null}
                                <p>
                                  <span className="font-medium text-slate-900">Result:</span>{" "}
                                  {numericCheck.matches === null
                                    ? "Not enough structured numeric inputs"
                                    : numericCheck.matches
                                      ? "Match"
                                      : "Mismatch"}
                                </p>
                              </div>
                            </section>
                          ) : null}
                        </article>
                      );
                    })
                  ) : (
                    <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                      No claims were returned for this audit.
                    </p>
                  )}
                </section>
              </div>
            ) : null}
          </aside>
        </section>
      </main>
    </div>
  );
}
