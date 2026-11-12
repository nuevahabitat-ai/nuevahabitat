/**
 * Colocación Idealista en wizard: guardar ref + precio venta desde caché/scrape.
 */
(function () {
  function normId(raw) {
    const d = String(raw || '').replace(/\D/g, '');
    return d.length >= 8 ? d : '';
  }

  async function authHeaders() {
    const session = (await window.nhSupabase?.auth.getSession())?.data?.session;
    if (!session?.access_token) throw new Error('Sesión requerida');
    return {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + session.access_token,
    };
  }

  async function fetchPrecioIdealista(idealistaId) {
    const headers = await authHeaders();
    const res = await fetch('/api/notify?__action=admin-idealista-precios-bulk', {
      method: 'POST',
      headers,
      body: JSON.stringify({ idealista_ids: [idealistaId], warm: true, maxScrape: 1 }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.ok) return null;
    const p = json.precios?.[idealistaId];
    return p >= 40000 ? Number(p) : null;
  }

  async function applyPrecioFromIdealista() {
    const input = document.getElementById('w-idealista-id');
    const precioEl = document.getElementById('w-precio');
    if (!input || !precioEl) return;
    const id = normId(input.value);
    if (!id) return;
    if (String(precioEl.value || '').trim() !== '') return;

    const hint = document.getElementById('w-idealista-precio-hint');
    if (hint) hint.textContent = 'Buscando precio Idealista…';

    try {
      const precio = await fetchPrecioIdealista(id);
      if (precio) {
        precioEl.value = String(precio);
        window.nhToast?.(
          'Precio de venta rellenado desde Idealista: ' + precio.toLocaleString('es-ES') + ' €',
          'success',
          6000,
        );
        if (hint) hint.textContent = 'Precio cargado desde Idealista. Revisa antes de publicar.';
      } else if (hint) {
        hint.textContent =
          'Sin precio en caché (Idealista bloquea scrape). Pon el € a mano o importa contactos con columna PRECIO.';
      }
    } catch (e) {
      if (hint) hint.textContent = e.message || 'No se pudo consultar precio';
    }
  }

  function bindIdealistaField() {
    const input = document.getElementById('w-idealista-id');
    if (!input || input.dataset.nhIdealistaBound) return;
    input.dataset.nhIdealistaBound = '1';

    let hint = document.getElementById('w-idealista-precio-hint');
    if (!hint && input.parentElement) {
      hint = document.createElement('p');
      hint.id = 'w-idealista-precio-hint';
      hint.className = 'text-muted';
      hint.style.cssText = 'font-size:.68rem;margin-top:.25rem;line-height:1.35';
      input.parentElement.appendChild(hint);
    }

    input.addEventListener('change', () => void applyPrecioFromIdealista());
    input.addEventListener('blur', () => void applyPrecioFromIdealista());
  }

  function boot() {
    bindIdealistaField();
    const refField = document.getElementById('w-ref');
    if (refField && !window.__nhIdealistaColocObserver) {
      window.__nhIdealistaColocObserver = new MutationObserver(() => bindIdealistaField());
      window.__nhIdealistaColocObserver.observe(refField.closest('#inm-new') || document.body, {
        childList: true,
        subtree: true,
      });
    }
  }

  document.addEventListener('DOMContentLoaded', boot);
  if (document.readyState !== 'loading') boot();
})();
