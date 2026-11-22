(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = { get: k => { try { return localStorage.getItem(k) } catch { return null } }, set: (k, v) => { try { localStorage.setItem(k, v) } catch {} } };

/* Intro */
function intro() {
  const el = $('#intro'), w = $('.word');
  if (reduce || sessionStorage.getItem('seen')) return el.remove();
  setTimeout(() => w.classList.add('go'), 700);
  setTimeout(() => el.classList.add('out'), 2600);
  setTimeout(() => { el.remove(); try { sessionStorage.setItem('seen', 1) } catch {} }, 3500);
}

/* Tema */
function theme() {
  const t = store.get('theme') || 'dark';
  document.documentElement.dataset.theme = t;
  $('#theme').onclick = () => {
    const n = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = n; store.set('theme', n);
  };
}

/* Idioma */
const T = {
  en: { n1: 'Introduction', n2: 'About me', n3: 'My career', n4: 'Projects', n5: 'Contact', h0: 'PROFESSIONAL PORTFOLIO', h1: 'Turning ideas into growth.', h2: 'Technology, sales and e-commerce. Building my career through learning and practice.', b1: 'See projects', b2: 'Talk to me', a0: 'A path built through practice.', a1: 'I have worked in sales, kitchens and e-commerce. Each taught me communication, organization and teamwork.', a2: 'Today I work in e-commerce and study web development, learning HTML, CSS and JavaScript hands-on.', a3: 'I am curious and learn by building. I am still evolving, and that drives me.', c0: 'My career', t0: 'Tools and technologies', p0: 'Projects', k0: "Let's talk?", k1: 'Got an idea, opportunity or project in mind? Reach me through the channels below.' }
};
function lang() {
  const pt = {}; $$('[data-i18n]').forEach(e => pt[e.dataset.i18n] = e.textContent);
  const apply = l => {
    document.documentElement.lang = l === 'pt' ? 'pt-BR' : 'en';
    $$('[data-i18n]').forEach(e => e.textContent = (l === 'en' && T.en[e.dataset.i18n]) || pt[e.dataset.i18n]);
    $('#lang').value = l;
  };
  const l = store.get('lang') || ((navigator.language || 'pt').toLowerCase().startsWith('pt') ? 'pt' : 'en');
  apply(l);
  $('#lang').onchange = e => { store.set('lang', e.target.value); apply(e.target.value); };
}

/* Menu */
function menu() {
  const nav = $('#nav'), b = $('#burger');
  b.onclick = () => b.setAttribute('aria-expanded', nav.classList.toggle('open'));
  nav.onclick = e => e.target.tagName === 'A' && (nav.classList.remove('open'), b.setAttribute('aria-expanded', false));
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && $$('nav a').forEach(a => a.classList.toggle('on', a.hash === '#' + e.target.id))), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section').forEach(s => io.observe(s));
}

/* Reveal + barras (uma vez) */
function reveal() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: .2 });
  $$('.reveal').forEach(e => io.observe(e));
  const sk = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; sk.disconnect();
    $$('.bar').forEach((bar, i) => {
      const v = +bar.dataset.v, fill = $('i', bar), num = $('b', bar), dur = 1600, t0 = performance.now() + i * 120;
      const step = t => {
        const p = Math.min(Math.max((t - t0) / dur, 0), 1), k = 1 - Math.pow(1 - p, 3), cur = reduce ? v : Math.round(v * k);
        fill.style.setProperty('--w', (reduce ? v : v * k) + '%'); num.textContent = cur + '%';
        if (p < 1 && !reduce) requestAnimationFrame(step); else { fill.style.setProperty('--w', v + '%'); num.textContent = v + '%' }
      };
      requestAnimationFrame(step);
    });
  }), { threshold: .25 });
  sk.observe($('#skills'));
}

/* DNA controlado pelo scroll */
function dna() {
  const sec = $('#sobre'), cv = $('#dna'), ctx = cv.getContext('2d'), bubbles = $$('.bubble'), head = $('.about-head');
  let W, H, prog = 0, vis = false;
  const rs = () => { const d = devicePixelRatio || 1; W = cv.width = cv.clientWidth * d; H = cv.height = cv.clientHeight * d };
  addEventListener('resize', rs); rs();
  new IntersectionObserver(e => vis = e[0].isIntersecting).observe(sec);
  const pts = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random(), s: .3 + Math.random() }));
  function draw() {
    requestAnimationFrame(draw); if (!vis) return;
    const r = sec.getBoundingClientRect(); prog = Math.min(Math.max(-r.top / (r.height - innerHeight), 0), 1);
    ctx.clearRect(0, 0, W, H);
    const enter = Math.min(prog / .15, 1), exit = prog > .8 ? (prog - .8) / .2 : 0, n = 36;
    const cx = W / 2 + Math.sin(prog * Math.PI * 2) * W * .22, rot = reduce ? 0 : prog * Math.PI * 6;
    for (let i = 0; i < n; i++) {
      const y = H * (.08 + .84 * i / (n - 1)), a = i * .45 + rot, amp = Math.min(W, H) * .14;
      const x1 = cx + Math.sin(a) * amp, x2 = cx - Math.sin(a) * amp, d1 = (Math.cos(a) + 1) / 2;
      if (exit > 0) { // dissolve em partículas
        for (const [x, o] of [[x1, 1], [x2, 1]]) { const k = exit * 90; ctx.fillStyle = `rgba(139,92,246,${(1 - exit) * .7})`; ctx.fillRect(x + Math.sin(i * 3) * k, y - k * (.4 + (i % 5) / 8), 3, 3) }
        continue;
      }
      ctx.globalAlpha = enter * .75;
      ctx.strokeStyle = 'rgba(167,139,250,.35)'; ctx.lineWidth = 2 * devicePixelRatio; ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
      ctx.fillStyle = '#8b5cf6'; ctx.beginPath(); ctx.arc(x1, y, (5 + 4 * d1) * devicePixelRatio, 0, 7); ctx.fill();
      ctx.fillStyle = '#d4d4dc'; ctx.beginPath(); ctx.arc(x2, y, (5 + 4 * (1 - d1)) * devicePixelRatio, 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (exit > 0) pts.forEach(p => { ctx.fillStyle = `rgba(139,92,246,${(1 - exit) * .5})`; ctx.fillRect(p.x * W, (p.y - exit * p.s * .3) * H, 2, 2) });
    head.style.opacity = prog < .12 ? 1 : Math.max(0, 1 - (prog - .12) / .08);
    bubbles.forEach(b => b.classList.toggle('in', prog > +b.dataset.b && prog < .85));
  }
  draw();
}

/* Crachá */
function badge() {
  const b = $('#badge');
  b.onclick = e => { if (e.target.closest('a')) return; const f = b.classList.toggle('flip'); b.setAttribute('aria-pressed', f) };
}

/* Extras */
function extras() {
  $('#yr').textContent = new Date().getFullYear();
  $$('[data-todo]').forEach(a => a.addEventListener('click', e => e.preventDefault()));
  const v = $('#bg');
  document.addEventListener('visibilitychange', () => document.hidden ? v.pause() : !reduce && v.play().catch(() => {}));
  if (reduce) v.pause();
  v.addEventListener('error', () => v.remove(), true);
}

[intro, theme, lang, menu, reveal, dna, badge, extras].forEach(f => f());
})();
