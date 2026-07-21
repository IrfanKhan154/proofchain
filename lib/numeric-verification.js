const DEFAULT_TOLERANCE = 0.01;

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function roundTo(value, places = 6) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function nearlyEqual(a, b, tolerance = DEFAULT_TOLERANCE) {
  return Math.abs(a - b) <= tolerance;
}

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function inferCalculationType(numericCheck) {
  if (numericCheck?.calculationType) {
    return numericCheck.calculationType;
  }

  const previousValue = numericCheck?.inputs?.previousValue;
  const currentValue = numericCheck?.inputs?.currentValue;
  if (isFiniteNumber(previousValue) && isFiniteNumber(currentValue)) {
    return "PERCENT_CHANGE";
  }

  if (isFiniteNumber(numericCheck?.expectedValue) && isFiniteNumber(numericCheck?.claimedValue)) {
    return "DIRECT_COMPARISON";
  }

  return null;
}

function buildDeterministicReasoningNote({ calculationType, previousValue, currentValue, calculatedValue, claimedValue, matches }) {
  if (calculationType === "PERCENT_CHANGE") {
    const matchText = matches ? "which matches" : "which does not match";
    return `Deterministic verification: evidence values ${previousValue} and ${currentValue} imply a ${calculatedValue}% change, ${matchText} the claimed ${claimedValue}% change.`;
  }

  if (calculationType === "DIRECT_COMPARISON") {
    const matchText = matches ? "matches" : "does not match";
    return `Deterministic verification: evidence value ${calculatedValue} ${matchText} the claimed value ${claimedValue}.`;
  }

  return null;
}

function normalizeNumericCheck(numericCheck) {
  const base = isObject(numericCheck) ? { ...numericCheck } : {};

  if (!("calculationType" in base)) {
    base.calculationType = null;
  }
  if (!("inputs" in base)) {
    base.inputs = null;
  }
  if (!("calculatedValue" in base)) {
    base.calculatedValue = null;
  }

  return base;
}

function verifyPercentChange(numericCheck, tolerance) {
  const previousValue = numericCheck?.inputs?.previousValue;
  const currentValue = numericCheck?.inputs?.currentValue;
  const claimedValue = numericCheck?.claimedValue;

  if (!isFiniteNumber(previousValue) || !isFiniteNumber(currentValue) || !isFiniteNumber(claimedValue)) {
    return {
      verified: false,
      numericCheck: {
        ...numericCheck,
        calculationType: "PERCENT_CHANGE",
        calculatedValue: null,
        matches: null,
      },
    };
  }

  if (previousValue === 0) {
    return {
      verified: false,
      numericCheck: {
        ...numericCheck,
        calculationType: "PERCENT_CHANGE",
        calculatedValue: null,
        matches: null,
      },
    };
  }

  const calculatedValue = roundTo(((currentValue - previousValue) / previousValue) * 100);
  const matches = nearlyEqual(calculatedValue, claimedValue, tolerance);

  const updatedNumericCheck = {
    ...numericCheck,
    applicable: true,
    calculationType: "PERCENT_CHANGE",
    expression: "((currentValue - previousValue) / previousValue) * 100",
    inputs: {
      previousValue,
      currentValue,
    },
    expectedValue: calculatedValue,
    calculatedValue,
    claimedValue,
    matches,
  };

  const reasoningNote = buildDeterministicReasoningNote({
    calculationType: "PERCENT_CHANGE",
    previousValue,
    currentValue,
    calculatedValue,
    claimedValue,
    matches,
  });

  return {
    verified: true,
    matches,
    updatedVerdict: matches ? "SUPPORTED" : "CONTRADICTED",
    reasoningNote,
    numericCheck: updatedNumericCheck,
  };
}

function verifyDirectComparison(numericCheck, tolerance) {
  const evidenceValue = isFiniteNumber(numericCheck?.calculatedValue)
    ? numericCheck.calculatedValue
    : isFiniteNumber(numericCheck?.expectedValue)
      ? numericCheck.expectedValue
      : isFiniteNumber(numericCheck?.inputs?.currentValue)
        ? numericCheck.inputs.currentValue
        : null;

  const claimedValue = numericCheck?.claimedValue;

  if (!isFiniteNumber(evidenceValue) || !isFiniteNumber(claimedValue)) {
    return {
      verified: false,
      numericCheck: {
        ...numericCheck,
        calculationType: "DIRECT_COMPARISON",
        calculatedValue: null,
        matches: null,
      },
    };
  }

  const calculatedValue = roundTo(evidenceValue);
  const matches = nearlyEqual(calculatedValue, claimedValue, tolerance);

  const updatedNumericCheck = {
    ...numericCheck,
    applicable: true,
    calculationType: "DIRECT_COMPARISON",
    expression: "evidenceValue == claimedValue",
    expectedValue: calculatedValue,
    calculatedValue,
    claimedValue,
    matches,
  };

  const reasoningNote = buildDeterministicReasoningNote({
    calculationType: "DIRECT_COMPARISON",
    calculatedValue,
    claimedValue,
    matches,
  });

  return {
    verified: true,
    matches,
    updatedVerdict: matches ? "SUPPORTED" : "CONTRADICTED",
    reasoningNote,
    numericCheck: updatedNumericCheck,
  };
}

function recomputeSummary(claims) {
  return {
    totalClaims: claims.length,
    supported: claims.filter((claim) => claim.verdict === "SUPPORTED").length,
    partiallySupported: claims.filter((claim) => claim.verdict === "PARTIALLY_SUPPORTED").length,
    contradicted: claims.filter((claim) => claim.verdict === "CONTRADICTED").length,
    noEvidence: claims.filter((claim) => claim.verdict === "NO_EVIDENCE").length,
  };
}

function appendReasoning(baseReasoning, note) {
  if (!note) {
    return baseReasoning;
  }

  const trimmed = (baseReasoning || "").trim();
  if (!trimmed) {
    return note;
  }

  if (trimmed.includes(note)) {
    return trimmed;
  }

  return `${trimmed} ${note}`;
}

export function applyDeterministicNumericVerification(auditResult, options = {}) {
  const tolerance = isFiniteNumber(options.tolerance) ? options.tolerance : DEFAULT_TOLERANCE;

  const nextClaims = (auditResult?.claims || []).map((claim) => {
    const nextClaim = { ...claim };
    const normalizedNumericCheck = normalizeNumericCheck(nextClaim.numericCheck);
    nextClaim.numericCheck = normalizedNumericCheck;

    if (!normalizedNumericCheck.applicable) {
      return nextClaim;
    }

    const calculationType = inferCalculationType(normalizedNumericCheck);
    if (!calculationType) {
      return nextClaim;
    }

    let verification;
    if (calculationType === "PERCENT_CHANGE") {
      verification = verifyPercentChange(normalizedNumericCheck, tolerance);
    } else if (calculationType === "DIRECT_COMPARISON") {
      verification = verifyDirectComparison(normalizedNumericCheck, tolerance);
    } else {
      nextClaim.numericCheck = {
        ...normalizedNumericCheck,
        calculationType,
        calculatedValue: null,
        matches: null,
      };
      return nextClaim;
    }

    nextClaim.numericCheck = verification.numericCheck;

    if (verification.verified) {
      nextClaim.verdict = verification.updatedVerdict;
      nextClaim.reasoning = appendReasoning(nextClaim.reasoning, verification.reasoningNote);
    }

    return nextClaim;
  });

  return {
    ...auditResult,
    claims: nextClaims,
    summary: recomputeSummary(nextClaims),
  };
}
