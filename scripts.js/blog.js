'use strict';

document.addEventListener('DOMContentLoaded', loadPosts);

let blogItems = [];
let activeCategory = '';

async function loadPosts() {
  const grid = document.querySelector('.blog-grid');
  try {
    const response = await fetch('api/content.php?type=blog');
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'No fue posible cargar el blog.');
    blogItems = result.items;
    renderPosts();
    renderCategories();
    initScrollAnimations();

    const target = location.hash && document.getElementById(location.hash.slice(1));
    if (target && target.classList.contains('blog-card')) setTimeout(() => openPostModal(target), 250);
  } catch (error) {
    grid.replaceChildren(messageNode(error.message));
    document.querySelector('.pagination-info').textContent = 'No se pudieron cargar las publicaciones.';
  }
}

function messageNode(message) {
  const node = document.createElement('p');
  node.className = 'content-message';
  node.textContent = message;
  return node;
}

function renderPosts() {
  const grid = document.querySelector('.blog-grid');
  const query = document.querySelector('.search-box input').value.trim().toLocaleLowerCase();
  const visible = blogItems.filter((post) => {
    const text = `${post.title} ${post.excerpt} ${post.content} ${post.category}`.toLocaleLowerCase();
    return text.includes(query) && (!activeCategory || post.category === activeCategory);
  });

  grid.replaceChildren();
  if (!visible.length) {
    grid.appendChild(messageNode(blogItems.length ? 'No hay publicaciones que coincidan con la búsqueda.' : 'Aún no hay publicaciones disponibles.'));
  }

  visible.forEach((post, index) => {
    const card = document.createElement('article');
    card.className = 'blog-card';
    card.id = `post-${post.id}`;
    card.dataset.body = post.content;
    card.dataset.category = post.category;
    card.setAttribute('role', 'button');
    card.tabIndex = 0;
    card.setAttribute('aria-label', `Abrir publicación: ${post.title}`);

    const media = document.createElement('div');
    media.className = 'card-image';
    const image = document.createElement('img');
    image.src = post.image_url || `assets/images/blog/post-${(index % 4) + 1}.png`;
    image.alt = post.title;
    image.loading = 'lazy';
    media.appendChild(image);

    const content = document.createElement('div');
    content.className = 'card-content';
    const title = document.createElement('h2');
    title.className = 'serif card-title';
    title.textContent = post.title;
    const excerpt = document.createElement('p');
    excerpt.className = 'card-excerpt';
    excerpt.textContent = post.excerpt || post.category;
    const meta = document.createElement('div');
    meta.className = 'card-meta';
    const time = document.createElement('span');
    time.className = 'time';
    time.textContent = formatDate(post.published_at);
    const actions = document.createElement('div');
    actions.className = 'card-actions';
    const share = document.createElement('button');
    share.className = 'share';
    share.type = 'button';
    share.textContent = '↗';
    share.setAttribute('aria-label', 'Copiar enlace de la publicación');
    share.addEventListener('click', (event) => {
      event.stopPropagation();
      copyLink(postUrl(card.id));
    });
    const color = document.createElement('span');
    color.className = 'category-color';
    color.style.backgroundColor = ['var(--accent-yellow)', 'var(--accent-teal)', 'var(--accent-gold)'][index % 3];
    color.setAttribute('aria-label', post.category);
    actions.append(share, color);
    meta.append(time, actions);
    content.append(title, excerpt, meta);
    card.append(media, content);
    card.addEventListener('click', () => openPostModal(card));
    card.addEventListener('keydown', (event) => {
      if (event.target === card && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        openPostModal(card);
      }
    });
    grid.appendChild(card);
  });

  document.querySelector('.pagination-info').textContent = `${visible.length} de ${blogItems.length} publicaciones`;
}

function renderCategories() {
  const row = document.querySelector('.tags-row');
  const categories = [...new Set(blogItems.map((post) => post.category))];
  row.replaceChildren();
  [['', 'Todas'], ...categories.map((category) => [category, category])].forEach(([value, label], index) => {
    const button = document.createElement('button');
    button.className = `tag ${['tag-yellow', 'tag-teal', 'tag-gold'][index % 3]}`;
    button.type = 'button';
    button.textContent = label;
    button.dataset.category = value;
    button.classList.toggle('is-active', value === activeCategory);
    button.addEventListener('click', () => {
      activeCategory = value;
      renderPosts();
      renderCategories();
    });
    row.appendChild(button);
  });
}

function formatDate(value) {
  if (!value) return 'Fecha por anunciar';
  const date = new Date(value.replace(' ', 'T'));
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('es', { dateStyle: 'long' }).format(date);
}

function postUrl(id) {
  return `${location.origin}${location.pathname}#${id}`;
}

function copyLink(url) {
  const done = () => Toast.show('Enlace copiado');
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(url).then(done, () => Toast.show('No se pudo copiar el enlace'));
    return;
  }

  const temporary = document.createElement('textarea');
  temporary.value = url;
  temporary.style.position = 'fixed';
  temporary.style.opacity = '0';
  document.body.appendChild(temporary);
  temporary.select();
  try {
    if (!document.execCommand('copy')) throw new Error('No se pudo copiar');
    done();
  } catch {
    Toast.show('No se pudo copiar el enlace');
  } finally {
    temporary.remove();
  }
}

function openPostModal(card) {
  const image = card.querySelector('.card-image img');
  const title = card.querySelector('.card-title').textContent.trim();
  const excerpt = card.querySelector('.card-excerpt').textContent.trim();
  const body = Modal.el('div', 'modal__body');
  const imageNode = Modal.el('img', 'modal__image');
  imageNode.src = image.src;
  imageNode.alt = image.alt;
  body.append(Modal.el('h3', 'modal__title serif', title), Modal.el('p', 'modal__lead', excerpt));
  body.appendChild(Modal.el('p', 'modal__text', card.dataset.body));
  const share = Modal.el('button', 'btn btn-cyan', 'Copiar enlace');
  share.type = 'button';
  share.addEventListener('click', () => copyLink(postUrl(card.id)));
  const actions = Modal.el('div', 'modal__actions');
  actions.appendChild(share);
  body.appendChild(actions);
  history.replaceState(null, '', `#${card.id}`);
  const wrapper = Modal.el('div');
  wrapper.append(imageNode, body);
  Modal.open({
    node: wrapper,
    label: title,
    onClose: () => history.replaceState(null, '', location.pathname + location.search),
  });
}

function initScrollAnimations() {
  if (window.Reveal) Reveal.add('.blog-card', { stagger: 0.15, columns: 2 });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.search-box input').addEventListener('input', renderPosts);
});
