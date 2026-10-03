/* ============================================================
   NUEVAHABITAT — Cliente Supabase
   ⚠️  El anon key es público por diseño (Row Level Security protege los datos).
       NUNCA expongas el service_role key en el frontend.
   ============================================================ */

const SUPABASE_URL      = 'https://xxodawayoogthxnjpouq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_fZ9IgW5VfsF_Gf_zFsxqnA_jOaH2yri';

/* Email del administrador — redirige a admin-panel en lugar de panel */
const ADMIN_EMAIL = 'admin.nuevahabitat@gmail.com';

const CONFIRM_URL = () => window.location.origin + '/confirmar-cuenta';

function clearAuthStorage() {
  localStorage.removeItem('nh_reg_tipo');
  localStorage.removeItem('nh_reg_email');
  Object.keys(localStorage).forEach(k => {
    if (k.startsWith('sb-') && k.endsWith('-auth-token')) localStorage.removeItem(k);
  });
  sessionStorage.setItem('nh_logout_at', String(Date.now()));
}

function shouldSkipAutoLogin() {
  const t = sessionStorage.getItem('nh_logout_at');
  if (!t) return false;
  if (Date.now() - Number(t) > 8000) {
    sessionStorage.removeItem('nh_logout_at');
    return false;
  }
  return true;
}

function normalizeEmail(email) {
  return (email || '').toLowerCase().trim();
}

/* Carga el SDK de Supabase desde CDN */
const _supabaseScript = document.createElement('script');
_supabaseScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
_supabaseScript.onerror = () => {
  document.dispatchEvent(new Event('supabase:error'));
};
_supabaseScript.onload = () => {
  window.nhSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true
    }
  });
  document.dispatchEvent(new Event('supabase:ready'));
};
document.head.appendChild(_supabaseScript);


/* ── AUTH HELPERS ─────────────────────────────────────────── */
window.nhAuth = {

  isPropietarioAlquilerTipo(raw) {
    return ['alquiler', 'alquiler_integral', 'integral', 'propietario', 'admin_alquiler'].includes(raw);
  },

  /* Devuelve 'vendedor', 'comprador' o 'propietario' según metadata del usuario */
  getUserTipo(user) {
    const meta = user?.user_metadata?.tipo;
    const serv = user?.user_metadata?.servicio;
    if (nhAuth.isPropietarioAlquilerTipo(meta)) return 'propietario';
    if (serv === 'integral' || serv === 'administracion') return 'propietario';
    if (meta === 'vender' || meta === 'vendedor') return 'vendedor';
    if (meta === 'comprar' || meta === 'comprador') return 'comprador';
    const stored = localStorage.getItem('nh_reg_tipo');
    if (nhAuth.isPropietarioAlquilerTipo(stored)) return 'propietario';
    if (stored === 'vender') return 'vendedor';
    if (stored === 'comprar') return 'comprador';
    return 'comprador';
  },

  /** Panel: URL ?tipo= > metadata > localStorage */
  resolvePanelTipo(user, urlTipo) {
    if (urlTipo === 'vendedor' || urlTipo === 'comprador' || urlTipo === 'propietario') return urlTipo;
    return nhAuth.getUserTipo(user);
  },

  metaTipoFromPanel(tipo) {
    if (tipo === 'propietario') return 'alquiler';
    return tipo === 'vendedor' ? 'vender' : 'comprar';
  },

  getPanelUrl(user) {
    if (nhAuth.isAdmin(user)) return '/admin-panel';
    const tipo = nhAuth.getUserTipo(user);
    if (tipo === 'propietario') return '/panel-propietario';
    return '/panel?tipo=' + tipo;
  },

  /**
   * Fija metadata + expediente propietarios_alquiler (integral o administración).
   * Necesario si el usuario venía de comprador/vendedor o confirmó email sin nh_reg_tipo.
   */
  async applyAlquilerAccessProfile(user, variant) {
    if (!window.nhSupabase || !user?.id || nhAuth.isAdmin(user)) return user;
    const integral = variant === 'integral' || variant === 'alquiler_integral';
    const metaTipo = integral ? 'alquiler_integral' : 'alquiler';
    const metaServicio = integral ? 'integral' : 'administracion';
    const patch = {
      tipo: metaTipo,
      servicio: metaServicio,
      nombre: user.user_metadata?.nombre || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Propietario',
      telefono: user.user_metadata?.telefono || null,
    };
    const { error: metaErr } = await window.nhSupabase.auth.updateUser({ data: patch });
    if (metaErr) throw metaErr;
    localStorage.setItem('nh_reg_tipo', metaTipo);
    const { data: { user: refreshed } } = await window.nhSupabase.auth.getUser();
    const u = refreshed || user;
    await nhAuth.ensureClientRecord(u, { tipo: 'propietario' });
    const rowPatch = integral
      ? { servicio: 'integral', cuota_mensual: 0, integral_tarifa: 499 }
      : { servicio: 'administracion', cuota_mensual: 60 };
    const { error: rowErr } = await window.nhSupabase.from('propietarios_alquiler')
      .update(rowPatch)
      .ilike('email', u.email);
    if (rowErr) console.warn('applyAlquilerAccessProfile update row', rowErr);
    localStorage.setItem('nh_alquiler_servicio', integral ? 'integral' : 'administracion');
    return u;
  },

  getAlquilerPanelMode(user) {
    const persisted = localStorage.getItem('nh_alquiler_servicio');
    if (persisted === 'integral' || persisted === 'administracion') return persisted;
    const meta = user?.user_metadata || {};
    if (meta.tipo === 'alquiler_integral' || meta.servicio === 'integral') return 'integral';
    if (meta.tipo === 'alquiler' || meta.servicio === 'administracion') return 'administracion';
    if (localStorage.getItem('nh_reg_tipo') === 'alquiler_integral') return 'integral';
    if (localStorage.getItem('nh_reg_tipo') === 'alquiler') return 'administracion';
    if (sessionStorage.getItem('nh_alquiler_variant') === 'integral') return 'integral';
    if (sessionStorage.getItem('nh_alquiler_variant') === 'administracion') return 'administracion';
    const q = new URLSearchParams(window.location.search).get('servicio');
    if (q === 'integral' || q === 'administracion') return q;
    return 'administracion';
  },

  shouldUseIntegralPanel(user) {
    return nhAuth.getAlquilerPanelMode(user) === 'integral';
  },

  async register({ email, password, nombre, tipo, telefono, servicio }) {
    const metaServicio = servicio || (tipo === 'alquiler_integral' ? 'integral' : null);
    const { data, error } = await window.nhSupabase.auth.signUp({
      email, password,
      options: {
        data: { nombre, tipo, telefono: telefono || null, servicio: metaServicio },
        emailRedirectTo: CONFIRM_URL()
      }
    });
    if (!error && data?.user) {
      localStorage.setItem('nh_reg_tipo', tipo || 'comprar');
      if (data.session?.user) {
        if (tipo === 'alquiler_integral') {
          await nhAuth.applyAlquilerAccessProfile(data.session.user, 'integral');
        } else if (tipo === 'alquiler') {
          await nhAuth.applyAlquilerAccessProfile(data.session.user, 'administracion');
        } else {
          const panelTipo = tipo === 'vender' ? 'vendedor' : 'comprador';
          await nhAuth.ensureClientRecord(data.session.user, { tipo: panelTipo });
        }
      }
      if (window.nhNotify) {
        nhNotify({ nombre, email, tipo: 'bienvenida', template: 'bienvenida', extra: { tipo } });
      }
      const telReg = (telefono || '').trim();
      const esVendedorReg = tipo === 'vender' || tipo === 'vendedor';
      const esPropietarioReg = nhAuth.isPropietarioAlquilerTipo(tipo);
      const mensajeRegistroAdmin = esPropietarioReg
        ? (tipo === 'alquiler_integral'
          ? 'Nuevo propietario (alquiler integral) registrado en su panel'
          : 'Nuevo propietario (admin alquiler) registrado en su panel')
        : esVendedorReg
          ? 'Nuevo vendedor registrado en su panel'
          : 'Nuevo comprador registrado en su panel';
      if (window.nhNotify && telReg) {
        nhNotify({
          nombre,
          email,
          telefono: telReg,
          mensaje: mensajeRegistroAdmin,
          tipo: esPropietarioReg ? 'alquiler' : (esVendedorReg ? 'venta' : 'compra'),
          origen: 'registro_cuenta',
        }).catch((e) => console.warn('notify registro admin', e));
      }
    }
    return { data, error };
  },

  async login({ email, password }) {
    const { data, error } = await window.nhSupabase.auth.signInWithPassword({ email, password });
    return { data, error };
  },

  async loginGoogle(redirectPath) {
    const tipo = localStorage.getItem('nh_reg_tipo') || 'comprar';
    const path = redirectPath || '/confirmar-cuenta';
    const { data, error } = await window.nhSupabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + path,
        queryParams: { prompt: 'select_account' }
      }
    });
    if (!error) localStorage.setItem('nh_reg_tipo', tipo);
    return { data, error };
  },

  async logout() {
    try {
      await window.nhSupabase.auth.signOut({ scope: 'global' });
    } catch (_) {
      try { await window.nhSupabase.auth.signOut({ scope: 'local' }); } catch (_) {}
    }
    clearAuthStorage();
    window.location.replace('/login?logout=1');
  },

  async getSession() {
    if (shouldSkipAutoLogin()) return null;
    const { data: { user }, error } = await window.nhSupabase.auth.getUser();
    if (error || !user) return null;
    const { data } = await window.nhSupabase.auth.getSession();
    return data.session;
  },

  async getUser() {
    if (shouldSkipAutoLogin()) return null;
    const { data, error } = await window.nhSupabase.auth.getUser();
    if (error) return null;
    return data.user;
  },

  async resetPassword(email) {
    const { error } = await window.nhSupabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/login?recovery=1'
    });
    return { error };
  },

  async updatePassword(newPassword) {
    const { data, error } = await window.nhSupabase.auth.updateUser({ password: newPassword });
    return { data, error };
  },

  isRecoverySession() {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    if (hash.get('type') === 'recovery') return true;
    return new URLSearchParams(window.location.search).get('recovery') === '1';
  },

  redirectAfterLogin(user) {
    sessionStorage.removeItem('nh_logout_at');
    const redir = new URLSearchParams(window.location.search).get('redirect');
    if (redir) {
      try {
        const url = redir.startsWith('http') ? redir : (window.location.origin + '/' + redir.replace(/^\//, ''));
        if (url.startsWith(window.location.origin)) {
          window.location.replace(url);
          return;
        }
      } catch (_) {}
    }
    const dest = nhAuth.getPanelUrl(user);
    window.location.replace(dest.startsWith('http') ? dest : (window.location.origin + '/' + dest.replace(/^\//, '')));
  },

  isAdmin(user) {
    return normalizeEmail(user?.email) === normalizeEmail(ADMIN_EMAIL);
  },

  /** Crea perfil + fila en compradores, vendedores o propietarios_alquiler */
  async ensureClientRecord(user, opts = {}) {
    if (!window.nhSupabase || !user?.email || nhAuth.isAdmin(user)) return true;
    const tipo = opts.tipo || nhAuth.getUserTipo(user);
    const nombre = (user.user_metadata?.nombre || user.email.split('@')[0] || 'Cliente').trim();
    const telefono = user.user_metadata?.telefono || null;
    const email = user.email;

    if (tipo === 'propietario') {
      const { error: propErr } = await window.nhSupabase.rpc('sync_propietario_alquiler');
      if (propErr) console.error('ensureClientRecord sync_propietario_alquiler', propErr);
      return !propErr;
    }

    const pTipo = tipo === 'vendedor' ? 'vendedor' : 'comprador';
    const { error: syncErr } = await window.nhSupabase.rpc('sync_cliente_tipo', { p_tipo: pTipo });
    if (!syncErr) return true;

    const { error: rpcErr } = await window.nhSupabase.rpc('ensure_perfil');
    if (rpcErr) {
      const { error: perfilErr } = await window.nhSupabase.from('perfiles').upsert({
        id: user.id,
        nombre,
        telefono,
        rol: 'cliente',
      }, { onConflict: 'id' });
      if (perfilErr) {
        console.error('ensureClientRecord perfil', perfilErr, rpcErr);
        return false;
      }
    }

    const { data: perfilRow } = await window.nhSupabase.from('perfiles').select('id').eq('id', user.id).maybeSingle();
    if (!perfilRow?.id) return false;

    if (tipo === 'vendedor') {
      const { data } = await window.nhSupabase.from('vendedores').select('id').eq('email', email).maybeSingle();
      if (!data) {
        const { error } = await window.nhSupabase.from('vendedores').insert({ nombre, email, telefono });
        if (error) console.error('ensureClientRecord vendedor', error);
      }
    } else {
      const { data } = await window.nhSupabase.from('compradores').select('id').eq('email', email).maybeSingle();
      if (!data) {
        const { error } = await window.nhSupabase.from('compradores').insert({ nombre, email, telefono, activo: true });
        if (error) console.error('ensureClientRecord comprador', error);
      }
    }
    return true;
  },

  /** Query inmuebles respetando cartera privada (solo registrados ven privados) */
  async fetchInmuebles(selectCols, orderOpts = {}, filters = {}) {
    const sb = window.nhSupabase;
    let q = sb.from('inmuebles').select(selectCols).neq('estado', 'retirado');
    const { data: { user } } = await sb.auth.getUser();
    if (!user) q = q.or('cartera_privada.eq.false,cartera_privada.is.null');
    if (filters.estado) q = q.eq('estado', filters.estado);
    if (filters.excludeId) q = q.neq('id', filters.excludeId);
    if (orderOpts.column) {
      q = q.order(orderOpts.column, { ascending: orderOpts.ascending !== false });
    }
    if (orderOpts.limit) q = q.limit(orderOpts.limit);
    return await q;
  }
};

/* ── Toast / mensajes (global) ─────────────────────────────── */
(function () {
  if (window.nhToast) return;
  window.nhToast = function (msg, type = 'error', ms = 4500) {
    let root = document.getElementById('nh-toast-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'nh-toast-root';
      root.style.cssText = 'position:fixed;bottom:calc(70px + env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);z-index:9999;display:flex;flex-direction:column;gap:.5rem;max-width:min(420px,92vw);pointer-events:none';
      document.body.appendChild(root);
    }
    const el = document.createElement('div');
    const bg = type === 'success' ? '#166534' : type === 'info' ? '#1e40af' : '#b91c1c';
    el.style.cssText = `background:${bg};color:#fff;padding:.85rem 1.1rem;border-radius:8px;font-size:.875rem;line-height:1.45;box-shadow:0 8px 24px rgba(0,0,0,.2);pointer-events:auto;animation:nhToastIn .25s ease`;
    el.textContent = msg;
    root.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 300); }, ms);
  };
  window.nhFormMsg = function (el, msg, type = 'error') {
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
    el.style.background = type === 'success' ? '#f0fdf4' : type === 'info' ? '#eff6ff' : '#fef2f2';
    el.style.borderColor = type === 'success' ? '#86efac' : type === 'info' ? '#93c5fd' : '#fca5a5';
    el.style.color = type === 'success' ? '#166534' : type === 'info' ? '#1e40af' : '#b91c1c';
  };
  if (!document.getElementById('nh-toast-style')) {
    const s = document.createElement('style');
    s.id = 'nh-toast-style';
    s.textContent = '@keyframes nhToastIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}';
    document.head.appendChild(s);
  }
})();
