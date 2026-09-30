const SVG = {
  logo: '<path d="M6 18.5 8.2 5.8l3.7 6.1 3.8-6.1L18 18.5"/><path d="M8.2 5.8h7.5M9.5 15.2h5"/>',
  grid: '<rect x="3.4" y="3.4" width="7.1" height="7.1" rx="1.5"/><rect x="13.5" y="3.4" width="7.1" height="7.1" rx="1.5"/><rect x="3.4" y="13.5" width="7.1" height="7.1" rx="1.5"/><rect x="13.5" y="13.5" width="7.1" height="7.1" rx="1.5"/>',
  inbox: '<path d="M4 4.8h16v14.4H4z"/><path d="M4 13.4h4.1l1.5 2h4.8l1.5-2H20"/><path d="M8 8.5h8"/>',
  agents: '<circle cx="9" cy="8" r="3"/><path d="M3.8 19.5v-1.2a5.2 5.2 0 0 1 10.4 0v1.2"/><path d="M16 5.4a3 3 0 0 1 0 5.7M17.5 14a4.6 4.6 0 0 1 2.7 4.2v1.3"/>',
  file: '<path d="M6 3.8h7l5 5v11.4H6z"/><path d="M13 3.8v5h5M8.8 13h6.4M8.8 16h6.4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.4"/><path d="m15.5 15.5 4 4"/>',
  download: '<path d="M12 3.8v11.5M7.5 11l4.5 4.5 4.5-4.5"/><path d="M5 19.5h14"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chevron: '<path d="m7 9.5 5 5 5-5"/>',
  chevronRight: '<path d="m9 5 7 7-7 7"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  chart: '<path d="M4 19.5h16"/><path d="M6.5 16V9.5M12 16V5M17.5 16v-4.5"/><circle cx="6.5" cy="8" r="1"/><circle cx="12" cy="4" r="1"/><circle cx="17.5" cy="10" r="1"/>',
  scale: '<path d="M12 4v15M7 20h10M5 7h14M8 7l-3 6h6L8 7ZM16 7l-3 6h6l-3-6Z"/><path d="M12 4 9.8 6M12 4l2.2 2"/>',
  shield: '<path d="M12 3.5 19 6v5.1c0 4.5-2.8 7.8-7 9.4-4.2-1.6-7-4.9-7-9.4V6l7-2.5Z"/><path d="m9 12 2 2 4.2-4.2"/>',
  check: '<path d="m5 12.5 4.1 4.1L19.5 6.7"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12.2 2.7 2.7 5.4-5.7"/>',
  alert: '<path d="M12 3.5 21 20H3l9-16.5Z"/><path d="M12 9v4.5M12 17h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 10.5v5M12 7.5h.01"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.6 2"/>',
  chat: '<path d="M20 11.2a7.7 7.7 0 0 1-8 7.4 8.5 8.5 0 0 1-3.3-.7L4 19l1.2-3.9A7.1 7.1 0 0 1 4 11.2a7.7 7.7 0 0 1 8-7.4 7.7 7.7 0 0 1 8 7.4Z"/><path d="M8 10h8M8 13h5"/>',
  send: '<path d="m21 3-7.2 18-3.4-7.4L3 10.2 21 3Z"/><path d="M10.4 13.6 21 3"/>',
  spark: '<path d="m12 3-1.1 5.2L6 10l4.9 1.7L12 17l1.1-5.3L18 10l-4.9-1.8L12 3Z"/><path d="m19 15-.6 2.2L16 18l2.4.8L19 21l.6-2.2L22 18l-2.4-.8L19 15ZM5 3l-.5 2L2.5 5.5l2 .5L5 8l.5-2 2-.5-2-.5L5 3Z"/>',
  edit: '<path d="m4 16.5-.8 4.3 4.3-.8L19.8 7.7a2.2 2.2 0 0 0-3.1-3.1L4 16.5Z"/><path d="m14.9 6.4 3.1 3.1"/>',
  closeCircle: '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
  upload: '<path d="M12 15V4.5M7.5 9 12 4.5 16.5 9"/><path d="M5 14.5v4h14v-4"/>',
  fileCheck: '<path d="M6 3.8h7l5 5v11.4H6z"/><path d="M13 3.8v5h5M8.5 14l2.1 2.1 4.5-4.5"/>',
  dots: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
};

const icon = (name, size = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SVG[name] || SVG.spark}</svg>`;
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

const AGENTS = [
  { key: 'finance', title: 'Financial health', icon: 'chart', role: 'Senior M&A financial auditor', color: 'finance', lens: 'Cash runway · leverage · working capital · revenue quality' },
  { key: 'legal', title: 'Legal exposure', icon: 'scale', role: 'Corporate M&A counsel', color: 'legal', lens: 'Liability allocation · indemnity · termination · governing law' },
  { key: 'compliance', title: 'Regulatory & compliance', icon: 'shield', role: 'Chief compliance officer', color: 'compliance', lens: 'Privacy · data residency · subprocessors · incident response' },
];

const state = {
  analyses: [], activeAnalysis: null, route: 'review', activeTab: 'findings', findingFilter: 'all',
  selectedFindingId: null, expandedDocument: false, historyExpanded: false, sidebarOpen: false,
  queueQuery: '', modal: null, chatOpen: false, chatAgentKey: 'legal', chatFindingId: null,
  chatMessages: [], chatBusy: false, toastTimer: null,
};

async function api(url, options = {}) {
  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const response = await fetch(url, { ...options, headers });
  let payload = {};
  try { payload = await response.json(); } catch {}
  if (!response.ok) throw new Error(payload.error || `Request failed (${response.status})`);
  return payload;
}

async function loadAnalyses() {
  const result = await api('/api/analyses');
  state.analyses = result.items || [];
  return state.analyses;
}

function preferredFindingId(analysis) {
  return (analysis?.findings?.find((finding) => finding.agentKey === 'legal' && finding.redline)
    || analysis?.findings?.find((finding) => finding.severity === 'high')
    || analysis?.findings?.[0])?.id || null;
}

async function loadAnalysis(id, render = true) {
  const analysis = await api(`/api/analyses/${encodeURIComponent(id)}`);
  state.activeAnalysis = analysis;
  if (!analysis.findings?.some((finding) => finding.id === state.selectedFindingId)) state.selectedFindingId = preferredFindingId(analysis);
  if (render) renderApp();
  return analysis;
}

function timeAgo(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently';
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 50) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  if (seconds < 172800) return 'Yesterday';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function dateTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function statusText(item) {
  return item.statusLabel || ({ pending_review: 'Pending review', revision_requested: 'Changes requested', approved: 'Approved', rejected: 'Rejected' })[item.status] || 'Pending review';
}

function statusPill(item) {
  return `<span class="status-pill ${escapeHTML(item.status || 'pending_review')}">${escapeHTML(statusText(item))}</span>`;
}

function riskTag(score, risk) {
  const label = risk || (score >= 8.5 ? 'Critical' : score >= 6.5 ? 'High' : score >= 4.3 ? 'Moderate' : 'Low');
  return `<span class="risk-tag ${escapeHTML(label.toLowerCase())}">${escapeHTML(label)} risk</span>`;
}

function renderSidebar() {
  const ordered = [...state.analyses].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const pending = ordered.filter((item) => ['pending_review', 'revision_requested'].includes(item.status)).length;
  const nav = [
    { route: 'review', label: 'Workspace', icon: 'grid' },
    { route: 'queue', label: 'Review queue', icon: 'inbox', count: pending || '' },
    { route: 'agents', label: 'Agent committee', icon: 'agents' },
  ];
  $('#sidebar').innerHTML = `
    <div class="brand"><div class="brand-mark">${icon('logo', 20)}</div><div class="brand-copy"><span class="brand-name">VERITY</span><span class="brand-caption">RISK INTELLIGENCE</span></div></div>
    <div class="sidebar-label">Workspace</div><nav class="sidebar-nav" aria-label="Main navigation">${nav.map((item) => `<button class="nav-button ${state.route === item.route ? 'active' : ''}" data-route="${item.route}">${icon(item.icon, 17)}<span class="nav-label">${item.label}</span>${item.count ? `<span class="nav-count">${item.count}</span>` : ''}</button>`).join('')}</nav>
    <div class="sidebar-divider"></div><div class="sidebar-label">Recent reviews</div>
    <div class="sidebar-recent">${ordered.slice(0, 5).map((item) => `<button class="recent-button ${state.activeAnalysis?.id === item.id ? 'active' : ''}" data-review-id="${escapeHTML(item.id)}"><span class="recent-dot ${escapeHTML(item.status)}"></span><span><span class="recent-name">${escapeHTML(item.documentName)}</span><span class="recent-time">${escapeHTML(timeAgo(item.createdAt))} · ${escapeHTML(statusText(item))}</span></span></button>`).join('') || '<div class="recent-time" style="padding:8px 10px">No reviews yet</div>'}</div>
    <div class="sidebar-spacer"></div><button class="sidebar-new" data-action="new-review">${icon('plus', 16)} Start a new review</button>
    <div class="sidebar-profile"><div class="avatar">SC</div><div class="profile-copy"><div class="profile-name">Sarah Chen</div><div class="profile-role">Legal operations</div></div><span class="profile-menu">${icon('dots', 15)}</span></div>`;
}

function renderTopbar() {
  const page = state.route === 'queue' ? 'Review queue' : state.route === 'agents' ? 'Agent committee' : 'Review workspace';
  $('#topbar').innerHTML = `<div class="topbar-left"><button class="mobile-menu" data-action="toggle-sidebar" aria-label="Open navigation">${icon('menu', 18)}</button><span>Workspace</span><span class="breadcrumb-slash">/</span><span class="breadcrumb-current">${page}</span></div><div class="topbar-right"><button class="topbar-tool" data-action="open-queue">${icon('search', 15)}<span class="topbar-tool-label">Find a review</span></button><span class="topbar-rule"></span><div class="topbar-user"><div class="avatar">SC</div><span class="topbar-user-name">Sarah Chen</span></div></div>`;
}

function renderHeader({ eyebrow, title, subtitle, actions = '' }) {
  return `<div class="page-heading"><div><div class="eyebrow"><span class="eyebrow-dot"></span>${eyebrow}</div><h1 class="page-title">${title}</h1><p class="page-subtitle">${subtitle}</p></div><div class="heading-actions">${actions}</div></div>`;
}

function renderAgentMini(agent, key) {
  if (!agent) return '';
  const meta = AGENTS.find((item) => item.key === key);
  return `<button class="agent-mini" data-agent-card="${key}"><span class="agent-icon ${key === 'legal' ? 'legal' : key === 'compliance' ? 'compliance' : ''}">${icon(meta?.icon || 'spark', 16)}</span><span class="agent-mini-copy"><span class="agent-mini-title">${escapeHTML(agent.shortName || agent.name)}</span><span class="agent-mini-sub">${escapeHTML(agent.summary || `${agent.findingCount || 0} diligence signals identified`)}</span></span><span class="agent-mini-score"><strong>${Number(agent.score || 0).toFixed(1)}</strong><span>risk score</span></span><span class="agent-complete">${icon('checkCircle', 10)} Complete</span></button>`;
}

function severityCount(analysis, type) {
  const counts = analysis.findingCounts || {};
  if (type === 'high') return (counts.high || 0) + (counts.critical || 0);
  if (type === 'medium') return counts.medium || 0;
  return counts.total ?? analysis.findings?.length ?? 0;
}

function renderSummary(analysis) {
  const open = analysis.findings.filter((item) => item.decision === 'open').length;
  return `<section class="summary-card" aria-label="Executive risk summary">
    <div class="score-block"><div class="score-ring" style="--score:${Math.round(analysis.overallScore * 10)}%"><span class="score-number">${Number(analysis.overallScore).toFixed(1)}</span></div><div class="score-meta"><div class="score-label">Overall risk ${riskTag(analysis.overallScore, analysis.risk)}</div><div class="score-caption">Weighted across three independent reviews</div></div></div>
    <div class="summary-copy"><div class="summary-copy-label">Committee recommendation</div><p>${escapeHTML(analysis.executiveSummary || 'The committee reviewed this submission and assembled the following findings.')}</p><p class="recommendation">${escapeHTML(analysis.recommendation || 'Complete the open human review before execution.')}</p></div>
    <div class="summary-stats"><div class="summary-stat"><span class="summary-stat-value">${analysis.findings.length}</span><span class="summary-stat-label">Findings</span></div><div class="summary-stat"><span class="summary-stat-value high">${severityCount(analysis, 'high')}</span><span class="summary-stat-label">High risk</span></div><div class="summary-stat"><span class="summary-stat-value medium">${severityCount(analysis, 'medium')}</span><span class="summary-stat-label">Moderate</span></div><div class="summary-stat"><span class="summary-stat-value">${open}</span><span class="summary-stat-label">Open items</span></div></div>
  </section><section class="agent-strip" aria-label="Agent results">${['finance', 'legal', 'compliance'].map((key) => renderAgentMini(analysis.agents[key], key)).join('')}</section>`;
}

function selectedFinding(analysis) {
  return analysis.findings.find((finding) => finding.id === state.selectedFindingId) || null;
}

function highlightEvidence(line, finding) {
  if (!finding || finding.sourceType === 'absence' || !finding.evidence) return escapeHTML(line);
  const evidence = String(finding.evidence).trim();
  const candidate = evidence.length > 80 ? evidence.slice(0, 72) : evidence;
  const index = line.toLowerCase().indexOf(candidate.toLowerCase());
  if (index < 0) return escapeHTML(line);
  return `${escapeHTML(line.slice(0, index))}<mark class="source-mark">${escapeHTML(line.slice(index, index + candidate.length))}</mark>${escapeHTML(line.slice(index + candidate.length))}`;
}

function renderDocument(analysis) {
  const finding = selectedFinding(analysis);
  const allLines = String(analysis.documentText || '').split(/\r?\n/);
  const lines = state.expandedDocument ? allLines : allLines.slice(0, Math.min(26, allLines.length));
  const rows = lines.map((line, index) => {
    const prefix = String(finding?.evidence || '').slice(0, Math.min(72, String(finding?.evidence || '').length)).toLowerCase();
    const located = Boolean(prefix && finding?.sourceType !== 'absence' && line.toLowerCase().includes(prefix));
    const heading = /^(?:\d+(?:\.\d+)*\s+[A-Z]|(?:MASTER SERVICES|APPENDIX|EXHIBIT|SCHEDULE|FINANCIAL SNAPSHOT))/i.test(line.trim());
    return `<div class="document-line ${located ? 'is-selected' : ''} ${heading ? 'heading' : ''}"><span class="line-no">${String(index + 1).padStart(2, '0')}</span><span class="line-text">${line.trim() ? highlightEvidence(line, finding) : '&nbsp;'}</span></div>`;
  }).join('');
  const evidenceHint = finding?.sourceType === 'absence' ? 'Requirement not found in source text' : finding ? `Source · ${escapeHTML(finding.section || finding.agent)}` : 'Select a finding to locate its source';
  return `<section class="workbench-pane document-pane"><header class="pane-header"><div class="pane-heading"><span class="pane-heading-icon">${icon('file', 16)}</span><span class="pane-title-wrap"><span class="pane-title">Original document</span><span class="pane-kicker">Source text · ${escapeHTML(analysis.sourceType === 'demo' ? 'Sample agreement' : 'Extracted text')}</span></span></div><div class="pane-header-actions"><button class="icon-button" data-action="copy-source" title="Copy document text">${icon('fileCheck', 15)}</button></div></header><div class="document-context"><span class="document-context-label">${icon('search', 12)} ${evidenceHint}</span><span class="document-count">${allLines.length} lines</span></div><div class="document-scroll" id="document-scroll">${rows}</div><footer class="document-footer"><span>${escapeHTML(analysis.documentName)}</span>${allLines.length > 26 ? `<button class="text-link" data-action="toggle-document">${state.expandedDocument ? 'Show less' : `View all ${allLines.length} lines`} ${icon('chevron', 12)}</button>` : `<span>${(analysis.documentText || '').length.toLocaleString()} chars</span>`}</footer></section>`;
}

function renderFindingDetail(finding) {
  const absence = finding.sourceType === 'absence';
  const decisionText = finding.decision === 'accepted' ? 'Redline accepted' : finding.decision === 'edited' ? 'Redline modified' : finding.decision === 'dismissed' ? 'Dismissed by reviewer' : '';
  const redline = finding.redline ? `<div class="redline-preview"><div class="diff-side"><span class="diff-label">Current language</span><span class="diff-text">${escapeHTML(finding.redline.before || finding.evidence || '—')}</span></div><div class="diff-side after"><span class="diff-label">Suggested replacement</span><span class="diff-text">${escapeHTML(finding.redline.after || finding.recommendation || '—')}</span></div></div>` : `<div class="finding-evidence" style="border-color:#c8d9cd;background:#f8fbf8"><span class="evidence-label" style="color:#64816e">Recommended action</span>${escapeHTML(finding.recommendation || 'Review with the responsible team.')}</div>`;
  const decisionButton = ['accepted', 'edited'].includes(finding.decision)
    ? `<button class="button button-small button-secondary" data-action="set-decision" data-decision="open" data-finding-id="${escapeHTML(finding.id)}">${icon('check', 13)} Accepted</button>`
    : finding.decision === 'dismissed'
      ? `<button class="button button-small button-secondary" data-action="set-decision" data-decision="open" data-finding-id="${escapeHTML(finding.id)}">Reopen</button>`
      : `<button class="button button-small button-quiet" data-action="set-decision" data-decision="dismissed" data-finding-id="${escapeHTML(finding.id)}">Dismiss</button><button class="button button-small button-primary" data-action="set-decision" data-decision="accepted" data-finding-id="${escapeHTML(finding.id)}">${icon('check', 13)} ${finding.redline ? 'Accept edit' : 'Mark reviewed'}</button>`;
  return `<div class="finding-detail"><p class="finding-detail-copy">${escapeHTML(finding.concern || finding.recommendation || '')}</p><div class="finding-evidence ${absence ? 'absence-note' : ''}"><span class="evidence-label">${absence ? 'Diligence gap · not a source quotation' : `Source language · ${escapeHTML(finding.section || 'Document')}`}</span>${escapeHTML(finding.evidence || 'No evidence excerpt available.')}</div>${redline}${finding.reviewerNote ? `<p class="decision-note">Reviewer note: ${escapeHTML(finding.reviewerNote)}</p>` : ''}<div class="finding-actions"><button class="button button-quiet button-small" data-action="ask-agent" data-agent="${escapeHTML(finding.agentKey)}" data-finding-id="${escapeHTML(finding.id)}">${icon('chat', 13)} Ask ${escapeHTML(finding.agent)}</button>${finding.redline ? `<button class="button button-quiet button-small" data-action="edit-finding" data-finding-id="${escapeHTML(finding.id)}">${icon('edit', 13)} Edit wording</button>` : ''}<span class="spacer"></span>${decisionButton}</div>${decisionText ? `<p class="decision-note">${icon('check', 11)} ${decisionText}</p>` : ''}</div>`;
}

function renderFindingItem(finding, redlineMode = false) {
  const expanded = finding.id === state.selectedFindingId;
  const tone = finding.agentKey === 'legal' ? 'legal' : finding.agentKey === 'compliance' ? 'compliance' : '';
  const decisionTag = finding.decision !== 'open' ? `<span class="finding-agent">${escapeHTML(finding.decision === 'dismissed' ? 'Dismissed' : finding.decision === 'edited' ? 'Edited' : 'Accepted')}</span>` : '';
  const subtitle = redlineMode ? `${finding.section || finding.category} · Suggested language ready` : finding.concern || finding.recommendation || '';
  return `<article class="finding-item ${expanded ? 'expanded' : ''}" data-item-finding="${escapeHTML(finding.id)}"><button class="finding-summary" data-action="select-finding" data-finding-id="${escapeHTML(finding.id)}" aria-expanded="${expanded}"><span class="finding-summary-icon">${icon(AGENTS.find((agent) => agent.key === finding.agentKey)?.icon || 'spark', 13)}</span><span class="finding-main"><span class="finding-heading-row"><span class="severity-label ${escapeHTML(finding.severity)}">${escapeHTML(finding.severity)}</span><span class="finding-title">${escapeHTML(finding.title)}</span></span><span class="finding-subtitle">${escapeHTML(subtitle)}</span></span><span class="finding-side"><span class="finding-agent ${tone}">${escapeHTML(finding.agent)}</span>${decisionTag}<span class="finding-chevron">${icon('chevron', 13)}</span></span></button>${expanded ? renderFindingDetail(finding) : ''}</article>`;
}

function visibleFindings(analysis, redlinesOnly = false) {
  const findings = redlinesOnly ? analysis.findings.filter((finding) => finding.redline) : analysis.findings;
  return findings.filter((finding) => {
    if (state.findingFilter === 'high') return ['high', 'critical'].includes(finding.severity);
    if (state.findingFilter === 'medium') return finding.severity === 'medium';
    if (state.findingFilter === 'low') return finding.severity === 'low';
    if (state.findingFilter === 'open') return finding.decision === 'open';
    return true;
  });
}

function renderFindingsPane(analysis) {
  const redlines = analysis.findings.filter((finding) => finding.redline);
  const shown = visibleFindings(analysis, state.activeTab === 'redlines');
  const open = analysis.findings.filter((finding) => finding.decision === 'open').length;
  const high = analysis.findings.filter((finding) => ['high', 'critical'].includes(finding.severity)).length;
  const medium = analysis.findings.filter((finding) => finding.severity === 'medium').length;
  const low = analysis.findings.filter((finding) => finding.severity === 'low').length;
  const list = shown.length ? shown.map((finding) => renderFindingItem(finding, state.activeTab === 'redlines')).join('') : `<div class="empty-state" style="padding:36px 16px"><div class="empty-state-icon">${icon(state.activeTab === 'redlines' ? 'edit' : 'checkCircle', 20)}</div><div class="empty-state-title">No items in this filter</div><p>Choose another severity or start a new review.</p></div>`;
  return `<section class="workbench-pane findings-pane"><div class="findings-tabs"><button class="findings-tab ${state.activeTab === 'findings' ? 'active' : ''}" data-action="set-tab" data-tab="findings">Findings <span class="tab-count">${analysis.findings.length}</span></button><button class="findings-tab ${state.activeTab === 'redlines' ? 'active' : ''}" data-action="set-tab" data-tab="redlines">Redlines <span class="tab-count">${redlines.length}</span></button></div><div class="filter-row"><div class="filter-options"><button class="filter-chip ${state.findingFilter === 'all' ? 'active' : ''}" data-action="set-filter" data-filter="all">All <span class="chip-num">${state.activeTab === 'redlines' ? redlines.length : analysis.findings.length}</span></button><button class="filter-chip ${state.findingFilter === 'high' ? 'active' : ''}" data-action="set-filter" data-filter="high">High <span class="chip-num">${high}</span></button><button class="filter-chip ${state.findingFilter === 'medium' ? 'active' : ''}" data-action="set-filter" data-filter="medium">Moderate <span class="chip-num">${medium}</span></button><button class="filter-chip ${state.findingFilter === 'low' ? 'active' : ''}" data-action="set-filter" data-filter="low">Low <span class="chip-num">${low}</span></button></div><span class="open-count">${open} open</span>${state.activeTab === 'redlines' ? `<button class="button button-quiet button-small" data-action="export-redlines">${icon('download', 12)} Export redlines</button>` : ''}</div><div class="finding-list" id="finding-list">${list}</div></section>`;
}

function renderHistory(analysis) {
  const history = analysis.reviewHistory || [];
  const items = [...history].reverse();
  return `<section class="review-history"><button class="history-toggle" data-action="toggle-history" aria-expanded="${state.historyExpanded}">${icon('clock', 14)} <span>Review history</span><span class="tab-count">${history.length}</span><span class="history-chevron">${icon('chevron', 13)}</span></button>${state.historyExpanded ? `<div class="history-list">${items.length ? items.map((item) => `<div class="history-item"><span class="history-dot"></span><div class="history-content"><div class="history-heading"><strong>${escapeHTML(item.action)}</strong><span>${escapeHTML(timeAgo(item.at))}</span></div><div class="history-meta">${escapeHTML(item.actor || 'Reviewer')} · ${escapeHTML(dateTime(item.at))}</div>${item.note ? `<div class="history-note">${escapeHTML(item.note)}</div>` : ''}</div></div>`).join('') : '<p class="history-empty">No review activity yet.</p>'}</div>` : ''}</section>`;
}

function renderDecisionBar(analysis) {
  const open = analysis.findings.filter((finding) => finding.decision === 'open').length;
  let buttons;
  if (analysis.status === 'revision_requested') buttons = `<button class="button button-secondary" data-action="export-report">${icon('download', 14)} Export report</button><button class="button button-primary" data-action="open-revision">${icon('spark', 14)} Run revised analysis</button>`;
  else if (['approved', 'rejected'].includes(analysis.status)) buttons = `<button class="button button-secondary" data-action="reopen-review">Reopen review</button><button class="button button-primary" data-action="export-report">${icon('download', 14)} Export final report</button>`;
  else buttons = `<button class="button button-quiet" data-action="request-revision">${icon('spark', 14)} Request agent re-analysis</button><button class="button button-danger" data-action="open-reject">Reject</button><button class="button button-primary" data-action="approve-export">${icon('check', 14)} Approve & export</button>`;
  const message = analysis.status === 'approved' ? 'Approved for execution' : analysis.status === 'rejected' ? 'Review rejected' : `${open} item${open === 1 ? '' : 's'} still require${open === 1 ? 's' : ''} human review`;
  return `<footer class="decision-bar"><div class="decision-copy">${icon(analysis.status === 'approved' ? 'checkCircle' : 'info', 15)}<span>${message}</span></div><div class="decision-buttons">${buttons}</div></footer>${renderHistory(analysis)}<p class="disclaimer">Simulation output is decision support, not legal, financial, or regulatory advice. Human review is required.</p>`;
}

function renderReviewPage() {
  const analysis = state.activeAnalysis;
  if (!analysis) return `${renderHeader({ eyebrow: 'Your workspace', title: 'Due diligence reviews', subtitle: 'Upload a contract or financial filing to convene your risk committee.', actions: `<button class="button button-primary" data-action="new-review">${icon('plus', 15)} Start a review</button>` })}<div class="empty-state"><div class="empty-state-icon">${icon('file', 20)}</div><div class="empty-state-title">Your review workspace is ready</div><p>Start with a PDF, Word document, or pasted text. Three specialized agents will run in parallel.</p><button class="button button-primary" data-action="new-review">${icon('plus', 15)} Start a new review</button></div>`;
  const actions = `<button class="button button-secondary" data-action="export-report">${icon('download', 14)} Export report</button><button class="button button-primary" data-action="new-review">${icon('plus', 15)} New review</button>`;
  const revision = analysis.revisionCount ? `Revision ${analysis.revisionCount}` : 'First-pass analysis';
  const header = renderHeader({ eyebrow: `Due diligence · ${String(analysis.id).slice(0, 8).toUpperCase()}`, title: escapeHTML(analysis.documentName), subtitle: `${analysis.sourceType === 'demo' ? 'Demo agreement' : 'Document review'} · Started ${escapeHTML(timeAgo(analysis.createdAt))} · ${revision}`, actions: `${statusPill(analysis)}${actions}` });
  return `${header}${renderSummary(analysis)}<section class="workbench" aria-label="Review document and agent findings">${renderDocument(analysis)}${renderFindingsPane(analysis)}</section>${renderDecisionBar(analysis)}`;
}

function renderQueueTable(items) {
  if (!items.length) return `<div class="empty-state"><div class="empty-state-icon">${icon('inbox', 20)}</div><div class="empty-state-title">No reviews yet</div><p>Create a diligence review to populate the queue.</p></div>`;
  const rows = items.map((item) => {
    const high = (item.findingCounts?.high || 0) + (item.findingCounts?.critical || 0);
    const medium = item.findingCounts?.medium || 0;
    const low = item.findingCounts?.low || 0;
    const dots = `${'<span class="stack-dot high"></span>'.repeat(Math.min(high, 5))}${'<span class="stack-dot medium"></span>'.repeat(Math.min(medium, 5))}${'<span class="stack-dot low"></span>'.repeat(Math.min(low, 5))}`;
    const search = `${item.documentName} ${item.statusLabel}`.toLowerCase();
    return `<tr class="queue-row" ${state.queueQuery && !search.includes(state.queueQuery) ? 'hidden' : ''} data-review-id="${escapeHTML(item.id)}" data-search="${escapeHTML(search)}"><td><div class="queue-document"><span class="queue-file">${icon('file', 15)}</span><span><span class="queue-document-name">${escapeHTML(item.documentName)}</span><span class="queue-document-meta">${escapeHTML(item.sourceType === 'demo' ? 'Sample agreement' : 'Document')} · ${escapeHTML(timeAgo(item.createdAt))}</span></span></div></td><td><span class="queue-risk">${Number(item.overallScore).toFixed(1)} <small>/ 10</small></span><br>${riskTag(item.overallScore, item.risk)}</td><td><span class="severity-stack">${dots || '<span class="stack-dot low"></span>'}</span> <span class="queue-findings">${item.findingCounts?.total || 0} findings</span></td><td>${statusPill(item)}</td><td>${escapeHTML(timeAgo(item.updatedAt || item.createdAt))}</td><td><span class="queue-open">${icon('chevronRight', 14)}</span></td></tr>`;
  }).join('');
  return `<div class="table-wrap"><table class="queue-table"><thead><tr><th>Document</th><th>Overall risk</th><th>Findings</th><th>Status</th><th>Updated</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function renderQueuePage() {
  const items = [...state.analyses].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const waiting = items.filter((item) => ['pending_review', 'revision_requested'].includes(item.status)).length;
  const approved = items.filter((item) => item.status === 'approved').length;
  const total = items.reduce((sum, item) => sum + (item.findingCounts?.total || 0), 0);
  const matches = items.filter((item) => !state.queueQuery || `${item.documentName} ${item.statusLabel}`.toLowerCase().includes(state.queueQuery)).length;
  return `${renderHeader({ eyebrow: 'Portfolio', title: 'Review queue', subtitle: 'Track active diligence, decisions, and completed committee reviews.', actions: `<button class="button button-primary" data-action="new-review">${icon('plus', 15)} Start a review</button>` })}<div class="queue-head-stats"><div class="queue-stat"><div class="queue-stat-label">Awaiting decision</div><div class="queue-stat-value">${waiting}</div></div><div class="queue-stat"><div class="queue-stat-label">Approved reviews</div><div class="queue-stat-value">${approved}</div></div><div class="queue-stat"><div class="queue-stat-label">Findings surfaced</div><div class="queue-stat-value">${total}</div></div></div><section class="queue-card"><div class="queue-toolbar"><div class="queue-toolbar-title">All reviews <span class="tab-count">${items.length}</span></div><label class="search-field">${icon('search', 14)}<input id="queue-search" type="search" placeholder="Search documents or status…" value="${escapeHTML(state.queueQuery)}" autocomplete="off" /></label></div><div id="queue-table-content">${renderQueueTable(items)}${items.length ? `<div class="empty-state queue-no-results" ${matches ? 'hidden' : ''}><div class="empty-state-title">No matching reviews</div><p>Try another document name or status.</p></div>` : ''}</div></section>`;
}

function renderAgentsPage() {
  const agents = state.activeAnalysis?.agents || {};
  const cards = AGENTS.map((meta) => {
    const agent = agents[meta.key] || { score: 0, findingCount: 0, summary: 'Run a review to see this agent’s latest assessment.', findings: [] };
    const examples = agent.findings?.slice(0, 3) || [];
    return `<article class="agent-profile-card"><div class="agent-profile-head"><span class="agent-icon ${meta.color}">${icon(meta.icon, 19)}</span><span><span class="agent-profile-name">${meta.title}</span><span class="agent-profile-role">${meta.role}</span></span></div><div class="agent-profile-score"><strong>${agent.score ? Number(agent.score).toFixed(1) : '—'}</strong><span>/ 10 risk score · ${agent.findingCount || 0} findings</span></div><div class="agent-meter"><span class="${meta.key}" style="width:${agent.score ? Math.round(agent.score * 10) : 0}%"></span></div><div class="agent-profile-summary">${escapeHTML(agent.summary || '')}</div><div class="agent-profile-items"><strong>Review lens</strong>${examples.length ? examples.map((finding) => `<div class="agent-item-line">${escapeHTML(finding.title)}</div>`).join('') : `<div class="agent-item-line">${escapeHTML(meta.lens)}</div>`}</div><div class="agent-profile-footer"><button class="text-link" data-action="open-chat-agent" data-agent="${meta.key}">Ask this agent ${icon('arrow', 12)}</button></div></article>`;
  }).join('');
  return `${renderHeader({ eyebrow: 'Independent review', title: 'Your risk committee', subtitle: 'Three domain-specific agents review each submission in parallel before a human makes the call.', actions: `<button class="button button-secondary" data-action="show-methodology">${icon('info', 14)} How it works</button><button class="button button-primary" data-action="new-review">${icon('plus', 15)} Run a review</button>` })}<p class="agent-page-intro">Each specialist applies a focused set of diligence checks to the same source document. Their findings are synthesized into one committee brief, then handed to you for approval, edits, or another pass.</p><div class="agents-page-grid">${cards}</div><div class="engine-note">${icon('info', 15)}<span><strong>Transparent local simulator.</strong> VERITY runs deterministic clause and financial-signal checks on your machine. It does not send documents to an LLM or third-party service. Treat results as triage—not a substitute for qualified legal, finance, security, or compliance review.</span></div>`;
}

function renderPage() {
  if (state.route === 'queue') return renderQueuePage();
  if (state.route === 'agents') return renderAgentsPage();
  return renderReviewPage();
}

function renderNewModal() {
  const modal = state.modal;
  const uploadMode = modal.mode === 'upload';
  const fileLabel = modal.fileName ? `<span class="upload-badge">${icon('checkCircle', 13)} ${escapeHTML(modal.fileName)} · ${Number(modal.characters || 0).toLocaleString()} characters extracted</span>` : '';
  return `<div class="overlay-backdrop" data-action="backdrop-close"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header class="modal-header"><div><div class="modal-eyebrow">New diligence review</div><h2 class="modal-title" id="modal-title">Bring the committee a document</h2><p class="modal-subtitle">Upload a file or paste text. Finance, legal, and compliance checks will run in parallel.</p></div><button class="modal-close" data-action="close-modal" aria-label="Close" ${modal.busy || modal.uploadBusy ? 'disabled' : ''}>${icon('close', 16)}</button></header><div class="modal-body">
    <div class="form-group"><label class="field-label" for="document-name">Review name</label><input id="document-name" class="text-input" type="text" maxlength="180" placeholder="e.g. Acme Corp · Master services agreement" value="${escapeHTML(modal.documentName || '')}" /></div>
    <div class="modal-section-label"><span>Source document</span><div class="mode-toggle"><button data-action="source-mode" data-mode="upload" class="${uploadMode ? 'active' : ''}" ${modal.busy || modal.uploadBusy ? 'disabled' : ''}>Upload file</button><button data-action="source-mode" data-mode="paste" class="${!uploadMode ? 'active' : ''}" ${modal.busy || modal.uploadBusy ? 'disabled' : ''}>Paste text</button></div></div>
    ${uploadMode ? `<label class="upload-zone ${modal.dragOver ? 'dragover' : ''}" for="upload-input" data-upload-zone><input id="upload-input" type="file" accept=".pdf,.docx,.txt,.md,.markdown,.csv,.html,.htm,.json,.xml,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" hidden ${modal.busy || modal.uploadBusy ? 'disabled' : ''}/><span class="upload-zone-icon">${icon('upload', 19)}</span><span class="upload-zone-copy"><span class="upload-zone-title">${modal.uploadBusy ? 'Extracting document text…' : 'Choose a file or drag it here'}</span><span class="upload-zone-description">Searchable PDF, Word, TXT, Markdown, CSV, HTML, JSON, XML · max 20 MB</span></span>${modal.uploadBusy ? '<span class="spinner"></span>' : fileLabel || `<span class="upload-badge">${icon('file', 12)} Browse</span>`}</label><p class="field-help">Scanned PDFs need OCR before upload. Extracted text can be reviewed in the next step.</p>` : `<div class="form-group"><label class="field-label" for="document-text">Document text</label><textarea id="document-text" class="text-area" placeholder="Paste agreement language, an SEC filing excerpt, or a diligence memo…">${escapeHTML(modal.text || '')}</textarea><p class="field-help">At least 30 characters. Text stays in this local workspace.</p></div>`}
    <div class="sample-prompt">Need a starting point? <button data-action="load-demo" ${modal.busy || modal.uploadBusy ? 'disabled' : ''}>Load the Northstar sample agreement ${icon('arrow', 11)}</button></div>
    ${modal.error ? `<div class="modal-error">${escapeHTML(modal.error)}</div>` : ''}
    ${modal.busy ? `<div class="analysis-progress" style="margin-top:13px"><span class="spinner"></span>${escapeHTML(modal.progress || 'Running the parallel committee review…')}</div>` : ''}
  </div><footer class="modal-footer"><span class="modal-footer-note">Local simulator · No external LLM connection required</span><div class="modal-footer-actions"><button class="button button-secondary" data-action="close-modal" ${modal.busy || modal.uploadBusy ? 'disabled' : ''}>Cancel</button><button class="button button-primary" data-action="run-analysis" ${modal.busy || modal.uploadBusy || String(modal.text || '').trim().length < 30 || (uploadMode && !modal.fileName) ? 'disabled' : ''}>${icon('spark', 14)} ${modal.busy ? 'Analyzing…' : 'Run committee review'}</button></div></footer></section></div>`;
}

function renderReviewNoteModal() {
  const rejecting = state.modal.type === 'reject';
  const analysis = state.activeAnalysis;
  const title = rejecting ? 'Reject this review' : 'Request an agent re-analysis';
  const subtitle = rejecting
    ? 'Record why this review is being declined. The decision will be saved to the review history.'
    : 'Tell the committee what needs a second look. The agents will rerun against the same source and attach your note to the new pass.';
  return `<div class="overlay-backdrop" data-action="backdrop-close"><section class="modal modal-sm" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header class="modal-header"><div><div class="modal-eyebrow">${rejecting ? 'Human decision' : `Review · ${escapeHTML(analysis?.documentName || '')}`}</div><h2 class="modal-title" id="modal-title">${title}</h2><p class="modal-subtitle">${subtitle}</p></div><button class="modal-close" data-action="close-modal" aria-label="Close">${icon('close', 16)}</button></header><div class="modal-body"><div class="form-group"><label class="field-label" for="review-feedback">Reviewer note ${rejecting ? '(required)' : ''}</label><textarea id="review-feedback" class="text-area" style="min-height:122px" placeholder="${rejecting ? 'Summarize the reason for rejection…' : 'e.g. Reassess the liability cap against our approved policy…'}">${escapeHTML(state.modal.feedback || '')}</textarea></div><div class="review-question-list"><div class="review-question">${icon('checkCircle', 13)}${rejecting ? 'This action will be recorded in the audit trail.' : 'The findings will be recalculated from the same source text.'}</div>${rejecting ? '' : `<div class="review-question">${icon('checkCircle', 13)}Your note and the new pass will be retained in review history.</div>`}</div>${state.modal.error ? `<div class="modal-error">${escapeHTML(state.modal.error)}</div>` : ''}${state.modal.busy ? `<div class="analysis-progress" style="margin-top:13px"><span class="spinner"></span>${rejecting ? 'Saving decision…' : 'Refreshing agent analysis…'}</div>` : ''}</div><footer class="modal-footer"><span class="modal-footer-note">Human review stays in control.</span><div class="modal-footer-actions"><button class="button button-secondary" data-action="close-modal" ${state.modal.busy ? 'disabled' : ''}>Cancel</button><button class="button ${rejecting ? 'button-danger' : 'button-primary'}" data-action="submit-review-note" ${state.modal.busy || !String(state.modal.feedback || '').trim() ? 'disabled' : ''}>${icon(rejecting ? 'closeCircle' : 'spark', 14)} ${state.modal.busy ? 'Please wait…' : rejecting ? 'Reject review' : 'Request re-analysis'}</button></div></footer></section></div>`;
}

function renderEditModal() {
  const finding = state.activeAnalysis?.findings.find((item) => item.id === state.modal.findingId);
  if (!finding) return '';
  const original = finding.redline?.before || finding.evidence || '';
  return `<div class="overlay-backdrop" data-action="backdrop-close"><section class="modal modal-sm" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header class="modal-header"><div><div class="modal-eyebrow">Edit suggested language · ${escapeHTML(finding.agent)}</div><h2 class="modal-title" id="modal-title">Refine the redline</h2><p class="modal-subtitle">Your change is saved as a reviewer-edited proposal. It does not alter the original source document.</p></div><button class="modal-close" data-action="close-modal" aria-label="Close">${icon('close', 16)}</button></header><div class="modal-body"><div class="form-group"><label class="field-label" for="redline-text">Replacement language</label><textarea id="redline-text" class="text-area edit-redline">${escapeHTML(state.modal.after ?? finding.redline?.after ?? '')}</textarea></div><div class="form-group"><label class="field-label" for="redline-note">Reviewer note (optional)</label><input id="redline-note" class="text-input" type="text" maxlength="1200" value="${escapeHTML(state.modal.note || finding.reviewerNote || '')}" placeholder="Why did you change the proposed wording?" /></div>${state.modal.error ? `<div class="modal-error">${escapeHTML(state.modal.error)}</div>` : ''}</div><footer class="modal-footer"><span class="modal-footer-note">Original: ${escapeHTML(original.slice(0, 48))}${original.length > 48 ? '…' : ''}</span><div class="modal-footer-actions"><button class="button button-secondary" data-action="close-modal">Cancel</button><button class="button button-primary" data-action="save-redline">${icon('check', 14)} Save edit</button></div></footer></section></div>`;
}

function renderOverlay() {
  let html = state.sidebarOpen ? '<div class="sidebar-scrim visible" data-action="close-sidebar"></div>' : '';
  if (state.modal?.type === 'new') html += renderNewModal();
  else if (['revision', 'reject'].includes(state.modal?.type)) html += renderReviewNoteModal();
  else if (state.modal?.type === 'edit') html += renderEditModal();
  $('#overlay-root').innerHTML = html;
}

function renderChat() {
  if (!state.chatOpen) {
    $('#chat-root').innerHTML = `<button class="chat-launcher" data-action="toggle-chat">${icon('chat', 16)} Ask the committee</button>`;
    return;
  }
  const agent = AGENTS.find((item) => item.key === state.chatAgentKey) || AGENTS[1];
  const messages = state.chatMessages.map((item) => `<div class="chat-message ${item.role}"><span class="chat-message-author">${item.role === 'user' ? 'You' : `${escapeHTML(item.agent || agent.title)} agent`}</span><div class="chat-bubble">${escapeHTML(item.text)}</div>${item.disclaimer ? `<span class="chat-disclaimer">${escapeHTML(item.disclaimer)}</span>` : ''}</div>`).join('');
  const welcome = state.chatMessages.length ? '' : '<div class="chat-welcome">Ask about a finding, source language, or proposed redline. The committee will explain the local checks behind its recommendation.</div>';
  $('#chat-root').innerHTML = `<section class="chat-panel" aria-label="Committee chat"><header class="chat-header"><span class="agent-icon ${agent.color}">${icon(agent.icon, 15)}</span><span class="chat-header-copy"><span class="chat-title">Committee desk</span><span class="chat-subtitle">Ask a focused follow-up</span></span><select class="chat-agent-select" id="chat-agent" aria-label="Choose an agent">${AGENTS.map((item) => `<option value="${item.key}" ${item.key === agent.key ? 'selected' : ''}>${item.title.split(' ')[0]} agent</option>`).join('')}</select><button class="icon-button" data-action="close-chat" aria-label="Close chat">${icon('close', 15)}</button></header><div class="chat-body" id="chat-body">${welcome}${messages}${state.chatBusy ? '<div class="chat-typing"><span></span><span></span><span></span> Reviewing the finding…</div>' : ''}</div><div class="chat-suggestions">${['Why is this risky?', 'Explain the redline', 'What should I ask for?'].map((question) => `<button data-action="chat-suggestion" data-question="${escapeHTML(question)}">${escapeHTML(question)}</button>`).join('')}</div><form class="chat-form" id="chat-form"><textarea id="chat-input" rows="1" placeholder="Ask the ${agent.title.split(' ')[0].toLowerCase()} agent…" ${state.chatBusy ? 'disabled' : ''}></textarea><button class="chat-send" type="submit" aria-label="Send message" ${state.chatBusy ? 'disabled' : ''}>${icon('send', 15)}</button></form></section>`;
  const body = $('#chat-body');
  if (body) body.scrollTop = body.scrollHeight;
}

function renderApp() {
  renderSidebar();
  renderTopbar();
  $('#page-content').innerHTML = renderPage();
  renderOverlay();
  renderChat();
}

function toast(message, type = 'success') {
  $('#toast-root').innerHTML = `<div class="toast ${type === 'error' ? 'error' : ''}">${icon(type === 'error' ? 'alert' : 'checkCircle', 15)}<span>${escapeHTML(message)}</span></div>`;
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => { $('#toast-root').innerHTML = ''; }, 3400);
}

function openNewReview() {
  state.modal = { type: 'new', mode: 'upload', documentName: '', text: '', fileName: '', characters: 0, uploadBusy: false, busy: false, usedDemo: false, error: '' };
  renderOverlay();
}

async function loadDemoIntoForm() {
  try {
    const demo = await api('/api/demo');
    state.modal = { ...state.modal, mode: 'paste', documentName: demo.documentName, text: demo.text, usedDemo: true, fileName: '', error: '' };
    renderOverlay();
    $('#document-text')?.focus();
  } catch (error) { toast(error.message, 'error'); }
}

async function uploadFile(file) {
  if (!file || !state.modal || state.modal.uploadBusy) return;
  state.modal.uploadBusy = true;
  state.modal.error = '';
  renderOverlay();
  try {
    const form = new FormData();
    form.append('file', file);
    const result = await api('/api/upload', { method: 'POST', body: form });
    const title = file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim();
    state.modal = { ...state.modal, mode: 'paste', documentName: state.modal.documentName || title, text: result.text, fileName: result.filename, characters: result.characters, uploadBusy: false, error: '', usedDemo: false };
    renderOverlay();
    $('#document-text')?.focus();
    toast(`Extracted ${Number(result.characters).toLocaleString()} characters from ${result.filename}`);
  } catch (error) {
    state.modal.uploadBusy = false;
    state.modal.error = error.message;
    renderOverlay();
  }
}

async function runAnalysis() {
  if (!state.modal || state.modal.busy) return;
  const text = String(state.modal.text || '').trim();
  const documentName = String(state.modal.documentName || '').trim() || 'Untitled diligence document';
  if (text.length < 30) {
    state.modal.error = 'Paste at least 30 characters of source text or upload a document.';
    renderOverlay();
    return;
  }
  state.modal.busy = true;
  state.modal.error = '';
  state.modal.progress = 'Launching finance, legal, and compliance checks in parallel…';
  renderOverlay();
  try {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const analysis = await api('/api/analyses', { method: 'POST', body: JSON.stringify({ documentName, text, sourceType: state.modal.usedDemo ? 'demo' : 'uploaded' }) });
    state.activeAnalysis = analysis;
    state.selectedFindingId = preferredFindingId(analysis);
    state.route = 'review';
    state.activeTab = 'findings';
    state.findingFilter = 'all';
    state.expandedDocument = false;
    state.historyExpanded = false;
    state.modal = null;
    await loadAnalyses();
    renderApp();
    toast('Committee analysis complete — ready for your review');
  } catch (error) {
    if (state.modal) {
      state.modal.busy = false;
      state.modal.error = error.message;
      renderOverlay();
    }
  }
}

async function updateFinding(findingId, updates) {
  if (!state.activeAnalysis) return;
  try {
    const result = await api(`/api/analyses/${encodeURIComponent(state.activeAnalysis.id)}/findings/${encodeURIComponent(findingId)}`, {
      method: 'PATCH', body: JSON.stringify({ ...updates, reviewer: 'Sarah Chen' }),
    });
    const target = state.activeAnalysis.findings.find((finding) => finding.id === findingId);
    if (target) Object.assign(target, result.finding);
    const agentFinding = state.activeAnalysis.agents[target?.agentKey]?.findings?.find((finding) => finding.id === findingId);
    if (agentFinding) Object.assign(agentFinding, result.finding);
    if (result.reviewHistory) state.activeAnalysis.reviewHistory = result.reviewHistory;
    await loadAnalyses();
    renderApp();
    return result;
  } catch (error) {
    toast(error.message, 'error');
    throw error;
  }
}

async function updateReview(status, feedback = '') {
  if (!state.activeAnalysis) return;
  const result = await api(`/api/analyses/${encodeURIComponent(state.activeAnalysis.id)}/review`, {
    method: 'PATCH', body: JSON.stringify({ status, feedback, reviewer: 'Sarah Chen' }),
  });
  Object.assign(state.activeAnalysis, {
    status: result.status,
    statusLabel: result.statusLabel,
    reviewerFeedback: feedback,
    updatedAt: result.updatedAt || new Date().toISOString(),
  });
  if (result.reviewHistory) state.activeAnalysis.reviewHistory = result.reviewHistory;
  await loadAnalyses();
  renderApp();
}

function openReviewNote(type) {
  state.modal = { type, feedback: '', busy: false, error: '' };
  renderOverlay();
  setTimeout(() => $('#review-feedback')?.focus(), 20);
}

async function submitReviewNote() {
  if (!state.modal || !state.activeAnalysis) return;
  const rejecting = state.modal.type === 'reject';
  const feedback = String(state.modal.feedback || '').trim();
  if (!feedback) {
    state.modal.error = rejecting ? 'Please add a short reason before rejecting this review.' : 'Add a note about what the committee should revisit.';
    renderOverlay();
    return;
  }
  state.modal.busy = true;
  renderOverlay();
  try {
    if (rejecting) {
      await updateReview('rejected', feedback);
      state.modal = null;
      renderApp();
      toast('Review rejected and recorded in the audit trail');
      return;
    }
    await updateReview('revision_requested', feedback);
    const revised = await api(`/api/analyses/${encodeURIComponent(state.activeAnalysis.id)}/reanalyze`, {
      method: 'POST', body: JSON.stringify({ feedback, reviewer: 'Sarah Chen' }),
    });
    state.activeAnalysis = revised;
    state.selectedFindingId = preferredFindingId(revised);
    state.activeTab = 'findings';
    state.findingFilter = 'all';
    state.modal = null;
    await loadAnalyses();
    renderApp();
    toast(`Committee re-analysis complete · revision ${revised.revisionCount}`);
  } catch (error) {
    if (state.modal) {
      state.modal.busy = false;
      state.modal.error = error.message;
      renderOverlay();
    } else toast(error.message, 'error');
  }
}

function openEditModal(id) {
  const finding = state.activeAnalysis?.findings.find((item) => item.id === id);
  if (!finding?.redline) return;
  state.modal = { type: 'edit', findingId: id, after: finding.redline.after || '', note: finding.reviewerNote || '', error: '' };
  renderOverlay();
}

async function saveRedline() {
  const id = state.modal?.findingId;
  const after = String(state.modal?.after || '').trim();
  const note = String(state.modal?.note || '').trim();
  if (!after) {
    state.modal.error = 'Suggested replacement language cannot be empty.';
    renderOverlay();
    return;
  }
  const finding = state.activeAnalysis.findings.find((item) => item.id === id);
  try {
    await updateFinding(id, { decision: 'edited', reviewerNote: note, redline: { before: finding.redline?.before || finding.evidence, after } });
    state.modal = null;
    renderApp();
    toast('Reviewer redline saved');
  } catch (error) {
    if (state.modal) { state.modal.error = error.message; renderOverlay(); }
  }
}

function safeFilename(value) {
  return String(value || 'due-diligence-report').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 65) || 'due-diligence-report';
}

function reportMarkdown(analysis, redlinesOnly = false) {
  const generated = dateTime(new Date().toISOString());
  const open = analysis.findings.filter((item) => item.decision === 'open').length;
  const lines = redlinesOnly
    ? [`# Proposed redlines — ${analysis.documentName}`, '', `**Generated:** ${generated}  `, `**Review status:** ${statusText(analysis)}  `, `**Risk score:** ${Number(analysis.overallScore).toFixed(1)} / 10 (${analysis.risk})`, '', '> Drafting aid only. Proposed language must be reviewed by qualified counsel.', '']
    : [`# Due diligence report — ${analysis.documentName}`, '', `**Generated:** ${generated}  `, `**Review ID:** ${analysis.id}  `, `**Review status:** ${statusText(analysis)}  `, `**Overall risk:** ${Number(analysis.overallScore).toFixed(1)} / 10 (${analysis.risk})  `, `**Findings:** ${analysis.findings.length} total · ${severityCount(analysis, 'high')} high/critical · ${severityCount(analysis, 'medium')} moderate · ${open} open`, '', '## Executive summary', '', analysis.executiveSummary || '', '', `**Recommendation:** ${analysis.recommendation || 'Complete human review before execution.'}`, '', '## Agent assessments', '', ...AGENTS.map((agent) => `- **${agent.title}:** ${Number(analysis.agents[agent.key]?.score || 0).toFixed(1)}/10 — ${analysis.agents[agent.key]?.summary || ''}`), '', '## Findings', ''];
  const findings = analysis.findings.filter((finding) => finding.redline);
  for (const finding of findings) {
    lines.push(`### [${finding.severity.toUpperCase()}] ${finding.title}`, '', `**Agent:** ${finding.agent} · **Section:** ${finding.section || 'Not specified'} · **Decision:** ${finding.decision}`, '', `**Source:** ${finding.sourceType === 'absence' ? '(Diligence gap; not a source quotation) ' : ''}> ${finding.evidence}`, '', `**Concern:** ${finding.concern}`, '', `**Recommendation:** ${finding.recommendation}`, '', '**Current language**', '', `> ${finding.redline.before || finding.evidence}`, '', '**Suggested replacement**', '', `> ${finding.redline.after}`);
    if (finding.reviewerNote) lines.push('', `**Reviewer note:** ${finding.reviewerNote}`);
    lines.push('');
  }
  if (!redlinesOnly && analysis.reviewerFeedback) lines.push('## Latest reviewer note', '', analysis.reviewerFeedback, '');
  lines.push('---', '', '*VERITY Due Diligence Simulator · Local deterministic analysis. This report is not legal, financial, security, or regulatory advice. Confirm findings with qualified professionals.*');
  return lines.join('\n');
}

function downloadReport(redlinesOnly = false) {
  const analysis = state.activeAnalysis;
  if (!analysis) return;
  const name = `${safeFilename(analysis.documentName)}${redlinesOnly ? '-redlines' : '-diligence-report'}.md`;
  const file = new Blob([reportMarkdown(analysis, redlinesOnly)], { type: 'text/markdown;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(file);
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  toast(redlinesOnly ? 'Redline pack exported' : 'Diligence report exported');
}

function openChat(agentKey = 'legal', findingId = null) {
  state.chatAgentKey = AGENTS.some((item) => item.key === agentKey) ? agentKey : 'legal';
  state.chatFindingId = findingId;
  state.chatMessages = [];
  state.chatOpen = true;
  renderChat();
  setTimeout(() => $('#chat-input')?.focus(), 25);
}

async function sendChat(questionOverride = '') {
  if (state.chatBusy || !state.activeAnalysis) return;
  const question = String(questionOverride || $('#chat-input')?.value || '').trim();
  if (!question) return;
  state.chatMessages.push({ role: 'user', text: question });
  state.chatBusy = true;
  renderChat();
  try {
    const result = await api(`/api/analyses/${encodeURIComponent(state.activeAnalysis.id)}/chat`, {
      method: 'POST', body: JSON.stringify({ agentKey: state.chatAgentKey, findingId: state.chatFindingId, question }),
    });
    state.chatMessages.push({ role: 'assistant', agent: `${result.agent} agent`, text: result.answer, disclaimer: result.disclaimer });
  } catch (error) { state.chatMessages.push({ role: 'assistant', agent: 'Committee', text: error.message }); }
  state.chatBusy = false;
  renderChat();
}

async function navigateToAnalysis(id) {
  state.sidebarOpen = false;
  state.queueQuery = '';
  state.route = 'review';
  state.activeAnalysis = null;
  renderApp();
  try { await loadAnalysis(id); }
  catch (error) { toast(error.message, 'error'); }
}

function updateQueueSearch(query) {
  state.queueQuery = String(query || '').toLowerCase();
  const rows = $$('.queue-row');
  for (const row of rows) row.hidden = !row.dataset.search.includes(state.queueQuery);
  const noResults = $('.queue-no-results');
  if (noResults) noResults.hidden = rows.some((row) => !row.hidden);
}

async function handleClick(event) {
  const target = event.target.closest('[data-action], [data-route], [data-review-id], [data-agent-card]');
  if (!target) return;
  if (target.dataset.reviewId && ['queue-row', 'recent-button'].some((name) => target.classList.contains(name))) {
    await navigateToAnalysis(target.dataset.reviewId);
    return;
  }
  if (target.dataset.route) {
    state.route = target.dataset.route;
    state.sidebarOpen = false;
    renderApp();
    return;
  }
  if (target.dataset.agentCard) {
    state.route = 'agents';
    renderApp();
    return;
  }

  switch (target.dataset.action) {
    case 'new-review': openNewReview(); break;
    case 'close-modal': if (!state.modal?.busy && !state.modal?.uploadBusy) { state.modal = null; renderOverlay(); } break;
    case 'backdrop-close': if (event.target === target && !state.modal?.busy && !state.modal?.uploadBusy) { state.modal = null; renderOverlay(); } break;
    case 'toggle-sidebar': state.sidebarOpen = !state.sidebarOpen; renderOverlay(); break;
    case 'close-sidebar': state.sidebarOpen = false; renderOverlay(); break;
    case 'open-queue': state.route = 'queue'; state.sidebarOpen = false; renderApp(); setTimeout(() => $('#queue-search')?.focus(), 20); break;
    case 'source-mode': if (state.modal?.type === 'new') { state.modal.mode = target.dataset.mode; renderOverlay(); } break;
    case 'load-demo': await loadDemoIntoForm(); break;
    case 'run-analysis': await runAnalysis(); break;
    case 'toggle-document': state.expandedDocument = !state.expandedDocument; renderApp(); break;
    case 'toggle-history': state.historyExpanded = !state.historyExpanded; renderApp(); break;
    case 'select-finding': state.selectedFindingId = target.dataset.findingId; renderApp(); break;
    case 'set-tab': {
      state.activeTab = target.dataset.tab;
      state.findingFilter = 'all';
      const findings = state.activeAnalysis?.findings || [];
      const first = state.activeTab === 'redlines' ? findings.find((finding) => finding.redline) : findings[0];
      if (first) state.selectedFindingId = first.id;
      renderApp();
      break;
    }
    case 'set-filter': {
      state.findingFilter = target.dataset.filter;
      const available = state.activeAnalysis ? visibleFindings(state.activeAnalysis, state.activeTab === 'redlines') : [];
      if (!available.some((finding) => finding.id === state.selectedFindingId)) state.selectedFindingId = available[0]?.id || null;
      renderApp();
      break;
    }
    case 'set-decision': {
      await updateFinding(target.dataset.findingId, { decision: target.dataset.decision });
      toast(target.dataset.decision === 'accepted' ? 'Finding marked as reviewed' : target.dataset.decision === 'dismissed' ? 'Finding dismissed' : 'Finding reopened');
      break;
    }
    case 'edit-finding': openEditModal(target.dataset.findingId); break;
    case 'save-redline': await saveRedline(); break;
    case 'ask-agent': openChat(target.dataset.agent, target.dataset.findingId); break;
    case 'toggle-chat': state.chatOpen = true; state.chatMessages = []; state.chatAgentKey = 'legal'; state.chatFindingId = state.selectedFindingId; renderChat(); setTimeout(() => $('#chat-input')?.focus(), 20); break;
    case 'close-chat': state.chatOpen = false; renderChat(); break;
    case 'open-chat-agent': openChat(target.dataset.agent, null); break;
    case 'chat-suggestion': await sendChat(target.dataset.question); break;
    case 'export-report': downloadReport(false); break;
    case 'export-redlines': downloadReport(true); break;
    case 'approve-export':
      try { await updateReview('approved', 'Approved by Sarah Chen.'); downloadReport(false); toast('Review approved and final report exported'); }
      catch (error) { toast(error.message, 'error'); }
      break;
    case 'open-reject': openReviewNote('reject'); break;
    case 'request-revision': openReviewNote('revision'); break;
    case 'open-revision': openReviewNote('revision'); break;
    case 'submit-review-note': await submitReviewNote(); break;
    case 'reopen-review':
      try { await updateReview('pending_review', 'Review reopened by Sarah Chen.'); toast('Review reopened'); }
      catch (error) { toast(error.message, 'error'); }
      break;
    case 'copy-source':
      try { await navigator.clipboard.writeText(state.activeAnalysis?.documentText || ''); toast('Source text copied to clipboard'); }
      catch { toast('Clipboard access is not available in this browser', 'error'); }
      break;
    case 'show-methodology': toast('Three local agent checks run in parallel, then findings are synthesized for human review.'); break;
  }
}

document.addEventListener('click', (event) => { handleClick(event).catch((error) => toast(error.message, 'error')); });
document.addEventListener('input', (event) => {
  if (event.target.id === 'document-name' && state.modal?.type === 'new') state.modal.documentName = event.target.value;
  if (event.target.id === 'document-text' && state.modal?.type === 'new') {
    state.modal.text = event.target.value;
    state.modal.usedDemo = false;
    const button = $('[data-action="run-analysis"]');
    if (button) button.disabled = state.modal.busy || event.target.value.trim().length < 30;
  }
  if (event.target.id === 'review-feedback' && state.modal) {
    state.modal.feedback = event.target.value;
    state.modal.error = '';
    const button = $('[data-action="submit-review-note"]');
    if (button) button.disabled = state.modal.busy || !event.target.value.trim();
  }
  if (event.target.id === 'redline-text' && state.modal?.type === 'edit') state.modal.after = event.target.value;
  if (event.target.id === 'redline-note' && state.modal?.type === 'edit') state.modal.note = event.target.value;
  if (event.target.id === 'queue-search') updateQueueSearch(event.target.value);
});
document.addEventListener('change', (event) => {
  if (event.target.id === 'upload-input') uploadFile(event.target.files?.[0]);
  if (event.target.id === 'chat-agent') {
    state.chatAgentKey = event.target.value;
    const match = state.activeAnalysis?.findings.find((finding) => finding.agentKey === state.chatAgentKey);
    state.chatFindingId = match?.id || null;
    renderChat();
  }
});
document.addEventListener('submit', (event) => {
  if (event.target.id === 'chat-form') {
    event.preventDefault();
    sendChat().catch((error) => toast(error.message, 'error'));
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (state.modal && !state.modal.busy && !state.modal.uploadBusy) { state.modal = null; renderOverlay(); }
  else if (state.sidebarOpen) { state.sidebarOpen = false; renderOverlay(); }
  else if (state.chatOpen) { state.chatOpen = false; renderChat(); }
});
document.addEventListener('dragover', (event) => {
  const zone = event.target.closest('[data-upload-zone]');
  if (zone) { event.preventDefault(); zone.classList.add('dragover'); if (state.modal) state.modal.dragOver = true; }
});
document.addEventListener('dragleave', (event) => {
  const zone = event.target.closest('[data-upload-zone]');
  if (zone) { zone.classList.remove('dragover'); if (state.modal) state.modal.dragOver = false; }
});
document.addEventListener('drop', (event) => {
  const zone = event.target.closest('[data-upload-zone]');
  if (!zone) return;
  event.preventDefault();
  if (state.modal) state.modal.dragOver = false;
  uploadFile(event.dataTransfer?.files?.[0]);
});

async function boot() {
  try {
    await api('/api/health');
    const items = await loadAnalyses();
    if (items.length) {
      const sample = items.find((item) => item.id === 'demo-northstar') || items[0];
      await loadAnalysis(sample.id, false);
    }
    renderApp();
  } catch (error) {
    $('#page-content').innerHTML = `<div class="empty-state"><div class="empty-state-icon">${icon('alert', 20)}</div><div class="empty-state-title">Could not connect to the local review service</div><p>${escapeHTML(error.message)} Make sure the application was started with <code>npm start</code>, then refresh this page.</p></div>`;
  }
}

boot();
