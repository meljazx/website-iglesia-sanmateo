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
