/* ==========================================================================
   blog.js — Lógica del BLOG (solo se carga en blog.html)
   ========================================================================== */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.search-box input');
  const filterBtn   = document.querySelector('.filter-btn');
  const tags        = document.querySelectorAll('.tags-row .tag');
  const posts       = document.querySelectorAll('.blog-card');

  initSearch(searchInput, posts);
  initFilters(filterBtn, tags, posts);

  initPostModals(posts);
  initScrollAnimations();
});

/* ---------- Buscar posts ---------- */
function initSearch(input, posts) {
  if (!input) return;

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    // TODO: recorrer `posts` y ocultar los que no contengan `query`
    //       en .card-title o .card-excerpt (ej. post.hidden = true/false)
  });
}

/* ---------- Filtros por etiqueta / fecha ---------- */
function initFilters(filterBtn, tags, posts) {
  // TODO: al hacer click en cada .tag, activar/desactivar el filtro
  // TODO: al hacer click en .filter-btn, abrir el panel de filtros (mes / año / etiqueta)
  // TODO: actualizar el texto de .pagination-info con el filtro activo
}


/* ==========================================================================
   Ventanitas de publicación + botón compartir
   ========================================================================== */
function postUrl(id) {
  return location.origin + location.pathname + '#' + id;
}

function copyLink(url) {
  const done = () => Toast.show('Enlace copiado');
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(url).then(done, () => Toast.show('No se pudo copiar el enlace'));
  } else {
    // Respaldo para abrir el archivo localmente (file://)
    const tmp = document.createElement('textarea');
    tmp.value = url;
    tmp.style.position = 'fixed';
    tmp.style.opacity = '0';
    document.body.appendChild(tmp);
    tmp.select();
    try { document.execCommand('copy'); done(); } catch (e) { Toast.show('No se pudo copiar el enlace'); }
    tmp.remove();
  }
}

function openPostModal(card) {
  const { el } = Modal;
  const id = card.id;

  const img = card.querySelector('.card-image img');
  const title = card.querySelector('.card-title').textContent.trim();
  const excerpt = card.querySelector('.card-excerpt').textContent.trim();
  const time = card.querySelector('.time').textContent.trim();
  const color = card.querySelector('.category-color').style.backgroundColor;

  const box = el('div');
  const cover = el('img', 'modal__image');
  cover.src = img.src;
  cover.alt = img.alt;

  const body = el('div', 'modal__body');
  body.appendChild(el('h3', 'modal__title serif', title));

  const meta = el('div', 'modal__meta');
  const chip = el('span', 'modal__chip');
  chip.style.backgroundColor = color;
  meta.append(chip, el('span', '', time));
  body.appendChild(meta);

  body.appendChild(el('p', 'modal__lead', excerpt));
  body.appendChild(el('p', 'modal__text',
    card.dataset.body || 'Aquí irá el contenido completo de la publicación.'));

  const actions = el('div', 'modal__actions');
  const shareBtn = el('button', 'btn btn-cyan', 'Copiar enlace');
  shareBtn.type = 'button';
  shareBtn.addEventListener('click', () => copyLink(postUrl(id)));
  actions.appendChild(shareBtn);
  body.appendChild(actions);

  box.append(cover, body);

  history.replaceState(null, '', '#' + id);
  Modal.open({
    node: box,
    label: title,
    onClose: () => history.replaceState(null, '', location.pathname + location.search)
  });
}

function initPostModals(posts) {
  posts.forEach((card, i) => {
    card.id = card.id || 'post-' + (i + 1);
    const title = card.querySelector('.card-title').textContent.trim();

    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', 'Abrir publicación: ' + title);

    card.addEventListener('click', () => openPostModal(card));
    card.addEventListener('keydown', (e) => {
      if (e.target !== card) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPostModal(card);
      }
    });

    // El icono de compartir copia el enlace sin abrir la ventana
    const share = card.querySelector('.share');
    if (share) {
      share.setAttribute('role', 'button');
      share.setAttribute('aria-label', 'Copiar enlace de la publicación');
      share.addEventListener('click', (e) => {
        e.stopPropagation();
        copyLink(postUrl(card.id));
      });
    }
  });

  // Enlace directo: blog.html#post-2 abre esa publicación
  const target = location.hash && document.getElementById(location.hash.slice(1));
  if (target && target.classList.contains('blog-card')) setTimeout(() => openPostModal(target), 400);
}

/* ==========================================================================
   Animaciones al hacer scroll
   ========================================================================== */
function initScrollAnimations() {
  Reveal.add('.search-section .search-bar');
  Reveal.add('.tags-row .tag', { stagger: 0.12, delay: 0.15 });
  // Escalonado por fila: 2 columnas en escritorio
  Reveal.add('.blog-card', { stagger: 0.15, columns: 2 });
}
