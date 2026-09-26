# AOI Network — site vitrine

Refonte complète · Septembre 2026 · CGV v5.4

Site statique en français, prêt à publier sans compilation. Les 20 pages HTML et les
22 guides reprennent la charte de l’accueil : vert profond, crème, cuivre,
Instrument Serif et Manrope. Les polices sont hébergées dans le dépôt.

## Installer avec GitHub Desktop

1. Décompresser `AOI-Network-Repo-Complet.zip`.
2. Dans GitHub Desktop, ouvrir le dépôt du site, puis **Repository → Show in Explorer**
   (ou **Show in Finder** sur Mac).
3. Copier **le contenu** du dossier extrait `aoi-website-main` à la racine de ce dépôt.
   Accepter le remplacement des fichiers existants. Conserver le dossier `.git`.
   Ne pas créer un sous-dossier `aoi-website-main` dans le dépôt existant.
4. Revenir dans GitHub Desktop et vérifier les changements.
5. Créer un commit, par exemple :
   `Ajoute huit guides publics et leurs illustrations à la bibliothèque AOI`.
6. Utiliser **Push origin** lorsque la version est prête à être mise en ligne.
   Si le dépôt est relié à Vercel, le push peut déclencher son déploiement habituel.

L’archive contient l’ensemble du site, sans dépendances de prévisualisation ni
historique Git. Aucun commit, push ou déploiement n’a été effectué pour préparer
cette livraison.

## Ce qui a changé

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

Le fichier `legal-data.js` fourni a été intégré à l’identique : **CGV v5.4**.
La liste utilisée par les rappels du site et le formulaire est celle des CGV :

- Notaires
- Avocats
- Commissaires de justice
- Experts-comptables
- Fiscalistes
- Commissaires aux comptes

Le message porte sur l’absence de commission AOI sur leurs missions. Les autres
modalités sont accessibles dans les CGV, notamment l’article 6
(`cgv.html#sec-6`). Le fichier contractuel n’a pas été réécrit pour la refonte.

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
modules. Le formulaire et le fichier légal fourni restent inchangés dans cette livraison.

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
