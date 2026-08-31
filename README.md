# Angular Learning Lab

Interview-prep / re-learning app on **Angular v20**: live demos paired with TypeScript + Template syntax on every card.

## Run

```bash
npm install
npm start
```

Open `http://localhost:4200/`.

## Navigation

**Header:** Home · RxJS Lab · Users · **Core ▾** · **Routes ▾**

| Path | Topic |
|------|--------|
| `/` | Home (hub + progress checklist) |
| `/rxjs` | RxJS lab (Steps 1–6) |
| `/users` | Users list + `?q=` filter |
| `/users/:id` | Resolver + switchMap posts + combineLatest |
| `/core/*` | Binding, pipes, directives, services, forms, HTTP states, CD, signals, subjects, interceptors |
| `/routes/*` | Nested shell, lazy, guards, protected, CanDeactivate |

Footer mirrors header (Core / Routes menus pop **upward**). Shell width **80%**; only **Content** scrolls.

## Stack

Standalone components, `loadComponent`, signals, functional guards, `inject()`, RxJS, `provideHttpClient(withInterceptors([...]))`.
