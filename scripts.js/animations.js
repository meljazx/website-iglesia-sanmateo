/* ==========================================================================
   animations.js — Aparecer al hacer scroll (Inicio y Blog)

   Uso:
     Reveal.add('.info-card', { stagger: 0.15 });
     Reveal.add('.virgin-text-left', { variant: 'left' });   // left | right | zoom
   ========================================================================== */
'use strict';

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supported = 'IntersectionObserver' in window && !reduceMotion;

  const observer = supported
    ? new IntersectionObserver(onIntersect, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
    : null;

  function onIntersect(entries) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = entry.target;
      target.classList.add('is-visible');
      observer.unobserve(target);

      // Al terminar, quitamos las clases para que el hover use sus propias transiciones
      const delay = parseFloat(target.style.getPropertyValue('--reveal-delay')) || 0;
      setTimeout(() => {
        target.classList.remove('reveal', 'reveal--left', 'reveal--right', 'reveal--zoom', 'is-visible');
        target.style.removeProperty('--reveal-delay');
      }, (delay + 1) * 1000 + 150);
    });
  }

  function add(selector, options = {}) {
    if (!supported) return;
    const { variant = '', stagger = 0, delay = 0, columns = 0 } = options;
    const nodes = typeof selector === 'string' ? document.querySelectorAll(selector) : selector;

    Array.from(nodes).forEach((node, i) => {
      node.classList.add('reveal');
      if (variant) node.classList.add('reveal--' + variant);
      // `columns` reinicia el escalonado por fila (útil en grillas)
      const position = columns ? i % columns : i;
      node.style.setProperty('--reveal-delay', (delay + position * stagger) + 's');
      observer.observe(node);
    });
  }

  window.Reveal = { add };
})();
