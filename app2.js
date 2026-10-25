(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* floating "Let's talk" CTA: after the hero, hidden over the contact section */
  const hire = $('.hire'), contact = $('#contact');
  if (hire) {
    // visible from the start (after the preloader), so the way to reach me is always one tap away
    let seen = false; try { seen = !!sessionStorage.getItem('seen2'); sessionStorage.setItem('seen2', '1'); } catch (e) {}
    setTimeout(() => hire.classList.add('on'), document.querySelector('.loader') && !seen ? 2600 : 700);
    if (contact) new IntersectionObserver((es) => document.body.classList.toggle('contact-open', es[0].isIntersecting), { threshold: 0.15 }).observe(contact);
  }
  // in-page links to #contact scroll smoothly
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href="#contact"]'); if (!a || !contact) return;
    e.preventDefault(); document.body.classList.remove('menu-open');
    contact.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });

  /* reveal for the how-I-work row */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.2 });
  $$('.how').forEach((el) => io.observe(el));

  /* browser frames: scroll tall pages by their real height */
  const sizeScroll = (v) => { const im = $('img', v); const go = () => { const vh = v.clientHeight, ih = im.clientHeight; v.style.setProperty('--vh', vh + 'px'); v.style.setProperty('--dur', Math.max(10, Math.min(34, ih / vh * 3.2)) + 's'); }; if (im.complete) go(); else im.addEventListener('load', go); addEventListener('resize', go); };
  $$('.browser .view.scroll').forEach(sizeScroll);

  /* phone player: taps through the flow like a prototype */
  $$('[data-player]').forEach((box) => {
    const imgs = $$('.scr img', box), dots = $$('.dots button', box), cap = $('.cap', box), tap = $('.tap', box), phone = $('.phone, .browser', box);
    let i = 0, timer = null, visible = false;
    const show = (n) => {
      const prev = i; i = (n + imgs.length) % imgs.length;
      imgs.forEach((im, k) => { im.classList.remove('prev', 'next'); if (k === prev && k !== i) im.classList.add('prev'); else if (k !== i) im.classList.add('next'); });
      dots.forEach((d, k) => d.setAttribute('aria-current', k === i));
      if (cap) cap.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(imgs.length).padStart(2, '0');
    };
    const tapAt = () => {
      if (!tap || reduce) return;
      const r = phone.getBoundingClientRect(), b = box.getBoundingClientRect();
      tap.style.left = (r.left - b.left + r.width * (0.35 + Math.random() * 0.3)) + 'px';
      tap.style.top = (r.top - b.top + r.height * (0.55 + Math.random() * 0.3)) + 'px';
      tap.classList.remove('go'); void tap.offsetWidth; tap.classList.add('go');
    };
    const loop = () => { clearInterval(timer); timer = setInterval(() => { if (!visible || document.hidden) return; tapAt(); setTimeout(() => show(i + 1), 280); }, 2400); };
    dots.forEach((d, k) => d.addEventListener('click', () => { show(k); loop(); }));
    phone.addEventListener('click', () => { tapAt(); setTimeout(() => show(i + 1), 200); loop(); });
    new IntersectionObserver((es) => { visible = es[0].isIntersecting; }, { threshold: 0.3 }).observe(box);
    show(0); if (!reduce) loop();
  });

  /* signature wall */
  const wall = $('.wall'), pad = $('.pad canvas');
  if (wall && pad) {
    const ctx = pad.getContext('2d'), msg = $('.sign .msg'), count = $('.wall-count');
    let strokes = [], cur = null, dpr = Math.min(devicePixelRatio || 1, 2);
    const W = 640, H = 360; // signature coordinate space
    const fit = () => { const r = pad.getBoundingClientRect(); pad.width = r.width * dpr; pad.height = r.height * dpr; redraw(); };
    const toXY = (e) => { const r = pad.getBoundingClientRect(); return [Math.round((e.clientX - r.left) / r.width * W), Math.round((e.clientY - r.top) / r.height * H)]; };
    const redraw = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, pad.width, pad.height);
      ctx.setTransform(pad.width / W, 0, 0, pad.height / H, 0, 0);
      ctx.lineWidth = 3.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#16171A';
      strokes.forEach((s) => { ctx.beginPath(); s.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); if (s.length === 1) ctx.lineTo(s[0][0] + .1, s[0][1]); ctx.stroke(); });
    };
    pad.addEventListener('pointerdown', (e) => { pad.setPointerCapture(e.pointerId); cur = [toXY(e)]; strokes.push(cur); redraw(); });
    pad.addEventListener('pointermove', (e) => { if (!cur) return; const p = toXY(e), l = cur[cur.length - 1]; if (Math.abs(p[0] - l[0]) + Math.abs(p[1] - l[1]) > 2) { cur.push(p); redraw(); } });
    addEventListener('pointerup', () => { cur = null; });
    $('.sign .clear').addEventListener('click', () => { strokes = []; redraw(); });
    addEventListener('resize', fit); fit();
    const pathOf = (ss) => ss.map((s) => 'M' + s.map((p) => p.join(' ')).join('L')).join('');
    const card = (s, isNew) => {
      const d = new Date(s.t || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const el = document.createElement('div'); el.className = 'sig' + (isNew ? ' new' : '');
      el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true"><path d="${s.d.replace(/[^MLml0-9 .\-]/g, '')}"/></svg><b></b><small>${d}</small>`;
      $('b', el).textContent = s.name || 'Anonymous'; return el;
    };
    const setCount = (n) => { if (count) count.textContent = n.toLocaleString(); };
    let total = 0;
    fetch('/api/guestbook').then((r) => (r.ok ? r.json() : Promise.reject(r.status))).then((j) => {
      total = j.count || j.items.length; setCount(total);
      wall.innerHTML = ''; j.items.forEach((s) => wall.appendChild(card(s)));
      if (!j.items.length) wall.innerHTML = '<p style="color:var(--muted)">No signatures yet. Be the first to sign.</p>';
    }).catch(() => { wall.innerHTML = '<p style="color:var(--muted)">The wall is resting. Try again in a moment.</p>'; });
    $('.sign form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('.sign input').value.trim().slice(0, 40);
      const pts = strokes.reduce((a, s) => a + s.length, 0);
      if (pts < 8) { msg.textContent = 'Draw your signature in the box first.'; return; }
      if (!name) { msg.textContent = 'Add your name so I know who signed.'; return; }
      const body = { name, d: pathOf(strokes).slice(0, 12000) };
      msg.textContent = 'Signing…';
      fetch('/api/guestbook', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        .then((r) => (r.ok ? r.json() : r.json().then((j) => Promise.reject(j.error || 'error'))))
        .then((s) => {
          const empty = wall.querySelector('p'); if (empty) empty.remove();
          wall.prepend(card(s, true)); setCount(++total);
          strokes = []; redraw(); $('.sign input').value = ''; msg.textContent = 'Signed. Thank you, ' + name + '.';
        })
        .catch((err) => { msg.textContent = typeof err === 'string' && err !== 'error' ? err : 'Could not sign right now. Please try again.'; });
    });
  }
})();
