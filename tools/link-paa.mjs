// Domaine PAA confirmé : node tools/link-paa.mjs https://piecesalappui.fr
// Actualise les accès PAA (missions, rapport, honoraires, cadre et contact).
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
const targets = {
  site: origin,
  contact: `${origin}/contact.html`,
  report: `${origin}/exemple.html`,
  analysis: `${origin}/methode.html`,
  followup: `${origin}/suivi.html`,
  delays: `${origin}/retards.html`,
  offers: `${origin}/offres.html`,
  independence: `${origin}/independance.html#notre-engagement`,
  expertise: `${origin}/equipe.html#experts-reseau`,
};
const updates = [];
let total = 0;
for (const [name, expected] of [['index.html', 1], ['accompagnement.html', 1], ['pieces-a-lappui.html', 10], ['cadre-missions.html', 2]]) {
  const path = fileURLToPath(new URL(`../${name}`, import.meta.url));
  const html = readFileSync(path, 'utf8');
  let count = 0;
  const updated = html.replace(/(<a\b[^>]*\bdata-paa-link="([a-z]+)"[^>]*\bhref=")[^"]*(")/g, (_, before, kind, after) => {
    if (!Object.hasOwn(targets, kind)) throw new Error(`Type de lien PAA inconnu : ${kind}. Aucun fichier modifié.`);
    count++;
    return `${before}${targets[kind]}${after}`;
  });
  if (count !== expected) throw new Error(`Repères PAA inattendus dans ${name}. Aucun fichier modifié.`);
  total += count;
  updates.push([path, updated]);
}
for (const [path, updated] of updates) writeFileSync(path, updated);
console.log(`Les ${total} liens vers les pages PAA sont configurés.`);
