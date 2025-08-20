/* global barba, gsap, ScrollTrigger */
(function () {
  if (typeof barba === 'undefined') return;
  const NAV_SELECTOR = '.nav-links a';
  let overlayEl = null;

  function updateActiveNav(namespace) {
    document.querySelectorAll(NAV_SELECTOR).forEach(function (a) {
      a.classList.remove('active');
      const href = a.getAttribute('href') || '';
      if (
        (namespace === 'home' && href.includes('index')) ||
        (namespace === 'recipes' && href.includes('recipes')) ||
        (namespace === 'planner' && href.includes('meal-planner')) ||
        (namespace === 'favorites' && href.includes('favourites')) ||
        (namespace === 'about' && href.includes('about')) ||
        (namespace === 'pricing' && href.includes('pricing'))
      ) {
        a.classList.add('active');
      }
    });
  }

  function killGsap() {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.getAll().forEach(function (t) { try { t.kill(); } catch (_) {} });
    }
    if (gsap && gsap.globalTimeline) {
      gsap.globalTimeline.clear();
    }
  }

  // Promise-based helpers for proper awaiting
  function tweenTo(target, vars) {
    return new Promise(function (resolve) { gsap.to(target, Object.assign({}, vars, { onComplete: resolve })); });
  }
  function tweenFrom(target, vars) {
    return new Promise(function (resolve) { gsap.from(target, Object.assign({}, vars, { onComplete: resolve })); });
  }

  // Enable prefetch plugin if available
  try { if (typeof barbaPrefetch !== 'undefined') { barba.use(barbaPrefetch); } } catch(_) {}

  barba.init({
    transitions: [{
      name: 'global-slide-left-out-right-in',
      sync: true,
      async leave(data) {
        // Cleanup
        if (window.Savoro && typeof window.Savoro.destroy === 'function') {
          try { window.Savoro.destroy(data.current.namespace); } catch (_) {}
        }
        killGsap();
        // Generic: slide left + fade out
        await tweenTo(data.current.container, { opacity: 0, x: -200, duration: 0.5, ease: 'power2.inOut' });
      },
      async enter(data) {
        updateActiveNav(data.next.namespace);
        window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
        // Generic: slide in from right + fade in
        await tweenFrom(data.next.container, { opacity: 0, x: 200, duration: 0.5, ease: 'power2.inOut' });

        // Optional stagger on common card elements inside new container
        try {
          const staggerEls = data.next.container.querySelectorAll('.recipe-card, .price-card, .feature-card, .step-card, .team-card, .testimonial');
          if (staggerEls && staggerEls.length) {
            await new Promise(function (resolve) {
              gsap.from(staggerEls, { opacity: 0, y: 24, duration: 0.35, stagger: 0.06, ease: 'power2.out', onComplete: resolve });
            });
          }
        } catch (_) {}
        // Re-init animations and page logic
        if (window.Savoro && typeof window.Savoro.init === 'function') {
          try { window.Savoro.init(data.next.namespace, data.next.container); } catch (_) {}
        }
      }
    }]
  });

  // Minimal Savoro page lifecycle bridge; adapt to existing code
  window.Savoro = window.Savoro || {};
  window.Savoro.init = function (namespace) {
    // Re-run GSAP animations defined globally
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      // Re-register plugin to be safe
      try { gsap.registerPlugin(ScrollTrigger); } catch (_) {}
    }
    // Re-run lightweight initializers that rely on DOM presence
    try { /* main.js IIFEs are resilient; nothing specific here */ } catch (_) {}
  };
  window.Savoro.destroy = function () {
    // Nothing specific; main.js attaches listeners per page and modals; GSAP cleaned in killGsap
  };
})();


