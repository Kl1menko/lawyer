import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const pages = {
  index: 'src/pages/index.html',
  pro: 'src/pages/pro.html',
  poslugy: 'src/pages/poslugy.html',
  kontakty: 'src/pages/kontakty.html',
  vidguky: 'src/pages/vidguky.html',
  privacy: 'src/pages/privacy.html',
  terms: 'src/pages/terms.html',
  '404': 'src/pages/404.html',
  'poslugy/simeyni-spory': 'src/pages/poslugy/simeyni-spory.html',
  'poslugy/alimenty': 'src/pages/poslugy/alimenty.html',
  'poslugy/rozirvannya-shlyubu': 'src/pages/poslugy/rozirvannya-shlyubu.html',
  'poslugy/podil-mayna-podruzhzhya': 'src/pages/poslugy/podil-mayna-podruzhzhya.html',
  'poslugy/spadkovi-spravy': 'src/pages/poslugy/spadkovi-spravy.html',
  'poslugy/maynovi-spory': 'src/pages/poslugy/maynovi-spory.html',
  'poslugy/trudovi-spory': 'src/pages/poslugy/trudovi-spory.html',
  'poslugy/styagnennya-borgu': 'src/pages/poslugy/styagnennya-borgu.html',
  'poslugy/vykonavche-provadzhennya': 'src/pages/poslugy/vykonavche-provadzhennya.html',
  'poslugy/oskarzhennya-vykonavchogo-napysu-notariusa':
    'src/pages/poslugy/oskarzhennya-vykonavchogo-napysu-notariusa.html',
  'poslugy/kreditni-zobovyazannya': 'src/pages/poslugy/kreditni-zobovyazannya.html',
  'poslugy/spory-z-derzhavnymy-organamy': 'src/pages/poslugy/spory-z-derzhavnymy-organamy.html'
};

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(
        Object.entries(pages).map(([key, file]) => [key, resolve(__dirname, file)])
      )
    }
  }
});
