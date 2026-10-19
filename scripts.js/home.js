/* ==========================================================================
   home.js — Lógica del INICIO (solo se carga en index.html)
   Hero slider · Carrusel "lo más destacado" · Ventanitas · Animaciones
   ========================================================================== */
'use strict';

/* ---------- Imágenes del slider del hero (edítalas aquí) ---------- */
const HERO_SLIDES = [
  // La primera es la imagen que ya está en el HTML.
  { src: 'assets/images/home/hero.jpeg', alt: 'Iglesia San Mateo' },
  { src: 'assets/images/home/evento-plaza.png', alt: 'Evento en la plaza' },
  { src: 'assets/images/home/evento-iglesia.png', alt: 'Evento en la iglesia' }
  // Puedes agregar texto propio por slide: { src: '...', alt: '...', title: '...', subtitle: '...' }
];
const HERO_AUTOPLAY_MS = 6000;

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initHighlightsCarousel();
  initEventModals();
  initAboutModal();
  initGroupModals();
  initScrollAnimations();
});

/* ==========================================================================
   Hero slider
   ========================================================================== */
function initHeroSlider() {
  const hero = document.querySelector('.hero-section');
  const bg = document.querySelector('.hero-bg');
  const content = document.querySelector('.hero-content');
  const prevBtn = document.querySelector('.prev-arrow');
  const nextBtn = document.querySelector('.next-arrow');
  if (!hero || !bg || HERO_SLIDES.length === 0) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const title = document.querySelector('.hero-title');
  const subtitle = document.querySelector('.hero-subtitle');

  // Primera imagen = la del HTML; las demás se crean aquí
  const images = [bg.querySelector('img')];
  HERO_SLIDES.slice(1).forEach((slide) => {
    const img = document.createElement('img');
    img.src = slide.src;
    img.alt = slide.alt || '';
    img.loading = 'lazy';
    bg.appendChild(img);
    images.push(img);
  });

  // Puntos indicadores
  const dots = document.createElement('div');
  dots.className = 'hero-dots';
  const dotButtons = HERO_SLIDES.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'hero-dot';
    dot.setAttribute('aria-label', 'Ir a la imagen ' + (i + 1));
    dot.addEventListener('click', () => { goTo(i); restart(); });
    dots.appendChild(dot);
    return dot;
  });
  hero.appendChild(dots);

  let current = 0;
  let timer = null;

  function goTo(index) {
    const next = (index + HERO_SLIDES.length) % HERO_SLIDES.length;
    if (next === current && images[next].classList.contains('is-active')) return;

    images[current].classList.remove('is-active');
    dotButtons[current].classList.remove('is-active');
    current = next;

    // Reiniciar la animación de zoom de la imagen activa
    images[current].classList.remove('is-active');
    void images[current].offsetWidth;
    images[current].classList.add('is-active');
    dotButtons[current].classList.add('is-active');

    const slide = HERO_SLIDES[current];
    if (content && (slide.title !== undefined || slide.subtitle !== undefined)) {
      content.classList.add('is-changing');
      setTimeout(() => {
        if (title && slide.title !== undefined) title.textContent = slide.title;
        if (subtitle && slide.subtitle !== undefined) subtitle.textContent = slide.subtitle;
        content.classList.remove('is-changing');
      }, 350);
    }
  }

  function start() {
    if (reduceMotion || HERO_SLIDES.length < 2) return;
    stop();
    timer = setInterval(() => goTo(current + 1), HERO_AUTOPLAY_MS);
  }
  function stop() { clearInterval(timer); timer = null; }
  function restart() { stop(); start(); }

  prevBtn && prevBtn.addEventListener('click', () => { goTo(current - 1); restart(); });
  nextBtn && nextBtn.addEventListener('click', () => { goTo(current + 1); restart(); });
  prevBtn && prevBtn.setAttribute('aria-label', 'Imagen anterior');
  nextBtn && nextBtn.setAttribute('aria-label', 'Imagen siguiente');

  // Pausa al pasar el mouse o al cambiar de pestaña
  hero.addEventListener('mouseenter', stop);
  hero.addEventListener('mouseleave', start);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  // Deslizar con el dedo
  let touchX = null;
  hero.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) { goTo(current + (dx < 0 ? 1 : -1)); restart(); }
    touchX = null;
  });

  images[0].classList.add('is-active');
  dotButtons[0].classList.add('is-active');
  start();
}

/* ==========================================================================
   Carrusel "lo más destacado"
   ========================================================================== */
function initHighlightsCarousel() {
  const viewport = document.querySelector('.events-grid');
  const track = document.querySelector('.events-track');
  const arrows = document.querySelectorAll('.carousel-arrow');
  if (!viewport || !track || arrows.length < 2) return;

  const cards = track.querySelectorAll('.event-card');
  const [prevBtn, nextBtn] = arrows;
  prevBtn.setAttribute('aria-label', 'Eventos anteriores');
  nextBtn.setAttribute('aria-label', 'Eventos siguientes');

  let index = 0;

  const gap = () => parseFloat(getComputedStyle(track).columnGap) || 0;
  const step = () => cards[0].offsetWidth + gap();
  const visible = () => Math.max(1, Math.floor((viewport.clientWidth + gap()) / step()));
  const maxIndex = () => Math.max(0, cards.length - visible());

  function go(i) {
    if (i > maxIndex()) i = 0;            // al llegar al final vuelve al inicio
    if (i < 0) i = maxIndex();            // y viceversa
    index = i;
    track.style.transform = 'translateX(' + (-index * step()) + 'px)';
  }

  prevBtn.addEventListener('click', () => go(index - 1));
  nextBtn.addEventListener('click', () => go(index + 1));
  window.addEventListener('resize', () => go(Math.min(index, maxIndex())));

  // Deslizar con el dedo
  let touchX = null;
  viewport.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
    touchX = null;
  });
}

/* ==========================================================================
   Ventanitas
   ========================================================================== */
function makeClickable(node, handler, label) {
  node.setAttribute('role', 'button');
  node.setAttribute('tabindex', '0');
  if (label) node.setAttribute('aria-label', label);
  node.addEventListener('click', handler);
  node.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handler();
    }
  });
}

/** Ventana con imagen + título + descripción (eventos y grupos) */
function openInfoModal({ src, alt, title, time, tagColor, text }) {
  const { el } = Modal;
  const box = el('div');

  const img = el('img', 'modal__image');
  img.src = src;
  img.alt = alt || '';

  const body = el('div', 'modal__body');
  body.appendChild(el('h3', 'modal__title serif', title));

  if (time || tagColor) {
    const meta = el('div', 'modal__meta');
    if (tagColor) {
      const chip = el('span', 'modal__chip');
      chip.style.backgroundColor = tagColor;
      meta.appendChild(chip);
    }
    if (time) meta.appendChild(el('span', '', time));
    body.appendChild(meta);
  }

  body.appendChild(el('p', 'modal__text', text));
  box.append(img, body);
  Modal.open({ node: box, label: title });
}

function initEventModals() {
  document.querySelectorAll('.event-card').forEach((card) => {
    const img = card.querySelector('.event-img');
    const title = card.querySelector('.event-title').textContent.trim();
    const time = card.querySelector('.event-time').textContent.trim();
    const tag = card.querySelector('.tag');

    makeClickable(card, () => openInfoModal({
      src: img.src,
      alt: img.alt,
      title,
      time,
      tagColor: tag ? getComputedStyle(tag).backgroundColor : null,
      text: card.dataset.desc || 'Aquí irá la información completa del evento: fecha, lugar y detalles.'
    }), 'Ver detalle: ' + title);
  });
}

function initGroupModals() {
  document.querySelectorAll('.group-card').forEach((card) => {
    const img = card.querySelector('.group-img');
    const title = card.querySelector('.group-name').textContent.trim();

    makeClickable(card, () => openInfoModal({
      src: img.src,
      alt: img.alt,
      title,
      text: card.dataset.desc || 'Aquí irá la descripción del grupo o sociedad: quiénes son, cuándo se reúnen y cómo unirse.'
    }), 'Ver detalle: ' + title);
  });
}

function initAboutModal() {
  const trigger = document.querySelector('[data-modal-target="modal-about"]');
  const template = document.getElementById('modal-about');
  if (!trigger || !template) return;

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    Modal.open({
      node: template.content.cloneNode(true),
      className: 'modal--accent',
      label: '¿Quiénes somos?'
    });
  });
}

/* ==========================================================================
   Animaciones al hacer scroll
   ========================================================================== */
function initScrollAnimations() {
  Reveal.add('.section-header');
  Reveal.add('.carousel-container', { delay: 0.1 });
  Reveal.add('.about-content');
  Reveal.add('.info-card', { stagger: 0.18 });
  Reveal.add('.curved-texts', { variant: 'zoom' });
  Reveal.add('.virgin-text-left', { variant: 'left' });
  Reveal.add('.virgin-image-wrapper', { variant: 'zoom', delay: 0.1 });
  Reveal.add('.virgin-text-right', { variant: 'right' });
  Reveal.add('.virgin-action');
  Reveal.add('.groups-header');
  Reveal.add('.group-card', { stagger: 0.2 });
  Reveal.add('.contact-content');
  Reveal.add('.footer-col', { stagger: 0.15 });
}
