# Sitio web — Iglesia San Mateo

Orden de navegación: **Inicio → Blog → Biblioteca**

```
website-iglesia-sanmateo/
├── index.html            ← Inicio
├── blog.html             ← Blog
├── biblioteca.html       ← Biblioteca
├── css/
│   ├── style.css         ← Global: variables, tipografía, layout (importa /components)
│   ├── home.css          ← Solo Inicio
│   ├── blog.css          ← Solo Blog
│   ├── biblioteca.css    ← Solo Biblioteca
│   └── components/       ← Piezas reutilizables
│       ├── header.css        (navbar)
│       ├── footer.css        (pre-footer + footer)
│       ├── buttons.css       (.btn .btn-cyan .btn-gold)
│       ├── page-banner.css   (banner de título: Blog y Biblioteca)
│       ├── search-bar.css    (buscador + filtro: Blog y Biblioteca)
│       ├── modal.css         (ventanitas y toast)
│       └── animations.css    (animaciones de Inicio y Blog)
└── assets/images/
X
```

Los scripts son esqueletos con `TODO` listos para programar; ya están enlazados con `defer` en cada HTML.

## Dónde editar el contenido de las ventanitas
- **Eventos / grupos (Inicio):** atributo `data-desc="..."` de cada `.event-card` y `.group-card`.
- **Publicaciones (Blog):** atributo `data-body="..."` de cada `.blog-card`.
- **¿Quiénes somos?:** `<template id="modal-about">` al final de `index.html`.
- **Imágenes del slider del hero:** arreglo `HERO_SLIDES` al inicio de `scripts.js/home.js`.

## ACTUALIZACION 12/10/26
  las secciones de home y blog funcionan ahora con animaciones pero los tags de los blogs no, tampoco tiene informacion relevante. la biblioteca no funciona en ningun aspecto, tampoco tiene animaciones ni ventanas nuevas. 
