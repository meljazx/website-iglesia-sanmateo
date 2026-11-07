'use strict';

document.addEventListener('DOMContentLoaded', loadLibrary);

let libraryItems = [];
let activeLibraryCategory = '';

async function loadLibrary() {
  try {
    const response = await fetch('api/content.php?type=biblioteca');
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'No fue posible cargar la biblioteca.');
    libraryItems = result.items;
    renderLibrary();
    renderLibraryCategories();
  } catch (error) {
    document.querySelector('#library-entries').replaceChildren(messageNode(error.message));
    document.querySelector('.pagination-info').textContent = 'No se pudieron cargar los documentos.';
  }
}

function renderLibrary() {
  const container = document.querySelector('#library-entries');
  const query = document.querySelector('.search-box input').value.trim().toLocaleLowerCase();
  const matches = libraryItems.filter((item) => {
    const text = `${item.title} ${item.summary} ${item.content} ${item.category}`.toLocaleLowerCase();
    return text.includes(query) && (!activeLibraryCategory || item.category === activeLibraryCategory);
  });

  container.replaceChildren();
  if (!matches.length) {
    container.appendChild(messageNode(libraryItems.length ? 'No hay documentos que coincidan con la búsqueda.' : 'Aún no hay documentos disponibles.'));
  }

  matches.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'library-entry';
    const heading = document.createElement('h3');
    heading.className = 'serif';
    heading.textContent = item.title;
    const category = document.createElement('p');
    category.className = 'library-entry__category';
    category.textContent = item.category;
    const summary = document.createElement('p');
    summary.className = 'library-entry__summary';
    summary.textContent = item.summary || item.content;
    const actions = document.createElement('div');
    actions.className = 'library-entry__actions';
    const open = document.createElement('button');
    open.className = 'btn btn-cyan';
    open.type = 'button';
    open.textContent = 'Leer documento';
    open.addEventListener('click', () => openLibraryEntry(item));
    actions.appendChild(open);
    if (item.source_url) {
      const source = document.createElement('a');
      source.href = item.source_url;
      source.target = '_blank';
      source.rel = 'noopener noreferrer';
      source.textContent = 'Abrir fuente';
      actions.appendChild(source);
    }
    card.append(heading, category, summary, actions);
    container.appendChild(card);
  });

  document.querySelector('.pagination-info').textContent = `${matches.length} de ${libraryItems.length} documentos`;
}

function renderLibraryCategories() {
  const list = document.querySelector('.category-list');
  const categories = [...new Set(libraryItems.map((item) => item.category))];
  list.replaceChildren();
  [['', 'Todas'], ...categories.map((category) => [category, category])].forEach(([value, label]) => {
    const item = document.createElement('li');
    item.className = 'cat-item';
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.classList.toggle('is-active', value === activeLibraryCategory);
    button.addEventListener('click', () => {
      activeLibraryCategory = value;
      renderLibrary();
      renderLibraryCategories();
    });
    item.appendChild(button);
    list.appendChild(item);
  });
}

function openLibraryEntry(item) {
  const body = Modal.el('div', 'modal__body');
  body.append(
    Modal.el('p', 'breadcrumb', item.category),
    Modal.el('h3', 'modal__title serif', item.title),
  );
  if (item.summary) body.appendChild(Modal.el('p', 'modal__lead', item.summary));
  body.appendChild(Modal.el('p', 'modal__text', item.content));
  const wrapper = Modal.el('div');
  if (item.image_url) {
    const image = Modal.el('img', 'modal__image');
    image.src = item.image_url;
    image.alt = item.title;
    wrapper.appendChild(image);
  }
  wrapper.appendChild(body);
  Modal.open({ node: wrapper, label: item.title });
}

function messageNode(message) {
  const node = document.createElement('p');
  node.className = 'content-message';
  node.textContent = message;
  return node;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.search-box input').addEventListener('input', renderLibrary);
});
