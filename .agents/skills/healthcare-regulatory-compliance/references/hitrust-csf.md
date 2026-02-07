# HITRUST CSF Reference

## What is HITRUST CSF?

The HITRUST Common Security Framework is a certifiable security and privacy framework that harmonizes requirements from HIPAA, NIST, ISO 27001, PCI-DSS, GDPR, and other regulations into a single set of controls. HITRUST certification is widely recognized as the strongest demonstration of HIPAA compliance.

**Why it matters:** While HIPAA compliance is self-assessed (no official certification), HITRUST provides third-party validated certification. Many healthcare enterprises require HITRUST certification from their vendors.

## Relationship to HIPAA

| Aspect | HIPAA | HITRUST |
|--------|-------|---------|
| Type | Federal regulation | Voluntary framework |
| Assessment | Self-assessed | Third-party validated |
| Certification | No official certification | Formal certification |
| Scope | Healthcare-specific | Multi-regulation (HIPAA + NIST + ISO + more) |
| Specificity | General requirements | Prescriptive controls |
| Renewal | Continuous | Every 2 years (r2) or 1 year (i1, e1) |

**Bottom line:** HITRUST certification doesn't replace HIPAA compliance -- it demonstrates it through validated controls.

## Assessment Levels

HITRUST offers three assessment tiers, each building on the previous:

### e1 -- Essential, 1-Year (Entry Level)

- **Controls:** 44 requirement statements
- **Focus:** Fundamental cybersecurity hygiene
- **Best for:** Small organizations beginning compliance journey
- **Assessment type:** Self-assessment with HITRUST quality review
- **Validity:** 1 year
- **Cost/effort:** Lowest

### i1 -- Implemented, 1-Year (Mid Level)

- **Controls:** 182 requirement statements
- **Focus:** Leading security practices based on threat intelligence
- **Best for:** Organizations needing to demonstrate security posture to partners
- **Assessment type:** Validated assessment (external assessor required)
- **Validity:** 1 year
- **Cost/effort:** Moderate

### r2 -- Risk-Based, 2-Year (Gold Standard)

- **Controls:** Tailored based on risk factors (typically 300-400+ requirement statements)
- **Focus:** Comprehensive, risk-based control selection
- **Best for:** Organizations handling significant PHI, enterprise vendor requirements
- **Assessment type:** Validated assessment with certification
- **Validity:** 2 years (with interim assessment at year 1)
- **Cost/effort:** Highest, most thorough

### Progression Path

```
e1 (44 controls) → i1 (182 controls) → r2 (300-400+ controls)
      Year 1              Year 2              Year 3+
```

Most healthcare startups should target **i1** within the first year and **r2** by year two if serving enterprise healthcare customers.

## The 14 Control Categories

HITRUST CSF v11 organizes controls into 14 top-level categories (numbered 00-13). Here's what each means for application development:

### 00 -- Information Security Management Program

**What it covers:** Security governance, policies, roles, risk management
**Application impact:** Document security policies, assign security responsibility, conduct risk assessments
**Key controls:** Information security policy, risk assessment process, management review

### 01 -- Access Control

**What it covers:** User access management, authentication, authorization
**Application impact:** Critical for code. Implement RBAC, MFA, session management, access logging.
**Key controls:**
- 01.a: Access control policy documented
- 01.b: User registration and deregistration procedures
- 01.c: Privilege management (least privilege)
- 01.d: Password management (complexity, rotation)
- 01.j: External connection authentication
- 01.q: User identification and authentication
- 01.t: Session time-out (15 min for PHI systems)
- 01.v: Information access restriction (enforce need-to-know)

### 02 -- Human Resources Security

**What it covers:** Employee screening, training, termination procedures
**Application impact:** Implement user offboarding (delete/reassign data when employees leave). Security awareness training for developers.
**Key controls:** Background checks, acceptable use, termination procedures

### 03 -- Risk Management

**What it covers:** Risk assessment methodology, risk treatment, risk acceptance
**Application impact:** Document risk assessment covering all PHI data flows, AI processing, third-party integrations.
**Key controls:** Risk assessment process, risk treatment plan, residual risk acceptance

### 04 -- Security Policy

**What it covers:** Security policy documentation, review, and communication
**Application impact:** Maintain security policy document, review annually, communicate to all staff.

### 05 -- Organization of Information Security

**What it covers:** Internal organization, external parties, mobile/telework
**Application impact:** Define security roles, manage third-party access, mobile device policies.

### 06 -- Compliance

**What it covers:** Legal requirements, security standards, audit considerations
**Application impact:** Identify applicable regulations, ensure technical compliance, maintain audit readiness.
**Key controls:**
- 06.a: Identification of applicable legislation
- 06.c: Protection of organizational records
- 06.d: Data protection and privacy
- 06.g: Compliance checking (regular self-assessments)

### 07 -- Asset Management

**What it covers:** Asset inventory, classification, handling
**Application impact:** Classify data (PHI vs non-PHI), maintain data inventory, define handling procedures per classification.
**Key controls:**
- 07.a: Inventory of assets (including data stores, APIs, integrations)
- 07.d: Classification guidelines (PHI, PII, public, internal)
- 07.e: Information labeling and handling

### 08 -- Physical and Environmental Security

**What it covers:** Secure areas, equipment security
**Application impact:** Primarily infrastructure. For mobile apps: device security policies, data at rest on devices.

### 09 -- Communications and Operations Management

**What it covers:** Operational procedures, change management, monitoring, backups
**Application impact:** Critical for code. Implement logging, monitoring, backup procedures, capacity management.
**Key controls:**
- 09.aa: Audit logging (all PHI access and security events)
- 09.ab: Monitoring system use (anomaly detection)
- 09.ac: Protection of log information (immutable audit logs)
- 09.ad: Admin and operator logs
- 09.e: Separation of duties
- 09.i: System acceptance (testing before production)
- 09.s: Information exchange policies (controls for AI/third-party data sharing)

### 10 -- Information Systems Acquisition, Development, and Maintenance

**What it covers:** Security requirements, secure development, cryptography
**Application impact:** Critical for code. Input validation, secure coding practices, encryption, change control.
**Key controls:**
- 10.a: Security requirements analysis (before building features)
- 10.b: Input validation (all user input validated server-side)
- 10.f: Policy on use of cryptographic controls
- 10.g: Key management
- 10.h: Control of operational software
- 10.k: Change control procedures
- 10.m: Control of technical vulnerabilities

### 11 -- Information Security Incident Management

**What it covers:** Incident reporting, response, evidence collection
**Application impact:** Implement incident detection, response procedures, evidence preservation.
**Key controls:**
- 11.a: Reporting information security events
- 11.c: Responsibilities and procedures for incident response
- 11.e: Collection of evidence (audit log preservation)

### 12 -- Business Continuity Management

**What it covers:** Business continuity planning, testing, maintenance
**Application impact:** Disaster recovery, data backup verification, failover procedures.

### 13 -- Privacy Practices

**What it covers:** Privacy notice, consent, data subject rights, data retention
**Application impact:** Critical for code. Implement privacy notices, consent management, data export, data deletion.
**Key controls:**
- 13.a: Privacy notice
- 13.d: Consent (explicit consent before PHI collection)
- 13.f: Data subject access (export functionality)
- 13.g: Amendment of PHI
- 13.i: Accounting of disclosures (track all third-party PHI sharing)
- 13.k: Use and disclosure limitations (minimum necessary)
- 13.r: Data retention and disposal

## Application Development Checklist (HITRUST-Aligned)

### Access Control (Domain 01)
- [ ] Unique user identification for all users
- [ ] Role-based access control implemented
- [ ] MFA enforced for all PHI access
- [ ] Session timeout: 15 minutes idle
- [ ] Failed login lockout policy
- [ ] Authorization check on every data access endpoint
- [ ] User deregistration removes/reassigns data
- [ ] Access control policy documented

### Audit and Monitoring (Domain 09)
- [ ] All PHI access logged (who, what, when)
- [ ] All PHI modifications logged with before/after
- [ ] Security events logged (failed auth, unauthorized access)
- [ ] Audit logs immutable (no delete/update operations)
- [ ] Audit log retention: minimum 6 years
- [ ] Audit logs indexed and searchable
- [ ] Monitoring/alerting for anomalous access patterns

### Secure Development (Domain 10)
- [ ] Input validation on all user-supplied data
- [ ] Output encoding (XSS prevention)
- [ ] No PHI in error messages, logs, or stack traces
- [ ] Encryption at rest for all PHI stores
- [ ] Encryption in transit (TLS 1.2+)
- [ ] Security headers (CSP, HSTS, X-Frame-Options)
- [ ] Dependency vulnerability scanning

### Privacy (Domain 13)
- [ ] Privacy notice displayed before PHI collection
- [ ] Explicit consent obtained and recorded
- [ ] Data export functionality (user's right to access)
- [ ] Amendment request tracking
- [ ] Accounting of disclosures to third parties
- [ ] Data retention policy implemented
- [ ] Minimum necessary principle applied to all PHI access
