// Sophie Bizley — Portfolio (Editorial Mix)
// Shared behavior: mobile nav, scroll reveal, count-up stats, reduced-motion handling.
(function () {
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile nav toggle
  var burger = document.querySelector('.burger');
  var navlinks = document.querySelector('.navlinks');
  if (burger && navlinks) {
    burger.addEventListener('click', function () {
      var open = navlinks.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navlinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navlinks.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Reduced-motion: swap animated GIFs for their static poster frame
  document.querySelectorAll('img[data-gif]').forEach(function (im) {
    if (reduceMotion) im.src = im.getAttribute('data-gif');
  });

  var setFinalCount = function (el) {
    var t = el.getAttribute('data-count');
    if (!t) return;
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    el.textContent = prefix + parseFloat(t).toFixed(decimals) + suffix;
  };

  if (reduceMotion) {
    document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('is-visible'); });
    document.querySelectorAll('.num-count').forEach(setFinalCount);
    return;
  }

  // Scroll reveal
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  items.forEach(function (el) {
    var delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
    if (delay) el.style.transitionDelay = delay + 'ms';
  });
  var reveal = function (el) {
    if (el._revealed) return;
    el._revealed = true;
    el.classList.add('is-visible');
  };

  // Count-up
  var animateNum = function (el) {
    if (el._counted) return;
    el._counted = true;
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1400;
    var start = performance.now();
    var step = function (now) {
      var t = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target.toFixed(decimals) + suffix;
    };
    requestAnimationFrame(step);
  };
  var nums = Array.prototype.slice.call(document.querySelectorAll('.num-count'));

  var checkVisible = function () {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    items.forEach(function (el) {
      if (el._revealed) return;
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) reveal(el);
    });
    nums.forEach(function (el) {
      if (el._counted) return;
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.9 && r.bottom > 0) animateNum(el);
    });
  };

  requestAnimationFrame(function () { requestAnimationFrame(checkVisible); });
  window.addEventListener('scroll', checkVisible, { passive: true });
  window.addEventListener('resize', checkVisible);

  // Guaranteed fallback in case something never crosses the visibility threshold
  setTimeout(function () { items.forEach(reveal); nums.forEach(animateNum); }, 2500);
})();
