(function () {
  'use strict';

  if (!document.addEventListener) {
    return;
  }

  var header = document.getElementById('app-header');
  var main = document.getElementById('contenu-principal');
  var footer = document.getElementById('app-footer');

  if (header) {
    header.innerHTML = '
      <div class="container app-header__inner">
        <a class="app-header__brand" href="/">MPR Nantes</a>
      </div>
    ';
  }

  if (main) {
    main.innerHTML = '
      <div class="container">
        <h2>Veuillez mettre à jour votre navigateur.</h2>
        <p>Cette application nécessite un navigateur moderne pour fonctionner correctement.</p>
        <p>Vous pouvez accéder aux plateformes via les liens directs :</p>
        <ul>
          <li><a href="/ortho/ortho.html">Plateforme Orthophonie</a></li>
          <li><a href="/neuro/neuro.html">Plateforme Neuropsychologie</a></li>
        </ul>
      </div>
    ';
  }

  if (footer) {
    footer.innerHTML = '
      <div class="container app-footer__meta">
        <p>© 2025 Romain Ecarnot</p>
      </div>
    ';
  }
})();

