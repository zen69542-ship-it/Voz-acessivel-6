
(function () {
  var root = document.documentElement;
  var KEY = 'convive-motor-prefs';
  var FLAGS = ['targets', 'spacing', 'gestures', 'confirm', 'cursor', 'focus', 'time'];

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function save(prefs) {
    try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) {}
  }

  var prefs = load();
  FLAGS.forEach(function (f) {
    if (prefs[f]) root.classList.add('motor-' + f);
  });

  window.MotorAccess = {
    isOn: function (flag) { return root.classList.contains('motor-' + flag); }
  };

  document.addEventListener('DOMContentLoaded', function () {
    var buttons = document.querySelectorAll('[data-motor]');
    var allBtn = document.getElementById('motorAllBtn');

    function syncButtons() {
      buttons.forEach(function (b) {
        b.classList.toggle('active', root.classList.contains('motor-' + b.dataset.motor));
        b.setAttribute('aria-pressed', root.classList.contains('motor-' + b.dataset.motor) ? 'true' : 'false');
      });
      if (allBtn) {
        var allOn = FLAGS.every(function (f) { return root.classList.contains('motor-' + f); });
        allBtn.classList.toggle('active', allOn);
        allBtn.textContent = allOn ? 'Todas as opções recomendadas estão ativas' : 'Ativar todas as opções recomendadas';
      }
      document.dispatchEvent(new CustomEvent('convive:motorchange'));
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var flag = btn.dataset.motor;
        root.classList.toggle('motor-' + flag);
        prefs[flag] = root.classList.contains('motor-' + flag);
        save(prefs);
        syncButtons();
      });
    });

    if (allBtn) {
      allBtn.addEventListener('click', function () {
        var allOn = FLAGS.every(function (f) { return root.classList.contains('motor-' + f); });
        FLAGS.forEach(function (f) {
          root.classList.toggle('motor-' + f, !allOn);
          prefs[f] = !allOn;
        });
        save(prefs);
        syncButtons();
      });
    }

    syncButtons();
  });
})();
