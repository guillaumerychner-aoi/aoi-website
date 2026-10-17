# AOI Network — site vitrine

Refonte « graphite » (v2, corrections du 17 octobre) · octobre 2026 · Pièces à l’appui v2.1 · CGV v5.5

Site statique en français, sans compilation, hébergé sur Vercel. Toutes les pages
partagent la charte **graphite** : noir graphite, ivoire et orange, avec Instrument
Serif pour les titres et Manrope pour le texte. Les polices, React, Babel et three.js
sont hébergés dans le dépôt : aucune ressource n’est chargée depuis un CDN.

## Ce qui change dans cette version

- **Nouvel accueil** (`index.html`) : film 3D temps réel piloté par le défilement
  (une parcelle, les métiers, le tour de table, la construction, le bilan, puis le
  réseau), bande des métiers, « À chacun sa place », démos de la plateforme,
  « Notre histoire », modèle gratuit, FAQ, appel final.
  La page est en HTML sémantique, avec `assets/aoi-home-graphite.css` et
  `assets/aoi-home-graphite.js`. Elle ne dépend plus de `support.js`.
  Le film fait apparaître 11 métiers, dont le géomètre-expert et le constructeur
  (avatars `assets/avatar-geometre.png` et `assets/avatar-constructeur.png`).
- **Menus** : sur l’accueil, la navigation passe en bouton « Menu » sous 1 080 px.
  Sur toutes les pages, « Le réseau » mène à `index.html#votre-place`, et le menu
  mobile est le même panneau plein écran que celui de l’accueil.
- **Film 3D** (`assets/aoi-film.js`) : module ES qui utilise three.js r184, hébergé
  dans `assets/vendor/`. Si WebGL2 est indisponible, une image fixe le remplace et
  la section revient à la hauteur d’un écran. Correctif par rapport au prototype :
  le pas de temps du rendu ne peut plus devenir négatif. Sinon, au chargement d’une
  page déjà défilée, une erreur répétée figeait l’image quelques instants.
- **Charte graphite sur toutes les pages intérieures**. Les jetons sont dans le `:root`
  de `assets/aoi-home.css`. Les anciennes teintes vert-olive des trois feuilles de
  style ont été remplacées par des neutres graphite de même luminosité. L’ancienne
  feuille `aoi-graphite.css` est fusionnée et supprimée. `demo-ia.html` reçoit aussi
  la charte. Les démos `demo-extranet.html` et `demo-logiciel.html` sont inchangées.
- **Identité** : nouvelle image de partage `og-image.png`, nouveaux favicons, icônes
  Apple et Android avec le logotype « AOI ▪ NETWORK ». `theme-color` passe à `#050506`.
- **Conservé à l’identique** :
  - le formulaire d’adhésion et son API ;
  - le bandeau cookies et la clé `aoi_cookies` ;
  - les pixels Meta et LinkedIn, Vercel Analytics et les conversions ;
  - les 22 guides, les CGV v5.5, les liens PAA et les redirections.

## Installer avec GitHub Desktop

1. Décompresser l’archive `AOI-Network-graphite.zip`.
2. Dans GitHub Desktop, ouvrir le dépôt du site, puis **Repository → Show in Explorer**
   (ou **Show in Finder** sur Mac).
3. Supprimer les fichiers du dépôt **sauf le dossier `.git`**, puis copier **le contenu**
   du dossier extrait `AOI-Network-graphite` à la racine.
   Cette étape fait disparaître les fichiers retirés, comme `assets/aoi-home.js`.
   Ne pas créer de sous-dossier `AOI-Network-graphite` dans le dépôt.
4. Revenir dans GitHub Desktop et vérifier les changements.
5. Créer un commit, par exemple `Refonte graphite : nouvel accueil 3D et charte`.
6. **Push origin**. Si le dépôt est relié à Vercel, le push déclenche le déploiement.

Pour un **nouveau dépôt**, publier le dossier extrait tel quel avec **File → Add local
repository**, puis **Publish repository**. Relier ensuite ce dépôt au projet Vercel.

## Charte graphite

| Rôle | Valeur |
| --- | --- |
| Fond le plus profond (film, appel final, pied de page) | `#050506` |
| Fonds sombres des sections | `#070708`, `#0b0b0c` |
| Encre | `#141416` |
| Ivoire et surfaces claires | `#f1ede6`, `#faf8f4`, `#e9e4db` |
| Orange (actions, accents) | `#f0703a`, survol `#ff8650`, texte sur orange `#140904` |
| Cuivre (italiques sur fond sombre) | `#eab08a` |
| Rouille (italiques et liens sur fond clair) | `#c4521f`, libellés `#b4471a` |

- **Titres** : Instrument Serif 400, avec l’italique pour l’accent.
- **Surtitres** : Manrope 600, 11 px, en capitales, interlettrage de 0,22 em.
- **Texte courant** : Manrope, justifié avec césure (`lang="fr"`).
- **Logotype** : « AOI » en Instrument Serif, un carré orange, puis « NETWORK » en
  Manrope 600 capitales avec un interlettrage de 0,24 em.

## Icônes et image de partage

- **Fichiers** :
  - `favicon.ico`, `favicon-16x16.png` et `favicon-32x32.png` (onglet) ;
  - `apple-touch-icon.png` (écran d’accueil iPhone et iPad) ;
  - `android-chrome-192x192.png` et `android-chrome-512x512.png` (Android, appli installée) ;
  - `og-image.png` (aperçu sur LinkedIn, WhatsApp, Facebook…).
- **Déclaration** : chaque page déclare les mêmes cinq balises en chemins absolus,
  avec un numéro de version (`?v=2`). Les navigateurs gardent les favicons en cache
  très longtemps, et ce numéro les oblige à recharger les nouvelles icônes.
- **Pour changer d’icône plus tard** :
  1. Remplacer les fichiers, en gardant les mêmes noms.
  2. Passer `?v=2` à `?v=3` dans toutes les pages (rechercher/remplacer `?v=2"`) et
     dans `site.webmanifest`.
  3. Relancer `node tools/build-guides.mjs`.
- **Aperçus sur les réseaux sociaux** : LinkedIn et Facebook gardent l’ancienne image
  en cache. Après la mise en ligne, demander une nouvelle lecture de
  `https://www.aoi-network.com/` dans le Post Inspector de LinkedIn et dans le
  Sharing Debugger de Facebook.
- **Résultats Google** : Google met à jour l’icône affichée lors de son prochain passage,
  après quelques jours ou quelques semaines. Une demande d’indexation de l’accueil
  dans la Search Console accélère la mise à jour.

## Vérifier en local

Depuis la racine du dépôt :

```bash
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000`. Les modules JavaScript nécessitent un serveur HTTP :
l’ouverture directe des pages en `file://` ne convient pas.

## Fichiers principaux

| Fichier | Rôle |
| --- | --- |
| `index.html` | Accueil graphite et film 3D au défilement |
| `assets/aoi-home-graphite.css`, `assets/aoi-home-graphite.js` | Styles et comportements de l’accueil : en-tête, menu mobile, défilement amorti, bande des métiers, démos, FAQ, apparitions, cookies et mesure d’audience |
| `assets/aoi-film.js` | Moteur du film 3D (three.js core) |
| `assets/vendor/three.*.min.js` | three.js r184 (licence MIT, `LICENSE-three.txt`) |
| `rejoindre.html` | Formulaire d’adhésion |
| `accompagnement.html`, `pieces-a-lappui.html`, `cadre-missions.html` | Missions AOI, présentation PAA et cadre des prestations |
| `ressources.html` | Bibliothèque de 22 guides |
| `article.html?a=slug` | Gabarit des 14 guides historiques |
| `guides/*.html` | Huit guides en HTML complet, générés |
| `content/library.json` | Ordre, cartes et liens entre guides |
| `templates/ressources.html` | Gabarit de la bibliothèque |
| `tools/build-guides.mjs` | Générateur des huit guides, de la bibliothèque et du sitemap |
| `tools/link-paa.mjs` | Mise à jour groupée des liens vers Pièces à l’appui |
| `cgv.html`, `mentions-legales.html` | Documents légaux |
| `choix-abonnement.html`, `operation.html`, `demo-ia.html`, `404.html` | Pages intérieures |
| `demo-extranet.html`, `demo-logiciel.html` | Séquences animées des outils, affichées dans l’accueil |
| `assets/aoi-home.css` | Jetons de la charte et composants communs des pages intérieures |
| `assets/aoi-pages.css`, `assets/aoi-missions.css` | Mises en page intérieures |
| `assets/aoi-demos.css` | Charte des interfaces de démonstration |
| `assets/aoi-site.js`, `assets/aoi-guides.js` | Navigation, cookies, sommaire et progression des guides |
| `assets/aoi-fonts.css`, `assets/fonts/` | Polices locales et licences |
| `legal-data.js`, `legal-render.js` | Source légale et rendu des documents |
| `articles-index.js`, `articles/` | Index et contenus des guides |
| `support.js` | Runtime des pages dynamiques : CGV, mentions légales, guides historiques, adhésion, opération, démo IA |
| `vercel.json` | Redirections existantes |

`assets/aoi-home.js` et `assets/aoi-scene.js` (ancien accueil) ne sont plus utilisés et
ont été retirés. `support.js` reste nécessaire aux six pages intérieures dynamiques ;
il charge React et Babel depuis `assets/vendor/`.

## Accueil : à savoir

- **Ancres** utilisées par les autres pages :
  - `#top`, `#contenu`, `#reseau` ;
  - `#votre-place`, `#rejoindre` ;
  - `#plateforme`, `#origine` ;
  - `#modele`, `#accompagnement` ;
  - `#faq`, `#premiers-membres`.

  Toutes tiennent compte de l’en-tête de 76 px.
- **Défilement amorti** : il s’applique seulement à la molette. Le tactile, le clavier
  et `prefers-reduced-motion` gardent le défilement natif.
- **Qualité adaptative** : le film baisse sa résolution sous 42 images/s et la remonte
  au-dessus de 58. Il se met en pause hors écran.
- **FAQ** : les dix réponses sont celles de l’accueil précédent, liens compris. On y
  trouve notamment l’accès `data-paa-link="site"` attendu par `tools/link-paa.mjs`.

## Alignement avec Pièces à l’appui v2.1

Le domaine PAA est `https://piecesalappui.fr`. Les demandes PAA ouvrent
`https://piecesalappui.fr/contact.html`. Les quatorze accès explicites sont répartis
entre la FAQ de l’accueil, Accompagnement, la présentation PAA et le cadre des missions.
Si le domaine change :

```bash
node tools/link-paa.mjs https://nouveau-domaine.fr
```

Voir `docs/ALIGNEMENT-PAA-V2.1.md` et `docs/MISE-A-JOUR-AOI-PAA-2026-09-27.md`.

## Professions exemptées de commission

`legal-data.js` affiche les **CGV v5.5**. La liste utilisée par le site et le formulaire
est celle des CGV :
- notaires ;
- avocats ;
- commissaires de justice ;
- experts-comptables ;
- fiscalistes ;
- commissaires aux comptes.

Les modalités sont détaillées à l’article 6 (`cgv.html#sec-6`).

## Intégrations conservées

Le formulaire appelle l’API d’adhésion existante :
`POST https://extranet.aoi-network.com/api/subscription/register-checkout`.
Son contrat reste `{ plan, userData }`, avec `niveau2` pour les prestataires et
`niveau3` pour les autres profils. La capture d’abandon appelle `/api/contact/callback`.
Chaque clic sur « Rejoindre AOI Network » envoie une trace (source `clic_inscription`).

Les identifiants Meta (`2586678501298941`) et LinkedIn (`8742890`), les conversions,
Vercel Analytics et la clé de consentement `aoi_cookies` sont conservés. Les traceurs ne
se chargent qu’après consentement, et uniquement sur `aoi-network.com`. Un lien
« Cookies » dans le pied de page de l’accueil rouvre le choix.

## Ajouter ou modifier un guide

1. Éditer `articles/<slug>.js`. Pour un ajout, copier la structure d’un guide n° 14 à 21
   et déposer la couverture dans `assets/`.
2. Ajouter son slug à `newGuides` dans `content/library.json`, puis renseigner
   `related` et `next`.
3. Exécuter, avec Node.js :

   ```bash
   node tools/build-guides.mjs
   ```

4. Vérifier localement, puis inclure les fichiers générés dans le commit.

Le générateur part de `article.html` et de `templates/ressources.html`. Les pages
générées reprennent donc automatiquement la charte graphite. Ne pas modifier
directement `ressources.html`, `articles-index.js`, `guides/*.html` ni les entrées du
sitemap des nouveaux guides.

## Vérifications effectuées pour cette version

- **Accueil** :
  - testé en 1440, 924, 393 et 360 px de large ;
  - aucune erreur console, aucun débordement horizontal ;
  - menu plein écran, ancres et mise à l’échelle des démos vérifiés ;
  - FAQ vérifiée, avec `aria-expanded` ;
  - bandeau cookies, mouvement réduit et image de secours sans WebGL vérifiés ;
  - rendu sans JavaScript vérifié.
- **Fidélité** : comparé capture par capture au prototype Claude Design, en
  ordinateur et en mobile.
- **Fusion de la charte** : 30 pages intérieures capturées avant et après la fusion.
  Les rendus sont identiques au pixel près, avant le remplacement des teintes vertes
  résiduelles.
- **Liens** : 1 186 liens internes, ressources et ancres contrôlés, aucun lien cassé.
  Les 22 guides et les deux démos s’ouvrent sans erreur.
- **Lighthouse (accueil)** : accessibilité 100, bonnes pratiques 100, SEO 100.
- **Générateur** : `tools/build-guides.mjs` reproduit à l’identique les guides livrés.
- **Non testé** : aucune inscription réelle n’a été envoyée ; l’API de production et les
  paiements n’ont pas été testés. La cadence du film 3D se vérifie sur un vrai
  navigateur avec GPU (objectif : 50 images/s en qualité haute).
