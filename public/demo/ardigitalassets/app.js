(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SAMPLE_PRICE = 0.0482;

  /* header + progress */
  const hdr = $('[data-hdr]'), bar = $('[data-progress]');
  const onScroll = () => {
    hdr && hdr.classList.toggle('scrolled', scrollY > 20);
    if (bar) { const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`; }
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* mobile menu */
  const burger = $('[data-burger]'), mnav = $('[data-mnav]');
  burger && burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open)); mnav.classList.toggle('open', !open);
  });
  mnav && $$('a', mnav).forEach(a => a.addEventListener('click', () => { burger.setAttribute('aria-expanded', 'false'); mnav.classList.remove('open'); }));

  /* 3D coin */
  const LOGO = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4l17.3 10v20L24 44 6.7 34V14z" fill="none" stroke="rgba(20,20,19,.45)" stroke-width="2.4" stroke-linejoin="round"/><path d="M15 33l9-19 9 19" fill="none" stroke="#141413" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.8 26h10.4" stroke="#FAF9F5" stroke-width="3.6" stroke-linecap="round"/></svg>';
  $$('[data-coin]').forEach(c => {
    let h = '';
    for (let z = -7; z <= 7; z += 1.5) h += `<div class="edge" style="transform:translateZ(${z}px)"></div>`;
    c.innerHTML = h + `<div class="face front">${LOGO}</div><div class="face back">${LOGO}</div>`;
  });

  /* reveal */
  const rv = $$('[data-rv]');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .14, rootMargin: '0px 0px -40px' });
    rv.forEach(el => io.observe(el));
  } else rv.forEach(el => el.classList.add('in'));

  /* roadmap line */
  const road = $('[data-road]');
  if (road) new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { road.classList.add('in'); o.disconnect(); } }), { threshold: .3 }).observe(road);

  /* count up */
  const fmt = (n, el) => {
    if (el.dataset.fmt === 'short') return n >= 1e9 ? (n / 1e9).toFixed(n % 1e9 ? 1 : 0) + 'B' : n >= 1e6 ? Math.round(n / 1e6) + 'M' : n.toLocaleString('en-US');
    return n.toLocaleString('en-US') + (el.dataset.suffix || '');
  };
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, t = +el.dataset.count;
    if (reduce) { el.textContent = fmt(t, el); return; }
    const s = performance.now();
    const step = now => { const p = Math.min((now - s) / 1700, 1); el.textContent = fmt(Math.round(t * (1 - Math.pow(1 - p, 3))), el); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .5 });
  $$('[data-count]').forEach(el => cio.observe(el));

  /* parallax */
  const px = $$('[data-px]');
  if (px.length && !reduce) {
    let tick = false;
    const up = () => { px.forEach(el => { const r = el.getBoundingClientRect(); el.style.setProperty('--py', ((r.top + r.height / 2 - innerHeight / 2) * +el.dataset.px).toFixed(1) + 'px'); }); tick = false; };
    addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(up); } }, { passive: true }); up();
  }

  /* tilt */
  if (!reduce && matchMedia('(hover: hover)').matches) $$('[data-tilt]').forEach(st => {
    const coin = $('.coin-wrap', st);
    st.addEventListener('mousemove', e => { const r = st.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; if (coin) coin.style.transform = `rotateX(${-y * 25}deg) rotateY(${x * 25}deg)`; });
    st.addEventListener('mouseleave', () => { if (coin) coin.style.transform = ''; });
  });

  /* copy contract */
  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); } catch (e) {}
    const old = b.innerHTML; b.classList.add('done'); b.innerHTML = '<svg><use href="#i-check"/></svg>Copied';
    setTimeout(() => { b.classList.remove('done'); b.innerHTML = old; }, 1800);
  }));

  /* language switcher (preview: key texts) */
  const T = {
    en: {},
    es: { 'nav.home': 'Inicio', 'nav.about': 'Acerca de', 'nav.tokenomics': 'Tokenómica', 'nav.roadmap': 'Hoja de ruta', 'nav.whitepaper': 'Whitepaper', 'nav.blog': 'Blog', 'nav.contact': 'Contacto', login: 'Iniciar sesión', buy: 'Comprar ARD', 'hero.pill': 'Ya disponible en BNB Chain · ejemplo', 'hero.h1': 'Sé dueño de la nueva era de los <span class="hl">activos digitales.</span>', 'hero.lead': 'ARDigital Token (ARD) es un activo digital impulsado por la comunidad de ARDigitalAssets. Explora la tokenómica, lee el whitepaper y únete a la comunidad.', 'hero.cta1': 'Comprar ARD', 'hero.cta2': 'Leer whitepaper', 'market.kick': 'Mercado en vivo', 'market.title': 'Sigue el mercado <em>en tiempo real.</em>', 'about.title': '¿Qué es <em>ARDigital Token?</em>', 'tok.title': 'Distribución <em>clara y justa.</em>', 'road.title': 'Hacia dónde <em>vamos.</em>', 'buy.title': 'Consigue ARD en <em>4 pasos.</em>', 'news.title': 'No te pierdas <em>ninguna novedad.</em>', 'faq.title': 'Preguntas <em>frecuentes.</em>' },
    fr: { 'nav.home': 'Accueil', 'nav.about': 'À propos', 'nav.tokenomics': 'Tokenomics', 'nav.roadmap': 'Feuille de route', 'nav.whitepaper': 'Livre blanc', 'nav.blog': 'Blog', 'nav.contact': 'Contact', login: 'Connexion', buy: 'Acheter ARD', 'hero.pill': 'Disponible sur BNB Chain · exemple', 'hero.h1': 'Prenez part à la nouvelle ère des <span class="hl">actifs numériques.</span>', 'hero.lead': "ARDigital Token (ARD) est un actif numérique communautaire d'ARDigitalAssets. Découvrez la tokenomics, lisez le livre blanc et rejoignez la communauté.", 'hero.cta1': 'Acheter ARD', 'hero.cta2': 'Lire le livre blanc', 'market.kick': 'Marché en direct', 'market.title': 'Suivez le marché <em>en temps réel.</em>', 'about.title': "Qu'est-ce que <em>ARDigital Token ?</em>", 'tok.title': 'Une distribution <em>claire et juste.</em>', 'road.title': 'Où nous <em>allons.</em>', 'buy.title': 'Obtenez ARD en <em>4 étapes.</em>', 'news.title': 'Ne manquez <em>aucune actualité.</em>', 'faq.title': 'Vos questions, <em>nos réponses.</em>' },
    de: { 'nav.home': 'Start', 'nav.about': 'Über uns', 'nav.tokenomics': 'Tokenomics', 'nav.roadmap': 'Roadmap', 'nav.whitepaper': 'Whitepaper', 'nav.blog': 'Blog', 'nav.contact': 'Kontakt', login: 'Anmelden', buy: 'ARD kaufen', 'hero.pill': 'Jetzt live auf BNB Chain · Beispiel', 'hero.h1': 'Gestalte die nächste Ära <span class="hl">digitaler Werte.</span>', 'hero.lead': 'ARDigital Token (ARD) ist ein Community-Token von ARDigitalAssets. Entdecke die Tokenomics, lies das Whitepaper und werde Teil der Community.', 'hero.cta1': 'ARD jetzt kaufen', 'hero.cta2': 'Whitepaper lesen', 'market.kick': 'Live-Markt', 'market.title': 'Den Markt <em>in Echtzeit verfolgen.</em>', 'about.title': 'Was ist <em>ARDigital Token?</em>', 'tok.title': 'Klare, faire <em>Verteilung.</em>', 'road.title': 'Wohin wir <em>gehen.</em>', 'buy.title': 'ARD in <em>4 einfachen Schritten.</em>', 'news.title': 'Kein Update <em>verpassen.</em>', 'faq.title': 'Fragen, <em>beantwortet.</em>' }
  };
  const orig = {};
  $$('[data-i18n],[data-i18n-html]').forEach(el => { orig[el.dataset.i18n || el.dataset.i18nHtml] = el.innerHTML; });
  const setLang = code => {
    $$('[data-i18n]').forEach(el => { const k = el.dataset.i18n; el.innerHTML = (T[code] && T[code][k]) || orig[k]; });
    $$('[data-i18n-html]').forEach(el => {
      const k = el.dataset.i18nHtml; const v = (T[code] && T[code][k]);
      if (!v) { el.innerHTML = orig[k]; return; }
      el.innerHTML = v; const hl = $('.hl', el); if (hl) hl.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true"><path d="M2 15 C 80 4, 200 4, 298 12" fill="none" stroke="#D97757" stroke-width="5" stroke-linecap="round" style="stroke-dashoffset:0"/></svg>');
    });
    document.documentElement.lang = code;
    $$('[data-set-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.setLang === code)));
    const cur = $('.lang-btn .cur'); if (cur) cur.textContent = code.toUpperCase();
    try { localStorage.setItem('ardLang', code); } catch (e) {}
  };
  const lang = $('[data-lang]');
  if (lang) {
    const btn = $('[data-lang-btn]', lang);
    btn.addEventListener('click', e => { e.stopPropagation(); const o = lang.classList.toggle('open'); btn.setAttribute('aria-expanded', String(o)); });
    document.addEventListener('click', () => { lang.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); });
    $$('[data-set-lang]', lang).forEach(b => b.addEventListener('click', () => setLang(b.dataset.setLang)));
    let saved = 'en'; try { saved = localStorage.getItem('ardLang') || 'en'; } catch (e) {}
    if (saved !== 'en') setLang(saved);
  }

  /* tokenomics donut */
  const donut = $('[data-donut]');
  if (donut) {
    const segs = [['Community & rewards', 40, '#D97757'], ['Liquidity pool', 25, '#B4532E'], ['Development', 15, '#F0A485'], ['Marketing', 10, '#3D3D3A'], ['Team (locked)', 10, '#C9C3B4']];
    const C = 2 * Math.PI * 80; let off = 0, html = '<circle cx="110" cy="110" r="80" fill="none" stroke="#F0EEE6" stroke-width="34"/>', leg = '';
    segs.forEach(([n, p, c]) => { const L = C * p / 100; html += `<circle class="seg" cx="110" cy="110" r="80" stroke="${c}" stroke-dasharray="0 ${C}" data-len="${L - 2}" stroke-dashoffset="${-off}"><title>${n}: ${p}%</title></circle>`; off += L; leg += `<div class="lg"><i style="background:${c}"></i><span>${n}</span><b>${p}%</b></div>`; });
    donut.innerHTML = html; $('[data-legend]').innerHTML = leg;
    new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { $$('.seg', donut).forEach((s, i) => setTimeout(() => s.setAttribute('stroke-dasharray', `${s.dataset.len} ${C}`), reduce ? 0 : i * 180)); o.disconnect(); } }), { threshold: .3 }).observe(donut);
  }

  /* live prices */
  const ids = ['bitcoin', 'ethereum', 'binancecoin', 'solana', 'ripple', 'tether', 'cardano', 'dogecoin'];
  const money = v => v >= 1 ? '$' + v.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }) : '$' + v.toPrecision(3);
  const chg = v => `<span class="chg ${v >= 0 ? 'up' : 'down'}">${v >= 0 ? '▲' : '▼'} ${Math.abs(v).toFixed(2)}%</span>`;
  const spark = (arr, upc) => {
    if (!arr || !arr.length) return '';
    const pts = arr.filter((_, i) => i % 4 === 0); const mn = Math.min(...pts), mx = Math.max(...pts);
    const d = pts.map((v, i) => `${(i / (pts.length - 1) * 110).toFixed(1)},${(34 - (v - mn) / (mx - mn || 1) * 30).toFixed(1)}`).join(' L');
    return `<svg class="spark" viewBox="0 0 110 36" aria-hidden="true"><path d="M${d}" fill="none" stroke="${upc ? '#2F8F5B' : '#C2412D'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  };
  const tickerEl = $('[data-ticker]'), marketEl = $('[data-market]');
  const ardTick = `<span class="tk"><span class="tk-ic">AR</span><b>ARD</b><span class="p">$${SAMPLE_PRICE}</span><span class="chg up">sample</span></span>`;
  const renderTicker = list => {
    const items = ardTick + list.map(c => `<span class="tk"><img src="${c.image}" alt="" loading="lazy" width="26" height="26"><b>${c.symbol.toUpperCase()}</b><span class="p">${money(c.current_price)}</span>${chg(c.price_change_percentage_24h || 0)}</span>`).join('');
    tickerEl.innerHTML = items + items;
  };
  const fallback = () => {
    const names = [['BTC', 'Bitcoin'], ['ETH', 'Ethereum'], ['BNB', 'BNB'], ['SOL', 'Solana'], ['XRP', 'XRP'], ['USDT', 'Tether']];
    const items = ardTick + names.map(([s]) => `<span class="tk"><span class="tk-ic">${s[0]}</span><b>${s}</b><span class="p">Live price</span></span>`).join('');
    if (tickerEl && !tickerEl.dataset.ok) tickerEl.innerHTML = items + items;
    if (marketEl && !marketEl.dataset.ok) marketEl.innerHTML = [['Bitcoin','btc'],['Ethereum','eth'],['BNB','bnb'],['Solana','sol'],['XRP','xrp'],['Tether','usdt']].map(([n,s],i) => `<div class="mkt-row"><span class="n">${i+1}</span><span class="mkt-coin"><span class="tk-ic">${s[0].toUpperCase()}</span><span><b>${n}</b><small>${s}</small></span></span><span class="p">Loading…</span><span class="chg">—</span><span></span></div>`).join('');
  };
  const load = async () => {
    try {
      const r = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids.join(',')}&sparkline=true&price_change_percentage=24h`);
      if (!r.ok) throw 0;
      const data = (await r.json()).sort((a, b) => a.market_cap_rank - b.market_cap_rank);
      if (tickerEl) { tickerEl.dataset.ok = '1'; renderTicker(data); }
      if (marketEl) marketEl.dataset.ok = '1', marketEl.innerHTML = data.slice(0, 6).map(c => `<div class="mkt-row"><span class="n">${c.market_cap_rank}</span><span class="mkt-coin"><img src="${c.image}" alt="" loading="lazy" width="34" height="34"><span><b>${c.name}</b><small>${c.symbol}</small></span></span><span class="p">${money(c.current_price)}</span>${chg(c.price_change_percentage_24h || 0)}${spark(c.sparkline_in_7d && c.sparkline_in_7d.price, (c.price_change_percentage_24h || 0) >= 0)}</div>`).join('');
      const eth = data.find(c => c.id === 'ethereum');
      if (eth) { window.__eth = eth.current_price; calc(); }
    } catch (e) { fallback(); }
  };
  if (tickerEl || marketEl) { fallback(); load(); setInterval(load, 60000); }

  /* swap estimate */
  const pay = $('[data-pay]'), recv = $('[data-receive]'), rate = $('[data-rate]');
  function calc() {
    if (!pay || !window.__eth) return;
    const r = window.__eth / SAMPLE_PRICE; rate.textContent = Math.round(r).toLocaleString('en-US');
    recv.textContent = Math.round((+pay.value || 0) * r).toLocaleString('en-US');
  }
  pay && pay.addEventListener('input', calc);

  /* newsletter */
  const nf = $('[data-news]');
  nf && nf.addEventListener('submit', e => {
    e.preventDefault(); const i = $('input', nf), m = $('[data-news-msg]');
    if (!/^\S+@\S+\.\S+$/.test(i.value)) { m.style.color = '#C2412D'; m.textContent = 'Please enter a valid email address.'; i.focus(); return; }
    m.style.color = ''; m.textContent = '✓ Subscribed! (Preview: on the final site this saves to your mailing list.)'; nf.reset();
  });

  /* toast */
  const toast = $('[data-toast]');
  if (toast) {
    let seen = false; try { seen = sessionStorage.getItem('ardToast') === '1'; } catch (e) {}
    const show = () => { if (seen) return; seen = true; toast.hidden = false; requestAnimationFrame(() => toast.classList.add('show')); };
    const onS = () => { const h = document.documentElement.scrollHeight - innerHeight; if (scrollY / h > .4) { show(); removeEventListener('scroll', onS); } };
    if (!seen) { addEventListener('scroll', onS, { passive: true }); setTimeout(show, 30000); }
    $('[data-toast-x]').addEventListener('click', () => { toast.classList.remove('show'); try { sessionStorage.setItem('ardToast', '1'); } catch (e) {} setTimeout(() => toast.hidden = true, 600); });
  }

  /* auth forms */
  $$('[data-pw-toggle]').forEach(b => b.addEventListener('click', () => { const i = b.previousElementSibling; const s = i.type === 'password'; i.type = s ? 'text' : 'password'; b.textContent = s ? 'Hide' : 'Show'; }));
  const pw = $('[data-strength]');
  pw && pw.addEventListener('input', () => {
    const v = pw.value; let s = 0; if (v.length >= 8) s++; if (/[A-Z]/.test(v)) s++; if (/[0-9]/.test(v)) s++; if (/[^A-Za-z0-9]/.test(v)) s++;
    const m = $('[data-meter]'); m.style.width = (s * 25) + '%'; m.style.background = ['#C2412D', '#C2412D', '#D97757', '#D9A157', '#2F8F5B'][s];
    $('[data-meter-txt]').textContent = ['Too short', 'Weak', 'Okay', 'Good', 'Strong'][s];
  });
  $$('[data-auth]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault(); const b = $('button[type=submit]', f); b.textContent = 'Please wait…'; b.disabled = true;
    setTimeout(() => { location.href = '/demo/ardigitalassets/dashboard.html'; }, 700);
  }));

  /* dashboard chart */
  const chart = $('[data-chart]');
  const drawChart = n => {
    if (!chart) return;
    let v = 50, pts = []; const seed = n * 7;
    for (let i = 0; i <= 40; i++) { v += Math.sin(i * .6 + seed) * 6 + Math.cos(i * .27 + seed) * 4 + .8; pts.push(v); }
    const mn = Math.min(...pts), mx = Math.max(...pts);
    const d = pts.map((p, i) => `${(i / 40 * 600).toFixed(1)},${(220 - (p - mn) / (mx - mn) * 190).toFixed(1)}`).join(' L');
    chart.innerHTML = `<defs><linearGradient id="cf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D97757" stop-opacity=".3"/><stop offset="1" stop-color="#D97757" stop-opacity="0"/></linearGradient></defs><g stroke="rgba(20,20,19,.07)"><line x1="0" y1="60" x2="600" y2="60"/><line x1="0" y1="120" x2="600" y2="120"/><line x1="0" y1="180" x2="600" y2="180"/></g><path d="M${d} L600,240 L0,240Z" fill="url(#cf)"/><path class="line" d="M${d}" fill="none" stroke="#D97757" stroke-width="3" stroke-linecap="round"/>`;
  };
  if (chart) { drawChart(1); $$('[data-range]').forEach((b, i) => b.addEventListener('click', () => { $$('[data-range]').forEach(x => x.classList.remove('on')); b.classList.add('on'); drawChart(i + 1); })); }
})();
