/* ===========================================================
   Workmath — AdSense loader
   -----------------------------------------------------------
   Leave CLIENT empty until AdSense has approved the site.
   While it is empty this file does nothing at all: the ad
   placeholder <div>s stay hidden, so a reviewer never sees an
   empty ad container.

   After approval:
     1. Set CLIENT to your publisher ID, e.g. 'ca-pub-1234567890123456'.
     2. Create one "Display" ad unit per placement in AdSense and
        paste the data-ad-slot values into SLOTS below. Any slot
        left as '' simply stays hidden.
     3. Deploy. Caching for this file is 1 hour (see _headers).
   =========================================================== */
(function () {
  'use strict';

  // ---- configuration -------------------------------------------------
  var CLIENT = '';   // e.g. 'ca-pub-1234567890123456'

  var SLOTS = {
    top:    '',      // leaderboard under the H1
    mid:    '',      // in-article, between the calculator and the prose
    bottom: ''       // below the FAQ, above "Related calculators"
  };
  // --------------------------------------------------------------------

  if (!CLIENT) return;                       // not yet approved
  if (navigator.doNotTrack === '1') return;  // respect DNT

  // 1. load the AdSense library once
  var lib = document.createElement('script');
  lib.async = true;
  lib.crossOrigin = 'anonymous';
  lib.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + CLIENT;
  document.head.appendChild(lib);

  // 2. replace each placeholder with a real <ins> unit
  function fill() {
    var units = document.querySelectorAll('.ad-slot[data-ad]');
    for (var i = 0; i < units.length; i++) {
      (function (box) {
        if (box.dataset.adFilled === '1') return;
        var key = box.getAttribute('data-ad');
        var slot = SLOTS[key];
        if (!slot) return;                   // placement not configured yet

        var ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        ins.style.display = 'block';
        ins.setAttribute('data-ad-client', CLIENT);
        ins.setAttribute('data-ad-slot', slot);
        ins.setAttribute('data-ad-format', 'auto');
        ins.setAttribute('data-full-width-responsive', 'true');

        box.innerHTML = '';
        box.appendChild(ins);
        box.classList.add('filled');
        box.removeAttribute('hidden');
        box.dataset.adFilled = '1';

        (window.adsbygoogle = window.adsbygoogle || []).push({});
      })(units[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fill);
  } else {
    fill();
  }
})();
