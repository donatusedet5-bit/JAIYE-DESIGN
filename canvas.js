/* Project canvas: every screen of a project laid out like a Figma page.
   Drag to move, pinch or Ctrl/⌘ + scroll to zoom, click a frame to focus it, Esc to close. */
(() => {
  const data = document.getElementById('cv-data');
  if (!data) return;
  let frames = [];
  try { frames = JSON.parse(data.textContent); } catch (e) { return; }
  if (!frames.length) return;
  const name = data.dataset.name || 'Project';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const easeIO = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- layout: phone screens in a row, boards in rows below ---------- */
  const PH = 1100, BW = 1440, TALLW = 1100, GAP = 140, ROWW = 5400, LABEL = 70;
  const items = frames.map((f) => {
    const phone = f.kind === 'phone', ratio = f.h / f.w;
    const W = phone ? PH / ratio : ratio > 1.6 ? TALLW : BW;
    return { ...f, phone, W, H: W * ratio };
  });
  let x = 0, y = 0, rowH = 0, prev = null;
  items.forEach((it) => {
    if ((prev !== null && it.phone !== prev) || (x > 0 && x + it.W > ROWW)) { x = 0; y += rowH + GAP + LABEL; rowH = 0; }
    it.X = x; it.Y = y; x += it.W + (it.phone ? 90 : GAP); rowH = Math.max(rowH, it.H); prev = it.phone;
  });
  const world = { w: Math.max(...items.map((i) => i.X + i.W)), h: Math.max(...items.map((i) => i.Y + i.H)) };

  let ov = null, stage = null, plane = null, labels = [], zoomTxt = null, last = null, anim = 0;
  const cam = { x: 0, y: 0, z: 1 };
  const apply = () => {
    plane.style.transform = `translate(${cam.x}px,${cam.y}px) scale(${cam.z})`;
    items.forEach((it, i) => {
      const L = labels[i]; L.style.transform = `translate(${it.X * cam.z + cam.x}px,${it.Y * cam.z + cam.y - 20}px)`;
      L.style.maxWidth = Math.max(40, it.W * cam.z) + 'px';
    });
    zoomTxt.textContent = Math.round(cam.z * 100) + '%';
  };
  const view = () => { const r = stage.getBoundingClientRect(); return { w: r.width, h: r.height, top: 64, bottom: 84 }; };
  const target = (rect, pad = 60) => {
    const v = view(), aw = v.w - pad * 2, ah = v.h - v.top - v.bottom - pad;
    const z = clamp(Math.min(aw / rect.w, ah / rect.h), 0.02, 4);
    return { z, x: (v.w - rect.w * z) / 2 - rect.x * z, y: v.top + pad / 2 + (ah - rect.h * z) / 2 - rect.y * z };
  };
  const go = (t, ms = 480) => {
    cancelAnimationFrame(anim);
    if (reduce || !ms) { Object.assign(cam, t); apply(); return; }
    const from = { ...cam }, t0 = performance.now();
    const step = (now) => { const p = clamp((now - t0) / ms, 0, 1), e = easeIO(p); cam.x = from.x + (t.x - from.x) * e; cam.y = from.y + (t.y - from.y) * e; cam.z = from.z + (t.z - from.z) * e; apply(); if (p < 1) anim = requestAnimationFrame(step); };
    anim = requestAnimationFrame(step);
  };
  const fitAll = (ms) => go(target({ x: 0, y: 0, w: world.w, h: world.h }), ms);
  // phones start zoomed on the first screens so they are big enough to read
  const fitStart = () => { if (innerWidth > 700) return fitAll(0); const f = items[0]; go(target({ x: f.X, y: f.Y, w: Math.min(world.w, f.W * 2.2), h: f.H }, 24), 0); };
  const zoomAt = (f, sx, sy) => { cancelAnimationFrame(anim); const z = clamp(cam.z * f, 0.02, 4); cam.x = sx - (sx - cam.x) * (z / cam.z); cam.y = sy - (sy - cam.y) * (z / cam.z); cam.z = z; apply(); };
  const center = () => { const v = view(); return [v.w / 2, (v.h + v.top - v.bottom) / 2]; };

  function open(e) {
    if (ov) return;
    last = e && e.currentTarget;
    ov = document.createElement('div');
    ov.className = 'cvv';
    ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', name + ' canvas');
    ov.innerHTML = `
      <div class="cvv-stage"><div class="cvv-plane">${items.map((it, i) => `<button type="button" class="cvv-f" data-i="${i}" style="left:${it.X}px;top:${it.Y}px;width:${it.W}px;height:${it.H}px" aria-label="Focus ${esc(it.label)}"><img src="${it.src}" alt="${esc(it.label)}" loading="lazy" decoding="async"></button>`).join('')}</div>
        ${items.map((it) => `<span class="cvv-l">${esc(it.label)}</span>`).join('')}</div>
      <div class="cvv-top"><div><b>${esc(name)}</b><span>${items.length} frames</span></div><p>Drag to move · Pinch or Ctrl + scroll to zoom · Click a frame to focus</p></div>
      <div class="cvv-bar">
        <button type="button" data-z="out" aria-label="Zoom out">−</button><span class="cvv-zoom">100%</span><button type="button" data-z="in" aria-label="Zoom in">+</button>
        <button type="button" data-fit>Fit all</button><span class="sep"></span><button type="button" class="cvv-x">Close</button>
      </div>`;
    document.body.appendChild(ov);
    document.documentElement.classList.add('cvv-open');
    stage = ov.querySelector('.cvv-stage'); plane = ov.querySelector('.cvv-plane');
    labels = [...ov.querySelectorAll('.cvv-l')]; zoomTxt = ov.querySelector('.cvv-zoom');
    fitStart();
    requestAnimationFrame(() => ov.classList.add('on'));
    ov.querySelector('.cvv-x').addEventListener('click', close);
    ov.querySelector('[data-fit]').addEventListener('click', () => fitAll());
    ov.querySelector('[data-z="in"]').addEventListener('click', () => { const [cx, cy] = center(); zoomAt(1.4, cx, cy); });
    ov.querySelector('[data-z="out"]').addEventListener('click', () => { const [cx, cy] = center(); zoomAt(1 / 1.4, cx, cy); });
    bindPointer();
    stage.addEventListener('wheel', onWheel, { passive: false });
    stage.addEventListener('dblclick', (ev) => { if (!ev.target.closest('.cvv-f')) fitAll(); });
    addEventListener('keydown', onKey);
    addEventListener('resize', onResize);
    ov.querySelector('.cvv-x').focus({ preventScroll: true });
  }
  function close() {
    if (!ov) return;
    removeEventListener('keydown', onKey); removeEventListener('resize', onResize);
    ov.classList.remove('on');
    const o = ov; ov = null;
    setTimeout(() => o.remove(), 250);
    document.documentElement.classList.remove('cvv-open');
    if (last) last.focus({ preventScroll: true });
  }
  const onResize = () => fitAll(0);
  const onKey = (e) => {
    if (e.key === 'Escape') close();
    else if (e.key === '+' || e.key === '=') { const [cx, cy] = center(); zoomAt(1.25, cx, cy); }
    else if (e.key === '-') { const [cx, cy] = center(); zoomAt(0.8, cx, cy); }
    else if (e.key === '0') fitAll();
    else if (e.key.startsWith('Arrow') && !e.target.closest('.cvv-bar')) { const d = 80; cam.x += e.key === 'ArrowLeft' ? d : e.key === 'ArrowRight' ? -d : 0; cam.y += e.key === 'ArrowUp' ? d : e.key === 'ArrowDown' ? -d : 0; apply(); e.preventDefault(); }
  };
  function onWheel(e) {
    e.preventDefault();
    const r = stage.getBoundingClientRect();
    if (e.ctrlKey || e.metaKey) zoomAt(Math.exp(-clamp(e.deltaY, -40, 40) * 0.01), e.clientX - r.left, e.clientY - r.top);
    else { cancelAnimationFrame(anim); cam.x -= e.deltaX; cam.y -= e.deltaY; apply(); }
  }
  function bindPointer() {
    const pts = new Map(); let moved = 0, startT = null, pinch = null;
    stage.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      stage.setPointerCapture(e.pointerId);
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 1) { moved = 0; startT = e.target.closest('.cvv-f'); stage.classList.add('drag'); }
      cancelAnimationFrame(anim);
    });
    stage.addEventListener('pointermove', (e) => {
      if (!pts.has(e.pointerId)) return;
      const p = pts.get(e.pointerId), dx = e.clientX - p.x, dy = e.clientY - p.y;
      p.x = e.clientX; p.y = e.clientY;
      if (pts.size === 1) { cam.x += dx; cam.y += dy; moved += Math.abs(dx) + Math.abs(dy); apply(); }
      else if (pts.size === 2) {
        const [a, b] = [...pts.values()], r = stage.getBoundingClientRect();
        const d = Math.hypot(a.x - b.x, a.y - b.y), mx = (a.x + b.x) / 2 - r.left, my = (a.y + b.y) / 2 - r.top;
        if (pinch) { zoomAt(d / pinch.d, mx, my); cam.x += mx - pinch.mx; cam.y += my - pinch.my; apply(); }
        pinch = { d, mx, my }; moved += 10;
      }
    });
    const up = (e) => {
      if (!pts.has(e.pointerId)) return;
      pts.delete(e.pointerId);
      if (pts.size < 2) pinch = null;
      if (pts.size === 0) {
        stage.classList.remove('drag');
        if (moved < 6 && startT) { const it = items[+startT.dataset.i]; go(target({ x: it.X, y: it.Y, w: it.W, h: it.H }, 40)); }
      }
    };
    stage.addEventListener('pointerup', up);
    stage.addEventListener('pointercancel', up);
    // keyboard: Enter on a focused frame focuses it
    stage.addEventListener('click', (e) => { const f = e.target.closest('.cvv-f'); if (f && e.detail === 0) { const it = items[+f.dataset.i]; go(target({ x: it.X, y: it.Y, w: it.W, h: it.H }, 40)); } });
  }

  document.querySelectorAll('[data-open-canvas]').forEach((b) => b.addEventListener('click', open));
})();
