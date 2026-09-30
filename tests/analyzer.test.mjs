import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeDocument, answerCommittee, createDemoAnalysis, riskLabel } from '../lib/analyzer.mjs';

test('the demo runs all three specialist checks and produces a reviewable committee brief', async () => {
  const analysis = await createDemoAnalysis();
  assert.equal(Object.keys(analysis.agents).length, 3);
  assert.ok(analysis.findings.length >= 10);
  assert.equal(analysis.status, 'pending_review');
  assert.equal(analysis.agents.finance.metrics.find((metric) => metric.label === 'Revenue trend').value, '−12%');
  assert.ok(analysis.findings.some((finding) => finding.agentKey === 'legal' && /liability cap/i.test(finding.title)));
  assert.ok(analysis.findings.some((finding) => finding.agentKey === 'compliance' && /subprocessors/i.test(finding.title)));
  assert.ok(analysis.overallScore >= 6.5 && analysis.overallScore < 8.5);
});

test('legal evidence points to clause language rather than a section heading', async () => {
  const analysis = await createDemoAnalysis();
  const indemnity = analysis.findings.find((finding) => /indemnity/i.test(finding.title));
  const termination = analysis.findings.find((finding) => /terminate unilaterally/i.test(finding.title));
  assert.match(indemnity.evidence, /Customer shall indemnify/i);
  assert.match(termination.evidence, /Provider may suspend or terminate/i);
  assert.doesNotMatch(indemnity.evidence, /^10\. INDEMNIFICATION$/i);
});

test('a short plain-language document receives transparent low-risk information-gap findings', async () => {
  const analysis = await analyzeDocument({
    documentName: 'Routine services terms',
    text: 'This agreement describes routine office cleaning services for the customer. The parties will coordinate a start date and provide written notice before making a material change.',
  });
  assert.equal(analysis.findings.length, 3);
  assert.ok(analysis.findings.every((finding) => finding.severity === 'low'));
  assert.equal(analysis.risk, 'Low');
  assert.ok(analysis.findings.some((finding) => finding.sourceType === 'absence'));
});

test('committee chat explains the selected finding and includes a professional review disclaimer', async () => {
  const analysis = await createDemoAnalysis();
  const finding = analysis.findings.find((item) => item.agentKey === 'legal' && item.redline);
  const reply = answerCommittee({ agentKey: 'legal', question: 'Why is this risky?', finding, analysis });
  assert.match(reply.answer, /fees-only cap|fees-paid cap/i);
  assert.match(reply.answer, /Source language/i);
  assert.match(reply.disclaimer, /qualified counsel/i);
});

test('risk labels map to the documented score bands', () => {
  assert.equal(riskLabel(2.5), 'Low');
  assert.equal(riskLabel(5.2), 'Moderate');
  assert.equal(riskLabel(7.1), 'High');
  assert.equal(riskLabel(9.3), 'Critical');
});
