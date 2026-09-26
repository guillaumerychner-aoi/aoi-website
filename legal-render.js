// Shared semantic renderer. Article and legal-data modules remain the content source.
function inline(React, segments) {
  return (segments || []).map((s, i) => {
    const text = s.b ? React.createElement('strong', null, s.t) : s.t;
    return s.h ? React.createElement('a', {key:i, href:s.h}, text) : React.createElement(React.Fragment, {key:i}, text);
  });
}
export function renderBlocks(React, blocks, opts = {}) {
  const h = React.createElement;
  let headingIndex = -1;
  function render(b, key) {
    switch (b.kind) {
      case 'h2': {
        const label=(b.s || []).map(s=>s.t).join('').trim();
        const content=inline(React,b.s);
        return h('h2', {key, id:(opts.idPrefix || 'sec') + '-' + (++headingIndex)}, /^\d+\.\s*Cookies$/i.test(label) ? h('span',{id:'cookies'},content) : content);
      }
      case 'h3': case 'h4': case 'p': return h(b.kind, {key}, inline(React,b.s));
      case 'ul': case 'ol': return h(b.kind, {key}, (b.items || []).map((item,i) => h('li',{key:i},inline(React,item))));
      case 'table':
        return h('div',{key,className:'prose-table',tabIndex:0,role:'region','aria-label':'Tableau à faire défiler horizontalement'},
          h('table',null,h('tbody',null,(b.rows || []).map((row,ri) => h('tr',{key:ri},
            row.map((cell,ci) => h(cell.th ? 'th' : 'td',{key:ci,scope:cell.th ? 'col' : undefined},inline(React,cell.s))))))));
      case 'box':
        return h('div',{key,className:'prose-box prose-box-' + (b.variant || 'info')},(b.inner || []).map((child,i) =>
          child.kind === 'h2' || child.kind === 'h3' ? h('p',{key:i,className:'box-title'},inline(React,child.s)) : render(child,i)));
      case 'quote': return h('blockquote',{key},inline(React,b.s));
      case 'cards':
        return h('div',{key,className:'prose-cards'},(b.items || []).map((card,i) => h('div',{key:i,className:'prose-card'},
          h('span',null,card.name),h('h3',null,card.title),h('p',null,card.text))));
      case 'rows':
        return h('div',{key,className:'prose-rows'},h('h3',null,b.title),(b.rows || []).map((row,i) =>
          h('div',{key:i},h('span',null,row.k),h('strong',null,row.v))));
      default: return null;
    }
  }
  return (blocks || []).map(render);
}
export function tocOf(blocks) {
  return (blocks || []).filter(b => b.kind === 'h2').map((b,i) => ({id:'sec-' + i,label:(b.s || []).map(s => s.t).join('').trim()}));
}
