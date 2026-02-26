# PROJECT_STATUS.md

## 1. Поточний стан (коротко)
- Проєкт: SEO-first статичний сайт адвоката Клименко Ірини Федорівни (Ладижин)
- Стек: Vite + Vanilla JS + custom CSS (multi-page)
- Домен у проєкті: `http://www.advokatklimenko.com.ua`
- Репозиторій: `https://github.com/Kl1menko/lawyer`
- Статус: готовий до передрелізної перевірки / деплою (є кілька важливих доробок)

## 2. Що вже виконано
- Зібрано multi-page структуру сторінок (`src/pages/*.html`, `src/pages/poslugy/*.html`)
- Налаштовано Vite multi-page build + post-build flatten
- Реалізовано `robots.txt` + генерацію `sitemap.xml`
- Додано SEO на сторінки: `title`, `description`, canonical, OG/Twitter
- Додано JSON-LD: `WebSite`, `LegalService`, `Person`, `Service`, `FAQPage`, `BreadcrumbList`
- Реалізовано форму звернення без бекенду (`mailto` через JS + валідація)
- Оновлено контакти/бренд:
  - Клименко Ірина Федорівна
  - `+38 (067) 964-95-15`
  - `klimenko74@meta.ua`
  - `вул. Процишина, 10г, м. Ладижин`
- Зроблено великий UI-рефайн головної та мобільної версії:
  - hero
  - мобільне меню + CTA
  - картки послуг
  - відгуки
  - FAQ
  - таймлайн
  - блок з відео
  - футер
- Проєкт закомічено і запушено в GitHub (`main`)

## 3. Що треба доробити (по терміновості)

### P0 — критично перед публікацією
- Додати `public/og-cover.jpg` (щоб OG/Twitter preview не були битими)
- Перевірити деплой на домені `advokatklimenko.com.ua`:
  - canonical
  - `robots.txt`
  - `sitemap.xml`
  - 404
- Після підключення SSL змінити домен у проєкті з `http://` на `https://`

### P1 — важливо для довіри та конверсії
- Замінити демо-відгуки на реальні (узгоджені)
- Фінально вичитати `privacy.html` та `terms.html` (юридичні формулювання)
- Перевірити всі тексти на консистентність (терміни: "пошта", "консультація", CTA)

### P2 — SEO-масштабування (наступний етап)
- Додати сторінку `vartist-posluh.html`
- Додати підпослуги (рівень 2) в межах категорій:
  - напр. `alimenty`, `rozluchennya`, `podil-mayna`
- Додати блог (`/blog.html`) + перші статті

## 4. Швидкий реліз-чекліст
- `npm install`
- `npm run build`
- Перевірити `dist/sitemap.xml`
- Перевірити `dist/robots.txt`
- Перевірити OG preview (після додавання `og-cover.jpg`)
- Перевірити мобільне меню/CTA/форму на реальному домені

## 5. Важливі файли
- `schema.md` — журнал і схема проєкту
- `src/styles/main.css` — основні стилі
- `src/js/main.js` — меню, reveal, CTA
- `src/js/form.js` — форма звернення (mailto)
- `scripts/generate-sitemap.mjs` — sitemap + flatten
- `public/robots.txt`

## 6. Примітки
- Слово `email` у видимих текстах здебільшого замінено на `пошта`; технічні поля (`mailto`, JSON-LD `email`, `data-email`) лишаються англійськими — це правильно.
- Якщо домен почне працювати з SSL, зробити глобальну заміну `http://www.advokatklimenko.com.ua` -> `https://www.advokatklimenko.com.ua`.
