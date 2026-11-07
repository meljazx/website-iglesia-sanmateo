'use strict';

document.addEventListener('DOMContentLoaded', () => {
  let csrfToken = window.ADMIN_STATE.csrfToken;
  const loginForm = document.querySelector('#login-form');
  const contentForm = document.querySelector('#content-form');
  const typeSelect = document.querySelector('#content-type');
  updateFields();

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    try {
      const result = await request('api/auth.php', 'POST', {
        action: 'login',
        email: formData.get('email'),
        password: formData.get('password'),
      });
      csrfToken = result.csrf_token;
      window.location.reload();
    } catch (error) {
      document.querySelector('#login-message').textContent = error.message;
    }
  });

  document.querySelector('#logout-button').addEventListener('click', async () => {
    try {
      const result = await request('api/auth.php', 'POST', { action: 'logout' });
      csrfToken = result.csrf_token;
      window.location.reload();
    } catch (error) {
      showMessage(error.message);
    }
  });

  contentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(contentForm));
    const id = document.querySelector('#content-id').value;
    const type = typeSelect.value;
    const payload = {
      title: data.title,
      category: data.category,
      content: data.content,
      image_url: data.image_url,
      published_at: data.published_at,
      is_published: document.querySelector('#content-published').checked,
    };
    if (type === 'blog') payload.excerpt = data.summary;
    else {
      payload.summary = data.summary;
      payload.source_url = data.source_url;
    }

    try {
      await request(`api/content.php?type=${type}${id ? `&id=${encodeURIComponent(id)}` : ''}`, id ? 'PUT' : 'POST', payload);
      resetForm();
      await loadItems();
      showMessage('Cambios guardados correctamente.');
    } catch (error) {
      showMessage(error.message);
    }
  });

  document.querySelector('#cancel-edit').addEventListener('click', resetForm);
  typeSelect.addEventListener('change', () => {
    resetForm();
    updateFields();
    loadItems();
  });
  document.querySelector('#content-list').addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const item = JSON.parse(button.dataset.item);
    if (button.dataset.action === 'edit') {
      setForm(item);
      return;
    }
    if (!window.confirm(`¿Eliminar "${item.title}"? Esta acción no se puede deshacer.`)) return;
    try {
      await request(`api/content.php?type=${typeSelect.value}&id=${encodeURIComponent(item.id)}`, 'DELETE');
      await loadItems();
      showMessage('Entrada eliminada.');
    } catch (error) {
      showMessage(error.message);
    }
  });

  if (window.ADMIN_STATE.authenticated) loadItems();

  function request(url, method = 'GET', body = null) {
    const headers = { Accept: 'application/json' };
    if (body !== null) headers['Content-Type'] = 'application/json';
    if (method !== 'GET') headers['X-CSRF-Token'] = csrfToken;
    return fetch(url, {
      method,
      headers,
      body: body === null ? undefined : JSON.stringify(body),
    }).then(async (response) => {
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Ocurrió un error inesperado.');
      return result;
    });
  }

  async function loadItems() {
    const list = document.querySelector('#content-list');
    list.replaceChildren();
    try {
      const result = await request(`api/content.php?type=${typeSelect.value}&manage=1`);
      if (!result.items.length) {
        const empty = document.createElement('li');
        empty.textContent = 'Todavía no hay entradas.';
        list.appendChild(empty);
        return;
      }
      result.items.forEach((item) => {
        const row = document.createElement('li');
        const title = document.createElement('span');
        title.textContent = `${item.title} · ${item.is_published ? 'Publicado' : 'Borrador'}`;
        const actions = document.createElement('div');
        actions.className = 'admin-list-actions';
        actions.append(
          actionButton('Editar', 'edit', item),
          actionButton('Eliminar', 'delete', item),
        );
        row.append(title, actions);
        list.appendChild(row);
      });
    } catch (error) {
      const row = document.createElement('li');
      row.textContent = error.message;
      list.appendChild(row);
    }
  }

  function actionButton(label, action, item) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.dataset.action = action;
    button.dataset.item = JSON.stringify(item);
    return button;
  }

  function setForm(item) {
    document.querySelector('#content-id').value = item.id;
    document.querySelector('#content-title').value = item.title;
    document.querySelector('#content-category').value = item.category;
    document.querySelector('#content-summary').value = item.excerpt || item.summary || '';
    document.querySelector('#content-body').value = item.content;
    document.querySelector('#content-image').value = item.image_url || '';
    document.querySelector('#content-source').value = item.source_url || '';
    document.querySelector('#content-date').value = (item.published_at || '').replace(' ', 'T').slice(0, 16);
    document.querySelector('#content-published').checked = Boolean(Number(item.is_published));
    document.querySelector('#cancel-edit').hidden = false;
    document.querySelector('#content-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function resetForm() {
    contentForm.reset();
    document.querySelector('#content-id').value = '';
    document.querySelector('#cancel-edit').hidden = true;
  }

  function updateFields() {
    const isLibrary = typeSelect.value === 'biblioteca';
    document.querySelector('#summary-label').textContent = isLibrary ? 'Resumen' : 'Descripción breve';
    document.querySelector('#summary-label').htmlFor = 'content-summary';
    document.querySelector('#content-source').hidden = !isLibrary;
    document.querySelector('#source-label').hidden = !isLibrary;
    document.querySelector('#content-summary').maxLength = isLibrary ? 500 : 300;
  }

  function showMessage(message) {
    document.querySelector('#content-message').textContent = message;
  }
});
