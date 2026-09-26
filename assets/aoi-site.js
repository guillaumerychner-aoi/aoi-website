(function () {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
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
  const foldTocs = () => { if (window.matchMedia('(max-width:960px)').matches) $$('.reader-toc').forEach(el => el.open = false); };
  window.addEventListener('load', foldTocs, {once:true});
  // Documents render after their module loads. Restore direct section links then.
  function followDocumentHash() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch (_) { return; }
    if (!id) return;
    const hash = location.hash, content = document.getElementById('contenu');
    if (!content) return;
    let observer, expiry;
    const follow = () => {
      const target = document.getElementById(id);
      if (!target) return;
      observer.disconnect(); clearTimeout(expiry);
      (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
        if (location.hash !== hash) return;
        requestAnimationFrame(() => target.scrollIntoView({block:'start', behavior:'instant'}));
      });
    };
    observer = new MutationObserver(follow);
    observer.observe(content, {childList:true, subtree:true});
    expiry = setTimeout(() => observer.disconnect(), 12000);
    follow();
  }
  window.addEventListener('hashchange', followDocumentHash);
  followDocumentHash();
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
    const link=event.target.closest('a[href*="rejoindre.html"],a[href*="choix-abonnement.html"]');
    if(link){
      if(typeof window.fbq==='function')window.fbq('track','InitiateCheckout');
      if(typeof window.lintrk==='function')window.lintrk('track',{conversion_id:18956748});
    }
  });
})();
