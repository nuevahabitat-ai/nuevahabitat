/* ============================================================
   NUEVAHABITAT — Cliente Supabase
   ⚠️  El anon key es público por diseño (Row Level Security protege los datos).
       NUNCA expongas el service_role key en el frontend.
   ============================================================ */

const SUPABASE_URL      = 'https://xxodawayoogthxnjpouq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4b2Rhd2F5b29ndGh4bmpwb3VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3Mjc5OTAsImV4cCI6MjA5OTMwMzk5MH0.c9-DZk27z-LOQpcgSTBSbgUXY6HPk6oIefpAPBSrDGo';

/* Email del administrador — redirige a admin-panel en lugar de panel */
const ADMIN_EMAIL = 'admin.nuevahabitat@gmail.com';

/* Carga el SDK de Supabase desde CDN */
const _supabaseScript = document.createElement('script');
_supabaseScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
_supabaseScript.onload = () => {
  window.nhSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  document.dispatchEvent(new Event('supabase:ready'));
};
document.head.appendChild(_supabaseScript);


/* ── AUTH HELPERS ─────────────────────────────────────────── */
window.nhAuth = {

  async register({ email, password, nombre, tipo }) {
    const { data, error } = await window.nhSupabase.auth.signUp({
      email, password,
      options: { data: { nombre, tipo } }
    });
    return { data, error };
  },

  async login({ email, password }) {
    const { data, error } = await window.nhSupabase.auth.signInWithPassword({ email, password });
    return { data, error };
  },

  async loginGoogle() {
    const { data, error } = await window.nhSupabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/login.html?check=1' }
    });
    return { data, error };
  },

  async logout() {
    await window.nhSupabase.auth.signOut();
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

  /* Determina a qué panel redirigir según el email */
  redirectAfterLogin(user) {
    if (user?.email === ADMIN_EMAIL) {
      window.location.href = 'admin-panel.html';
    } else {
      window.location.href = 'panel.html';
    }
  },

  isAdmin(user) {
    return user?.email === ADMIN_EMAIL;
  }
};
