/* Case-study pages: staggered headings, reveal on scroll, full-size image viewer. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  $$('[data-split]').forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', words.join(' '));
    el.innerHTML = words.map((w, i) => `<span class="w" aria-hidden="true"><span style="--i:${i}">${esc(w)}</span></span>`).join(' ');
  });
  const io = new IntersectionObserver((es) => es.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
  $$('[data-reveal],[data-split]').forEach((el) => io.observe(el));

  const lb = $('.lightbox');
  if (lb) {
    const img = $('img', lb);
    let last;
    const close = () => { lb.hidden = true; document.body.style.overflow = ''; if (last) last.focus(); };
    $$('.shot-btn').forEach((b) => b.addEventListener('click', () => {
      last = b; const src = $('img', b);
      img.src = src.src; img.alt = src.alt; lb.hidden = false; document.body.style.overflow = 'hidden';
      $('.lb-scroll', lb).scrollTop = 0; $('.lb-close', lb).focus();
    }));
    $('.lb-close', lb).addEventListener('click', close);
    lb.addEventListener('click', (e) => { if (e.target === lb || e.target.classList.contains('lb-scroll')) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lb.hidden) close(); });
  }
  const island = $('.island');
  addEventListener('scroll', () => island && island.classList.toggle('shrink', scrollY > 40), { passive: true });
})();
