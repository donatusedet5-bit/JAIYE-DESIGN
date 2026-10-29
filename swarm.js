/* Portfolio v3 — the "swarm build".
   After the greeting, a crowd of coloured cursors builds the home page in front of you:
   they draw boxes with size labels, type and select the text, drop the images in and draw guides.
   Runs once per browser session (Replay is always available), never with "reduce motion". */
(() => {
  const main = document.querySelector('main[data-scan]');
  if (!main) return;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const V3 = window.V3 || { fresh: true, reduce: false };
  const body = document.body;
  const store = { get: (k) => { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {} } };
  const phone = () => innerWidth <= 640;
  const force = /[?&]build\b/.test(location.search);
  const auto = force || (V3.fresh && !V3.reduce && !store.get('v3built'));

  const COLORS = ['#F24E1E', '#A259FF', '#1ABCFE', '#0ACF83', '#FFC700', '#FF3D9A', '#7B61FF', '#00B5A5', '#FF8A00', '#3D7BFF', '#E33E6E', '#8BC34A'];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const easeIO = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };

  /* ---------------------------------------------------------------- replay button */
  const replayBtn = el('button', 'replay', '<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 8a5.5 5.5 0 1 0 1.7-4M2.5 2.5V5h2.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>Replay build');
  replayBtn.type = 'button';
  replayBtn.setAttribute('aria-label', 'Replay the page build');
  body.appendChild(replayBtn);
  replayBtn.addEventListener('click', () => { replayBtn.classList.remove('on'); run(); });

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
  const pop = () => {
    if (!soundOn || !actx) return;
    const t = actx.currentTime, o = actx.createOscillator(), g = actx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(rnd(520, 700), t); o.frequency.exponentialRampToValueAtTime(240, t + 0.08);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.06, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    o.connect(g).connect(actx.destination); o.start(t); o.stop(t + 0.14);
  };

  /* ---------------------------------------------------------------- state */
  let S = null; // one build at a time

  function run(opts = {}) {
    if (S) return;
    scrollTo(0, 0);
    body.classList.add('building');
    $$('[data-l]').forEach((n) => n.classList.remove('lb-done', 'lb-show', 'lb-drop'));
    S = build(opts);
  }

  // warm up the work screens for the scan while the greeting plays
  const preload = [];
  const warm = () => { if (preload.length) return; try { JSON.parse(main.dataset.scan).forEach((src) => { const im = new Image(); im.decoding = 'async'; im.src = src; preload.push(im); }); } catch (e) {} };
  if (auto) {
    warm();
    try { history.scrollRestoration = 'manual'; } catch (e) {}
    body.classList.add('building'); // keep the page blank under the greeting
    const go = () => run();
    if (V3.ready) go(); else document.addEventListener('v3:ready', go, { once: true });
  } else {
    const show = () => replayBtn.classList.add('on');
    if (V3.ready) show(); else document.addEventListener('v3:ready', show, { once: true });
  }

  /* ================================================================ the build */
  function build() {
    const startWall = performance.now();
    let speed = 1, tour = true, finished = false, raf = 0;
    const isPhone = phone();
    const N0 = isPhone ? 8 : 14, NMAX = isPhone ? 22 : 48;

    // preload scan images (they are small and mostly cached by now)
    let scanSrc = []; try { scanSrc = JSON.parse(main.dataset.scan); } catch (e) {}

    /* ---------- overlay ---------- */
    const sw = el('div', 'sw'); sw.setAttribute('aria-hidden', 'true');
    const doc = el('div', 'sw-layer');
    const plane = el('div'); plane.style.cssText = 'position:absolute;left:0;top:0;width:0;height:0;will-change:transform';
    doc.appendChild(plane); sw.appendChild(doc);
    body.appendChild(sw);

    // rulers
    const rTop = el('div', 'ruler top hide'), rLeft = el('div', 'ruler left hide');
    const cTop = el('canvas'), cLeft = el('canvas');
    rTop.appendChild(cTop); rLeft.appendChild(cLeft); rTop.setAttribute('aria-hidden', 'true'); rLeft.setAttribute('aria-hidden', 'true');
    body.append(rTop, rLeft);
    requestAnimationFrame(() => { rTop.classList.remove('hide'); rLeft.classList.remove('hide'); });

    // control bar
    const bar = el('div', 'bar scanning', `
      <div class="st"><span class="dots">${COLORS.slice(0, 4).map((c) => `<i style="background:${c}"></i>`).join('')}</span>
        <span class="n run-only"><b class="ag">0</b> <span>agents</span></span>
        <span class="sep run-only scan-hide build-only"></span>
        <span class="n run-only build-only"><b class="ly">0</b><span> / <span class="lt">0</span><span class="wide"> layers</span></span></span>
        <span class="n scan-txt" style="color:rgba(255,255,255,.7)">Scanning work…</span>
        <span class="n done-only">Built by&nbsp;<b class="fa">0</b>&nbsp;<span>agents in</span>&nbsp;<b class="ft">0s</b></span>
      </div>
      <span class="prog wide run-only"><i></i></span>
      <button type="button" class="tour run-only build-only" aria-pressed="true" data-tip="Auto-scroll while the swarm builds">Tour</button>
      <button type="button" class="spd run-only" aria-pressed="false" data-tip="Build speed">1x</button>
      <button type="button" class="snd" aria-pressed="false" aria-label="Sound" data-tip="Sound"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 6h2.2L8 3.2v9.6L4.7 10H2.5z" fill="currentColor"/><path class="w" d="M10.6 5.6a3.4 3.4 0 0 1 0 4.8M12.4 3.9a5.8 5.8 0 0 1 0 8.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path class="m" d="M10.5 6l4 4m0-4l-4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></button>
      <span class="sep run-only"></span>
      <button type="button" class="skip run-only" data-tip="Jump to the finished page">Skip</button>
      <button type="button" class="go done-only">Go live</button>
      <button type="button" class="rp done-only">Replay</button>`);
    bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', 'Page build');
    body.insertBefore(bar, body.firstChild);
    const style = el('style', null, `.bar .scan-txt{display:none}.bar.scanning .scan-txt{display:inline}.bar.done .scan-txt{display:none}.snd .m{display:inline}.snd .w{display:none}.snd[aria-pressed="true"] .m{display:none}.snd[aria-pressed="true"] .w{display:inline}`);
    bar.appendChild(style);
    const B = { ag: $('.ag', bar), ly: $('.ly', bar), lt: $('.lt', bar), prog: $('.prog i', bar), fa: $('.fa', bar), ft: $('.ft', bar) };
    const tourBtn = $('.tour', bar), spdBtn = $('.spd', bar), sndBtn = $('.snd', bar);
    sndBtn.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
    tourBtn.addEventListener('click', () => { tour = !tour; tourBtn.setAttribute('aria-pressed', tour); });
    spdBtn.addEventListener('click', () => { speed = speed === 1 ? 2 : 1; spdBtn.textContent = speed + 'x'; spdBtn.setAttribute('aria-pressed', speed === 2); });
    sndBtn.addEventListener('click', () => { soundOn = !soundOn; if (soundOn) ensureAudio(); sndBtn.setAttribute('aria-pressed', soundOn); });
    $('.skip', bar).addEventListener('click', () => skip());
    $('.go', bar).addEventListener('click', () => goLive());
    $('.rp', bar).addEventListener('click', () => { teardown(); S = null; run(); });

    // a person scrolling takes over from Tour
    const userScroll = () => { if (tour && !finished) { tour = false; tourBtn.setAttribute('aria-pressed', 'false'); } };
    const onKey = (e) => { if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(e.key) && !e.target.closest('.bar')) userScroll(); };
    addEventListener('wheel', userScroll, { passive: true });
    addEventListener('touchmove', userScroll, { passive: true });
    addEventListener('keydown', onKey);

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
    const layers = $$('[data-l]').filter((n) => !n.closest('[hidden]'));
    const face = $('[data-face]', main);
    const tasks = [];
    const blocks = [$('.hd', main), $('.bio', main), ...$$('section', main).filter((s) => !s.hidden), $('.ft')].filter(Boolean);
    const blockOf = (n) => blocks.find((b) => b.contains(n));
    // two vertical guides on the column edges first
    tasks.push({ type: 'gv', side: 0 }, { type: 'gv', side: 1 });
    let lastBlock = null;
    layers.forEach((n) => {
      if (n === face) return;
      const b = blockOf(n);
      if (b && b !== lastBlock) { tasks.push({ type: 'gh', block: b }); lastBlock = b; }
      tasks.push({ type: n.dataset.l === 'i' ? 'img' : 'text', node: n });
    });
    const measureTasks = () => tasks.forEach((t) => {
      if (t.node) t.r = rectOf(t.node);
      else if (t.type === 'gh') { const r = rectOf(t.block); t.r = { x: 0, y: r.y - 14, w: vw, h: 1 }; }
      else t.r = { x: t.side ? colR : colL, y: scrollY, w: 1, h: 1 };
      // things scrolled out of sight sideways (cards further along the rail) appear without an agent
      t.instant = !!t.node && (t.r.x > vw + scrollX - 8 || t.r.x + t.r.w < scrollX + 8 || t.r.w < 1 || t.r.h < 1);
    });
    measureTasks();
    tasks.forEach((t) => { t.state = 0; }); // 0 waiting, 1 assigned, 2 done
    const total = tasks.length + 1; // +1 for the avatar the face lands on
    let doneCount = 0;
    B.lt.textContent = total;

    /* ---------- cursors ---------- */
    const agents = [];
    const cursorSvg = (c) => `<svg viewBox="0 0 14 14"><path d="M1.5 1.2 L1.5 11.8 L4.4 9.1 L6.5 13.2 L8.4 12.3 L6.4 8.3 L10.6 8.3 Z" fill="${c}" stroke="#fff" stroke-width="1" stroke-linejoin="round"/></svg>`;
    const spawn = (fromEdge = true, near = null) => {
      const c = COLORS[agents.length % COLORS.length];
      const n = el('div', 'cur', cursorSvg(c));
      plane.appendChild(n);
      let x, y;
      if (fromEdge) {
        const side = Math.floor(Math.random() * 4), sy = scrollY;
        x = side === 0 ? -20 : side === 1 ? vw + 20 : rnd(0, vw);
        y = sy + (side === 2 ? -20 : side === 3 ? vh + 20 : rnd(0, vh));
      } else { x = near.x; y = near.y; }
      const a = { el: n, x, y, vx: 0, vy: 0, tx: x, ty: y, task: null, ph: 0, pt: 0, wander: 0, lock: false, k: rnd(45, 75) };
      agents.push(a);
      return a;
    };
    const place = (a) => { a.el.style.transform = `translate3d(${a.x - 1.5}px,${a.y - 1.2}px,0)`; };
    const springTo = (a, dt) => {
      const k = a.k, c = 2 * Math.sqrt(k) * 0.85;
      a.vx += ((a.tx - a.x) * k - a.vx * c) * dt; a.vy += ((a.ty - a.y) * k - a.vy * c) * dt;
      a.x += a.vx * dt; a.y += a.vy * dt;
    };

    /* ---------- selection boxes, guides ---------- */
    const mkSel = (ph) => { const s = el('div', 'sel' + (ph ? ' ph' : ''), '<i></i><i></i><i></i><i></i><em></em>'); plane.appendChild(s); return s; };
    const setSel = (s, x, y, w, h) => { s.style.transform = `translate3d(${x}px,${y}px,0)`; s.style.width = Math.max(1, w) + 'px'; s.style.height = Math.max(1, h) + 'px'; s.lastChild.textContent = `${Math.round(w)} × ${Math.round(h)}`; };
    const fadeSel = (s) => { s.classList.add('out'); setTimeout(() => s.remove(), 300); };
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
    const complete = (t) => { if (t.state === 2) return; t.state = 2; finishNode(t); doneCount++; if (t.sel) { fadeSel(t.sel); t.sel = null; } };

    /* ---------- ruler drawing ---------- */
    let hl = null; // highlighted span on rulers {x,y,w,h}
    const dpr = Math.min(2, devicePixelRatio || 1);
    const sizeCanvas = () => {
      const tw = rTop.clientWidth, th = rTop.clientHeight, lw = rLeft.clientWidth, lh = rLeft.clientHeight;
      cTop.width = tw * dpr; cTop.height = th * dpr; cLeft.width = lw * dpr; cLeft.height = lh * dpr;
    };
    sizeCanvas();
    const drawRulers = () => {
      const ct = cTop.getContext('2d'), cl = cLeft.getContext('2d');
      const tw = cTop.width / dpr, th = cTop.height / dpr, lw = cLeft.width / dpr, lh = cLeft.height / dpr;
      const sx = scrollX, sy = scrollY;
      ct.setTransform(dpr, 0, 0, dpr, 0, 0); ct.clearRect(0, 0, tw, th);
      cl.setTransform(dpr, 0, 0, dpr, 0, 0); cl.clearRect(0, 0, lw, lh);
      ct.font = '500 9px "Hanken Grotesk", system-ui, sans-serif'; cl.font = ct.font;
      if (hl) {
        ct.fillStyle = 'rgba(13,153,255,.16)'; ct.fillRect(hl.x - sx, 0, hl.w, th);
        cl.fillStyle = 'rgba(13,153,255,.16)'; cl.fillRect(0, hl.y - sy, lw, hl.h);
      }
      ct.fillStyle = '#9A9BA0'; cl.fillStyle = '#9A9BA0';
      // x origin at the column's left edge, y origin at the top of the page
      const step = 10, o = colL;
      for (let x = Math.floor((sx - o) / step) * step; x + o - sx < tw; x += step) {
        const px = x + o - sx; const major = x % 100 === 0;
        ct.fillRect(px, major ? th - 8 : th - 4, 1, major ? 8 : 4);
        if (major && !isPhone) ct.fillText(String(x), px + 3, 9);
      }
      for (let y = Math.floor(sy / step) * step; y - sy < lh; y += step) {
        const py = y - sy; const major = y % 100 === 0;
        cl.fillRect(major ? lw - 8 : lw - 4, py, major ? 8 : 4, 1);
        if (major && !isPhone) { cl.save(); cl.translate(9, py + 3); cl.rotate(-Math.PI / 2); cl.textAlign = 'right'; cl.fillText(String(y), 0, 0); cl.restore(); }
      }
      if (hl) {
        ct.fillStyle = '#0D99FF'; ct.fillRect(hl.x - sx, th - 2, hl.w, 2);
        cl.fillStyle = '#0D99FF'; cl.fillRect(lw - 2, hl.y - sy, 2, hl.h);
      }
    };

    /* ---------- phase timings (ms at 1x) ---------- */
    const T = { draw: 480, drawImg: 700, drop: 620, select: 380, guideV: 1500, guideH: 900, typeMin: 380, typeMax: 2300, perChar: 26 };

    /* ---------- scan intro ---------- */
    let phase = 'scan', pt = 0; // phase time
    const scan = el('div', 'scan', '<div class="shots"></div>');
    const shots = $('.shots', scan);
    warm();
    // flick only through screens that are ready, so no frame is ever blank
    const ready = preload.filter((im) => im.complete && im.naturalWidth);
    (ready.length >= 4 ? ready : preload).forEach((im, i) => { const c = el('img'); c.src = im.src; c.alt = ''; if (i === 0) c.className = 'on'; shots.appendChild(c); });
    body.appendChild(scan);
    const faceEl = el('img', 'face'); faceEl.src = face.currentSrc || face.src; faceEl.alt = '';
    body.appendChild(faceEl);
    let faceX = vw / 2 - 36, faceY = vh * 0.46 - 36, faceS = 1;
    const placeFace = () => { faceEl.style.transform = `translate3d(${faceX}px,${faceY}px,0) scale(${faceS})`; faceEl.style.transformOrigin = '0 0'; };
    placeFace();
    faceEl.animate([{ opacity: 0, transform: `translate3d(${faceX}px,${faceY}px,0) scale(.6)` }, { opacity: 1, transform: `translate3d(${faceX}px,${faceY}px,0) scale(1)` }], { duration: 380, easing: 'cubic-bezier(.2,.8,.2,1)' });
    for (let i = 0; i < N0; i++) spawn(true);
    let shotI = 0, shotT = 0, flightFrom = null, flightTo = null;
    const SCAN_FLICK = 1500, SCAN_GATHER = 650, SCAN_FLY = 700;

    const scanStep = (dt, ms) => {
      pt += ms;
      const cx = vw / 2, cy = scrollY + vh * 0.46;
      if (pt < SCAN_FLICK) {
        shotT += ms;
        if (shotT > 85 && shots.children.length) { shotT = 0; shots.children[shotI].className = ''; shotI = (shotI + 1) % shots.children.length; shots.children[shotI].className = 'on'; tick(performance.now()); }
        // cursors circle the work, loosely
        agents.forEach((a, i) => {
          a.wander -= ms;
          if (a.wander <= 0) { const ang = rnd(0, Math.PI * 2), rad = rnd(isPhone ? 90 : 130, isPhone ? 170 : 260); a.tx = cx + Math.cos(ang) * rad; a.ty = cy + Math.sin(ang) * rad * 0.7; a.wander = rnd(300, 700); }
          springTo(a, dt); place(a);
        });
      } else if (pt < SCAN_FLICK + SCAN_GATHER) {
        if (!scan.classList.contains('done')) scan.classList.add('done');
        // gather tight around the face
        agents.forEach((a, i) => {
          const ang = (i / agents.length) * Math.PI * 2 + pt / 900, rad = 46 + (i % 3) * 10;
          a.tx = cx + Math.cos(ang) * rad; a.ty = cy + Math.sin(ang) * rad;
          springTo(a, dt); place(a);
        });
      } else {
        if (!flightFrom) {
          const r = face.getBoundingClientRect();
          flightFrom = { x: faceX, y: faceY, s: 1 }; flightTo = { x: r.left, y: r.top, s: r.width / 72 };
          bar.classList.remove('scanning');
        }
        const p = clamp((pt - SCAN_FLICK - SCAN_GATHER) / SCAN_FLY, 0, 1), e = easeIO(p);
        faceX = lerp(flightFrom.x, flightTo.x, e); faceY = lerp(flightFrom.y, flightTo.y, e) - Math.sin(p * Math.PI) * 40; faceS = lerp(1, flightTo.s, e);
        placeFace();
        // three cursors carry the face, the rest spread out
        agents.forEach((a, i) => {
          if (i < 3) { a.tx = faceX + 72 * faceS * (i === 0 ? 1.05 : i === 1 ? -0.1 : 0.5); a.ty = scrollY + faceY + 72 * faceS * (i === 2 ? 1.1 : 0.2); }
          else { a.wander -= ms; if (a.wander <= 0) { a.tx = rnd(40, vw - 40); a.ty = scrollY + rnd(60, vh * 0.8); a.wander = rnd(400, 900); } }
          springTo(a, dt); place(a);
        });
        if (p >= 1) {
          face.classList.add('lb-done'); faceEl.remove(); scan.remove(); doneCount++; pop();
          phase = 'build'; pt = 0;
          agents.forEach((a) => (a.wander = 0));
        }
      }
    };

    /* ---------- build loop ---------- */
    let nextIdx = 0, buildT = 0, camY = scrollY;
    const expected = isPhone ? 26000 : 28000;
    const frontTop = () => { for (let i = 0; i < tasks.length; i++) if (tasks[i].state !== 2) return tasks[i].r.y; return docH; };

    const startTask = (a, t) => {
      a.task = t; t.state = 1; a.ph = 0; a.pt = 0; t.agent = a;
      if (t.type === 'text' || t.type === 'img') { a.tx = t.r.x; a.ty = t.r.y; }
      else if (t.type === 'gv') { a.tx = t.r.x; a.ty = scrollY + 12; }
      else { a.tx = 6; a.ty = t.r.y; }
    };

    const workStep = (a, dt, ms) => {
      const t = a.task, r = t.r;
      if (a.ph === 0) { // travel
        springTo(a, dt); a.pt += ms;
        if (Math.hypot(a.tx - a.x, a.ty - a.y) < 5 || a.pt > 900) { a.x = a.tx; a.y = a.ty; a.vx = a.vy = 0; a.ph = 1; a.pt = 0;
          if (t.type === 'text' || t.type === 'img') { t.sel = mkSel(t.type === 'img'); setSel(t.sel, r.x, r.y, 0, 0); hl = r; }
          else if (t.type === 'gv') { t.g = mkGuide(true); t.g.style.left = r.x + 'px'; t.g.style.height = '0px'; t.y0 = scrollY; t.g.style.top = t.y0 + 'px'; }
          else { t.g = mkGuide(false); t.g.style.top = r.y + 'px'; t.g.style.width = '0px'; }
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
      if (a.ph === 1) { // draw the box
        const dur = t.type === 'img' ? T.drawImg : T.draw, p = ease(clamp(a.pt / dur, 0, 1));
        setSel(t.sel, r.x, r.y, r.w * p, r.h * p); a.x = r.x + r.w * p; a.y = r.y + r.h * p;
        if (p >= 1) { a.ph = 2; a.pt = 0; if (t.type === 'text') { wrapText(t); if (!t.spans.length) a.ph = 3; } else { t.node.classList.add('lb-show', 'lb-drop'); t.sel.classList.remove('ph'); pop(); } }
        return;
      }
      if (t.type === 'img') { // drop the picture in, then let go
        const p = clamp(a.pt / T.drop, 0, 1);
        a.tx = r.x + r.w * 0.55; a.ty = r.y + r.h * 0.5; springTo(a, dt);
        if (p >= 1) { complete(t); release(a); }
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
      if (a.ph === 3) { // select it, then let go
        if (a.pt >= T.select) { complete(t); release(a); }
      }
    };
    const release = (a) => { a.task = null; a.wander = 0; };

    const buildStep = (dt, ms) => {
      buildT += ms;
      // more agents join as the build goes on
      const want = Math.round(lerp(N0, NMAX, clamp(buildT / (expected * 0.55), 0, 1)));
      while (agents.length < want) spawn(true);
      // hand out work to idle agents, in page order, near the build front
      const ft = frontTop();
      const span = vh * (isPhone ? 0.62 : 0.55);
      for (const a of agents) {
        if (a.task) continue;
        while (nextIdx < tasks.length && tasks[nextIdx].state !== 0) nextIdx++;
        if (nextIdx >= tasks.length) break;
        const t = tasks[nextIdx];
        if (t.instant) { complete(t); continue; }
        if (t.r.y > ft + span) break;
        startTask(a, t);
      }
      // skip-ahead for instant tasks sitting at the front
      for (let i = nextIdx; i < tasks.length && tasks[i].instant && tasks[i].state === 0; i++) complete(tasks[i]);

      for (const a of agents) {
        if (a.task) workStep(a, dt, ms);
        else { // idle: hover near the action
          a.wander -= ms;
          if (a.wander <= 0) { a.tx = rnd(isPhone ? 24 : colL - 220, isPhone ? vw - 24 : colR + 220); a.ty = clamp(ft + rnd(-vh * 0.2, vh * 0.6), scrollY + 40, scrollY + vh - 70); a.wander = rnd(500, 1400); }
          springTo(a, dt);
        }
        place(a);
      }
      // camera
      if (tour) {
        const max = document.documentElement.scrollHeight - vh;
        const target = clamp(ft - vh * 0.26, 0, max);
        camY = lerp(scrollY, target, 1 - Math.exp(-dt * 2.6));
        if (Math.abs(camY - scrollY) > 0.5) scrollTo(0, camY);
      }
      if (doneCount >= total) finish(false);
    };

    /* ---------- frame ---------- */
    let last = performance.now();
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const real = Math.min(50, now - last); last = now;
      const ms = real * speed, dt = ms / 1000;
      if (phase === 'scan') scanStep(dt, ms);
      else if (phase === 'build') buildStep(dt, ms);
      else if (phase === 'leave') leaveStep(dt, ms);
      plane.style.transform = `translate3d(${-scrollX}px,${-scrollY}px,0)`;
      if (phase !== 'gone') drawRulers();
      B.ag.textContent = agents.length;
      B.ly.textContent = doneCount;
      B.prog.style.transform = `scaleX(${doneCount / total})`;
    };
    raf = requestAnimationFrame(frame);

    /* ---------- resize ---------- */
    let rz = 0;
    const onResize = () => { clearTimeout(rz); rz = setTimeout(() => { measureCol(); sizeCanvas(); tasks.forEach((t) => { if (t.state !== 2 && t.node && t.html == null) t.r = rectOf(t.node); }); }, 120); };
    addEventListener('resize', onResize);

    /* ---------- the end ---------- */
    let leaveT = 0;
    function finish(skipped) {
      if (finished) return; finished = true;
      tasks.forEach((t) => { if (t.state !== 2) complete(t); });
      if (!face.classList.contains('lb-done')) { face.classList.add('lb-done'); }
      faceEl.remove(); scan.remove();
      $$('.sel', plane).forEach((s) => s.remove());
      body.classList.remove('building');
      store.set('v3built', '1');
      // cursors swarm away
      phase = 'leave'; leaveT = 0;
      const cx = vw / 2, cy = scrollY + vh / 2;
      agents.forEach((a) => { const ang = Math.atan2(a.y - cy, a.x - cx) + rnd(-.4, .4), d = Math.max(vw, vh) * rnd(0.9, 1.3); a.tx = cx + Math.cos(ang) * d; a.ty = cy + Math.sin(ang) * d; a.k = rnd(18, 34); a.wander = rnd(0, 350); });
      guides.forEach((g) => g.classList.add('fade'));
      rTop.classList.add('hide'); rLeft.classList.add('hide');
      const secs = (performance.now() - startWall) / 1000;
      B.fa.textContent = agents.length; B.ft.textContent = secs.toFixed(1) + 's';
      bar.classList.remove('scanning'); bar.classList.add('done');
      B.prog.style.transform = 'scaleX(1)';
    }
    function leaveStep(dt, ms) {
      leaveT += ms;
      agents.forEach((a) => { if (leaveT > a.wander) springTo(a, dt); place(a); });
      if (leaveT > 2600) { phase = 'gone'; agents.forEach((a) => a.el.remove()); agents.length = 0; sw.style.display = 'none'; }
    }
    function skip() { scrollTo(0, 0); finish(true); }
    function goLive() { if (scrollY > 40) scrollTo({ top: 0, behavior: "smooth" }); bar.classList.add("hide"); setTimeout(teardown, 400); replayBtn.classList.add('on'); S = null; }
    function teardown() {
      cancelAnimationFrame(raf);
      removeEventListener('wheel', userScroll); removeEventListener('touchmove', userScroll); removeEventListener('keydown', onKey); removeEventListener('resize', onResize);
      sw.remove(); bar.remove(); rTop.remove(); rLeft.remove(); faceEl.remove(); scan.remove();
      if (!finished) { tasks.forEach((t) => finishNode(t)); body.classList.remove('building'); }
    }
    return { skip, finish, goLive };
  }
})();
