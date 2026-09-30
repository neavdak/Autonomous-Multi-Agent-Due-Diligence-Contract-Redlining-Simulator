import { randomUUID } from 'node:crypto';

export const DEMO_DOCUMENT_NAME = 'Northstar Analytics — Master Services Agreement';

export const DEMO_DOCUMENT_TEXT = `MASTER SERVICES AGREEMENT\nNorthstar Analytics, Inc.  ·  Vendor diligence package  ·  September 2026\n\n1. SERVICES & CUSTOMER DATA\nProvider will host the Northstar analytics platform and process Customer business contact details, account activity, and other Customer Data to provide the Services.\n\n9. LIMITATION OF LIABILITY\nEXCEPT FOR PROVIDER'S OBLIGATIONS, PROVIDER SHALL HAVE NO LIABILITY FOR ANY INDIRECT, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES. TOTAL AGGREGATE LIABILITY SHALL NOT EXCEED FEES PAID IN THE PAST 12 MONTHS.\n\n10. INDEMNIFICATION\nCustomer shall indemnify, defend, and hold harmless Provider from any and all claims, losses, and expenses arising out of Customer's use of the Services, including claims caused by Provider's negligence or breach of this Agreement.\n\n11. TERM & TERMINATION\nProvider may suspend or terminate the Services at any time in its sole discretion, without prior notice or a refund of prepaid fees.\n\n12. DATA PROCESSING & SECURITY\nProvider may engage subprocessors without Customer's prior written consent. Customer Data may be stored or processed in any region in which Provider or its subcontractors operate. Provider will notify Customer of a Security Incident without undue delay. Provider may retain Customer Data indefinitely for service improvement.\n\n13. GOVERNING LAW\nThis Agreement is governed by the laws of the Cayman Islands, without regard to its conflict of law provisions.\n\nAPPENDIX A — FINANCIAL SNAPSHOT (FY2025)\nRevenue declined 12% year over year, from $9.5 million to $8.4 million. Operating cash outflow was $2.1 million for the year. Current liabilities exceed current assets by $1.4 million. Total debt outstanding is $4.6 million.`;

const SEVERITY_WEIGHT = { critical: 4, high: 3, medium: 2, low: 1 };
const AGENT_META = {
  finance: { name: 'Financial health', short: 'Finance', role: 'M&A financial auditor', icon: 'chart' },
  legal: { name: 'Legal exposure', short: 'Legal', role: 'Corporate M&A counsel', icon: 'scale' },
  compliance: { name: 'Regulatory & compliance', short: 'Compliance', role: 'Chief compliance officer', icon: 'shield' },
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function evidenceFor(text, pattern, fallback) {
  const fragments = text.split(/(?<=[.!?])\s+|\r?\n+/).map((part) => part.trim()).filter(Boolean);
  const fragment = fragments.find((item) => {
    pattern.lastIndex = 0;
    return item.length > 45 && pattern.test(item);
  }) || fragments.find((item) => {
    pattern.lastIndex = 0;
    return pattern.test(item);
  });
  if (fragment) return fragment.slice(0, 500);
  pattern.lastIndex = 0;
  const match = pattern.exec(text);
  if (!match || match.index === undefined) return fallback;
  const start = Math.max(0, match.index - 95);
  const end = Math.min(text.length, match.index + Math.max(match[0].length, 150));
  return text.slice(start, end).replace(/\s+/g, ' ').trim().slice(0, 500) || fallback;
}

function makeFinding({ agentKey, category, title, severity, evidence, section, concern, recommendation, before, after, sourceType = 'quote' }) {
  const meta = AGENT_META[agentKey];
  return {
    id: randomUUID(),
    agentKey,
    agent: meta.short,
    category,
    title,
    severity,
    section,
    evidence,
    sourceType,
    concern,
    recommendation,
    redline: before || after ? { before: before || evidence, after: after || recommendation } : null,
    decision: 'open',
    reviewerNote: '',
  };
}

function financialFindings(text) {
  const findings = [];
  const revenuePattern = /\b(?:revenue|sales)\b[^\n.]{0,100}\b(?:declin(?:e|ed|ing)|fell|decreas(?:e|ed)|down)\b[^\n.]{0,55}?(\d+(?:\.\d+)?)\s*%/i;
  const revenueMatch = text.match(revenuePattern);
  if (revenueMatch) {
    const drop = Number(revenueMatch[1]);
    const evidence = evidenceFor(text, revenuePattern, revenueMatch[0]);
    findings.push(makeFinding({
      agentKey: 'finance', category: 'Revenue quality', title: `Revenue declined ${drop}% year over year`, severity: drop >= 15 ? 'high' : 'medium',
      section: 'Financial performance', evidence,
      concern: 'A sustained top-line contraction can reduce operating leverage, weaken covenant headroom, and make forecast assumptions less reliable.',
      recommendation: 'Request a monthly revenue bridge, customer concentration schedule, churn cohort analysis, and management’s supported recovery plan before approval.',
    }));
  }

  const cashPattern = /\b(?:operating cash (?:outflow|burn|used)|cash burn|negative operating cash flow|net cash used in operations)\b/i;
  if (cashPattern.test(text)) {
    const evidence = evidenceFor(text, cashPattern, 'Operating cash generation could not be confirmed from the submitted materials.');
    const amount = evidence.match(/\$\s?\d[\d,.]*\s?(?:million|billion|m\b|b\b)?/i)?.[0];
    findings.push(makeFinding({
      agentKey: 'finance', category: 'Liquidity', title: amount ? `Operating cash outflow reported (${amount.trim()})` : 'Operating cash outflow reported', severity: 'high',
      section: 'Cash flow', evidence,
      concern: 'Negative operating cash flow increases dependence on external financing and may constrain the counterparty’s ability to perform over the contract term.',
      recommendation: 'Validate unrestricted cash, monthly burn, committed facilities, and a 12-month runway forecast; consider financial reporting and service-continuity protections.',
    }));
  }

  const workingCapitalPattern = /\b(?:current liabilities exceed current assets|negative working capital|working capital deficit|current ratio (?:of )?below 1(?:\.0)?|current assets are less than current liabilities)\b/i;
  if (workingCapitalPattern.test(text)) {
    const evidence = evidenceFor(text, workingCapitalPattern, 'Working-capital position appears constrained.');
    findings.push(makeFinding({
      agentKey: 'finance', category: 'Working capital', title: 'Negative working capital raises short-term liquidity risk', severity: 'high',
      section: 'Balance sheet', evidence,
      concern: 'A near-term funding gap can impair payroll, vendor payments, and operational continuity.',
      recommendation: 'Obtain the latest balance sheet and cash forecast; confirm available liquidity and agree a continuity plan for any critical services.',
    }));
  }

  const debtPattern = /\b(?:total debt|debt outstanding|outstanding borrowings|borrowings)\b[^\n.]{0,65}/i;
  if (debtPattern.test(text)) {
    const evidence = evidenceFor(text, debtPattern, 'The submitted materials reference outstanding debt.');
    findings.push(makeFinding({
      agentKey: 'finance', category: 'Leverage', title: 'Outstanding debt requires covenant and maturity review', severity: 'medium',
      section: 'Capital structure', evidence,
      concern: 'Debt maturities, security interests, and covenant restrictions may limit financial flexibility or affect the counterparty’s ability to meet its obligations.',
      recommendation: 'Review the debt maturity schedule, covenant compliance certificate, security package, and any change-of-control provisions.',
    }));
  }

  if (findings.length === 0) {
    const financialContext = /\b(?:revenue|balance sheet|income statement|cash flow|ebitda|financial statements|debt)\b/i.test(text);
    findings.push(makeFinding({
      agentKey: 'finance', category: 'Information gap', title: financialContext ? 'Financial disclosures are too limited to validate resilience' : 'No financial statements identified in this submission', severity: 'low',
      section: 'Diligence materials', evidence: financialContext
        ? 'The document contains limited financial references but no complete, comparable financial statements.'
        : 'No balance sheet, income statement, cash flow statement, or supporting financial schedule was identified.',
      sourceType: 'absence',
      concern: 'The committee cannot independently assess liquidity, leverage, profitability, or the counterparty’s ability to perform.',
      recommendation: 'Request the last three fiscal years of audited statements, current interim accounts, a cash forecast, and a debt schedule.',
    }));
  }
  return findings;
}

function legalFindings(text) {
  const findings = [];
  const capPattern = /(?:total\s+)?(?:aggregate\s+)?liability[^\n.]{0,230}(?:shall\s+not\s+exceed|limited\s+to|capped\s+at)[^\n.]{0,140}(?:fees|amounts|charges|contract\s+value)/i;
  if (capPattern.test(text) || (/(?:fees paid|amounts paid)[^\n.]{0,50}(?:12|twelve) months/i.test(text) && /liability/i.test(text))) {
    const evidence = evidenceFor(text, capPattern, 'Liability is capped by reference to fees paid during the prior 12 months.');
    findings.push(makeFinding({
      agentKey: 'legal', category: 'Liability cap', title: 'Fees-only liability cap may leave material losses uninsured', severity: 'high',
      section: 'Limitation of liability', evidence,
      concern: 'A fees-paid cap can be far below the cost of a serious data, confidentiality, IP, or business interruption event—especially early in the contract term.',
      recommendation: 'Carve out specified high-risk obligations and negotiate a meaningful super-cap tied to insurance and the foreseeable exposure.',
      before: evidence,
      after: 'Except for excluded claims, each party’s aggregate liability will not exceed the greater of $1,000,000 or three times the fees paid or payable in the 12 months before the event. The cap will not apply to confidentiality, data protection, IP infringement, fraud, or willful misconduct.',
    }));
  }

  const damagesPattern = /\b(?:indirect|special|incidental|consequential|punitive) damages\b/i;
  if (damagesPattern.test(text)) {
    const evidence = evidenceFor(text, damagesPattern, 'The agreement excludes consequential damages.');
    findings.push(makeFinding({
      agentKey: 'legal', category: 'Damages exclusion', title: 'Broad damages exclusion may bar recovery of foreseeable loss', severity: 'medium',
      section: 'Limitation of liability', evidence,
      concern: 'A broad exclusion can remove recovery for data restoration, substitute services, and other foreseeable costs even where a liability cap is raised.',
      recommendation: 'Clarify that direct costs of cover, data restoration, and incident response remain recoverable; align the exclusion with the negotiated liability carve-outs.',
      before: evidence,
      after: 'Neither party will be liable for remote or speculative damages. The exclusion will not bar direct costs of cover, data restoration, incident response, or amounts payable to third parties under an indemnity.',
    }));
  }

  const indemnityPattern = /\b(?:indemnif(?:y|ies|ication)|hold harmless)\b/i;
  if (indemnityPattern.test(text) && /\b(?:any and all claims|all claims|regardless of|including claims caused by|arising out of (?:any|all))\b/i.test(text)) {
    const evidence = evidenceFor(text, indemnityPattern, 'The indemnity obligation is broad and not clearly limited by fault or control.');
    findings.push(makeFinding({
      agentKey: 'legal', category: 'Indemnification', title: 'Customer indemnity is unusually broad and includes provider-caused claims', severity: 'high',
      section: 'Indemnification', evidence,
      concern: 'The clause appears to shift losses caused by the provider’s own negligence or breach to the customer, with no clear third-party claim or control-of-defense limitation.',
      recommendation: 'Limit the customer indemnity to third-party claims caused by customer materials or unlawful use; add reciprocal provider coverage for IP, privacy, and provider misconduct.',
      before: evidence,
      after: 'Customer will indemnify Provider only against third-party claims to the extent arising from Customer’s unlawful use of the Services or Customer Materials. Provider will indemnify Customer against third-party IP infringement, Provider’s breach of data protection obligations, and Provider’s negligence or willful misconduct. Each party will receive prompt notice and control of the defense, subject to reasonable cooperation.',
    }));
  }

  const terminationPattern = /\b(?:terminate|termination|suspend)\b/i;
  if (terminationPattern.test(text) && /\b(?:sole discretion|at any time|without (?:prior )?notice|for convenience)\b/i.test(text)) {
    const evidence = evidenceFor(text, terminationPattern, 'Provider retains a unilateral suspension or termination right.');
    findings.push(makeFinding({
      agentKey: 'legal', category: 'Termination rights', title: 'Provider can suspend or terminate unilaterally without notice', severity: 'high',
      section: 'Term & termination', evidence,
      concern: 'An unrestricted termination right creates service-continuity risk and may strand prepaid fees or critical data.',
      recommendation: 'Require material breach, written notice, a reasonable cure period, transition assistance, and a pro-rata refund for prepaid unused services.',
      before: evidence,
      after: 'Either party may terminate for material breach not cured within 30 days after written notice. Provider may suspend only to address an immediate security threat or material legal violation, and only to the extent necessary. Provider will provide transition assistance and refund prepaid unused fees.',
    }));
  }

  const venuePattern = /\b(?:governed by|laws of|exclusive jurisdiction of)\b[^\n.]{0,100}\b(?:Cayman Islands|Bermuda|British Virgin Islands|Singapore|England and Wales)\b/i;
  if (venuePattern.test(text)) {
    const evidence = evidenceFor(text, venuePattern, 'The selected governing law or forum is outside the organization’s preferred jurisdictions.');
    findings.push(makeFinding({
      agentKey: 'legal', category: 'Governing law', title: 'Non-standard governing law increases enforcement friction', severity: /Cayman|Bermuda|British Virgin Islands/i.test(evidence) ? 'high' : 'medium',
      section: 'Governing law', evidence,
      concern: 'A distant or unfamiliar forum can increase enforcement cost, create uncertainty, and conflict with the organization’s contracting policy.',
      recommendation: 'Move governing law and venue to an approved jurisdiction such as New York, Delaware, or the customer’s principal place of business.',
      before: evidence,
      after: 'This Agreement is governed by the laws of the State of New York, without regard to its conflict-of-law rules. The state and federal courts located in New York County will have exclusive jurisdiction.',
    }));
  }

  if (findings.length === 0) {
    findings.push(makeFinding({
      agentKey: 'legal', category: 'Contract review', title: 'No high-risk clause matched the initial legal checks', severity: 'low',
      section: 'Whole agreement', evidence: 'Automated clause checks did not identify a predefined high-risk term in this document.', sourceType: 'absence',
      concern: 'Pattern-based review does not establish that the agreement is balanced or complete.',
      recommendation: 'Have counsel review the full agreement, schedules, order forms, and any incorporated online terms before signature.',
    }));
  }
  return findings;
}

function complianceFindings(text) {
  const findings = [];
  const hasPersonalData = /\b(?:personal data|personal information|customer data|user data|individuals)\b/i.test(text);
  const dataContext = /\b(?:personal data|personal information|customer data|user data|security|privacy)\b/i;

  if (hasPersonalData && !/\b(?:data processing agreement|data processing addendum|data protection addendum|\bDPA\b)\b/i.test(text)) {
    const evidence = 'No data processing agreement, data protection addendum, or equivalent processor terms were identified.';
    findings.push(makeFinding({
      agentKey: 'compliance', category: 'Privacy terms', title: 'No data-processing addendum identified', severity: 'high',
      section: 'Privacy & data protection', evidence, sourceType: 'absence',
      concern: 'The document describes personal or customer data processing but does not set out processor instructions, data-subject assistance, audit rights, or transfer safeguards.',
      recommendation: 'Attach the approved DPA, define processing purposes and duration, and include security, breach, subprocessor, deletion, and audit obligations.',
    }));
  }

  const subprocessorPattern = /\b(?:subprocessors?|sub-contractors?|subcontractors?)\b[^\n.]{0,160}\bwithout\b[^\n.]{0,75}\b(?:consent|approval|notice)\b/i;
  if (subprocessorPattern.test(text)) {
    const evidence = evidenceFor(text, subprocessorPattern, 'The provider can engage subprocessors without a meaningful customer approval or notice right.');
    findings.push(makeFinding({
      agentKey: 'compliance', category: 'Vendor oversight', title: 'Subprocessors may be appointed without customer oversight', severity: 'high',
      section: 'Subprocessors', evidence,
      concern: 'The customer may have no opportunity to assess downstream access to data or object to a subprocessor that fails security or regulatory requirements.',
      recommendation: 'Require advance notice of changes, a reasonable objection right, a current subprocessor list, equivalent flow-down obligations, and provider accountability.',
      before: evidence,
      after: 'Provider will maintain a current list of subprocessors and give at least 30 days’ advance notice of additions or replacements. Customer may object on reasonable data-protection grounds; Provider remains liable for each subprocessor and will flow down equivalent written safeguards.',
    }));
  }

  const residencyPattern = /\b(?:any region|any country|any jurisdiction|outside (?:the )?(?:EU|EEA|European Economic Area|United States)|cross.border transfer|international transfer)\b/i;
  if (residencyPattern.test(text) && hasPersonalData) {
    const evidence = evidenceFor(text, residencyPattern, 'Data location is not limited to approved regions and no transfer safeguards were identified.');
    findings.push(makeFinding({
      agentKey: 'compliance', category: 'Data residency', title: 'Data may be processed in unapproved regions', severity: 'high',
      section: 'Data location & transfers', evidence,
      concern: 'Unrestricted storage or onward transfer can conflict with residency requirements, internal policy, and applicable cross-border transfer rules.',
      recommendation: 'Specify permitted processing locations; require documented transfer mechanisms, notice before relocation, and no transfer to a restricted region without written approval.',
      before: evidence,
      after: 'Provider will process Customer Data only in the regions listed in the applicable order form. Provider will not transfer Customer Data across borders unless an approved transfer mechanism is in place and Customer has received prior notice.',
    }));
  }

  const incidentPattern = /\b(?:security incident|data breach|personal data breach)\b/i;
  if (incidentPattern.test(text)) {
    const evidence = evidenceFor(text, incidentPattern, 'Incident notification timing is not clearly defined.');
    const hasClock = /\b(?:24|48|72) hours?\b|\bone business day\b/i.test(evidence) || /\b(?:24|48|72) hours?\b|\bone business day\b/i.test(text);
    if (!hasClock || !/\b(?:notify|notification|inform)\b/i.test(evidence)) {
      findings.push(makeFinding({
        agentKey: 'compliance', category: 'Incident response', title: 'Breach notification timing is not sufficiently specific', severity: 'medium',
        section: 'Security incident response', evidence,
        concern: '“Without undue delay” is difficult to operationalize and may not provide enough time for the customer to meet its own regulatory reporting obligations.',
        recommendation: 'Set a firm outer deadline, require prompt updates and cooperation, and preserve evidence for investigation and regulatory response.',
        before: evidence,
        after: 'Provider will notify Customer without undue delay and in no event later than 24 hours after becoming aware of a Security Incident affecting Customer Data. Provider will promptly share material facts, cooperate with the investigation, and provide regular updates until remediation is complete.',
      }));
    }
  }

  const indefinitePattern = /\b(?:retain|retention|keep)\b[^\n.]{0,100}\b(?:indefinitely|without time limit|permanently)\b/i;
  if (indefinitePattern.test(text)) {
    const evidence = evidenceFor(text, indefinitePattern, 'A defined deletion deadline was not identified.');
    findings.push(makeFinding({
      agentKey: 'compliance', category: 'Data lifecycle', title: 'Customer data may be retained indefinitely', severity: 'high',
      section: 'Retention & deletion', evidence,
      concern: 'Indefinite retention increases breach exposure and may conflict with storage-limitation, deletion, and records-management requirements.',
      recommendation: 'Set purpose-limited retention, require return or certified deletion at termination, and allow only narrow archival exceptions with continued safeguards.',
      before: evidence,
      after: 'Provider will retain Customer Data only as necessary to provide the Services and will return or securely delete it within 30 days after termination. Any legally required archival copy will remain protected and inaccessible for ordinary business use.',
    }));
  }

  if (findings.length === 0) {
    const evidence = hasPersonalData
      ? 'No predefined privacy or security gap matched the submitted language; this does not confirm compliance.'
      : 'The submission does not identify regulated personal-data processing or provide a standalone compliance schedule.';
    findings.push(makeFinding({
      agentKey: 'compliance', category: 'Compliance scope', title: hasPersonalData ? 'No predefined compliance gap matched' : 'Compliance scope needs confirmation', severity: 'low',
      section: 'Whole agreement', evidence, sourceType: 'absence',
      concern: 'Applicable controls depend on data types, processing locations, sector, and the organization’s internal policies.',
      recommendation: 'Confirm data categories, relevant jurisdictions, security evidence, and any separate privacy or information-security addendum.',
    }));
  }
  return findings;
}

function calculateScore(findings, base = 2.2) {
  const score = base + findings.reduce((total, finding) => total + (SEVERITY_WEIGHT[finding.severity] ?? 1) * 0.38, 0);
  return Math.round(clamp(score, 1, 10) * 10) / 10;
}

export function riskLabel(score) {
  if (score >= 8.5) return 'Critical';
  if (score >= 6.5) return 'High';
  if (score >= 4.3) return 'Moderate';
  return 'Low';
}

function makeAgent(agentKey, findings, extra = {}) {
  const meta = AGENT_META[agentKey];
  const score = calculateScore(findings, agentKey === 'finance' ? 2.8 : 2.1);
  const headline = {
    finance: findings.some((item) => item.category === 'Information gap')
      ? 'Financial evidence is incomplete.'
      : `${findings.length} financial signal${findings.length === 1 ? '' : 's'} require review.`,
    legal: findings.some((item) => item.severity === 'high' || item.severity === 'critical')
      ? 'Material contract terms should be negotiated before signature.'
      : 'No predefined high-risk legal term was detected.',
    compliance: findings.some((item) => item.severity === 'high' || item.severity === 'critical')
      ? 'Privacy and operational controls need remediation.'
      : 'No predefined critical compliance gap was detected.',
  }[agentKey];
  return {
    key: agentKey,
    name: meta.name,
    shortName: meta.short,
    role: meta.role,
    score,
    risk: riskLabel(score),
    status: 'complete',
    summary: headline,
    findingCount: findings.length,
    metrics: extra.metrics ?? [],
    findings,
  };
}

function financialMetrics(text) {
  const metrics = [];
  const revenue = text.match(/\b(?:revenue|sales)\b[^\n.]{0,100}\b(?:declin(?:e|ed|ing)|fell|decreas(?:e|ed)|down)\b[^\n.]{0,55}?(\d+(?:\.\d+)?)\s*%/i);
  if (revenue) metrics.push({ label: 'Revenue trend', value: `−${revenue[1]}%`, tone: 'negative' });
  const cash = text.match(/\b(?:operating cash (?:outflow|burn|used)|cash burn|negative operating cash flow|net cash used in operations)\b[^\n]{0,80}/i);
  if (cash) {
    const amount = cash[0].match(/\$\s?\d[\d,.]*\s?(?:million|billion|m\b|b\b)?/i)?.[0];
    metrics.push({ label: 'Operating cash', value: amount?.trim() ?? 'Outflow', tone: 'negative' });
  }
  if (/\b(?:current liabilities exceed current assets|negative working capital|working capital deficit)\b/i.test(text)) {
    metrics.push({ label: 'Working capital', value: 'Deficit', tone: 'negative' });
  }
  return metrics;
}

function synthesize(documentName, agents, findings) {
  const overallScore = Math.round((agents.finance.score * 0.34 + agents.legal.score * 0.40 + agents.compliance.score * 0.26) * 10) / 10;
  const highCount = findings.filter((item) => item.severity === 'high' || item.severity === 'critical').length;
  const mediumCount = findings.filter((item) => item.severity === 'medium').length;
  const recommendation = overallScore >= 8
    ? 'Do not approve as drafted. Escalate the critical issues and require a negotiated redline before execution.'
    : overallScore >= 6.5
      ? 'Resolve the high-priority issues and obtain targeted diligence before approval.'
      : overallScore >= 4.3
        ? 'Proceed only after the open moderate risks are reviewed and documented.'
        : 'No material issue matched the initial checks. Complete standard human review before execution.';
  const topFindings = [...findings]
    .sort((a, b) => (SEVERITY_WEIGHT[b.severity] ?? 0) - (SEVERITY_WEIGHT[a.severity] ?? 0))
    .slice(0, 3)
    .map((item) => item.title);
  const executiveSummary = `${documentName} received an overall risk score of ${overallScore.toFixed(1)}/10 (${riskLabel(overallScore).toLowerCase()}). The committee identified ${findings.length} review item${findings.length === 1 ? '' : 's'}: ${highCount} high/critical and ${mediumCount} moderate. ${recommendation}`;
  return {
    overallScore,
    risk: riskLabel(overallScore),
    recommendation,
    executiveSummary,
    topFindings,
    findingCounts: {
      total: findings.length,
      critical: findings.filter((item) => item.severity === 'critical').length,
      high: findings.filter((item) => item.severity === 'high').length,
      medium: mediumCount,
      low: findings.filter((item) => item.severity === 'low').length,
    },
  };
}

export async function analyzeDocument({ id = randomUUID(), documentName = 'Untitled document', text, createdAt = new Date().toISOString(), reviewContext = '' }) {
  const safeText = String(text ?? '').replace(/\u0000/g, '').trim();
  if (safeText.length < 30) throw new Error('Add at least 30 characters of document text before running the review.');
  if (safeText.length > 350_000) throw new Error('The extracted document is too long. Please submit a file under 350,000 characters.');

  // Independent agents run concurrently, then the synthesis step joins their outputs.
  const [financeFindings, legalFindingsList, complianceFindingsList] = await Promise.all([
    Promise.resolve().then(() => financialFindings(safeText)),
    Promise.resolve().then(() => legalFindings(safeText)),
    Promise.resolve().then(() => complianceFindings(safeText)),
  ]);
  const agents = {
    finance: makeAgent('finance', financeFindings, { metrics: financialMetrics(safeText) }),
    legal: makeAgent('legal', legalFindingsList),
    compliance: makeAgent('compliance', complianceFindingsList),
  };
  const findings = [agents.finance, agents.legal, agents.compliance].flatMap((agent) => agent.findings);
  const synthesis = synthesize(documentName, agents, findings);
  return {
    id,
    documentName: String(documentName || 'Untitled document').slice(0, 180),
    documentText: safeText,
    sourceType: 'uploaded',
    createdAt,
    updatedAt: new Date().toISOString(),
    status: 'pending_review',
    statusLabel: 'Pending review',
    reviewContext: String(reviewContext || '').slice(0, 2000),
    revisionCount: 0,
    reviewHistory: [{ action: 'Analysis completed', actor: 'Risk committee', at: new Date().toISOString() }],
    agents,
    findings,
    ...synthesis,
  };
}

export async function createDemoAnalysis() {
  const analysis = await analyzeDocument({
    id: 'demo-northstar',
    documentName: DEMO_DOCUMENT_NAME,
    text: DEMO_DOCUMENT_TEXT,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  });
  analysis.sourceType = 'demo';
  analysis.reviewHistory = [{ action: 'Demo analysis completed', actor: 'Risk committee', at: analysis.createdAt }];
  return analysis;
}

export function answerCommittee({ agentKey = 'legal', question = '', finding, analysis }) {
  const knownKey = AGENT_META[agentKey] ? agentKey : 'legal';
  const agent = AGENT_META[knownKey];
  const relevant = finding ?? analysis.findings.find((item) => item.agentKey === knownKey);
  let answer;
  if (relevant) {
    const questionLower = question.toLowerCase();
    if (/(why|reason|risk|concern|exposure)/i.test(questionLower)) {
      answer = `${relevant.title}: ${relevant.concern} The source language flagged was “${relevant.evidence}”${relevant.sourceType === 'absence' ? ' (this is an identified omission, not a direct quotation)' : ''}. I recommend: ${relevant.recommendation}`;
    } else if (/(redline|replace|wording|edit|change)/i.test(questionLower)) {
      answer = relevant.redline
        ? `The proposed replacement is: “${relevant.redline.after}” The edit is designed to address ${relevant.concern.toLowerCase()}`
        : `There is no drafted replacement for this item yet. The recommended action is: ${relevant.recommendation}`;
    } else {
      answer = `${relevant.concern} Based on the document, the practical next step is to ${relevant.recommendation.charAt(0).toLowerCase()}${relevant.recommendation.slice(1)}`;
    }
  } else {
    answer = `${agent.name} reviewed the submitted text using the simulator’s local clause checks. Ask about a specific finding, evidence excerpt, or suggested redline and I’ll explain how it was flagged.`;
  }
  return {
    agent: agent.short,
    answer,
    disclaimer: 'Automated diligence support only — confirm the analysis with qualified counsel and finance professionals.',
  };
}

export { AGENT_META };
