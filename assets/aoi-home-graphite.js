// AOI Network — accueil « graphite » : comportements de la page (vanilla, module ES).
// Le film 3D est chargé à part (assets/aoi-film.js) ; s'il échoue, une image fixe le remplace.
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const safe = (label, fn) => { try { fn(); } catch (err) { console.warn(`[AOI] ${label}`, err); } };

/* ── Film 3D ── */
safe('film', () => {
  const section = $('#top'), host = $('#film-stage'), overlay = $('#film-overlay');
  const fallback = err => { console.warn('[AOI] Film 3D indisponible, image fixe affichée.', err); section.classList.add('is-fallback'); };
  import('./aoi-film.js')
    .then(m => m.createFilm({ host, section, overlay, getProps: () => ({ glow: 1, quality: 'Haute' }) }))
    .then(film => { window.AOIFilmInstance = film; })
    .catch(fallback);
});

/* ── En-tête : masqué au scroll vers le bas, affiché vers le haut ── */
const header = $('#site-header');
const menuBtn = $('#menu-toggle'), menu = $('#menu-mobile');
safe('header', () => {
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (!menu.hidden || y < 140 || y < lastY - 3) header.classList.remove('is-hidden');
    else if (y > lastY + 3) header.classList.add('is-hidden');
    lastY = y;
  }, { passive: true });
});

/* ── Menu mobile ── */
safe('menu', () => {
  const label = $('.hd-menu-label', menuBtn);
  const setMenu = (open, restoreFocus = false) => {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Fermer' : 'Menu';
    if (open) header.classList.remove('is-hidden');
    if (!open && restoreFocus) menuBtn.focus();
  };
  menuBtn.addEventListener('click', () => setMenu(menu.hidden));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) setMenu(false, true); });
  window.matchMedia('(min-width:1080px)').addEventListener('change', e => { if (e.matches) setMenu(false); });
});

/* ── Défilement amorti (molette uniquement) ── */
safe('smooth', () => {
  if (reduce) return;
  let cur = window.scrollY, tgt = cur, raf = 0, ours = false;
  const max = () => document.documentElement.scrollHeight - window.innerHeight;
  const loop = () => {
    cur += (tgt - cur) * 0.075;
    if (Math.abs(tgt - cur) < 0.4) cur = tgt;
    ours = true; window.scrollTo(0, cur);
    raf = cur !== tgt ? requestAnimationFrame(loop) : 0;
  };
  window.addEventListener('wheel', e => {
    if (e.ctrlKey || e.defaultPrevented || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    if (!menu.hidden) return; // le menu plein écran garde son défilement natif
    e.preventDefault();
    let d = e.deltaY; if (e.deltaMode === 1) d *= 40; else if (e.deltaMode === 2) d *= window.innerHeight;
    if (!raf) cur = tgt = window.scrollY;
    tgt = Math.max(0, Math.min(max(), tgt + d));
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: false });
  // Défilement externe (clavier, ancre, barre) : resynchronise la position de départ.
  window.addEventListener('scroll', () => {
    if (ours) { ours = false; return; }
    if (!raf) cur = tgt = window.scrollY;
  }, { passive: true });
});

/* ── Entrée en perspective des démos ── */
safe('tilt', () => {
  const demos = $('#demos');
  if (!demos || reduce) return;
  const tilt = () => {
    const vh = window.innerHeight, r = demos.getBoundingClientRect();
    const t = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.85)));
    const k = 1 - Math.pow(1 - t, 3);
    demos.style.transform = `perspective(1800px) rotateX(${((1 - k) * 18).toFixed(2)}deg) rotateY(${((1 - k) * -12).toFixed(2)}deg) translateY(${((1 - k) * 60).toFixed(1)}px) scale(${(0.92 + 0.08 * k).toFixed(4)})`;
  };
  window.addEventListener('scroll', tilt, { passive: true });
  window.addEventListener('resize', tilt);
  tilt();
});

/* ── Démos : iframes 1000 × 610 mises à l'échelle de leur carte ── */
safe('demos', () => {
  const frames = $$('[data-demo-frame]');
  const scale = () => frames.forEach(fr => { const w = fr.parentElement.clientWidth; if (w) fr.style.transform = `scale(${(w / 1000).toFixed(4)})`; });
  const ro = new ResizeObserver(scale);
  frames.forEach(fr => ro.observe(fr.parentElement));
  scale();
});

/* ── FAQ : une seule réponse ouverte ── */
safe('faq', () => {
  const items = $$('.faq-item');
  items.forEach(item => {
    const btn = $('button', item);
    btn.addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      items.forEach(other => { other.classList.remove('is-open'); $('button', other).setAttribute('aria-expanded', 'false'); });
      if (open) { item.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });
});

/* ── Apparitions au scroll ── */
safe('reveal', () => {
  const els = $$('[data-reveal]').filter(el => el.getBoundingClientRect().top >= window.innerHeight);
  els.forEach(el => el.classList.add('rv-wait'));
  // Laisse le navigateur peindre l'état initial avant d'activer les transitions.
  requestAnimationFrame(() => els.forEach(el => el.classList.add('rv')));
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target, i = Array.prototype.indexOf.call(el.parentElement.children, el);
    el.style.transitionDelay = (Math.max(0, i) * 0.1).toFixed(2) + 's';
    el.classList.remove('rv-wait');
    io.unobserve(el);
  }), { threshold: 0.15 });
  els.forEach(el => io.observe(el));
});

/* ── Cookies et mesure d'audience (identifiants et clé de consentement de production) ── */
safe('cookies', () => {
  const banner = $('#cookie-banner');
  let consent = null, pixelsLoaded = false;
  try { consent = localStorage.getItem('aoi_cookies'); } catch (_) {}
  const production = /^(www\.)?aoi-network\.com$/.test(location.hostname);
  function loadTrackingPixels() {
    if (pixelsLoaded || !production) return;
    pixelsLoaded = true;
    window._linkedin_partner_id = '8742890';
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    if (!window._linkedin_data_partner_ids.includes('8742890')) window._linkedin_data_partner_ids.push('8742890');
    if (!window.lintrk) { window.lintrk = function (a, b) { window.lintrk.q.push([a, b]); }; window.lintrk.q = []; }
    const linkedin = document.createElement('script'); linkedin.async = true; linkedin.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js'; document.head.appendChild(linkedin);
    if (!window.fbq) {
      const fb = window.fbq = function () { fb.callMethod ? fb.callMethod.apply(fb, arguments) : fb.queue.push(arguments); };
      window._fbq = fb; fb.push = fb; fb.loaded = true; fb.version = '2.0'; fb.queue = [];
      const meta = document.createElement('script'); meta.async = true; meta.src = 'https://connect.facebook.net/en_US/fbevents.js'; document.head.appendChild(meta);
    }
    window.fbq('init', '2586678501298941'); window.fbq('track', 'PageView');
  }
  function saveConsent(value) {
    consent = value; try { localStorage.setItem('aoi_cookies', value); } catch (_) {}
    banner.hidden = true; if (value === 'accepted') loadTrackingPixels();
  }
  $('#cookies-accept').addEventListener('click', () => saveConsent('accepted'));
  $('#cookies-reject').addEventListener('click', () => { const wasLoaded = pixelsLoaded; saveConsent('refused'); if (wasLoaded) location.reload(); });
  $('#cookie-settings').addEventListener('click', () => { banner.hidden = false; $('#cookies-reject').focus(); });
  banner.hidden = consent === 'accepted' || consent === 'refused';
  if (consent === 'accepted') loadTrackingPixels();
  if (production) { const analytics = document.createElement('script'); analytics.defer = true; analytics.src = '/_vercel/insights/script.js'; document.head.appendChild(analytics); }
  document.addEventListener('click', event => {
    if (consent !== 'accepted' || !production) return;
    const link = event.target.closest('a[href*="rejoindre.html"]');
    if (link) {
      if (typeof window.fbq === 'function') window.fbq('track', 'InitiateCheckout');
      if (typeof window.lintrk === 'function') window.lintrk('track', { conversion_id: 18956748 });
    }
  });
});

/* ── Le réseau, à ce jour : chiffres en direct de la plateforme, chiffres de secours sinon ── */
safe('reseau', () => {
  const bloc = $('[data-reseau]');
  const secours = $('#reseau-secours');
  if (!bloc || !secours) return;
  const section = bloc.closest('section');
  const SOURCE = 'https://extranet.aoi-network.com/api/public/reseau';
  const SOUS_TITRES = { entreprises: 'TCE, rénovation intérieure, gros œuvre, CVC, contractants généraux' };
  const calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nf = new Intl.NumberFormat('fr-FR');
  let vu = false;

  const delai = m => m < 60 ? `${Math.max(1, m)} min` : m < 2880 ? `${Math.round(m / 60)} h` : `${Math.round(m / 1440)} j`;
  const pluriel = (n, un, plusieurs) => (n > 1 ? plusieurs : un);

  const compter = (el, cible) => {
    el.dataset.cible = cible;
    if (calme) { el.textContent = nf.format(cible); return; }
    if (!vu) { el.textContent = '0'; return; }
    const depart = parseInt((el.textContent || '0').replace(/\D/g, ''), 10) || 0;
    const t0 = performance.now(), duree = 1400;
    const pas = t => {
      const k = Math.min(1, (t - t0) / duree), e = 1 - Math.pow(1 - k, 3);
      el.textContent = nf.format(Math.round(depart + (cible - depart) * e));
      if (k < 1) requestAnimationFrame(pas);
    };
    requestAnimationFrame(pas);
  };

  const ligne = (label, n, max, sousTitre) => {
    const li = document.createElement('li');
    const lab = document.createElement('span'); lab.className = 'rm-label'; lab.textContent = label;
    if (sousTitre) { const s = document.createElement('small'); s.textContent = sousTitre; lab.append(s); }
    const barre = document.createElement('span'); barre.className = 'rm-barre'; barre.setAttribute('aria-hidden', 'true');
    const i = document.createElement('i'); i.style.setProperty('--p', (n / max).toFixed(3)); barre.append(i);
    const b = document.createElement('b'); b.textContent = nf.format(n);
    li.append(lab, barre, b);
    return li;
  };

  const afficher = (d, direct) => {
    const metiers = (d.metiers || []).filter(m => m.n > 0);
    const max = Math.max(1, ...metiers.map(m => m.n));
    const liste = $('[data-metiers]', bloc);
    liste.replaceChildren(...metiers.map(m => ligne(m.label, m.n, max, SOUS_TITRES[m.cle])));
    if (!metiers.some(m => m.cle === 'juridique')) {
      const li = document.createElement('li'); li.className = 'rm-bientot';
      li.innerHTML = '<span class="rm-label">Notaires et avocats</span><span class="rm-barre" aria-hidden="true"></span><b>Bientôt</b>';
      liste.append(li);
    }
    compter($('[data-compte="membres"]', bloc), d.membres || (d.professionnels + (d.operateurs || 0)));
    compter($('[data-compte="professionnels"]', bloc), d.professionnels);

    const c = d.consultations || {};
    const devisEl = $('[data-compte="devis"]', section);
    if (devisEl) compter(devisEl, c.devis);
    const txt = $('[data-devis-texte]', section);
    if (txt) txt.textContent = `${pluriel(c.devis, 'devis reçu', 'devis reçus')} sur ${nf.format(c.publiees)} ${pluriel(c.publiees, 'consultation publiée', 'consultations publiées')}`
      + (c.publiees > 1 && c.avecDevis === c.publiees ? ' : chacune a reçu les siens' : '');
    const delaiEl = $('[data-delai]', section);
    if (delaiEl && c.premierDevisMinutes != null) delaiEl.textContent = delai(c.premierDevisMinutes);

    const maj = $('[data-maj]', bloc);
    maj.classList.toggle('is-direct', direct);
    maj.textContent = direct ? 'Chiffres en direct de la plateforme.'
      : `Chiffres de la plateforme au ${new Date(d.aJour).toLocaleDateString('fr-FR')}.`;
  };

  afficher(JSON.parse(secours.textContent), false);

  // Les compteurs démarrent quand la section entre à l'écran.
  const io = new IntersectionObserver(entries => {
    if (!entries.some(en => en.isIntersecting)) return;
    vu = true; io.disconnect();
    bloc.classList.add('is-vu');
    $$('[data-compte]', section).forEach(el => compter(el, Number(el.dataset.cible || 0)));
  }, { threshold: 0.25 });
  io.observe(bloc);

  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(), 5000);
  fetch(SOURCE, { signal: ctrl.signal, credentials: 'omit' })
    .then(r => (r.ok ? r.json() : null))
    .then(d => { if (d && d.professionnels > 0 && Array.isArray(d.metiers)) afficher(d, true); })
    .catch(err => { if (err && err.name !== 'AbortError' && !(err instanceof TypeError)) console.warn('[AOI] reseau', err); });
});
