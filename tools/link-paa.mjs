// Domaine PAA confirmé : node tools/link-paa.mjs https://piecesalappui.fr
// Actualise les liens explicites du site et du formulaire, sans toucher aux adhésions.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const raw = process.argv[2];
let url;
try {
  url = new URL(raw);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error();
} catch {
  console.error('Indiquer l’origine HTTPS du site PAA confirmé, sans chemin, identifiants, paramètres ni fragment.');
  process.exit(1);
}
const origin = url.origin.replaceAll('&','&amp;').replaceAll('"','&quot;');
const targets = { site: origin, contact: `${origin}/contact.html` };
const updates = [];
for (const [name, expected] of [['index.html', 1], ['accompagnement.html', 1], ['pieces-a-lappui.html', 3]]) {
  const path = fileURLToPath(new URL(`../${name}`, import.meta.url));
  const html = readFileSync(path, 'utf8');
  let count = 0;
  const updated = html.replace(/(<a\b[^>]*\bdata-paa-link="(site|contact)"[^>]*\bhref=")[^"]*(")/g, (_, before, kind, after) => {
    count++;
    return `${before}${targets[kind]}${after}`;
  });
  if (count !== expected) throw new Error(`Repères PAA inattendus dans ${name}. Aucun fichier modifié.`);
  updates.push([path, updated]);
}
for (const [path, updated] of updates) writeFileSync(path, updated);
console.log('Les cinq liens vers le site PAA et son formulaire sont configurés.');
