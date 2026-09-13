# AOI Network — site vitrine

Site statique, sans build et sans dépendance npm. Déploiement Vercel sur `www.aoi-network.com`.

Cette version est la refonte graphique de septembre 2026, réintégrée avec les éléments
de production de l'ancien site (SEO, favicons, consentement cookies, pixels, redirections).

---

## Arborescence

```
/
├── index.html                 Accueil
├── rejoindre.html             Adhésion (formulaire → API extranet)
├── ressources.html            Bibliothèque (remplace /blog/)
├── article.html               Gabarit unique des 7 guides (?a=slug)
├── operation.html             Fiche opération publique
├── choix-abonnement.html      Bascule vers l'adhésion gratuite
├── demo-ia.html               Analyse d'adresse
├── demo-extranet.html         Démo animée (affichée en cadre sur l'accueil)
├── demo-logiciel.html         Démo animée (affichée en cadre sur l'accueil)
├── cgv.html
├── mentions-legales.html
├── 404.html
│
├── support.js                 Runtime de rendu — requis par toutes les pages
├── legal-render.js            Rendu typographique des documents légaux
├── legal-data.js              Texte CGV + mentions légales
├── articles-index.js          Index des guides : ordre, titres, tags
├── articles/<slug>.js         Un module par guide, chargé à la demande
│
├── assets/                    Images (illustrations guides, portraits, SEP Normandie)
├── favicon.ico, favicon-*.png, apple-touch-icon.png, android-chrome-*.png
├── og-image.png, site.webmanifest
├── robots.txt, sitemap.xml, vercel.json
└── README.md
```

Les pages chargent `support.js`, `legal-data.js` et `articles-data.js` en modules ES :
pas d'ouverture en `file://`. Pour tester en local : `npx serve` ou
`python3 -m http.server` à la racine.

---

## Système graphique

- Fond crème `#FAF7F2` · encre `#141210` · texte courant `#3B372F` · gris secondaire `#6B655C`
- Accent orange `#E4571B` (foncé `#9A3B10`, clair `#F49A6A`) · sombre `#0E0D0B`
- Titres **Instrument Serif** · texte **Manrope** (Google Fonts, chargées par page)
- Styles 100 % en ligne : aucune feuille de style globale à maintenir
- Alternance clair / sombre : le noir ne sert que deux fois par page au maximum

---

## Ce qui est branché et fonctionnel

**Inscription** — `POST https://extranet.aoi-network.com/api/subscription/register-checkout`
avec la charge utile historique : `{ plan, userData }`, `plan = 'niveau2'` pour les prestataires
et `'niveau3'` sinon ; `userData = { email, prenom, nom, telephone, societe, ville, activite,
profile_type, presentation }`.
⚠️ Le mode démo du formulaire a été **désactivé** (`rejoindre.html`, ~ligne 321) : l'inscription
part réellement en production. Voir « Repasser en mode démo » plus bas si besoin de tester.

**Capture d'abandon** — `POST .../api/contact/callback` à la perte de focus du champ email
(`source: 'abandon_formulaire'`).

**Consentement & pixels** — bandeau cookies sur les 10 pages publiques, aux couleurs de la refonte.
Les pixels ne se chargent qu'après acceptation. Clé `localStorage: aoi_cookies` — identique
à l'ancien site, les consentements déjà donnés sont donc conservés.
- Meta Pixel `2586678501298941` (PageView, InitiateCheckout, CompleteRegistration)
- LinkedIn Insight `8742890` (conversions `18956748` clic adhésion, `18956756` inscription)
- Vercel Analytics (`/_vercel/insights/script.js`)

**SEO** — `lang="fr"`, `<title>`, meta description, canonical, Open Graph, Twitter Card et
favicons sur chaque page. `article.html` met à jour titre, description et canonical
dynamiquement selon le slug chargé.

**Redirections** (`vercel.json`) — les 7 anciennes URL `/blog/*.html` redirigent en 301 vers
`/article.html?a=slug`, `/blog/` vers `/ressources.html`, `/accueil*` vers `/`.
Le référencement acquis est donc transféré.

**Liens** — extranet, WhatsApp `wa.me/33763782041`, `contact@aoi-network.com`, LinkedIn.

---

## Reste à faire

1. **Fiche opération** — `operation.html` affiche un exemple statique. Rebrancher
   `fetch('https://extranet.aoi-network.com/api/public/sep/' + id)` (id lu dans l'URL) et
   injecter `title, city, status, descriptionPublique, porteur{prenom,societe,ville},
   margeBrute, rentabilite, participationsCount, searchingFor[]`, plus les états
   « introuvable » (404), « clôturée » (410) et « erreur de chargement ».
2. **Analyse d'adresse** — `demo-ia.html` affiche des valeurs illustratives. Rebrancher
   DVF / API Urbanisme / Cadastre et la limite de 5 analyses par heure.
3. **Chiffres d'exemple** — le déroulé d'opération de l'accueil (620 k€ / 520 k€ / 260 k€,
   308 k€ de missions) est un exemple cohérent, **à remplacer par les vrais chiffres**.
4. **Newsletter** — le formulaire `POST .../api/newsletter` de l'ancien site n'a pas été repris
   dans la refonte. À replacer si souhaité.
5. **Menu mobile plein écran** — remplacé par une navigation qui se replie. À rétablir si tu y tiens.
6. **Icônes Lucide** — remplacées par des repères typographiques (une dépendance externe
   et le scintillement au chargement en moins). Rien à faire, sauf si tu veux les réintroduire.
7. **Stripe** — aucun lien de paiement n'existait dans le parcours d'adhésion (l'ancien code le
   contournait : « adhésion gratuite, bypass Stripe »). Rien n'a été perdu. Si une option payante
   revient, elle devra être ajoutée côté extranet.

---

## Repasser le formulaire en mode démo

Dans `rejoindre.html`, remplacer la ligne

```js
// [PROD] Mode démo désactivé : l'inscription appelle réellement l'API extranet.
```

par

```js
if (this.props.demoMode ?? true) { setTimeout(succeed, 600); return; }
```

L'écran de confirmation s'affiche alors sans appeler l'API.

---

## Vérifications après mise en ligne

- [ ] Inscription réelle depuis `rejoindre.html` → l'utilisateur apparaît dans l'extranet
- [ ] Bandeau cookies : accepter → Meta Pixel et LinkedIn visibles dans les DevTools
- [ ] `/blog/sep-immobiliere.html` redirige bien en 301 vers `/article.html?a=sep-immobiliere`
- [ ] Les 7 guides s'affichent depuis la Bibliothèque
- [ ] Partage d'un lien sur LinkedIn/WhatsApp → aperçu avec `og-image.png`
- [ ] Resoumettre `sitemap.xml` dans la Search Console

---

## Bibliothèque — les 14 guides

Sept guides d'origine (février-mars 2026) et sept ajoutés en septembre 2026 :

| Slug | Titre court | Date affichée |
|---|---|---|
| `choisir-structure-juridique-operation` | SEP, SCCV, SAS, SCI | Mars 2026 |
| `securiser-promesse-de-vente` | Promesse ou compromis | Avril 2026 |
| `purger-permis-de-construire` | Purger un permis | Mai 2026 |
| `assurances-operation-immobiliere` | DO, décennale, TRC | Juin 2026 |
| `repondre-appel-offres-prive` | Répondre à un appel d'offres | Juillet 2026 |
| `tva-marchand-de-biens` | TVA marge ou prix total | Août 2026 |
| `dpe-passoires-operateur` | Passoires thermiques | Septembre 2026 |

Chaque guide est chaîné au suivant par son champ `next`; la chaîne boucle sur
`sep-immobiliere`. Les cartes correspondantes sont dans le tableau `rows` de
`ressources.html`, les couvertures dans `assets/blog-*.jpg`, et les URL dans
`sitemap.xml`.

### Ajouter un guide

1. Créer `articles/<slug>.js` sur le modèle d'un existant : `export const article = { … }`
   avec les champs `title, lead, tags, meta, crumb, blocks, faq, author, cta, next`.
2. Ajouter le slug dans `order` et une entrée `{title, tags}` dans `index`,
   les deux dans `articles-index.js`.
3. Rebrancher le champ `next` du guide précédent, et celui du nouveau guide.
4. Ajouter une ligne dans le tableau `rows` de `ressources.html`
   (`['N° xx', titre, chapô, date, tag1, tag2, 'assets/…jpg', 'article.html?a=<slug>', isNew]`).
5. Déposer la couverture dans `assets/` (1600 × 893, même langage graphique).
6. Ajouter l'URL dans `sitemap.xml`.
7. Ajouter le slug dans l'énumération `options` du bloc `data-props` de `article.html`
   (métadonnée d'édition, sans effet sur le rendu public).

### Pourquoi un fichier par guide

`article.html` ne charge que l'index (ordre, titres, tags) puis le seul guide demandé.
L'index sert à construire le bloc « autres guides » sans télécharger leur contenu.
Charge par page consultée, quel que soit le volume de la bibliothèque :

| Guides publiés | Transféré par page (gzip) |
|---|---|
| 14 | ~4,6 Ko |
| 50 | ~7,3 Ko |
| 80 | ~9,5 Ko |
| 120 | ~12,4 Ko |

À titre de comparaison, la version monolithique précédente transférait 37 Ko à 14 guides
et aurait atteint 212 Ko à 80. Effet secondaire utile : modifier un guide n'invalide
en cache que son propre fichier.

**Points datés à surveiller.** Deux guides s'appuient sur un état du droit mouvant :
`dpe-passoires-operateur` (projet de loi « relance et décentralisation du logement »
adopté par le Sénat le 8 juillet 2026, examen à l'Assemblée prévu à l'automne) et
`tva-marchand-de-biens` (recodification de la TVA dans le CIBS au 1er septembre 2026).
Les deux portent une mention de date explicite dans le texte : à relire si la
situation évolue.
