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
│       └── search-bar.css    (buscador + filtro: Blog y Biblioteca)
└── assets/images/
X
```

Los scripts son esqueletos con `TODO` listos para programar; ya están enlazados con `defer` en cada HTML.
