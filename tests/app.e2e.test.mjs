import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { File } from 'node:buffer';
import { createServer as createNetServer } from 'node:net';
import { once } from 'node:events';
import { JSDOM } from 'jsdom';
import { createRequire } from 'node:module';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';
import { setTimeout as delay } from 'node:timers/promises';

const require = createRequire(import.meta.url);
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function reservePort() {
  const server = createNetServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const { port } = server.address();
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  return port;
}

async function waitFor(assertion, label, timeout = 6000) {
  const deadline = Date.now() + timeout;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const result = await assertion();
      if (result) return result;
    } catch (error) {
      lastError = error;
    }
    await delay(25);
  }
  throw new Error(`Timed out waiting for ${label}${lastError ? `: ${lastError.message}` : ''}`);
}

function click(window, selector) {
  const element = window.document.querySelector(selector);
  assert.ok(element, `Expected clickable element: ${selector}`);
  element.click();
  return element;
}

function enter(window, selector, value) {
  const element = window.document.querySelector(selector);
  assert.ok(element, `Expected input element: ${selector}`);
  element.value = value;
  element.dispatchEvent(new window.Event('input', { bubbles: true }));
  return element;
}

async function uploadFixture(baseUrl, filename, filePath, mimeType) {
  const bytes = await readFile(filePath);
  const form = new FormData();
  form.append('file', new Blob([bytes], { type: mimeType }), filename);
  const response = await fetch(`${baseUrl}/api/upload`, { method: 'POST', body: form });
  const result = await response.json();
  assert.equal(response.status, 200, `${filename} upload failed: ${result.error || response.status}`);
  assert.ok(result.text.length > 30);
  return result;
}

test('browser and backend complete the upload, review, revision, chat, export, and decision workflow', { timeout: 45_000 }, async (t) => {
  const port = await reservePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const temporaryData = await mkdtemp(path.join(os.tmpdir(), 'verity-e2e-'));
  const child = spawn(process.execPath, ['server.mjs'], {
    cwd: projectRoot,
    env: { ...process.env, PORT: String(port), VERITY_DATA_DIR: temporaryData },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let serverOutput = '';
  child.stdout.on('data', (chunk) => { serverOutput += chunk.toString(); });
  child.stderr.on('data', (chunk) => { serverOutput += chunk.toString(); });
  let dom;

  try {
    await waitFor(async () => {
      if (child.exitCode !== null) throw new Error(`Server exited early: ${serverOutput}`);
      const response = await fetch(`${baseUrl}/api/health`).catch(() => null);
      return response?.ok;
    }, 'backend health endpoint');

    // Verify the real upload handlers, not only the client-side form.
    const pdfPackage = path.dirname(require.resolve('pdf-parse'));
    const mammothPackage = path.dirname(require.resolve('mammoth'));
    const pdf = await uploadFixture(baseUrl, 'sample.pdf', path.join(pdfPackage, 'test/data/01-valid.pdf'), 'application/pdf');
    const docx = await uploadFixture(baseUrl, 'sample.docx', path.join(mammothPackage, '../test/test-data/tables.docx'), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    assert.match(pdf.text, /Trace-based Just-in-Time Type Specialization/i);
    assert.match(docx.text, /Top left/);

    const html = await readFile(path.join(projectRoot, 'public/index.html'), 'utf8');
    const appScript = await readFile(path.join(projectRoot, 'public/app.js'), 'utf8');
    dom = new JSDOM(html, { url: `${baseUrl}/`, runScripts: 'outside-only', pretendToBeVisual: true });
    const { window } = dom;
    const browserErrors = [];
    const downloads = [];
    window.Headers = Headers;
    window.FormData = FormData;
    window.fetch = (input, options) => fetch(new URL(input, window.location.href), options);
    window.URL.createObjectURL = () => 'blob:verity-test';
    window.URL.revokeObjectURL = () => {};
    let copiedSource = '';
    Object.defineProperty(window.navigator, 'clipboard', { configurable: true, value: { writeText: async (text) => { copiedSource = text; } } });
    window.HTMLAnchorElement.prototype.click = function recordDownload() { downloads.push(this.download); };
    window.addEventListener('error', (event) => browserErrors.push(event.error?.stack || event.message));
    window.eval(appScript);

    await waitFor(() => window.document.querySelector('.workbench'), 'initial demo review render');
    assert.match(window.document.querySelector('.page-title').textContent, /Northstar Analytics/);
    assert.equal(window.document.querySelectorAll('.agent-mini').length, 3);

    // Navigation, queue search, and agent committee page.
    click(window, '[data-route="queue"]');
    assert.ok(window.document.querySelector('.queue-card'));
    enter(window, '#queue-search', 'northstar');
    assert.equal(window.document.querySelectorAll('.queue-row:not([hidden])').length, 1);
    enter(window, '#queue-search', 'no-review-matches-this');
    assert.equal(window.document.querySelectorAll('.queue-row:not([hidden])').length, 0);
    assert.equal(window.document.querySelector('.queue-no-results').hidden, false);
    click(window, '[data-route="agents"]');
    assert.equal(window.document.querySelectorAll('.agent-profile-card').length, 3);
    click(window, '[data-action="open-chat-agent"]');
    assert.ok(window.document.querySelector('.chat-panel'));
    click(window, '[data-action="close-chat"]');

    // Create a new review through the actual form and run all three analyzers.
    click(window, '[data-route="review"]');
    click(window, '[data-action="new-review"]');
    const browserFile = new File(['Uploaded text from the browser flow. It contains enough text to verify server-side extraction.'], 'browser-upload.txt', { type: 'text/plain' });
    Object.defineProperty(window.document.querySelector('#upload-input'), 'files', { configurable: true, value: [browserFile] });
    window.document.querySelector('#upload-input').dispatchEvent(new window.Event('change', { bubbles: true }));
    await waitFor(() => window.document.querySelector('#document-text')?.value.includes('server-side extraction'), 'browser file upload and preview');
    assert.ok(window.document.querySelector('#document-name').value.includes('browser upload'));
    click(window, '[data-action="close-modal"]');

    click(window, '[data-action="new-review"]');
    click(window, '[data-action="source-mode"][data-mode="paste"]');
    const source = [
      'MASTER SERVICES AGREEMENT',
      '1. SERVICES. Provider processes Customer personal data to provide the Services.',
      '2. LIABILITY. TOTAL AGGREGATE LIABILITY SHALL NOT EXCEED FEES PAID IN THE PAST 12 MONTHS.',
      'Provider excludes all indirect and consequential damages.',
      '3. INDEMNITY. Customer shall indemnify Provider from any and all claims, including claims caused by Provider negligence.',
      '4. TERM. Provider may terminate this agreement at any time in its sole discretion without notice.',
      '5. DATA. Provider may engage subprocessors without Customer prior written consent.',
      '6. LAW. This Agreement is governed by the laws of the Cayman Islands.',
      ...Array.from({ length: 30 }, (_, index) => `Appendix note ${index + 1}: operational details for document scrolling.`),
    ].join('\n');
    enter(window, '#document-name', 'E2E Vendor Agreement');
    enter(window, '#document-text', source);
    assert.equal(window.document.querySelector('[data-action="run-analysis"]').disabled, false);
    click(window, '[data-action="run-analysis"]');
    await waitFor(() => window.document.querySelector('.page-title')?.textContent === 'E2E Vendor Agreement', 'new analysis render');
    assert.ok(window.document.querySelectorAll('.finding-item').length >= 5);
    assert.ok(window.document.querySelector('.score-number'));
    click(window, '[data-action="copy-source"]');
    await waitFor(() => copiedSource === source, 'copy source control');

    // Source expansion, severity filter, and redline tab.
    click(window, '[data-action="toggle-document"]');
    assert.ok(window.document.querySelectorAll('.document-line').length > 26);
    click(window, '[data-action="toggle-document"]');
    click(window, '[data-action="set-filter"][data-filter="high"]');
    assert.ok(window.document.querySelectorAll('.finding-item').length >= 1);
    click(window, '[data-action="set-tab"][data-tab="redlines"]');
    assert.ok(window.document.querySelectorAll('.finding-item').length >= 1);
    click(window, '[data-action="export-redlines"]');
    assert.ok(downloads.some((filename) => filename.endsWith('-redlines.md')));

    // Edit and accept a proposed replacement; verify it is persisted by the API.
    click(window, '[data-action="edit-finding"]');
    const originalReplacement = window.document.querySelector('#redline-text').value;
    enter(window, '#redline-text', `${originalReplacement} Reviewer-added sentence.`);
    enter(window, '#redline-note', 'Aligned to internal policy in e2e test.');
    click(window, '[data-action="save-redline"]');
    await waitFor(() => [...window.document.querySelectorAll('.finding-item.expanded .decision-note')].some((note) => note.textContent.includes('Redline modified')), 'edited redline save');
    click(window, '[data-action="set-decision"][data-decision="open"]');
    await waitFor(() => window.document.querySelector('[data-action="set-decision"][data-decision="accepted"]'), 'finding reopened');
    click(window, '[data-action="set-decision"][data-decision="accepted"]');
    await waitFor(() => window.document.querySelector('[data-action="set-decision"][data-decision="open"]'), 'finding acceptance');
    click(window, '[data-action="set-tab"][data-tab="findings"]');
    click(window, '[data-action="set-decision"][data-decision="dismissed"]');
    await waitFor(() => window.document.querySelector('[data-action="set-decision"][data-decision="open"]'), 'finding dismissal');

    let listResponse = await fetch(`${baseUrl}/api/analyses`);
    let reviews = (await listResponse.json()).items;
    const created = reviews.find((item) => item.documentName === 'E2E Vendor Agreement');
    assert.ok(created, 'new review should be persisted in the local store');
    let detail = await (await fetch(`${baseUrl}/api/analyses/${created.id}`)).json();
    assert.ok(detail.findings.some((finding) => finding.decision === 'accepted'));
    assert.ok(detail.findings.some((finding) => finding.decision === 'accepted' && finding.reviewerNote.includes('internal policy') && finding.redline.after.includes('Reviewer-added sentence.')));
    assert.ok(detail.findings.some((finding) => finding.decision === 'dismissed'));

    // Contextual agent chat returns an answer for the selected finding.
    click(window, '[data-action="ask-agent"]');
    enter(window, '#chat-input', 'Why is this risky?');
    window.document.querySelector('#chat-form').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    await waitFor(() => window.document.querySelector('.chat-message.assistant'), 'agent chat answer');
    assert.match(window.document.querySelector('.chat-message.assistant .chat-bubble').textContent, /Source language/i);
    click(window, '[data-action="close-chat"]');

    // Human revision loop reruns the committee and records reviewer context.
    click(window, '[data-action="request-revision"]');
    enter(window, '#review-feedback', 'Please confirm this liability cap against the approved policy.');
    assert.equal(window.document.querySelector('[data-action="submit-review-note"]').disabled, false);
    click(window, '[data-action="submit-review-note"]');
    await waitFor(() => window.document.querySelector('.page-subtitle')?.textContent.includes('Revision 1'), 'revision pass');
    detail = await (await fetch(`${baseUrl}/api/analyses/${created.id}`)).json();
    assert.equal(detail.revisionCount, 1);
    assert.ok(detail.reviewHistory.some((entry) => entry.action === 'Re-analysis requested'));
    assert.match(detail.reviewerFeedback, /approved policy/);

    // Approve/export, reopen, reject, and export a final report.
    click(window, '[data-action="approve-export"]');
    await waitFor(() => window.document.querySelector('.status-pill.approved'), 'approval status');
    assert.ok(downloads.some((filename) => filename.endsWith('-diligence-report.md')));
    click(window, '[data-action="reopen-review"]');
    await waitFor(() => window.document.querySelector('.status-pill.pending_review'), 'reopened review status');
    click(window, '[data-action="open-reject"]');
    enter(window, '#review-feedback', 'Rejected in the end-to-end test.');
    click(window, '[data-action="submit-review-note"]');
    await waitFor(() => window.document.querySelector('.status-pill.rejected'), 'rejection status');
    click(window, '[data-action="toggle-history"]');
    assert.ok(window.document.querySelectorAll('.history-item').length >= 5);
    assert.ok([...window.document.querySelectorAll('.history-item')].some((item) => item.textContent.includes('Review rejected')));
    click(window, '[data-action="export-report"]');
    assert.equal(downloads.length, 3);

    // Queue selection routes back to the saved review, and no browser-side exceptions occurred.
    click(window, '[data-route="queue"]');
    enter(window, '#queue-search', 'E2E Vendor Agreement');
    const reviewRow = window.document.querySelector('.queue-row:not([hidden])');
    assert.ok(reviewRow);
    reviewRow.click();
    await waitFor(() => window.document.querySelector('.page-title')?.textContent === 'E2E Vendor Agreement', 'queue review navigation');
    assert.equal(window.document.querySelector('.status-pill.rejected').textContent.trim(), 'Rejected');
    const persistedReviews = JSON.parse(await readFile(path.join(temporaryData, 'analyses.json'), 'utf8'));
    const persistedReview = persistedReviews.find((item) => item.id === created.id);
    assert.equal(persistedReview.status, 'rejected');
    assert.ok(persistedReview.reviewHistory.some((entry) => entry.action === 'Review rejected'));
    assert.deepEqual(browserErrors, []);
    t.diagnostic('PDF/DOCX extraction and the browser-driven human review lifecycle passed.');
  } finally {
    dom?.window.close();
    if (child.exitCode === null) {
      child.kill('SIGTERM');
      await Promise.race([once(child, 'exit'), delay(2000)]);
      if (child.exitCode === null) child.kill('SIGKILL');
    }
    await rm(temporaryData, { recursive: true, force: true });
  }
});
