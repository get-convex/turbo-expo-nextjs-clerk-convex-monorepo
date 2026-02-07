# PHI De-Identification Reference

## Overview

HIPAA provides two approved methods to de-identify Protected Health Information. Once properly de-identified, data is no longer PHI and is exempt from HIPAA requirements. This is critical for AI/ML processing when a BAA-covered provider is unavailable.

## Method 1: Safe Harbor (45 CFR 164.514(b))

Remove ALL 18 identifiers from the data AND have no actual knowledge that the remaining information could identify an individual.

### The 18 Identifiers to Remove

| # | Identifier | Action | Example Replacement |
|---|------------|--------|-------------------|
| 1 | Names | Remove entirely | `[NAME]` or omit |
| 2 | Geographic data < state | Truncate to state or 3-digit ZIP | `[LOCATION]` or state only |
| 3 | All dates except year | Replace with year only | `2024` instead of `03/15/2024` |
| 4 | Phone numbers | Remove entirely | `[PHONE]` |
| 5 | Fax numbers | Remove entirely | `[FAX]` |
| 6 | Email addresses | Remove entirely | `[EMAIL]` |
| 7 | SSN | Remove entirely | `[SSN]` |
| 8 | Medical record numbers | Remove entirely | `[MRN]` |
| 9 | Health plan beneficiary numbers | Remove entirely | `[HPBN]` |
| 10 | Account numbers | Remove entirely | `[ACCOUNT]` |
| 11 | Certificate/license numbers | Remove entirely | `[LICENSE]` |
| 12 | Vehicle identifiers | Remove entirely | `[VEHICLE]` |
| 13 | Device identifiers | Remove entirely | `[DEVICE]` |
| 14 | Web URLs | Remove entirely | `[URL]` |
| 15 | IP addresses | Remove entirely | `[IP]` |
| 16 | Biometric identifiers | Remove entirely | N/A (usually not in text) |
| 17 | Full-face photographs | Remove entirely | N/A |
| 18 | Any other unique ID | Remove/generalize | `[ID]` |

### ZIP Code Special Rule

- ZIP codes with population >= 20,000: First 3 digits are OK to keep
- ZIP codes with population < 20,000: Must be set to `000`
- Reference: Census Bureau population data

### Age Special Rule

- Ages under 90: OK to include
- Ages 90 and over: Must be aggregated as `90+`

### Implementation Pattern

```typescript
interface DeidentificationResult {
  text: string;
  removedIdentifiers: Array<{
    type: string;
    position: { start: number; end: number };
    replacement: string;
  }>;
  method: "safe_harbor";
  timestamp: number;
}

function deidentifySafeHarbor(text: string): DeidentificationResult {
  const removals: DeidentificationResult["removedIdentifiers"] = [];
  let result = text;

  // Order matters: process longer patterns first to avoid partial matches

  // Names (NER-based for accuracy, regex as fallback)
  // Use a Named Entity Recognition library for production
  // Regex fallback for common patterns:
  result = replaceAndTrack(result, removals, "name",
    /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, "[NAME]");

  // Dates (except year)
  result = replaceAndTrack(result, removals, "date",
    /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/g, "[DATE]");
  result = replaceAndTrack(result, removals, "date",
    /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}\b/gi,
    "[DATE]");

  // SSN
  result = replaceAndTrack(result, removals, "ssn",
    /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g, "[SSN]");

  // Phone numbers
  result = replaceAndTrack(result, removals, "phone",
    /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, "[PHONE]");

  // Email addresses
  result = replaceAndTrack(result, removals, "email",
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[EMAIL]");

  // URLs
  result = replaceAndTrack(result, removals, "url",
    /https?:\/\/[^\s]+/g, "[URL]");

  // IP addresses
  result = replaceAndTrack(result, removals, "ip",
    /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, "[IP]");

  // Medical record numbers (common patterns)
  result = replaceAndTrack(result, removals, "mrn",
    /\bMRN[:\s#]*\d+\b/gi, "[MRN]");

  // Account numbers (generic pattern)
  result = replaceAndTrack(result, removals, "account",
    /\b(?:account|acct)[:\s#]*\d+\b/gi, "[ACCOUNT]");

  return {
    text: result,
    removedIdentifiers: removals,
    method: "safe_harbor",
    timestamp: Date.now(),
  };
}
```

### Limitations of Safe Harbor

- **Over-removal:** Aggressive pattern matching may remove non-identifier text
- **Under-removal:** Regex misses unusual formats (e.g., spelled-out phone numbers)
- **Context loss:** Removing identifiers may reduce utility for AI processing
- **No guarantee:** Unusual combinations of remaining data could still identify someone

### Production Recommendations

For production de-identification, use dedicated NER/NLP tools:

| Tool | Type | Strengths |
|------|------|-----------|
| Amazon Comprehend Medical | Cloud API | HIPAA-eligible, healthcare-optimized NER |
| Google Cloud Healthcare NLP | Cloud API | Clinical NER with de-identification |
| Microsoft Text Analytics for Health | Cloud API | Healthcare entity recognition |
| Philter | Open source | Configurable clinical text de-identification |
| scrubadub | Open source (Python) | General PII detection |

**Important:** If using a cloud NER service for de-identification, that service itself processes PHI. You need a BAA with the NER provider, or run the NER model locally.

## Method 2: Expert Determination (45 CFR 164.514(a))

A qualified statistical or scientific expert determines and documents that the risk of re-identification is "very small."

### Requirements

1. Expert must apply statistical/scientific principles
2. Expert must determine re-identification risk is "very small"
3. Expert must document methods and results
4. Covered entity must retain expert's determination

### When to Use Expert Determination

- When Safe Harbor removes too much useful information
- When you need to retain some identifiers for analysis quality
- When you have budget for expert consultation
- When data utility requirements conflict with Safe Harbor removal

### Typical Approaches

- **k-anonymity:** Every record is indistinguishable from at least k-1 other records
- **l-diversity:** Each equivalence class has at least l distinct sensitive values
- **t-closeness:** Distribution of sensitive attributes in equivalence class is close to overall distribution
- **Differential privacy:** Mathematical guarantee that individual records don't significantly affect outputs

### Cost and Timeline

- Expert determination: $10K-$50K+ depending on data complexity
- Timeline: 4-8 weeks for analysis and documentation
- Must be repeated when data characteristics change significantly

## Choosing Between Methods

| Factor | Safe Harbor | Expert Determination |
|--------|-------------|---------------------|
| Cost | Low (engineering effort) | High (expert + engineering) |
| Speed | Days | Weeks |
| Data utility | Lower (aggressive removal) | Higher (targeted approach) |
| Certainty | High (prescriptive rules) | High (statistical proof) |
| Maintenance | Low | Moderate (re-assessment needed) |
| Best for | AI prompt pre-processing | Research datasets, analytics |

**For AI processing:** Safe Harbor is usually sufficient. Strip identifiers before sending to AI, keep the mapping locally to re-associate results.

## Re-Identification Risk

Even after de-identification, be aware:

- **Mosaic effect:** Combining de-identified data with other public data may enable re-identification
- **Unique health conditions:** Rare conditions in small geographic areas may be identifying even without explicit identifiers
- **Temporal patterns:** Sequence of events may uniquely identify individuals
- **Free text:** Clinical narrative may contain identifying information in unexpected ways ("the patient who works at the bakery on Main Street")

### Mitigation

- Don't combine de-identified data with other datasets without expert review
- Apply generalization to rare conditions (group rare diagnoses into categories)
- Review free text with NER before claiming de-identification
- Document your de-identification process and have it reviewed periodically

## Workflow: De-Identification for AI Processing

```
1. User creates note with health content
2. Before AI processing, apply Safe Harbor de-identification
3. Log the de-identification event in audit trail
4. Send de-identified text to AI service
5. Receive AI response (based on de-identified input)
6. Store AI response associated with original record
7. Never send mapping between de-identified and original data to AI
```

**Critical:** The mapping between original PHI and de-identified data is itself sensitive. Store securely, never transmit to the AI service.
