// Rendu typographique des documents légaux AOI (contenu extrait des pages d'origine).
const INK = '#141210', BODY = '#3B372F', MUTED = '#6B655C', ORANGE = '#E4571B', LINE = 'rgba(20,18,16,.12)';

function inline(React, segs, key) {
  return (segs || []).map((s, i) => {
    if (s.h) return React.createElement('a', { key: i, href: s.h, style: { color: ORANGE, textDecoration: 'underline', textUnderlineOffset: '2px' } }, s.t);
    if (s.b) return React.createElement('strong', { key: i, style: { fontWeight: 700, color: INK } }, s.t);
    return React.createElement('span', { key: i }, s.t);
  });
}

const boxStyles = {
  alert: { background: 'rgba(228,87,27,.07)', border: '1px solid rgba(228,87,27,.3)', accent: '#9A3B10' },
  critical: { background: 'rgba(180,35,24,.06)', border: '1px solid rgba(180,35,24,.28)', accent: '#8F2A1C' },
  info: { background: 'rgba(20,18,16,.035)', border: '1px solid rgba(20,18,16,.12)', accent: MUTED },
  toc: { background: '#fff', border: '1px solid rgba(20,18,16,.12)', accent: MUTED },
};

export function renderBlocks(React, blocks, opts) {
  const o = opts || {};
  let h2i = -1;
  const el = (b, i) => {
    switch (b.kind) {
      case 'h2': {
        h2i++;
        return React.createElement('h2', { key: i, id: (o.idPrefix || 'sec') + '-' + h2i, style: { fontFamily: "'Instrument Serif',serif", fontWeight: 400, fontSize: 'clamp(26px,2.6vw,38px)', lineHeight: 1.08, letterSpacing: '-.02em', color: INK, margin: '56px 0 18px', paddingTop: '26px', borderTop: '1px solid ' + LINE, scrollMarginTop: '90px' } }, inline(React, b.s));
      }
      case 'h3':
        return React.createElement('h3', { key: i, style: { fontSize: '17px', fontWeight: 700, color: INK, margin: '30px 0 10px', letterSpacing: '-.005em' } }, inline(React, b.s));
      case 'h4':
        return React.createElement('h4', { key: i, style: { fontSize: '14px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '.08em', margin: '22px 0 8px' } }, inline(React, b.s));
      case 'p':
        return React.createElement('p', { key: i, style: { fontSize: '15.5px', lineHeight: 1.65, color: BODY, margin: '0 0 14px', textAlign: 'justify', hyphens: 'auto', textAlignLast: 'start' } }, inline(React, b.s));
      case 'ul':
        return React.createElement('ul', { key: i, style: { listStyle: 'none', margin: '4px 0 18px', padding: 0, display: 'flex', flexDirection: 'column', gap: '9px' } },
          (b.items || []).map((it, j) => React.createElement('li', { key: j, style: { display: 'grid', gridTemplateColumns: '14px 1fr', gap: '10px', fontSize: '15.5px', lineHeight: 1.6, color: BODY, textAlign: 'justify', hyphens: 'auto', textAlignLast: 'start' } },
            React.createElement('span', { style: { color: ORANGE, fontWeight: 700, lineHeight: 1.5 } }, '·'),
            React.createElement('span', null, inline(React, it)))));
      case 'table':
        return React.createElement('div', { key: i, style: { overflowX: 'auto', margin: '10px 0 24px', border: '1px solid ' + LINE, borderRadius: '14px', background: '#fff' } },
          React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' } },
            React.createElement('tbody', null, (b.rows || []).map((r, ri) => React.createElement('tr', { key: ri },
              r.map((c, ci) => React.createElement(c.th ? 'th' : 'td', {
                key: ci,
                style: {
                  textAlign: 'left', verticalAlign: 'top', padding: '12px 14px',
                  borderBottom: ri === b.rows.length - 1 ? 'none' : '1px solid ' + LINE,
                  borderRight: ci === r.length - 1 ? 'none' : '1px solid ' + LINE,
                  fontWeight: c.th ? 700 : 400, color: c.th ? INK : BODY,
                  background: c.th ? 'rgba(20,18,16,.03)' : 'transparent',
                  fontSize: c.th ? '12px' : '14px',
                  textTransform: c.th ? 'uppercase' : 'none',
                  letterSpacing: c.th ? '.08em' : 'normal',
                  lineHeight: 1.5,
                },
              }, inline(React, c.s))))))));
      case 'box': {
        const st = boxStyles[b.variant] || boxStyles.info;
        return React.createElement('div', { key: i, style: { background: st.background, border: st.border, borderRadius: '16px', padding: '22px 24px', margin: '18px 0 24px' } },
          (b.inner || []).map((ib, j) => {
            if (ib.kind === 'h3' || ib.kind === 'h2') return React.createElement('div', { key: j, style: { fontSize: '12.5px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: st.accent, margin: j ? '14px 0 8px' : '0 0 10px' } }, inline(React, ib.s));
            if (ib.kind === 'p') return React.createElement('p', { key: j, style: { fontSize: '15px', lineHeight: 1.6, color: BODY, margin: '0 0 10px', textAlign: 'justify', hyphens: 'auto', textAlignLast: 'start' } }, inline(React, ib.s));
            return el(ib, 'b' + j);
          }));
      }
      case 'ol':
        return React.createElement('ol', { key: i, style: { listStyle: 'none', margin: '4px 0 18px', padding: 0, display: 'flex', flexDirection: 'column', gap: '11px', counterReset: 'n' } },
          (b.items || []).map((it, j) => React.createElement('li', { key: j, style: { display: 'grid', gridTemplateColumns: '26px 1fr', gap: '12px', fontSize: '15.5px', lineHeight: 1.6, color: BODY, textAlign: 'justify', hyphens: 'auto', textAlignLast: 'start' } },
            React.createElement('span', { style: { fontFamily: "'Instrument Serif',serif", fontSize: '17px', color: ORANGE, lineHeight: 1.35 } }, String(j + 1).padStart(2, '0')),
            React.createElement('span', null, inline(React, it)))));
      case 'quote':
        return React.createElement('blockquote', { key: i, style: { margin: '30px 0', padding: '24px 26px', background: 'rgba(228,87,27,.05)', borderRadius: '16px', borderLeft: '2px solid ' + ORANGE, fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontSize: 'clamp(19px,1.9vw,25px)', lineHeight: 1.35, color: INK } }, inline(React, b.s));
      case 'cards':
        return React.createElement('div', { key: i, style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))', gap: '14px', margin: '22px 0 26px' } },
          (b.items || []).map((c, j) => React.createElement('div', { key: j, style: { padding: '20px 20px 18px', background: '#fff', border: '1px solid ' + LINE, borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '7px' } },
            React.createElement('div', { style: { fontFamily: 'ui-monospace,monospace', fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', color: '#9A3B10' } }, c.name),
            React.createElement('div', { style: { fontFamily: "'Instrument Serif',serif", fontSize: '21px', lineHeight: 1.1, color: INK } }, c.title),
            React.createElement('p', { style: { fontSize: '14px', lineHeight: 1.5, color: BODY, margin: 0, textAlign: 'justify', hyphens: 'auto', textAlignLast: 'start' } }, c.text))));
      case 'rows':
        return React.createElement('div', { key: i, style: { margin: '24px 0 28px', border: '1px solid ' + LINE, borderRadius: '16px', overflow: 'hidden', background: '#fff' } },
          React.createElement('div', { style: { padding: '16px 20px', borderBottom: '1px solid ' + LINE, fontWeight: 700, fontSize: '15px', color: INK, background: 'rgba(20,18,16,.03)' } }, b.title),
          (b.rows || []).map((r, j) => React.createElement('div', { key: j, style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '13px 20px', borderBottom: j === b.rows.length - 1 ? 'none' : '1px solid rgba(20,18,16,.07)' } },
            React.createElement('span', { style: { fontSize: '14.5px', color: BODY } }, r.k),
            React.createElement('span', { style: { fontFamily: 'ui-monospace,monospace', fontSize: '13px', fontWeight: 700, color: '#1E6B4B', whiteSpace: 'nowrap' } }, r.v))));
      default:
        return null;
    }
  };
  return (blocks || []).map(el);
}

export function tocOf(blocks) {
  let i = -1;
  return (blocks || []).filter(b => b.kind === 'h2').map(b => { i++; return { id: 'sec-' + i, label: (b.s || []).map(s => s.t).join('').trim() }; });
}
