/* ===========================================================
   PaycheckLab — shared runtime
   - currency switcher (persisted in localStorage)
   - money / number formatting
   - small DOM helpers used by the calculators
   No dependencies. ~4KB.
   =========================================================== */
(function () {
  'use strict';

  var CUR_KEY = 'pl_currency';

  var CURRENCIES = {
    USD: { symbol: '$',  locale: 'en-US', label: 'USD $' },
    GBP: { symbol: '\u00A3', locale: 'en-GB', label: 'GBP \u00A3' },
    EUR: { symbol: '\u20AC', locale: 'de-DE', label: 'EUR \u20AC' },
    CAD: { symbol: 'C$', locale: 'en-CA', label: 'CAD C$' },
    AUD: { symbol: 'A$', locale: 'en-AU', label: 'AUD A$' },
    NZD: { symbol: 'NZ$', locale: 'en-NZ', label: 'NZD NZ$' },
    INR: { symbol: '\u20B9', locale: 'en-IN', label: 'INR \u20B9' },
    ZAR: { symbol: 'R', locale: 'en-ZA', label: 'ZAR R' }
  };

  var PL = {
    cur: 'USD',

    init: function () {
      try {
        var saved = localStorage.getItem(CUR_KEY);
        if (saved && CURRENCIES[saved]) PL.cur = saved;
      } catch (e) { /* private mode */ }

      var selects = document.querySelectorAll('select[data-currency-select]');
      for (var i = 0; i < selects.length; i++) {
        var sel = selects[i];
        sel.innerHTML = '';
        Object.keys(CURRENCIES).forEach(function (code) {
          var o = document.createElement('option');
          o.value = code;
          o.textContent = CURRENCIES[code].label;
          if (code === PL.cur) o.selected = true;
          sel.appendChild(o);
        });
        sel.addEventListener('change', function (ev) {
          PL.cur = ev.target.value;
          try { localStorage.setItem(CUR_KEY, PL.cur); } catch (e) {}
          document.dispatchEvent(new CustomEvent('pl:currency'));
        });
      }

      var yrs = document.querySelectorAll('[data-year]');
      for (var j = 0; j < yrs.length; j++) yrs[j].textContent = new Date().getFullYear();
    },

    symbol: function () { return CURRENCIES[PL.cur].symbol; },
    locale: function () { return CURRENCIES[PL.cur].locale; },

    /** 1234.5 -> "$1,234.50" */
    money: function (n, decimals) {
      var d = (decimals === undefined) ? 2 : decimals;
      if (!isFinite(n)) return '\u2014';
      var c = CURRENCIES[PL.cur];
      try {
        return new Intl.NumberFormat(c.locale, {
          style: 'currency', currency: PL.cur,
          minimumFractionDigits: d, maximumFractionDigits: d
        }).format(n);
      } catch (e) {
        return c.symbol + n.toFixed(d);
      }
    },

    /** 1234.5 -> "1,234.50" (no symbol) */
    num: function (n, decimals) {
      var d = (decimals === undefined) ? 2 : decimals;
      if (!isFinite(n)) return '\u2014';
      try {
        return new Intl.NumberFormat(PL.locale(), {
          minimumFractionDigits: d, maximumFractionDigits: d
        }).format(n);
      } catch (e) { return n.toFixed(d); }
    },

    pct: function (n, decimals) {
      var d = (decimals === undefined) ? 1 : decimals;
      if (!isFinite(n)) return '\u2014';
      return n.toFixed(d) + '%';
    },

    /** read a numeric input, fall back to a default. clamps to [min,max]. */
    val: function (id, dflt, min, max) {
      var el = document.getElementById(id);
      if (!el) return dflt;
      var v = parseFloat(el.value);
      if (!isFinite(v)) v = dflt;
      if (min !== undefined && v < min) v = min;
      if (max !== undefined && v > max) v = max;
      return v;
    },

    txt: function (id, str) {
      var el = document.getElementById(id);
      if (el) el.textContent = str;
    },

    /** write a result row value by id */
    set: function (id, str) {
      var el = document.getElementById(id);
      if (el) el.textContent = str;
    },

    /** bind fn to input/change on a list of element ids */
    watch: function (ids, fn) {
      ids.forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', fn);
        el.addEventListener('change', fn);
      });
      document.addEventListener('pl:currency', fn);
      fn();
    },

    copy: function (text, btn) {
      var done = function () {
        if (!btn) return;
        var old = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = old; }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {});
      } else {
        var ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    }
  };

  window.PL = PL;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', PL.init);
  } else {
    PL.init();
  }
})();
