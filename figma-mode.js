/* Portfolio v3 — Figma edit mode.
   Visitors can open the home page as a frame on a Figma-style canvas and play with it:
   switch the design system (font, accent, corners, spacing, theme), select any layer,
   rewrite text, change its size or weight, hide it, undo, reset, and share a link to
   their version. Changes live only in the visitor's browser (and in links they share);
   Jaiye's real site never changes. Desktop only. */
(() => {
  const page = document.querySelector('.page');
  const main = document.querySelector('main[data-scan]');
  if (!page || !main) return;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const body = document.body, root = document.documentElement;
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = { get: (k) => { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { if (v == null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); } catch (e) {} } };
  const PW = 248, FRAME = 1100;
  const canEdit = () => innerWidth >= 1180 && matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ================================================================ the design system */
  const FONTS = [
    { id: 'hanken', name: 'Hanken Grotesk', css: '"Hanken Grotesk", system-ui, sans-serif' },
    { id: 'instrument', name: 'Instrument Sans', css: '"Instrument Sans", system-ui, sans-serif', g: 'Instrument+Sans:wght@400;500;600' },
    { id: 'plex', name: 'IBM Plex Sans', css: '"IBM Plex Sans", system-ui, sans-serif', g: 'IBM+Plex+Sans:wght@400;500;600' },
    { id: 'newsreader', name: 'Newsreader', css: '"Newsreader", Georgia, serif', g: 'Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600' },
  ];
  const ACCENTS = [
    { id: 'navy', name: 'Navy', l: '#1B2B5E', d: '#A3B4F0' },
    { id: 'forest', name: 'Forest', l: '#1E4D3B', d: '#93D3B4' },
    { id: 'oxblood', name: 'Oxblood', l: '#6E1F2E', d: '#F0A7B3' },
    { id: 'plum', name: 'Plum', l: '#4A2C6B', d: '#CDB6F2' },
    { id: 'ink', name: 'Ink', l: '#16171A', d: '#F1F1EE' },
  ];
  const RADII = [{ id: 'sharp', name: 'Sharp', v: 2 }, { id: 'soft', name: 'Soft', v: 10 }, { id: 'round', name: 'Round', v: 22 }];
  const DENS = [{ id: 'compact', name: 'Compact', gap: 56, g: 12 }, { id: 'comfy', name: 'Comfortable', gap: 80, g: 16 }, { id: 'airy', name: 'Airy', gap: 112, g: 22 }];
  const THEMES = [{ id: 'light', name: 'Light' }, { id: 'dark', name: 'Dark' }];
  const SETS = { f: FONTS, a: ACCENTS, r: RADII, d: DENS, t: THEMES };
  const DEF = { f: 'hanken', a: 'navy', r: 'soft', d: 'comfy', t: 'light' };
  const WEIGHTS = [[400, 'Regular'], [500, 'Medium'], [600, 'Semi Bold']];
  const loaded = new Set(['hanken']);
  const loadFont = (f) => { if (!f.g || loaded.has(f.id)) return; loaded.add(f.id); const l = el('link'); l.rel = 'stylesheet'; l.href = `https://fonts.googleapis.com/css2?family=${f.g}&display=swap`; document.head.appendChild(l); };

  /* ================================================================ layers that can be edited */
  // A fixed, document-ordered list: sections, build layers, and every leaf of text.
  // Edits are keyed by position in this list, so a shared link maps to the same layers.
  const nodes = () => {
    const out = [];
    for (const n of page.querySelectorAll('*')) {
      if (n.closest('.fsel, .fcur, svg, script, [hidden]') || n.matches('script, style, svg *')) continue;
      if (n.matches('.hero h1')) { out.push(n); continue; }
      if (n.closest('.hero h1')) continue;
      if (n.hasAttribute('data-l') || n.matches('.hd, .hero, section, .ft')) { out.push(n); continue; }
      if (n.children.length === 0 && n.textContent.trim() && !n.matches('[data-clock], .ch')) out.push(n);
    }
    return out;
  };
  const N0 = nodes();
  const ORIG = N0.map((n) => ({ text: n.children.length === 0 ? n.textContent : null, html: n.matches('.hero h1') ? n.innerHTML : null, style: n.getAttribute('style') }));
  const isLeaf = (n) => n.matches('.hero h1') || (n.children.length === 0 && !!n.textContent.trim());
  const wrapScale = (t) => { const s = esc(t); const i = s.toLowerCase().lastIndexOf('scale'); return i < 0 ? s : s.slice(0, i) + '<span class="w">' + s.slice(i, i + 5) + '</span>' + s.slice(i + 5); };

  /* ================================================================ state, undo, share */
  let state = { k: { ...DEF }, e: {} };
  const isDefault = (s = state) => Object.keys(DEF).every((k) => s.k[k] === DEF[k]) && !Object.keys(s.e).length;
  const valid = (s) => {
    const out = { k: { ...DEF }, e: {} };
    if (s && s.k && typeof s.k === 'object') Object.keys(DEF).forEach((k) => { if (SETS[k].some((x) => x.id === s.k[k])) out.k[k] = s.k[k]; });
    if (s && s.e && typeof s.e === 'object') Object.entries(s.e).slice(0, 400).forEach(([i, v]) => {
      i = +i; if (!Number.isInteger(i) || i < 0 || i >= ORIG.length || !v || typeof v !== 'object') return;
      const o = {};
      if (typeof v.x === 'string') o.x = v.x.slice(0, 300);
      if (Number.isFinite(v.s)) o.s = clamp(Math.round(v.s), 8, 120);
      if (WEIGHTS.some((w) => w[0] === v.w)) o.w = v.w;
      if (v.h) o.h = 1;
      if (Object.keys(o).length) out.e[i] = o;
    });
    return out;
  };
  const enc = (s) => btoa(unescape(encodeURIComponent(JSON.stringify(s)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const dec = (t) => { try { return JSON.parse(decodeURIComponent(escape(atob(t.replace(/-/g, '+').replace(/_/g, '/'))))); } catch (e) { return null; } };
  const hist = [];
  const snapshot = () => { hist.push(JSON.stringify(state)); if (hist.length > 120) hist.shift(); };
  const commit = (fn) => { snapshot(); fn(); apply(); ui(); };
  const undo = () => { if (!hist.length) return; state = JSON.parse(hist.pop()); apply(); ui(); };
  const edit = (i) => (state.e[i] = state.e[i] || {});
  const tidy = (i) => { if (state.e[i] && !Object.keys(state.e[i]).length) delete state.e[i]; };

  /* ================================================================ apply */
  function apply() {
    const k = state.k, dark = k.t === 'dark';
    const f = FONTS.find((x) => x.id === k.f), a = ACCENTS.find((x) => x.id === k.a), r = RADII.find((x) => x.id === k.r), d = DENS.find((x) => x.id === k.d);
    loadFont(f);
    const st = body.style;
    const props = { '--font': f.css, '--navy': dark ? a.d : a.l, '--r': r.v + 'px', '--gap': d.gap + 'px', '--g': d.g + 'px' };
    const tokensDefault = Object.keys(DEF).every((x) => k[x] === DEF[x]);
    Object.entries(props).forEach(([p, v]) => (tokensDefault ? st.removeProperty(p) : st.setProperty(p, v)));
    body.classList.toggle('t-dark', dark);
    const N = nodes();
    if (N.length === ORIG.length) N.forEach((n, i) => {
      const o = ORIG[i], ed = state.e[i];
      if (o.html != null) { const h = ed && ed.x != null ? wrapScale(ed.x) : o.html; if (n.innerHTML !== h) n.innerHTML = h; }
      else if (o.text != null && n.children.length === 0) { const t = ed && ed.x != null ? ed.x : o.text; if (n.textContent !== t) n.textContent = t; }
      if (o.style == null) n.removeAttribute('style'); else n.setAttribute('style', o.style);
      if (ed) { if (ed.s) n.style.fontSize = ed.s + 'px'; if (ed.w) n.style.fontWeight = ed.w; if (ed.h) n.style.display = 'none'; }
    });
    store.set('fm', isDefault() ? null : JSON.stringify(state));
    document.dispatchEvent(new Event('v3:layout'));
    dockState();
  }

  /* ================================================================ dock buttons */
  const dock = $('.dock');
  const editBtn = el('button', 'dk-edit', '<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 14l1.2-4.6L10.6 2 14 5.4l-7.4 7.4z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>Edit in Figma mode');
  editBtn.type = 'button'; editBtn.title = 'Open this page as a frame on a canvas and play with the design';
  const resetBtn = el('button', 'dk-reset', 'Reset changes');
  resetBtn.type = 'button'; resetBtn.title = "Go back to Jaiye's original design";
  if (dock) { dock.insertBefore(editBtn, dock.firstChild); dock.insertBefore(resetBtn, dock.firstChild); }
  editBtn.addEventListener('click', () => enter());
  resetBtn.addEventListener('click', () => { commit(() => { state = { k: { ...DEF }, e: {} }; }); if (location.hash.startsWith('#remix=')) history.replaceState(null, '', location.pathname + location.search); });
  function dockState() { editBtn.hidden = !canEdit(); resetBtn.hidden = isDefault(); }
  addEventListener('resize', dockState);

  /* ================================================================ load a shared or saved version */
  const fromHash = location.hash.startsWith('#remix=') ? dec(location.hash.slice(7)) : null;
  const fromStore = (() => { try { return JSON.parse(store.get('fm')); } catch (e) { return null; } })();
  if (fromHash || fromStore) { state = valid(fromHash || fromStore); apply(); } else dockState();
  if (fromHash) toast('You are looking at a remix of this page. Jaiye’s original is one click away: Reset changes.', 6500);

  /* ================================================================ edit mode */
  let on = false, cam = { x: 0, y: 0, s: 1 }, sel = -1, hov = null, editing = null, raf = 0, list = [], index = new Map(), LP, PP, bar, ov, flabel, lastY = 0;
  const pageH = () => page.offsetHeight;
  const fit = () => clamp((innerWidth - PW * 2 - 96) / FRAME, 0.3, 1);
  const setCam = () => { page.style.transform = `translate(${cam.x}px,${cam.y}px) scale(${cam.s})`; };
  const clampCam = () => { const H = pageH() * cam.s; cam.y = clamp(cam.y, Math.min(70, innerHeight - 90 - H), 70); };

  function enter() {
    if (on || !canEdit() || body.classList.contains('building')) return;
    on = true;
    const ib = $('.dk-insp'); if (ib && ib.getAttribute('aria-pressed') === 'true') ib.click();
    lastY = scrollY;
    body.classList.add('fm-on');
    list = nodes(); index = new Map(list.map((n, i) => [n, i]));
    // the page becomes a 1100-wide frame; centred, it looks exactly the same as before
    const W = innerWidth, x0 = (W - FRAME) / 2;
    page.style.width = FRAME + 'px'; page.style.transformOrigin = '0 0';
    page.style.transform = `translate(${x0}px,${-lastY}px)`;
    root.classList.add('cv', 'fm'); scrollTo(0, 0);
    cam.s = fit(); cam.x = PW + (W - PW * 2 - FRAME * cam.s) / 2; cam.y = 70 - lastY * cam.s; clampCam();
    const an = page.animate([{ transform: `translate(${x0}px,${-lastY}px) scale(1)` }, { transform: `translate(${cam.x}px,${cam.y}px) scale(${cam.s})` }], { duration: 650, easing: 'cubic-bezier(.65,0,.25,1)' });
    setCam();
    buildUI();
    an.onfinish = () => { flabel.classList.add('on'); };
    addEventListener('wheel', onWheel, { passive: false });
    page.addEventListener('click', onClick, true);
    page.addEventListener('dblclick', onDbl, true);
    page.addEventListener('pointermove', onHover);
    page.addEventListener('pointerleave', () => (hov = null));
    addEventListener('keydown', onKey);
    addEventListener('resize', onResize);
    loop();
    toast('Edit mode: click anything to select it, double-click text to rewrite it, and change the design system on the right. This is your copy; Jaiye’s site stays as it is.', 7000);
  }
  function exit() {
    if (!on) return;
    stopEdit(true);
    const W = innerWidth, x0 = (W - FRAME) / 2, Y = clamp((70 - cam.y) / cam.s, 0, Math.max(0, pageH() - innerHeight));
    const an = page.animate([{ transform: `translate(${cam.x}px,${cam.y}px) scale(${cam.s})` }, { transform: `translate(${x0}px,${-Y}px) scale(1)` }], { duration: 600, easing: 'cubic-bezier(.65,0,.25,1)' });
    page.style.transform = `translate(${x0}px,${-Y}px)`;
    [LP, PP, bar, ov, flabel].forEach((n) => n && n.classList.add('hide'));
    an.onfinish = () => {
      on = false; cancelAnimationFrame(raf);
      removeEventListener('wheel', onWheel); page.removeEventListener('click', onClick, true); page.removeEventListener('dblclick', onDbl, true);
      page.removeEventListener('pointermove', onHover); removeEventListener('keydown', onKey); removeEventListener('resize', onResize);
      [LP, PP, bar, ov, flabel].forEach((n) => n && n.remove());
      page.style.transform = ''; page.style.transformOrigin = ''; page.style.width = '';
      root.classList.remove('cv', 'fm'); body.classList.remove('fm-on');
      scrollTo(0, Y); sel = -1; hov = null;
      document.dispatchEvent(new Event('v3:layout'));
    };
  }
  const onResize = () => { if (!canEdit()) return exit(); cam.s = Math.min(cam.s, fit()); clampCam(); setCam(); };

  /* ---------- canvas: pan and zoom ---------- */
  function zoomTo(s, sx = innerWidth / 2, sy = innerHeight / 2) {
    s = clamp(s, 0.25, 2);
    cam.x = sx - (sx - cam.x) * (s / cam.s); cam.y = sy - (sy - cam.y) * (s / cam.s); cam.s = s;
    clampCam(); setCam(); ui(true);
  }
  function onWheel(e) {
    if (e.target.closest('.fp, .fm-bar')) return;
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) zoomTo(cam.s * Math.exp(-clamp(e.deltaY, -40, 40) * 0.01), e.clientX, e.clientY);
    else { cam.x -= e.deltaX; cam.y -= e.deltaY; clampCam(); setCam(); }
  }
  const fitAll = () => { cam.s = fit(); cam.x = PW + (innerWidth - PW * 2 - FRAME * cam.s) / 2; clampCam(); setCam(); ui(true); };
  const reveal = (n) => {
    const r = n.getBoundingClientRect();
    if (r.top < 90 || r.bottom > innerHeight - 90) { cam.y += 140 - r.top; clampCam(); page.animate([{ transform: page.style.transform }, { transform: `translate(${cam.x}px,${cam.y}px) scale(${cam.s})` }], { duration: 380, easing: 'cubic-bezier(.4,0,.2,1)' }); setCam(); }
  };

  /* ---------- selecting and editing ---------- */
  const pick = (t) => { if (t.closest('svg')) t = t.closest('a, button, [data-l]') || t; while (t && t !== page && !index.has(t)) t = t.parentElement; return t && t !== page ? t : null; };
  function onHover(e) { if (!editing) hov = pick(e.target); }
  function onClick(e) {
    if (editing && editing.contains(e.target)) return;
    e.preventDefault(); e.stopPropagation();
    stopEdit(true);
    const n = pick(e.target); select(n ? index.get(n) : -1);
  }
  function onDbl(e) { const n = pick(e.target); if (!n) return; e.preventDefault(); select(index.get(n)); if (isLeaf(n)) startEdit(n); }
  function select(i) { sel = i; ui(); if (i >= 0) { const row = LP && LP.querySelector(`[data-i="${i}"]`); if (row) row.scrollIntoView({ block: 'nearest' }); } }
  function startEdit(n) {
    if (!isLeaf(n)) return;
    editing = n; editing.dataset.before = n.matches('.hero h1') ? n.textContent : n.textContent;
    try { n.contentEditable = 'plaintext-only'; } catch (e) { n.contentEditable = 'true'; }
    if (n.contentEditable !== 'plaintext-only') n.contentEditable = 'true';
    n.classList.add('fm-editing'); n.focus();
    const rg = document.createRange(); rg.selectNodeContents(n); const s = getSelection(); s.removeAllRanges(); s.addRange(rg);
    n.addEventListener('keydown', editKeys);
    n.addEventListener('blur', blurEdit);
  }
  const editKeys = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); stopEdit(true); } else if (e.key === 'Escape') { e.preventDefault(); stopEdit(false); } e.stopPropagation(); };
  const blurEdit = () => stopEdit(true);
  function stopEdit(keep) {
    const n = editing; if (!n) return; editing = null;
    n.removeEventListener('keydown', editKeys); n.removeEventListener('blur', blurEdit);
    n.contentEditable = 'false'; n.removeAttribute('contenteditable'); n.classList.remove('fm-editing');
    const i = index.get(n), before = n.dataset.before; delete n.dataset.before;
    const txt = n.textContent.replace(/\s+/g, ' ').trim().slice(0, 300);
    if (keep && txt && txt !== before) commit(() => { const o = ORIG[i]; const orig = o.html != null ? new DOMParser().parseFromString(o.html, 'text/html').body.textContent : o.text; if (txt === orig) { delete edit(i).x; tidy(i); } else edit(i).x = txt; });
    else apply();
  }
  function onKey(e) {
    if (e.target.closest('input, textarea, [contenteditable="true"], [contenteditable="plaintext-only"]')) return;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); undo(); }
    else if (e.key === 'Escape') { if (sel >= 0) select(-1); else exit(); }
    else if ((e.key === 'Delete' || e.key === 'Backspace') && sel >= 0) { e.preventDefault(); toggleHide(sel); }
    else if (e.key === 'Enter' && sel >= 0 && isLeaf(list[sel])) { e.preventDefault(); startEdit(list[sel]); }
    else if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) { e.preventDefault(); zoomTo(cam.s * 1.2); }
    else if ((e.ctrlKey || e.metaKey) && e.key === '-') { e.preventDefault(); zoomTo(cam.s / 1.2); }
    else if ((e.ctrlKey || e.metaKey) && e.key === '0') { e.preventDefault(); fitAll(); }
  }
  const toggleHide = (i) => commit(() => { const ed = edit(i); if (ed.h) delete ed.h; else ed.h = 1; tidy(i); });

  /* ---------- names ---------- */
  const nameOf = (n) => {
    if (n.matches('.hd')) return ['auto', 'Header'];
    if (n.matches('.hero')) return ['auto', 'Hero'];
    if (n.matches('.ft')) return ['auto', 'Footer'];
    if (n.matches('section')) return ['auto', ((n.querySelector('h2') || {}).textContent || 'Section').trim()];
    if (n.matches('[data-l="i"]')) return n.closest('.mv') ? ['video', 'Video'] : n.matches('.av') ? ['img', 'Avatar'] : ['img', 'Cover'];
    if (n.matches('.arrows')) return ['auto', 'Arrows'];
    if (n.matches('.card .cap')) return ['auto', 'Caption'];
    if (n.matches('.btn')) return ['comp', 'Button'];
    let s = n.textContent.replace(/\s+/g, ' ').trim(); if (s.length > 26) s = s.slice(0, 25) + '…';
    return ['text', s || 'Layer'];
  };
  const ICON = {
    frame: '<svg viewBox="0 0 12 12"><path d="M3.5 1v10M8.5 1v10M1 3.5h10M1 8.5h10" stroke="currentColor" fill="none"/></svg>',
    text: '<svg viewBox="0 0 12 12"><path d="M2.2 2.5h7.6M6 2.5v8" stroke="currentColor" stroke-width="1.3" fill="none"/></svg>',
    img: '<svg viewBox="0 0 12 12"><rect x="1.5" y="2" width="9" height="8" rx="1" stroke="currentColor" fill="none"/><path d="M2 9.2l2.8-2.8 2 2 1.4-1.4 2 2" stroke="currentColor" fill="none"/></svg>',
    video: '<svg viewBox="0 0 12 12"><rect x="1.5" y="2" width="9" height="8" rx="1" stroke="currentColor" fill="none"/><path d="M5 4.4v3.2L7.6 6z" fill="currentColor"/></svg>',
    auto: '<svg viewBox="0 0 12 12"><rect x="2" y="1.5" width="8" height="3.6" rx=".6" stroke="currentColor" fill="none"/><rect x="2" y="6.9" width="8" height="3.6" rx=".6" stroke="currentColor" fill="none"/></svg>',
    comp: '<svg viewBox="0 0 12 12"><path d="M6 1.3L10.7 6 6 10.7 1.3 6z" stroke="currentColor" fill="none"/></svg>',
    eye: '<svg viewBox="0 0 16 16"><path d="M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8z" fill="none" stroke="currentColor" stroke-width="1.2"/><circle cx="8" cy="8" r="2" fill="currentColor"/></svg>',
    eyeOff: '<svg viewBox="0 0 16 16"><path d="M2 2l12 12M6.3 4A6.5 6.5 0 0 1 8 3.5c4.1 0 6.5 4.5 6.5 4.5a11 11 0 0 1-1.9 2.4M10.3 11.8A6 6 0 0 1 8 12.5C3.9 12.5 1.5 8 1.5 8a11 11 0 0 1 2.6-3" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>',
  };

  /* ---------- panels, bar, overlay ---------- */
  function buildUI() {
    LP = el('div', 'fp fp-l live hide', `<div class="fp-hd"><b>Jaiye — Portfolio</b><span>Your copy · nothing here changes the real site</span></div><div class="fp-tabs"><b>Layers</b><em>Home</em></div><div class="fp-list"></div>`);
    PP = el('div', 'fp fp-r live hide', `<div class="fp-tabs"><b>Design</b><span>Prototype</span><em class="fm-z">100%</em></div><div class="pp"></div>`);
    bar = el('div', 'bar fm-bar hide', `<span class="n"><b>Edit mode</b></span><span class="sep"></span>
      <button type="button" data-a="undo" data-tip="Undo (Ctrl+Z)">Undo</button>
      <button type="button" data-a="reset" data-tip="Back to Jaiye's design">Reset</button><span class="sep"></span>
      <button type="button" data-a="out" aria-label="Zoom out">−</button><span class="n fm-z2">100%</span><button type="button" data-a="in" aria-label="Zoom in">+</button><button type="button" data-a="fit">Fit</button><span class="sep"></span>
      <button type="button" data-a="share" data-tip="Copy a link to your version">Copy link</button>
      <button type="button" class="go" data-a="present"><svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.8v8.4L10 6z" fill="currentColor"/></svg>Present</button>`);
    bar.setAttribute('role', 'toolbar'); bar.setAttribute('aria-label', 'Edit mode');
    ov = el('div', 'fm-ov', '<div class="fm-h"></div><div class="fm-s"><i></i><i></i><i></i><i></i><em></em></div>');
    flabel = el('div', 'flabel', `<b>Home</b><span>Desktop · ${FRAME} — your copy</span>`);
    [LP, PP, ov, flabel].forEach((n) => n.setAttribute('aria-hidden', n === ov || n === flabel ? 'true' : 'false'));
    body.append(ov, LP, PP, bar, flabel);
    bar.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      const a = b.dataset.a;
      if (a === 'undo') undo();
      else if (a === 'reset') commit(() => { state = { k: { ...DEF }, e: {} }; });
      else if (a === 'out') zoomTo(cam.s / 1.2);
      else if (a === 'in') zoomTo(cam.s * 1.2);
      else if (a === 'fit') fitAll();
      else if (a === 'share') share();
      else if (a === 'present') exit();
    });
    // layers list
    const L = $('.fp-list', LP);
    const blocks = list.map((n, i) => [n, i]).filter(([n]) => n.matches('.hd, .hero, section, .ft'));
    let h = `<div class="lr" style="--lv:0"><i class="ic">${ICON.frame}</i><span>Home</span></div>`;
    blocks.forEach(([b, bi]) => {
      const [bic, bn] = nameOf(b);
      h += row(bi, 1, bic, bn);
      list.forEach((n, i) => { if (n !== b && b.contains(n) && n.hasAttribute('data-l')) { const [ic, nm] = nameOf(n); h += row(i, 2, ic, nm); } });
    });
    L.innerHTML = h;
    L.addEventListener('click', (e) => {
      const r = e.target.closest('[data-i]'); if (!r) return;
      const i = +r.dataset.i;
      if (e.target.closest('.eye')) return toggleHide(i);
      select(i); reveal(list[i]);
    });
    L.addEventListener('pointerover', (e) => { const r = e.target.closest('[data-i]'); hov = r ? list[+r.dataset.i] : null; });
    L.addEventListener('pointerleave', () => (hov = null));
    // properties
    PP.addEventListener('click', onPP);
    PP.addEventListener('input', onPPInput);
    PP.addEventListener('focusin', (e) => { if (e.target.matches('textarea')) snapshot(); });
    ui();
    requestAnimationFrame(() => requestAnimationFrame(() => [LP, PP, bar].forEach((n) => n.classList.remove('hide'))));
  }
  const row = (i, lv, ic, nm) => `<div class="lr${ic === 'comp' ? ' inst' : ''}" data-i="${i}" style="--lv:${lv}"><i class="ic">${ICON[ic]}</i><span>${esc(nm)}</span><button type="button" class="eye" aria-label="Hide or show ${esc(nm)}">${ICON.eye}</button></div>`;

  function seg(key, items, cur) { return `<div class="seg" data-k="${key}">${items.map((x) => `<button type="button" data-v="${x.id}" aria-pressed="${x.id === cur}">${x.name}</button>`).join('')}</div>`; }
  function ui(zoomOnly) {
    if (!on || !PP) return;
    const z = Math.round(cam.s * 100) + '%';
    $('.fm-z', PP).textContent = z; $('.fm-z2', bar).textContent = z;
    if (zoomOnly) return;
    const k = state.k;
    let h = `<div class="pp-sec"><h6>Design system</h6>
      <p class="pp-l">Font</p><div class="fonts" data-k="f">${FONTS.map((f) => { loadFont(f); return `<button type="button" data-v="${f.id}" aria-pressed="${f.id === k.f}" style="font-family:${f.css.replace(/"/g, "'")}"><b>Aa</b><span>${f.name}</span></button>`; }).join('')}</div>
      <p class="pp-l">Accent</p><div class="swatches" data-k="a">${ACCENTS.map((a) => `<button type="button" data-v="${a.id}" aria-pressed="${a.id === k.a}" aria-label="${a.name}" title="${a.name}" style="--c:${a.l}"></button>`).join('')}</div>
      <p class="pp-l">Corners</p>${seg('r', RADII, k.r)}
      <p class="pp-l">Spacing</p>${seg('d', DENS, k.d)}
      <p class="pp-l">Theme</p>${seg('t', THEMES, k.t)}
    </div>`;
    if (sel >= 0 && list[sel]) {
      const n = list[sel], [ic, nm] = nameOf(n), ed = state.e[sel] || {}, cs = getComputedStyle(n), leaf = isLeaf(n);
      const fs = Math.round(parseFloat(cs.fontSize)), fw = +cs.fontWeight;
      h += `<div class="pp-sec"><div class="pp-ttl"><i class="ic">${ICON[ic]}</i>${esc(nm)}</div>
        <div class="pp-grid"><span><em>W</em><b class="fm-w">0</b></span><span><em>H</em><b class="fm-hh">0</b></span></div></div>`;
      if (leaf) h += `<div class="pp-sec"><h6>Text</h6><textarea rows="3" maxlength="300" aria-label="Text">${esc(n.textContent.replace(/\s+/g, ' ').trim())}</textarea><p class="pp-note">Or double-click it on the canvas.</p></div>`;
      if (leaf || n.matches('[data-l="t"]')) h += `<div class="pp-sec"><h6>Type</h6><div class="step" data-k="s"><button type="button" data-v="-1" aria-label="Smaller">−</button><b>${fs}</b><button type="button" data-v="1" aria-label="Bigger">+</button><em>px</em></div>
        <div class="seg" data-k="w">${WEIGHTS.map(([w, l]) => `<button type="button" data-v="${w}" aria-pressed="${w === fw}">${l}</button>`).join('')}</div></div>`;
      h += `<div class="pp-sec pp-acts"><button type="button" data-act="hide">${ed.h ? 'Show layer' : 'Hide layer'}</button><button type="button" data-act="clear"${Object.keys(ed).length ? '' : ' disabled'}>Reset layer</button><button type="button" data-act="deselect">Done</button></div>`;
    } else h += `<div class="pp-sec"><h6>Selection</h6><p class="pp-note">Click anything on the page to select it. Double-click text to rewrite it. Delete hides a layer, Ctrl+Z undoes.</p></div>`;
    $('.pp', PP).innerHTML = h;
    // layers list state
    $$('.lr[data-i]', LP).forEach((r) => { const i = +r.dataset.i; $('span', r).textContent = nameOf(list[i])[1]; r.classList.toggle('is-sel', i === sel); r.classList.toggle('off', !!(state.e[i] && state.e[i].h)); const eb = $('.eye', r); if (eb) eb.innerHTML = state.e[i] && state.e[i].h ? ICON.eyeOff : ICON.eye; });
    $('[data-a="undo"]', bar).disabled = !hist.length;
  }
  function onPP(e) {
    const b = e.target.closest('button'); if (!b) return;
    const g = b.parentElement.dataset.k, v = b.dataset.v, act = b.dataset.act;
    if (SETS[g]) return commit(() => { state.k[g] = v; });
    if (g === 's' && sel >= 0) { const n = list[sel]; const cur = Math.round(parseFloat(getComputedStyle(n).fontSize)); return commit(() => { edit(sel).s = clamp(cur + (+v), 8, 120); }); }
    if (g === 'w' && sel >= 0) return commit(() => { edit(sel).w = +v; });
    if (act === 'hide') return toggleHide(sel);
    if (act === 'clear') return commit(() => { delete state.e[sel]; });
    if (act === 'deselect') return select(-1);
  }
  function onPPInput(e) {
    if (!e.target.matches('textarea') || sel < 0) return;
    const txt = e.target.value.replace(/\s+/g, ' ').slice(0, 300);
    edit(sel).x = txt; apply();
    $$('.lr[data-i]', LP).forEach((r) => { if (+r.dataset.i === sel) $('span', r).textContent = nameOf(list[sel])[1]; });
  }

  /* ---------- overlay loop: hover and selection boxes, frame label ---------- */
  function loop() {
    raf = requestAnimationFrame(loop);
    const H = $('.fm-h', ov), Sb = $('.fm-s', ov);
    const box = (n, b) => { if (!n || !n.isConnected || n.style.display === 'none') { b.style.display = 'none'; return null; } const r = n.getBoundingClientRect(); b.style.cssText = `display:block;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px`; return r; };
    box(hov && hov !== list[sel] ? hov : null, H);
    const r = box(sel >= 0 ? list[sel] : null, Sb);
    if (r) {
      const w = Math.round(r.width / cam.s), hh = Math.round(r.height / cam.s);
      Sb.lastChild.textContent = `${w} × ${hh}`;
      const W = $('.fm-w', PP), HH = $('.fm-hh', PP); if (W) { W.textContent = w; HH.textContent = hh; }
    }
    if (flabel) { flabel.style.left = cam.x + 'px'; flabel.style.top = (cam.y - 22) + 'px'; }
  }

  /* ---------- share ---------- */
  function share() {
    const url = location.origin + location.pathname + (isDefault() ? '' : '#remix=' + enc(state));
    const done = () => toast(isDefault() ? 'Link copied. You haven’t changed anything yet, so it opens Jaiye’s original.' : 'Link copied. Anyone who opens it sees your version, and can reset it.');
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, () => prompt('Copy this link', url));
    else prompt('Copy this link', url);
  }

  /* ---------- toast ---------- */
  function toast(msg, ms = 3200) {
    let t = $('.fm-toast');
    if (!t) { t = el('div', 'fm-toast'); t.setAttribute('role', 'status'); body.appendChild(t); }
    t.textContent = msg; t.classList.add('on');
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), ms);
  }
})();
