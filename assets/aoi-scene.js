/* AOI — each arrival belongs to a distinct interval of the page scroll. */
(function () {
  'use strict';
  const track=document.getElementById('reseau');
  const film=document.getElementById('network-film');
  if(!track || !film)return;
  const $=selector=>film.querySelector(selector);
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const phone=window.matchMedia('(max-width:700px)');
  const title=$('#film-title'),property=$('#film-property'),after=$('#film-after');
  const operator=$('#film-operator'),operatorLabel=$('#film-operator-label');
  const documents=$('#film-documents'),documentLabel=$('.film-document-label');
  const associates=$('#film-associates'),builder=$('#film-builder');
  const faces=Array.from(associates.querySelectorAll('.film-portrait'));
  const experts=Array.from(film.querySelectorAll('.film-expert'));
  const paths=Array.from(film.querySelectorAll('.film-connections path'));
  const halo=$('.film-halo'),caption=$('#film-property-caption');
  const control=$('#film-control'),controlLabel=$('.film-control-label'),controlIcon=$('.film-control-icon');
  const cue=$('#film-cue'),status=$('#film-status');
  const clamp=v=>Math.max(0,Math.min(1,v));
  const range=(p,a,b)=>clamp((p-a)/(b-a));
  const ease=v=>1-Math.pow(1-clamp(v),3);
  const mix=(a,b,t)=>a+(b-a)*t;
  // Arrivals never overlap. Both associates and the contractor are settled
  // before the renovated photograph can begin to appear at 89%.
  const expertStarts=[.065,.16,.255,.35,.445];
  const associateStarts=[.605,.69];
  const stops=[.15,.245,.34,.435,.53,.59,.68,.77,.88,1];
  const titles=['Une opportunité.','Les bonnes expertises.','Un dossier complet.','Des co-opérateurs.','Place aux travaux.','Le projet prend vie.'];
  const captions=['Un bien à réinventer.','L’étude prend forme.','Le dossier est prêt.','L’équipe se constitue.','Le chantier peut commencer.','Une nouvelle vie.'];
  let start=0,distance=1400,progress=0,frame=0,phase=-1,lastAnnouncement='';
  function place(el,x,y,opacity,dx=0,dy=0,scale=1){
    el.style.left=`${x}%`;el.style.top=`${y}%`;el.style.opacity=opacity;
    el.style.transform=`translate(-50%,-50%) translate(${dx}vw,${dy}px) scale(${scale})`;
  }
  function draw(p){
    progress=p;
    const mobile=phone.matches,assembling=ease(range(p,0,.065));
    const completion=range(p,.89,.985);
    const current=p<.065?0:p<.535?1:p<.605?2:p<.79?3:p<.89?4:5;
    if(current!==phase){
      phase=current;film.dataset.phase=String(phase);
      title.textContent=titles[phase];caption.textContent=captions[phase];
    }
    film.dataset.progress=String(Math.round(p*10000)/100);
    film.dataset.renovation=String(Math.round(completion*100));
    film.dataset.state=p>=.999?'complete':p<=0?'start':'scroll';
    property.style.left=`${mix(mobile?57:60,50,assembling)}%`;
    property.style.transform=`translate(-50%,-50%) rotate(${mix(-3,0,assembling)}deg) scale(${mix(1,1.025,completion)})`;
    after.style.clipPath=`inset(0 ${(1-completion)*100}% 0 0)`;
    place(operator,mix(mobile?26:22,mobile?17:39,assembling),mix(mobile?73:52,mobile?87:82,assembling),1);
    operatorLabel.textContent=assembling<.5?'Je porte un projet.':'Opérateur';
    const points=mobile?[[17,13],[50,13],[83,13],[83,60],[17,60]]:[[18,17],[82,17],[12,49],[88,49],[17,82]];
    let active='Opérateur';
    experts.forEach((person,i)=>{
      const entry=ease(range(p,expertStarts[i],expertStarts[i]+.08));
      const [x,y]=points[i];
      place(person,x,y,entry,(x<50?-1:1)*(1-entry)*(mobile?55:35),(1-entry)*12,mix(.94,1,entry));
      person.classList.toggle('is-current',p>=expertStarts[i] && p<(expertStarts[i+1]||.535));
      paths[i].style.opacity=entry*.35;
      if(p>=expertStarts[i])active=person.textContent.trim();
    });
    const paperIn=ease(range(p,.10,.245)),paperOut=ease(range(p,.77,.86));
    documents.style.opacity=paperIn*(1-paperOut);
    documents.style.transform=`translate(-50%,-50%) translate(${(1-paperIn)*-45+paperOut*40}px,${(1-paperIn)*35-paperOut*20}px) rotate(${mix(-9,-3,paperIn)}deg) scale(${mix(.78,1,paperIn)})`;
    documentLabel.textContent=p<.535?'Le dossier prend forme.':'Le dossier est prêt.';
    if(p>=.535)active='Le dossier est prêt.';
    place(associates,mobile?50:61,mobile?87:82,1);
    faces.forEach((face,i)=>{
      const entry=ease(range(p,associateStarts[i],associateStarts[i]+.07));
      face.style.opacity=entry;
      face.style.transform=`translate(${(1-entry)*(mobile?160:270)}px,${(1-entry)*20}px)`;
    });
    associates.querySelector('.film-role').style.opacity=ease(range(p,.605,.675));
    associates.classList.toggle('is-current',p>=.605 && p<.79);
    if(p>=.605)active=p<.69?'Un co-opérateur rejoint le projet.':'Les co-opérateurs ont rejoint le projet.';
    const building=ease(range(p,.79,.87));
    place(builder,83,mobile?87:82,building,(1-building)*(mobile?50:35),(1-building)*20,mix(.94,1,building));
    builder.classList.toggle('is-current',p>=.79 && p<.89);
    paths[5].style.opacity=building*.35;
    if(p>=.79)active='L’entreprise de travaux rejoint le projet.';
    if(p>=.89)active='L’équipe est réunie. La rénovation prend vie.';
    if(active!==lastAnnouncement){status.textContent=active;lastAnnouncement=active;}
    halo.style.opacity=mix(.45,1,completion);
    film.style.setProperty('--film-progress',`${100*p}%`);
    const complete=p>=.999;
    controlLabel.textContent=complete?'Revoir':'Étape suivante';
    controlIcon.textContent=complete?'↺':'→';
    control.setAttribute('aria-label',complete?'Revoir la rencontre depuis le début':'Étape suivante de la rencontre');
    cue.innerHTML=complete?'Une équipe. Un projet.':'Au fil du scroll, l’équipe se forme <span aria-hidden="true">↓</span>';
  }
  function render(){
    frame=0;
    draw(reduced.matches?1:clamp((window.scrollY-start)/distance));
  }
  function queue(){if(!frame)frame=requestAnimationFrame(render);}
  function measure(){
    distance=Math.round(Math.max(1200,Math.min(1600,window.innerHeight*1.7)));
    track.style.setProperty('--film-height',`${film.offsetHeight}px`);
    track.style.setProperty('--film-distance',`${distance}px`);
    track.classList.toggle('is-scroll-ready',!reduced.matches);
    start=track.getBoundingClientRect().top+window.scrollY-(parseFloat(getComputedStyle(film).top)||0);
    control.hidden=reduced.matches;
    render();
  }
  // Each animation frame follows a real scroll/resize event. No clock,
  // autoplay, catch-up loop or wheel/touch interception.
  window.addEventListener('scroll',queue,{passive:true});
  window.addEventListener('resize',measure,{passive:true});
  window.addEventListener('pageshow',measure);
  new ResizeObserver(measure).observe(film);
  phone.addEventListener('change',measure);
  reduced.addEventListener('change',measure);
  control.addEventListener('click',()=>{
    const target=progress>=.999?0:stops.find(stop=>stop>progress+.003)??1;
    window.scrollTo({top:start+target*distance,behavior:'instant'});
  });
  document.fonts.ready.then(measure);
  measure();
})();
