import type { AnalysisPayload } from "@/types/analysis";
type RedFlag = AnalysisPayload["redFlags"][number];
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * Generate a downloadable report from an analysis payload.
 *
 * Two formats:
 *   - HTML: a self-contained, print-friendly document. Opens in any
 *     browser and prints to PDF via the browser's native print
 *     dialog (Ctrl/Cmd+P). Looks like a real legal-tech report.
 *   - Markdown: plain text, easy to read in any editor or paste
 *     into Slack / email / a doc.
 *
 * Both are produced server-side and shipped as strings; the
 * client wraps them in a Blob and triggers a download. The
 * download is generated client-side so the server stays
 * stateless and we don't add a new API route just for this.
 */

const ESCAPE_HTML: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ESCAPE_HTML[c] ?? c);
}

function riskLevel(level: AnalysisPayload["riskLevel"]): {
  label: string;
  color: string;
  bg: string;
} {
  switch (level) {
    case "low":
      return { label: "Low", color: "#10b981", bg: "#d1fae5" };
    case "medium":
      return { label: "Medium", color: "#f59e0b", bg: "#fef3c7" };
    case "high":
      return { label: "High", color: "#ef4444", bg: "#fee2e2" };
  }
}

function partyLabel(party: string, t: Dictionary): string {
  if (party === "you") return t.report.obligations.you;
  if (party === "counterparty") return t.report.obligations.counterparty;
  if (party === "mutual") return t.report.obligations.mutual;
  return party;
}

function todayStamp(): string {
  return new Date().toISOString().slice(0, 10);
}

/* ----------------------------- HTML export -------------------------------- */

export function exportHtml(
  payload: AnalysisPayload,
  t: Dictionary,
  locale: string,
): string {
  const r = riskLevel(payload.riskLevel);
  const date = todayStamp();
  const docType = payload.documentType || "Contract";

  const css = `
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
                   "Helvetica Neue", Arial, "PingFang SC",
                   "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background: #fff;
    }
    .page {
      max-width: 780px;
      margin: 0 auto;
      padding: 56px 48px 72px;
    }
    .brand {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #6b7280;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 16px;
      margin-bottom: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand a { color: #4f46e5; text-decoration: none; }
    h1 {
      font-size: 30px;
      font-weight: 700;
      line-height: 1.2;
      margin: 0 0 16px;
      letter-spacing: -0.01em;
    }
    h2 {
      font-size: 18px;
      font-weight: 600;
      margin: 40px 0 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #f3f4f6;
      color: #111827;
    }
    h3 {
      font-size: 15px;
      font-weight: 600;
      margin: 24px 0 6px;
      color: #111827;
    }
    p { margin: 0 0 12px; color: #374151; }
    ul, ol { margin: 0 0 12px; padding-left: 24px; color: #374151; }
    li { margin-bottom: 6px; }
    .meta {
      font-size: 13px;
      color: #6b7280;
      margin-bottom: 32px;
    }
    .risk {
      background: ${r.bg};
      border-left: 4px solid ${r.color};
      padding: 20px 24px;
      border-radius: 6px;
      margin-bottom: 32px;
    }
    .risk-row {
      display: flex;
      align-items: baseline;
      gap: 16px;
      flex-wrap: wrap;
    }
    .risk-score {
      font-size: 48px;
      font-weight: 700;
      line-height: 1;
      color: ${r.color};
    }
    .risk-score-suffix {
      font-size: 18px;
      color: #6b7280;
      font-weight: 500;
    }
    .risk-level {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 999px;
      background: ${r.color};
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .red-flag {
      border-left: 3px solid #ef4444;
      padding: 12px 16px;
      margin-bottom: 8px;
      background: #fef2f2;
      border-radius: 0 4px 4px 0;
    }
    .red-flag.medium { border-color: #f59e0b; background: #fffbeb; }
    .red-flag.low { border-color: #10b981; background: #f0fdf4; }
    .red-flag .severity {
      display: inline-block;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 2px 8px;
      border-radius: 3px;
      color: #fff;
      background: #ef4444;
      margin-left: 8px;
    }
    .red-flag.medium .severity { background: #f59e0b; }
    .red-flag.low .severity { background: #10b981; }
    .red-flag-title {
      font-weight: 600;
      color: #111827;
    }
    .red-flag-detail {
      font-size: 14px;
      color: #4b5563;
      margin: 4px 0 0;
    }
    .quote {
      border-left: 3px solid #f59e0b;
      padding-left: 12px;
      font-style: italic;
      color: #4b5563;
    }
    .pill {
      display: inline-block;
      padding: 2px 10px;
      background: #f3f4f6;
      border-radius: 4px;
      font-size: 13px;
      color: #4b5563;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }
    .question {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      margin-bottom: 8px;
    }
    .question .num {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #4f46e5;
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 2px;
    }
    table { width: 100%; border-collapse: collapse; margin: 8px 0 12px; }
    th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
    th { background: #f9fafb; font-weight: 600; color: #111827; }
    td { color: #374151; }
    .footer {
      margin-top: 56px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #6b7280;
    }
    .disclaimer {
      background: #fffbeb;
      border-left: 3px solid #f59e0b;
      padding: 14px 18px;
      border-radius: 0 4px 4px 0;
      font-size: 13px;
      color: #78350f;
      margin-top: 32px;
    }
    @media print {
      body { font-size: 11pt; }
      .page { padding: 24px; max-width: none; }
      h2 { page-break-after: avoid; }
      .red-flag, .risk, .disclaimer { page-break-inside: avoid; }
    }
  `.trim();

  const sections: string[] = [];

  // Header
  sections.push(`
    <div class="brand">
      <span>OfferShield.pro</span>
      <span>${escapeHtml(date)} · ${escapeHtml(locale.toUpperCase())}</span>
    </div>
  `);

  // Title + risk
  sections.push(`<h1>${escapeHtml(docType)}</h1>`);
  sections.push(`
    <div class="risk">
      <div class="risk-row">
        <div>
          <div class="risk-score">${payload.riskScore}<span class="risk-score-suffix"> / 100</span></div>
        </div>
        <div style="flex: 1; min-width: 240px;">
          <div style="margin-bottom: 8px;"><span class="risk-level">${r.label}</span></div>
          <p style="margin: 0; color: #1f2937;">${escapeHtml(payload.riskExplanation)}</p>
        </div>
      </div>
    </div>
  `);

  // Executive summary
  sections.push(`<h2>${escapeHtml(t.report.exec.tag)}</h2>`);
  sections.push(`<p>${escapeHtml(payload.executiveSummary)}</p>`);

  // Plain English
  sections.push(`<h2>${escapeHtml(t.report.plain.tag)}</h2>`);
  sections.push(`<p>${escapeHtml(payload.plainEnglishExplanation)}</p>`);

  // Key clauses
  if (payload.keyClauses.length > 0) {
    sections.push(`<h2>${escapeHtml(t.report.clauses.tag)}</h2>`);
    sections.push(
      payload.keyClauses
        .map(
          (kc) =>
            `<h3>${escapeHtml(kc.title)}</h3><p>${escapeHtml(kc.explanation)}</p>`,
        )
        .join(""),
    );
  }

  // Red flags
  if (payload.redFlags.length > 0) {
    sections.push(`<h2>${escapeHtml(t.report.redFlags.tag)}</h2>`);
    sections.push(
      payload.redFlags
        .map(
          (f: RedFlag) => `
          <div class="red-flag ${f.severity}">
            <span class="red-flag-title">${escapeHtml(f.title)}</span>
            <span class="severity">${escapeHtml(f.severity)}</span>
            <p class="red-flag-detail">${escapeHtml(f.detail)}</p>
          </div>
        `,
        )
        .join(""),
    );
  }

  // Obligations
  if (payload.obligations.length > 0) {
    sections.push(`<h2>${escapeHtml(t.report.obligations.tag)}</h2>`);
    const parties = ["you", "counterparty", "mutual"] as const;
    sections.push(
      parties
        .map((p) => {
          const entry = payload.obligations.find((o) => o.party === p);
          if (!entry || entry.items.length === 0) return "";
          return `
            <h3>${escapeHtml(partyLabel(p, t))}</h3>
            <ul>${entry.items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>
          `;
        })
        .join(""),
    );
  }

  // Payment
  if (
    payload.paymentTerms.amount ||
    payload.paymentTerms.schedule ||
    payload.paymentTerms.lateFees ||
    payload.paymentTerms.notes
  ) {
    const pt = payload.paymentTerms;
    sections.push(`<h2>${escapeHtml(t.report.payment.tag)}</h2>`);
    sections.push(`
      <table>
        <tbody>
          ${pt.amount ? `<tr><th>${escapeHtml(t.report.payment.amount)}</th><td>${escapeHtml(pt.amount)}</td></tr>` : ""}
          ${pt.schedule ? `<tr><th>${escapeHtml(t.report.payment.schedule)}</th><td>${escapeHtml(pt.schedule)}</td></tr>` : ""}
          ${pt.lateFees ? `<tr><th>${escapeHtml(t.report.payment.lateFees)}</th><td>${escapeHtml(pt.lateFees)}</td></tr>` : ""}
          ${pt.notes ? `<tr><th>${escapeHtml(t.report.payment.notes)}</th><td>${escapeHtml(pt.notes)}</td></tr>` : ""}
        </tbody>
      </table>
    `);
  }

  // Termination
  if (
    payload.termination.notice ||
    payload.termination.renewal ||
    payload.termination.cancellation ||
    payload.termination.notes
  ) {
    const tn = payload.termination;
    sections.push(`<h2>${escapeHtml(t.report.termination.tag)}</h2>`);
    sections.push(`
      <table>
        <tbody>
          ${tn.notice ? `<tr><th>${escapeHtml(t.report.termination.notice)}</th><td>${escapeHtml(tn.notice)}</td></tr>` : ""}
          ${tn.renewal ? `<tr><th>${escapeHtml(t.report.termination.renewal)}</th><td>${escapeHtml(tn.renewal)}</td></tr>` : ""}
          ${tn.cancellation ? `<tr><th>${escapeHtml(t.report.termination.cancellation)}</th><td>${escapeHtml(tn.cancellation)}</td></tr>` : ""}
          ${tn.notes ? `<tr><th>${escapeHtml(t.report.termination.notes)}</th><td>${escapeHtml(tn.notes)}</td></tr>` : ""}
        </tbody>
      </table>
    `);
  }

  // Deadlines
  if (payload.deadlines.length > 0) {
    sections.push(`<h2>${escapeHtml(t.report.deadlines.tag)}</h2>`);
    sections.push(
      `<ul>${payload.deadlines
        .map(
          (d) =>
            `<li><strong>${escapeHtml(d.date ?? "—")}</strong> — ${escapeHtml(d.event)}</li>`,
        )
        .join("")}</ul>`,
    );
  }

  // Missing protections
  if (payload.missingProtections.length > 0) {
    sections.push(`<h2>${escapeHtml(t.report.missing.tag)}</h2>`);
    sections.push(
      `<ul>${payload.missingProtections
        .map((m) => `<li>${escapeHtml(m)}</li>`)
        .join("")}</ul>`,
    );
  }

  // Ambiguous language
  if (payload.ambiguousLanguage.length > 0) {
    sections.push(`<h2>${escapeHtml(t.report.ambiguous.tag)}</h2>`);
    sections.push(
      payload.ambiguousLanguage
        .map(
          (a) => `
        <div style="margin-bottom: 14px;">
          <p class="quote">"${escapeHtml(a.quote)}"</p>
          <p style="font-size: 14px; color: #4b5563;"><strong>${escapeHtml(t.report.ambiguous.why)}</strong> ${escapeHtml(a.whyUnclear)}</p>
        </div>
      `,
        )
        .join(""),
    );
  }

  // Questions to ask
  sections.push(`<h2>${escapeHtml(t.report.questions.tag)}</h2>`);
  sections.push(
    payload.questionsToAsk
      .map(
        (q, i) => `
        <div class="question">
          <span class="num">${i + 1}</span>
          <span>${escapeHtml(q)}</span>
        </div>
      `,
      )
      .join(""),
  );

  // Negotiation
  if (payload.negotiationOpportunities.length > 0) {
    sections.push(`<h2>${escapeHtml(t.report.negotiation.tag)}</h2>`);
    sections.push(
      `<ul>${payload.negotiationOpportunities
        .map((n) => `<li>${escapeHtml(n)}</li>`)
        .join("")}</ul>`,
    );
  }

  // Confidence
  sections.push(`<h2>${escapeHtml(t.report.confidence.tag)}</h2>`);
  sections.push(`<p>${escapeHtml(payload.caveat)}</p>`);

  // Disclaimer banner
  sections.push(`
    <div class="disclaimer">
      <strong>${escapeHtml(t.report.disclaimer.title)}</strong><br>
      ${escapeHtml(t.report.disclaimer.body)}
    </div>
  `);

  // Footer
  sections.push(`
    <div class="footer">
      ${escapeHtml(t.report.heading.generatedBy)} ·
      <a href="https://offershield.pro/${escapeHtml(locale)}">offershield.pro</a>
    </div>
  `);

  return `<!DOCTYPE html>
<html lang="${escapeHtml(locale)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(docType)} — OfferShield</title>
  <style>${css}</style>
</head>
<body>
  <div class="page">
${sections.join("\n")}
  </div>
</body>
</html>`;
}

/* ---------------------------- Markdown export ----------------------------- */

export function exportMarkdown(
  payload: AnalysisPayload,
  t: Dictionary,
  locale: string,
): string {
  const r = riskLevel(payload.riskLevel);
  const date = todayStamp();
  const docType = payload.documentType || "Contract";

  const lines: string[] = [];
  lines.push(`# ${docType}`);
  lines.push("");
  lines.push(
    `**${r.label}** risk · **${payload.riskScore}/100** · ${date} · ${locale.toUpperCase()}`,
  );
  lines.push("");
  lines.push(`> ${payload.riskExplanation}`);
  lines.push("");

  lines.push(`## ${t.report.exec.tag}`);
  lines.push("");
  lines.push(payload.executiveSummary);
  lines.push("");

  lines.push(`## ${t.report.plain.tag}`);
  lines.push("");
  lines.push(payload.plainEnglishExplanation);
  lines.push("");

  if (payload.keyClauses.length > 0) {
    lines.push(`## ${t.report.clauses.tag}`);
    lines.push("");
    for (const kc of payload.keyClauses) {
      lines.push(`### ${kc.title}`);
      lines.push("");
      lines.push(kc.explanation);
      lines.push("");
    }
  }

  if (payload.redFlags.length > 0) {
    lines.push(`## ${t.report.redFlags.tag}`);
    lines.push("");
    for (const f of payload.redFlags) {
      lines.push(`- **[${f.severity.toUpperCase()}]** ${f.title}`);
      lines.push(`  ${f.detail}`);
    }
    lines.push("");
  }

  if (payload.obligations.length > 0) {
    lines.push(`## ${t.report.obligations.tag}`);
    lines.push("");
    const parties = ["you", "counterparty", "mutual"] as const;
    for (const p of parties) {
      const entry = payload.obligations.find((o) => o.party === p);
      if (!entry || entry.items.length === 0) continue;
      lines.push(`### ${partyLabel(p, t)}`);
      lines.push("");
      for (const item of entry.items) lines.push(`- ${item}`);
      lines.push("");
    }
  }

  if (
    payload.paymentTerms.amount ||
    payload.paymentTerms.schedule ||
    payload.paymentTerms.lateFees ||
    payload.paymentTerms.notes
  ) {
    const pt = payload.paymentTerms;
    lines.push(`## ${t.report.payment.tag}`);
    lines.push("");
    lines.push(`| ${t.report.payment.amount} | ${t.report.payment.schedule} | ${t.report.payment.lateFees} | ${t.report.payment.notes} |`);
    lines.push(`|---|---|---|---|`);
    lines.push(`| ${pt.amount ?? "—"} | ${pt.schedule ?? "—"} | ${pt.lateFees ?? "—"} | ${pt.notes ?? "—"} |`);
    lines.push("");
  }

  if (
    payload.termination.notice ||
    payload.termination.renewal ||
    payload.termination.cancellation ||
    payload.termination.notes
  ) {
    const tn = payload.termination;
    lines.push(`## ${t.report.termination.tag}`);
    lines.push("");
    lines.push(`- **${t.report.termination.notice}:** ${tn.notice ?? "—"}`);
    lines.push(`- **${t.report.termination.renewal}:** ${tn.renewal ?? "—"}`);
    lines.push(`- **${t.report.termination.cancellation}:** ${tn.cancellation ?? "—"}`);
    lines.push(`- **${t.report.termination.notes}:** ${tn.notes ?? "—"}`);
    lines.push("");
  }

  if (payload.deadlines.length > 0) {
    lines.push(`## ${t.report.deadlines.tag}`);
    lines.push("");
    for (const d of payload.deadlines) {
      lines.push(`- **${d.date ?? "—"}** — ${d.event}`);
    }
    lines.push("");
  }

  if (payload.missingProtections.length > 0) {
    lines.push(`## ${t.report.missing.tag}`);
    lines.push("");
    for (const m of payload.missingProtections) lines.push(`- ${m}`);
    lines.push("");
  }

  if (payload.ambiguousLanguage.length > 0) {
    lines.push(`## ${t.report.ambiguous.tag}`);
    lines.push("");
    for (const a of payload.ambiguousLanguage) {
      lines.push(`- *"${a.quote}"*`);
      lines.push(`  - **${t.report.ambiguous.why}** ${a.whyUnclear}`);
    }
    lines.push("");
  }

  lines.push(`## ${t.report.questions.tag}`);
  lines.push("");
  payload.questionsToAsk.forEach((q, i) => {
    lines.push(`${i + 1}. ${q}`);
  });
  lines.push("");

  if (payload.negotiationOpportunities.length > 0) {
    lines.push(`## ${t.report.negotiation.tag}`);
    lines.push("");
    for (const n of payload.negotiationOpportunities) lines.push(`- ${n}`);
    lines.push("");
  }

  lines.push(`## ${t.report.confidence.tag}`);
  lines.push("");
  lines.push(payload.caveat);
  lines.push("");

  lines.push("---");
  lines.push("");
  lines.push(`> **${t.report.disclaimer.title}**  `);
  lines.push(`> ${t.report.disclaimer.body}`);
  lines.push("");
  lines.push(`*${t.report.heading.generatedBy} · [offershield.pro](https://offershield.pro/${locale})*`);

  return lines.join("\n");
}

/* ----------------------------- File naming -------------------------------- */

export function reportFilename(
  base: "html" | "md",
  locale: string,
  documentType: string,
): string {
  // Slugify: lowercase, ASCII letters/digits, hyphens for spaces
  const slug = documentType
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "report";
  const ext = base === "html" ? "html" : "md";
  return `offerShield-report-${todayStamp()}-${locale}-${slug}.${ext}`;
}
