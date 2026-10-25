(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const store = { get: (k) => { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {} } };

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
  }
  const scrollY = () => window.scrollY;

  /* ---------- preloader (home, first visit) or curtain reveal ---------- */
  const loader = $('.loader'), curtain = $('.curtain');
  const ready = () => document.body.classList.add('ready');
  // greet on every fresh visit to the home page (not when clicking around inside the site)
  let internal = false; try { internal = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch (e) {}
  if (loader && !internal) {
    store.set('seen', '1');
    const words = ['Hello', 'Bawo ni', 'Kedu', 'Sannu', 'Bonjour', 'Hola', 'Ciao', 'Olá', 'Hallo', 'Hej', 'Namaste', 'Konnichiwa', 'Annyeong', 'Nǐ hǎo', 'Marhaba', 'Jambo', 'Akwaaba', 'Sawubona', 'Shalom', 'Merhaba', 'Privet', 'Salut'];
    const out = $('p', loader); let i = 0;
    const tick = () => {
      out.textContent = words[i++];
      if (i < words.length) setTimeout(tick, i === 1 ? 700 : 110);
      // phones with "reduce motion" on get a gentle fade instead of the slide-up
      else setTimeout(() => { if (reduce) { loader.style.transition = 'opacity .5s'; loader.style.opacity = '0'; } else loader.classList.add('out'); setTimeout(ready, 450); setTimeout(() => loader.remove(), 1100); }, 260);
    };
    tick();
  } else {
    if (loader) loader.remove();
    if (curtain && !reduce) {
      curtain.classList.add('cover');
      requestAnimationFrame(() => requestAnimationFrame(() => { curtain.classList.remove('cover'); curtain.classList.add('out'); setTimeout(ready, 250); setTimeout(() => curtain.classList.remove('out'), 1000); }));
    } else ready();
  }
  // page transition: dark curtain rises with the next page's name
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || !curtain || reduce) return;
    const href = a.getAttribute('href');
    if (!href.startsWith('/') || href.startsWith('//') || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (href.split('#')[0] === location.pathname && href.includes('#')) return;
    e.preventDefault();
    $('p', curtain).textContent = a.dataset.label || 'Loading';
    curtain.classList.remove('out', 'cover'); void curtain.offsetWidth; curtain.classList.add('in');
    setTimeout(() => { location.href = href; }, 820);
  });
  addEventListener('pageshow', (e) => { if (e.persisted && curtain) { curtain.classList.remove('in', 'cover'); } });

  /* ---------- menu ---------- */
  const burger = $('.burger');
  if (burger) {
    const toggle = (on) => { document.body.classList.toggle('menu-open', on); burger.setAttribute('aria-expanded', on); };
    burger.addEventListener('click', () => toggle(!document.body.classList.contains('menu-open')));
    $('.scrim').addEventListener('click', () => toggle(false));
    addEventListener('keydown', (e) => { if (e.key === 'Escape') toggle(false); });
    const onS = () => burger.classList.toggle('on', scrollY() > innerHeight * 0.35 || innerWidth <= 900);
    addEventListener('scroll', onS, { passive: true }); addEventListener('resize', onS); onS();
  }

  /* ---------- magnetic elements ---------- */
  if (fine && !reduce) $$('.mag').forEach((m) => {
    const inner = m.firstElementChild;
    m.addEventListener('pointermove', (e) => {
      const r = m.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      m.style.transform = `translate(${x * 0.35}px,${y * 0.35}px)`; if (inner) inner.style.transform = `translate(${x * 0.15}px,${y * 0.15}px)`;
      m.style.transition = 'transform .15s'; if (inner) inner.style.transition = 'transform .15s';
    });
    m.addEventListener('pointerleave', () => { m.style.transition = 'transform .9s cubic-bezier(.16,1,.3,1)'; m.style.transform = ''; if (inner) { inner.style.transition = 'transform .9s cubic-bezier(.16,1,.3,1)'; inner.style.transform = ''; } });
  });

  /* ---------- hero: marquee name reacts to scroll, photo parallax ---------- */
  const track = $('.marquee .track'), me = $('.hero img.me');
  if (track) {
    let x = 0, dir = -1, last = scrollY(), vel = 0;
    const w = () => track.scrollWidth / 2;
    const loop = () => {
      const y = scrollY(), d = y - last; last = y;
      if (d !== 0) dir = d > 0 ? -1 : 1;
      vel += (Math.abs(d) * 0.25 - vel) * 0.1;
      x += dir * (reduce ? 0 : 0.6 + vel);
      const W = w(); if (x <= -W) x += W; if (x > 0) x -= W;
      track.style.transform = `translate3d(${x}px,0,0)`;
      if (me && y < innerHeight * 1.2) me.style.transform = `translate3d(0,${y * 0.18}px,0)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /* ---------- word-by-word reveal + general reveal ---------- */
  $$('[data-words]').forEach((el) => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map((w, i) => `<span class="word"><span style="transition-delay:${i * 18}ms">${w}</span></span>`).join(' ');
  });
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  $$('.rv,[data-words],.shot').forEach((el) => io.observe(el));

  /* ---------- work list: cursor-following preview that plays the ideation ---------- */
  const pv = $('.preview');
  if (pv && fine) {
    const slides = $('.slides', pv), chip = $('.chip', pv), rowsEl = $$('.row');
    let px = innerWidth / 2, py = innerHeight / 2, cx = px, cy = py, idx = -1, timer = null, stage = 0;
    const names = ['Sketch', 'Wireframe', 'Design'];
    const play = (slide) => {
      clearInterval(timer); stage = 0;
      const imgs = $$('.stage img', slide); imgs.forEach((im, i) => im.classList.toggle('on', i === 0)); chip.textContent = names[0];
      timer = setInterval(() => { stage = (stage + 1) % 3; imgs.forEach((im, i) => im.classList.toggle('on', i === stage)); chip.textContent = names[stage]; }, 650);
    };
    rowsEl.forEach((r, i) => {
      r.addEventListener('pointerenter', () => {
        // rows can be reordered (Designer / PM view), so find the matching slide by id
        const all = [...slides.children], k = Math.max(0, all.findIndex((s) => s.dataset.id === r.dataset.id));
        idx = k; pv.classList.add('on'); slides.style.transform = `translateY(${-k * 100}%)`; play(all[k]);
      });
      r.addEventListener('pointerleave', () => { pv.classList.remove('on'); clearInterval(timer); });
    });
    addEventListener('pointermove', (e) => { px = e.clientX; py = e.clientY; }, { passive: true });
    const follow = () => { cx += (px - cx) * 0.12; cy += (py - cy) * 0.12; pv.style.left = cx + 'px'; pv.style.top = cy + 'px'; requestAnimationFrame(follow); };
    requestAnimationFrame(follow);
  }

  /* ---------- sliding lanes of screens ---------- */
  const lanes = $$('.slider .lane');
  if (lanes.length && !reduce) {
    const sec = $('.slider');
    const move = () => {
      const r = sec.getBoundingClientRect(), p = (innerHeight - r.top) / (innerHeight + r.height);
      if (p > -0.2 && p < 1.2) lanes.forEach((l, i) => { const s = (p - 0.5) * 260 * (i % 2 ? 1 : -1); l.style.transform = `translate3d(${s - (i % 2 ? 160 : 0)}px,0,0)`; });
      requestAnimationFrame(move);
    };
    requestAnimationFrame(move);
  }

  /* ---------- work index: filters + list/grid ---------- */
  const filters = $$('.filters button');
  if (filters.length) {
    const items = $$('[data-sec]');
    filters.forEach((b) => b.addEventListener('click', () => {
      filters.forEach((x) => x.setAttribute('aria-pressed', x === b));
      const f = b.dataset.f; items.forEach((it) => { it.hidden = f !== 'all' && it.dataset.sec !== f; });
    }));
    $$('.views button').forEach((b) => b.addEventListener('click', () => {
      $$('.views button').forEach((x) => x.setAttribute('aria-pressed', x === b));
      document.body.classList.toggle('show-grid', b.dataset.v === 'grid');
    }));
  }

  /* ---------- case study: pinned sketch → wireframe → design ---------- */
  const ide = $('.ideation');
  if (ide && innerWidth > 900) {
    const l2 = $('.l2', ide), l3 = $('.l3', ide), pen = $('.pen', ide), label = $('.board .label', ide), bar = $('.prog i', ide), steps = $$('.step', ide);
    const names = ['01 · Sketch', '02 · Wireframe', '03 · Design'];
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const frame = () => {
      const r = ide.getBoundingClientRect(), total = ide.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / total));
      // 0–.2 hold sketch, .2–.45 wipe to wire, .45–.6 hold, .6–.85 wipe to design, .85–1 hold
      const a = ease(Math.min(1, Math.max(0, (p - 0.2) / 0.25))), b = ease(Math.min(1, Math.max(0, (p - 0.6) / 0.25)));
      l2.style.clipPath = `inset(0 ${100 - a * 100}% 0 0)`; l3.style.clipPath = `inset(0 ${100 - b * 100}% 0 0)`;
      const moving = (a > 0 && a < 1) ? a : (b > 0 && b < 1) ? b : -1;
      if (moving >= 0) { const bw = $('.layer', ide).getBoundingClientRect(), br = $('.board', ide).getBoundingClientRect(); pen.style.opacity = 1; pen.style.left = (bw.left - br.left + bw.width * moving) + 'px'; } else pen.style.opacity = 0;
      const s = b > 0.5 ? 2 : a > 0.5 ? 1 : 0;
      steps.forEach((el, i) => el.classList.toggle('on', i === s)); label.textContent = names[s];
      bar.style.width = (p * 100) + '%';
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  /* ---------- cover parallax ---------- */
  const cover = $('.cover-panel img');
  if (cover && !reduce) { const f = () => { const r = cover.parentElement.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) cover.style.transform = `translate3d(0,${(r.top - innerHeight / 2) * -0.06}px,0) scale(1.04)`; requestAnimationFrame(f); }; requestAnimationFrame(f); }

  /* ---------- local time in Lagos ---------- */
  const clock = $$('[data-clock]');
  const tickClock = () => { const t = new Date().toLocaleTimeString('en-GB', { timeZone: 'Africa/Lagos', hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase(); clock.forEach((c) => (c.textContent = t + ' WAT')); };
  if (clock.length) { tickClock(); setInterval(tickClock, 30000); }
})();
