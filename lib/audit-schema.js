export const CLAIM_TYPES = ["NUMERIC", "FINANCIAL", "PERFORMANCE", "TIMELINE", "GENERAL"];

export const VERDICTS = [
  "SUPPORTED",
  "PARTIALLY_SUPPORTED",
  "CONTRADICTED",
  "NO_EVIDENCE",
];

export const NUMERIC_CALCULATION_TYPES = ["PERCENT_CHANGE", "DIRECT_COMPARISON"];

const CLAIM_TYPE_SET = new Set(CLAIM_TYPES);
const VERDICT_SET = new Set(VERDICTS);
const NUMERIC_CALCULATION_TYPE_SET = new Set(NUMERIC_CALCULATION_TYPES);

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function pushError(errors, path, message) {
  errors.push({ path, message });
}

function validateNumericCheck(numericCheck, path, errors) {
  if (!isPlainObject(numericCheck)) {
    pushError(errors, path, "numericCheck must be an object.");
    return;
  }

  if (typeof numericCheck.applicable !== "boolean") {
    pushError(errors, `${path}.applicable`, "applicable must be a boolean.");
  }

  if (numericCheck.expression !== null && typeof numericCheck.expression !== "string") {
    pushError(errors, `${path}.expression`, "expression must be a string or null.");
  }

  if (
    numericCheck.expectedValue !== null &&
    (typeof numericCheck.expectedValue !== "number" || Number.isNaN(numericCheck.expectedValue))
  ) {
    pushError(errors, `${path}.expectedValue`, "expectedValue must be a number or null.");
  }

  if (
    numericCheck.claimedValue !== null &&
    (typeof numericCheck.claimedValue !== "number" || Number.isNaN(numericCheck.claimedValue))
  ) {
    pushError(errors, `${path}.claimedValue`, "claimedValue must be a number or null.");
  }

  if (numericCheck.matches !== null && typeof numericCheck.matches !== "boolean") {
    pushError(errors, `${path}.matches`, "matches must be a boolean or null.");
  }

  if (
    numericCheck.calculationType !== undefined &&
    numericCheck.calculationType !== null &&
    !NUMERIC_CALCULATION_TYPE_SET.has(numericCheck.calculationType)
  ) {
    pushError(
      errors,
      `${path}.calculationType`,
      `calculationType must be one of: ${NUMERIC_CALCULATION_TYPES.join(", ")} or null.`
    );
  }

  if (numericCheck.inputs !== undefined && numericCheck.inputs !== null) {
    if (!isPlainObject(numericCheck.inputs)) {
      pushError(errors, `${path}.inputs`, "inputs must be an object or null.");
    } else {
      if (
        numericCheck.inputs.previousValue !== undefined &&
        numericCheck.inputs.previousValue !== null &&
        (typeof numericCheck.inputs.previousValue !== "number" ||
          Number.isNaN(numericCheck.inputs.previousValue))
      ) {
        pushError(
          errors,
          `${path}.inputs.previousValue`,
          "inputs.previousValue must be a number or null."
        );
      }

      if (
        numericCheck.inputs.currentValue !== undefined &&
        numericCheck.inputs.currentValue !== null &&
        (typeof numericCheck.inputs.currentValue !== "number" ||
          Number.isNaN(numericCheck.inputs.currentValue))
      ) {
        pushError(
          errors,
          `${path}.inputs.currentValue`,
          "inputs.currentValue must be a number or null."
        );
      }
    }
  }

  if (
    numericCheck.calculatedValue !== undefined &&
    numericCheck.calculatedValue !== null &&
    (typeof numericCheck.calculatedValue !== "number" || Number.isNaN(numericCheck.calculatedValue))
  ) {
    pushError(errors, `${path}.calculatedValue`, "calculatedValue must be a number or null.");
  }

  if (
    numericCheck.applicable === false &&
    (numericCheck.expression !== null ||
      numericCheck.expectedValue !== null ||
      numericCheck.claimedValue !== null ||
      numericCheck.matches !== null)
  ) {
    pushError(
      errors,
      path,
      "When numericCheck.applicable is false, expression, expectedValue, claimedValue, and matches should all be null."
    );
  }

  if (
    numericCheck.applicable === false &&
    (numericCheck.calculationType !== undefined ||
      numericCheck.inputs !== undefined ||
      numericCheck.calculatedValue !== undefined) &&
    (numericCheck.calculationType !== null ||
      numericCheck.inputs !== null ||
      numericCheck.calculatedValue !== null)
  ) {
    pushError(
      errors,
      path,
      "When numericCheck.applicable is false, calculationType, inputs, and calculatedValue should be null when provided."
    );
  }
}

function validateClaim(claim, index, errors) {
  const path = `claims[${index}]`;

  if (!isPlainObject(claim)) {
    pushError(errors, path, "Each claim must be an object.");
    return;
  }

  if (!isNonEmptyString(claim.id)) {
    pushError(errors, `${path}.id`, "id must be a non-empty string.");
  }

  if (!isNonEmptyString(claim.claimText)) {
    pushError(errors, `${path}.claimText`, "claimText must be a non-empty string.");
  }

  if (!CLAIM_TYPE_SET.has(claim.claimType)) {
    pushError(
      errors,
      `${path}.claimType`,
      `claimType must be one of: ${CLAIM_TYPES.join(", ")}.`
    );
  }

  if (!VERDICT_SET.has(claim.verdict)) {
    pushError(errors, `${path}.verdict`, `verdict must be one of: ${VERDICTS.join(", ")}.`);
  }

  if (typeof claim.confidence !== "number" || Number.isNaN(claim.confidence)) {
    pushError(errors, `${path}.confidence`, "confidence must be a number between 0 and 1.");
  } else if (claim.confidence < 0 || claim.confidence > 1) {
    pushError(errors, `${path}.confidence`, "confidence must be between 0 and 1.");
  }

  // Invariant: evidenceExcerpt must be copied from user-supplied evidence only.
  // Future AI integration must never invent excerpts or pull external sources.
  if (claim.evidenceExcerpt !== null && typeof claim.evidenceExcerpt !== "string") {
    pushError(errors, `${path}.evidenceExcerpt`, "evidenceExcerpt must be a string or null.");
  }

  if (claim.verdict === "NO_EVIDENCE" && claim.evidenceExcerpt !== null) {
    pushError(
      errors,
      `${path}.evidenceExcerpt`,
      "NO_EVIDENCE claims should use null evidenceExcerpt."
    );
  }

  if (!isPlainObject(claim.evidenceMatch)) {
    pushError(errors, `${path}.evidenceMatch`, "evidenceMatch must be an object.");
  } else {
    for (const key of ["supporting", "contradicting", "missing"]) {
      if (!isNonEmptyString(claim.evidenceMatch[key])) {
        pushError(errors, `${path}.evidenceMatch.${key}`, `${key} must be a non-empty string.`);
      }
    }
  }

  if (!isNonEmptyString(claim.reasoning)) {
    pushError(errors, `${path}.reasoning`, "reasoning must be a non-empty string.");
  }

  if (!("numericCheck" in claim)) {
    pushError(
      errors,
      `${path}.numericCheck`,
      "numericCheck is required for every claim, even when applicable is false."
    );
  } else {
    validateNumericCheck(claim.numericCheck, `${path}.numericCheck`, errors);
  }
}

function validateSummary(summary, claims, errors) {
  const path = "summary";

  if (!isPlainObject(summary)) {
    pushError(errors, path, "summary must be an object.");
    return;
  }

  const requiredCounts = [
    "totalClaims",
    "supported",
    "partiallySupported",
    "contradicted",
    "noEvidence",
  ];

  for (const key of requiredCounts) {
    if (!Number.isInteger(summary[key]) || summary[key] < 0) {
      pushError(errors, `${path}.${key}`, `${key} must be a non-negative integer.`);
    }
  }

  if (!Array.isArray(claims)) {
    return;
  }

  const expected = {
    totalClaims: claims.length,
    supported: claims.filter((claim) => claim?.verdict === "SUPPORTED").length,
    partiallySupported: claims.filter((claim) => claim?.verdict === "PARTIALLY_SUPPORTED").length,
    contradicted: claims.filter((claim) => claim?.verdict === "CONTRADICTED").length,
    noEvidence: claims.filter((claim) => claim?.verdict === "NO_EVIDENCE").length,
  };

  for (const key of Object.keys(expected)) {
    if (summary[key] !== expected[key]) {
      pushError(
        errors,
        `${path}.${key}`,
        `${key} must be ${expected[key]} based on the claims array.`
      );
    }
  }
}

export function buildEmptyNumericCheck() {
  return {
    applicable: false,
    expression: null,
    expectedValue: null,
    claimedValue: null,
    matches: null,
    calculationType: null,
    inputs: null,
    calculatedValue: null,
  };
}

export function validateAuditResult(auditResult) {
  const errors = [];

  if (!isPlainObject(auditResult)) {
    pushError(errors, "auditResult", "Audit result must be an object.");
    return { valid: false, errors };
  }

  if (!isNonEmptyString(auditResult.auditTitle)) {
    pushError(errors, "auditTitle", "auditTitle must be a non-empty string.");
  }

  if (!Array.isArray(auditResult.claims)) {
    pushError(errors, "claims", "claims must be an array.");
  } else {
    auditResult.claims.forEach((claim, index) => {
      validateClaim(claim, index, errors);
    });
  }

  validateSummary(auditResult.summary, auditResult.claims, errors);

  return {
    valid: errors.length === 0,
    errors,
  };
}
