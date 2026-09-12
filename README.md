# Angular Learning Lab

Interview-prep / re-learning app on **Angular v20**: live demos paired with TypeScript + Template syntax on every card.

## Prerequisites

Need Node, NVM, and the Angular CLI first? Open the in-app guide:

**[/core/setup](http://localhost:4201/core/setup)** — Install Node · NVM · Angular CLI · run this lab

Quick path (once tools exist):

```bash
# Use Node 20 or 22 via NVM, then:
npm install
npm start
```

Open `http://localhost:4201/`.

For **Ag-Grid editable + SQLite** demos, run API + web together:

```bash
npm run start:all
```

Or two terminals: `npm run api` (port 3001) and `npm start` (port 4201). Angular proxies `/api` → the SQLite API.

Working branch: **`dev`** (keep `main` for stable releases).

## Navigation

**Header:** Home · **Basics ▾** · RxJS Lab · Users · **Core ▾** · **Material ▾** · **Third Party ▾** · **Routes ▾**

| Path | Topic |
|------|--------|
| `/` | Home (hub + progress checklist) |
| `/basics/*` | **JavaScript basics** — variables, functions, arrays, async, modules |
| `/core/setup` | **Start here** — Node, NVM, Angular CLI |
| `/rxjs` | RxJS lab (Steps 1–6) |
| `/users` | Users list + `?q=` filter |
| `/users/:id` | Resolver + switchMap posts + combineLatest |
| `/core/*` | Components, constructors, **lifecycle**, binding, pipes, directives, services, forms, HTTP, CD, signals, subjects, **NgRx**, interceptors, XSS |
| `/material/*` | Overview, forms, tables/grids, dialogs, navigation |
| `/third-party/*` | Bootstrap, Tailwind, Storybook, Ag-Grid Community |
| `/routes/*` | Nested shell, lazy, guards, protected, CanDeactivate |

Footer mirrors header (dropdowns pop **upward**). Shell width **80%**; only **Content** scrolls.

## Stack

Standalone components, `loadComponent`, signals, NgRx Store + SignalStore, functional guards, `inject()`, RxJS, Angular Material, `provideHttpClient(withInterceptors([...]))`.
