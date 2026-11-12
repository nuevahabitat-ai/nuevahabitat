/**
 * Panel SEO: cluster «patrimonial» sin tocar el inline gigante de admin-panel.html.
 */
(function () {
  const CLUSTER = 'patrimonial';
  const META = {
    label: 'Patrimonial · empresas',
    tabTitle: 'Patrimonial por barrio y ciudad',
  };

  function injectStyles() {
    if (document.getElementById('nh-seo-patrimonial-styles')) return;
    const s = document.createElement('style');
    s.id = 'nh-seo-patrimonial-styles';
    s.textContent = `
.seo-cluster-badge--patrimonial{background:rgba(184,147,106,.2);color:#e8c99a}
#seo-st-patrimonial .seo-stat-num{color:var(--gold,#b8936a)}
`;
    document.head.appendChild(s);
  }

  function ensureSeoUi() {
    const stats = document.getElementById('seo-stats');
    if (stats && !document.getElementById('seo-st-patrimonial')) {
      const venta = document.getElementById('seo-st-ventaDigital');
      if (venta && venta.parentElement) {
        const div = document.createElement('div');
        div.className = 'seo-stat';
        div.innerHTML =
          '<div class="seo-stat-num" id="seo-st-patrimonial">–</div><div class="seo-stat-label">Patrimonial</div>';
        venta.parentElement.insertBefore(div, venta.nextSibling);
      }
    }
    const tabs = document.getElementById('seo-subtabs');
    if (tabs && !tabs.querySelector('[data-seo-cluster="patrimonial"]')) {
      const ventaBtn = tabs.querySelector('[data-seo-cluster="ventaDigital"]');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'adm-subtab';
      btn.dataset.seoCluster = CLUSTER;
      btn.onclick = function () {
        window.seoSubTab(CLUSTER);
      };
      btn.textContent = '🏢 Patrimonial';
      if (ventaBtn && ventaBtn.nextSibling) {
        tabs.insertBefore(btn, ventaBtn.nextSibling);
      } else if (ventaBtn) {
        tabs.appendChild(btn);
      } else {
        const allBtn = tabs.querySelector('[data-seo-cluster="all"]');
        if (allBtn) tabs.insertBefore(btn, allBtn);
        else tabs.appendChild(btn);
      }
    }
  }

  function patchMeta() {
    if (typeof window.SEO_CLUSTER_META === 'object' && window.SEO_CLUSTER_META) {
      window.SEO_CLUSTER_META[CLUSTER] = META;
    }
  }

  function patchBadge() {
    const orig = window.seoClusterBadge;
    if (typeof orig !== 'function' || orig.__nhPatrimonialPatched) return;
    function wrapped(cluster) {
      if (cluster === CLUSTER) {
        return '<span class="seo-cluster-badge seo-cluster-badge--patrimonial">Patrimonial</span>';
      }
      return orig(cluster);
    }
    wrapped.__nhPatrimonialPatched = true;
    window.seoClusterBadge = wrapped;
  }

  function patchLoadSeo() {
    const orig = window.loadSeoSection;
    if (typeof orig !== 'function' || orig.__nhPatrimonialPatched) return;
    async function wrapped() {
      patchMeta();
      injectStyles();
      ensureSeoUi();
      await orig.apply(this, arguments);
      try {
        const list =
          typeof window.getSeoLandingsList === 'function' ? window.getSeoLandingsList() : [];
        const n = list.filter(function (l) {
          return l.cluster === CLUSTER;
        }).length;
        const el = document.getElementById('seo-st-patrimonial');
        if (el) el.textContent = String(n);
      } catch (_) {}
    }
    wrapped.__nhPatrimonialPatched = true;
    window.loadSeoSection = wrapped;
  }

  patchMeta();
  injectStyles();
  patchBadge();
  patchLoadSeo();
  ensureSeoUi();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureSeoUi);
  }
})();
