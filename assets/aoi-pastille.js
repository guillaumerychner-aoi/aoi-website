// Pastille « en direct » de la barre de menu : membres et montant déjà chiffré (€ HT, arrondi vers le bas).
// Les chiffres écrits dans la page servent de secours si la plateforme ne répond pas.
(function () {
  var SOURCE = 'https://extranet.aoi-network.com/api/public/reseau';
  var nf = new Intl.NumberFormat('fr-FR');
  function court(m) { return m >= 1e6 ? nf.format(Math.floor(m / 1e5) / 10) + ' M€' : nf.format(Math.floor(m / 1000)) + ' k€'; }
  function poser(sel, val) {
    document.querySelectorAll(sel).forEach(function (el) {
      if (el.textContent === val) return;
      el.textContent = val; el.classList.add('is-maj');
      setTimeout(function () { el.classList.remove('is-maj'); }, 1600);
    });
  }
  function maj() {
    fetch(SOURCE, { credentials: 'omit' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      if (!d || !(d.membres > 0)) return;
      var montant = Number(d.consultations && d.consultations.montantChiffre) || 0;
      poser('[data-pastille-membres]', nf.format(d.membres));
      if (montant > 0) poser('[data-pastille-montant]', court(montant));
      document.querySelectorAll('[data-pastille]').forEach(function (a) {
        a.setAttribute('aria-label', nf.format(d.membres) + ' membres, ' + (montant > 0 ? court(montant) + ' HT déjà chiffrés' : '') + ' — chiffres en direct de la plateforme');
      });
    }).catch(function () {});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', maj); else maj();
  // Rafraîchit toutes les deux minutes tant que la page est ouverte et visible.
  setInterval(function () { if (!document.hidden) maj(); }, 120000);
})();
