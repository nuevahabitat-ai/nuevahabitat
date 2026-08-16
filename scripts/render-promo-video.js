/**
 * Renderiza promo/nuevahabitat-promo.html a MP4 (1080x1920, ~15s)
 * Uso: node scripts/render-promo-video.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const HTML = path.join(ROOT, 'promo', 'nuevahabitat-promo.html');
const OUT_DIR = path.join(ROOT, 'promo', 'output');
const DURATION_SEC = 15;
const FPS = 30;
const VIEWPORT = { width: 1080, height: 1920 };

async function main() {
  const puppeteer = require('puppeteer-core');
  const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

  const chromePaths = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
  ].filter(Boolean);

  const executablePath = chromePaths.find((p) => fs.existsSync(p));
  if (!executablePath) throw new Error('No se encontró Google Chrome.');

  const framesDir = path.join(OUT_DIR, 'frames');
  fs.mkdirSync(framesDir, { recursive: true });
  fs.readdirSync(framesDir).forEach((f) => fs.unlinkSync(path.join(framesDir, f)));

  const fileUrl = 'file:///' + HTML.replace(/\\/g, '/');
  console.log('Abriendo animación:', fileUrl);

  const browser = await puppeteer.launch({
    headless: true,
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 800));

  const totalFrames = DURATION_SEC * FPS;
  const frameDelay = 1000 / FPS;
  console.log(`Capturando ${totalFrames} frames (${FPS} fps, ${DURATION_SEC}s)…`);

  const start = Date.now();
  for (let i = 0; i < totalFrames; i++) {
    const name = `frame_${String(i).padStart(5, '0')}.png`;
    await page.screenshot({ path: path.join(framesDir, name), type: 'png' });
    const elapsed = Date.now() - start;
    const target = (i + 1) * frameDelay;
    const wait = Math.max(0, target - elapsed);
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    if (i % 30 === 0) console.log(`  ${Math.round((i / totalFrames) * 100)}%`);
  }

  await browser.close();

  const mp4Path = path.join(OUT_DIR, 'nuevahabitat-promo.mp4');
  const mp4Landscape = path.join(OUT_DIR, 'nuevahabitat-promo-16x9.mp4');

  console.log('Montando MP4 vertical…');
  execSync(
    `"${ffmpegPath}" -y -framerate ${FPS} -i "${path.join(framesDir, 'frame_%05d.png')}" -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p -movflags +faststart "${mp4Path}"`,
    { stdio: 'inherit' }
  );

  console.log('Generando versión horizontal 16:9…');
  execSync(
    `"${ffmpegPath}" -y -i "${mp4Path}" -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p -movflags +faststart "${mp4Landscape}"`,
    { stdio: 'inherit' }
  );

  fs.rmSync(framesDir, { recursive: true, force: true });

  const sizeMb = (fs.statSync(mp4Path).size / 1024 / 1024).toFixed(1);
  console.log('\n✓ Vídeo vertical (9:16):', mp4Path, `(${sizeMb} MB)`);
  console.log('✓ Vídeo horizontal (16:9):', mp4Landscape);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
