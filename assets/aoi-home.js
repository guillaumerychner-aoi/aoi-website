(function () {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.documentElement.classList.add('js-ready');
  // Content is present in the HTML. Animation never owns its availability.
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible'); reveal.unobserve(entry.target);
  }), {threshold: .08, rootMargin: '0px 0px -25px 0px'});
  $$('[data-reveal]').forEach(el => reveal.observe(el));
  const menuToggle = $('#menu-toggle'), mobileMenu = $('#mobile-nav');
  function closeMenu(restoreFocus = false) {
    mobileMenu.hidden = true; menuToggle.setAttribute('aria-expanded','false');
    menuToggle.querySelector('span').textContent = 'Menu';
    if (restoreFocus) menuToggle.focus();
  }
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    mobileMenu.hidden = !open; menuToggle.setAttribute('aria-expanded',String(open));
    menuToggle.querySelector('span').textContent = open ? 'Fermer' : 'Menu';
  });
  $$('a',mobileMenu).forEach(link => link.addEventListener('click',() => closeMenu()));
  document.addEventListener('keydown',event => {
    if (event.key === 'Escape' && !mobileMenu.hidden) closeMenu(true);
    if (event.key === 'Tab' && !mobileMenu.hidden) {
      const last = $$('a',mobileMenu).at(-1);
      if (event.shiftKey && document.activeElement === menuToggle) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); menuToggle.focus(); }
    }
  });
  document.addEventListener('click',event => {
    if (!mobileMenu.hidden && !$('#site-header').contains(event.target)) closeMenu();
  });
  window.matchMedia('(min-width:961px)').addEventListener('change',event => { if (event.matches) closeMenu(); });
  // Both demos are visible before a choice. Only the selected animation is loaded.
  const demoViewer = $('#demo-viewer'), demoFrame = $('#demo-frame');
  const demoScreen = $('.demo-screen'), demoLoading = $('#demo-loading');
  const demoNext = $('#demo-next'), demoOpen = $('#demo-open');
  const demos = {
    extranet: {title: 'L’extranet', frameTitle: 'Démonstration de l’extranet AOI', count: 'Démo 1 sur 2 · Accès gratuit', next: 'logiciel', nextLabel: 'Voir aussi le logiciel'},
    logiciel: {title: 'Le logiciel d’opération', frameTitle: 'Démonstration du logiciel d’opération AOI', count: 'Démo 2 sur 2 · Logiciel en option', next: 'extranet', nextLabel: 'Voir aussi l’extranet'}
  };
  Object.keys(demos).forEach(key => {
    demos[key].url = $(`.demo-card [data-demo-launch="${key}"]`).href;
  });
  let activeDemo = 'extranet', demoLauncher = null;
  function sizeDemo() {
    if (!demoViewer.open) return;
    const scale = Math.min(demoScreen.clientWidth / 1000, demoScreen.clientHeight / 610);
    demoFrame.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }
  function selectDemo(key) {
    const demo = demos[key];
    activeDemo = key;
    $('#demo-viewer-title').textContent = demo.title;
    $('#demo-viewer-count').textContent = demo.count;
    $('span', demoNext).textContent = demo.nextLabel;
    demoOpen.href = demo.url;
    demoLoading.hidden = false;
    demoFrame.title = demo.frameTitle;
    demoFrame.src = demo.url;
    sizeDemo();
  }
  $$('[data-demo-launch]').forEach(link => link.addEventListener('click', event => {
    // Preserve new-tab shortcuts and a direct-link fallback without dialog support.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || typeof demoViewer.showModal !== 'function') return;
    event.preventDefault();
    demoLauncher = link;
    demoViewer.showModal();
    document.documentElement.classList.add('demo-is-open');
    selectDemo(link.dataset.demoLaunch);
  }));
  demoNext.addEventListener('click', () => selectDemo(demos[activeDemo].next));
  $('#demo-close').addEventListener('click', () => demoViewer.close());
  demoViewer.addEventListener('click', event => {
    if (event.target !== demoViewer) return;
    const rect = demoViewer.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) demoViewer.close();
  });
  demoViewer.addEventListener('close', () => {
    demoFrame.removeAttribute('src');
    document.documentElement.classList.remove('demo-is-open');
    demoLauncher?.focus({preventScroll: true});
  });
  demoFrame.addEventListener('load', () => {
    if (demoViewer.open) demoLoading.hidden = true;
  });
  new ResizeObserver(sizeDemo).observe(demoScreen);
  // The existing production conversion identifiers and consent key are preserved.
  const banner=$('#cookie-banner');
  let consent=null, pixelsLoaded=false;
  try {consent=localStorage.getItem('aoi_cookies');} catch (_) {}
  const production=/^(www\.)?aoi-network\.com$/.test(location.hostname);
  function loadTrackingPixels() {
    if (pixelsLoaded || !production) return;
    pixelsLoaded=true;
    window._linkedin_partner_id='8742890';
    window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];
    if(!window._linkedin_data_partner_ids.includes('8742890'))window._linkedin_data_partner_ids.push('8742890');
    if(!window.lintrk){window.lintrk=function(a,b){window.lintrk.q.push([a,b]);};window.lintrk.q=[];}
    const linkedin=document.createElement('script');linkedin.async=true;linkedin.src='https://snap.licdn.com/li.lms-analytics/insight.min.js';document.head.appendChild(linkedin);
    if(!window.fbq){
      const fb=window.fbq=function(){fb.callMethod?fb.callMethod.apply(fb,arguments):fb.queue.push(arguments);};
      window._fbq=fb;fb.push=fb;fb.loaded=true;fb.version='2.0';fb.queue=[];
      const meta=document.createElement('script');meta.async=true;meta.src='https://connect.facebook.net/en_US/fbevents.js';document.head.appendChild(meta);
    }
    window.fbq('init','2586678501298941');window.fbq('track','PageView');
  }
  function saveConsent(value){
    consent=value;try{localStorage.setItem('aoi_cookies',value);}catch(_){}
    banner.hidden=true;if(value==='accepted')loadTrackingPixels();
  }
  $('#cookies-accept').addEventListener('click',() => saveConsent('accepted'));
  $('#cookies-reject').addEventListener('click',() => {
    const wasLoaded=pixelsLoaded;saveConsent('refused');if(wasLoaded)location.reload();
  });
  $('#cookie-settings').addEventListener('click',() => {banner.hidden=false;$('#cookies-reject').focus();});
  banner.hidden=consent==='accepted'||consent==='refused';
  if(consent==='accepted')loadTrackingPixels();
  if(production){const analytics=document.createElement('script');analytics.defer=true;analytics.src='/_vercel/insights/script.js';document.head.appendChild(analytics);}
  document.addEventListener('click',event => {
    if(consent!=='accepted'||!production)return;
    const link=event.target.closest('a[href*="rejoindre.html"]');
    if(link){
      if(typeof window.fbq==='function')window.fbq('track','InitiateCheckout');
      if(typeof window.lintrk==='function')window.lintrk('track',{conversion_id:18956748});
    }
  });
})();
