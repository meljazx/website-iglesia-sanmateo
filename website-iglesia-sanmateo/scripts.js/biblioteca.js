/* ==========================================================================
   biblioteca.js — Lógica de la BIBLIOTECA (solo se carga en biblioteca.html)
   ========================================================================== */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initLibrarySearch();
  initSidebar();
  initChapterNav();
});

/* ---------- Buscador de documentos ---------- */
function initLibrarySearch() {
  const input = document.querySelector('.search-box input');
  if (!input) return;

  // TODO: filtrar categorías / índice documental según el texto escrito
}

/* ---------- Barra lateral (categorías e índice) ---------- */
function initSidebar() {
  // Elementos existentes: .category-list, .index-list, .other-pubs-list
  // TODO: desplegar/contraer las subcategorías (.sub-cat-list)
  // TODO: marcar el ítem activo del índice documental
}

/* ---------- Navegación entre capítulos ---------- */
function initChapterNav() {
  // Elementos existentes: .nav-card, .btn-download, .btn-next-chapter
  // TODO: cargar el capítulo anterior / siguiente
  // TODO: descargar el PDF desde .btn-download
}

/* ---------- Validación de formulario (si agregas uno de contacto) ---------- */
function validateForm(form) {
  // TODO: validar campos requeridos y formato de correo antes de enviar
  return true;
}
