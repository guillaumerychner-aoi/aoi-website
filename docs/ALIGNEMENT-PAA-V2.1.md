# AOI Network — alignement avec PAA v2.1

Mise à jour du 27 septembre 2026, à partir du dépôt `AOI-Network-PAA-en-ligne`.

## Où voir les modifications

1. **`pieces-a-lappui.html`** : nouvelle accroche, indépendance visible dès le hero, destinataires identifiés, analyse initiale, suivi et intervention face aux aléas ou retards. Accès directs au rapport, aux missions, aux honoraires, au cadre et aux compétences sur PAA. Le logo est repris du dépôt PAA v2.1 ; la palette, les polices et la mise en page restent celles d’AOI.
2. **`index.html`** : réponse « Quel lien entre AOI et Pièces à l’appui ? » dans la FAQ. Les missions et les critères d’indépendance sont explicités, avec accès à la page de présentation et au site PAA.
3. **`accompagnement.html`** : le renvoi final explique les trois moments d’intervention de PAA et ses critères d’acceptation.
4. **`cadre-missions.html`** : périmètre des analyses, honoraires, aléas et appui aux échanges, rôle des intervenants consultés. L’accompagnement AOI et la mission indépendante PAA restent distingués.

Les honoraires détaillés sont présentés sur PAA. AOI n’affiche pas une seconde grille. Le script `tools/link-paa.mjs` prend en charge les quatorze accès vers PAA, avec leurs chemins et leurs ancres.

## Cohérence de la présentation

Les honoraires rémunèrent l’analyse, indépendamment du financement et du résultat. Les liens du groupe, des dirigeants et des auteurs de l’avis sont examinés avant acceptation. Une commission du groupe liée à la réalisation de l’opération, un autre intérêt économique dans son issue ou l’appréciation de ses propres travaux dans l’opération exclut une analyse indépendante PAA.

Des professionnels AOI ou extérieurs peuvent être consultés selon le dossier. Les explications d’un intervenant impliqué ne sont pas présentées comme un avis indépendant sur ses propres travaux. Les sources, les limites, les pièces manquantes et les rôles respectifs restent explicites.

## Vérifications effectuées

- **23 pages HTML, 864 références locales contrôlées** : fichiers, liens et ressources présents.
- **14 liens vers PAA v2.1 vérifiés** contre les pages du dépôt livré, y compris les ancres `notre-engagement` et `experts-reseau`.
- Rendu de la page PAA, de l’accueil, de l’accompagnement et du cadre vérifié dans Chromium à **1 440, 390 et 320 pixels**. Aucun débordement horizontal détecté. Le message d’indépendance est visible dès le premier écran aux dimensions testées.
- Rendu de la présentation PAA inspecté sur ordinateur et mobile. Aucune violation détectée par axe sur cette page pour les règles WCAG A/AA testées ; il ne s’agit pas d’une certification d’accessibilité.
- Parcours accueil → présentation PAA, rapport, contact et menu mobile → Rejoindre contrôlés.
- Inscription des **trois profils AOI** vérifiée avec des réponses API simulées : opérateur et co-opérateur en `niveau3`, prestataire en `niveau2`. La sélection Notaire affiche l’exemption de commission. Une réponse serveur en erreur n’affiche pas une création de compte réussie.
- Aucune erreur JavaScript détectée durant ces parcours. Aucun compte, e-mail, paiement ou véritable appel d’inscription n’a été créé ou envoyé.

Les essais des destinations PAA ont utilisé les fichiers de la v2.1 servie dans le navigateur de recette. Ils ne prouvent pas la présence de cette version sur le domaine public. **Publier également le dépôt PAA v2.1 livré séparément pour rendre ces pages disponibles en ligne.** La configuration réelle des API de production n’a pas été testée.

## Livraison

Le dépôt complet est fourni, sans compilation à effectuer. Le formulaire Rejoindre, son contrat API, les CGV v5.5, les commissions, les 22 guides et l’animation d’accueil sont conservés. Cette mise à jour éditoriale ne constitue pas une nouvelle validation juridique des textes contractuels.

Décompresser `AOI-Network-PAA-v2.1-aligne.zip`, copier le **contenu** du dossier `AOI-Network-PAA-en-ligne` à la racine du dépôt AOI existant en remplaçant les fichiers concernés, puis vérifier les changements dans GitHub Desktop. Conserver le dossier `.git`. Aucun commit, push ou déploiement n’a été effectué pendant cette préparation.
