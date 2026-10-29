/* Portfolio v3: greeting preloader, selected-work rail, motion, kind words, walkthroughs, clock. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // A fresh visit = not arriving from another page of this site.
  let internal = false;
  try { internal = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch (e) {}
  const V3 = window.V3 = { reduce, fresh: !internal, ready: false };
  const fireReady = () => { V3.ready = true; document.dispatchEvent(new CustomEvent('v3:ready')); };

  /* ---------- greeting preloader (home, every fresh visit) ---------- */
  const loader = $('.loader');
  if (loader && V3.fresh) {
    const words = ['Hello', 'Bawo ni', 'Kedu', 'Sannu', 'Bonjour', 'Hola', 'Ciao', 'Olá', 'Hallo', 'Hej', 'Namaste', 'Konnichiwa', 'Annyeong', 'Nǐ hǎo', 'Marhaba', 'Jambo', 'Akwaaba', 'Sawubona', 'Shalom', 'Merhaba', 'Privet', 'Salut'];
    const out = $('p', loader); let i = 0;
    const tick = () => {
      out.textContent = words[i++];
      if (i < words.length) setTimeout(tick, i === 1 ? 700 : 110);
      else setTimeout(() => {
        // "reduce motion" gets a fade at the end instead of the slide
        if (reduce) { loader.style.transition = 'opacity .5s'; loader.style.opacity = '0'; } else loader.classList.add('out');
        setTimeout(fireReady, reduce ? 300 : 380);
        setTimeout(() => loader.remove(), 1000);
      }, 260);
    };
    tick();
  } else {
    if (loader) loader.remove();
    queueMicrotask(fireReady);
  }

  /* ---------- selected work rail ---------- */
  const rail = $('.rail');
  if (rail) {
    const prev = $('#work .prev'), next = $('#work .next');
    const step = () => { const c = $('.card', rail); return c ? c.getBoundingClientRect().width + 16 : 300; };
    const sync = () => {
      prev.disabled = rail.scrollLeft < 4;
      next.disabled = rail.scrollLeft > rail.scrollWidth - rail.clientWidth - 4;
    };
    prev.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }));
    next.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }));
    rail.addEventListener('scroll', sync, { passive: true });
    addEventListener('resize', sync);
    sync();
  }

  /* ---------- motion: muted autoplay on screen, full screen on click ---------- */
  const mvs = $$('.mv');
  if (mvs.length) {
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        const v = $('video', en.target);
        if (en.isIntersecting) {
          if (!v.src) v.src = en.target.dataset.src;
          if (!v.dataset.w) { v.dataset.w = 1; v.addEventListener('timeupdate', () => { if (v.currentTime > 0.15) { const p = $('.pic img', en.target); if (p) p.classList.add('gone'); } }); }
          if (!reduce) v.play().catch(() => {});
        } else if (v.src) v.pause();
      });
    }, { threshold: 0.5 });
    mvs.forEach((m) => io.observe(m));
    const lb = $('.lb'), lv = $('video', lb), lt = $('p', lb);
    let last = null;
    const close = () => { lb.classList.remove('on'); lv.pause(); lv.removeAttribute('src'); lv.load(); if (last) last.focus(); };
    mvs.forEach((m) => m.addEventListener('click', () => {
      last = m; lv.src = m.dataset.src; lt.textContent = m.dataset.title;
      lb.classList.add('on'); lv.muted = false; lv.play().catch(() => {});
      $('.x', lb).focus();
      if (lv.requestFullscreen && matchMedia('(max-width: 640px)').matches) lv.requestFullscreen().catch(() => {});
    }));
    $('.x', lb).addEventListener('click', close);
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && lb.classList.contains('on')) close(); });
  }

  /* ---------- kind words (only real quotes; hidden while empty) ---------- */
  const kw = $('#kind');
  if (kw) {
    let q = [];
    try { q = JSON.parse($('#kw-data').textContent); } catch (e) {}
    if (q.length) {
      kw.hidden = false;
      const body = $('.kw-body', kw), n = $('.kw-n', kw); let i = 0;
      const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
      const show = () => {
        const it = q[i];
        body.innerHTML = `<blockquote data-l="t">“${esc(it.quote)}”</blockquote><figcaption class="by" data-l="t"><b>${esc(it.name)}</b><span>${esc(it.role)}</span></figcaption>`;
        n.textContent = `${i + 1} / ${q.length}`;
      };
      $('.prev', kw).addEventListener('click', () => { i = (i - 1 + q.length) % q.length; show(); });
      $('.next', kw).addEventListener('click', () => { i = (i + 1) % q.length; show(); });
      if (q.length < 2) $$('button', kw).forEach((b) => (b.hidden = true));
      show();
    }
  }

  /* ---------- project walkthroughs ---------- */
  $$('[data-walk]').forEach((w) => {
    const imgs = $$('.walk-screen img', w), dots = $$('.walk-dots button', w), count = $('[data-count]', w), cap = $('.walk-cap', w);
    let caps = []; try { caps = JSON.parse(w.dataset.caps || '[]'); } catch (e) {}
    let i = 0; const n = imgs.length;
    const go = (k) => {
      i = (k + n) % n;
      imgs.forEach((im, j) => im.classList.toggle('on', j === i));
      dots.forEach((d, j) => d.setAttribute('aria-current', j === i ? 'true' : 'false'));
      count.textContent = `${String(i + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
      if (cap) cap.textContent = caps[i] || '';
      const nx = imgs[(i + 1) % n]; if (nx) nx.loading = 'eager';
    };
    $('.walk-screen', w).addEventListener('click', () => go(i + 1));
    $('.prev', w).addEventListener('click', () => go(i - 1));
    $('.next', w).addEventListener('click', () => go(i + 1));
    dots.forEach((d, j) => d.addEventListener('click', () => go(j)));
    w.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') go(i + 1); if (e.key === 'ArrowLeft') go(i - 1); });
  });

  /* ---------- hero: keep the navy Figma selection on the word "scale" ---------- */
  const hero = $('.hero');
  if (hero) {
    const place = () => {
      const w = $('.w', hero), s = $('.fsel', hero), c = $('.fcur', hero);
      if (!s) return;
      // no "scale" in the headline (a visitor rewrote it in edit mode): no selection
      s.style.visibility = c.style.visibility = w ? '' : 'hidden';
      if (!w) return;
      const hr = hero.getBoundingClientRect(), k = hr.width / (hero.offsetWidth || hr.width) || 1; // page may be scaled in edit mode
      const r0 = w.getBoundingClientRect(), r = { left: r0.left / k, top: r0.top / k, width: r0.width / k, height: r0.height / k };
      const hl = hr.left / k, htop = hr.top / k;
      const fs = parseFloat(getComputedStyle(w).fontSize) || 48;
      const padX = fs * 0.08, ht = fs * 0.86, x = r.left - hl - padX, wd = r.width + padX * 2;
      const y = r.top - htop + (r.height - ht) / 2 + fs * 0.03;
      s.style.cssText = `left:${x}px;top:${y}px;width:${wd}px;height:${ht}px`;
      const em = $('em', s);
      if (em && !em.querySelector('.ch')) em.textContent = `${Math.round(wd)} × ${Math.round(ht)}`;
      if (c) { c.style.left = (x + wd - 4) + 'px'; c.style.top = (y + ht - 6) + 'px'; }
    };
    place();
    if (document.fonts) document.fonts.ready.then(place);
    addEventListener('load', place);
    addEventListener('resize', place);
    document.addEventListener('v3:layout', () => requestAnimationFrame(place));
    if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', place);
  }

  /* ---------- Lagos local time ---------- */
  const clocks = $$('[data-clock]');
  if (clocks.length) {
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Lagos', hour: '2-digit', minute: '2-digit' });
    const t = () => clocks.forEach((c) => (c.textContent = fmt.format(new Date())));
    t(); setInterval(t, 20000);
  }
})();
