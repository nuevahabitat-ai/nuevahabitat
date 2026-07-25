/* ============================================================
   NUEVAHABITAT — Cliente Supabase
   ⚠️  El anon key es público por diseño (Row Level Security protege los datos).
       NUNCA expongas el service_role key en el frontend.
   ============================================================ */

const SUPABASE_URL      = 'https://xxodawayoogthxnjpouq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_fZ9IgW5VfsF_Gf_zFsxqnA_jOaH2yri';

/* Email del administrador — redirige a admin-panel en lugar de panel */
const ADMIN_EMAIL = 'admin.nuevahabitat@gmail.com';

const CONFIRM_URL = () => window.location.origin + '/confirmar-cuenta.html';

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

  /* Devuelve 'vendedor' o 'comprador' según metadata del usuario */
  getUserTipo(user) {
    const meta = user?.user_metadata?.tipo;
    if (meta === 'vender' || meta === 'vendedor') return 'vendedor';
    if (meta === 'comprar' || meta === 'comprador') return 'comprador';
    const stored = localStorage.getItem('nh_reg_tipo');
    if (stored === 'vender') return 'vendedor';
    if (stored === 'comprar') return 'comprador';
    return 'comprador';
  },

  getPanelUrl(user) {
    if (nhAuth.isAdmin(user)) return 'admin-panel.html';
    const tipo = nhAuth.getUserTipo(user);
    return 'panel.html?tipo=' + tipo;
  },

  async register({ email, password, nombre, tipo, telefono }) {
    const { data, error } = await window.nhSupabase.auth.signUp({
      email, password,
      options: {
        data: { nombre, tipo, telefono: telefono || null },
        emailRedirectTo: CONFIRM_URL()
      }
    });
    if (!error && data?.user) {
      localStorage.setItem('nh_reg_tipo', tipo || 'comprar');
      if (data.session?.user) await nhAuth.ensureClientRecord(data.session.user);
      if (window.nhNotify) {
        nhNotify({ nombre, email, tipo: 'bienvenida', template: 'bienvenida', extra: { tipo } });
        nhNotify({ nombre, email, telefono: telefono || '', mensaje: `Nuevo registro · tipo: ${tipo || '–'}`, tipo: tipo === 'vender' ? 'vender' : 'comprar' });
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
    const path = redirectPath || '/confirmar-cuenta.html';
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
    window.location.replace('login.html?logout=1');
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
      redirectTo: window.location.origin + '/login.html?recovery=1'
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

  /** Crea fila en compradores o vendedores si no existe (respaldo del trigger SQL) */
  async ensureClientRecord(user) {
    if (!window.nhSupabase || !user?.email || nhAuth.isAdmin(user)) return;
    const tipo = nhAuth.getUserTipo(user);
    const nombre = (user.user_metadata?.nombre || user.email.split('@')[0] || 'Cliente').trim();
    const telefono = user.user_metadata?.telefono || null;
    const email = user.email;

    if (tipo === 'vendedor') {
      const { data } = await window.nhSupabase.from('vendedores').select('id').eq('email', email).maybeSingle();
      if (!data) {
        await window.nhSupabase.from('vendedores').insert({ nombre, email, telefono });
      }
    } else {
      const { data } = await window.nhSupabase.from('compradores').select('id').eq('email', email).maybeSingle();
      if (!data) {
        await window.nhSupabase.from('compradores').insert({ nombre, email, telefono, activo: true });
      }
    }
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
