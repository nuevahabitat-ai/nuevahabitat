const urls = process.argv.slice(2);
if (!urls.length) {
  console.error('Usage: node scripts/validate-jsonld.js <url> [...]');
  process.exit(1);
}

const REQUIRED = ['RealEstateAgent', 'FAQPage', 'BreadcrumbList'];

async function check(url) {
  const res = await fetch(url);
  const html = await res.text();
  const m = html.match(/id="nh-seo-static">([\s\S]*?)<\/script>/);
  if (!m) {
    console.log(url, 'FAIL — no nh-seo-static JSON-LD block');
    return false;
  }
  let data;
  try {
    data = JSON.parse(m[1]);
  } catch (e) {
    console.log(url, 'FAIL — invalid JSON:', e.message);
    return false;
  }
  const types = [];
  (Array.isArray(data) ? data : [data]).forEach((node) => {
    if (node['@type']) types.push(node['@type']);
  });
  const missing = REQUIRED.filter((t) => !types.includes(t));
  if (missing.length) {
    console.log(url, 'FAIL — missing types:', missing.join(', '));
    console.log('  found:', types.join(', '));
    return false;
  }
  console.log(url, 'OK —', types.join(', '));
  return true;
}

(async () => {
  let ok = true;
  for (const url of urls) {
    if (!(await check(url))) ok = false;
  }
  process.exit(ok ? 0 : 1);
})();
