# VERITY

## Multi-Agent Due Diligence & Contract Redlining Simulator

VERITY is a local-first web application that simulates a corporate diligence committee. Upload or paste a contract, financial filing, or diligence memo; run focused finance, legal, and compliance checks; review evidence-linked findings and proposed clause replacements; then approve, reject, edit, or request another review pass.

> **Important:** VERITY is a deterministic simulation and drafting aid—not legal, financial, privacy, security, or regulatory advice. A qualified professional must validate all findings and proposed language.

## Contents

- [Quick start](#quick-start)
- [Using the application](#using-the-application)
- [What is implemented](#what-is-implemented)
- [Architecture](#architecture)
- [Supported documents](#supported-documents)
- [API reference](#api-reference)
- [Data, privacy, and security](#data-privacy-and-security)
- [Tests](#tests)
- [Troubleshooting](#troubleshooting)
- [Known limitations and production next steps](#known-limitations-and-production-next-steps)
- [Project structure](#project-structure)

## Quick start

### Requirements

- Node.js **20 or newer**
- npm (included with Node.js)

### Install and run

```bash
npm install
npm start
```

Open **http://localhost:3000**. The application starts with a sample Northstar Analytics review, so the dashboard and human-review workflow are immediately available. No API key, database server, model account, or environment file is required.

For automatic server restarts while developing:

```bash
npm run dev
```

To use another port:

```bash
PORT=4173 npm start
```

The server binds to `0.0.0.0` so it can run in a hosted preview. The app has no authentication; do not expose it to an untrusted network.

## Using the application

1. **Open Workspace** to inspect the included sample, or select **Start a new review**.
2. **Upload a supported file** or switch to **Paste text**. Extracted text is shown before analysis and can be corrected.
3. Select **Run committee review**. Finance, legal, and compliance checks run in parallel; the synthesis produces an overall score, severity counts, and next-step recommendation.
4. In the split-view workspace, select findings to locate source language, filter by severity, inspect redline proposals, and ask an agent a follow-up question.
5. **Accept, dismiss, or edit** findings. Use **Request agent re-analysis** to add reviewer context and run a new revision.
6. **Approve & export**, reject the review, or reopen a completed decision. Download a full diligence report or a redline pack as Markdown.
7. Use **Review queue** to search prior reviews and **Agent committee** to inspect the specialists’ review lenses.

## What is implemented

- Responsive dashboard with a source-document / findings split view, severity badges, evidence highlighting, filters, review queue, and agent overview.
- PDF and DOCX text extraction plus plain text, Markdown, CSV, HTML, JSON, and XML ingestion.
- Three specialist checks: financial health, contract/legal exposure, and regulatory/compliance.
- Weighted risk synthesis, executive summary, recommendations, source excerpts, identified omissions, and suggested replacement language.
- Human-in-the-loop decisions: accept, dismiss, edit wording, request a revision, approve, reject, and reopen.
- Persistent review history, revision count, reviewer notes, and finding decisions.
- Contextual committee chat that explains a selected finding or proposed redline.
- Markdown report and redline-pack downloads.
- Local JSON persistence. Up to 50 recent reviews are retained by the current server implementation.

## Architecture

```text
PDF / DOCX / text / pasted content
                │
                ▼
        Text extraction & validation
                │
                ▼
    ┌───────────┼────────────┐
    ▼           ▼            ▼
 Finance      Legal      Compliance
  checks      checks        checks
    └───────────┼────────────┘
                ▼
     Risk synthesis & redline proposals
                │
                ▼
      Human review / revision / approval
                │
                ▼
        Markdown report & redline pack
```

The Node.js service serves both the browser application and same-origin REST API. Specialist checks are implemented in `lib/analyzer.mjs`; the browser workflow is in `public/app.js`; uploaded PDF and DOCX files are extracted server-side using `pdf-parse` and `mammoth`.

### Specialist lenses

| Agent | Example checks |
| --- | --- |
| **Financial health** | Revenue contraction, operating cash outflow, working-capital deficits, debt references, and missing financial schedules. |
| **Legal exposure** | Fees-only liability caps, consequential-damages exclusions, broad indemnities, unilateral termination rights, and non-standard governing law. |
| **Regulatory & compliance** | Missing processor terms, unapproved subprocessors, unrestricted data locations, vague incident-notification timing, and indefinite retention. |

Each agent returns a risk score and findings. Findings can include the source excerpt, severity, concern, recommended action, and a proposed replacement. Missing terms are labeled as diligence gaps rather than quoted as source language.

## Supported documents

| Format | Handling | Notes |
| --- | --- | --- |
| PDF | `pdf-parse` text extraction | Must contain searchable text. Scanned/image-only PDFs need OCR first. |
| DOCX | `mammoth` raw-text extraction | Legacy `.doc` files are not supported. |
| TXT, Markdown, CSV, HTML, JSON, XML | UTF-8 text extraction | HTML tags and script/style blocks are removed before analysis. |
| Pasted text | Direct submission | Useful for SEC excerpts, filings, or sections copied from a data room. |

Limits: **20 MB per uploaded file** and **350,000 extracted characters** per review. SEC filings are not fetched automatically; upload a filing or paste the relevant text. Complex tables, cross-references, and unusual layouts may lose context during extraction.

## API reference

All endpoints are served from the same origin as the UI.

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Service status and analysis mode. |
| `GET` | `/api/demo` | Sample document name and text. |
| `POST` | `/api/upload` | Extract text from one multipart file field named `file`. |
| `GET` | `/api/analyses` | List review summaries for the queue. |
| `GET` | `/api/analyses/:id` | Fetch the full review, source text, findings, and history. |
| `POST` | `/api/analyses` | Analyze JSON `{ "documentName": "...", "text": "..." }`. |
| `PATCH` | `/api/analyses/:id/findings/:findingId` | Save a finding decision, note, or edited redline. |
| `PATCH` | `/api/analyses/:id/review` | Set `pending_review`, `revision_requested`, `approved`, or `rejected`. |
| `POST` | `/api/analyses/:id/reanalyze` | Run another pass with JSON `{ "feedback": "..." }`. |
| `POST` | `/api/analyses/:id/chat` | Explain a finding using JSON with `agentKey`, `findingId`, and `question`. |

Example health check:

```bash
curl http://localhost:3000/api/health
```

## Data, privacy, and security

- Reviews, extracted source text, and reviewer decisions are written to `.data/analyses.json` by default. `.data/` is git-ignored.
- To store data elsewhere, set `VERITY_DATA_DIR` before starting the server:

  ```bash
  VERITY_DATA_DIR=/path/to/private/reviews npm start
  ```

- The deterministic analyzer does **not** send documents to an LLM or third-party AI provider. PDF/DOCX extraction runs in the local Node process.
- This is a development/demo application: it has no login, role-based access, encryption-at-rest, multi-user isolation, or production retention controls. The server binds to all interfaces for hosted-preview compatibility. Keep it on a trusted machine/network and do not upload sensitive production documents without adding and validating suitable controls.
- Back up `.data/analyses.json` if you need to preserve review history. To restore a clean demo workspace, stop the server, remove `.data/analyses.json`, and restart it; the sample review will be seeded again.

## Tests

```bash
npm test
```

The test suite includes analyzer unit tests and a JSDOM-based UI/API integration test. The integration test starts an isolated temporary server and exercises PDF/DOCX extraction, navigation, queue search, form-based analysis, source controls, filtering, redline edits, accept/dismiss decisions, agent chat, revision, approval/rejection, exports, audit history, and queue navigation. Test data is stored in a temporary directory and removed afterward.

## Troubleshooting

- **Port already in use:** run with a different port, e.g. `PORT=4173 npm start`, then open that port.
- **“Could not connect to the local review service”:** keep the Node process running and refresh the page. The UI and API are served by the same process.
- **Scanned PDF extracts no text:** OCR the file first or paste extracted text.
- **DOCX/PDF upload fails:** confirm the file is not corrupt, encrypted, over 20 MB, or an unsupported legacy format.
- **No financial finding in a contract:** financial checks need financial data. Upload an annual filing or attach a financial schedule for more useful analysis.
- **Changes disappear after restart:** verify the server can write to `.data/` (or the directory configured by `VERITY_DATA_DIR`).

## Known limitations and production next steps

This project is a **rule-based simulator**, not a live LLM product or a production LangGraph deployment. Its domain checks are intentionally explainable and work without credentials, but they are not comprehensive: nuanced clauses, jurisdiction-specific law, non-English text, implicit cross-references, and unusual financial disclosures can be missed or misclassified. The chat responds to stored findings; it is not open-ended legal reasoning. Re-analysis reruns the same deterministic checks and records reviewer context—it does not make a model learn or change its rules.

Before production use, add authentication and authorization, encrypted storage and transport, audited access controls, configurable corporate playbooks, stronger document parsing/OCR, database-backed multi-user persistence, observability and rate limits, expert-reviewed rule coverage, and (if desired) a privacy-reviewed model provider behind an explicit opt-in. Validate all outputs with qualified counsel and diligence professionals.

## Project structure

```text
server.mjs               HTTP server, document extraction, API, persistence, review routes
lib/analyzer.mjs         Finance/legal/compliance checks, scoring, synthesis, committee chat
public/index.html        Application entry point
public/styles.css        Responsive interface styles
public/app.js            Browser UI, navigation, review actions, chat, and exports
tests/analyzer.test.mjs  Analyzer unit tests
tests/app.e2e.test.mjs   Browser/backend integration coverage
```
