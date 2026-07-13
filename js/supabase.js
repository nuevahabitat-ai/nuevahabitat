/* ============================================================
   NUEVAHABITAT — Cliente Supabase
   ⚠️  El anon key es público por diseño (Row Level Security protege los datos).
       NUNCA expongas el service_role key en el frontend.
   ============================================================ */

const SUPABASE_URL      = 'https://xxodawayoogthxnjpouq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4b2Rhd2F5b29ndGh4bmpwb3VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3Mjc5OTAsImV4cCI6MjA5OTMwMzk5MH0.c9-DZk27z-LOQpcgSTBSbgUXY6HPK6oIefpAPBSrDGo';

/* Email del administrador — redirige a admin-panel en lugar de panel */
const ADMIN_EMAIL = 'admin.nuevahabitat@gmail.com';

const CONFIRM_URL = () => window.location.origin + '/confirmar-cuenta.html';

/* Carga el SDK de Supabase desde CDN */
const _supabaseScript = document.createElement('script');
_supabaseScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
_supabaseScript.onload = () => {
  window.nhSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      detectSessionInUrl: true,
      flowType: 'pkce'
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
    if (user?.email === ADMIN_EMAIL) return 'admin-panel.html';
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
      if (window.nhNotify) {
        nhNotify({ nombre, email, tipo: 'bienvenida', template: 'bienvenida' });
        nhNotify({ nombre, email, telefono: telefono || '', mensaje: `Nuevo registro · tipo: ${tipo || '–'}`, tipo: tipo === 'vender' ? 'vender' : 'comprar' });
      }
    }
    return { data, error };
  },

  async login({ email, password }) {
    const { data, error } = await window.nhSupabase.auth.signInWithPassword({ email, password });
    return { data, error };
  },

  async loginGoogle() {
    const { data, error } = await window.nhSupabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: CONFIRM_URL() }
    });
    return { data, error };
  },

  async logout() {
    await window.nhSupabase.auth.signOut();
    localStorage.removeItem('nh_reg_tipo');
    window.location.href = 'index.html';
  },

  async getSession() {
    const { data } = await window.nhSupabase.auth.getSession();
    return data.session;
  },

  async getUser() {
    const { data } = await window.nhSupabase.auth.getUser();
    return data.user;
  },

  async resetPassword(email) {
    const { error } = await window.nhSupabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/login.html?reset=true'
    });
    return { error };
  },

  redirectAfterLogin(user) {
    window.location.href = nhAuth.getPanelUrl(user);
  },

  isAdmin(user) {
    return user?.email === ADMIN_EMAIL;
  }
};
