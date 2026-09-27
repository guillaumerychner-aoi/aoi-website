# Recette AOI — 27 septembre 2026

## Vérifications

- 23 pages HTML livrées : 15 à la racine et 8 nouveaux guides publics. Les 14 guides historiques conservent leur gabarit dynamique et leurs URL.
- 62 chemins locaux distincts référencés par les pages HTML vérifiés présents. Ancres propres aux trois nouvelles pages valides.
- 19 pages contrôlées dans Chromium à 390 pixels : rendu, un h1 et absence de débordement horizontal de page. Les trois démonstrations animées et le gabarit article générique ne sont pas inclus dans ce parcours automatique.
- Inspection graphique à 1 440 et 390 pixels des pages Accompagnement et Pièces à l’appui et du nouveau bloc d’accueil.
- Création de compte simulée pour opérateur, co-opérateur et prestataire/notaire : contrats API niveau3/niveau3/niveau2 conservés ; profil et activité transmis correctement. Erreur serveur simulée : erreur affichée, aucune fausse confirmation.
- Script d’inscription Rejoindre identique à la source livrée auparavant. Aucun compte ni paiement réel créé. Les dépendances React/ReactDOM/Babel ont été fournies localement dans leurs versions exactes pour ces essais ; aucune disponibilité du CDN en production n’en est déduite.
- Articles 2 et 6 des CGV comparés structurellement : identiques à la v5.4 fournie, barèmes et exemptions compris. Les autres modifications sont décrites dans MISE-A-JOUR-AOI-PAA-2026-09-27.md.
- Les 22 modules d’articles sont conservés octet par octet. La bibliothèque et les huit pages HTML de guides ont été régénérées depuis leurs sources.
- Aucune erreur JavaScript pendant les parcours de recette. Aucun envoi réel, push ou déploiement.

## Portée

Les essais se font localement dans Chromium ; pas de téléphone physique, Safari ou Firefox. Les réponses API sont simulées ; l’API, les paiements et la délivrabilité en production ne sont pas validés par ces tests.

Le domaine PAA reste à confirmer. AOI propose une page locale de présentation avec contact utilisable ; le script tools/link-paa.mjs permet d’ajouter le lien vers son domaine réel sans le deviner.

Les modifications de CGV et documents de mission constituent une préparation à faire relire avant application. L’identité de société provient des CGV fournies, sans nouvelle vérification au registre.

Archive vérifiée par CRC et SHA-256, sans dépendances de recette ni historique Git. Suivre le README pour copier son contenu à la racine du dépôt existant et préserver le dossier .git.


## Liaison au domaine PAA publié — 27 septembre 2026

- Cinq liens explicites configurés : accueil et accompagnement vers `https://piecesalappui.fr` ; présentation PAA avec découverte et deux accès au formulaire `https://piecesalappui.fr/contact.html`.
- Les deux destinations PAA ont répondu en HTTP 200 lors de ce contrôle. Le formulaire public est bien en mode `endpoint` sur `/api/contact`. Aucun formulaire réel n’a été soumis pendant ce contrôle.
- 23 pages HTML et 862 références locales vérifiées, correspondant à 62 cibles locales distinctes.
- Présentation PAA vérifiée dans Chromium en 1440 px et 390 px : liens présents, appels à l’action visibles, aucun débordement mobile et aucune erreur JavaScript. Contrôle des liens de l’accueil et de la page Accompagnement.
- Le fichier `rejoindre.html`, sa création de compte, les données CGV, la configuration Vercel et les 22 modules d’articles sont identiques à ceux de la livraison précédente.
- Le contrôle public d’AOI a trouvé l’accueil antérieur aux ajouts PAA ; `accompagnement.html`, `pieces-a-lappui.html` et `cadre-missions.html` répondaient encore en 404. Cette archive contient les trois pages à publier dans le dépôt AOI existant.
- Aucun commit, push, déploiement distant, compte ou e-mail réel n’a été déclenché depuis cet environnement.
