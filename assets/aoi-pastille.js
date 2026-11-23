// Pastille « en direct » de la barre de menu : membres et montant déjà chiffré (€ HT, arrondi vers le bas).
// 23/11/2026 : plus de retour à un ancien chiffre au chargement. Les derniers chiffres reçus sont gardés
// dans le navigateur et affichés aussitôt ; sans eux, les chiffres restent masqués jusqu'à la réponse de
// la plateforme (au plus 2,5 s, puis les chiffres écrits dans la page servent de secours).
(function () {
  var SOURCE = 'https://extranet.aoi-network.com/api/public/reseau';
  var CLE = 'aoi-reseau-v1';
  var nf = new Intl.NumberFormat('fr-FR');
  function court(m) { return m >= 1e6 ? nf.format(Math.floor(m / 1e5) / 10) + ' M€' : nf.format(Math.floor(m / 1000)) + ' k€'; }
  function pret() { document.querySelectorAll('[data-pastille]').forEach(function (a) { a.classList.add('is-pret'); }); }
  function poser(sel, val, signaler) {
    document.querySelectorAll(sel).forEach(function (el) {
      if (el.textContent === val) return;
      el.textContent = val;
      if (!signaler) return;
      el.classList.add('is-maj');
      setTimeout(function () { el.classList.remove('is-maj'); }, 1600);
    });
  }
  function appliquer(d, signaler) {
    if (!d || !(d.membres > 0)) return false;
    var montant = Number(d.consultations && d.consultations.montantChiffre) || 0;
    poser('[data-pastille-membres]', nf.format(d.membres), signaler);
    if (montant > 0) poser('[data-pastille-montant]', court(montant), signaler);
    document.querySelectorAll('[data-pastille]').forEach(function (a) {
      a.setAttribute('aria-label', nf.format(d.membres) + ' membres, ' + (montant > 0 ? court(montant) + ' HT déjà chiffrés' : '') + ' — chiffres en direct de la plateforme');
    });
    pret();
    return true;
  }
  function lireCache() {
    try { var c = JSON.parse(localStorage.getItem(CLE) || 'null'); return c && Date.now() - c.t < 7 * 864e5 ? c.d : null; } catch (e) { return null; }
  }
  function ecrireCache(d) { try { localStorage.setItem(CLE, JSON.stringify({ t: Date.now(), d: d })); } catch (e) { /* navigation privée */ } }
  var dejaAffiche = false;
  function maj() {
    fetch(SOURCE, { credentials: 'omit' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      if (d && d.membres > 0) { ecrireCache(d); appliquer(d, dejaAffiche); dejaAffiche = true; }
    }).catch(function () {}).then(pret);
  }
  function demarrer() {
    if (appliquer(lireCache(), false)) dejaAffiche = true;
    setTimeout(pret, 2500);
    maj();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer); else demarrer();
  // Rafraîchit toutes les deux minutes tant que la page est ouverte et visible.
  setInterval(function () { if (!document.hidden) maj(); }, 120000);
})();
