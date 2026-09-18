# Avanti — профиль клиента

Адаптивная страница по Figma: desktop 1440 × 1212 и mobile 390 × 1687.
Vue 3, Composition API, TypeScript, SCSS Modules, Vite и Pinia.

## Запуск

Node.js `^22.18.0 || >=24.12.0`, pnpm `11.7.0` (зафиксирован в packageManager).
Для CI и Vercel используйте Node.js 24.

```sh
pnpm install
pnpm dev
```

```sh
pnpm build
pnpm preview
pnpm test:unit --run
pnpm exec playwright install chromium firefox webkit
pnpm test:e2e
pnpm lint
```

Линтеры в `pnpm lint` исправляют код. Для проверки без изменений:
`pnpm exec eslint src e2e` и `pnpm exec oxlint src e2e`.
Исходные overrides Vue RC и TypeScript native bridge сохранены.
Sass — единственная добавленная зависимость; необязательный native watcher не требует build-скрипта.

## Архитектура

- `app`: запуск приложения и глобальные дизайн-токены.
- `pages/profile`: композиция страницы, состояние открытого диалога и события переходов.
- `widgets`: шапка, этапы, личные данные, безопасность, чеклист.
- `features`: редактирование профиля и подтверждение email.
- `entities/profile`: типы, Pinia store, mock-сервис и данные заявки.
- `shared`: общие UI-компоненты, оригинальные SVG/аватар из Figma и локальный Inter.

Публичные импорты проходят через `index.ts`. Компоненты используют `<script setup lang="ts">`
и SCSS Modules. Стили не зависят от UI-библиотек. Лицензия Inter находится рядом с файлом шрифта.

## Локальные сценарии

- Имя и email меняются во всех представлениях. После перезагрузки восстанавливаются данные макета.
- Диалоги поддерживают Escape, удержание фокуса и его возврат на кнопку открытия.
- Пароль проверяется на длину от 8 символов и совпадение подтверждения, нигде не сохраняется.
- Код подтверждения email: **123456**. Любой другой код вызывает ошибку.
- Поддерживаются ввод, вставка шести цифр, Backspace, стрелки и отправка Enter.
- Повторная отправка — локальная имитация с интервалом 30 секунд; письма не отправляются.
- Новый email сбрасывает верификацию. Этапы кредитной заявки остаются прежними.
- Чеклист сворачивается. Для отсутствующего IBAN отображается сообщение вместо копирования `-`.
- Home, Docs/Documenti, Profilo, помощь и переход к документам — согласованные заглушки.
  Страница эмитит `navigate(destination)` со значениями `home`, `documents`, `profile`, `assistance`.
  Роутер и вымышленные страницы не добавлены.

Для реального API реализуйте `ProfileService` вместо `profileService` в `entities/profile`:
`load`, `update`, `changePassword`, `verifyEmail`, `resendCode`. Проверки авторизации,
отправка писем и хранение данных выполняются будущим сервером.

## Адаптивность и визуальная проверка

От 1200 px — две колонки, ниже — одна. До 767 px — мобильная шапка и мобильные размеры.
Выделение Profilo на desktop и Home на mobile, а также повтор подписи `Tipo di documento`
сохранены намеренно по макетам.

E2E проверяют сценарии форм и ширины 320, 375, 390, 768, 1024, 1440 и 1920 px.
Скриншоты сохраняются в `output/playwright/` (исключено из git).
Оригинальные иконки и изображения находятся в проекте; временных сетевых URL Figma в runtime нет.

## Переиспользуемые компоненты после доработок

- `ProfileIcon` (`shared/ui/icons`) адаптирован из соседнего `test_orbitto`:
  `defineAsyncComponent`, кеш компонентов и один lazy `import.meta.glob`, без eager-импортов.
  SVG находятся в шаблоне DOM, размеры резервируются обёрткой, clipPath IDs уникальны.
  По умолчанию иконки декоративные; для смысловых задайте `decorative=false` и `aria-label`
  через prop `ariaLabel`. Варианты mobile переключаются на брейкпоинте 767 px.
- `ProfileLogo` содержит полный экспортированный SVG (знак и надпись контурами) и ссылку на `import.meta.env.BASE_URL`.
- `ProfileLink` принимает `href`, по умолчанию `#`: заглушка не прокручивает страницу;
  настоящий URL работает как обычная ссылка. Навигация шапки и breadcrumbs используют ссылки.
- `ProfileBreadcrumbs` принимает массив `{ label, href }`, последний элемент помечается `aria-current`.
- `ProfileImage` требует `src`, `alt`, `width`, `height` и предоставляет обёртку изображения.
- `ProfileBadge` поддерживает `soft`, `white`, `notification` и опциональную доступную подпись `label`.
- `ProfileCollapsible` предоставляет `v-model`, слот содержимого и слот `header` с
  `{ expanded, toggle, contentId }`. Анимация 180 ms отключается при reduced motion;
  скрытая область исключена из клавиатурной навигации через `inert`.
- `ProfileDialog` закрывается по Escape и клику вне прямоугольника диалога.
  Перетаскивание из содержимого на backdrop не закрывает модалку.

Завершённые этапы и результаты проверок сохранены в `IMPLEMENTATION_STATUS.md`.

## Структура вынесенных файлов

Внешние стили компонента: `styles/index.module.scss`; общий stylesheet: `app/styles/index.scss`.
Вынесенный TS-код компонента: `code/index.ts`; группы типов: `types/index.ts`.
Самостоятельные доменные store/API-модули сохраняют свои FSD-сегменты.
Favicon — `public/favicon.svg`, оригинальный знак Avanti без текста, в квадратном viewport.

## Проверка перед публикацией

```sh
pnpm install --frozen-lockfile
pnpm check
CI=true pnpm test:e2e
```

`check` проверяет границы FSD, запускает линтеры без изменения файлов, type-check, production build и unit-тесты.
E2E с `CI=true` проверяют собранный `dist` через preview, а не dev-сервер.
Публикуемый артефакт — содержимое `dist/`. Конфигурация Vercel находится в `vercel.json`.
При размещении в подпапке задайте нужный Vite base при сборке; логотип ведёт на главную относительно `import.meta.env.BASE_URL`.
Для обновлений размещайте HTML и новые assets согласованно, сохраняя старые hashed chunks
на время существующих сессий: иконки загружаются динамически.

Приложение готово к публикации как согласованный frontend с mock-сценариями.
Для работы с реальными аккаунтами требуется реализация ProfileService на серверном API.
Исходные Vue RC / TypeScript native bridge overrides сохранены; воспроизводимая установка
использует существующий lockfile без его пересоздания.


## Границы FSD

Направление импортов: `app → pages → widgets → features → entities → shared`.
Можно пропускать слои, но нельзя импортировать верхний слой или другой slice того же слоя.
Внутри slice используются относительные импорты; внешние потребители используют его `index.ts`.
`app` и `shared` состоят из сегментов, поэтому правило изоляции slices к ним не применяется.

- `ProfileUser` находится в `entities/profile/ui`, принимает `name`, `email`, `avatar`.
  Шапка передаёт данные из store; компонент не зависит от конкретного widget.
- `ProfileEditKind` принадлежит `features/edit-profile/types`, а не модели сущности.
- `IconName` экспортируется из `shared/ui`; `shared/assets` экспортирует только assets.
- `pnpm check:architecture` проверяет локальные статические импорты/reexports, literal dynamic
  imports, внешние SFC-файлы, направление слоёв, публичные API и циклы.
  Вычисляемые пути вроде `import.meta.glob` требуют отдельного ревью.
- При любой ошибке подтверждения OTP первая ячейка получает фокус и выделение содержимого.

## GitHub и Vercel

`.github/workflows/ci.yml` выполняет проверки при push, pull request и ручном запуске:
FSD, линтеры, типы, сборка, unit-тесты и Playwright в Chromium/Firefox/WebKit.
Собранный `dist` и отчёты тестов сохраняются как артефакты на 7 дней.
Workflow имеет только `contents: read`, секреты для проверок не нужны.

Для будущей публикации:

1. Разместите проект в GitHub и импортируйте репозиторий в Vercel через Git Integration.
2. Выберите корень проекта как Root Directory и Node.js 24.x; production branch — ваша основная ветка.
3. `vercel.json` задаёт Vite, установку через frozen lockfile, `pnpm check` и результат `dist`.
4. В GitHub сделайте `Quality checks` обязательной проверкой основной ветки.
   Vercel Git Integration запускает свои сборки независимо от GitHub Actions; для ожидания CI
   перед публикацией настройте deployment checks в Vercel, если они доступны вашему проекту.

Публикацией управляет интеграция Vercel с GitHub; дублирующего deploy через CLI в Actions нет.
Preview и production создаются после подключения репозитория в Vercel.
Токены и идентификаторы проекта в исходники не добавлены; `.vercel/` исключена из git.
Роутера пока нет, поэтому catch-all rewrite не нужен; при добавлении history routing
нужно отдельно добавить SPA fallback. Здесь конфиги подготовлены, удалённый деплой не выполнялся.


## Деплой на GitHub Pages

Репозиторий: `afonasiev/test_slicing_vue`.
Адрес после публикации: https://afonasiev.github.io/test_slicing_vue/.

В GitHub откройте **Settings → Pages → Build and deployment → Source: GitHub Actions**.
После сохранения файлов в ветке `main` workflow `.github/workflows/deploy.yml`
проверит код, соберёт и протестирует сайт в трёх браузерах, затем опубликует Pages.
Можно также запустить **Actions → Deploy GitHub Pages → Run workflow** на ветке `main`.
Секреты вручную создавать не нужно: используется стандартный `GITHUB_TOKEN`.

`pnpm build:pages` использует режим `github-pages` и base `/test_slicing_vue/`.
Обычная сборка для Vercel и dev-сервер сохраняют base `/`.
SVG chunks, CSS, шрифты, favicon и ссылка логотипа учитывают base автоматически.
При переименовании репозитория обновите путь в `vite.config.ts` и `PLAYWRIGHT_BASE_PATH`
в `deploy.yml`.

Локальная проверка Pages-сборки:

```sh
pnpm build:pages
CI=true PLAYWRIGHT_BASE_PATH=/test_slicing_vue/ pnpm test:e2e
```

Конфигурация подготовлена локально; workflow начнёт работу после push в GitHub
и включения Pages. GitHub Pages и Vercel — независимые варианты публикации.
