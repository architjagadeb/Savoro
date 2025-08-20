/* global gsap, ScrollTrigger */
(function () {
  if (typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero intro
  gsap.from('.hero-title', { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' });
  gsap.from('.hero-subtext', { y: 16, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.1 });
  gsap.from('.hero-ctas .btn', { y: 12, opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.2, stagger: 0.08 });
  gsap.from('.hero-illustration', { x: 16, opacity: 0, duration: 0.7, ease: 'power2.out' });
  // Meal planner page header
  gsap.from('.page-hero .hero-title', { y: 14, opacity: 0, duration: 0.55, ease: 'power2.out' });
  gsap.from('.page-hero .hero-subtext', { y: 12, opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.05 });
  gsap.from('.page-hero .hero-illustration', { x: 12, opacity: 0, duration: 0.55, ease: 'power2.out' });

  // About page specific: stagger in mission cards, steps, team, testimonials
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.from('.about-grid .about-card', { scrollTrigger: { trigger: '.about-mission', start: 'top 75%' }, y: 16, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' });
    gsap.from('.about-steps .step-card', { scrollTrigger: { trigger: '.about-steps', start: 'top 75%' }, x: -12, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' });
    gsap.from('.team-grid .team-card', { scrollTrigger: { trigger: '.about-team', start: 'top 75%' }, y: 16, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' });
    gsap.from('.testimonial-grid .testimonial', { scrollTrigger: { trigger: '.about-testimonials', start: 'top 75%' }, scale: 0.98, opacity: 0, duration: 0.45, stagger: 0.08, ease: 'power2.out' });
    gsap.from('.cta-banner', { scrollTrigger: { trigger: '.about-cta', start: 'top 85%' }, y: 10, opacity: 0, duration: 0.45, ease: 'power2.out' });
  }

  // Recipes page filter bar (on visibility)
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.from('.filters-bar', { scrollTrigger: { trigger: '.filters', start: 'top 85%' }, y: 10, opacity: 0, duration: 0.45, ease: 'power2.out' });
  }

  // Favorites page hero and empty-state subtle float handled in main.js (float loop). Add hero animation here for consistency
  gsap.from('.page-hero .hero-title', { y: 14, opacity: 0, duration: 0.55, ease: 'power2.out' });
  gsap.from('.page-hero .hero-subtext', { y: 12, opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.05 });
  gsap.from('.page-hero .hero-illustration', { x: 12, opacity: 0, duration: 0.55, ease: 'power2.out' });

  // Pricing: animate cards once on first reveal; avoids double animation
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.from('.price-card', {
      scrollTrigger: {
        trigger: '.pricing',
        start: 'top 75%',
        toggleActions: 'play none none none',
        once: true
      },
      opacity: 0,
      y: 18,
      duration: 0.55,
      stagger: 0.12,
      ease: 'power2.out'
    });
  }

  // Features stagger
  gsap.from('.feature-card', {
    scrollTrigger: { trigger: '.features', start: 'top 75%' },
    y: 20,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out'
  });

  // How it works slide-in
  gsap.from('.step-card', {
    scrollTrigger: { trigger: '.how-it-works', start: 'top 75%' },
    x: -16,
    opacity: 0,
    duration: 0.6,
    stagger: 0.12,
    ease: 'power2.out'
  });

  // Testimonials
  gsap.from('.testimonial', {
    scrollTrigger: { trigger: '.testimonials', start: 'top 80%' },
    y: 18,
    opacity: 0,
    duration: 0.6,
    stagger: 0.08,
    ease: 'power2.out'
  });

  // Newsletter
  gsap.from('.newsletter-inner', {
    scrollTrigger: { trigger: '.newsletter', start: 'top 80%' },
    scale: 0.98,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out'
  });
})();


