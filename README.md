# Avanti

Адаптивный frontend по макетам Figma: оформление заявки, кабинет, документы,
договор, вывод средств, CPI, Euroclear и чат. Vue 3, TypeScript, Pinia,
Vue Router и SCSS Modules. Данные и операции имитируются локально.

## Запуск

Node.js `^22.18.0 || >=24.12.0`, pnpm `11.7.0`.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Для показа production-сборки:

```sh
pnpm build
pnpm preview
```

## Демонстрация

Посмотреть демо онлайн:

- [Vercel](https://test-slicing-vue.vercel.app/)
- [GitHub Pages](https://afonasiev.github.io/test_slicing_vue/)

Кнопка **«◈ Меню»** слева открывает сервисную панель на русском языке.
Она позволяет выбрать страницу и состояние, запустить/остановить симуляцию,
сбросить данные и скопировать ссылку. Пресеты сохраняются в URL через
`state` и `overlay`; введённые данные, подпись, файлы и сообщения — только в памяти.

- Код подтверждения email: **123456**; повторная отправка доступна через 30 секунд.
- IBAN автоматически группируется по четыре символа, принимает только латиницу и цифры;
  сумма кредита и OTP принимают только цифры.
- Пароль: от 8 символов, с подтверждением; пароль не сохраняется.
- Документы: JPG, PNG, WEBP, до 20 MB. Подпись поддерживает мышь и касание.
- Платежи, проверки и сообщения не отправляются во внешние сервисы.
- Telegram-контакт не задан в макете: кнопка сообщает об этом в демо.

| Маршрут | Экран |
| --- | --- |
| `/` | Home |
| `/application/amount` | Сумма и срок |
| `/application/personal-data` | Личные данные |
| `/application/check` | Проверка банков |
| `/application/approved` | Одобренное предложение |
| `/auth/register`, `/auth/login` | Регистрация и вход |
| `/profile` | Профиль и безопасность |
| `/documents`, `/documents/iban` | Документы и IBAN |
| `/contract` | Договор и подпись |
| `/withdrawal`, `/commission`, `/transfer` | Получение средств и перевод |
| `/certificate`, `/verification` | CPI и Euroclear |
| `/assistance` | Чат |

## Проверки

```sh
pnpm check                         # FSD, линтеры, типы, сборка, unit-тесты
pnpm exec playwright install chromium firefox webkit
pnpm test:e2e                      # браузерные сценарии и адаптивность
pnpm build:pages
pnpm check:pages                   # прямые URL без SPA fallback
```

`pnpm lint` исправляет замечания, `pnpm lint:check` только проверяет.
Браузерные отчёты: `playwright-report/`; снимки: `output/playwright/`.

## Архитектура и API

Слои FSD: `app → pages → widgets → features → entities → shared`.
Публичные импорты — через `index.ts`. Реестр маршрутов:
`src/shared/config/routes.json`; состояния и ссылки на Figma:
`src/app/demo/scenarios.json`.

Mock-сервисы находятся в `entities/*/api` и `entities/documents/service.ts`, UI-состояние — в моделях сущностей
и формах. При подключении backend замените реализации сервисов, сохранив
типизированные контракты. Авторизация, проверка документов и финансовые
операции требуют серверной реализации перед реальным использованием.
