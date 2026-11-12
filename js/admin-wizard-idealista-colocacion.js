/**
 * Colocación Idealista (wizard): precio desde caché + persistir idealista_id tras publicar.
 * Sin parches en admin-panel.html.
 */
(function () {
  function normId(raw) {
    const d = String(raw || '').replace(/\D/g, '');
    return d.length >= 8 ? d : '';
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function publishSucceeded() {
    const ok = document.getElementById('wiz-ok');
    return ok && ok.style.display !== 'none' && String(ok.textContent || '').includes('✅');
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
    if (!res.ok || json.ok === false) return null;
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

  async function persistIdealistaOnInmueble(ctx) {
    const idealistaId = normId(ctx.idealistaId || document.getElementById('w-idealista-id')?.value);
    if (!idealistaId || !window.nhSupabase) return;
    const patch = {
      idealista_id: idealistaId,
      updated_at: new Date().toISOString(),
    };
    const precio = parseFloat(document.getElementById('w-precio')?.value);
    if (precio >= 40000) patch.precio = precio;

    let q = window.nhSupabase.from('inmuebles').update(patch);
    if (ctx.editId) q = q.eq('id', ctx.editId);
    else if (ctx.ref) q = q.eq('ref', ctx.ref);
    else return;

    const { error } = await q;
    if (error && /idealista_id/.test(error.message || '')) {
      if (precio >= 40000) {
        await window.nhSupabase.from('inmuebles').update({ precio, updated_at: patch.updated_at }).eq(
          ctx.editId ? 'id' : 'ref',
          ctx.editId || ctx.ref,
        );
      }
      return;
    }
    if (error) console.warn('persistIdealistaOnInmueble', error.message);
  }

  function hookPublishProperty() {
    if (typeof window.publishProperty !== 'function' || window.publishProperty.__nhIdealistaWrap) return;
    const orig = window.publishProperty;
    const wrapped = async function nhPublishWithIdealista() {
      const idealistaRaw = document.getElementById('w-idealista-id')?.value;
      const refBefore = (document.getElementById('w-ref')?.value || '').trim();
      const editId = window.editingPropertyId || null;
      await applyPrecioFromIdealista();
      await orig.apply(this, arguments);
      if (!publishSucceeded()) return;
      await persistIdealistaOnInmueble({
        idealistaId: idealistaRaw,
        ref: refBefore,
        editId,
      });
    };
    wrapped.__nhIdealistaWrap = true;
    window.publishProperty = wrapped;
  }

  function hookEditProperty() {
    if (typeof window.editProperty !== 'function' || window.editProperty.__nhIdealistaWrap) return;
    const orig = window.editProperty;
    window.editProperty = function nhEditWithIdealista(id) {
      orig(id);
      void (async () => {
        for (let i = 0; i < 50; i++) {
          await sleep(80);
          if (document.getElementById('w-ref')?.value) break;
        }
        const w = document.getElementById('w-idealista-id');
        if (!w || !id || !window.nhSupabase) return;
        const { data } = await window.nhSupabase
          .from('inmuebles')
          .select('idealista_id')
          .eq('id', id)
          .maybeSingle();
        if (data?.idealista_id) w.value = String(data.idealista_id);
      })();
    };
    window.editProperty.__nhIdealistaWrap = true;
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
    hookPublishProperty();
    hookEditProperty();
    const refField = document.getElementById('w-ref');
    if (refField && !window.__nhIdealistaColocObserver) {
      window.__nhIdealistaColocObserver = new MutationObserver(() => {
        bindIdealistaField();
        hookPublishProperty();
        hookEditProperty();
      });
      window.__nhIdealistaColocObserver.observe(refField.closest('#inm-new') || document.body, {
        childList: true,
        subtree: true,
      });
    }
  }

  let hookTries = 0;
  function bootWithHooks() {
    boot();
    hookTries++;
    if (hookTries < 80 && typeof window.publishProperty !== 'function') {
      setTimeout(bootWithHooks, 250);
    }
  }

  document.addEventListener('DOMContentLoaded', bootWithHooks);
  if (document.readyState !== 'loading') bootWithHooks();
})();
