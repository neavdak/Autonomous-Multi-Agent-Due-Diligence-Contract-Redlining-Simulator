import { createServer } from 'node:http';
import { createReadStream, promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
import { answerCommittee, analyzeDocument, createDemoAnalysis, DEMO_DOCUMENT_NAME, DEMO_DOCUMENT_TEXT } from './lib/analyzer.mjs';

const require = createRequire(import.meta.url);
const Busboy = require('busboy');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = process.env.VERITY_DATA_DIR
  ? path.resolve(process.env.VERITY_DATA_DIR)
  : path.join(__dirname, '.data');
const STORE_FILE = path.join(DATA_DIR, 'analyses.json');
const PORT = Number(process.env.PORT || 3000);
const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
const MAX_TEXT_LENGTH = 350_000;

let analyses = [];
let persistQueue = Promise.resolve();

function json(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(JSON.stringify(payload));
}

function statusLabel(status) {
  return ({
    pending_review: 'Pending review',
    revision_requested: 'Changes requested',
    approved: 'Approved',
    rejected: 'Rejected',
  })[status] ?? 'Pending review';
}

function findAnalysis(id) {
  return analyses.find((item) => item.id === id);
}

function publicSummary(item) {
  return {
    id: item.id,
    documentName: item.documentName,
    sourceType: item.sourceType,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    status: item.status,
    statusLabel: item.statusLabel,
    overallScore: item.overallScore,
    risk: item.risk,
    findingCounts: item.findingCounts,
    agents: Object.fromEntries(Object.entries(item.agents).map(([key, value]) => [key, {
      key,
      name: value.name,
      shortName: value.shortName,
      score: value.score,
      risk: value.risk,
      status: value.status,
      findingCount: value.findingCount,
    }])),
    revisionCount: item.revisionCount,
    reviewHistory: item.reviewHistory,
  };
}

async function persist() {
  const snapshot = JSON.stringify(analyses, null, 2);
  persistQueue = persistQueue.then(async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const temporary = `${STORE_FILE}.${process.pid}.tmp`;
    await fs.writeFile(temporary, snapshot, 'utf8');
    await fs.rename(temporary, STORE_FILE);
  });
  return persistQueue;
}

async function initializeStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const content = await fs.readFile(STORE_FILE, 'utf8');
    const saved = JSON.parse(content);
    analyses = Array.isArray(saved) ? saved : [];
  } catch (error) {
    if (error.code !== 'ENOENT') console.warn('Could not read the local review store; starting a fresh workspace.', error.message);
    analyses = [];
  }
  if (!analyses.length) {
    analyses = [await createDemoAnalysis()];
    await persist();
  }
}

async function readJson(req, maxBytes = 4 * 1024 * 1024) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > maxBytes) throw Object.assign(new Error('Request body is too large.'), { status: 413 });
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    throw Object.assign(new Error('Request body must be valid JSON.'), { status: 400 });
  }
}

function parseUpload(req) {
  return new Promise((resolve, reject) => {
    let parser;
    try {
      parser = Busboy({ headers: req.headers, limits: { files: 1, fileSize: MAX_UPLOAD_BYTES, fields: 2 } });
    } catch {
      reject(Object.assign(new Error('Use a multipart form to upload a document.'), { status: 400 }));
      return;
    }
    let upload = null;
    let fileError = null;
    parser.on('file', (fieldName, stream, info) => {
      if (fieldName !== 'file') {
        stream.resume();
        return;
      }
      const chunks = [];
      let size = 0;
      stream.on('data', (chunk) => {
        size += chunk.length;
        chunks.push(chunk);
      });
      stream.on('limit', () => { fileError = Object.assign(new Error('File exceeds the 20 MB upload limit.'), { status: 413 }); });
      stream.on('error', (error) => { fileError = error; });
      stream.on('end', () => {
        upload = { buffer: Buffer.concat(chunks), filename: path.basename(info.filename || 'document'), mimeType: info.mimeType || '' };
      });
    });
    parser.on('filesLimit', () => { fileError = Object.assign(new Error('Upload one document at a time.'), { status: 400 }); });
    parser.on('error', reject);
    parser.on('finish', () => {
      if (fileError) return reject(fileError);
      if (!upload?.buffer?.length) return reject(Object.assign(new Error('Choose a document to upload.'), { status: 400 }));
      resolve(upload);
    });
    req.pipe(parser);
  });
}

async function extractText(upload) {
  const extension = path.extname(upload.filename).toLowerCase();
  let text;
  if (extension === '.pdf' || upload.mimeType === 'application/pdf') {
    try {
      const parsed = await pdfParse(upload.buffer, { max: 30 });
      text = parsed.text;
    } catch (error) {
      throw Object.assign(new Error(`This PDF could not be read. Try an OCR-enabled PDF or paste its text instead. (${error.message})`), { status: 422 });
    }
  } else if (extension === '.docx' || upload.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    try {
      const parsed = await mammoth.extractRawText({ buffer: upload.buffer });
      text = parsed.value;
    } catch (error) {
      throw Object.assign(new Error(`This Word document could not be read. ${error.message}`), { status: 422 });
    }
  } else if (['.txt', '.md', '.markdown', '.csv', '.html', '.htm', '.json', '.xml'].includes(extension) || upload.mimeType.startsWith('text/')) {
    text = upload.buffer.toString('utf8');
    if (['.html', '.htm'].includes(extension)) {
      text = text.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
        .replace(/<\/(?:p|div|h[1-6]|li|tr|section|article)>/gi, '\n')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"');
    }
  } else {
    throw Object.assign(new Error('Supported files: searchable PDF, DOCX, TXT, Markdown, CSV, HTML, JSON, or XML.'), { status: 415 });
  }
  text = String(text || '').replace(/\u0000/g, '').trim();
  if (text.length < 30) {
    throw Object.assign(new Error('Very little text was extracted. If this is a scanned PDF, run OCR first or paste the text into the review form.'), { status: 422 });
  }
  if (text.length > MAX_TEXT_LENGTH) {
    throw Object.assign(new Error('The extracted text exceeds 350,000 characters. Split the document into smaller sections and retry.'), { status: 413 });
  }
  return { text, filename: upload.filename, characters: text.length };
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

async function serveStatic(req, res, pathname) {
  const requestPath = pathname === '/' ? '/index.html' : pathname;
  const decoded = decodeURIComponent(requestPath);
  const filePath = path.resolve(PUBLIC_DIR, `.${decoded}`);
  if (!filePath.startsWith(`${PUBLIC_DIR}${path.sep}`) && filePath !== path.join(PUBLIC_DIR, 'index.html')) {
    json(res, 403, { error: 'Forbidden' });
    return;
  }
  let info;
  try {
    info = await fs.stat(filePath);
  } catch {
    json(res, 404, { error: 'Not found' });
    return;
  }
  if (!info.isFile()) {
    json(res, 404, { error: 'Not found' });
    return;
  }
  res.writeHead(200, {
    'Content-Type': MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
    'Content-Length': info.size,
    'Cache-Control': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
  });
  if (req.method === 'HEAD') return res.end();
  createReadStream(filePath).pipe(res);
}

async function handleApi(req, res, url) {
  const { pathname } = url;
  if (req.method === 'GET' && pathname === '/api/health') {
    return json(res, 200, { ok: true, engine: 'local-rule-simulator', agents: 3 });
  }
  if (req.method === 'GET' && pathname === '/api/demo') {
    return json(res, 200, { documentName: DEMO_DOCUMENT_NAME, text: DEMO_DOCUMENT_TEXT });
  }
  if (req.method === 'GET' && pathname === '/api/analyses') {
    return json(res, 200, { items: [...analyses].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(publicSummary) });
  }

  const detailMatch = pathname.match(/^\/api\/analyses\/([^/]+)$/);
  if (req.method === 'GET' && detailMatch) {
    const item = findAnalysis(decodeURIComponent(detailMatch[1]));
    if (!item) return json(res, 404, { error: 'Review not found.' });
    return json(res, 200, item);
  }

  if (req.method === 'POST' && pathname === '/api/upload') {
    try {
      const upload = await parseUpload(req);
      const extracted = await extractText(upload);
      return json(res, 200, extracted);
    } catch (error) {
      return json(res, error.status || 422, { error: error.message || 'Could not read the uploaded document.' });
    }
  }

  if (req.method === 'POST' && pathname === '/api/analyses') {
    try {
      const body = await readJson(req, 5 * 1024 * 1024);
      const text = String(body.text || '').trim();
      if (!text) return json(res, 400, { error: 'Add document text before running the review.' });
      const item = await analyzeDocument({ id: randomUUID(), documentName: body.documentName, text });
      item.sourceType = body.sourceType === 'demo' ? 'demo' : 'uploaded';
      analyses.unshift(item);
      analyses = analyses.slice(0, 50);
      await persist();
      return json(res, 201, item);
    } catch (error) {
      return json(res, error.status || 400, { error: error.message || 'The analysis could not be completed.' });
    }
  }

  const nestedReviewMatch = pathname.match(/^\/api\/analyses\/([^/]+)(?:\/|$)/);
  if (!nestedReviewMatch) return json(res, 404, { error: 'API route not found.' });
  const id = decodeURIComponent(nestedReviewMatch[1]);
  const item = findAnalysis(id);
  if (!item) return json(res, 404, { error: 'Review not found.' });

  const findingMatch = pathname.match(/^\/api\/analyses\/([^/]+)\/findings\/([^/]+)$/);
  if (req.method === 'PATCH' && findingMatch) {
    try {
      const body = await readJson(req);
      const findingId = decodeURIComponent(findingMatch[2]);
      const target = item.findings.find((finding) => finding.id === findingId);
      if (!target) return json(res, 404, { error: 'Finding not found.' });
      if (body.decision && !['open', 'accepted', 'dismissed', 'edited'].includes(body.decision)) {
        return json(res, 400, { error: 'Decision must be open, accepted, dismissed, or edited.' });
      }
      target.decision = body.decision ?? target.decision;
      target.reviewerNote = String(body.reviewerNote ?? target.reviewerNote ?? '').slice(0, 1500);
      if (body.redline && typeof body.redline === 'object') {
        target.redline = {
          before: String(body.redline.before ?? target.redline?.before ?? target.evidence).slice(0, 3000),
          after: String(body.redline.after ?? target.redline?.after ?? '').slice(0, 3000),
        };
      }
      const agentFinding = item.agents[target.agentKey]?.findings?.find((finding) => finding.id === findingId);
      if (agentFinding) Object.assign(agentFinding, target);
      item.updatedAt = new Date().toISOString();
      item.reviewHistory ||= [];
      const actionLabel = ({ accepted: 'Finding accepted', dismissed: 'Finding dismissed', edited: 'Redline edited', open: 'Finding reopened' })[target.decision] || 'Finding updated';
      item.reviewHistory.push({
        action: actionLabel,
        actor: String(body.reviewer || 'Reviewer').slice(0, 80),
        note: String(body.reviewerNote || target.title).slice(0, 500),
        findingId,
        at: item.updatedAt,
      });
      await persist();
      return json(res, 200, { finding: target, reviewHistory: item.reviewHistory });
    } catch (error) {
      return json(res, error.status || 400, { error: error.message || 'Could not save finding.' });
    }
  }

  const reviewMatch = pathname.match(/^\/api\/analyses\/([^/]+)\/review$/);
  if (req.method === 'PATCH' && reviewMatch) {
    try {
      const body = await readJson(req);
      if (!['pending_review', 'revision_requested', 'approved', 'rejected'].includes(body.status)) {
        return json(res, 400, { error: 'Unsupported review status.' });
      }
      item.status = body.status;
      item.statusLabel = statusLabel(body.status);
      item.reviewerFeedback = String(body.feedback || '').slice(0, 2000);
      item.updatedAt = new Date().toISOString();
      item.reviewHistory.push({
        action: ({ approved: 'Review approved', rejected: 'Review rejected', revision_requested: 'Changes requested', pending_review: 'Review reopened' })[body.status],
        actor: String(body.reviewer || 'Reviewer').slice(0, 80),
        note: item.reviewerFeedback,
        at: item.updatedAt,
      });
      await persist();
      return json(res, 200, publicSummary(item));
    } catch (error) {
      return json(res, error.status || 400, { error: error.message || 'Could not update review.' });
    }
  }

  const reanalyzeMatch = pathname.match(/^\/api\/analyses\/([^/]+)\/reanalyze$/);
  if (req.method === 'POST' && reanalyzeMatch) {
    try {
      const body = await readJson(req);
      const feedback = String(body.feedback || '').trim();
      if (!feedback) return json(res, 400, { error: 'Add a reviewer note so the committee knows what to revisit.' });
      const revised = await analyzeDocument({
        id: item.id,
        documentName: item.documentName,
        text: item.documentText,
        createdAt: item.createdAt,
        reviewContext: feedback,
      });
      revised.sourceType = item.sourceType;
      revised.revisionCount = item.revisionCount + 1;
      revised.reviewerFeedback = feedback;
      revised.reviewHistory = [
        ...item.reviewHistory,
        { action: 'Re-analysis requested', actor: String(body.reviewer || 'Reviewer').slice(0, 80), note: feedback, at: new Date().toISOString() },
        { action: `Committee analysis refreshed · revision ${revised.revisionCount}`, actor: 'Risk committee', at: revised.updatedAt },
      ];
      const index = analyses.findIndex((entry) => entry.id === item.id);
      analyses[index] = revised;
      await persist();
      return json(res, 200, revised);
    } catch (error) {
      return json(res, error.status || 400, { error: error.message || 'Could not re-run the committee analysis.' });
    }
  }

  const chatMatch = pathname.match(/^\/api\/analyses\/([^/]+)\/chat$/);
  if (req.method === 'POST' && chatMatch) {
    try {
      const body = await readJson(req);
      const finding = item.findings.find((entry) => entry.id === body.findingId);
      const reply = answerCommittee({ agentKey: body.agentKey, question: String(body.question || ''), finding, analysis: item });
      return json(res, 200, reply);
    } catch (error) {
      return json(res, error.status || 400, { error: error.message || 'Could not reach the committee.' });
    }
  }

  return json(res, 404, { error: 'API route not found.' });
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    if (url.pathname.startsWith('/api/')) {
      await handleApi(req, res, url);
      return;
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      json(res, 405, { error: 'Method not allowed.' });
      return;
    }
    await serveStatic(req, res, url.pathname);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) json(res, error.status || 500, { error: error.message || 'Internal server error.' });
    else res.end();
  }
});

server.requestTimeout = 120_000;
server.headersTimeout = 130_000;

initializeStore().then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`VERITY Due Diligence Simulator ready on http://0.0.0.0:${PORT}`);
    console.log(`Local analysis mode · ${analyses.length} review${analyses.length === 1 ? '' : 's'} available`);
  });
}).catch((error) => {
  console.error('Could not initialize the review store:', error);
  process.exitCode = 1;
});
