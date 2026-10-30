/* Home sections: How we'd work together (a playable flow), Questions founders ask,
   and Design systems (live components rebuilt from Jaiye's own system sheets). */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const body = document.body;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const building = () => body.classList.contains('building');
  // run fn each time the page stops building (build end, Skip, or never built)
  const afterBuild = [];
  new MutationObserver(() => { if (!building()) afterBuild.forEach((f) => f()); }).observe(body, { attributes: true, attributeFilter: ['class'] });

  /* ============================================================ the flow */
  const flow = $('.flow');
  if (flow) {
    const steps = $$('.pstep', flow);
    const row = $('.steps', flow);
    const btn = $('.play', flow);
    // on phones the flow is a swipeable row: keep the step that is playing in view
    const reveal = (s) => {
      if (row.scrollWidth <= row.clientWidth + 4) return;
      row.scrollTo({ left: s.offsetLeft - row.offsetLeft - 16, behavior: RM ? 'auto' : 'smooth' });
    };
    let timers = [];
    let played = false;
    const stop = () => { timers.forEach(clearTimeout); timers = []; flow.classList.remove('running'); steps.forEach((s) => s.classList.remove('on', 'done')); };
    const play = () => {
      stop();
      played = true;
      if (RM) { steps.forEach((s) => s.classList.add('done')); timers.push(setTimeout(stop, 2200)); return; }
      flow.classList.add('running');
      steps.forEach((s, i) => timers.push(setTimeout(() => {
        steps.forEach((x, j) => { x.classList.toggle('on', j === i); x.classList.toggle('done', j < i); });
        reveal(s);
      }, 250 + i * 900)));
      timers.push(setTimeout(() => { stop(); reveal(steps[0]); }, 250 + steps.length * 900 + 1400));
    };
    btn.addEventListener('click', play);
    // a swipe takes over from the autoplay
    row.addEventListener('pointerdown', () => { if (flow.classList.contains('running')) stop(); }, { passive: true });
    // plays once by itself the first time it is properly in view, never while the page is building
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((en) => {
        if (played || building() || !en[0].isIntersecting) return;
        io.disconnect(); play();
      }, { threshold: 0.6 });
      io.observe($('.steps', flow));
      afterBuild.push(() => { if (!played) { io.disconnect(); io.observe($('.steps', flow)); } });
    }
  }

  /* ============================================================ the FAQ */
  // exclusive accordion where the browser lacks <details name> grouping
  const qas = $$('.qa');
  qas.forEach((d) => d.addEventListener('toggle', () => { if (d.open) qas.forEach((o) => { if (o !== d && o.open) o.open = false; }); }));

  /* ======================================================= design systems */
  const dsw = $('.dsw');
  if (!dsw) return;
  const assets = $('.ds-assets', dsw), stage = $('.ds-stage', dsw), inst = $('.ds-inst', dsw), pathEl = $('.ds-path', dsw), selbox = $('.ds-selbox', dsw), props = $('.ds-props', dsw);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Values below are taken from the Staza and Touchline system sheets in the project pages.
  const SF = "'Geist', 'Hanken Grotesk', system-ui, sans-serif";
  const TF = "'Familjen Grotesk', 'Hanken Grotesk', system-ui, sans-serif";
  const TN = "'Big Shoulders Display', 'Hanken Grotesk', system-ui, sans-serif";
  const ico = {
    search: '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.6" fill="none" stroke="#5F6B66" stroke-width="1.5"/><path d="M10.4 10.4L14 14" stroke="#5F6B66" stroke-width="1.5" stroke-linecap="round"/></svg>',
    lock: '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="2.5" y="6" width="9" height="6.2" rx="1.6" fill="none" stroke="#A9F0C0" stroke-width="1.4"/><path d="M4.6 6V4.4a2.4 2.4 0 014.8 0V6" fill="none" stroke="#A9F0C0" stroke-width="1.4"/></svg>',
  };
  const dot = (c) => `<i style="width:6px;height:6px;border-radius:50%;background:${c};flex:none"></i>`;

  const SB = { Primary: ['#0B3D2E', '#FFFFFF', 'Buy with Protected Pay'], Secondary: ['#E3F3EA', '#0B3D2E', 'Add to cart'], Accent: ['#A9F0C0', '#0B3D2E', 'Withdraw'], Outline: ['#FFFFFF', '#0E1512', 'Track order', '#DCE5E0'], Danger: ['#FFFFFF', '#D9503F', 'Something is wrong', '#F0DAD6'] };
  const SP = { 'Protected Pay': ['#A9F0C0', '#0B3D2E', '#0F5A41'], Held: ['#A9F0C0', '#0B3D2E', '#0F5A41'], Released: ['#E3F3EA', '#0F5A41', '#0F5A41'], 'In review': ['#FCF0DC', '#8A5A14', '#E8A33D'], Dispute: ['#FBE7E3', '#B23E2F', '#D9503F'], Verified: ['#1A8F5F', '#FFFFFF', null] };
  const TB = { Primary: ['#FF5A1F', '#FFFFFF', 'Kick off'], Outline: ['#FFFFFF', '#0F1B2D', 'Offer new deal', '#0F1B2D'], Dark: ['#0F1B2D', '#FFFFFF', 'Continue'] };
  const TP = { GK: '#C99613', DEF: '#316FD3', MID: '#1F9D55', FWD: '#FF5A1F' };
  const TFm = { W: '#1F9D55', D: '#9AA3AE', L: '#E5383B' };
  const TR = { '8.9': '#1F9D55', '7.6': '#0F1B2D', '5.9': '#E5383B' };

  const LIBS = [
    {
      id: 'staza', name: 'Staza', kind: 'E-commerce', href: '/work/staza', font: 'Geist',
      tokens: [['Forest', '#0B3D2E', 'brand/green-900'], ['Pine', '#0F5A41', 'brand/green-700'], ['Leaf', '#1A8F5F', 'brand/green-500'], ['Mint 100', '#E3F3EA', 'brand/green-100'], ['Mint', '#A9F0C0', 'accent/mint'], ['Ink', '#0E1512', 'text/ink'], ['Muted', '#5F6B66', 'text/muted'], ['Paper', '#F4F7F5', 'surface/paper'], ['Danger', '#D9503F', 'status/danger'], ['Warning', '#E8A33D', 'status/warning']],
      comps: [
        {
          id: 'button', name: 'Button', prop: 'Variant', opts: Object.keys(SB),
          render: (v) => { const [bg, fg, t, bd] = SB[v]; return `<button type="button" class="c" style="background:${bg};color:${fg};border-radius:999px;padding:13px 24px;font:600 14px/1 ${SF};white-space:nowrap;${bd ? `box-shadow:inset 0 0 0 1px ${bd};` : ''}">${t}</button>`; },
          spec: (v) => [['Fill', SB[v][0]], ['Text', SB[v][1]], ['Radius', 'radius/pill · 999'], ['Font', 'Geist SemiBold']],
        },
        {
          id: 'pill', name: 'Status pill', prop: 'Status', opts: Object.keys(SP),
          render: (v) => { const [bg, fg, d] = SP[v]; return `<span class="c" style="display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border-radius:999px;background:${bg};color:${fg};font:600 12.5px/1 ${SF};white-space:nowrap">${d ? dot(d) : ''}${esc(v)}</span>`; },
          spec: (v) => [['Fill', SP[v][0]], ['Text', SP[v][1]], ['Radius', 'radius/pill · 999'], ['Font', 'Geist SemiBold']],
          zoom: 1.4,
        },
        {
          id: 'search', name: 'Search field', prop: 'State', opts: ['Default', 'Focused'],
          render: (v) => `<label class="c" style="display:flex;align-items:center;gap:10px;width:290px;padding:9px 9px 9px 14px;background:#fff;border-radius:14px;box-shadow:inset 0 0 0 ${v === 'Focused' ? '1.5px #1A8F5F' : '1px #DCE5E0'};font:400 14px/1.2 ${SF};color:#0E1512;cursor:text">${ico.search}<input type="text" placeholder="Search or snap a photo" aria-label="Search field demo" style="all:unset;flex:1;min-width:0;font:inherit;color:inherit"><span style="padding:6px 9px;border-radius:999px;background:#E3F3EA;color:#0F5A41;font:600 11px/1 ${SF}">Photo</span></label>`,
          update: (el, v) => { el.style.boxShadow = `inset 0 0 0 ${v === 'Focused' ? '1.5px #1A8F5F' : '1px #DCE5E0'}`; },
          wire: (el, set) => { const i = $('input', el); i.addEventListener('focus', () => set('Focused')); i.addEventListener('blur', () => set('Default')); },
          spec: (v) => [['Fill', '#FFFFFF'], ['Stroke', v === 'Focused' ? '#1A8F5F' : '#DCE5E0'], ['Radius', 'radius/md · 14'], ['Font', 'Geist Regular']],
          hint: 'Try typing in it',
        },
        {
          id: 'card', name: 'Card', prop: 'Variant', opts: ['Balance', 'Notice', 'Promise'],
          render: (v) => v === 'Balance'
            ? `<div class="c" style="width:240px;padding:16px 16px 14px;background:#fff;border-radius:14px;box-shadow:0 0 0 1px #DCE5E0;color:#0E1512;font-family:${SF}"><div style="display:flex;justify-content:space-between;align-items:center;font:400 12px/1 ${SF};color:#5F6B66">Held in Protected Pay<span style="padding:4px 8px;border-radius:999px;background:#A9F0C0;color:#0B3D2E;font:600 10.5px/1 ${SF}">9 orders</span></div><div style="margin:16px 0 10px;font:600 28px/1 ${SF};letter-spacing:-.02em">₦412,000</div><div style="font:400 11.5px/1.3 ${SF};color:#5F6B66">Releases as buyers confirm</div></div>`
            : v === 'Notice'
              ? `<div class="c" style="width:260px;display:flex;align-items:center;gap:12px;padding:12px 14px;background:#A9F0C0;border-radius:14px;color:#0B3D2E;font-family:${SF}"><span style="flex:none;width:32px;height:32px;border-radius:50%;background:#0B3D2E;display:grid;place-items:center">${ico.lock}</span><span><b style="display:block;font:600 13px/1.3 ${SF}">₦50,000 held safely</b><span style="display:block;font:400 11.5px/1.35 ${SF};opacity:.8">Released only when you confirm</span></span></div>`
              : `<div class="c" style="width:250px;padding:14px 16px 16px;background:#0B3D2E;border-radius:14px;color:#fff;font-family:${SF}"><span style="display:inline-flex;align-items:center;gap:5px;padding:4px 8px;border-radius:999px;background:#A9F0C0;color:#0B3D2E;font:600 10.5px/1 ${SF}">${dot('#0F5A41')}Protected Pay</span><p style="margin:10px 0 0;font:600 17px/1.22 ${SF};letter-spacing:-.01em">Pay now. We hold it until it arrives right.</p></div>`,
          spec: (v) => [['Fill', v === 'Balance' ? '#FFFFFF' : v === 'Notice' ? '#A9F0C0' : '#0B3D2E'], ['Radius', 'radius/md · 14'], ['Font', 'Geist SemiBold · Regular']],
        },
      ],
    },
    {
      id: 'touchline', name: 'Touchline', kind: 'Mobile game', href: '/work/touchline', font: 'Familjen Grotesk · Big Shoulders',
      tokens: [['Ink', '#0F1B2D', 'Text, dark surfaces'], ['Ink 2', '#18273F', 'Raised dark panels'], ['Paper', '#F3F4F0', 'App background'], ['Line', '#E1E4DD', 'Borders, tracks'], ['Flare', '#FF5A1F', 'Primary action, your club'], ['Win', '#1F9D55', 'Wins, good form'], ['Draw', '#9AA3AE', 'Draws, neutral'], ['Loss', '#E5383B', 'Losses, risk'], ['Gold', '#E8B22B', 'Captain, awards'], ['Pitch', '#1D6F47', 'Tactics, live match']],
      comps: [
        {
          id: 'tbutton', name: 'Button', prop: 'Variant', opts: Object.keys(TB),
          render: (v) => { const [bg, fg, t, bd] = TB[v]; return `<button type="button" class="c" style="width:200px;padding:15px 0;border-radius:6px;background:${bg};color:${fg};font:600 14px/1 ${TF};${bd ? `box-shadow:inset 0 0 0 1.5px ${bd};` : ''}">${t}</button>`; },
          spec: (v) => [['Fill', TB[v][0]], ['Text', TB[v][1]], ['Font', 'Familjen Grotesk SemiBold']],
        },
        {
          id: 'pos', name: 'Position chip', prop: 'Position', opts: Object.keys(TP),
          render: (v) => `<span class="c" style="display:inline-block;min-width:44px;padding:6px 10px;border-radius:5px;background:${TP[v]};color:#fff;font:700 12px/1 ${TF};letter-spacing:.05em;text-align:center">${v}</span>`,
          spec: (v) => [['Fill', TP[v]], ['Text', '#FFFFFF'], ['Font', 'Familjen Grotesk Bold']],
          zoom: 1.8,
        },
        {
          id: 'form', name: 'Form', prop: 'Result', opts: Object.keys(TFm),
          render: (v) => `<span class="c" style="display:inline-grid;place-items:center;width:28px;height:30px;border-radius:5px;background:${TFm[v]};box-shadow:inset 0 0 0 2px rgba(255,255,255,.92);color:#fff;font:800 18px/1 ${TN}">${v}</span>`,
          spec: (v) => [['Fill', TFm[v]], ['Text', '#FFFFFF'], ['Font', 'Big Shoulders ExtraBold']],
          zoom: 2,
        },
        {
          id: 'rating', name: 'Match rating', prop: 'Rating', opts: Object.keys(TR),
          render: (v) => `<span class="c" style="display:inline-block;padding:6px 9px 5px;border-radius:6px;background:${TR[v]};color:#fff;font:800 24px/1 ${TN}">${v}</span>`,
          spec: (v) => [['Fill', TR[v]], ['Text', '#FFFFFF'], ['Font', 'Big Shoulders ExtraBold']],
          zoom: 1.7,
        },
        {
          id: 'toggle', name: 'Toggle', prop: 'State', opts: ['On', 'Off'],
          render: (v) => `<button type="button" class="c" role="switch" aria-checked="${v === 'On'}" aria-label="Toggle demo" style="position:relative;width:38px;height:22px;border-radius:999px;background:${v === 'On' ? '#1F9D55' : '#E1E4DD'};transition:background .2s"><i style="position:absolute;top:2px;left:${v === 'On' ? 18 : 2}px;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(15,27,45,.25);transition:left .2s"></i></button>`,
          update: (el, v) => { el.setAttribute('aria-checked', v === 'On'); el.style.background = v === 'On' ? '#1F9D55' : '#E1E4DD'; el.firstElementChild.style.left = (v === 'On' ? 18 : 2) + 'px'; },
          wire: (el, set) => el.addEventListener('click', () => set(el.getAttribute('aria-checked') === 'true' ? 'Off' : 'On')),
          spec: (v) => [['Fill', v === 'On' ? '#1F9D55' : '#E1E4DD'], ['Knob', '#FFFFFF'], ['Radius', 'Full']],
          zoom: 2, hint: 'Tap it',
        },
        {
          id: 'seg', name: 'Segmented control', prop: 'Selected', opts: ['Defend', 'Balanced', 'Attack'],
          render: (v) => `<div class="c" role="radiogroup" aria-label="Segmented control demo" style="display:inline-flex;padding:3px;border-radius:999px;background:#fff;box-shadow:inset 0 0 0 1px #E1E4DD;font:600 13px/1 ${TF}">${['Defend', 'Balanced', 'Attack'].map((o) => `<button type="button" role="radio" data-o="${o}" aria-checked="${o === v}" style="padding:10px 18px;border-radius:999px;color:${o === v ? '#fff' : '#0F1B2D'};background:${o === v ? '#0F1B2D' : 'transparent'};transition:background .2s,color .2s">${o}</button>`).join('')}</div>`,
          update: (el, v) => $$('button', el).forEach((b) => { const on = b.dataset.o === v; b.setAttribute('aria-checked', on); b.style.background = on ? '#0F1B2D' : 'transparent'; b.style.color = on ? '#fff' : '#0F1B2D'; }),
          wire: (el, set) => el.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) set(b.dataset.o); }),
          spec: () => [['Track', '#FFFFFF'], ['Selected', '#0F1B2D'], ['Stroke', '#E1E4DD'], ['Font', 'Familjen Grotesk SemiBold']],
          hint: 'Tap an option',
        },
        {
          id: 'token', name: 'Player token', prop: 'Side', opts: ['Your club', 'Opponent'],
          render: (v) => { const you = v === 'Your club'; return `<div class="c" style="display:grid;place-items:center;width:240px;height:130px;border-radius:12px;background:#1D6F47;font-family:${TF}"><span style="display:grid;justify-items:center;gap:7px"><b style="display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:${you ? '#FF5A1F' : '#FFFFFF'};color:${you ? '#FFFFFF' : '#0F1B2D'};font:800 18px/1 ${TN};${you ? 'box-shadow:0 0 0 5px rgba(255,90,31,.32);' : ''}">${you ? 17 : 8}</b><span style="color:#fff;font:600 11px/1 ${TF}">${you ? 'Adeyemi' : 'Asante'}</span></span></div>`; },
          spec: (v) => [['Token', v === 'Your club' ? '#FF5A1F' : '#FFFFFF'], ['Pitch', '#1D6F47'], ['Number', 'Big Shoulders ExtraBold']],
        },
      ],
    },
  ];

  /* ---------- fonts for the two systems, fetched only when the section gets near ---------- */
  let fontsIn = false;
  const loadFonts = () => {
    if (fontsIn) return; fontsIn = true;
    ['Geist:wght@400;600', 'Familjen+Grotesk:wght@400;600;700', 'Big+Shoulders+Display:wght@800'].forEach((f) => {
      const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = `https://fonts.googleapis.com/css2?family=${f}&display=swap`; document.head.appendChild(l);
    });
    if (document.fonts) document.fonts.addEventListener('loadingdone', () => measure());
  };
  if ('IntersectionObserver' in window) {
    const fio = new IntersectionObserver((en) => { if (en[0].isIntersecting) { fio.disconnect(); loadFonts(); } }, { rootMargin: '900px 0px' });
    fio.observe(dsw);
  } else loadFonts();

  /* ---------- assets panel ---------- */
  assets.innerHTML = LIBS.map((L) => `<div class="ds-lib"><p class="ds-lh"><b>${L.name}</b><span>${L.kind}</span></p><ul>${L.comps.map((c) => `<li><button type="button" data-c="${L.id}:${c.id}" aria-pressed="false"><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1l5 5-5 5-5-5z" fill="none" stroke="currentColor" stroke-width="1.3"/></svg><span>${c.name}</span></button></li>`).join('')}</ul></div>`).join('');

  const state = {};
  let cur = null; // { L, c }
  const nameOf = (L, hex) => { const t = L.tokens.find((x) => x[1].toUpperCase() === String(hex).toUpperCase()); return t ? t[0] : null; };

  const measure = () => {
    const el = $('.c', inst);
    if (!el || !stage.offsetParent) { selbox.style.opacity = 0; return; }
    const sr = stage.getBoundingClientRect(), r = el.getBoundingClientRect();
    if (!r.width) return;
    Object.assign(selbox.style, { opacity: 1, left: (r.left - sr.left) + 'px', top: (r.top - sr.top) + 'px', width: r.width + 'px', height: r.height + 'px' });
    $('b', selbox).textContent = `${Math.round(el.offsetWidth)} × ${Math.round(el.offsetHeight)}`;
  };

  const propsHTML = () => {
    const { L, c } = cur, v = state[c.id];
    const rows = c.spec(v).map(([k, val]) => {
      const isHex = /^#[0-9A-F]{6}$/i.test(val);
      const tn = isHex && nameOf(L, val);
      return `<div class="ds-row"><dt>${k}</dt><dd>${isHex ? `<i style="background:${val}"></i>` : ''}${tn ? `<span>${tn}</span><em>${val}</em>` : `<span>${esc(val)}</span>`}</dd></div>`;
    }).join('');
    return `<div class="ds-ph"><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1l5 5-5 5-5-5z" fill="none" stroke="currentColor" stroke-width="1.3"/></svg><b>${c.name}</b><em>${L.name}</em></div>
      <div class="ds-sec"><h3>${c.prop}</h3><div class="ds-opts" role="group" aria-label="${c.prop}">${c.opts.map((o) => `<button type="button" data-v="${esc(o)}" aria-pressed="${o === v}">${esc(o)}</button>`).join('')}</div>${c.hint ? `<p class="ds-hint">${c.hint} on the canvas</p>` : ''}</div>
      <div class="ds-sec"><h3>Properties</h3><dl>${rows}</dl></div>
      <div class="ds-sec"><h3>${L.name} colours</h3><div class="ds-sws">${L.tokens.map(([n, h, d], i) => `<button type="button" data-t="${i}" aria-label="${n} ${h}"><i style="background:${h}"></i></button>`).join('')}</div><p class="ds-swn" aria-live="polite">Pick a colour to see its name</p></div>
      <a class="ln ds-more" href="${L.href}">See the full ${L.name} system</a>`;
  };

  const set = (v, fromCanvas) => {
    const { c } = cur;
    if (state[c.id] === v) return;
    state[c.id] = v;
    const el = $('.c', inst);
    if (c.update && el) c.update(el, v); else if (!fromCanvas) draw();
    pathEl.textContent = `${cur.L.name} / ${c.name} / ${v}`;
    props.innerHTML = propsHTML();
    requestAnimationFrame(measure);
  };

  const draw = () => {
    const { L, c } = cur;
    inst.style.setProperty('--z', c.zoom || 1);
    inst.innerHTML = c.render(state[c.id]);
    const el = $('.c', inst);
    if (c.wire) c.wire(el, (v) => set(v, true));
    // plain buttons in the demos do nothing but should still feel pressed
    pathEl.textContent = `${L.name} / ${c.name} / ${state[c.id]}`;
    stage.style.setProperty('--bg', L.id === 'staza' ? '#F4F7F5' : '#F3F4F0');
    requestAnimationFrame(measure);
  };

  const select = (key) => {
    const [lid, cid] = key.split(':');
    const L = LIBS.find((x) => x.id === lid), c = L.comps.find((x) => x.id === cid);
    cur = { L, c };
    if (!(c.id in state)) state[c.id] = c.opts[0];
    $$('button[data-c]', assets).forEach((b) => b.setAttribute('aria-pressed', b.dataset.c === key));
    const on = $(`button[data-c="${key}"]`, assets);
    // keep the chosen chip in view on phones without moving the page
    if (on && assets.scrollWidth > assets.clientWidth + 4) {
      const ar = assets.getBoundingClientRect(), br = on.getBoundingClientRect();
      if (br.left < ar.left || br.right > ar.right) assets.scrollBy({ left: br.left - ar.left - 16, behavior: RM ? 'auto' : 'smooth' });
    }
    draw();
    props.innerHTML = propsHTML();
  };

  assets.addEventListener('click', (e) => { const b = e.target.closest('button[data-c]'); if (b) select(b.dataset.c); });
  props.addEventListener('click', (e) => { const b = e.target.closest('.ds-opts button'); if (b) set(b.dataset.v); });
  // colour names: hover or focus on desktop, tap on phones
  const showTok = (e) => {
    const b = e.target.closest && e.target.closest('.ds-sws button'); if (!b) return;
    const [n, h, d] = cur.L.tokens[+b.dataset.t];
    $$('.ds-sws button', props).forEach((x) => x.classList.toggle('on', x === b));
    const out = $('.ds-swn', props); if (out) out.innerHTML = `<b>${n}</b> ${h} · ${esc(d)}`;
  };
  ['mouseover', 'focusin', 'click'].forEach((t) => props.addEventListener(t, showTok));
  addEventListener('resize', () => requestAnimationFrame(measure), { passive: true });
  afterBuild.push(() => requestAnimationFrame(measure));
  select('staza:button');
})();
