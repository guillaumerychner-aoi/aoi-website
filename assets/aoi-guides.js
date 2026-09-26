// Progressive enhancement only: all guide content and links are already HTML.
(() => {
  if (!document.body.classList.contains('page-guide')) return;
  const toc = document.querySelector('.reader-toc');
  const progress = document.querySelector('.reading-progress span');
  const headings = [...document.querySelectorAll('.prose h2[id]')];
  const links = [...document.querySelectorAll('.reader-toc nav a')];
  const narrow = matchMedia('(max-width:960px)');
  const setToc = () => { if (toc) toc.open = !narrow.matches; };
  setToc();
  narrow.addEventListener('change', setToc);
  let scheduled = false;
  const update = () => {
    scheduled = false;
    const extent = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.width = `${Math.min(100, Math.max(0, scrollY / Math.max(1, extent) * 100))}%`;
    let active = 0;
    headings.forEach((h,i) => { if (h.getBoundingClientRect().top <= 150) active=i; });
    links.forEach((a,i) => i === active ? a.setAttribute('aria-current','location') : a.removeAttribute('aria-current'));
  };
  addEventListener('scroll', () => { if (!scheduled) { scheduled=true; requestAnimationFrame(update); } }, {passive:true});
  addEventListener('resize', update, {passive:true});
  update();
})();
