/** Banner PWA: instalar app en movil (Android + instrucciones iOS) */
(function () {
  let deferredPrompt = null;
  let activeConfig = null;

  function isMobile() {
    return window.matchMedia('(max-width: 900px)').matches
      || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || '');
  }

  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true;
  }

  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent || '')
      || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  function isDismissed(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return false;
      const ts = parseInt(raw, 10);
      if (!Number.isFinite(ts)) return false;
      return Date.now() - ts < 7 * 24 * 60 * 60 * 1000;
    } catch (_) {
      return false;
    }
  }

  function dismiss(key) {
    try { localStorage.setItem(key, String(Date.now())); } catch (_) {}
  }

  function injectStyles() {
    if (document.getElementById('nh-pwa-install-style')) return;
    const s = document.createElement('style');
    s.id = 'nh-pwa-install-style';
    s.textContent = `
.nh-pwa-install{position:fixed;left:0;right:0;bottom:0;z-index:10050;padding:.65rem .65rem calc(.65rem + env(safe-area-inset-bottom));pointer-events:none;opacity:0;transform:translateY(110%);transition:transform .35s ease,opacity .35s ease}
.nh-pwa-install.show{opacity:1;transform:translateY(0);pointer-events:auto}
.nh-pwa-install-inner{display:flex;align-items:flex-start;gap:.75rem;background:linear-gradient(135deg,#1a1a1a,#2a241c);border:1px solid rgba(184,147,106,.35);border-radius:14px;padding:.85rem 1rem;box-shadow:0 12px 40px rgba(0,0,0,.45);max-width:520px;margin:0 auto}
.nh-pwa-install-icon{width:44px;height:44px;border-radius:10px;flex-shrink:0;object-fit:contain;background:#0d0d0d;padding:4px}
.nh-pwa-install-body{flex:1;min-width:0}
.nh-pwa-install-body strong{display:block;font-size:.875rem;color:#fff;margin-bottom:.2rem;line-height:1.3}
.nh-pwa-install-body p{margin:0;font-size:.75rem;color:rgba(255,255,255,.72);line-height:1.45}
.nh-pwa-install-steps{margin:.45rem 0 0;padding-left:1.1rem;font-size:.72rem;color:rgba(255,255,255,.78);line-height:1.5}
.nh-pwa-install-actions{display:flex;flex-direction:column;gap:.35rem;flex-shrink:0}
.nh-pwa-install-btn{background:#b8936a;border:none;color:#0d0d0d;font-weight:700;font-size:.72rem;padding:.5rem .75rem;border-radius:8px;cursor:pointer;white-space:nowrap;font-family:inherit}
.nh-pwa-install-dismiss{background:transparent;border:none;color:rgba(255,255,255,.55);font-size:1rem;line-height:1;padding:.25rem;cursor:pointer;align-self:flex-end}
@media(min-width:901px){.nh-pwa-install{display:none!important}}`;
    document.head.appendChild(s);
  }

  function ensureBar(config) {
    if (config.barEl) return config.barEl;
    let bar = document.getElementById('nhPwaInstallBar');
    if (bar) return bar;

    bar = document.createElement('div');
    bar.id = 'nhPwaInstallBar';
    bar.className = 'nh-pwa-install';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Instalar aplicacion');
    bar.innerHTML = `
      <div class="nh-pwa-install-inner">
        <img class="nh-pwa-install-icon" src="/imagenes/Logo/logosinfondo2.png" alt="" width="44" height="44"/>
        <div class="nh-pwa-install-body">
          <strong id="nhPwaInstallTitle">${config.title || 'Instala NuevaHabitat'}</strong>
          <p id="nhPwaInstallHint">${config.hint || 'Acceso rápido como app en tu pantalla de inicio'}</p>
          <ol id="nhPwaInstallSteps" class="nh-pwa-install-steps" hidden>
            <li>Pulsa <strong>Compartir</strong> en la barra del navegador</li>
            <li>Elige <strong>Añadir a pantalla de inicio</strong></li>
            <li>Confirma con <strong>Añadir</strong></li>
          </ol>
        </div>
        <div class="nh-pwa-install-actions">
          <button type="button" class="nh-pwa-install-btn" id="nhPwaInstallBtn">Instalar app</button>
          <button type="button" class="nh-pwa-install-dismiss" id="nhPwaInstallDismiss" aria-label="Cerrar">&#10005;</button>
        </div>
      </div>`;
    document.body.appendChild(bar);
    return bar;
  }

  function bindExistingBar(config) {
    const bar = document.querySelector(config.barSelector);
    if (!bar) return null;
    const btn = config.installBtnSelector ? document.querySelector(config.installBtnSelector) : bar.querySelector('button');
    const dismissBtn = config.dismissBtnSelector ? document.querySelector(config.dismissBtnSelector) : null;
    return { bar, btn, dismiss: dismissBtn, steps: bar.querySelector('.nh-pwa-install-steps') };
  }

  function showBar(ui, config) {
    const hint = ui.bar.querySelector('#nhPwaInstallHint') || document.getElementById('nhPwaInstallHint');
    const steps = ui.steps || document.getElementById('nhPwaInstallSteps');
    const btn = ui.btn;

    if (isIOS()) {
      if (hint) hint.textContent = 'Crea un acceso directo en tu iPhone o iPad:';
      if (steps) steps.hidden = false;
      if (btn) {
        btn.textContent = 'Entendido';
        btn.onclick = () => hideBar(ui, config);
      }
    } else if (deferredPrompt) {
      if (hint) hint.textContent = config.hint || 'Instala en tu pantalla de inicio con un toque';
      if (steps) steps.hidden = true;
      if (btn) {
        btn.textContent = 'Instalar app';
        btn.onclick = async () => {
          if (!deferredPrompt) return;
          deferredPrompt.prompt();
          await deferredPrompt.userChoice;
          deferredPrompt = null;
          hideBar(ui, config);
        };
      }
    } else {
      if (hint) hint.textContent = 'Menú del navegador → «Instalar aplicación» o «Añadir a pantalla de inicio»';
      if (steps) steps.hidden = true;
      if (btn) {
        btn.textContent = 'Entendido';
        btn.onclick = () => hideBar(ui, config);
      }
    }

    ui.bar.classList.add('show');
  }

  function hideBar(ui, config) {
    ui.bar.classList.remove('show');
    dismiss(config.storageKey);
  }

  async function registerSw(swUrl) {
    if (!swUrl || !('serviceWorker' in navigator)) return;
    try {
      await navigator.serviceWorker.register(swUrl, { scope: '/' });
    } catch (e) {
      console.warn('PWA SW:', e);
    }
  }

  function init(config) {
    if (!config || activeConfig) return;
    activeConfig = config;

    if (config.mobileOnly !== false && !isMobile()) return;
    if (isStandalone()) return;
    if (isDismissed(config.storageKey || 'nh_pwa_dismiss')) return;

    injectStyles();
    registerSw(config.swUrl);

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (activeConfig === config && uiRef) showBar(uiRef, config);
    });

    let uiRef = bindExistingBar(config);
    if (!uiRef || !uiRef.bar) {
      const bar = ensureBar(config);
      uiRef = {
        bar,
        btn: bar.querySelector('#nhPwaInstallBtn'),
        dismiss: bar.querySelector('#nhPwaInstallDismiss'),
        steps: bar.querySelector('#nhPwaInstallSteps'),
      };
    }

    if (uiRef.dismiss) {
      uiRef.dismiss.addEventListener('click', () => hideBar(uiRef, config));
    }

    requestAnimationFrame(() => {
      setTimeout(() => showBar(uiRef, config), config.delayMs ?? 800);
    });
  }

  window.nhPwaInstall = { init, isMobile, isStandalone, isIOS };
})();
