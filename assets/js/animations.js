/* ============================================================
   ANIMATIONS.JS — GSAP + ScrollTrigger
   All scroll-driven and entrance animations
   ============================================================ */

'use strict';

(function () {

  // Guard: GSAP must be loaded
  if (typeof gsap === 'undefined') {
    console.warn('[Aline] GSAP not loaded — animations disabled.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ══════════════════════════════════
     HERO ENTRANCE
     ══════════════════════════════════ */
  function initHeroAnimations() {
    const tl = gsap.timeline({ delay: 0.2 });

    // Eyebrow line
    tl.from('.hero__eyebrow', {
      opacity: 0,
      y: 20,
      duration: 0.7,
      ease: 'power3.out',
    });

    // Sans title words
    tl.from('.hero__title-sans .word', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.06,
      ease: 'power3.out',
    }, '-=0.3');

    // Serif title words (gold, massive)
    tl.from('.hero__title-serif .word', {
      y: 80,
      opacity: 0,
      duration: 1,
      stagger: 0.08,
      ease: 'power3.out',
    }, '-=0.5');

    // Subtitle + CTA
    tl.from(['.hero__subtitle', '.hero__cta-group', '.hero__scroll-hint'], {
      opacity: 0,
      y: 24,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out',
    }, '-=0.4');
  }

  /* ══════════════════════════════════
     HERO PARALLAX
     ══════════════════════════════════ */
  function initHeroParallax() {
    const bg = document.querySelector('.hero__bg');
    if (!bg) return;

    gsap.to(bg, {
      yPercent: 22,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  /* ══════════════════════════════════
     FEATURES SECTION REVEAL
     ══════════════════════════════════ */
  function initFeaturesReveal() {
    gsap.from('.features__header .section-label', {
      scrollTrigger: {
        trigger: '.features',
        start: 'top 80%',
      },
      opacity: 0,
      x: -20,
      duration: 0.6,
      ease: 'power2.out',
    });

    gsap.from('.features__header h2', {
      scrollTrigger: {
        trigger: '.features',
        start: 'top 78%',
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.1,
    });

    gsap.from('.feature-card', {
      scrollTrigger: {
        trigger: '.features__grid',
        start: 'top 82%',
      },
      opacity: 0,
      y: 50,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power3.out',
    });
  }

  /* ══════════════════════════════════
     MANIFESTO — Word-by-Word Reveal
     ══════════════════════════════════ */
  function initManifestoReveal() {
    // Split manifesto text into word spans
    const textCommon = document.querySelector('.manifesto__text-common');
    const textBold   = document.querySelector('.manifesto__text-bold');

    function wrapWords(el) {
      if (!el) return;
      const html = el.innerHTML;
      // Replace text nodes with word spans (preserve em tags)
      el.innerHTML = html.replace(/(<[^>]+>)|([^\s<]+)/g, (match, tag, word) => {
        if (tag) return tag;
        return `<span class="manifesto-word">${word}</span>`;
      });
    }

    wrapWords(textCommon);
    wrapWords(textBold);

    // Section label
    gsap.from('.manifesto .section-label', {
      scrollTrigger: { trigger: '.manifesto', start: 'top 78%' },
      opacity: 0, x: -20, duration: 0.6, ease: 'power2.out',
    });

    // Words reveal
    ScrollTrigger.create({
      trigger: '.manifesto__content',
      start: 'top 72%',
      onEnter: () => {
        gsap.from('.manifesto-word', {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.04,
          ease: 'power3.out',
        });
      },
      once: true,
    });

    // Chef bio panel
    gsap.from('.manifesto__chef', {
      scrollTrigger: {
        trigger: '.manifesto__chef',
        start: 'top 80%',
      },
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: 'power2.out',
    });

    // Manifesto texture parallax
    gsap.to('.manifesto__bg-texture', {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.manifesto',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  /* ══════════════════════════════════
     PROTOCOL STACK — Sticky Scroll
     ══════════════════════════════════ */
  function initProtocolStack() {
    const wrapper = document.querySelector('.protocol__wrapper');
    const cards   = document.querySelectorAll('.protocol-card');

    if (!wrapper || cards.length === 0) return;

    // On mobile, skip sticky animation
    if (window.innerWidth <= 767) return;

    const cardCount = cards.length;

    cards.forEach((card, i) => {
      if (i === cardCount - 1) return; // Last card doesn't need to blur

      ScrollTrigger.create({
        trigger: wrapper,
        start: () => `${(i / cardCount) * 100}% top`,
        end:   () => `${((i + 1) / cardCount) * 100}% top`,
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.set(card, {
            scale:   1 - progress * 0.08,
            filter:  `blur(${progress * 12}px)`,
            opacity: 1 - progress * 0.5,
          });
        },
      });
    });

    // Cards enter from bottom
    gsap.from(cards, {
      scrollTrigger: {
        trigger: wrapper,
        start: 'top 85%',
      },
      y: 60,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power3.out',
    });
  }

  /* ══════════════════════════════════
     FAQ REVEAL
     ══════════════════════════════════ */
  function initFAQReveal() {
    gsap.from('.faq__item', {
      scrollTrigger: {
        trigger: '.faq',
        start: 'top 80%',
      },
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
    });
  }

  /* ══════════════════════════════════
     FORM SECTION REVEAL
     ══════════════════════════════════ */
  function initFormReveal() {
    gsap.from('.form-section__copy', {
      scrollTrigger: {
        trigger: '.form-section',
        start: 'top 80%',
      },
      opacity: 0,
      x: -40,
      duration: 0.9,
      ease: 'power3.out',
    });

    gsap.from('.form__grid', {
      scrollTrigger: {
        trigger: '.form-section',
        start: 'top 80%',
      },
      opacity: 0,
      x: 40,
      duration: 0.9,
      ease: 'power3.out',
      delay: 0.1,
    });
  }

  /* ══════════════════════════════════
     PROTOCOL HEADER REVEAL
     ══════════════════════════════════ */
  function initProtocolHeaderReveal() {
    gsap.from('.protocol__header .section-label', {
      scrollTrigger: { trigger: '.protocol__header', start: 'top 85%' },
      opacity: 0, x: -20, duration: 0.6, ease: 'power2.out',
    });

    gsap.from('.protocol__header h2', {
      scrollTrigger: { trigger: '.protocol__header', start: 'top 83%' },
      opacity: 0, y: 30, duration: 0.8, ease: 'power3.out', delay: 0.1,
    });
  }

  /* ══════════════════════════════════
     INIT ALL
     ══════════════════════════════════ */
  function init() {
    initHeroAnimations();
    initHeroParallax();
    initFeaturesReveal();
    initManifestoReveal();
    initProtocolStack();
    initProtocolHeaderReveal();
    initFAQReveal();
    initFormReveal();
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
