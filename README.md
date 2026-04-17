# aoi-website

Site vitrine AOI Network — `www.aoi-network.com`

---

## Toggles & directives maintenance

### Bandeau ticker métriques (masqué)

Le bandeau défilant qui affichait `Opérations en structuration · Volume SEP · Marges brutes · Missions · Budget` est **actuellement masqué**.

**Raison** : tant que les compteurs réseau sont à zéro, afficher le bandeau annonce le vide et dessert le positionnement (cf. pivot V9 — « les opérateurs n'entrent pas dans un réseau vide »).

**Pour le réactiver dès que les chiffres seront positifs** :
1. Ouvrir `index.html`
2. Chercher `id="stats-ticker-band"`
3. Sur cette même balise `<div>`, remplacer `display:none` par `display:block`

C'est tout. Le JS qui fetch `https://extranet.aoi-network.com/api/public/stats` est déjà branché, la mise en page est prête, les fallbacks fonctionnent.

### Séparateurs visuels entre sections sombres

Le hero, Le Constat (`#problemes`) et La Plateforme (`.platform-preview`) ont tous les trois un fond sombre quasi identique. Sans rupture, ils se lisent comme un seul bloc.

Pour créer la respiration, deux séparateurs sobres ont été ajoutés :
- Entre le hero et Le Constat (juste après `#stats-ticker-band`)
- Entre Le Constat et La Plateforme (juste après la fermeture de `#problemes`)

Chaque séparateur est un bloc `<div aria-hidden="true">` avec un filament orange centré. Ils sont autonomes — repérables dans le code par le commentaire `═══ Séparateur visuel entre sections sombres ═══`.

Si le bandeau ticker est un jour réactivé, les séparateurs peuvent rester en place : ils restent cohérents avec la mise en page.
