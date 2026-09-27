# AOI Network et Pièces à l’appui — livraison du 27 septembre 2026

## Organisation retenue

AOI Holding demeure la société mère. AOI Network exploite le réseau, l’accompagnement
d’opération sous son nom et la marque Pièces à l’appui. Les deux chartes restent distinctes.

- AOI : accompagnement facultatif et sur devis, sans présentation comme revue indépendante.
- PAA : revue immobilière indépendante après examen des liens, accessible sans adhésion.
- Une adhésion AOI seule ne déclenche aucun refus ; les intérêts dans l’opération,
  les prestations déjà réalisées et la relation commerciale sont examinés.
- Une opération dans laquelle le groupe a un intérêt autre que les honoraires de revue,
  ou une revue de son propre travail, est exclue des analyses indépendantes PAA.

## Modifications

- Nouvelle page `accompagnement.html`, bloc court sur l’accueil et ligne de prix sur devis.
- Page de présentation `pieces-a-lappui.html`, désormais reliée au site PAA public et à son formulaire de cadrage.
- Nouvelle page `cadre-missions.html`, liée aux pages commerciales et aux CGV.
- Entrées dans les pieds de page, rappel dans Rejoindre, FAQ et sitemap actualisés.
- Les huit guides sont régénérés depuis leurs sources ; les 22 guides restent accessibles.
- CGV v5.5 : ajout de l’article 1.5 et précision des titres et du champ de l’article 4.
  Les articles 2 et 6 de la v5.4, notamment l’exemption des professions réglementées,
  sont conservés à l’identique dans leurs données.
- Mentions légales : reprise de la dénomination AOI Network et du RCS Nanterre
  101 608 164 figurant dans les dernières CGV fournies. Le RCS n’est pas présenté
  comme un SIRET. La situation TVA reste celle à confirmer par l’exploitant.

Les changements contractuels constituent une préparation éditoriale à faire relire
avant leur application. Ils ne remplacent ni la vérification de l’objet social,
ni la confirmation de l’assurance, ni les conditions propres à chaque mission.

## Liaison avec le site PAA

Le domaine PAA est confirmé et publié : `https://piecesalappui.fr`.

- FAQ de l’accueil : lien direct vers le site PAA.
- Page Accompagnement : lien « Découvrir Pièces à l’appui » vers le site PAA.
- Page locale `pieces-a-lappui.html` : bouton de découverte vers le site, et deux appels à décrire le dossier vers `https://piecesalappui.fr/contact.html`.
- Pieds de page : accès à la présentation locale qui explique les liens et les conditions d’indépendance.

L’ancien cadrage PAA par mailto est remplacé par le formulaire public. Les informations de transmission ont été adaptées en conséquence. Le script ci-dessous actualise les cinq liens explicites si nécessaire :

```bash
node tools/link-paa.mjs https://piecesalappui.fr
```

Le repo PAA v1.9 configure déjà ce domaine et son formulaire Vercel/Resend. Cette archive AOI complète contient aussi les trois nouvelles pages auxquelles le site PAA peut renvoyer. Copier son contenu à la racine du dépôt AOI puis publier ; la page PAA locale doit alors être accessible à `https://www.aoi-network.com/pieces-a-lappui.html`.

## Contact, contrats et confidentialité

Les contacts d’accompagnement AOI ouvrent une messagerie. Les contacts PAA ouvrent le formulaire de PAA, qui transmet la demande à son équipe. Ces parcours ne soumettent pas l’API d’inscription, ne créent aucun compte et ne déclenchent aucun paiement. Le formulaire Rejoindre conserve son intégration existante.

Avant une mission : identifier le client, le payeur, les destinataires, les liens,
les diligences, les livrables, les compétences, le calendrier, les honoraires et
les assurances réellement applicables. Une revue demandée n’est pas automatiquement acceptée.

Le nouveau cadre distingue les honoraires directs et les commissions éventuelles
sur d’autres collaborations. Il ne donne aucune garantie de réussite, aucun label
de sécurité et aucune habilitation pour une activité réglementée.

## Références de cadrage

- Dernières CGV v5.4 fournies : source de l’identité et des commissions AOI.
- Service Public, ajout d’activité : https://entreprendre.service-public.gouv.fr/vosdroits/F36227
- Code de la consommation, L121-2 et L121-5 : présentation loyale des qualités et engagements.
- CNIL, exemples de mentions d’information : https://www.cnil.fr/fr/passer-laction/rgpd-exemples-de-mentions-dinformation

Ces références n’attestent pas la validation juridique des documents livrés.
