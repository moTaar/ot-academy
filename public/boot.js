/* Loader: starts the modern front end, or the Internet Explorer 11 build on
   browsers that can't run it (e.g. the default browser of Windows Server 2016).
   This is the one script every browser executes, so it must stay plain ES5.
   Add ?legacy=1 to the URL to force the IE11 build in any browser (testing). */
(function () {
  'use strict';
  var script = document.createElement('script');
  var forced = /[?&]legacy=1(&|$)/.test(window.location.search);
  var modern = ('noModule' in script) &&
    typeof window.fetch === 'function' &&
    !!(window.CSS && window.CSS.supports && window.CSS.supports('--probe', '0'));

  if (forced || !modern) {
    document.documentElement.className += ' legacy';
    var css = document.getElementById('main-css');
    if (css) css.href = 'legacy/styles.legacy.css';
    script.src = 'legacy/app.legacy.js';
  } else {
    script.src = 'app.js';
  }
  document.body.appendChild(script);
})();
