/**
 * Abre WhatsApp: primero app (whatsapp://); si no abre, wa.me tras perder foco o timeout.
 * Usar en botones del panel en lugar de window.open('https://wa.me/...').
 */
(function () {
  function nhWaDigits(telefono) {
    if (!telefono) return '';
    let digits = String(telefono).replace(/\D/g, '');
    if (!digits) return '';
    if (digits.startsWith('00')) digits = digits.slice(2);
    if (digits.length === 9 && /^[67]/.test(digits)) digits = '34' + digits;
    return digits;
  }

  function nhOpenWhatsApp(telefono, text, opts) {
    const phone = nhWaDigits(telefono);
    const toast = typeof window.nhToast === 'function' ? window.nhToast : null;
    if (!phone) {
      if (toast) toast((opts && opts.invalidMsg) || 'Teléfono no válido.', 'info');
      return false;
    }
    const body = text != null ? String(text) : '';
    const webUrl = `https://wa.me/${phone}${body.trim() ? '?text=' + encodeURIComponent(body) : ''}`;
    const appUrl = body.trim()
      ? `whatsapp://send?phone=${phone}&text=${encodeURIComponent(body)}`
      : `whatsapp://send?phone=${phone}`;
    const ms = (opts && opts.fallbackMs) != null ? opts.fallbackMs : 750;
    let usedWeb = false;
    const openWeb = function () {
      if (usedWeb) return;
      usedWeb = true;
      window.removeEventListener('blur', onBlur);
      window.open(webUrl, '_blank', 'noopener,noreferrer');
    };
    const onBlur = function () {
      usedWeb = true;
      clearTimeout(timerId);
      window.removeEventListener('blur', onBlur);
    };
    window.addEventListener('blur', onBlur);
    const timerId = setTimeout(openWeb, ms);
    const a = document.createElement('a');
    a.href = appUrl;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
    return true;
  }

  window.nhOpenWhatsApp = nhOpenWhatsApp;
})();