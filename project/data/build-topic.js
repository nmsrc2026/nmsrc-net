// NMSRC topic-page builder. Loaded + eval'd inside run_script.
// Exposes globalThis.buildTopicPage(slug, sections) -> full HTML string.
(function () {
  const esc = s => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const T = globalThis.NMSRC_TOPICS;
  const fileFor = s => `topic-${s}.html`;
  const idxOf = s => T.findIndex(t => t[0] === s);

  function renderRow(r) {
    const isWP = !r.year;
    const yr = isWP ? `<span class="pub-year wp">WP</span>` : `<span class="pub-year">${esc(r.year)}</span>`;
    const parts = [];
    if (r.authors) parts.push(`<span class="authors">${esc(r.authors)}</span>`);
    // suppress redundant "Working Paper" journal label (the WP tag already says it)
    if (r.journal && !/^working paper$/i.test(r.journal.trim())) parts.push(`<span class="journal">${esc(r.journal)}</span>`);
    const meta = parts.join(`<span class="sep">&middot;</span>`);
    const inner = `${yr}\n          <div>\n            <span class="pub-title">${esc(r.title)}</span>\n            <div class="pub-meta">${meta}</div>\n          </div>`;
    return r.href
      ? `        <a class="pub-row" href="${r.href}" target="_blank" rel="noopener">\n          ${inner}\n        </a>`
      : `        <div class="pub-row">\n          ${inner}\n        </div>`;
  }

  function renderSections(sections) {
    return sections.filter(sec => sec.rows.length > 0).map(sec => {
      const rows = sec.rows.map(renderRow).join("\n");
      return `      <div class="pub-section">
        <div class="pub-section-head">
          <h2>${esc(sec.title)}</h2>
          <span class="pcount">${sec.rows.length} ${sec.rows.length === 1 ? "Entry" : "Entries"}</span>
        </div>
${rows}
      </div>`;
    }).join("\n");
  }

  globalThis.buildTopicPage = function (slug, sections) {
    const i = idxOf(slug);
    const [, name, paras] = T[i];
    const num = String(i + 1).padStart(2, "0");
    const prev = T[(i - 1 + T.length) % T.length];
    const next = T[(i + 1) % T.length];
    const related = T.filter((_, j) => j !== i).slice(0, 3).map(tp => {
      const ri = idxOf(tp[0]);
      return `        <a class="rel-item" href="${fileFor(tp[0])}"><span class="rn">${String(ri + 1).padStart(2, "0")}</span><span class="rname">${esc(tp[1])}</span></a>`;
    }).join("\n");
    const paraHtml = paras.map(p => `            <p>${esc(p)}</p>`).join("\n");
    const total = sections.reduce((a, s) => a + s.rows.length, 0);
    const hasPubs = total > 0;
    const card = hasPubs
      ? `        <div class="pub-card">
          <div class="pc-eyebrow">Research Stream &middot; ${num}</div>
          <h3>Working Papers &amp; Published Research</h3>
          <p>This stream collects ${total} working papers and published research papers contributed by community members. Each links to the source.</p>
          <a class="pub-btn" href="#publications">Jump to publications <span>&darr;</span></a>
        </div>`
      : `        <div class="pub-card">
          <div class="pc-eyebrow">Research Stream &middot; ${num}</div>
          <h3>Working Papers &amp; Published Research</h3>
          <p>Publications for this stream are being compiled and will appear here.</p>
        </div>`;
    const pubsSection = hasPubs
      ? `\n  <section class="pubs" id="publications">
    <div class="wrap">
${renderSections(sections)}
    </div>
  </section>\n`
      : "";
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(name)} — NMSRC</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,400&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
</head>
<body data-screen-label="${esc(name)}">

<header class="topbar">
  <div class="wrap topbar-inner">
    <a class="brand" href="NMSRC.html">NMSRC<span class="brand-dot">.</span><small>Non-Market Strategy</small></a>
    <nav class="nav">
      <a href="NMSRC.html"><span class="num">01</span> Home</a>
      <a href="members.html"><span class="num">02</span> Members</a>
      <a href="academic-work.html"><span class="num">03</span> Academic Work</a>
      <a href="NMSRC.html#contact" class="nav-cta">Contact</a>
    </nav>
  </div>
</header>

<main>
  <section class="page-hero">
    <div class="wrap">
      <nav class="crumbs"><a href="NMSRC.html">Home</a><span class="sep">/</span><a href="academic-work.html">Academic Work</a><span class="sep">/</span><span>${esc(name)}</span></nav>
      <h1>${esc(name).replace(/ /, "<br>")}</h1>
    </div>
  </section>

  <section class="topic-page">
    <div class="wrap">
      <div class="topic-lead">
        <div class="intro-text">
${paraHtml}
        </div>
${card}
      </div>
    </div>
  </section>
${pubsSection}
  <section class="related">
    <div class="wrap">
      <div class="rel-head">Related research streams</div>
      <div class="rel-grid">
${related}
      </div>
    </div>
  </section>

  <section class="wrap">
    <div class="topic-nav">
      <a href="${fileFor(prev[0])}"><span class="tn-dir">&larr; Previous</span><span class="tn-name">${esc(prev[1])}</span></a>
      <a class="tn-next" href="${fileFor(next[0])}"><span class="tn-dir">Next &rarr;</span><span class="tn-name">${esc(next[1])}</span></a>
    </div>
  </section>
</main>

<footer class="footer">
  <div class="wrap">
    <div class="footer-grid">
      <div><a class="brand" href="NMSRC.html">NMSRC<span class="brand-dot">.</span></a></div>
      <div class="footer-links">
        <div class="footer-col">
          <div class="fc-head">Menu</div>
          <a href="NMSRC.html">Home</a>
          <a href="members.html">Members</a>
          <a href="academic-work.html">Academic Work</a>
          <a href="NMSRC.html#contact">Contact</a>
        </div>
      </div>
    </div>
    <div class="footer-base">
      <span>&copy; 2026 Non-Market Strategy Research Community</span>
      <span>nmsrc.net</span>
    </div>
  </div>
</footer>

</body>
</html>`;
  };
})();
