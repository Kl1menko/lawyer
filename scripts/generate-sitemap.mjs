import { mkdir, readdir, rename, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const SITE_URL = 'https://example.com';
const pages = [
  '/',
  '/pro.html',
  '/poslugy.html',
  '/kontakty.html',
  '/vidguky.html',
  '/privacy.html',
  '/terms.html',
  '/404.html',
  '/poslugy/simeyni-spory.html',
  '/poslugy/spadkovi-spravy.html',
  '/poslugy/maynovi-spory.html',
  '/poslugy/trudovi-spory.html',
  '/poslugy/styagnennya-borgu.html'
];

const today = new Date().toISOString().slice(0, 10);
const distDir = join(process.cwd(), 'dist');

async function flattenHtmlEntries() {
  const sourceRoot = join(distDir, 'src', 'pages');
  try {
    const sourceStat = await stat(sourceRoot);
    if (!sourceStat.isDirectory()) return;
  } catch {
    return;
  }

  async function walkAndMove(currentDir, relativeDir = '') {
    const entries = await readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const sourcePath = join(currentDir, entry.name);
      const nextRelative = relativeDir ? join(relativeDir, entry.name) : entry.name;

      if (entry.isDirectory()) {
        await walkAndMove(sourcePath, nextRelative);
        continue;
      }

      if (!entry.name.endsWith('.html')) continue;

      const targetPath = join(distDir, nextRelative);
      await mkdir(dirname(targetPath), { recursive: true });
      await rename(sourcePath, targetPath);
    }
  }

  await walkAndMove(sourceRoot);
  await rm(join(distDir, 'src'), { recursive: true, force: true });
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
  .map(
    (path) => `  <url><loc>${new URL(path, SITE_URL).toString()}</loc><lastmod>${today}</lastmod></url>`
  )
  .join('\n')}\n</urlset>\n`;

await flattenHtmlEntries();

const distPath = join(distDir, 'sitemap.xml');
await mkdir(dirname(distPath), { recursive: true });
await writeFile(distPath, xml, 'utf8');

console.log(`sitemap.xml generated: ${distPath}`);
