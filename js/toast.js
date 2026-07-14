/** Mensajes inline / toast — sustituto de alert() */
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
