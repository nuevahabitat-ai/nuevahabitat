/* ============================================================
   NUEVAHABITAT — Cliente Supabase
   Sustituye SUPABASE_URL y SUPABASE_ANON_KEY con los valores
   de tu proyecto: Supabase Dashboard → Settings → API
   ============================================================ */

const SUPABASE_URL      = 'TU_SUPABASE_URL';       // ej: https://xxxx.supabase.co
const SUPABASE_ANON_KEY = 'TU_SUPABASE_ANON_KEY';  // clave pública (anon)

/* Carga el SDK de Supabase desde CDN */
const _supabaseScript = document.createElement('script');
_supabaseScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
_supabaseScript.onload = () => {
  window.nhSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  document.dispatchEvent(new Event('supabase:ready'));
};
document.head.appendChild(_supabaseScript);


/* ── AUTH HELPERS ─────────────────────────────────────────────
   Importa estas funciones desde login.html y registro.html
   llamando a nhAuth.login(), nhAuth.register(), etc.
   ──────────────────────────────────────────────────────────── */
window.nhAuth = {

  /* Registro con email + contraseña */
  async register({ email, password, nombre, tipo }) {
    const { data, error } = await window.nhSupabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre, tipo }   // guardado en user_metadata
      }
    });
    return { data, error };
  },

  /* Login con email + contraseña */
  async login({ email, password }) {
    const { data, error } = await window.nhSupabase.auth.signInWithPassword({ email, password });
    return { data, error };
  },

  /* Login con Google */
  async loginGoogle() {
    const { data, error } = await window.nhSupabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/panel.html' }
    });
    return { data, error };
  },

  /* Cerrar sesión */
  async logout() {
    await window.nhSupabase.auth.signOut();
    window.location.href = 'index.html';
  },

  /* Obtener sesión actual */
  async getSession() {
    const { data } = await window.nhSupabase.auth.getSession();
    return data.session;
  },

  /* Obtener usuario actual */
  async getUser() {
    const { data } = await window.nhSupabase.auth.getUser();
    return data.user;
  },

  /* Recuperar contraseña */
  async resetPassword(email) {
    const { error } = await window.nhSupabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/login.html?reset=true'
    });
    return { error };
  }
};
