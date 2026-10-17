# Handoff : AOI Network, refonte « graphite » (v3)

> **Version v3.** Elle reprend la v1 avec deux règles typographiques appliquées à tout le site :
> 1. **L'italique est réservé à deux phrases de l'accueil** : « font les grandes opérations. » (hero) et « Prenez-y votre place. » (appel final). Partout ailleurs (chapitres du film, titres de sections, pages intérieures), les mots mis en avant gardent leur couleur (cuivre `#eab08a` sur fond sombre, rouille `#c4521f` sur fond clair) mais restent **droits**.
> 2. **Les chiffres sont en Manrope 700**, interlettrage −.05 à −.065em : « 0 € », marge du bilan, compteurs, prix, commissions et KPI des pages intérieures (`.hero-free strong`, `.library-count strong`, `.operation-metrics strong`, `.result-kpis strong`, `.score-grid strong`, `.not-found-number`, `.access-price`, `.commission-rate`, `.exempt-mark`).
>
> Sur mobile (portrait), les étiquettes de métiers du film qui sortiraient de l'écran restent accrochées au bord ; leur trait de rappel est alors masqué. Ce comportement est géré dans `aoi-film.js`.

## Vue d'ensemble
Refonte visuelle complète du site vitrine AOI Network (aoi-network.com) :
- **Nouvel accueil.** Il s'ouvre sur un film 3D temps réel piloté par le scroll : une parcelle, le réseau des métiers, le tour de table, la construction, le bilan, puis le réseau d'opérations. Suivent la bande des métiers, « À chacun sa place », les démos plateforme, « Notre histoire », le modèle gratuit, la FAQ et l'appel final.
- **Nouvelle charte « graphite ».** Noir graphite, ivoire et orange remplacent le vert profond, le crème et le cuivre. Les typographies Instrument Serif et Manrope sont conservées.
- **Toutes les pages intérieures** (20 fichiers HTML, dont les 8 guides) sont rhabillées par une feuille de thème chargée en dernier. Leur HTML, leurs liens et leurs ancres sont inchangés.

Le dossier `site/` est **le dépôt complet, prêt à remplacer le contenu du repo actuel**. Le dossier `.git` du repo existant reste en place.

## À propos des fichiers
- `site/index.html` est un **prototype haute fidélité fonctionnel**, écrit sous forme de « Design Component ». C'est un HTML qui s'exécute grâce au runtime `site/support.js`. Il s'ouvre et fonctionne tel quel dans un navigateur, mais ce n'est pas du code de production propre : styles en ligne, runtime de prototypage.
- **La tâche n° 1 est de le recréer en HTML, CSS et JS statiques**, dans les conventions du repo existant : site statique sans build, hébergé sur Vercel, fichiers `assets/aoi-*.css|js`. Supprimer ensuite `support.js`.
- `site/aoi-film.js` est **déjà du code de production** : un module ES vanilla qui utilise three.js core. Il se garde tel quel.
- `site/assets/aoi-graphite.css` est le thème des pages intérieures. Il est fonctionnel et peut être livré tel quel, puis fusionné proprement (tâche 3).

## Fidélité
**Haute fidélité.** Les couleurs, la typographie, l'espacement, les animations et les textes sont définitifs. Il faut les reproduire au pixel près.

---

## Tâches pour Claude Code (dans l'ordre)
1. **Porter l'accueil en statique.** `index.html` devient du HTML sémantique, avec `assets/aoi-home-graphite.css` (classes, media queries à la place de la logique `vw` en JS) et `assets/aoi-home-graphite.js` (vanilla). Ce JS reproduit tous les comportements listés dans « Interactions ». Conserver tous les `id` d'ancre (voir « Liens et ancres »). Retirer `support.js` et les attributs `data-dc-*`.
2. **Héberger three.js en local.** `aoi-film.js` importe `https://unpkg.com/three@0.184.0/build/three.module.js`. Copier `three.module.js` et `three.core.js` (r184) dans `assets/vendor/`, puis faire pointer `THREE_URL` vers `./assets/vendor/three.module.js`. Vérifier les en-têtes et la CSP dans `vercel.json`.
3. **Fusionner le thème.** Une fois validé, reporter les variables de `aoi-graphite.css` dans le `:root` de `aoi-home.css`. Remplacer les couleurs vertes codées en dur dans `aoi-home.css`, `aoi-pages.css` et `aoi-missions.css` (`#2b382a`, `#273626`, `#bcc5b9`, `#202c25`, `#e8ecdf`…) par les jetons ci-dessous. Supprimer les `!important` devenus inutiles, puis supprimer `aoi-graphite.css`.
4. **Régénération des guides.** S'assurer que `tools/build-guides.mjs` et `templates/ressources.html` produisent des pages qui incluent le thème : `templates/ressources.html` contient déjà le lien. Les guides générés doivent garder `<link rel="stylesheet" href="../assets/aoi-graphite.css">`, ou les jetons fusionnés si la tâche 3 est faite.
5. **Identité.**
   - Refaire `og-image.png`, les favicons et `apple-touch-icon` avec le nouveau logotype : « AOI » en Instrument Serif, un carré orange `#f0703a` de 6 × 6, « NETWORK » en Manrope 600 capitales, interlettrage .24em.
   - Mettre `theme-color` à `#050506` (déjà fait sur les pages intérieures).
6. **README du repo.** Mettre à jour la description de la charte : graphite, ivoire, orange.
7. **Recette.** Suivre la liste en bas de document.

---

## Jetons de design
**Couleurs**
| Rôle | Valeur |
|---|---|
| Fond le plus profond (film, appel final, pied de page) | `#050506` |
| Fond sombre des sections | `#070708` (plateforme, métiers), `#0b0b0c` (Notre histoire) |
| Encre | `#141416` |
| Ivoire (fond clair) | `#f1ede6` ; surfaces claires `#faf8f4`, `#e9e4db` |
| Orange (CTA, accents) | `#f0703a` ; survol `#ff8650` ; texte sur orange `#140904` |
| Cuivre (accent italique sur fond sombre) | `#eab08a` |
| Rouille (accent italique et liens sur fond clair) | `#c4521f` ; libellés `#b4471a` |
| Texte sur fond sombre | `#f3efe8` (titres), `#ece8e1`, `#cfcac2`, `#b9b4ab`, `#a9a49b`, `#8e897f`, `#6f6a62` |
| Texte sur fond clair | `#141416`, `#4a4740`, `#5e5a53`, `#6b675f` |
| Filets | sombre `rgba(255,255,255,.08–.14)` ; clair `rgba(20,20,22,.14–.16)`, filet fort `#141416` |

**Typographie** (polices locales dans `assets/fonts/aoi-font-0…5.ttf`, voir `assets/aoi-fonts.css`)
- Titres : `Instrument Serif` 400, italique pour l'accent (`<em>`), interlettrage −.03 à −.045em, interligne .9 à 1.
  - H1 accueil : `clamp(38px, min(7.4vw, 9.5vh), 124px)`.
  - H2 des chapitres du film : `clamp(34px, min(5vw, 9.5vh), 80px)`.
  - H2 des sections : `clamp(44px, 5.6vw, 92px)`.
  - « 0 € » : `clamp(120px, 19vw, 300px)`.
- Surtitres : `Manrope` 600, 11px, capitales, interlettrage .22em, orange (fond sombre) ou `#b4471a` (fond clair).
- Texte courant : `Manrope` 400, 15–16px, interligne 1.65–1.7, **justifié** avec `hyphens:auto` (le `lang="fr"` est obligatoire).
- Boutons : `Manrope` 700, 13–14px, hauteur 40/50/54/56px, rayon 2px.

**Divers** : rayon 2px (boutons), 4px (HUD), 10px (écrans de démo) ; ombre des démos `0 60px 120px -40px rgba(0,0,0,.9), 0 0 0 1px rgba(255,255,255,.08)`. Courbe d'animation standard : `cubic-bezier(.2,.7,.2,1)`.

---

## Accueil : écrans et sections (ordre de la page)
1. **En-tête fixe** (76px). Fond en dégradé `rgba(5,5,6,.82)` vers transparent, flou de 6px.
   - Logotype à gauche. Au centre, la nav : Le réseau (`#votre-place`), La plateforme, Notre histoire (`#origine`), Le modèle, Ressources. À droite : Espace membres ↗ et « Rejoindre AOI → ».
   - **Sous 1080px**, la nav et Espace membres sont masqués. Un bouton « Menu » ouvre un panneau plein écran avec tous les liens, en serif 40px, avec des zones de clic de 56px minimum.
   - **Sous 480px**, le CTA devient « Rejoindre ». **Sous 420px**, le mot « NETWORK » est masqué.
   - L'en-tête se masque au scroll vers le bas (`translateY(-110%)`, .6s) et réapparaît au scroll vers le haut ou au-dessus de 140px.
2. **Film 3D** (`#top`, ancres `#reseau` et `#contenu`). La section mesure 1000vh (820vh sous 760px), avec une scène collante de 100svh. Voir « Le film 3D ».
3. **Bande des métiers.** Deux lignes infinies en Instrument Serif `clamp(30px,4.4vw,80px)` : la première ivoire vers la gauche, la seconde cuivre italique vers la droite. Séparateurs « · » orange. Vitesse de base 38px/s, accélérée par la vitesse de scroll puis amortie (`exp(-4·dt)`).
4. **À chacun sa place** (`#votre-place`, ancre `#rejoindre`). Fond ivoire. Trois panneaux typographiques **alignés par une sous-grille CSS** de 6 lignes : en-tête, titre, puce 1, puce 2, puce 3, pied de panneau. Au survol, le panneau s'inverse (fond `#141416`, texte ivoire, .55s). Une variante « Avec visuels », avec les rendus encadrés, existe dans le prototype mais n'est pas retenue par défaut.
5. **Plateforme** (`#plateforme`). Deux démos animées réelles, `demo-extranet.html` et `demo-logiciel.html`.
   - Chaque démo est dans une iframe rendue à 1000 × 610 puis mise à l'échelle sur la largeur de sa carte (`scale(w/1000)`), avec `pointer-events:none`.
   - Un clic sur l'écran ou sur « Ouvrir en grand » ouvre la démo dans un nouvel onglet.
   - Entrée en perspective liée au scroll : `rotateX` 18 → 0°, `rotateY` −12 → 0°, `translateY` 60 → 0px, `scale` .92 → 1.
6. **Notre histoire** (`#origine`). Portrait `assets/guillaume.jpg` (7:8), textes du fondateur, trois liens vers les méthodes (`article.html?a=paiement-a-terme`, `sep-immobiliere`, `pourquoi-un-reseau`).
7. **Le modèle** (`#modele`, ancre `#accompagnement`). « 0 € » géant, « Rejoindre AOI est gratuit. Sans abonnement. », CTA. À droite, deux lignes secondaires alignées sur une colonne de libellés de 170px : « En option » (logiciel à 49 € HT/mois) et « Si un deal se fait » (commission de 4,5 % ou 10 % HT, et 0 % pour les professions réglementées). Puis les liens vers les CGV et l'accompagnement.
8. **FAQ** (`#faq`). Titre collant à gauche, accordéon à droite : 10 questions reprises de l'ancien accueil, une seule ouverte à la fois, la première ouverte par défaut. L'animation passe par `grid-template-rows` de 0fr à 1fr en .5s.
9. **Appel final** (`#premiers-membres`). Rendu `blog-plans-principe-execution.webp` en fond, voilé par un dégradé radial. Titre « Le réseau prend forme. Prenez-y votre place. », CTA et lien WhatsApp.
10. **Pied de page.** Logotype, liens Accompagnement, Pièces à l'appui, Mentions légales, CGV et e-mail.

Les apparitions au scroll (`data-reveal`) se font en fondu et translation de 56px vers 0 (1.2 à 1.4s), avec un décalage de 0,1s entre éléments voisins. Les images utilisent un rideau `clip-path: inset(100% 0 0 0)` vers `inset(0)` en 1.5s. Le `clip-path` doit être posé sur l'**enfant** de l'élément observé : sinon l'IntersectionObserver ne se déclenche pas.

---

## Le film 3D (`aoi-film.js`)
- **API.** `createFilm({ host, section, overlay, getProps })` renvoie `{ destroy, snapTo(p), force(p) }`. Le module expose aussi `window.AOIFilm`.
  - `host` : le conteneur du canvas (absolu, plein cadre, apparition en fondu d'opacité 1,8s).
  - `section` : la section haute dont la progression va de 0 à 1.
  - `overlay` : la couche HTML des chapitres et étiquettes.
  - `getProps()` renvoie `{ glow: 1, quality: 'Haute' }`.
- **Rendu.** three.js r184 core uniquement :
  - bloom maison sur 5 niveaux ;
  - réflexion plane du sol (passe miroir, flou vertical) ;
  - tone mapping ACES, vignettage, grain, légère aberration chromatique ;
  - ombres PCF et environnement PMREM procédural.
- **Contrat HTML** de l'overlay, lu au démarrage :
  - `[data-chapter][data-a][data-b]` : fondu et translation de 26px selon la progression. `data-static` désactive la translation.
  - `[data-label="operateur|architecte|geometre|notaire|etudes|courtier|agent|coop1|coop2|builder|constructeur"]` : étiquettes projetées depuis la 3D. Elles sont atténuées si elles passent sous le texte d'un chapitre (`[data-zone]`).
  - `[data-count][data-a][data-b]` : compteurs en format fr-FR. `[data-bar]` : barre en `scaleX`. `[data-rail]` : jauge verticale. `[data-chapter-num]` : numéro du chapitre.
  - `[data-goto="0|0.11|0.26|0.42|0.56|0.71|0.85|0.97"]` : points cliquables qui défilent jusqu'au chapitre.
  - `[data-scrim]` et `[data-hud]` : mise en page portrait.
- **Chapitres** (progression 0 à 1) :
  - 0 à .06 : ouverture ;
  - .08 à .18 : Une opportunité ;
  - .20 à .33 : Les compétences ;
  - .36 à .47 : Le tour de table ;
  - .50 à .62 : Du plan au bâtiment ;
  - .65 à .79 : Le chantier ;
  - .81 à .90 : Le bilan (HUD chiffré) ;
  - .92 à 1 : Le réseau.
- **Comportements déjà intégrés au module :**
  - progression amortie (`3.4/s`) ;
  - parallaxe à la souris, et lumière orange qui suit le curseur sur le sol (souris uniquement) ;
  - **mode portrait** (ratio < .85) : FOV 52, recul, cadrage remonté, étiquettes à 78 %, HUD en pleine largeur ;
  - **qualité adaptative** : la densité de pixels baisse sous 42 images/s et remonte au-dessus de 58 ;
  - `prefers-reduced-motion` : pas d'amorti ni de dérive ;
  - pause du rendu quand la section est hors écran.
- **Secours.** Si WebGL2 ou l'import échouent, afficher `assets/blog-plans-principe-execution.webp` en plein cadre et ramener la section à 100vh.

## Interactions à reproduire dans `aoi-home-graphite.js`
- **Défilement amorti** sur la molette uniquement. Interpolation de 0,075 par image, `scrollTo` natif pour garder `position:sticky`. Désactivé avec `prefers-reduced-motion`, Ctrl+molette ou défilement horizontal. Le tactile reste natif.
- **Bande des métiers** en boucle infinie : le contenu est dupliqué, avec un modulo sur la moitié de `scrollWidth`.
- **Mise à l'échelle des iframes de démo** via un ResizeObserver sur leur parent.
- **Entrée en perspective** de la grille des démos au scroll.
- **En-tête** masqué ou affiché selon le sens du scroll. **Menu mobile** : ouverture et fermeture, fermeture au clic sur un lien.
- **Accordéon FAQ** avec `aria-expanded`.
- **Apparitions** par IntersectionObserver, seuil 0,15.

## Liens et ancres (à ne pas casser)
- **Ancres de l'accueil** utilisées par les autres pages, toutes présentes : `#contenu`, `#top`, `#reseau`, `#rejoindre`, `#plateforme`, `#origine`, `#modele`, `#accompagnement`, `#premiers-membres`, plus `#votre-place` et `#faq`.
- Tous les liens internes de l'accueil sont **relatifs** : `rejoindre.html?profil=operateur|co-operateur|prestataire`, `ressources.html`, `accompagnement.html`, `cgv.html`, `pieces-a-lappui.html`, `mentions-legales.html`, `article.html?a=…`, `demo-extranet.html`, `demo-logiciel.html`.
- Liens externes : `https://extranet.aoi-network.com/login`, `https://wa.me/33763782041`, `mailto:contact@aoi-network.com`.
- **Les pages intérieures n'ont subi qu'une modification** : l'ajout de `<link rel="stylesheet" href="(../)assets/aoi-graphite.css">` après `aoi-missions.css`, et `theme-color` passé à `#050506`. Aucun lien ni contenu n'a été modifié.
- Les démos (`demo-*.html`) sont inchangées.

## Ressources
- **Polices** : `assets/fonts/aoi-font-0.ttf` à `aoi-font-5.ttf` (Instrument Serif normal et italique ; Manrope 400, 500, 600 et 700), sous licence OFL.
- **Images** :
  - `aoi-people.webp`, une planche de 8 portraits fictifs, découpée en CSS pour les étiquettes : `background-size:320px 240px`, positions de colonne −23, −103, −183 et −263px, de ligne −6 et −126px ;
  - `aoi-builder.webp` ;
  - `guillaume.jpg` ;
  - `blog-plans-principe-execution.webp`, `blog-vendre-a-un-marchand-de-biens.webp`, `blog-deux-notaires-vente-immobiliere.webp` et `blog-qui-mandate-qui-operation-immobiliere.webp` ;
  - `aoi-extranet-preview.jpg` et `aoi-logiciel-preview.jpg`, en image d'attente possible des iframes.
- **3D** : entièrement procédurale (aucun modèle à charger) ; textures générées par canvas.

## Fichiers
- `site/index.html` : prototype de l'accueil (Design Component), **à porter**.
- `site/support.js` : runtime du prototype, à supprimer après le portage.
- `site/aoi-film.js` : moteur du film 3D (production).
- `site/assets/aoi-graphite.css` : thème des pages intérieures.
- `site/**` : tout le reste du site d'origine, avec le thème injecté.

## Recette
- [ ] Aucune erreur dans la console sur toutes les pages. L'accueil a été testé en 1440, 924, 393 et 360px de large.
- [ ] Toutes les ancres listées ci-dessus défilent au bon endroit (en-tête de 76px pris en compte : `scroll-margin-top`).
- [ ] Le vérificateur de liens ne remonte aucun 404 (pages, `assets/`, `guides/`, `article.html?a=`).
- [ ] Mobile : menu plein écran, film lisible en portrait, démos à l'échelle, aucun débordement horizontal.
- [ ] `prefers-reduced-motion` : défilement natif, pas d'amorti.
- [ ] Performances : au moins 50 images/s en qualité haute sur un portable récent, et la qualité adaptative se déclenche sur machine modeste.
- [ ] Lighthouse : l'accessibilité doit atteindre au moins 95 (contrastes, `lang="fr"`, `aria-expanded`, `alt`).
- [ ] Les guides générés par `tools/build-guides.mjs` gardent le thème.
