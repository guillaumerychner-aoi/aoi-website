# AOI Network — site vitrine

Liaison AOI / Pièces à l’appui en ligne · 27 septembre 2026 · CGV v5.5

Site statique en français, prêt à publier sans compilation. Les 23 pages HTML et les
22 guides reprennent la charte de l’accueil : vert profond, crème, cuivre,
Instrument Serif et Manrope. Les polices sont hébergées dans le dépôt.

## Vérifier immédiatement cette version

Le dossier de cette livraison porte un nom distinct : `AOI-Network-PAA-en-ligne`.
Ouvrir le fichier `index.html` situé directement dans ce dossier. Sur l’accueil,
le nouveau bloc « Votre dossier. Des étapes claires. » se trouve après les démonstrations,
avant « Notre histoire ». Le lien « Accompagnement » figure aussi dans le pied de page.

Les fichiers `accompagnement.html`, `pieces-a-lappui.html` et `cadre-missions.html`
se trouvent au même niveau que `index.html`. Ils sont accessibles en ouverture locale.
Les pages dynamiques et le fonctionnement complet du site nécessitent le serveur
local décrit plus bas. Aucun commit ni push n’est nécessaire pour regarder ces ajouts.

## Installer avec GitHub Desktop

1. Décompresser `AOI-Network-PAA-en-ligne.zip`.
2. Dans GitHub Desktop, ouvrir le dépôt du site, puis **Repository → Show in Explorer**
   (ou **Show in Finder** sur Mac).
3. Copier **le contenu** du dossier extrait `AOI-Network-PAA-en-ligne` à la racine de ce dépôt.
   Accepter le remplacement des fichiers existants. Conserver le dossier `.git`.
   Ne pas créer un sous-dossier `AOI-Network-PAA-en-ligne` dans le dépôt existant.
4. Revenir dans GitHub Desktop et vérifier les changements.
5. Créer un commit, par exemple :
   `Relie AOI au site public Pièces à l’appui`.
6. Utiliser **Push origin** lorsque la version est prête à être mise en ligne.
   Si le dépôt est relié à Vercel, le push peut déclencher son déploiement habituel.

L’archive contient l’ensemble du site, sans dépendances de prévisualisation ni
historique Git. Aucun commit, push ou déploiement n’a été effectué pour préparer
cette livraison.

## Mise à jour du 27 septembre 2026

- L’accompagnement AOI devient une option facultative, sur devis, distincte de l’adhésion et du logiciel.
- Pièces à l’appui est présentée comme une marque exploitée par AOI Network, filiale d’AOI Holding, avec une charte propre et des critères de revue indépendante explicites.
- Trois nouvelles pages : `accompagnement.html`, `pieces-a-lappui.html`, `cadre-missions.html`. Accueil, tarifs, Rejoindre, FAQ et pieds de page les rendent accessibles.
- Les demandes d’accompagnement AOI préparent un e-mail. Les demandes de cadrage PAA ouvrent désormais le formulaire du site PAA ; aucun compte AOI n’est créé par ces parcours.
- Les CGV v5.5 précisent le champ des missions commandées séparément. Les articles 2 et 6 de la v5.4 restent identiques, dont les exemptions de commission.
- Les identités graphiques, l’animation d’accueil, les 22 guides et l’intégration de création de compte sont conservés.

Le site PAA est en ligne sur `https://piecesalappui.fr`. Les cinq liens explicites de découverte et de cadrage sont activés : FAQ de l’accueil, page Accompagnement, puis trois accès dans `pieces-a-lappui.html`. Les demandes PAA ouvrent `https://piecesalappui.fr/contact.html`.

La page de présentation sur AOI reste accessible depuis les pieds de page et explique les liens entre les deux marques. Le script `tools/link-paa.mjs` permet d’actualiser ensemble les cinq liens si le domaine change.

**Publier le contenu complet de cette archive dans le dépôt AOI Network.** Les pages `accompagnement.html`, `pieces-a-lappui.html` et `cadre-missions.html` doivent être déployées avec le reste du site. Le contrôle public effectué pendant cette livraison ne retrouvait pas encore ces nouvelles pages.

Voir `docs/MISE-A-JOUR-AOI-PAA-2026-09-27.md` pour la liaison des sites et les éléments de lancement à finaliser. Les documents de mission sont une préparation éditoriale à faire relire avant application.

## Fonctionnalités conservées

- **Accueil** : accès direct à l’adhésion dès le premier écran, bénéfices concrets par profil,
  expression « place de marché » dans la présentation de l’extranet, bouton d’inscription
  dans les démonstrations et précision de l’exemption dans le parcours prestataires/partenaires,
  les commissions et la FAQ. L’animation au scroll, les trois profils visibles,
  les deux cartes de démonstration et la présentation des tarifs sont conservés.
- **Rejoindre** : titre et explication adaptés au profil choisi ; création du compte
  annoncée avant la présentation ou la consultation des projets. Formulaire en trois étapes visuelles, choix de profil explicite,
  prestataires et partenaires réunis, rappel des conditions avant le consentement.
  Le métier sélectionné déclenche une confirmation d’exemption lorsqu’il est concerné.
- **Bibliothèque** : une lecture à la une et 21 autres guides, soit 22 au total.
  Une illustration dédiée de travail collectif sur des plans accompagne le guide
  « Les bons projets se construisent à plusieurs ». Les huit nouveaux guides
  apparaissent en premier dans la grille, avec un repère « Nouveau ».
- **Huit nouveaux articles** : les guides n° 14 à 21 disposent chacun d’une page
  HTML complète, d’une couverture originale en WebP et de liens vers les sujets proches.
  Leur contenu, leurs tableaux, leurs FAQ et leurs liens sont présents sans JavaScript.
  Les titres, descriptions, URL canoniques, aperçus sociaux, données structurées
  et entrées du sitemap sont renseignés pour chaque page.
- **Guides** : nouvelle typographie, sommaire, progression de lecture, tableaux
  défilables sur mobile et FAQ accessibles. Les promesses de vérification des opérations,
  des membres et des missions ont été corrigées dans trois guides pour correspondre aux CGV.
- **CGV et mentions légales** : nouvelle mise en page de lecture avec sommaire.
- **Adhésion, opération, démo IA et page 404** : nouvelles compositions adaptées
  au mobile, navigation et pied de page communs.
- **Démos extranet et logiciel** : palette et polices harmonisées, séquences
  animées existantes conservées.

## Professions exemptées de commission

Le fichier `legal-data.js` affiche désormais les **CGV v5.5**. Les données des articles 2 et 6 proviennent sans modification des CGV v5.4 fournies.
La liste utilisée par les rappels du site et le formulaire est celle des CGV :

- Notaires
- Avocats
- Commissaires de justice
- Experts-comptables
- Fiscalistes
- Commissaires aux comptes

Le message porte sur l’absence de commission AOI sur leurs missions. Les autres
modalités sont accessibles dans les CGV, notamment l’article 6
(`cgv.html#sec-6`). La v5.5 ajoute l’article 1.5 et précise le champ de l’article 4 ; elle ne modifie pas les barèmes et exemptions de l’article 6.

## Vérifier en local

Depuis la racine du dépôt :

```bash
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000`. Les modules JavaScript nécessitent un serveur
HTTP ; l’ouverture directe des pages en `file://` ne convient pas.

## Fichiers principaux

| Fichier | Rôle |
| --- | --- |
| `index.html` | Accueil et scène animée au défilement |
| `rejoindre.html` | Formulaire d’adhésion |
| `accompagnement.html`, `pieces-a-lappui.html`, `cadre-missions.html` | Missions AOI, présentation PAA et cadre des prestations |
| `assets/aoi-missions.css` | Présentation des nouvelles pages et blocs |
| `ressources.html` | Bibliothèque de 22 guides, cartes en HTML complet |
| `article.html?a=slug` | Gabarit des 14 guides historiques |
| `guides/*.html` | Huit nouveaux guides en HTML complet |
| `content/library.json` | Ordre, cartes et liens entre guides |
| `templates/ressources.html` | Gabarit de la bibliothèque |
| `tools/build-guides.mjs` | Générateur sans dépendances des huit pages et de la bibliothèque |
| `cgv.html`, `mentions-legales.html` | Documents légaux |
| `choix-abonnement.html` | Adhésion gratuite et logiciel optionnel |
| `operation.html` | Exemple illustratif de fiche opération |
| `demo-ia.html` | Démonstration de restitution avec données fictives |
| `demo-extranet.html`, `demo-logiciel.html` | Séquences animées des outils |
| `404.html` | Page introuvable et liens de retour |
| `assets/aoi-home.css` | Charte, composants communs et accueil |
| `assets/aoi-pages.css` | Mises en page intérieures |
| `assets/aoi-demos.css` | Charte des interfaces de démonstration |
| `assets/aoi-home.js`, `assets/aoi-site.js` | Navigation, cookies et interactions |
| `assets/aoi-guides.js` | Sommaire et progression des nouveaux guides |
| `assets/aoi-scene.js` | Progression de l’animation d’accueil au scroll |
| `assets/aoi-fonts.css`, `assets/fonts/` | Polices locales et licences |
| `legal-data.js`, `legal-render.js` | Source légale et rendu des documents |
| `articles-index.js`, `articles/` | Index et contenus des guides |
| `support.js` | Runtime existant des pages dynamiques, à conserver |
| `vercel.json` | Configuration et redirections existantes |

Les visuels sont décrits dans `assets/aoi-visuals.md` ; les consignes de la nouvelle
collection sont conservées dans `assets/aoi-guide-prompts.json`.

## Intégrations conservées

Le formulaire appelle l’API d’adhésion existante :
`POST https://extranet.aoi-network.com/api/subscription/register-checkout`.
Son contrat reste `{ plan, userData }`, avec `niveau2` pour les prestataires et
`niveau3` pour les autres profils. `userData` contient les champs historiques :
`email, prenom, nom, telephone, societe, ville, activite, profile_type, presentation`.

La capture d’abandon existante appelle `/api/contact/callback` à la perte de focus
d’un email valide. Éviter de saisir de vraies coordonnées pendant une simple revue.
Les réponses HTTP en erreur, les réponses mal formées et les échecs réseau
n’affichent désormais plus de fausse confirmation d’inscription.

Les identifiants Meta et LinkedIn, les événements de conversion, Vercel Analytics
et la clé de consentement `aoi_cookies` sont conservés. Les traceurs restent
conditionnés au consentement. Les liens vers l’extranet, WhatsApp et le contact,
les métadonnées SEO, le sitemap et les redirections existantes sont conservés.

## Portée des exemples et des vérifications

`operation.html` reste une fiche illustrative, sans connexion à une opération
réelle de l’extranet. `demo-ia.html` présente des valeurs fictives fixes, clairement
signalées : aucune analyse réelle de l’adresse saisie n’est exécutée. Les démos
extranet et logiciel sont des simulations animées.

Les vérifications couvrent le rendu sur ordinateur et mobile, les parcours de
navigation, les documents, les guides et les données envoyées par les trois
profils du formulaire avec des réponses API simulées. Aucune inscription réelle
n’a été envoyée ; l’API de production et les paiements n’ont pas été testés.
Les 14 guides de la livraison précédente sont conservés sans modification de leurs
modules. Le contrat API et la logique d’inscription restent inchangés ; les évolutions légales de la v5.5 sont détaillées ci-dessus.

Les huit nouveaux guides sont transcrits depuis les PDF fournis, avec adaptation
du pied de page et de l’appel à l’action à une lecture publique. Leur contenu
juridique et fiscal n’a pas fait l’objet d’une nouvelle validation de fond.
Dans le PDF du guide 19, la cellule « Urbanisme » était coupée après « attestation
de no » : elle est reformulée en « Permis et déclarations antérieurs, justificatifs
de conformité » pour éviter de publier une phrase tronquée.

## Les huit nouveaux guides

| N° | Sujet | Page |
| --- | --- | --- |
| 14 | Contrats de construction : CCMI, TCE, contractant général | `guides/contrats-construction-ccmi-tce.html` |
| 15 | Notaire vendeur et notaire acquéreur | `guides/deux-notaires-vente-immobiliere.html` |
| 16 | TVA mixte et comptabilité par lot | `guides/tva-mixte-comptabilite-lot-par-lot.html` |
| 17 | Plans de principe et d’exécution | `guides/plans-principe-execution.html` |
| 18 | Qui mandate qui | `guides/qui-mandate-qui-operation-immobiliere.html` |
| 19 | Vendre à un marchand de biens | `guides/vendre-a-un-marchand-de-biens.html` |
| 20 | Sous-traitance | `guides/sous-traitance-obligations-operateur.html` |
| 21 | Étude de sol G1 et G2 | `guides/etude-sol-g1-g2.html` |

## Ajouter ou modifier un guide

1. Éditer `articles/<slug>.js`. Pour un ajout, copier la structure d’un guide n° 14
   à 21, renseigner son contenu et ses métadonnées, puis déposer la couverture dans
   `assets/`. Conserver un objet JSON valide après `export const article =`.
2. Ajouter son slug à `newGuides` dans `content/library.json` et renseigner ses
   liens `related` et `next`. Mettre à jour `dateModified` lors d’une modification.
3. Exécuter, avec Node.js installé :

   ```bash
   node tools/build-guides.mjs
   ```

4. Vérifier les pages localement, puis inclure les fichiers générés dans le commit.

Le générateur reconstruit `ressources.html`, `articles-index.js`, les pages de
`guides/` et les entrées du sitemap. Ne pas modifier ces fichiers générés directement.
Pour la structure des pages, modifier `tools/build-guides.mjs` et
`templates/ressources.html`. Le nombre de guides est calculé automatiquement.

Les 14 guides historiques gardent leurs URL `article.html?a=slug` et leur rendu
dans `legal-render.js`. Pour leurs cartes, modifier `legacyCards` dans
`content/library.json`. Les nouveaux slugs appelés via l’ancien gabarit redirigent
vers leur page HTML. La présentation commune est dans `assets/aoi-pages.css`.
