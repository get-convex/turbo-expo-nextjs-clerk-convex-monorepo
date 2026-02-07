# HIPAA and HITECH Act Reference

## HIPAA Overview

The Health Insurance Portability and Accountability Act (1996) establishes national standards for protecting health information. Three rules govern software:

### Privacy Rule (45 CFR Part 164, Subpart E)

Controls how PHI is used and disclosed.

**Key Requirements for Software:**

| Requirement | CFR Section | Application Impact |
|-------------|-------------|-------------------|
| Minimum Necessary | 164.502(b) | Only access/display PHI needed for the specific function |
| Individual Access Rights | 164.524 | Users must be able to view and export all their PHI |
| Right to Amendment | 164.526 | Users must be able to request corrections (track amendment history) |
| Right to Accounting of Disclosures | 164.528 | Track and report every disclosure of PHI to third parties |
| Notice of Privacy Practices | 164.520 | Display privacy notice and obtain acknowledgment before collecting PHI |
| Business Associate Agreements | 164.502(e), 164.504(e) | Signed BAA required BEFORE any vendor processes PHI |
| Authorization for Uses | 164.508 | Get explicit authorization for uses beyond treatment/payment/operations |
| Minimum Retention | N/A (state dependent) | Retain records per state law (commonly 6-10 years) |

**Minimum Necessary Standard in Code:**
- API responses should return only fields needed by the requesting component
- List views should not return full content (return titles/metadata only)
- Search results should not expose content snippets from other users' PHI
- Admin dashboards should show aggregated data, not individual PHI, unless specifically needed

### Security Rule (45 CFR Part 164, Subpart C)

Technical, administrative, and physical safeguards for electronic PHI (ePHI).

**Administrative Safeguards (164.308):**

| Safeguard | Section | Software Requirement |
|-----------|---------|---------------------|
| Risk Analysis | 164.308(a)(1)(ii)(A) | Document all PHI data flows and assess risks |
| Risk Management | 164.308(a)(1)(ii)(B) | Implement controls for identified risks |
| Workforce Security | 164.308(a)(3) | Role-based access, termination procedures |
| Information Access Management | 164.308(a)(4) | Access authorization, establishment, and modification procedures |
| Security Awareness Training | 164.308(a)(5) | Developer training on PHI handling |
| Security Incident Procedures | 164.308(a)(6) | Detect, report, respond to security incidents |
| Contingency Plan | 164.308(a)(7) | Data backup, disaster recovery, emergency mode operation |
| Business Associate Contracts | 164.308(b)(1) | BAAs with all vendors processing ePHI |

**Technical Safeguards (164.312):**

| Safeguard | Section | Software Requirement |
|-----------|---------|---------------------|
| Access Control | 164.312(a)(1) | Unique user IDs, emergency access, auto-logoff, encryption |
| Audit Controls | 164.312(b) | Record and examine access to ePHI systems |
| Integrity Controls | 164.312(c)(1) | Protect ePHI from improper alteration or destruction |
| Authentication | 164.312(d) | Verify identity of persons seeking ePHI access |
| Transmission Security | 164.312(e)(1) | Encryption and integrity controls for ePHI in transit |

**Physical Safeguards (164.310):**

Primarily applies to infrastructure (data centers, devices). For software:
- Device and Media Controls (164.310(d)): Handle device disposal, media re-use, data backup, accountability
- Relevant for mobile apps: data at rest on devices

### Breach Notification Rule (45 CFR Part 164, Subpart D)

**Notification Requirements:**

| Condition | Requirement | Timeline |
|-----------|-------------|----------|
| Breach affecting < 500 individuals | Notify individuals + log for annual HHS report | 60 days from discovery |
| Breach affecting >= 500 individuals | Notify individuals + HHS + prominent media | 60 days from discovery |
| Business associate breach | Notify covered entity | 60 days from discovery |

**What constitutes a breach:**
- Unauthorized acquisition, access, use, or disclosure of unsecured PHI
- Compromises the security or privacy of the PHI
- Presumed a breach unless low probability of compromise (risk assessment required)

**Unsecured PHI:** PHI not rendered unusable through encryption or destruction per HHS guidance. If data is encrypted with NIST-compliant algorithms, it's "secured" and breach notification may not apply.

**Software implications:**
- Must be able to determine WHAT data was accessed (requires audit logs)
- Must be able to determine WHO was affected (requires data mapping)
- Must be able to determine WHEN breach occurred (requires timestamps)
- Must support generating breach notification reports

---

## HITECH Act Enhancements

The Health Information Technology for Economic and Clinical Health Act (2009) strengthened HIPAA in several key areas:

### Business Associate Direct Liability (Section 13401)

**Before HITECH:** BAs were only contractually liable through BAAs.
**After HITECH:** BAs are directly liable for HIPAA compliance. Applies to ALL business associates including:
- Cloud providers hosting PHI
- AI services processing PHI
- Auth providers handling health-related identities
- Analytics services processing health data

**Impact:** Your vendors (Convex, OpenAI, Clerk, Vercel) are independently liable, not just through your BAA. But YOU are still liable for choosing compliant vendors and executing BAAs.

### Enhanced Breach Notification (Section 13402)

HITECH expanded breach notification beyond HIPAA:
- **Presumption of breach:** Any unauthorized access is presumed a breach unless you demonstrate low probability of compromise through documented risk assessment
- **State AG enforcement:** State Attorneys General can bring civil actions for HIPAA violations (not just HHS)
- **Individual harm threshold removed:** Notification required regardless of whether harm occurred

### Accounting of Disclosures Enhancement (Section 13405(c))

**Before HITECH:** Accounting required only for non-TPO (treatment, payment, operations) disclosures.
**After HITECH:** Extended to include disclosures made through electronic health records, including:
- Every AI API call containing PHI (disclosure to AI provider)
- Every analytics event containing PHI
- Every third-party integration receiving PHI
- Data exports and transfers

**Required tracking per disclosure:**
- Date of disclosure
- Name/address of recipient
- Description of PHI disclosed
- Purpose of disclosure

### Enhanced Penalty Structure (Section 13410)

| Violation Category | Minimum per Violation | Maximum per Year |
|-------------------|----------------------|-----------------|
| Did not know | $100 | $25,000 |
| Reasonable cause | $1,000 | $100,000 |
| Willful neglect (corrected) | $10,000 | $250,000 |
| Willful neglect (not corrected) | $50,000 | $1,500,000 |

**"Willful neglect" examples in software:**
- Known access control gaps left unfixed (e.g., `getNote` without ownership check)
- PHI in application logs with no remediation plan
- No audit logging despite awareness of requirement
- Using AI services without BAA for PHI processing

### Expanded Individual Rights (Section 13405)

| Right | HITECH Enhancement |
|-------|-------------------|
| Electronic copy | Right to receive PHI in electronic format |
| Restrict disclosures | Right to restrict disclosures to health plans for self-paid services |
| Marketing restrictions | Stricter consent requirements for marketing communications |
| Sale of PHI | Prohibits sale of PHI without authorization |
| Minimum necessary | Strengthened -- must limit to "limited data set" where practical |

### Meaningful Use and EHR Standards

If the application functions as or integrates with an Electronic Health Record system:
- Must meet ONC (Office of the National Coordinator) certification criteria
- Must support standardized data formats: HL7 FHIR, C-CDA, ICD-10
- Must support secure health information exchange
- Must implement clinical decision support safeguards

**When this applies:** Only if the app is marketed as, certified as, or used as an EHR system. A general note-taking app used for health notes is NOT an EHR unless it claims to be.

---

## HIPAA + HITECH Combined Compliance Checklist

### Application-Level Controls

- [ ] Authorization check on every PHI data access (read, write, delete)
- [ ] Immutable audit log for all PHI operations
- [ ] No PHI in application logs, error messages, or stack traces
- [ ] Soft-delete with version history (no permanent deletion)
- [ ] Data export capability for individual access rights
- [ ] Amendment request tracking
- [ ] Privacy notice displayed and acknowledged before PHI collection
- [ ] Session timeout (15 min idle, 8 hr absolute)
- [ ] MFA enabled for all PHI access
- [ ] Failed login lockout
- [ ] Breach detection capability (anomaly detection in audit logs)
- [ ] Disclosure accounting for all third-party PHI transmissions

### Vendor/Third-Party Controls

- [ ] BAA signed with every vendor processing PHI
- [ ] Vendor SOC 2 Type II report reviewed (< 12 months old)
- [ ] Vendor data residency confirmed
- [ ] Vendor breach notification SLA documented
- [ ] Vendor sub-processor list reviewed and approved
- [ ] Annual vendor compliance re-assessment scheduled
