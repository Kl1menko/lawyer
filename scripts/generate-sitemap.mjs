import { mkdir, readFile, readdir, rename, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join, posix, relative } from 'node:path';

const SITE_URL = 'https://advokatklimenko.com.ua';
const pages = [
  { path: '/', file: 'src/pages/index.html' },
  { path: '/pro.html', file: 'src/pages/pro.html' },
  { path: '/poslugy.html', file: 'src/pages/poslugy.html' },
  { path: '/kontakty.html', file: 'src/pages/kontakty.html' },
  { path: '/vidguky.html', file: 'src/pages/vidguky.html' },
  { path: '/privacy.html', file: 'src/pages/privacy.html' },
  { path: '/terms.html', file: 'src/pages/terms.html' },
  { path: '/poslugy/simeyni-spory.html', file: 'src/pages/poslugy/simeyni-spory.html' },
  { path: '/poslugy/pensiyni-spravy.html', file: 'src/pages/poslugy/pensiyni-spravy.html' },
  { path: '/poslugy/alimenty.html', file: 'src/pages/poslugy/alimenty.html' },
  { path: '/poslugy/rozirvannya-shlyubu.html', file: 'src/pages/poslugy/rozirvannya-shlyubu.html' },
  { path: '/poslugy/podil-mayna-podruzhzhya.html', file: 'src/pages/poslugy/podil-mayna-podruzhzhya.html' },
  { path: '/poslugy/spadkovi-spravy.html', file: 'src/pages/poslugy/spadkovi-spravy.html' },
  { path: '/poslugy/maynovi-spory.html', file: 'src/pages/poslugy/maynovi-spory.html' },
  { path: '/poslugy/trudovi-spory.html', file: 'src/pages/poslugy/trudovi-spory.html' },
  { path: '/poslugy/styagnennya-borgu.html', file: 'src/pages/poslugy/styagnennya-borgu.html' },
  { path: '/poslugy/vykonavche-provadzhennya.html', file: 'src/pages/poslugy/vykonavche-provadzhennya.html' },
  {
    path: '/poslugy/oskarzhennya-vykonavchogo-napysu-notariusa.html',
    file: 'src/pages/poslugy/oskarzhennya-vykonavchogo-napysu-notariusa.html'
  },
  { path: '/poslugy/kreditni-zobovyazannya.html', file: 'src/pages/poslugy/kreditni-zobovyazannya.html' },
  { path: '/poslugy/spory-z-derzhavnymy-organamy.html', file: 'src/pages/poslugy/spory-z-derzhavnymy-organamy.html' }
];

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

function rewriteLocalUrl(filePath, localUrl) {
  if (!localUrl.startsWith('/') || localUrl.startsWith('//')) return localUrl;

  const [pathnameWithQuery, hash = ''] = localUrl.split('#');
  const [pathname, query = ''] = pathnameWithQuery.split('?');
  const pageDir = dirname(relative(distDir, filePath));
  const fromDir = pageDir === '.' ? '' : pageDir.split('\\').join('/');
  const targetPath = pathname.slice(1);
  const relativePath = posix.relative(fromDir || '.', targetPath);
  const normalizedPath = relativePath || '.';
  const nextQuery = query ? `?${query}` : '';
  const nextHash = hash ? `#${hash}` : '';

  return `${normalizedPath}${nextQuery}${nextHash}`;
}

async function rewriteLocalHtmlPaths() {
  async function walk(currentDir) {
    const entries = await readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await walk(entryPath);
        continue;
      }

      if (!entry.name.endsWith('.html')) continue;

      let html = await readFile(entryPath, 'utf8');

      html = html.replace(
        /\b(href|src|poster|action)=("([^"]+)"|'([^']+)')/g,
        (fullMatch, attrName, quotedValue, doubleQuotedValue, singleQuotedValue) => {
          const quote = quotedValue[0];
          const value = doubleQuotedValue ?? singleQuotedValue ?? '';
          const nextValue = rewriteLocalUrl(entryPath, value);
          return `${attrName}=${quote}${nextValue}${quote}`;
        }
      );

      html = html.replace(
        /\bcontent=("0;\s*url=\/([^"]+)"|'0;\s*url=\/([^']+)')/g,
        (fullMatch, quotedValue, doubleQuotedValue, singleQuotedValue) => {
          const quote = quotedValue[0];
          const value = doubleQuotedValue ?? singleQuotedValue ?? '';
          const nextValue = rewriteLocalUrl(entryPath, `/${value}`);
          return `content=${quote}0; url=${nextValue}${quote}`;
        }
      );

      await writeFile(entryPath, html, 'utf8');
    }
  }

  await walk(distDir);
}

async function getLastMod(filePath) {
  try {
    const fileStat = await stat(join(process.cwd(), filePath));
    return fileStat.mtime.toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

const xmlEntries = await Promise.all(
  pages.map(async ({ path, file }) => {
    const lastmod = await getLastMod(file);
    return `  <url><loc>${new URL(path, SITE_URL).toString()}</loc><lastmod>${lastmod}</lastmod></url>`;
  })
);

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlEntries.join('\n')}\n</urlset>\n`;

await flattenHtmlEntries();
await rewriteLocalHtmlPaths();

const distPath = join(distDir, 'sitemap.xml');
await mkdir(dirname(distPath), { recursive: true });
await writeFile(distPath, xml, 'utf8');

console.log(`sitemap.xml generated: ${distPath}`);
