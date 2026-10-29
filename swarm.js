/* Portfolio v3 — the "swarm build", Figma edition.
   After the greeting: a pen tool draws Jaiye's mark, his work is scanned behind his face,
   then a crowd of named cursors builds the page: boxes with size labels, typing, images,
   guides, spacing lines and auto-layout gaps, with a Layers and a Properties panel on desktop.
   At the end the view zooms out to the frame on the canvas, and ▶ Present plays it.
   Runs once per browser session (Replay is always there), never with "reduce motion".
   After the build: Inspect mode shows sizes, spacing and type for anything you hover. */
(() => {
  const main = document.querySelector('main[data-scan]');
  if (!main) return;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const V3 = window.V3 || { fresh: true, reduce: false };
  const body = document.body, root = document.documentElement;
  const page = $('.page') || main;
  const store = { get: (k) => { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {} } };
  const isPhoneW = () => innerWidth <= 640;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const force = /[?&]build\b/.test(location.search);
  const auto = force || (V3.fresh && !V3.reduce && !store.get('v3built'));

  const COLORS = ['#F24E1E', '#A259FF', '#1ABCFE', '#0ACF83', '#FF8A00', '#FF3D9A', '#7B61FF', '#00B5A5', '#E5A800', '#3D7BFF', '#E33E6E', '#6FAE2E'];
  const ROLES = ['Layout', 'Type', 'Images', 'Grid', 'Motion', 'Spacing', 'Color', 'Copy', 'Assets', 'Styles'];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const easeIO = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  const hex = (c) => { const m = String(c).match(/[\d.]+/g); if (!m) return '—'; return '#' + m.slice(0, 3).map((v) => (+v).toString(16).padStart(2, '0')).join('').toUpperCase(); };
  const WEIGHT = { 300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'Semi Bold', 700: 'Bold' };
  const px = (v) => Math.round(parseFloat(v) || 0);

  const ICON = {
    frame: '<svg viewBox="0 0 12 12"><path d="M3.5 1v10M8.5 1v10M1 3.5h10M1 8.5h10" stroke="currentColor" fill="none"/></svg>',
    text: '<svg viewBox="0 0 12 12"><path d="M2.2 2.5h7.6M6 2.5v8" stroke="currentColor" stroke-width="1.3" fill="none"/></svg>',
    img: '<svg viewBox="0 0 12 12"><rect x="1.5" y="2" width="9" height="8" rx="1" stroke="currentColor" fill="none"/><path d="M2 9.2l2.8-2.8 2 2 1.4-1.4 2 2" stroke="currentColor" fill="none"/></svg>',
    video: '<svg viewBox="0 0 12 12"><rect x="1.5" y="2" width="9" height="8" rx="1" stroke="currentColor" fill="none"/><path d="M5 4.4v3.2L7.6 6z" fill="currentColor"/></svg>',
    auto: '<svg viewBox="0 0 12 12"><rect x="2" y="1.5" width="8" height="3.6" rx=".6" stroke="currentColor" fill="none"/><rect x="2" y="6.9" width="8" height="3.6" rx=".6" stroke="currentColor" fill="none"/></svg>',
    comp: '<svg viewBox="0 0 12 12"><path d="M6 1.3L10.7 6 6 10.7 1.3 6z" stroke="currentColor" fill="none"/></svg>',
    guide: '<svg viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="currentColor" stroke-dasharray="1.5 1.5" fill="none"/></svg>',
    space: '<svg viewBox="0 0 12 12"><path d="M6 1.8v8.4M3.5 1.8h5M3.5 10.2h5" stroke="currentColor" fill="none"/></svg>',
  };

  /* ---------------------------------------------------------------- dock: Inspect + Replay */
  const dock = el('div', 'dock');
  const inspBtn = fine ? el('button', 'dk-insp', '<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 5V2.5H5M11 2.5h2.5V5M13.5 11v2.5H11M5 13.5H2.5V11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6 6l4.6 1.8-2 .8-.8 2z" fill="currentColor"/></svg>Inspect') : null;
  const replayBtn = el('button', 'dk-rp', '<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 8a5.5 5.5 0 1 0 1.7-4M2.5 2.5V5h2.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>Replay build');
  replayBtn.type = 'button'; replayBtn.setAttribute('aria-label', 'Replay the page build');
  if (inspBtn) { inspBtn.type = 'button'; inspBtn.setAttribute('aria-pressed', 'false'); inspBtn.title = 'Hover anything to see its size, spacing and type. Esc to stop.'; dock.appendChild(inspBtn); }
  dock.appendChild(replayBtn);
  body.appendChild(dock);
  const showDock = () => dock.classList.add('on');
  const hideDock = () => dock.classList.remove('on');

  /* ---------------------------------------------------------------- sound (off by default) */
  let actx = null, soundOn = false, lastTick = 0;
  const ensureAudio = () => { if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (actx && actx.state === 'suspended') actx.resume(); };
  const tick = (now) => {
    if (!soundOn || !actx || now - lastTick < 45) return; lastTick = now;
    const t = actx.currentTime, len = Math.floor(actx.sampleRate * 0.012), buf = actx.createBuffer(1, len, actx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    const s = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain();
    s.buffer = buf; f.type = 'highpass'; f.frequency.value = rnd(2200, 4200); g.gain.value = 0.05;
    s.connect(f).connect(g).connect(actx.destination); s.start(t);
  };
  const pop = (hi) => {
    if (!soundOn || !actx) return;
    const t = actx.currentTime, o = actx.createOscillator(), g = actx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(hi ? 880 : rnd(520, 700), t); o.frequency.exponentialRampToValueAtTime(hi ? 440 : 240, t + 0.09);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.06, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
    o.connect(g).connect(actx.destination); o.start(t); o.stop(t + 0.15);
  };

  /* ---------------------------------------------------------------- inspect mode */
  const inspect = makeInspect();
  if (inspBtn) inspBtn.addEventListener('click', () => inspect.toggle());
  replayBtn.addEventListener('click', () => { inspect.toggle(false); hideDock(); run(); });

  /* ---------------------------------------------------------------- start */
  let S = null;
  function run() {
    if (S) return;
    scrollTo(0, 0);
    body.classList.add('building');
    $$('[data-l]').forEach((n) => n.classList.remove('lb-done', 'lb-show', 'lb-drop'));
    S = build();
  }
  const preload = [];
  const warm = () => { if (preload.length) return; try { JSON.parse(main.dataset.scan).forEach((src) => { const im = new Image(); im.decoding = 'async'; im.src = src; preload.push(im); }); } catch (e) {} };
  if (auto) {
    warm();
    try { history.scrollRestoration = 'manual'; } catch (e) {}
    body.classList.add('building'); // keep the page blank under the greeting
    const go = () => run();
    if (V3.ready) go(); else document.addEventListener('v3:ready', go, { once: true });
  } else {
    if (V3.ready) showDock(); else document.addEventListener('v3:ready', showDock, { once: true });
  }

  /* ================================================================ the build */
  function build() {
    const startWall = performance.now();
    let speed = 1, tour = true, finished = false, raf = 0;
    const isPhone = isPhoneW();
    const panels = !isPhone && innerWidth >= 1180;
    const PW = 248;
    const N0 = isPhone ? 8 : 14, NMAX = isPhone ? 22 : 48;
    const timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));

    /* ---------- overlay plane in page coordinates ---------- */
    const sw = el('div', 'sw'); sw.setAttribute('aria-hidden', 'true');
    const plane = el('div', 'sw-plane');
    sw.appendChild(plane); body.appendChild(sw);

    /* ---------- rulers ---------- */
    const rTop = el('div', 'ruler top hide'), rLeft = el('div', 'ruler left hide');
    const cTop = el('canvas'), cLeft = el('canvas');
    rTop.appendChild(cTop); rLeft.appendChild(cLeft); rTop.setAttribute('aria-hidden', 'true'); rLeft.setAttribute('aria-hidden', 'true');
    const RL = panels ? PW : 0;
    rTop.style.left = RL + 'px'; rTop.style.right = RL + 'px'; rLeft.style.left = RL + 'px';
    body.append(rTop, rLeft);

    /* ---------- Figma panels (desktop) ---------- */
    let LP = null, PP = null, list = null, ppBody = null;
    if (panels) {
      LP = el('div', 'fp fp-l hide', `<div class="fp-hd"><b>Jaiye — Portfolio</b><span>Drafts</span></div><div class="fp-tabs"><b>Layers</b><span>Assets</span><em>Home</em></div><div class="fp-list"></div>`);
      PP = el('div', 'fp fp-r hide', `<div class="fp-tabs"><b>Design</b><span>Prototype</span><em class="fp-zoom">100%</em></div><div class="pp"></div>`);
      LP.setAttribute('aria-hidden', 'true'); PP.setAttribute('aria-hidden', 'true');
      body.append(LP, PP);
      list = $('.fp-list', LP); ppBody = $('.pp', PP);
    }
    requestAnimationFrame(() => [rTop, rLeft, LP, PP].forEach((n) => n && n.classList.remove('hide')));

    /* ---------- control bar ---------- */
    const bar = el('div', 'bar scanning', `
      <div class="st"><span class="dots">${COLORS.slice(0, 4).map((c) => `<i style="background:${c}"></i>`).join('')}</span>
        <span class="n run-only"><b class="ag">0</b> <span>agents</span></span>
        <span class="sep run-only build-only"></span>
        <span class="n run-only build-only"><b class="ly">0</b><span> / <span class="lt">0</span><span class="bw"> layers</span></span></span>
        <span class="n scan-txt">Drawing the mark…</span>
        <span class="n done-only">Built by&nbsp;<b class="bfa">0</b>&nbsp;<span>agents in</span>&nbsp;<b class="bft">0s</b></span>
      </div>
      <span class="prog bw run-only"><i></i></span>
      <button type="button" class="tour run-only build-only" aria-pressed="true" data-tip="Auto-scroll while the swarm builds">Tour</button>
      <button type="button" class="spd run-only" aria-pressed="false" data-tip="Build speed">1x</button>
      <button type="button" class="snd" aria-pressed="false" aria-label="Sound" data-tip="Sound"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 6h2.2L8 3.2v9.6L4.7 10H2.5z" fill="currentColor"/><path class="w" d="M10.6 5.6a3.4 3.4 0 0 1 0 4.8M12.4 3.9a5.8 5.8 0 0 1 0 8.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path class="m" d="M10.5 6l4 4m0-4l-4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></button>
      <span class="sep run-only"></span>
      <button type="button" class="skip run-only" data-tip="Jump to the finished page">Skip</button>
      <button type="button" class="go done-only"><svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.8v8.4L10 6z" fill="currentColor"/></svg>Present</button>
      <button type="button" class="rp done-only">Replay</button>`);
    bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', 'Page build');
    body.insertBefore(bar, body.firstChild);
    const B = { ag: $('.ag', bar), ly: $('.ly', bar), lt: $('.lt', bar), prog: $('.prog i', bar), fa: $(".bfa", bar), ft: $(".bft", bar), scan: $('.scan-txt', bar) };
    const tourBtn = $('.tour', bar), spdBtn = $('.spd', bar), sndBtn = $('.snd', bar);
    sndBtn.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
    tourBtn.addEventListener('click', () => { tour = !tour; tourBtn.setAttribute('aria-pressed', tour); });
    spdBtn.addEventListener('click', () => { speed = speed === 1 ? 2 : 1; spdBtn.textContent = speed + 'x'; spdBtn.setAttribute('aria-pressed', speed === 2); });
    sndBtn.addEventListener('click', () => { soundOn = !soundOn; if (soundOn) ensureAudio(); sndBtn.setAttribute('aria-pressed', soundOn); });
    $('.skip', bar).addEventListener('click', () => finish(true));
    $('.go', bar).addEventListener('click', () => present());
    $('.rp', bar).addEventListener('click', () => { teardown(); S = null; run(); });

    // a person scrolling takes over from Tour
    const userScroll = () => { if (tour && !finished) { tour = false; tourBtn.setAttribute('aria-pressed', 'false'); } };
    const onKey = (e) => { if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(e.key) && !e.target.closest('.bar')) userScroll(); };
    addEventListener('wheel', userScroll, { passive: true });
    addEventListener('touchmove', userScroll, { passive: true });
    addEventListener('keydown', onKey);

    /* ---------- "You": the visitor's own cursor gets a tag ---------- */
    let you = null;
    const onPtr = (e) => { if (!you) return; you.style.transform = `translate3d(${e.clientX + 13}px,${e.clientY + 17}px,0)`; you.style.opacity = 1; };
    const onLeave = () => { if (you) you.style.opacity = 0; };
    if (fine) { you = el('div', 'you', 'You'); you.setAttribute('aria-hidden', 'true'); body.appendChild(you); addEventListener('pointermove', onPtr, { passive: true }); document.addEventListener('pointerleave', onLeave); }

    /* ---------- geometry ---------- */
    let vw = innerWidth, vh = innerHeight, colL = 0, colR = 0, docH = 0;
    const rectOf = (n) => { const r = n.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height }; };
    const measureCol = () => {
      const hd = $('.hd', main).getBoundingClientRect();
      colL = hd.left + scrollX; colR = hd.right + scrollX;
      docH = document.documentElement.scrollHeight;
      vw = innerWidth; vh = innerHeight;
    };
    measureCol();

    /* ---------- tasks ---------- */
    const face = $('[data-face]', main);
    const layers = $$('[data-l]').filter((n) => !n.closest('[hidden]') && n !== face);
    const blocks = [$('.hd', main), $('.hero', main), ...$$('section', main).filter((s) => !s.hidden), $('.ft')].filter(Boolean);
    const blockOf = (n) => blocks.find((b) => b.contains(n));
    const GAPBOX = ['.frames', '.rail', '.mgrid', '.tools'];
    const tasks = [];
    tasks.push({ type: 'gv', side: 0 }, { type: 'gv', side: 1 });
    let lastBlock = null;
    const closeBlock = (b) => { if (!b) return; GAPBOX.forEach((sel) => { const c = b.matches(sel) ? b : $(sel, b); if (c) tasks.push({ type: 'al', box: c, block: b }); }); };
    layers.forEach((n) => {
      const b = blockOf(n);
      if (b && b !== lastBlock) {
        closeBlock(lastBlock);
        if (lastBlock) tasks.push({ type: 'sp', from: lastBlock, to: b, block: b });
        tasks.push({ type: 'gh', block: b });
        lastBlock = b;
      }
      tasks.push({ type: n.dataset.l === 'i' ? 'img' : 'text', node: n, block: b });
    });
    closeBlock(lastBlock);

    const gapRects = (c) => {
      const cr = rectOf(c);
      const kids = [...c.children].filter((k) => k.offsetParent !== null).map((k) => rectOf(k)).filter((r) => r.w > 0 && r.h > 0 && r.x < Math.min(scrollX + vw, cr.x + cr.w + 2) && r.x + r.w > Math.max(scrollX, cr.x - 2));
      const out = [];
      for (let i = 1; i < kids.length; i++) {
        const a = kids[i - 1], b = kids[i];
        if (Math.abs(a.y - b.y) < 4) { const g = b.x - (a.x + a.w); if (g > 2) out.push({ x: a.x + a.w, y: a.y, w: g, h: Math.min(a.h, b.h), v: Math.round(g) }); }
        else { const g = b.y - (a.y + a.h); if (g > 2 && !out.some((o) => o.horiz && Math.abs(o.y - (a.y + a.h)) < 2)) out.push({ x: cr.x, y: a.y + a.h, w: cr.w, h: g, v: Math.round(g), horiz: true }); }
      }
      return out;
    };
    const measureTasks = () => tasks.forEach((t) => {
      if (t.node) t.r = rectOf(t.node);
      else if (t.type === 'gh') { const r = rectOf(t.block); t.r = { x: 0, y: r.y - 14, w: vw, h: 1 }; }
      else if (t.type === 'sp') { const a = rectOf(t.from), b = rectOf(t.to); const y1 = a.y + a.h, y2 = b.y; t.r = { x: isPhone ? colL + 6 : colL - 30, y: y1, w: 1, h: Math.max(0, y2 - y1) }; t.skip = t.r.h < 8; }
      else if (t.type === 'al') { const r = rectOf(t.box); t.r = { x: r.x, y: r.y + Math.min(r.h * 0.5, 40), w: r.w, h: r.h }; t.gaps = gapRects(t.box); t.skip = !t.gaps.length; }
      else t.r = { x: t.side ? colR : colL, y: scrollY, w: 1, h: 1 };
      // things scrolled out of sight sideways (cards further along the rail) appear without an agent
      t.instant = !!t.node && (t.r.x > vw + scrollX - 8 || t.r.x + t.r.w < scrollX + 8 || t.r.w < 1 || t.r.h < 1);
      const rl = t.node && t.node.closest('.rail'); // cards clipped by the rail appear without an agent
      if (rl) { const rr = rectOf(rl); if (t.r.x + t.r.w > rr.x + rr.w + 2 || t.r.x < rr.x - 2) t.instant = true; }
    });
    measureTasks();
    tasks.forEach((t) => { t.state = 0; if (t.skip) t.instant = true; });
    const total = tasks.length + 1; // + the avatar the face lands on
    let doneCount = 0;
    B.lt.textContent = total;

    /* ---------- layers panel ---------- */
    const rows = new Map(); let selRow = null;
    const ensureRow = (key, lv, icon, name) => {
      if (!list) return null;
      let r = rows.get(key);
      if (!r) {
        r = el('div', 'lr' + (icon === 'comp' ? ' inst' : ''), `<i class="ic">${ICON[icon]}</i><span></span>`);
        r.style.setProperty('--lv', lv); r.lastChild.textContent = name;
        list.appendChild(r); rows.set(key, r);
        list.scrollTop = list.scrollHeight;
      }
      return r;
    };
    const selectRow = (r) => { if (!r) return; if (selRow) selRow.classList.remove('is-sel'); selRow = r; r.classList.add('is-sel'); };
    const blockName = (b) => b.classList.contains('hd') ? 'Header' : b.classList.contains('hero') ? 'Hero' : b.tagName === 'FOOTER' ? 'Footer' : (($('h2', b) || {}).textContent || 'Section').trim();
    const nameOf = (n) => {
      if (n.dataset.l === 'i') return n.closest('.mv') ? ['video', 'Video · ' + (($('b', n.closest('.mv')) || {}).textContent || '')] : n.closest('.card') ? ['img', 'Cover'] : ['img', 'Image'];
      if (n.classList.contains('arrows')) return ['auto', 'Arrows'];
      if (n.classList.contains('fsel')) return ['frame', 'Selection'];
      if (n.classList.contains('fcur')) return ['frame', 'Cursor · Jaiye'];
      let s = n.textContent.replace(/\s+/g, ' ').trim(); if (s.length > 24) s = s.slice(0, 23) + '…';
      return ['text', s || 'Text'];
    };
    const groupOf = (n) => n.closest('.card, .mv, .rows li');
    const groupName = (g) => g.classList.contains('card') ? ['comp', 'Card'] : g.classList.contains('mv') ? ['comp', 'Video card'] : g.closest('.mw') ? ['auto', 'Project row'] : ['auto', 'Role'];
    const rowFor = (t) => {
      if (!list) return null;
      if (t.type === 'gv') return ensureRow('guides', 1, 'guide', 'Layout guides');
      if (t.type === 'gh') return ensureRow(t.block, 1, 'auto', blockName(t.block));
      if (t.type === 'sp' || t.type === 'al') return null;
      if (t.block) ensureRow(t.block, 1, 'auto', blockName(t.block));
      const g = groupOf(t.node); let lv = 2;
      if (g) { const [gi, gn] = groupName(g); ensureRow(g, 2, gi, gn); lv = 3; }
      const [ic, nm] = nameOf(t.node);
      return ensureRow(t.node, lv, ic, nm);
    };
    if (list) selectRow(ensureRow('home', 0, 'frame', 'Home'));

    /* ---------- properties panel ---------- */
    let ppTask = null, ppK = {};
    const renderPP = (kind, d) => {
      if (!ppBody) return;
      const grid = `<div class="pp-grid"><span><em>X</em><b data-k="x">${d.x}</b></span><span><em>Y</em><b data-k="y">${d.y}</b></span><span><em>W</em><b data-k="w">${d.w}</b></span><span><em>H</em><b data-k="h">${d.h}</b></span></div>`;
      let h = `<div class="pp-sec"><div class="pp-ttl"><i class="ic">${ICON[d.icon]}</i>${kind}</div>${grid}</div>`;
      if (d.layout) h += `<div class="pp-sec"><h6>Auto layout</h6><div class="pp-grid"><span><em>↓</em><b>Vertical</b></span><span><em>Gap</em><b>${d.layout.gap}</b></span><span><em>Pad</em><b>${d.layout.pad}</b></span><span><em>Align</em><b>Left</b></span></div></div>`;
      if (d.font) h += `<div class="pp-sec"><h6>Typography</h6><p class="pp-font">${d.font.fam}</p><div class="pp-grid"><span><em>Wt</em><b>${d.font.wt}</b></span><span><em>Size</em><b>${d.font.size}</b></span><span><em>LH</em><b>${d.font.lh}</b></span><span><em>LS</em><b>${d.font.ls}</b></span></div></div>`;
      if (d.fill) h += `<div class="pp-sec"><h6>Fill</h6><div class="pp-fill"><i style="${d.fill.img ? `background-image:url('${d.fill.img}')` : `background:${d.fill.c}`}"></i><b>${d.fill.label}</b><span>100%</span></div></div>`;
      if (d.radius != null) h += `<div class="pp-sec"><h6>Corner radius</h6><div class="pp-grid"><span><em>◜</em><b>${d.radius}</b></span><span><em>Clip</em><b>On</b></span></div></div>`;
      if (d.note) h += `<div class="pp-sec"><h6>${d.note[0]}</h6><p class="pp-note">${d.note[1]}</p></div>`;
      ppBody.innerHTML = h;
      ppK = { x: $('[data-k="x"]', ppBody), y: $('[data-k="y"]', ppBody), w: $('[data-k="w"]', ppBody), h: $('[data-k="h"]', ppBody) };
    };
    const ppFor = (t) => {
      if (!ppBody) return;
      ppTask = t;
      const r = t.r, base = { x: Math.round(r.x - colL), y: Math.round(r.y), w: Math.round(r.w), h: Math.round(r.h) };
      if (t.type === 'gv') return renderPP('Layout guide', { ...base, icon: 'guide', w: 1, h: Math.round(docH), note: ['Columns', `1 column · ${Math.round(colR - colL)} wide · centred`] });
      if (t.type === 'gh') { const cs = getComputedStyle(t.block), br = rectOf(t.block); return renderPP(blockName(t.block), { x: Math.round(br.x - colL), y: Math.round(br.y), w: Math.round(br.w), h: Math.round(br.h), icon: 'auto', layout: { gap: cs.rowGap && cs.rowGap !== 'normal' ? px(cs.rowGap) : 16, pad: px(cs.paddingTop) }, fill: { c: '#FFFFFF', label: 'FFFFFF' } }); }
      if (t.type === 'sp') return renderPP('Spacing', { ...base, icon: 'space', w: 0, note: ['Gap', `${Math.round(r.h)} between sections`] });
      if (t.type === 'al') return renderPP('Auto layout gaps', { ...base, icon: 'auto', note: ['Gap', t.gaps.map((g) => g.v).filter((v, i, a) => a.indexOf(v) === i).join(' · ')] });
      const cs = getComputedStyle(t.node);
      if (t.type === 'img') { const im = $('img', t.node) || t.node; return renderPP(t.node.closest('.mv') ? 'Video' : 'Image', { ...base, icon: t.node.closest('.mv') ? 'video' : 'img', fill: { img: im.currentSrc || im.src || '', label: 'Image' }, radius: px(cs.borderTopLeftRadius) }); }
      const fam = cs.fontFamily.split(',')[0].replace(/["']/g, '');
      const lh = cs.lineHeight === 'normal' ? 'Auto' : px(cs.lineHeight);
      const ls = cs.letterSpacing === 'normal' ? '0%' : (Math.round(parseFloat(cs.letterSpacing) / parseFloat(cs.fontSize) * 1000) / 10) + '%';
      renderPP('Text', { ...base, icon: 'text', font: { fam, wt: WEIGHT[cs.fontWeight] || cs.fontWeight, size: px(cs.fontSize), lh, ls }, fill: { c: cs.color, label: hex(cs.color).slice(1) } });
    };
    const ppLive = () => {
      if (!ppTask || !ppK.w || ppTask.cw == null) return;
      ppK.w.textContent = Math.round(ppTask.cw); ppK.h.textContent = Math.round(ppTask.ch);
    };
    if (ppBody) renderPP('Home', { x: 0, y: 0, w: Math.round(vw), h: Math.round(docH), icon: 'frame', fill: { c: '#FFFFFF', label: 'FFFFFF' }, note: ['Frame', 'Desktop · ' + Math.round(vw)] });

    /* ---------- cursors ---------- */
    const agents = [];
    const cursorSvg = (c) => `<svg viewBox="0 0 14 14"><path d="M1.5 1.2 L1.5 11.8 L4.4 9.1 L6.5 13.2 L8.4 12.3 L6.4 8.3 L10.6 8.3 Z" fill="${c}" stroke="#fff" stroke-width="1" stroke-linejoin="round"/></svg>`;
    const setTag = (a, text) => { if (a.label === text) return; a.label = text; a.tag.textContent = text; a.tag.style.display = text ? '' : 'none'; };
    const spawn = () => {
      const i = agents.length, c = COLORS[i % COLORS.length];
      const n = el('div', 'cur', cursorSvg(c) + `<b class="tg" style="background:${c}"></b>`);
      plane.appendChild(n);
      const side = Math.floor(Math.random() * 4), sy = scrollY;
      const x = side === 0 ? -20 : side === 1 ? vw + 20 : rnd(0, vw);
      const y = sy + (side === 2 ? -20 : side === 3 ? vh + 20 : rnd(0, vh));
      const a = { el: n, tag: n.lastChild, x, y, vx: 0, vy: 0, tx: x, ty: y, task: null, ph: 0, pt: 0, wander: 0, k: rnd(45, 75), base: ROLES[i % ROLES.length], keepTag: i < 10, label: null };
      setTag(a, a.keepTag ? a.base : '');
      agents.push(a);
      return a;
    };
    const roleOf = (t) => t.type === 'text' ? 'Type' : t.type === 'img' ? (t.node.closest('.mv') ? 'Motion' : 'Images') : (t.type === 'gv' || t.type === 'gh') ? 'Grid' : 'Spacing';
    const place = (a) => { a.el.style.transform = `translate3d(${a.x - 1.5}px,${a.y - 1.2}px,0)`; };
    const springTo = (a, dt) => {
      const k = a.k, c = 2 * Math.sqrt(k) * 0.85;
      a.vx += ((a.tx - a.x) * k - a.vx * c) * dt; a.vy += ((a.ty - a.y) * k - a.vy * c) * dt;
      a.x += a.vx * dt; a.y += a.vy * dt;
    };

    /* ---------- selection boxes, guides, spacing ---------- */
    const mkSel = (ph) => { const s = el('div', 'sel' + (ph ? ' ph' : ''), '<i></i><i></i><i></i><i></i><em></em>'); plane.appendChild(s); return s; };
    const setSel = (s, x, y, w, h) => { s.style.transform = `translate3d(${x}px,${y}px,0)`; s.style.width = Math.max(1, w) + 'px'; s.style.height = Math.max(1, h) + 'px'; s.lastChild.textContent = `${Math.round(w)} × ${Math.round(h)}`; };
    const fadeOut = (n, ms = 300) => { n.classList.add('out'); setTimeout(() => n.remove(), ms); };
    const guides = [];
    const mkGuide = (v) => { const g = el('div', 'guide ' + (v ? 'v' : 'h')); plane.appendChild(g); guides.push(g); return g; };

    /* ---------- text typing: wrap characters, remember their positions ---------- */
    const wrapText = (t) => {
      const n = t.node; t.html = n.innerHTML;
      const walker = document.createTreeWalker(n, NodeFilter.SHOW_TEXT);
      const texts = []; while (walker.nextNode()) texts.push(walker.currentNode);
      const spans = [];
      texts.forEach((tn) => {
        if (tn.parentNode.closest('[data-clock]')) return;
        const f = document.createDocumentFragment();
        for (const ch of tn.nodeValue) { const s = document.createElement('span'); s.className = 'ch'; s.textContent = ch; f.appendChild(s); spans.push(s); }
        tn.parentNode.replaceChild(f, tn);
      });
      t.spans = spans;
      t.pos = spans.map((s) => { const r = s.getBoundingClientRect(); return { x: r.right + scrollX, y: r.top + scrollY + r.height * 0.72 }; });
      t.shown = 0;
      n.classList.add('lb-show');
    };
    const finishNode = (t) => {
      if (!t.node) return;
      if (t.html != null) { t.node.innerHTML = t.html; t.html = null; }
      t.node.classList.remove('lb-show', 'lb-drop');
      t.node.classList.add('lb-done');
    };
    const complete = (t) => {
      if (t.state === 2) return; t.state = 2; finishNode(t); doneCount++;
      if (t.sel) { fadeOut(t.sel); t.sel = null; }
      if (t.row) t.row.classList.remove('act');
    };

    /* ---------- rulers ---------- */
    let hl = null;
    const dpr = Math.min(2, devicePixelRatio || 1);
    const sizeCanvas = () => {
      cTop.width = rTop.clientWidth * dpr; cTop.height = rTop.clientHeight * dpr;
      cLeft.width = rLeft.clientWidth * dpr; cLeft.height = rLeft.clientHeight * dpr;
    };
    sizeCanvas();
    const drawRulers = () => {
      const ct = cTop.getContext('2d'), cl = cLeft.getContext('2d');
      const tw = cTop.width / dpr, th = cTop.height / dpr, lw = cLeft.width / dpr, lh = cLeft.height / dpr;
      const sx = scrollX + RL, sy = scrollY;
      ct.setTransform(dpr, 0, 0, dpr, 0, 0); ct.clearRect(0, 0, tw, th);
      cl.setTransform(dpr, 0, 0, dpr, 0, 0); cl.clearRect(0, 0, lw, lh);
      ct.font = '500 9px "Hanken Grotesk", system-ui, sans-serif'; cl.font = ct.font;
      if (hl) {
        ct.fillStyle = 'rgba(13,153,255,.16)'; ct.fillRect(hl.x - sx, 0, hl.w, th);
        cl.fillStyle = 'rgba(13,153,255,.16)'; cl.fillRect(0, hl.y - sy, lw, hl.h);
      }
      ct.fillStyle = '#9A9BA0'; cl.fillStyle = '#9A9BA0';
      const step = 10, o = colL; // x origin = the column's left edge
      for (let x = Math.floor((sx - o) / step) * step; x + o - sx < tw; x += step) {
        const p = x + o - sx, major = x % 100 === 0;
        ct.fillRect(p, major ? th - 8 : th - 4, 1, major ? 8 : 4);
        if (major && !isPhone) ct.fillText(String(x), p + 3, 9);
      }
      for (let y = Math.floor(sy / step) * step; y - sy < lh; y += step) {
        const p = y - sy, major = y % 100 === 0;
        cl.fillRect(major ? lw - 8 : lw - 4, p, major ? 8 : 4, 1);
        if (major && !isPhone) { cl.save(); cl.translate(9, p + 3); cl.rotate(-Math.PI / 2); cl.textAlign = 'right'; cl.fillText(String(y), 0, 0); cl.restore(); }
      }
      if (hl) {
        ct.fillStyle = '#0D99FF'; ct.fillRect(hl.x - sx, th - 2, hl.w, 2);
        cl.fillStyle = '#0D99FF'; cl.fillRect(lw - 2, hl.y - sy, 2, hl.h);
      }
    };

    /* ---------- timings (ms at 1x) ---------- */
    const T = { draw: 480, drawImg: 700, drop: 620, select: 380, guideV: 1500, guideH: 900, typeMin: 360, typeMax: 1800, perChar: 22, sp: 520, spHold: 1500, al: 700, alHold: 1500 };

    /* ================================================== 1. a pen tool draws Jaiye's mark */
    let phase = 'pen', pt = 0;
    const PS = isPhone ? 132 : 168;
    const pen = el('div', 'penart', `<svg viewBox="0 0 40 40" width="${PS}" height="${PS}" overflow="visible">
      <path class="pz-path" d="M25.5 7.5 V25 C25.5 33 14.5 34 12.3 27" pathLength="1" fill="none" stroke="#0D99FF" stroke-width=".35" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 1" stroke-dashoffset="1"/>
      <g class="pz-mark" opacity="0" fill="none" stroke="#16171A" stroke-linecap="round" stroke-linejoin="round"><path d="M12.3 27 L8.6 17.4" stroke-width="1.4"/><circle cx="8.4" cy="16.8" r="1.9" fill="#fff" stroke-width="1.4"/><rect x="22.7" y="3.6" width="5.6" height="5.6" rx=".6" fill="#16171A" stroke="none"/><rect x="9.7" y="24.4" width="5.2" height="5.2" rx=".6" fill="#fff" stroke-width="1.6"/></g>
      <g class="pz-ed" stroke="#0D99FF" stroke-width=".25" fill="#fff">
        <g class="pz-hb" opacity="0"><line x1="25.5" y1="25" x2="25.5" y2="33"/><circle cx="25.5" cy="33" r=".55"/></g>
        <g class="pz-h" opacity="0"><line class="h1" x1="12.3" y1="27" x2="12.3" y2="27"/><line class="h2" x1="12.3" y1="27" x2="12.3" y2="27"/><circle class="c1" cx="12.3" cy="27" r=".55"/><circle class="c2" cx="12.3" cy="27" r=".55"/></g>
        <rect class="pz-a" x="24.75" y="6.75" width="1.5" height="1.5" opacity="0"/><rect class="pz-a" x="24.75" y="24.25" width="1.5" height="1.5" opacity="0"/><rect class="pz-a" x="11.55" y="26.25" width="1.5" height="1.5" opacity="0"/>
      </g></svg>`);
    pen.setAttribute('aria-hidden', 'true');
    body.appendChild(pen);
    const pz = { path: $('.pz-path', pen), mark: $('.pz-mark', pen), ed: $('.pz-ed', pen), hb: $('.pz-hb', pen), h: $('.pz-h', pen), h1: $('.h1', pen), h2: $('.h2', pen), c1: $('.c1', pen), c2: $('.c2', pen), a: $$('.pz-a', pen) };
    const penL = () => vw / 2 - PS / 2, penT = () => vh * 0.46 - PS / 2;
    pen.style.left = penL() + 'px'; pen.style.top = penT() + 'px';
    const v2s = (x, y) => ({ x: penL() + (x / 40) * PS, y: scrollY + penT() + (y / 40) * PS });
    const penCur = el('div', 'cur pencur', '<svg viewBox="0 0 16 16"><path d="M2 14l1.2-4.6L10.6 2 14 5.4l-7.4 7.4z" fill="#fff" stroke="#16171A" stroke-width="1.2" stroke-linejoin="round"/><circle cx="7" cy="9" r="1" fill="#16171A"/></svg><b class="tg" style="background:#16171A">Pen</b>');
    plane.appendChild(penCur);
    const A = [25.5, 7.5], Bp = [25.5, 25], C = [12.3, 27], D = [10.1, 20]; // D: where the handle is dragged (mirror of the curve's control point)
    let penX = 0, penY = 0, penIn = false;
    const placePen = (x, y) => { penX = x; penY = y; penCur.style.transform = `translate3d(${x - 2}px,${y - 14}px,0)`; };
    for (let i = 0; i < N0; i++) spawn();
    const SEG1 = 0.52;
    const blueInk = (p) => `rgb(${Math.round(lerp(13, 22, p))},${Math.round(lerp(153, 23, p))},${Math.round(lerp(255, 26, p))})`;
    const orbit = (dt, ms, cx, cy, r0, r1) => agents.forEach((a) => {
      a.wander -= ms;
      if (a.wander <= 0) { const ang = rnd(0, Math.PI * 2), rad = rnd(r0, r1); a.tx = cx + Math.cos(ang) * rad; a.ty = cy + Math.sin(ang) * rad * 0.7; a.wander = rnd(300, 700); }
      springTo(a, dt); place(a);
    });
    let a0done = false, styled = false;
    const penStep = (dt, ms) => {
      pt += ms;
      const at = (v) => v2s(v[0], v[1]);
      pz.a[0].setAttribute('opacity', pt > 60 ? 1 : 0);
      pz.a[1].setAttribute('opacity', pt > 400 ? 1 : 0);
      pz.a[2].setAttribute('opacity', pt > 780 ? 1 : 0);
      if (pt > 60 && !a0done) { a0done = true; tick(performance.now()); }
      let off = 1;
      if (pt > 140) off = 1 - SEG1 * ease(clamp((pt - 140) / 260, 0, 1));
      if (pt > 780) off = (1 - SEG1) * (1 - ease(clamp((pt - 780) / 420, 0, 1)));
      pz.path.setAttribute('stroke-dashoffset', off);
      // cursor: A → B → C, then drag out the curve's handle
      let p;
      if (pt < 140) p = at(A);
      else if (pt < 400) { const e = easeIO((pt - 140) / 260); p = v2s(lerp(A[0], Bp[0], e), lerp(A[1], Bp[1], e)); }
      else if (pt < 540) p = at(Bp);
      else if (pt < 780) { const e = easeIO((pt - 540) / 240); p = v2s(lerp(Bp[0], C[0], e), lerp(Bp[1], C[1], e)); }
      else if (pt < 1200) {
        const e = ease((pt - 780) / 420), dx = lerp(C[0], D[0], e), dy = lerp(C[1], D[1], e), mx = 2 * C[0] - dx, my = 2 * C[1] - dy;
        p = v2s(dx, dy);
        pz.h.setAttribute('opacity', 1); pz.hb.setAttribute('opacity', e);
        pz.h1.setAttribute('x2', dx); pz.h1.setAttribute('y2', dy); pz.c1.setAttribute('cx', dx); pz.c1.setAttribute('cy', dy);
        pz.h2.setAttribute('x2', mx); pz.h2.setAttribute('y2', my); pz.c2.setAttribute('cx', mx); pz.c2.setAttribute('cy', my);
      } else { const e = ease(clamp((pt - 1200) / 500, 0, 1)); const d = at(D); p = { x: lerp(d.x, d.x + PS * 0.9, e), y: lerp(d.y, d.y + PS * 0.5, e) }; }
      if (!penIn) { penIn = true; placePen(p.x - 80, p.y + 90); }
      const k = pt < 140 ? 0.22 : 1;
      placePen(lerp(penX, p.x, k), lerp(penY, p.y, k));
      // style it: the blue editing path becomes Jaiye's mark
      if (pt > 1250) {
        const e = ease(clamp((pt - 1250) / 420, 0, 1));
        pz.path.setAttribute('stroke', blueInk(e)); pz.path.setAttribute('stroke-width', lerp(0.35, 3.4, e));
        pz.ed.setAttribute('opacity', 1 - e);
        pz.mark.setAttribute('opacity', ease(clamp((pt - 1380) / 380, 0, 1)));
        if (!styled) { styled = true; pop(true); }
      }
      orbit(dt, ms, vw / 2, scrollY + vh * 0.46, isPhone ? 100 : 150, isPhone ? 180 : 280);
      if (pt > 1950) { pen.classList.add('out'); penCur.style.opacity = 0; phase = 'scan'; pt = 0; startScan(); }
    };

    /* ================================================== 2. his work, scanned behind his face */
    const scan = el('div', 'scan', '<div class="shots"></div>');
    const shots = $('.shots', scan);
    body.appendChild(scan);
    const faceEl = el('img', 'face'); faceEl.src = face.currentSrc || face.src; faceEl.alt = '';
    let faceX = vw / 2 - 36, faceY = vh * 0.46 - 36, faceS = 1;
    const placeFace = () => { faceEl.style.transform = `translate3d(${faceX}px,${faceY}px,0) scale(${faceS})`; };
    let shotI = 0, shotT = 0, flightFrom = null, flightTo = null;
    const FLICK = 1200, GATHER = 600, FLY = 700;
    function startScan() {
      warm();
      const ready = preload.filter((im) => im.complete && im.naturalWidth);
      (ready.length >= 4 ? ready : preload).forEach((im, i) => { const c = el('img'); c.src = im.src; c.alt = ''; if (i === 0) c.className = 'on'; shots.appendChild(c); });
      requestAnimationFrame(() => scan.classList.add('in'));
      body.appendChild(faceEl); placeFace();
      faceEl.animate([{ opacity: 0, transform: `translate3d(${faceX}px,${faceY}px,0) scale(.6)` }, { opacity: 1, transform: `translate3d(${faceX}px,${faceY}px,0) scale(1)` }], { duration: 380, easing: 'cubic-bezier(.2,.8,.2,1)' });
      B.scan.textContent = 'Scanning work…';
      later(() => pen.remove(), 600);
    }
    const scanStep = (dt, ms) => {
      pt += ms;
      const cx = vw / 2, cy = scrollY + vh * 0.46;
      if (pt < FLICK) {
        shotT += ms;
        if (shotT > 80 && shots.children.length) { shotT = 0; shots.children[shotI].className = ''; shotI = (shotI + 1) % shots.children.length; shots.children[shotI].className = 'on'; tick(performance.now()); }
        orbit(dt, ms, cx, cy, isPhone ? 90 : 130, isPhone ? 170 : 260);
      } else if (pt < FLICK + GATHER) {
        scan.classList.add('done');
        agents.forEach((a, i) => {
          const ang = (i / agents.length) * Math.PI * 2 + pt / 900, rad = 46 + (i % 3) * 10;
          a.tx = cx + Math.cos(ang) * rad; a.ty = cy + Math.sin(ang) * rad;
          springTo(a, dt); place(a);
        });
      } else {
        if (!flightFrom) {
          const r = face.getBoundingClientRect();
          flightFrom = { x: faceX, y: faceY }; flightTo = { x: r.left, y: r.top, s: r.width / 72 };
          bar.classList.remove('scanning');
        }
        const p = clamp((pt - FLICK - GATHER) / FLY, 0, 1), e = easeIO(p);
        faceX = lerp(flightFrom.x, flightTo.x, e); faceY = lerp(flightFrom.y, flightTo.y, e) - Math.sin(p * Math.PI) * 40; faceS = lerp(1, flightTo.s, e);
        placeFace();
        agents.forEach((a, i) => {
          if (i < 3) { a.tx = faceX + 72 * faceS * (i === 0 ? 1.05 : i === 1 ? -0.1 : 0.5); a.ty = scrollY + faceY + 72 * faceS * (i === 2 ? 1.1 : 0.2); }
          else { a.wander -= ms; if (a.wander <= 0) { a.tx = rnd(40, vw - 40); a.ty = scrollY + rnd(60, vh * 0.8); a.wander = rnd(400, 900); } }
          springTo(a, dt); place(a);
        });
        if (p >= 1) {
          face.classList.add('lb-done'); faceEl.remove(); scan.remove(); doneCount++; pop();
          if (list) { ensureRow($('.hd', main), 1, 'auto', 'Header'); selectRow(ensureRow(face, 2, 'img', 'Avatar')); }
          phase = 'build'; pt = 0;
          agents.forEach((a) => (a.wander = 0));
        }
      }
    };

    /* ================================================== 3. the build */
    let nextIdx = 0, buildT = 0;
    const expected = isPhone ? 26000 : 28000;
    const frontTop = () => { for (let i = 0; i < tasks.length; i++) if (tasks[i].state !== 2) return tasks[i].r.y; return docH; };
    const release = (a) => { a.task = null; a.wander = 0; setTag(a, a.keepTag ? a.base : ''); };
    const startTask = (a, t) => {
      a.task = t; t.state = 1; a.ph = 0; a.pt = 0; t.agent = a;
      setTag(a, roleOf(t));
      if (t.type === 'text' || t.type === 'img' || t.type === 'sp') { a.tx = t.r.x; a.ty = t.r.y; }
      else if (t.type === 'gv') { a.tx = t.r.x; a.ty = scrollY + 12; }
      else if (t.type === 'al') { a.tx = t.r.x + t.r.w * 0.5; a.ty = t.r.y; }
      else { a.tx = 6; a.ty = t.r.y; }
      t.row = rowFor(t); if (t.row) { t.row.classList.add('act'); selectRow(t.row); }
      ppFor(t);
    };
    const workStep = (a, dt, ms) => {
      const t = a.task, r = t.r;
      if (a.ph === 0) { // travel
        springTo(a, dt); a.pt += ms;
        if (Math.hypot(a.tx - a.x, a.ty - a.y) < 5 || a.pt > 900) {
          a.x = a.tx; a.y = a.ty; a.vx = a.vy = 0; a.ph = 1; a.pt = 0;
          if (t.type === 'text' || t.type === 'img') { t.sel = mkSel(t.type === 'img'); setSel(t.sel, r.x, r.y, 0, 0); t.cw = 0; t.ch = 0; hl = r; }
          else if (t.type === 'gv') { t.g = mkGuide(true); t.g.style.left = r.x + 'px'; t.g.style.height = '0px'; t.y0 = scrollY; t.g.style.top = t.y0 + 'px'; }
          else if (t.type === 'gh') { t.g = mkGuide(false); t.g.style.top = r.y + 'px'; t.g.style.width = '0px'; }
          else if (t.type === 'sp') { t.g = el('div', 'redl', '<em></em>'); t.g.style.left = r.x + 'px'; t.g.style.top = r.y + 'px'; t.g.style.height = '0px'; plane.appendChild(t.g); }
          else if (t.type === 'al') {
            t.g = el('div', 'gaps');
            t.gaps.forEach((g, i) => { const n = el('div', 'gap' + (g.horiz ? ' hz' : ''), i === 0 || g.w > 30 || g.h > 30 ? `<em>${g.v}</em>` : ''); n.style.cssText = `left:${g.x}px;top:${g.y}px;width:${g.w}px;height:${g.h}px`; t.g.appendChild(n); });
            plane.appendChild(t.g); hl = { x: r.x, y: r.y, w: r.w, h: r.h };
          }
        }
        return;
      }
      a.pt += ms;
      if (t.type === 'gv') {
        const p = ease(clamp(a.pt / T.guideV, 0, 1)), len = (docH - t.y0) * p;
        t.g.style.height = len + 'px'; a.x = r.x; a.y = t.y0 + Math.min(len, vh * 0.9 * p + 12);
        if (p >= 1) { complete(t); release(a); }
        return;
      }
      if (t.type === 'gh') {
        const p = ease(clamp(a.pt / T.guideH, 0, 1)), w = vw * p;
        t.g.style.width = w + 'px'; a.x = w; a.y = r.y;
        if (p >= 1) { complete(t); release(a); }
        return;
      }
      if (t.type === 'sp') { // measure the gap between two sections, like holding Alt in Figma
        const p = ease(clamp(a.pt / T.sp, 0, 1)), h = r.h * p;
        t.g.style.height = h + 'px'; a.x = r.x + 2; a.y = r.y + h;
        if (p >= 1) { t.g.firstChild.textContent = Math.round(r.h); t.g.classList.add('lab'); const g = t.g; setTimeout(() => fadeOut(g, 500), T.spHold / speed); complete(t); release(a); }
        return;
      }
      if (t.type === 'al') { // flash the auto-layout gaps
        a.tx = r.x + r.w * 0.5 + Math.sin(a.pt / 160) * 30; a.ty = r.y + 10; springTo(a, dt);
        if (a.pt >= T.al) { const g = t.g; setTimeout(() => fadeOut(g, 500), T.alHold / speed); complete(t); release(a); }
        return;
      }
      if (a.ph === 1) { // draw the box
        const dur = t.type === 'img' ? T.drawImg : T.draw, p = ease(clamp(a.pt / dur, 0, 1));
        t.cw = r.w * p; t.ch = r.h * p;
        setSel(t.sel, r.x, r.y, t.cw, t.ch); a.x = r.x + t.cw; a.y = r.y + t.ch;
        if (p >= 1) { a.ph = 2; a.pt = 0; if (t.type === 'text') { wrapText(t); if (!t.spans.length) a.ph = 3; } else { t.node.classList.add('lb-show', 'lb-drop'); t.sel.classList.remove('ph'); pop(); } }
        return;
      }
      if (t.type === 'img') { // drop the picture in, then let go
        a.tx = r.x + r.w * 0.55; a.ty = r.y + r.h * 0.5; springTo(a, dt);
        if (a.pt >= T.drop) { complete(t); release(a); }
        return;
      }
      if (a.ph === 2) { // type
        const n = t.spans.length, dur = clamp(n * T.perChar, T.typeMin, T.typeMax), p = clamp(a.pt / dur, 0, 1);
        const k = Math.ceil(n * p);
        for (let i = t.shown; i < k; i++) t.spans[i].classList.add('on');
        if (k > t.shown) tick(performance.now());
        t.shown = k;
        const q = t.pos[Math.max(0, k - 1)];
        a.x = lerp(a.x, q.x + 1, 0.5); a.y = lerp(a.y, q.y, 0.5);
        if (p >= 1) { a.ph = 3; a.pt = 0; t.sel.classList.add('fill'); }
        return;
      }
      if (a.ph === 3 && a.pt >= T.select) { complete(t); release(a); }
    };
    const buildStep = (dt, ms) => {
      buildT += ms;
      const want = Math.round(lerp(N0, NMAX, clamp(buildT / (expected * 0.55), 0, 1)));
      while (agents.length < want) spawn();
      const ft = frontTop(), span = vh * (isPhone ? 0.62 : 0.55);
      for (const a of agents) {
        if (a.task) continue;
        while (nextIdx < tasks.length && tasks[nextIdx].state !== 0) nextIdx++;
        if (nextIdx >= tasks.length) break;
        const t = tasks[nextIdx];
        if (t.instant) { complete(t); continue; }
        if (t.r.y > ft + span) break;
        startTask(a, t);
      }
      for (let i = nextIdx; i < tasks.length && tasks[i].instant && tasks[i].state === 0; i++) complete(tasks[i]);
      for (const a of agents) {
        if (a.task) workStep(a, dt, ms);
        else {
          a.wander -= ms;
          if (a.wander <= 0) { a.tx = rnd(isPhone ? 24 : colL - 220, isPhone ? vw - 24 : colR + 220); a.ty = clamp(ft + rnd(-vh * 0.2, vh * 0.6), scrollY + 40, scrollY + vh - 70); a.wander = rnd(500, 1400); }
          springTo(a, dt);
        }
        place(a);
      }
      ppLive();
      if (tour) {
        const max = document.documentElement.scrollHeight - vh;
        const target = clamp(ft - vh * 0.26, 0, max);
        const y = lerp(scrollY, target, 1 - Math.exp(-dt * 2.6));
        if (Math.abs(y - scrollY) > 0.5) scrollTo(0, y);
      }
      if (doneCount >= total) finish(false);
    };

    /* ---------- frame loop ---------- */
    let last = performance.now();
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const real = Math.min(50, now - last); last = now;
      const ms = real * speed, dt = ms / 1000;
      if (phase === 'pen') penStep(dt, ms);
      else if (phase === 'scan') scanStep(dt, ms);
      else if (phase === 'build') buildStep(dt, ms);
      else if (phase === 'leave') leaveStep(dt, ms);
      plane.style.transform = `translate3d(${-scrollX}px,${-scrollY}px,0)`;
      if (phase === 'pen' || phase === 'scan' || phase === 'build') drawRulers();
      B.ag.textContent = agents.length;
      B.ly.textContent = doneCount;
      B.prog.style.transform = `scaleX(${doneCount / total})`;
    };
    raf = requestAnimationFrame(frame);

    let rz = 0;
    const onResize = () => { clearTimeout(rz); rz = setTimeout(() => { measureCol(); sizeCanvas(); tasks.forEach((t) => { if (t.state === 0 && t.node) t.r = rectOf(t.node); }); }, 120); };
    addEventListener('resize', onResize);

    /* ================================================== 4. the end: zoom out to the canvas, then ▶ Present */
    let leaveT = 0, zoom = null, holdTimer = 0, flabel = null;
    function finish(skipped) {
      if (finished) return; finished = true;
      tasks.forEach((t) => { if (t.state !== 2) complete(t); });
      face.classList.add('lb-done');
      $$('.sel, .redl, .gaps', plane).forEach((s) => s.remove());
      body.classList.remove('building');
      store.set('v3built', '1');
      [rTop, rLeft, LP, PP].forEach((n) => n && n.classList.add('hide'));
      if (you) you.remove();
      guides.forEach((g) => g.classList.add('fade'));
      const secs = (performance.now() - startWall) / 1000;
      B.fa.textContent = agents.length; B.ft.textContent = secs.toFixed(1) + 's';
      if (skipped) { teardown(); scrollTo(0, 0); S = null; showDock(); return; }
      phase = 'leave'; leaveT = 0; // cursors swarm away
      const cx = vw / 2, cy = scrollY + vh / 2;
      agents.forEach((a) => { const ang = Math.atan2(a.y - cy, a.x - cx) + rnd(-.4, .4), d = Math.max(vw, vh) * rnd(0.9, 1.3); a.tx = cx + Math.cos(ang) * d; a.ty = cy + Math.sin(ang) * d; a.k = rnd(18, 34); a.wander = rnd(0, 350); setTag(a, ''); });
      bar.classList.remove('scanning'); bar.classList.add('done');
      B.prog.style.transform = 'scaleX(1)';
      later(zoomOut, 420);
    }
    function leaveStep(dt, ms) {
      leaveT += ms;
      agents.forEach((a) => { if (leaveT > a.wander) springTo(a, dt); place(a); });
      if (leaveT > 2600) { phase = 'gone'; agents.forEach((a) => a.el.remove()); agents.length = 0; sw.style.display = 'none'; cancelAnimationFrame(raf); }
    }
    function zoomOut() {
      const Y = scrollY, W = innerWidth, H = page.offsetHeight, VH = innerHeight;
      const s = isPhone ? 0.42 : clamp((VH - 150) / H, 0.16, 0.5);
      const tx = (W - W * s) / 2, ty = isPhone ? 76 : 72;
      zoom = { tx, ty, s };
      scrollTo(0, 0);
      root.classList.add('cv');
      page.style.transformOrigin = '0 0';
      page.style.transform = `translate(0px,${-Y}px)`;
      flabel = el('div', 'flabel', `<b>Home</b><span>${W} × ${Math.round(H)}</span>`);
      flabel.style.left = tx + 'px'; flabel.style.top = (ty - 22) + 'px'; flabel.setAttribute('aria-hidden', 'true');
      body.appendChild(flabel);
      const an = page.animate([{ transform: `translate(0px,${-Y}px) scale(1)` }, { transform: `translate(${tx}px,${ty}px) scale(${s})` }], { duration: 1150 / speed, easing: 'cubic-bezier(.65,0,.25,1)', fill: 'forwards' });
      an.onfinish = () => {
        if (!zoom) return;
        page.style.transform = `translate(${tx}px,${ty}px) scale(${s})`; an.cancel();
        flabel.classList.add('on'); pop(true);
        // hold on the canvas; a click, a scroll or a few seconds plays it
        holdTimer = setTimeout(present, 5200);
        addEventListener('wheel', present, { passive: true, once: true });
        addEventListener('touchmove', present, { passive: true, once: true });
        page.addEventListener('click', presentClick, true);
      };
    }
    function presentClick(e) { e.preventDefault(); e.stopPropagation(); present(); }
    function unhold() { clearTimeout(holdTimer); removeEventListener('wheel', present); removeEventListener('touchmove', present); page.removeEventListener('click', presentClick, true); }
    function present() {
      unhold();
      if (!zoom) { bar.classList.add('hide'); later(teardown, 400); S = null; showDock(); return; }
      const { tx, ty, s } = zoom; zoom = null;
      page.getAnimations().forEach((x) => x.cancel());
      if (flabel) flabel.classList.remove('on');
      bar.classList.add('hide');
      const an = page.animate([{ transform: `translate(${tx}px,${ty}px) scale(${s})` }, { transform: 'translate(0px,0px) scale(1)' }], { duration: 900, easing: 'cubic-bezier(.65,0,.25,1)' });
      page.style.transform = 'none';
      an.onfinish = () => { teardown(); S = null; showDock(); };
    }
    function teardown() {
      cancelAnimationFrame(raf); unhold(); timers.forEach(clearTimeout);
      removeEventListener('wheel', userScroll); removeEventListener('touchmove', userScroll); removeEventListener('keydown', onKey); removeEventListener('resize', onResize);
      removeEventListener('pointermove', onPtr); document.removeEventListener('pointerleave', onLeave);
      [sw, bar, rTop, rLeft, LP, PP, faceEl, scan, pen, you, flabel].forEach((n) => n && n.remove());
      page.getAnimations().forEach((x) => x.cancel());
      page.style.transform = ''; page.style.transformOrigin = ''; root.classList.remove('cv');
      if (!finished) { tasks.forEach((t) => finishNode(t)); face.classList.add('lb-done'); body.classList.remove('building'); }
    }
    return { finish, present };
  }

  /* ================================================================ Inspect mode */
  function makeInspect() {
    let on = false, ov = null, raf = 0, target = null, mx = 0, my = 0, E = {};
    const ignore = (n) => !n || !page.contains(n) || n === page || n === main;
    const pick = (n) => { if (ignore(n)) return null; if (n.closest('svg')) n = n.closest('a, button') || n.closest('svg').parentElement; return ignore(n) ? null : n; };
    const kindOf = (n, cs) => {
      if (n.tagName === 'IMG') return 'Image';
      if (n.tagName === 'VIDEO') return 'Video';
      const direct = [...n.childNodes].some((c) => c.nodeType === 3 && c.nodeValue.trim());
      if (direct) return n.tagName === 'A' ? 'Link' : 'Text';
      if (n.tagName === 'BUTTON') return 'Button';
      return cs.display.includes('flex') || cs.display.includes('grid') ? 'Auto layout' : 'Frame';
    };
    const label = (n) => { const t = (n.getAttribute('aria-label') || n.getAttribute('alt') || n.textContent || '').replace(/\s+/g, ' ').trim(); return t.length > 28 ? t.slice(0, 27) + '…' : t; };
    const sameSize = (p, r) => { const q = p.getBoundingClientRect(); return Math.abs(q.width - r.width) < 1 && Math.abs(q.height - r.height) < 1; };
    function draw() {
      raf = 0;
      if (!on || !ov) return;
      if (!target || !target.isConnected) { ov.classList.add('none'); return; }
      ov.classList.remove('none');
      const n = target, r = n.getBoundingClientRect(), cs = getComputedStyle(n);
      E.box.style.cssText = `left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px`;
      E.size.textContent = `${Math.round(r.width)} × ${Math.round(r.height)}`;
      // distances to the parent's edges
      let p = n.parentElement; while (p && p !== body && sameSize(p, r)) p = p.parentElement;
      const pr = p && p !== body ? p.getBoundingClientRect() : null;
      E.pbox.style.cssText = pr ? `left:${pr.left}px;top:${pr.top}px;width:${pr.width}px;height:${pr.height}px` : 'display:none';
      const d = pr ? { t: r.top - pr.top, b: pr.bottom - r.bottom, l: r.left - pr.left, rr: pr.right - r.right } : {};
      const setL = (L, show, css, v) => { if (!show) { L.style.display = 'none'; return; } L.style.cssText = css; L.firstChild.textContent = Math.round(v); };
      const cxm = r.left + r.width / 2, cym = r.top + r.height / 2;
      setL(E.lt, pr && d.t >= 1, pr && `left:${cxm}px;top:${pr.top}px;height:${d.t}px`, d.t);
      setL(E.lb, pr && d.b >= 1, pr && `left:${cxm}px;top:${r.bottom}px;height:${d.b}px`, d.b);
      setL(E.ll, pr && d.l >= 1, pr && `top:${cym}px;left:${pr.left}px;width:${d.l}px`, d.l);
      setL(E.lr, pr && d.rr >= 1, pr && `top:${cym}px;left:${r.right}px;width:${d.rr}px`, d.rr);
      // info card
      const kind = kindOf(n, cs), nm = label(n).replace(/[<>&]/g, '');
      let h = `<p class="ik"><b>${kind}</b>${nm ? `<span>${nm}</span>` : ''}</p><p class="iz">${Math.round(r.width)} × ${Math.round(r.height)}</p><dl>`;
      if (kind === 'Text' || kind === 'Link') {
        const fam = cs.fontFamily.split(',')[0].replace(/["']/g, ''), lh = cs.lineHeight === 'normal' ? 'Auto' : px(cs.lineHeight);
        h += `<dt>Font</dt><dd>${fam}</dd><dt>Style</dt><dd>${WEIGHT[cs.fontWeight] || cs.fontWeight} · ${px(cs.fontSize)}/${lh}</dd><dt>Colour</dt><dd><i style="background:${cs.color}"></i>${hex(cs.color)}</dd>`;
      } else {
        const bg = cs.backgroundColor, rad = px(cs.borderTopLeftRadius), pad = [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].map(px);
        const cg = cs.columnGap && cs.columnGap !== 'normal' ? px(cs.columnGap) : 0, rg = cs.rowGap && cs.rowGap !== 'normal' ? px(cs.rowGap) : 0;
        if (!/rgba\(0, 0, 0, 0\)|transparent/.test(bg)) h += `<dt>Fill</dt><dd><i style="background:${bg}"></i>${hex(bg)}</dd>`;
        if (rad) h += `<dt>Radius</dt><dd>${rad}</dd>`;
        if (pad.some((v) => v)) h += `<dt>Padding</dt><dd>${pad.join(' · ')}</dd>`;
        if (cg || rg) h += `<dt>Gap</dt><dd>${rg && rg !== cg ? rg + ' · ' : ''}${cg || rg}</dd>`;
      }
      if (pr) h += `<dt>Spacing</dt><dd>${[d.t, d.rr, d.b, d.l].map((v) => Math.max(0, Math.round(v))).join(' · ')}</dd>`;
      E.card.innerHTML = h + '</dl>';
      const cw = E.card.offsetWidth, ch = E.card.offsetHeight;
      let x = mx + 18, y = my + 20;
      if (x + cw > innerWidth - 12) x = mx - cw - 14;
      if (y + ch > innerHeight - 70) y = my - ch - 14;
      E.card.style.transform = `translate(${Math.max(8, x)}px,${Math.max(8, y)}px)`;
    }
    const sched = () => { if (!raf) raf = requestAnimationFrame(draw); };
    const onMove = (e) => { mx = e.clientX; my = e.clientY; target = pick(e.target); sched(); };
    const onClick = (e) => { if (e.target.closest('.dock')) return; e.preventDefault(); e.stopPropagation(); };
    const onKey = (e) => { if (e.key === 'Escape') toggle(false); };
    function toggle(v) {
      const next = v === undefined ? !on : !!v;
      if (next === on) return; on = next;
      if (inspBtn) inspBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      body.classList.toggle('inspecting', on);
      if (on) {
        ov = el('div', 'insp none', '<div class="ip"></div><div class="ib"><em></em></div><div class="il v ln-t"><em></em></div><div class="il v ln-b"><em></em></div><div class="il h ln-l"><em></em></div><div class="il h ln-r"><em></em></div><div class="icard"></div>');
        ov.setAttribute('aria-hidden', 'true');
        body.appendChild(ov);
        E = { box: $('.ib', ov), size: $('.ib em', ov), pbox: $('.ip', ov), lt: $(".ln-t", ov), lb: $(".ln-b", ov), ll: $(".ln-l", ov), lr: $(".ln-r", ov), card: $('.icard', ov) };
        addEventListener('pointermove', onMove, { passive: true });
        addEventListener('scroll', sched, { passive: true });
        addEventListener('click', onClick, true);
        addEventListener('keydown', onKey);
      } else {
        removeEventListener('pointermove', onMove); removeEventListener('scroll', sched); removeEventListener('click', onClick, true); removeEventListener('keydown', onKey);
        if (ov) ov.remove(); ov = null; target = null;
      }
    }
    return { toggle, get on() { return on; } };
  }
})();
