# AOI Network — site vitrine

Refonte complète · Septembre 2026 · CGV v5.4

Site statique en français, sans compilation. Les 12 pages HTML et le gabarit des
14 guides reprennent la charte de l’accueil : vert profond, crème, cuivre,
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
   `Harmonise le site AOI et précise les exemptions de commission`.
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
- **Bibliothèque** : une lecture à la une et 13 autres guides, soit 14 au total.
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
| `ressources.html` | Bibliothèque de 14 guides |
| `article.html?a=slug` | Gabarit des guides |
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
| `assets/aoi-scene.js` | Progression de l’animation d’accueil au scroll |
| `assets/aoi-fonts.css`, `assets/fonts/` | Polices locales et licences |
| `legal-data.js`, `legal-render.js` | Source légale et rendu des documents |
| `articles-index.js`, `articles/` | Index et contenus des guides |
| `support.js` | Runtime existant des pages dynamiques, à conserver |
| `vercel.json` | Configuration et redirections existantes |

Les visuels de la scène d’accueil sont décrits dans `assets/aoi-visuals.md`.

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
Les 14 guides sont conservés. Trois guides comportent des corrections ciblées des
  promesses commerciales ; les 11 autres modules sont inchangés. Le fichier légal est intact.

## Ajouter ou modifier un guide

1. Créer ou éditer `articles/<slug>.js` sur le modèle des modules existants.
2. Pour un nouveau guide, l’ajouter à `articles-index.js` et au tableau `rows`
   de `ressources.html`, puis mettre à jour le nombre de guides affiché.
3. Mettre à jour les liens `next` et déposer sa couverture dans `assets/`.
4. Ajouter son URL au `sitemap.xml` et son slug dans les options d’édition
   du bloc `data-props` d’`article.html`.

Un seul guide est chargé à la demande. Le rendu commun est dans `legal-render.js`
et sa présentation dans `assets/aoi-pages.css`.
