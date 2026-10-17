/* Jaiye Oluwatishe Daniel · portfolio home. Plain JS, no build step.
   Project data lives in data.js (window.SITE), generated from data.json. */
(() => {
'use strict';

const PHONE = '2348026364572';
const EMAIL = 'jaiyetishe@gmail.com';
const wa = (msg) => `https://wa.me/${PHONE}?text=${encodeURIComponent(msg || "Hi Jaiye, I saw your portfolio and I'd like to talk about a project.")}`;

const SITE = window.SITE || { sections: [], projects: [] };
const SECTIONS = SITE.sections;
const PROJECTS = SITE.projects;
const REAL = PROJECTS.filter((p) => !p.reel);
const byId = Object.fromEntries(PROJECTS.map((p) => [p.id, p]));
const pageOf = (p) => (p.reel ? 'showreel.html' : `work/${p.id}.html`);

/* ---------------- Tools in the hero (official brand marks from Simple Icons, CC0) ---------------- */
const TOOLS = [
  ['Figma', 'figma', 7, 20, -4], ['Framer', 'framer', 15, 44, 3], ['Notion', 'notion', 5, 68, -3], ['Miro', 'miro', 22, 12, 4], ['Maze', 'maze', 14, 88, -2],
  ['Jira', 'jira', 84, 18, 3], ['Webflow', 'webflow', 91, 42, -4], ['Claude', 'claude', 81, 64, 2], ['LottieFiles', 'lottiefiles', 90, 86, -3], ['Loom', 'loom', 74, 10, 4],
];

/* ---------------- Skills ---------------- */
const IC = {
  product: '<path class="duo" d="M4 5h16v11H4z"/><path class="ln" d="M4 5h16v11H4zM9 20h6M12 16v4M8 10l2.5 2.5L16 8"/>',
  ia: '<path class="duo" d="M9 3h6v5H9z"/><path class="ln" d="M9 3h6v5H9zM3 16h6v5H3zM15 16h6v5h-6zM12 8v4M6 16v-4h12v4"/>',
  sys: '<circle class="duo" cx="12" cy="12" r="3.5"/><path class="ln" d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM5 5l4.5 4.5M19 5l-4.5 4.5M5 19l4.5-4.5M19 19l-4.5-4.5"/><circle class="ln" cx="4" cy="4" r="1.6"/><circle class="ln" cx="20" cy="4" r="1.6"/><circle class="ln" cx="4" cy="20" r="1.6"/><circle class="ln" cx="20" cy="20" r="1.6"/>',
  motion: '<path class="duo" d="M3 19c6 0 6-14 12-14h6v14z"/><path class="ln" d="M3 19c6 0 6-14 12-14h6"/><circle class="ln" cx="15" cy="5" r="2"/><path class="ln" d="M3 22h18" stroke-dasharray="2 3"/>',
  game: '<path class="duo" d="M6 8h12a4 4 0 0 1 4 4.5l-.6 4A2.5 2.5 0 0 1 17 18l-2-2H9l-2 2a2.5 2.5 0 0 1-4.4-1.5l-.6-4A4 4 0 0 1 6 8z"/><path class="ln" d="M6 8h12a4 4 0 0 1 4 4.5l-.6 4A2.5 2.5 0 0 1 17 18l-2-2H9l-2 2a2.5 2.5 0 0 1-4.4-1.5l-.6-4A4 4 0 0 1 6 8zM7 11v3M5.5 12.5h3"/><circle class="ln" cx="16" cy="11.5" r=".6"/><circle class="ln" cx="18" cy="13.5" r=".6"/>',
  ds: '<path class="duo" d="M3 13h8v8H3z"/><path class="ln" d="M3 13h8v8H3zM13 13h8v8h-8zM3 3h8v8H3z"/><circle class="ln" cx="17" cy="7" r="4"/>',
  research: '<circle class="duo" cx="10.5" cy="10.5" r="6.5"/><circle class="ln" cx="10.5" cy="10.5" r="6.5"/><path class="ln" d="M15.5 15.5L21 21M8 13c.5-1.4 1.4-2 2.5-2s2 .6 2.5 2"/><circle class="ln" cx="10.5" cy="8.6" r="1.4"/>',
  brand: '<path class="duo" d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/><path class="ln" d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>',
  deck: '<path class="duo" d="M3 4h18v12H3z"/><path class="ln" d="M3 4h18v12H3zM12 16v4M8 20h8M7 12v-2M11 12V8M15 12V9.5M19 12V7"/>',
  proto: '<path class="duo" d="M3 3h13v13H3z"/><path class="ln" d="M3 3h13v13H3z"/><path class="ln" d="M12 12l9 3.5-4 1.5-1.5 4z"/>',
  writing: '<path class="duo" d="M4 5h16v10H9l-5 4z"/><path class="ln" d="M4 5h16v10H9l-5 4zM8 9h8M8 12h5"/>',
  a11y: '<circle class="duo" cx="12" cy="12" r="9"/><circle class="ln" cx="12" cy="12" r="9"/><circle class="ln" cx="12" cy="7.5" r="1.3"/><path class="ln" d="M7.5 10.5l4.5 1 4.5-1M12 11.5V15l-2 3.5M12 15l2 3.5"/>',
};
const svgIc = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${IC[k]}</svg>`;
const SKILLS = [
  { ic: 'product', t: 'Product design, end to end', d: 'From the first interview to the developer handoff. I lead discovery, map the flows, design the UI and stay through QA.', big: true },
  { ic: 'ia', t: 'Information architecture', d: 'Sitemaps and navigation that make sense.' },
  { ic: 'sys', t: 'System architecture', d: 'How screens, data and services connect.' },
  { ic: 'motion', t: 'Interaction and motion', d: 'Motion that explains what just changed.' },
  { ic: 'game', t: 'Game UI design', d: 'HUDs, menus and loops that keep players in.' },
  { ic: 'ds', t: 'Design systems', d: 'Tokens and components that scale with the team.' },
  { ic: 'research', t: 'UX research', d: 'Interviews, surveys and usability testing.' },
  { ic: 'proto', t: 'Prototyping and tools', d: 'Clickable prototypes that win approvals early.', wide: true, tools: ['Figma', 'FigJam', 'Framer', 'Miro', 'Notion', 'Jira', 'Illustrator', 'Photoshop', 'Webflow', 'Claude'] },
  { ic: 'brand', t: 'Brand identity', d: 'Marks, type and colour with a reason.' },
  { ic: 'deck', t: 'Pitch decks and PRDs', d: 'Stories and specs teams can act on.' },
  { ic: 'writing', t: 'UX writing', d: 'Plain words that tell people what to do.' },
  { ic: 'a11y', t: 'Accessibility', d: 'Contrast, focus and sizes for everyone.' },
];

/* ---------------- Experience ---------------- */
const EXP = [
  ['Dec 2025 – Jun 2026', 'Daticks', 'Product Manager and Product Designer', 'Data-skills validation platform. Research with 30+ analysts, the end-to-end product and a design system.'],
  ['Aug – Nov 2025', 'Vestpi', 'Product Designer', 'Websites, landing pages and products for fintech and Web3 startups.'],
  ['Apr – Jul 2025', 'Vestpad', 'Product Designer', 'Token launchpad: onboarding, staking, mining and investor dashboards.'],
  ['Jan – Mar 2025', 'ChainPay', 'UI/UX Designer', 'Crypto payroll with bulk payments and treasury dashboards.'],
  ['Oct – Dec 2024', 'EmitCrypto', 'UI/UX Designer', 'Analytics dashboards and admin tools.'],
  ['Jul – Sep 2024', 'OzoneChain', 'UI/UX Designer', 'Corporate website with clearer navigation.'],
  ['Apr – Jun 2024', 'LightSpeed', 'UI/UX Designer', 'Product pages and conversion-focused journeys.'],
];

/* ---------------- Pricing ---------------- */
const PRICES = [
  { t: 'Landing page', usd: 150, time: '5 to 7 days', gets: ['One-page design for desktop and mobile', 'Copy polish so the page sells', 'Motion and interaction notes', 'Clickable prototype', 'Two rounds of changes', 'Source Figma file'] },
  { t: 'Brand identity', usd: 200, time: 'About 2 weeks', gets: ['Logo suite and app icon', 'Colour and type system', 'Brand guidelines PDF', 'Social media kit', 'Stationery and mockups', 'Source files'] },
  { t: 'Pitch deck or PRD', usd: 120, time: 'About 1 week', gets: ['Up to 15 slides or PRD pages', 'Charts and diagrams from your data', 'Story and structure review', 'Speaker notes', 'Editable Figma or PowerPoint file'] },
  { t: 'Mobile app design', usd: 500, time: '3 to 4 weeks', hot: true, gets: ['Research summary and user flows', 'Sitemap and information architecture', 'Up to 25 screens, iOS and Android', 'Design system and components', 'Clickable prototype', 'Developer handoff and QA'] },
  { t: 'Dashboard or SaaS', usd: 600, time: '4 to 5 weeks', gets: ['Discovery workshop with your team', 'Data and permissions mapping', 'Up to 20 dashboard screens', 'Component library', 'Prototype of key flows', 'Handoff and design QA'] },
  { t: 'Game UI', usd: 300, time: '2 to 3 weeks', gets: ['HUD, menus and key screens', 'UI kit with states', 'Icon set', 'Clickable prototype', 'Source files'] },
  { t: 'Full website project', usd: 400, time: '3 to 4 weeks', web: true, badge: 'Design and build', gets: ['Up to 6 pages, designed and built', 'Live, fast and responsive site', 'Scroll animations and interactions', 'Editable content (CMS)', 'Domain setup, SEO basics and analytics', '30 days of support after launch'] },
];
const CUR = [['USD', 'US dollar', 1], ['GBP', 'British pound', 0.75], ['EUR', 'Euro', 0.86], ['NGN', 'Nigerian naira', 1460], ['CAD', 'Canadian dollar', 1.38]];

/* ---------------- Blog ---------------- */
const POSTS = [
  { slug: 'checkout-trust', cat: 'Product design', t: 'Why checkout loses trust in three taps', d: 'What I learned designing Protected Pay, and the small screens that make paying a stranger feel safe.', date: 'Oct 2026', mins: 6, img: 'img/work/staza/1-mobile.webp' },
  { slug: 'sitemap-saves-a-sprint', cat: 'Information architecture', t: 'A sitemap saves you a sprint', d: 'How mapping pages and data first stops expensive redesigns later.', date: 'Oct 2026', mins: 5, img: 'img/work/staza/4-flow.webp' },
  { slug: 'dashboards-people-read', cat: 'SaaS', t: 'Dashboards people read, not just look at', d: 'Start every chart with the decision it should help someone make.', date: 'Oct 2026', mins: 7, img: 'img/work/fanfare/1-overview.webp' },
];

/* ---------------- FAQ ---------------- */
const FAQ = [
  ['How do we start?', 'Message me on WhatsApp with what you are building. I reply within a day with a few questions, then send a fixed quote and a timeline.'],
  ['How do payments work?', 'Half to start and half when I hand off the files. Longer projects can be split into milestones. I accept bank transfer in naira, and international payments through Wise, Payoneer or USDT.'],
  ['Do you work with teams outside Nigeria?', 'Yes. I have worked with founders and teams across Africa, Europe and North America. We agree on overlap hours and I share progress every few days.'],
  ['How many changes can I ask for?', 'Every package includes two full rounds of changes. Small fixes along the way are free. If the scope changes, I tell you the cost before doing the work.'],
  ['Can you build the website too?', 'Yes. The full website project includes design and build: a fast, responsive site with animations, editable content, SEO basics and 30 days of support.'],
  ['Are the projects real?', 'Some are client work from the roles in my CV, and many are self-initiated concept projects built around real problems. Each case study page says which type it is.'],
  ['Are you open to full-time roles?', 'Yes. I am open to Product Designer and UI/UX roles, remote or hybrid. Download my CV or message me directly.'],
];

/* ================= Helpers ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const motionOn = () => root.dataset.motion !== 'off';
const isTouch = matchMedia('(hover:none),(pointer:coarse)').matches;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const check = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const ACCENTS = [['Blue', '#1F3BD6'], ['Violet', '#6D3CF2'], ['Teal', '#0E9F86'], ['Orange', '#EA580C'], ['Pink', '#DB2777']];
let S = {};
try { S = JSON.parse(localStorage.getItem('jaiye-settings-v2') || '{}'); } catch (e) {}
const save = () => { try { localStorage.setItem('jaiye-settings-v2', JSON.stringify(S)); } catch (e) {} };

let actx;
function tick(freq = 660, dur = 0.05) {
  if (!S.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.06, actx.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
    o.connect(g).connect(actx.destination); o.start(); o.stop(actx.currentTime + dur);
  } catch (e) {}
}
let toastT;
function toast(msg) { const t = $('.toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2200); }

/* Liquid page transition, then navigate */
function go(href, x, y) {
  if (!motionOn()) { location.href = href; return; }
  const box = $('#case');
  box.style.setProperty('--cx', (x ?? innerWidth / 2) + 'px');
  box.style.setProperty('--cy', (y ?? innerHeight / 2) + 'px');
  box.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add('open')));
  setTimeout(() => { location.href = href; }, 420);
}
addEventListener('pageshow', () => { const b = $('#case'); if (b) { b.classList.remove('open'); b.hidden = true; } });

/* ================= Render ================= */
function renderWA() { $$('[data-wa]').forEach((a) => { a.href = wa(a.dataset.waMsg); a.target = '_blank'; a.rel = 'noopener'; }); }

function renderTools() {
  const chip = (t, dup, i = 0) => `<span class="tool glass${dup ? ' dup' : ''}" ${dup ? 'aria-hidden="true"' : ''} style="--i:${i};left:${t[2]}%;top:${t[3]}%;--rot:${t[4]}deg;--dur:${5 + (t[2] % 4)}s;--delay:-${t[3] % 6}s"><span class="g"><img src="img/tools/${t[1]}.svg" alt="" width="18" height="18"></span>${t[0]}</span>`;
  $('.tools').innerHTML = `<div class="tool-track">${TOOLS.map((t, i) => chip(t, false, i)).join('')}${TOOLS.map((t) => chip(t, true)).join('')}</div>`;
}

function renderWall() {
  const pick = (ids, i) => ids.map((id) => { const p = byId[id]; const s = p.screens[Math.min(i, p.screens.length - 1)]; return { p, src: s[0] }; });
  const row1 = pick(['staza', 'haulr', 'fanfare', 'daticks', 'kasuwa', 'stackwise', 'carewell', 'nullorbit', 'mudu'], 1);
  const row2 = pick(['ledgerly', 'imole', 'aurum', 'touchline', 'afterglow', 'echoform', 'orosocial', 'aaro'], 0);
  const html = (items) => {
    const one = items.map(({ p, src }) => `<a class="wall-item" href="${pageOf(p)}" tabindex="-1"><img src="${src}" alt="" decoding="async"><span>${esc(p.name)}</span></a>`).join('');
    return one + one;
  };
  $('.wall .wr1').innerHTML = html(row1);
  $('.wall .wr2').innerHTML = html(row2);
  const n = $('[data-count-projects]'); if (n) n.textContent = REAL.length;
}

/* Hero wall: rows drift on their own, speed up with scroll, follow the pointer and can be dragged. */
function initWall() {
  const wall = $('.wall'), tilt = $('.wall-tilt');
  if (!wall) return;
  const rows = $$('.wall-row', wall).map((el, i) => ({ el, x: i ? -300 : 0, dir: i ? 1 : -1, w: 0 }));
  const measure = () => rows.forEach((r) => (r.w = r.el.scrollWidth / 2));
  measure(); addEventListener('resize', measure); addEventListener('load', measure);
  let boost = 0, lastY = scrollY, rx = 14, ry = 0, trx = 14, try_ = 0, drag = null, hover = false, last = performance.now();
  addEventListener('scroll', () => { boost = Math.min(14, boost + Math.abs(scrollY - lastY) * 0.06); lastY = scrollY; }, { passive: true });
  wall.addEventListener('pointerenter', () => (hover = true));
  wall.addEventListener('pointerleave', () => { hover = false; try_ = 0; });
  wall.addEventListener('pointermove', (e) => {
    const r = wall.getBoundingClientRect();
    try_ = ((e.clientX - r.left) / r.width - 0.5) * 10;
    if (drag) { const dx = e.clientX - drag.x; drag.x = e.clientX; rows.forEach((row) => (row.x += dx)); drag.moved += Math.abs(dx); }
  });
  wall.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, moved: 0 }; wall.classList.add('grabbing'); });
  addEventListener('pointerup', () => { if (drag) { wall.classList.remove('grabbing'); wall._moved = drag.moved; drag = null; } });
  wall.addEventListener('click', (e) => { if (wall._moved > 6) { e.preventDefault(); e.stopPropagation(); } wall._moved = 0; }, true);
  const frame = (t) => {
    const dt = Math.min(48, t - last); last = t;
    if (motionOn()) {
      const sp = (hover && !drag ? 0.25 : 1) * (0.045 + boost * 0.02);
      boost *= 0.94;
      rows.forEach((r) => {
        if (!drag) r.x += r.dir * sp * dt;
        if (r.w) { if (r.x < -r.w) r.x += r.w; if (r.x > 0) r.x -= r.w; }
        r.el.style.transform = `translate3d(${r.x}px,0,0)`;
      });
      const sy = Math.max(0, 16 - scrollY / 40);
      trx = sy;
      rx += (trx - rx) * 0.08; ry += (try_ - ry) * 0.08;
      tilt.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04)`;
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

function mediaHTML(p) {
  if (p.tall) {
    return `<div class="card-media scroller" data-go="${pageOf(p)}" data-cursor="Open"><img src="${p.screens[0][0]}" alt="${esc(p.name)}: full landing page" loading="lazy"><span class="m-badge glass">Live preview · hover to scroll</span></div>`;
  }
  const shots = [[p.cover, 'Cover']].concat(p.screens);
  return `<div class="card-media slides" data-go="${pageOf(p)}" data-cursor="Open">
    ${shots.map((s, i) => `<img src="${s[0]}" alt="${esc(p.name)}: ${esc(s[1])}" loading="lazy" class="${i ? '' : 'on'}" data-cap="${esc(s[1])}">`).join('')}
    <div class="m-bar glass"><span class="m-cap">Cover</span><span class="m-dots">${shots.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</span></div>
  </div>`;
}

function cardHTML(p, i) {
  const facts = (p.facts || []).slice(0, 2).map((f) => `<div class="fact"><b>${esc(f[0])}</b><small>${esc(f[1])}</small></div>`).join('');
  return `<article class="card" data-i="${i}" data-id="${p.id}">
    <button class="card-head" aria-expanded="false"><span class="no">${String(i + 1).padStart(2, '0')}</span><img class="th" src="${p.cover}" alt="" loading="lazy"><span class="t">${esc(p.name)}</span>${p.client ? '<span class="client">Client work</span>' : ''}<span class="d">${esc(p.line)}</span><span class="tag">${esc(p.tag)}</span></button>
    <div class="card-body"><div class="card-grid">
      ${mediaHTML(p)}
      <div class="card-info">
        <span class="kicker">${esc(p.kicker)} · ${esc(p.role)}</span>
        <h3 class="ci-title">${esc(p.line)}</h3>
        ${facts ? `<div class="facts">${facts}</div>` : ''}
        <div class="card-cta"><a class="btn btn-ink btn-sm" href="${pageOf(p)}" data-go-link>Read the case study →</a><a class="btn btn-glass btn-sm" target="_blank" rel="noopener" href="${wa(`Hi Jaiye, I saw ${p.name} on your portfolio. I'd like something similar.`)}">I want one like this</a></div>
      </div>
    </div></div>
  </article>`;
}

function renderWork() {
  const tabs = $('.tabs'), panels = $('.panels');
  tabs.innerHTML = '<span class="tab-pill" aria-hidden="true"></span>' + SECTIONS.map((s, i) => {
    const n = PROJECTS.filter((p) => p.sec === s.id).length;
    return `<button class="tab" role="tab" id="tab-${s.id}" aria-controls="panel-${s.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(s.label)}<span class="n">${n}</span></button>`;
  }).join('');
  panels.innerHTML = SECTIONS.map((s, si) => {
    const list = PROJECTS.filter((p) => p.sec === s.id);
    let inner;
    if (s.id === 'motion') {
      const shots = ['img/work/staza/1-mobile.webp', 'img/work/haulr/1-live-board.webp', 'img/work/fanfare/1-overview.webp', 'img/work/nullorbit/1-menu.webp', 'img/work/afterglow/1-posters.webp', 'img/work/aaro/1-logo.webp'];
      inner = `<div class="reel glass">
        <a class="reel-screen" href="showreel.html" data-cursor="Play" aria-label="Play the showreel">
          <div class="slides">${shots.map((k, i) => `<img src="${k}" alt="" loading="lazy" class="${i ? '' : 'on'}">`).join('')}</div>
          <span class="play"><svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="M8 5l11 7-11 7z" fill="currentColor"/></svg></span>
        </a>
        <div class="reel-copy"><span class="tag">Motion</span><h3 style="margin-top:12px">Showreel 2026</h3><p>A cut of product, brand and game work in motion, scored with an original track made in the browser. Plays in landscape or vertical, and downloads in full HD.</p><a class="btn btn-accent" href="showreel.html">Watch the reel</a></div>
      </div>`;
    } else {
      inner = `<div class="deck glass" data-deck>
        <div class="deck-scroll" tabindex="0" aria-label="${esc(s.label)} projects. Scroll to open the next card.">
          <div class="deck-stage">${list.map((p, i) => cardHTML(p, i)).join('')}</div>
          <div class="deck-spacer"></div>
        </div>
        <div class="deck-foot"><span class="df-txt">1 of ${list.length} open</span><span class="progress"><span></span></span></div>
      </div>`;
    }
    return `<div class="panel-sec${si === 0 ? ' on' : ''}" role="tabpanel" id="panel-${s.id}" aria-labelledby="tab-${s.id}">
      <div class="panel-intro"><p>${esc(s.intro)}</p></div>
      ${inner}
    </div>`;
  }).join('');
}

function renderSkills() {
  $('.bento').innerHTML = SKILLS.map((s) => {
    if (s.big) return `<div class="skill big glass" data-reveal><span class="ic">${svgIc(s.ic)}</span><h3>${s.t}</h3><p>${s.d}</p><div class="flow"><span><small>01</small>Discover</span><span><small>02</small>Map</span><span><small>03</small>Design</span><span><small>04</small>Ship</span></div></div>`;
    return `<div class="skill glass${s.wide ? ' wide' : ''}" data-reveal><span class="ic">${svgIc(s.ic)}</span><h3>${s.t}</h3><p>${s.d}</p>${s.tools ? `<div class="tool-row">${s.tools.map((t) => `<span>${t}</span>`).join('')}</div>` : ''}</div>`;
  }).join('');
}

function renderExp() {
  $('.timeline').innerHTML = EXP.map((x) => `<li data-reveal><span class="when">${x[0]}</span><h3>${x[1]}</h3><span class="role">${x[2]}</span><p>${x[3]}</p></li>`).join('');
}

const rates = Object.fromEntries(CUR.map((c) => [c[0], c[2]]));
const COUNTRIES = [
  ['United States', 'USD'], ['Nigeria', 'NGN'], ['United Kingdom', 'GBP'], ['Canada', 'CAD'],
  ['Germany', 'EUR'], ['France', 'EUR'], ['Ireland', 'EUR'], ['Netherlands', 'EUR'], ['Spain', 'EUR'], ['Italy', 'EUR'],
  ['Ghana', 'USD'], ['Kenya', 'USD'], ['South Africa', 'USD'], ['United Arab Emirates', 'USD'], ['Other country', 'USD'],
];
function homeCountry() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  if (tz === 'Africa/Lagos') return 'Nigeria';
  if (tz === 'Europe/London') return 'United Kingdom';
  if (/^America\/(Toronto|Vancouver|Edmonton|Winnipeg|Halifax|Montreal|Regina|St_Johns)/.test(tz)) return 'Canada';
  if (tz === 'Europe/Berlin') return 'Germany';
  if (tz === 'Europe/Paris') return 'France';
  if (tz === 'Europe/Dublin') return 'Ireland';
  if (tz === 'Europe/Amsterdam') return 'Netherlands';
  if (tz === 'Europe/Madrid') return 'Spain';
  if (tz === 'Europe/Rome') return 'Italy';
  if (tz === 'Africa/Accra') return 'Ghana';
  if (tz === 'Africa/Nairobi') return 'Kenya';
  if (tz === 'Africa/Johannesburg') return 'South Africa';
  if (tz === 'Asia/Dubai') return 'United Arab Emirates';
  if (tz.startsWith('America/')) return 'United States';
  return 'United States';
}
function nice(v, cur) {
  if (cur === 'USD') return v;
  if (cur === 'NGN') return Math.round(v / 5000) * 5000;
  return Math.round(v / 5) * 5;
}
function fmt(v, cur) {
  try { return new Intl.NumberFormat('en', { style: 'currency', currency: cur, maximumFractionDigits: 0, currencyDisplay: 'narrowSymbol' }).format(v); }
  catch (e) { return cur + ' ' + Math.round(v).toLocaleString(); }
}
function renderPricing() {
  const sel = $('#country'), pills = $('.cur-pills'), grid = $('.price-grid');
  sel.innerHTML = COUNTRIES.map(([n, c]) => `<option value="${n}">${n} · ${c}</option>`).join('');
  pills.innerHTML = '<span class="cur-pill-bg" aria-hidden="true"></span>' + CUR.map(([c, name]) => `<button role="radio" aria-checked="false" data-c="${c}" aria-label="${name}">${c}</button>`).join('');
  grid.innerHTML = PRICES.map((p) => {
    const list = `<ul>${p.gets.map((g) => `<li>${check}<span>${g}</span></li>`).join('')}</ul>`;
    const head = `<div class="p-top"><h3>${p.t}</h3>${p.hot ? '<span class="badge">Most booked</span>' : ''}${p.badge ? `<span class="badge">${p.badge}</span>` : ''}</div>
      <div class="from">Starting from</div><div class="amt" data-usd="${p.usd}">$${p.usd}</div><div class="time">${p.time}</div>`;
    const btn = `<a class="btn ${p.hot ? 'btn-accent' : 'btn-glass'}" target="_blank" rel="noopener" href="${wa(`Hi Jaiye, I'd like a quote for: ${p.t}.`)}">Start on WhatsApp</a>`;
    if (p.web) return `<div class="price web" data-reveal><div>${head}${btn}</div><div><div class="gets">What you get</div>${list}</div></div>`;
    return `<div class="price glass${p.hot ? ' hot' : ''}" data-reveal>${head}<div class="gets">What you get</div>${list}${btn}</div>`;
  }).join('');
  let cur = 'USD';
  const movePill = () => {
    const b = $(`button[data-c="${cur}"]`, pills), bg = $('.cur-pill-bg', pills);
    if (b) { bg.style.width = b.offsetWidth + 'px'; bg.style.transform = `translateX(${b.offsetLeft}px)`; }
  };
  const apply = (animate) => {
    $$('button', pills).forEach((b) => b.setAttribute('aria-checked', b.dataset.c === cur));
    movePill();
    $$('.amt', grid).forEach((a) => {
      const v = fmt(nice(+a.dataset.usd * rates[cur], cur), cur);
      if (animate && motionOn()) { a.classList.remove('flip'); void a.offsetWidth; a.classList.add('flip'); setTimeout(() => (a.textContent = v), 140); }
      else a.textContent = v;
    });
  };
  const setCur = (c, fromPill) => {
    cur = c; S.currency = c; save();
    if (fromPill && (COUNTRIES.find(([n]) => n === sel.value) || [])[1] !== c) sel.value = (COUNTRIES.find(([, cc]) => cc === c) || COUNTRIES[0])[0];
    apply(true); tick(700);
  };
  const country = S.country && COUNTRIES.some(([n]) => n === S.country) ? S.country : homeCountry();
  sel.value = country;
  cur = S.currency || COUNTRIES.find(([n]) => n === country)[1];
  sel.addEventListener('change', () => { S.country = sel.value; setCur(COUNTRIES.find(([n]) => n === sel.value)[1]); });
  $$('button', pills).forEach((b) => b.addEventListener('click', () => setCur(b.dataset.c, true)));
  apply(false);
  addEventListener('resize', movePill);
  if (document.fonts) document.fonts.ready.then(movePill);
  fetch('https://open.er-api.com/v6/latest/USD').then((r) => (r.ok ? r.json() : null)).then((j) => {
    if (j && j.rates) { CUR.forEach(([c]) => { if (j.rates[c]) rates[c] = j.rates[c]; }); apply(false); }
  }).catch(() => {});
}

function renderBlog() {
  $('.posts').innerHTML = POSTS.map((p) => `<a class="post glass" href="blog/${p.slug}.html" data-reveal data-cursor="Read">
    <div class="art"><img src="${p.img}" alt="" loading="lazy"></div>
    <div class="pb"><span class="cat">${p.cat}</span><h3>${p.t}</h3><p>${p.d}</p>
    <div class="byline"><img src="img/me.webp" alt=""><span><b>Jaiye Oluwatishe</b>${p.date} · ${p.mins} min read</span></div></div>
  </a>`).join('');
}

function renderFAQ() {
  $('.qa').innerHTML = FAQ.map((q, i) => `<details class="glass" data-reveal ${i === 0 ? 'open' : ''}><summary>${q[0]}<i aria-hidden="true"></i></summary><div class="ans">${q[1]}</div></details>`).join('');
}

/* ================= Behaviour ================= */
function splitText() {
  $$('[data-split]').forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w, i) => `<span class="w" aria-hidden="true"><span style="--i:${i}">${esc(w)}</span></span>`).join(' ');
    el.setAttribute('aria-label', words.join(' '));
    if (el.classList.contains('headline')) { const last = $$('.w>span', el).slice(-1)[0]; if (last) last.classList.add('accent'); }
  });
}

function reveal() {
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
  $$('[data-reveal],[data-split],.portrait').forEach((el) => io.observe(el));
  const cio = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, to = +el.dataset.count;
    if (!motionOn()) { el.textContent = to; return; }
    const t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / 900); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: 0.6 });
  $$('[data-count]').forEach((el) => cio.observe(el));
}

function initTabs() {
  const tabs = $$('.tab'), pill = $('.tab-pill');
  const move = (t) => { pill.style.width = t.offsetWidth + 'px'; pill.style.transform = `translateX(${t.offsetLeft}px)`; };
  const select = (t, focus) => {
    tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; });
    $$('.panel-sec').forEach((p) => p.classList.toggle('on', p.id === t.getAttribute('aria-controls')));
    move(t); if (focus) t.focus();
    t.scrollIntoView({ block: 'nearest', inline: 'center', behavior: motionOn() ? 'smooth' : 'auto' });
    const panel = $('#' + t.getAttribute('aria-controls')); const d = $('[data-deck]', panel); if (d) d._layout();
    tick(740);
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); select(tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length], true); }
    });
  });
  requestAnimationFrame(() => move(tabs[0]));
  addEventListener('resize', () => move($('.tab[aria-selected="true"]')));
  if (document.fonts) document.fonts.ready.then(() => move($('.tab[aria-selected="true"]')));
  window.selectSection = (id) => { const t = $('#tab-' + id); if (t) select(t); };
}

/* Count up the numbers inside a string ("30+", "₦500", "14 days") */
function countUp(el) {
  const txt = el.dataset.full || el.textContent; el.dataset.full = txt;
  const m = txt.match(/\d[\d,.]*/);
  if (!m || !motionOn()) { el.textContent = txt; return; }
  const to = parseFloat(m[0].replace(/,/g, '')), dec = (m[0].split('.')[1] || '').length;
  const t0 = performance.now();
  const step = (t) => {
    const k = Math.min(1, (t - t0) / 700), v = to * (1 - Math.pow(1 - k, 3));
    el.textContent = txt.replace(m[0], dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en'));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* 3D tilt on the open card's media */
function initTilt() {
  if (isTouch) return;
  document.addEventListener('pointermove', (e) => {
    const m = e.target.closest && e.target.closest('.card.open .card-media');
    $$('.card-media.tilting').forEach((x) => { if (x !== m) { x.classList.remove('tilting'); x.style.transform = ''; } });
    if (!m || !motionOn()) return;
    const r = m.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    m.classList.add('tilting');
    m.style.transform = `perspective(1200px) rotateY(${px * 5}deg) rotateX(${-py * 5}deg)`;
    m.style.setProperty('--gx', (px + 0.5) * 100 + '%'); m.style.setProperty('--gy', (py + 0.5) * 100 + '%');
  }, { passive: true });
}

/* Screens inside the open card play like a slideshow */
const slideTimers = new Map();
function playSlides(card, on) {
  const box = $('.card-media.slides', card);
  if (!box) return;
  clearInterval(slideTimers.get(card));
  if (!on || !motionOn()) return;
  const imgs = $$('img', box), dots = $$('.m-dots i', box), cap = $('.m-cap', box);
  let i = imgs.findIndex((x) => x.classList.contains('on'));
  const show = (n) => {
    imgs[i].classList.remove('on'); dots[i] && dots[i].classList.remove('on');
    i = (n + imgs.length) % imgs.length;
    imgs[i].classList.add('on'); dots[i] && dots[i].classList.add('on'); cap.textContent = imgs[i].dataset.cap;
  };
  box._show = show; box._idx = () => i;
  slideTimers.set(card, setInterval(() => { if (!document.hidden) show(i + 1); }, 2600));
}

function initDecks() {
  $$('[data-deck]').forEach((deck) => {
    const sc = $('.deck-scroll', deck), stage = $('.deck-stage', deck), spacer = $('.deck-spacer', deck);
    const cards = $$('.card', deck), n = cards.length;
    const txt = $('.df-txt', deck), bar = $('.progress span', deck);
    let active = -1;
    const STEP = () => (innerWidth < 640 ? 220 : 260);
    const HEAD = () => (innerWidth < 640 ? 56 : 62);
    const layout = (force) => {
      const H = stage.clientHeight; if (!H) return;
      spacer.style.height = (H + (n - 1) * STEP()) + 'px';
      const idx = Math.max(0, Math.min(n - 1, Math.round(sc.scrollTop / STEP())));
      if (idx === active && !force) return;
      const prev = active; active = idx;
      const SL = 12, GAP = 6, head = HEAD();
      const pastShown = Math.min(idx, 3), after = n - 1 - idx, afterShown = Math.min(after, innerWidth < 640 ? 2 : 3);
      const openH = H - pastShown * (SL + GAP) - afterShown * (head + GAP);
      cards.forEach((c, i) => {
        const d = i - idx;
        c.classList.toggle('open', d === 0); c.classList.toggle('past', d < 0); c.classList.toggle('gone', d < -3);
        $('.card-head', c).setAttribute('aria-expanded', d === 0);
        let h, mb = GAP;
        if (d === 0) h = openH; else if (d < 0) { h = d >= -3 ? SL : 0; mb = d >= -3 ? GAP : 0; } else h = head;
        c.style.setProperty('--h', h + 'px'); c.style.setProperty('--mb', mb + 'px');
        $$('a,button', $('.card-body', c)).forEach((b) => (b.tabIndex = d === 0 ? 0 : -1));
      });
      if (prev !== idx) {
        if (prev >= 0) playSlides(cards[prev], false);
        playSlides(cards[idx], true);
        const c = cards[idx]; c.classList.remove('enter'); void c.offsetWidth; c.classList.add('enter');
        $$('.fact b', c).forEach((b) => countUp(b));
      }
      txt.textContent = `${idx + 1} of ${n} open${idx < n - 1 ? ' · keep scrolling to unfold the next' : ''}`;
      bar.style.width = ((idx + 1) / n * 100) + '%';
      if (!force) tick(420 + idx * 30, 0.04);
    };
    deck._layout = () => layout(true);
    sc.addEventListener('scroll', () => requestAnimationFrame(() => layout()), { passive: true });
    addEventListener('resize', () => layout(true));
    cards.forEach((c, i) => $('.card-head', c).addEventListener('click', () => sc.scrollTo({ top: i * STEP(), behavior: motionOn() ? 'smooth' : 'auto' })));
    sc.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const i = Math.max(0, Math.min(n - 1, active + (e.key === 'ArrowDown' ? 1 : -1)));
        sc.scrollTo({ top: i * STEP(), behavior: motionOn() ? 'smooth' : 'auto' });
      }
    });
    // dots jump to a screen
    $$('.card-media.slides', deck).forEach((box) => $$('.m-dots i', box).forEach((dot, i) => dot.addEventListener('click', (e) => { e.stopPropagation(); if (box._show) box._show(i); })));
    layout(true);
  });
}

function initReel() {
  const imgs = $$('.reel-screen .slides img'); if (!imgs.length) return;
  let i = 0;
  setInterval(() => { if (!motionOn() || document.hidden) return; imgs[i].classList.remove('on'); i = (i + 1) % imgs.length; imgs[i].classList.add('on'); }, 2000);
}

/* Sheets */
let lastFocus;
function openSheet(id) {
  const el = $('#' + id); if (!el) return;
  lastFocus = document.activeElement; el.hidden = false; document.body.style.overflow = 'hidden';
  const f = $('input,button:not([data-close]),[tabindex]', $('.panel', el)) || $('.panel', el);
  setTimeout(() => f && f.focus(), 30);
  if (id === 'cmdk') { const i = $('#cmdk input'); i.value = ''; buildCmd(''); }
  if (id === 'game') resetGame();
  tick(600);
}
function closeSheets() {
  let any = false;
  $$('.sheet').forEach((s) => { if (!s.hidden) { s.hidden = true; any = true; } });
  if (any) { document.body.style.overflow = ''; if (lastFocus) lastFocus.focus({ preventScroll: true }); lastFocus = null; }
  return any;
}

function initSettings() {
  const sw = $('.swatches');
  sw.innerHTML = ACCENTS.map(([n, c]) => `<button style="--c:${c}" data-c="${c}" aria-label="${n}"></button>`).join('');
  const sync = () => {
    $$('[data-setting="theme"] button').forEach((b) => b.classList.toggle('on', b.dataset.v === root.dataset.theme));
    $('[data-setting="glass"]').setAttribute('aria-checked', root.dataset.glass !== 'off');
    $('[data-setting="motion"]').setAttribute('aria-checked', root.dataset.motion !== 'off');
    $('[data-setting="sound"]').setAttribute('aria-checked', !!S.sound);
    const cur = (getComputedStyle(root).getPropertyValue('--accent') || '').trim().toLowerCase();
    $$('button', sw).forEach((b) => b.classList.toggle('on', b.dataset.c.toLowerCase() === cur));
    $$('meta[name="theme-color"]').forEach((m) => (m.content = root.dataset.theme === 'dark' ? '#040A1C' : '#F3F5FB'));
  };
  $$('[data-setting="theme"] button').forEach((b) => b.addEventListener('click', () => setTheme(b.dataset.v)));
  $('[data-setting="glass"]').addEventListener('click', () => { root.dataset.glass = root.dataset.glass === 'off' ? 'on' : 'off'; S.glass = root.dataset.glass; save(); sync(); tick(); });
  $('[data-setting="motion"]').addEventListener('click', () => { root.dataset.motion = root.dataset.motion === 'off' ? 'on' : 'off'; S.motion = root.dataset.motion; save(); sync(); tick(); });
  $('[data-setting="sound"]').addEventListener('click', () => { S.sound = !S.sound; save(); sync(); tick(880); });
  $$('button', sw).forEach((b) => b.addEventListener('click', () => { root.style.setProperty('--accent', b.dataset.c); S.accent = b.dataset.c; save(); sync(); tick(); }));
  $('[data-reset]').addEventListener('click', () => { S = {}; save(); root.style.removeProperty('--accent'); root.dataset.glass = 'on'; root.dataset.motion = 'on'; root.dataset.theme = 'light'; sync(); toast('Settings reset'); });
  window.setTheme = (v) => {
    const doIt = () => { root.dataset.theme = v; S.theme = v; save(); sync(); };
    if (document.startViewTransition && motionOn()) document.startViewTransition(doIt); else doIt();
    tick();
  };
  window.syncSettings = sync;
  sync();
}

/* Command menu */
let cmdItems = [], cmdSel = 0;
function cmdData() {
  const items = [];
  REAL.forEach((p) => items.push({ g: 'Projects', t: p.name, s: `${SECTIONS.find((x) => x.id === p.sec).label} · ${p.line}`, img: p.cover, prev: p.screens[0][0], run: () => go(pageOf(p)) }));
  SECTIONS.forEach((s) => items.push({ g: 'Work sections', t: s.label, s: s.intro, ico: '▦', run: () => { closeSheets(); window.selectSection(s.id); $('#work').scrollIntoView({ behavior: 'smooth' }); } }));
  [['All case studies', 'work/index.html'], ['Showreel', 'showreel.html']].forEach(([t, h]) => items.push({ g: 'Pages', t, s: 'Open page', ico: '↗', run: () => go(h) }));
  [['About', '#about'], ['Skills', '#skills'], ['Experience', '#experience'], ['Pricing', '#pricing'], ['Blog', '#blog'], ['FAQ', '#faq'], ['Contact', '#contact']].forEach(([t, h]) => items.push({ g: 'Go to', t, s: 'Jump to section', ico: '↘', run: () => { closeSheets(); $(h).scrollIntoView({ behavior: 'smooth' }); } }));
  items.push(
    { g: 'Actions', t: 'Chat on WhatsApp', s: '+234 802 636 4572', ico: '💬', run: () => window.open(wa(), '_blank') },
    { g: 'Actions', t: 'Copy email', s: EMAIL, ico: '✉', run: () => { copy(EMAIL); closeSheets(); } },
    { g: 'Actions', t: 'Download CV', s: 'Two-page PDF', ico: '⬇', run: () => { location.href = 'cv/Jaiye_Oluwatishe_Daniel_CV.pdf'; } },
    { g: 'Actions', t: 'Toggle dark mode', s: 'Switch appearance', ico: '◐', run: () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark') },
    { g: 'Actions', t: 'Take a penalty', s: 'A tiny Touchline game', ico: '⚽', run: () => { closeSheets(); setTimeout(() => openSheet('game'), 60); } },
  );
  POSTS.forEach((p) => items.push({ g: 'Blog', t: p.t, s: `${p.cat} · ${p.mins} min read`, img: p.img, prev: p.img, run: () => go(`blog/${p.slug}.html`) }));
  return items;
}
let ALL_CMD = [];
function buildCmd(q) {
  q = q.trim().toLowerCase();
  cmdItems = ALL_CMD.filter((i) => !q || (i.t + ' ' + i.s + ' ' + i.g).toLowerCase().includes(q));
  cmdSel = 0;
  const ul = $('.cmd-list');
  if (!cmdItems.length) { ul.innerHTML = `<li class="cmd-empty">Nothing for "${esc(q)}". Try "fintech" or "brand".</li>`; preview(); return; }
  let g = '', h = '';
  cmdItems.forEach((it, i) => {
    if (it.g !== g) { g = it.g; h += `<li class="grp" role="presentation">${g}</li>`; }
    h += `<li class="it" role="option" data-i="${i}">${it.img ? `<img src="${it.img}" alt="">` : `<span class="ico">${it.ico}</span>`}<span><b>${esc(it.t)}</b><small>${esc(it.s)}</small></span></li>`;
  });
  ul.innerHTML = h;
  $$('.it', ul).forEach((li) => {
    li.addEventListener('mouseenter', () => selCmd(+li.dataset.i, false));
    li.addEventListener('click', () => cmdItems[+li.dataset.i].run());
  });
  selCmd(0, false);
}
function selCmd(i, scroll = true) {
  cmdSel = i;
  $$('.cmd-list .it').forEach((li) => { const on = +li.dataset.i === i; li.classList.toggle('on', on); li.setAttribute('aria-selected', on); if (on && scroll) li.scrollIntoView({ block: 'nearest' }); });
  preview(cmdItems[i]);
}
function preview(it) {
  const pv = $('.cmd-preview');
  if (it && it.prev) { $('img', pv).src = it.prev; $('img', pv).style.display = ''; }
  else { $('img', pv).removeAttribute('src'); $('img', pv).style.display = 'none'; }
  $('b', pv).textContent = it ? it.t : ''; $('small', pv).textContent = it ? it.s : '';
}
function initCmd() {
  ALL_CMD = cmdData();
  const input = $('#cmdk input');
  input.addEventListener('input', () => buildCmd(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); selCmd(Math.min(cmdItems.length - 1, cmdSel + 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); selCmd(Math.max(0, cmdSel - 1)); }
    if (e.key === 'Enter' && cmdItems[cmdSel]) { e.preventDefault(); cmdItems[cmdSel].run(); }
  });
}

/* Penalty game */
let shots = 0, goals = 0, busy = false;
function resetGame() {
  shots = 0; goals = 0; busy = false;
  $('.dots').innerHTML = '<i></i><i></i><i></i><i></i><i></i>';
  $('.g-goals').textContent = '0'; $('.g-msg').textContent = 'Five shots. Pick a corner.';
  $('.g-again').hidden = true; $('.keeper').style.transform = ''; $('.g-ball').style.transform = '';
}
function initGame() {
  const goal = $('.goal'), ball = $('.g-ball'), keeper = $('.keeper');
  $$('button', goal).forEach((b) => b.addEventListener('click', () => {
    if (busy || shots >= 5) return; busy = true;
    const z = +b.dataset.z, col = z % 3, row = Math.floor(z / 3);
    const kz = Math.floor(Math.random() * 6), kc = kz % 3, kr = Math.floor(kz / 3);
    const gw = goal.offsetWidth, gh = goal.offsetHeight, pitch = $('.pitch').getBoundingClientRect(), gr = goal.getBoundingClientRect();
    const tx = (col - 1) * gw / 3, ty = -(pitch.bottom - 24 - 13 - (gr.top + (row + 0.5) * gh / 2));
    ball.style.transform = `translate(${tx}px,${ty}px) scale(.6)`;
    keeper.style.transform = `translateX(${(kc - 1) * gw / 3.2}px) translateY(${kr === 0 ? -40 : 0}px) rotate(${(kc - 1) * 50}deg)`;
    tick(300, 0.12);
    setTimeout(() => {
      const saved = kc === col && (kr === row || col === 1);
      const dot = $$('.dots i')[shots]; shots++;
      if (saved) { dot.className = 'm'; $('.g-msg').textContent = ['Saved! He read it.', 'Denied. Try the other side.', 'The keeper guessed right.'][Math.floor(Math.random() * 3)]; tick(200, 0.2); }
      else { goals++; dot.className = 'g'; $('.g-msg').textContent = ['Goal! Top bins.', 'Goal! Keeper went the wrong way.', 'Back of the net.'][Math.floor(Math.random() * 3)]; tick(990, 0.15); }
      $('.g-goals').textContent = goals;
      setTimeout(() => {
        ball.style.transform = ''; keeper.style.transform = ''; busy = false;
        if (shots >= 5) {
          $('.g-msg').textContent = goals >= 4 ? `${goals} of 5. You'd make the squad.` : goals >= 2 ? `${goals} of 5. Not bad. Run it back?` : `${goals} of 5. The keeper wins this one.`;
          $('.g-again').hidden = false;
        }
      }, 700);
    }, 420);
  }));
  $('.g-again').addEventListener('click', resetGame);
}

function copy(text) {
  (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(() => toast('Email copied')).catch(() => toast(text));
}

function initPointer() {
  if (isTouch) return;
  const cur = $('.cursor'), label = $('.cursor-label');
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; cur.classList.add('on'); }, { passive: true });
  document.addEventListener('pointerleave', () => cur.classList.remove('on'));
  const loop = () => { cx += (x - cx) * 0.28; cy += (y - cy) * 0.28; cur.style.transform = `translate3d(${cx + 20}px,${cy + 22}px,0)`; requestAnimationFrame(loop); };
  loop();
  document.addEventListener('pointerover', (e) => {
    const big = e.target.closest('[data-cursor]');
    const link = e.target.closest('a,button,summary,select,[role="button"]');
    cur.classList.toggle('big', !!big); label.textContent = big ? big.dataset.cursor : '';
    cur.classList.toggle('link', !big && !!link);
  });
  $$('.magnetic').forEach((b) => {
    b.addEventListener('pointermove', (e) => { if (!motionOn()) return; const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px,${(e.clientY - r.top - r.height / 2) * 0.25}px)`; });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; });
  });
  const tools = $$('.tool:not(.dup)'), hero = $('.hero');
  hero.addEventListener('pointermove', (e) => {
    if (!motionOn()) return;
    const r = hero.getBoundingClientRect(), dx = (e.clientX - r.width / 2) / r.width, dy = (e.clientY - r.height / 2) / r.height;
    tools.forEach((t, i) => { const k = 14 + (i % 4) * 10; t.style.translate = `${-dx * k}px ${-dy * k}px`; });
  });
  document.addEventListener('pointermove', (e) => {
    const s = e.target.closest && e.target.closest('.skill'); if (!s) return;
    const r = s.getBoundingClientRect(); s.style.setProperty('--mx', (e.clientX - r.left) + 'px'); s.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });
}

function initScroll() {
  const island = $('.island'), dock = $('.dock'), blobs = $$('[data-parallax]'), wall = $('.wall-tilt');
  const steps = $$('.step'), line = $('.steps-line'), stepsBox = $('.steps');
  let lastY = scrollY, ticking = false;
  const on = () => {
    const y = scrollY;
    island.classList.toggle('shrink', y > 40);
    if (dock) { if (y > lastY + 4 && y > 400) dock.classList.add('hide'); if (y < lastY - 4) dock.classList.remove('hide'); }
    lastY = y;
    if (motionOn()) blobs.forEach((b) => (b.style.translate = `0 ${y * +b.dataset.parallax}px`));
    const prog = $('.scroll-prog');
    if (prog) prog.style.transform = `scaleX(${y / Math.max(1, document.documentElement.scrollHeight - innerHeight)})`;
    const top = $('.to-top'); if (top) top.classList.toggle('on', y > innerHeight * 1.5);
    const r = stepsBox.getBoundingClientRect(), vh = innerHeight;
    const p = Math.max(0, Math.min(1, (vh * 0.7 - r.top) / (r.height + vh * 0.2)));
    line.style.setProperty('--p', (p * 100) + '%');
    steps.forEach((s, i) => s.classList.toggle('lit', p > i / steps.length + 0.02 || innerWidth < 640));
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(on); } }, { passive: true });
  on();
  const links = $$('.nav-links a[href^="#"]');
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) links.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['work', 'about', 'skills', 'pricing', 'blog', 'faq'].forEach((id) => { const el = $('#' + id); if (el) io.observe(el); });
}

function initMenu() {
  const btn = $('[data-menu]'), menu = $('.mobile-menu');
  const set = (open) => { btn.setAttribute('aria-expanded', open); menu.hidden = !open; };
  btn.addEventListener('click', () => { set(menu.hidden); tick(); });
  $$('a', menu).forEach((a) => a.addEventListener('click', () => set(false)));
  window.closeMenu = () => set(false);
}

function initGlobal() {
  document.addEventListener('click', (e) => {
    const g = e.target.closest('[data-go]');
    if (g && !e.target.closest('.m-dots')) { e.preventDefault(); go(g.dataset.go, e.clientX, e.clientY); return; }
    const gl = e.target.closest('[data-go-link]');
    if (gl && !e.metaKey && !e.ctrlKey) { e.preventDefault(); go(gl.getAttribute('href'), e.clientX, e.clientY); return; }
    const o = e.target.closest('[data-open]');
    if (o) { e.preventDefault(); window.closeMenu(); openSheet(o.dataset.open); return; }
    if (e.target.closest('[data-close]')) { closeSheets(); return; }
    const cp = e.target.closest('[data-copy]');
    if (cp) { copy(cp.dataset.copy); const l = $('.copy-label', cp); if (l) { l.textContent = 'Copied ✓'; setTimeout(() => (l.textContent = 'Copy email'), 1800); } }
    if (e.target.closest('.btn,.tab,.icon-btn')) tick(560, 0.03);
  });
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); $('#cmdk').hidden ? openSheet('cmdk') : closeSheets(); }
    if (e.key === 'Escape') { closeSheets(); window.closeMenu(); }
    if (e.key === 'Tab') {
      const open = $$('.sheet').find((s) => !s.hidden);
      if (!open) return;
      const f = $$('a[href],button:not([disabled]),input,select,[tabindex="0"]', open).filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  let buf = '';
  document.addEventListener('keydown', (e) => { if (e.target.matches('input,select,textarea')) return; buf = (buf + e.key).slice(-4).toLowerCase(); if (buf === 'goal') openSheet('game'); });
}

/* ================= Boot ================= */
renderTools();
renderWall();
renderWork();
renderSkills();
renderExp();
renderPricing();
renderBlog();
renderFAQ();
renderWA();
splitText();
initSettings();
initTabs();
initDecks();
initWall();
initTilt();
initReel();
initCmd();
initGame();
initMenu();
initGlobal();
initPointer();
initScroll();
reveal();
})();
