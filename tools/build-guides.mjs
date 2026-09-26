// Rebuild the eight static guides, Resources and the lightweight article index.
// Usage, from any directory: node tools/build-guides.mjs
// No dependencies and no network calls. The articles/*.js files are the source.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const write = (name, text) => fs.writeFileSync(path.join(root, name), text);
const catalog = JSON.parse(read('content/library.json'));
const order = [...catalog.legacyOrder, ...catalog.newGuides];
const articles = Object.fromEntries(order.map(slug => {
  const source = read(`articles/${slug}.js`);
  const json = source.slice(source.indexOf('export const article =') + 'export const article ='.length).trim().replace(/;$/, '');
  return [slug, JSON.parse(json)];
}));
const base = 'https://www.aoi-network.com/';
const esc = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const jsonLD = value => JSON.stringify(value).replaceAll('<', '\\u003c');
const route = slug => articles[slug]?.href || `article.html?a=${slug}`;
const arrow = '<svg class="icon" aria-hidden="true"><use href="#arrow"/></svg>';
const inline = segments => (segments || []).map(s => {
  let text = esc(s.t);
  if (s.b) text = `<strong>${text}</strong>`;
  return s.h ? `<a href="${esc(s.h)}">${text}</a>` : text;
}).join('');
const plain = segments => (segments || []).map(s => s.t).join('');

function renderBlocks(blocks) {
  let section = -1;
  return blocks.map(b => {
    if (b.kind === 'h2') return `<h2 id="sec-${++section}">${inline(b.s)}</h2>`;
    if (['h3', 'h4', 'p'].includes(b.kind)) return `<${b.kind}>${inline(b.s)}</${b.kind}>`;
    if (b.kind === 'quote') return `<blockquote>${inline(b.s)}</blockquote>`;
    if (['ul', 'ol'].includes(b.kind)) return `<${b.kind}>${b.items.map(item => `<li>${inline(item)}</li>`).join('')}</${b.kind}>`;
    if (b.kind === 'rows') return `<div class="prose-rows"><h3>${esc(b.title)}</h3>${b.rows.map(r => `<div><span>${esc(r.k)}</span><strong>${esc(r.v)}</strong></div>`).join('')}</div>`;
    if (b.kind === 'table') {
      const row = (cells, header) => `<tr>${cells.map((c, i) => header ? `<th scope="col">${inline(c.s)}</th>` : i === 0 ? `<th scope="row">${inline(c.s)}</th>` : `<td>${inline(c.s)}</td>`).join('')}</tr>`;
      return `<div class="prose-table" tabindex="0" role="region" aria-label="Tableau à faire défiler horizontalement"><table><thead>${row(b.rows[0], true)}</thead><tbody>${b.rows.slice(1).map(r => row(r, false)).join('')}</tbody></table></div>`;
    }
    throw new Error(`Unsupported block: ${b.kind}`);
  }).join('\n');
}

const index = Object.fromEntries(order.map(slug => {
  const a = articles[slug];
  return [slug, {title:a.title, tags:a.tags, href:route(slug), ...(catalog.related[slug] || a.related ? {related:catalog.related[slug] || a.related} : {})}];
}));
write('articles-index.js', `// Index des ${order.length} guides : ${catalog.newGuides.length} articles ont une page HTML complète.\nexport const order = `+JSON.stringify(order)+';\n\nexport const index = '+JSON.stringify(index)+';\n');

const relatedCard = slug => {
  const a = articles[slug];
  if (!a) throw new Error(`Unknown related guide: ${slug}`);
  return `<a class="related-card" href="${esc(route(slug))}"><span>${esc(a.tags[0])}</span><h3>${esc(a.title)}</h3><strong>Lire le guide ${arrow}</strong></a>`;
};

fs.mkdirSync(path.join(root, 'guides'), {recursive:true});
for (const slug of catalog.newGuides) {
  const a = articles[slug];
  const toc = a.blocks.filter(b => b.kind === 'h2').map((b,i) => `<a href="#sec-${i}">${esc(plain(b.s))}</a>`).join('');
  const next = a.next?.slug;
  const content = `<main id="contenu">
<div class="reading-progress" aria-hidden="true"><span></span></div>
<section class="page-hero section-dark article-hero" id="top"><div class="wrap">
<a class="breadcrumb" href="ressources.html">← Tous les guides</a>
<div class="guide-hero-layout"><div><div class="article-tags"><span>Guide n° ${a.number}</span>${a.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div>
<h1 class="page-title">${esc(a.title)}</h1><p class="page-lead">${esc(a.lead)}</p></div>
<figure class="guide-hero-visual"><img src="${esc(a.image)}" alt="${esc(a.imageAlt)}" width="${a.imageWidth}" height="${a.imageHeight}" fetchpriority="high" decoding="async"></figure></div>
<div class="article-meta"><time datetime="${a.datePublished}">${esc(a.meta[0])}</time><span>${esc(a.meta[1])}</span><span>${esc(a.meta[2])}</span><a href="#auteur">Par ${esc(a.author.name)}</a></div>
</div></section>
<section class="page-section"><div class="wrap reader-layout">
<aside class="reader-sidebar"><details class="reader-toc" open><summary>Dans ce guide <span aria-hidden="true">+</span></summary><nav aria-label="Sommaire du guide">${toc}</nav></details><div class="reader-join"><p>Une question.<br><em>Une personne pour avancer.</em></p><a class="text-link" href="rejoindre.html">Rejoindre le réseau ${arrow}</a></div></aside>
<article class="reader-content"><div class="guide-notice"><strong>À visée informative</strong><p>${esc(a.notice)}</p></div>
<div class="prose">${renderBlocks(a.blocks)}</div>
<section class="article-faq" aria-label="Questions fréquentes"><p class="eyebrow">Les questions qui reviennent</p><div class="faq-list">${a.faq.map(q=>`<details><summary>${esc(q.q)}<span aria-hidden="true">+</span></summary><p>${esc(q.a)}</p></details>`).join('')}</div></section>
<div class="author-card" id="auteur"><span class="author-initials" aria-hidden="true">${a.author.ini}</span><div><p class="eyebrow">Le regard du terrain</p><strong>${esc(a.author.name)}</strong><p>${esc(a.author.bio)}</p></div></div>
<p class="guide-warning">${esc(a.warning)}</p>
<div class="article-invitation"><p class="eyebrow copper">${esc(a.cta.mark)}</p><h2>${esc(a.cta.title)}</h2><p>${esc(a.cta.text)}</p><a class="button button-orange" href="rejoindre.html">Créer mon compte gratuit ${arrow}</a></div>
<nav class="article-next" aria-label="Parcourir les guides"><a href="ressources.html">← Tous les guides</a>${next?`<a href="${esc(route(next))}">Guide suivant : ${esc(articles[next].title)} →</a>`:''}</nav>
</article></div></section>
<section class="related-guides"><div class="wrap"><p class="eyebrow">Poursuivre la lecture</p><div class="related-grid">${a.related.map(relatedCard).join('')}</div></div></section>
</main>`;
  let html = read('article.html')
    .replace('<script src="./support.js"></script>', '')
    .replace(/<script type="module">[\s\S]*?<\/script>/g, '')
    .replace(/<script type="text\/x-dc"[\s\S]*?<\/script>/g, '')
    .replace(/<noscript>[\s\S]*?<\/noscript>/g, '')
    .replace(/<main id="contenu">[\s\S]*?<\/main>/, content)
    .replace('class="aoi-inner page-article"', 'class="aoi-inner page-article page-guide"')
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(a.title)} — AOI Network</title>`);
  const meta = (attr, key, value) => { html=html.replace(new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`), (_,p,q)=>p+esc(value)+q); };
  meta('name','description',a.description);
  meta('property','og:type','article');
  meta('property','og:title',a.title);
  meta('property','og:description',a.description);
  meta('property','og:url',base+a.href);
  meta('property','og:image',base+a.image);
  meta('name','twitter:title',a.title);
  meta('name','twitter:description',a.description);
  meta('name','twitter:image',base+a.image);
  html=html.replace(/(<link rel="canonical" href=")[^"]*(")/, (_,p,q)=>p+base+a.href+q);
  const structured={
    '@context':'https://schema.org','@graph':[
      {'@type':'BlogPosting','@id':base+a.href+'#article',mainEntityOfPage:base+a.href,headline:a.title,description:a.description,
       image:[base+a.image],inLanguage:'fr-FR',datePublished:a.datePublished,dateModified:a.dateModified,
       author:{'@type':'Person',name:a.author.name,url:base+a.href+'#auteur'},publisher:{'@type':'Organization',name:'AOI Network',url:base},
       isAccessibleForFree:true,articleSection:a.tags},
      {'@type':'BreadcrumbList',itemListElement:[
        {'@type':'ListItem',position:1,name:'Accueil',item:base},
        {'@type':'ListItem',position:2,name:'Ressources',item:base+'ressources.html'},
        {'@type':'ListItem',position:3,name:a.title,item:base+a.href}
      ]}
    ]
  };
  html=html.replace('</head>',`<meta property="og:image:alt" content="${esc(a.imageAlt)}">\n<meta property="article:published_time" content="${a.datePublished}">\n<meta property="article:modified_time" content="${a.dateModified}">\n<script type="application/ld+json">${jsonLD(structured)}</script>\n<script defer src="assets/aoi-guides.js"></script>\n</head>`);
  // The shared template uses root-relative file names; new pages live in /guides/.
  html=html.replace(/\b(href|src)="([^"\s]+)"/g, (match,attr,url) => /^(?:https?:|mailto:|tel:|data:|#|\/)/.test(url)?match:`${attr}="../${url}"`);
  write(a.href,html);
}

const newCards=catalog.newGuides.map(slug=>{
  const a=articles[slug];
  return {number:`N° ${a.number}`,title:a.title,description:a.description,date:'Septembre 2026',tags:a.tags,image:a.image,href:a.href,isNew:true,width:a.imageWidth,height:a.imageHeight};
});
const cards=[...newCards,...catalog.legacyCards];
const cardHtml=cards.map(c=>`<a class="guide-card" href="${esc(c.href)}"><div class="guide-image"><img src="${esc(c.image)}" alt="" width="${c.width||1600}" height="${c.height||893}" loading="lazy" decoding="async"><span class="guide-number">${esc(c.number)}</span>${c.isNew?'<span class="guide-new">Nouveau</span>':''}</div><div class="guide-copy"><div class="guide-tags">${c.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div><h3>${esc(c.title)}</h3><p>${esc(c.description)}</p><div class="guide-card-bottom"><span>${esc(c.date)}</span><strong>Lire le guide ${arrow}</strong></div></div></a>`).join('\n');
let resource=read('templates/ressources.html').replaceAll('{{GUIDE_COUNT}}',String(order.length)).replace('{{GUIDE_CARDS}}',cardHtml);
const collection={'@context':'https://schema.org','@type':'CollectionPage',name:'La bibliothèque AOI',url:base+'ressources.html',inLanguage:'fr-FR',
  mainEntity:{'@type':'ItemList',numberOfItems:order.length,itemListElement:['pourquoi-un-reseau',...cards.map(c=>c.href)].map((item,i)=>({'@type':'ListItem',position:i+1,url:base+(i===0?route(item):item)}))}};
resource=resource.replace('</head>',`<script type="application/ld+json">${jsonLD(collection)}</script>\n</head>`);
write('ressources.html',resource);

// Keep all existing locations and add only the eight new canonical URLs.
let sitemap=read('sitemap.xml');
for(const slug of catalog.newGuides){
  const href=base+route(slug);
  if(!sitemap.includes(`<loc>${href}</loc>`))sitemap=sitemap.replace('</urlset>',`  <url>\n    <loc>${href}</loc>\n    <lastmod>${articles[slug].dateModified}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n</urlset>`);
  else sitemap=sitemap.replace(/<url>[\s\S]*?<\/url>/g, entry=>entry.includes(`<loc>${href}</loc>`)?entry.replace(/<lastmod>[^<]*<\/lastmod>/,`<lastmod>${articles[slug].dateModified}</lastmod>`):entry);
}
sitemap=sitemap.replace(/(<loc>https:\/\/www\.aoi-network\.com\/ressources\.html<\/loc>\s*<lastmod>)[^<]+/, (_,prefix)=>prefix+'2026-09-26');
write('sitemap.xml',sitemap);
console.log(`${catalog.newGuides.length} pages HTML, ${cards.length} cartes + 1 guide à la une, ${order.length} guides au total.`);
