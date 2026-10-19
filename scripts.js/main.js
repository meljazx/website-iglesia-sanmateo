/* ==========================================================================
   main.js — Lógica GLOBAL (se carga en Inicio, Blog y Biblioteca)
   ========================================================================== */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initDarkMode();
});

/* ---------- Menú desplegable (móvil) ---------- */
function initMobileMenu() {
  // Elementos existentes: .site-header (navbar) y .site-header__right (enlaces)
  const nav = document.querySelector('.site-header__right');
  if (!nav) return;

  // TODO: crear un botón "hamburguesa" en el header y alternar una clase
  //       (ej. nav.classList.toggle('is-open')) para mostrar/ocultar los enlaces.
  //       Recuerda agregar los estilos de .is-open en css/components/header.css
}

/* ---------- Modo oscuro ---------- */
function initDarkMode() {
  // TODO: botón para alternar document.body.classList.toggle('dark-mode')
  // TODO: guardar la preferencia con localStorage.setItem('tema', 'oscuro' | 'claro')
  // TODO: definir las variables del modo oscuro en css/style.css:
  //       body.dark-mode { --bg-light: ...; --white: ...; --text-dark: ...; }
}
