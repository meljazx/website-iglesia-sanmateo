/* ==========================================================================
   modal.js — Ventanitas (modales) y avisos (toast). Se usa en Inicio y Blog.

   Uso:
     Modal.open({ node: unNodo, className: 'modal--accent', label: 'Título' });
     Modal.close();
     Toast.show('Mensaje');
   ========================================================================== */
'use strict';

(function () {
  let overlay, dialog, content, closeBtn;
  let lastFocus = null;
  let onCloseCallback = null;

  const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

  /** Crea un elemento rápido: el('p', 'modal__text', 'Hola') */
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function build() {
    overlay = el('div', 'modal-overlay');
    dialog = el('div', 'modal');
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');

    closeBtn = el('button', 'modal__close', '×');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Cerrar');

    content = el('div', 'modal__content');
    dialog.append(closeBtn, content);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('mousedown', (e) => {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', onKeydown);
  }

  function onKeydown(e) {
    if (!isOpen()) return;
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (e.key === 'Tab') {
      const items = dialog.querySelectorAll(FOCUSABLE);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function isOpen() {
    return !!overlay && overlay.classList.contains('is-open');
  }

  function open(options) {
    const { node, className = '', label = '', onClose = null } = options;
    if (!overlay) build();

    lastFocus = document.activeElement;
    onCloseCallback = onClose;

    content.replaceChildren(node);
    dialog.className = ('modal ' + className).trim();
    dialog.setAttribute('aria-label', label);
    dialog.scrollTop = 0;

    // Evita que la página "salte" al ocultar la barra de scroll
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = scrollbar > 0 ? scrollbar + 'px' : '';
    document.body.classList.add('modal-open');

    // Forzar reflow para que la transición de entrada se ejecute
    void overlay.offsetWidth;
    overlay.classList.add('is-open');
    closeBtn.focus({ preventScroll: true });
  }

  function close() {
    if (!isOpen()) return;
    overlay.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    document.body.style.paddingRight = '';

    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus({ preventScroll: true });
    }
    if (typeof onCloseCallback === 'function') onCloseCallback();
    onCloseCallback = null;
  }

  window.Modal = { open, close, isOpen, el };

  /* ---------- Toast ---------- */
  let toastEl = null;
  let toastTimer = null;

  window.Toast = {
    show(message, duration = 2200) {
      if (!toastEl) {
        toastEl = el('div', 'toast');
        toastEl.setAttribute('role', 'status');
        toastEl.setAttribute('aria-live', 'polite');
        document.body.appendChild(toastEl);
      }
      toastEl.textContent = message;
      void toastEl.offsetWidth;
      toastEl.classList.add('is-visible');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), duration);
    }
  };
})();
