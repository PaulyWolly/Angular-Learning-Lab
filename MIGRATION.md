# Angular Learning Lab — Agent Briefing

**Audience:** the AI assistant in the new Cursor workspace **`Angular-Learning-Lab`**.  
**Purpose:** understand what this app is, what is already built, how we teach, and how to extend it without breaking the design.

This file is **not** a user tutorial. It is context for continuing work in a new IDE instance after migrating from `Angular-RxJs-Demo`.

Older history of the RxJS-only origin story: `MIGRATION-RxJs.md` (keep; do not treat as the full-app source of truth).

---

## Who you are helping

An experienced UI/Angular developer building a **freestanding interview-prep / re-learning lab** on **Angular v20**. Prefer modern idioms: standalone components, `loadComponent`, signals, functional guards, `inject()`, RxJS `pipe` operators.

---

## What this product is

**Angular Learning Lab** — interactive lessons where each card shows:

1. A **live demo** the learner can click/type  
2. **TypeScript (class)** syntax — fields/methods that power the demo  
3. **Template (HTML)** syntax — how the view binds to those fields  
4. Optional **Full TypeScript** / **Full HTML Template** modals for longer snippets (`app-code-modal`)

Global **toasts** (bottom-right, × to dismiss) give feedback on HTTP, auth, forms, and guard blocks.

**Data:** JSONPlaceholder — `users` and `posts`.

---

## Non-negotiable conventions

When adding or changing labs, follow these unless the user explicitly overrides them:

| Rule | Detail |
|------|--------|
| Teaching pattern | Demo + TypeScript + Template **on the same card** — no orphan “cheat sheet” at the bottom |
| Syntax order | Show **TypeScript first**, then Template (class fields → what the template reads) |
| Shared syntax UI | Use `app-lesson-syntax` (`shared/lesson-syntax/`) |
| Routes | Prefer `loadComponent: () => import(...).then(m => m.X)` — lazy by default |
| Shell | Header, content, footer share `--shell-width: 80%` and `--shell-max: 90rem` — **same left edge** |
| Scroll | Content area uses `scrollbar-gutter: stable` so Home and tall pages stay aligned |
| Toasts | Use `ToastService` for success / error / info — don’t fail silently on network/auth/forms |
| Look | Cream / teal / amber tokens in `styles.scss` — avoid purple-glow “AI default” look |
| Brand | Header: Angular shield (`public/angular-logo.svg`) + “Angular / Learning Lab” |

**RxJS lab special rule:** keep Steps 1–6 as durable Run-button sections — extend, don’t rip out when adding concepts (`MIGRATION-RxJs.md`).

---

## Stack snapshot

- Angular **^20.3**, RxJS **~7.8**, Zone.js, SCSS  
- Standalone components throughout  
- `provideHttpClient()` in `app.config.ts`  
- Package / project renamed to **`angular-learning-lab`** / **`Angular-Learning-Lab`**.

---

## Architecture map

```
app-shell (app.html)
├── app-header          nav + demo auth toggle + logo
├── app-content         <router-outlet> (scrollable)
├── app-footer          quick links
└── app-toast-container fixed bottom-right
```

| Area | Path | Role |
|------|------|------|
| Routes | `app/app.routes.ts` | All feature routes |
| Nav config | `app/core/nav/nav-links.ts` | Header dropdowns + footer links |
| Auth demo | `app/core/auth/demo-auth.service.ts` | `loggedIn` signal; login/logout toasts + redirect |
| Guard | `app/core/guards/demo-auth.guard.ts` | Protects `/routes/protected` |
| CanDeactivate | `app/core/guards/unsaved-changes.guard.ts` | Protects leave on `/routes/deactivate` |
| Resolver | `app/core/resolvers/user.resolver.ts` | Prefetches user for `/users/:id` |
| Users API | `app/services/users.service.ts` | `users$`, `getUser`, `getPostsByUser` |
| Models | `app/models/` | `user.model.ts`, `post.model.ts` |
| Lesson chrome | `app/shared/lesson-syntax/` | Template + TS blocks |
| Toasts | `app/shared/toast/` | Service + container UI |
| Core shared SCSS | `app/pages/core/_lesson-shared.scss` | Cards, buttons, fields |

---

## Routes that exist today

| URL | What it teaches |
|-----|-----------------|
| `/` | Home hub cards |
| `/rxjs` | Observable, operators, async pipe, live search |
| `/core/components` | Component anatomy, standalone + `imports`, `input()`, `output()`, `ng-content` |
| `/core/binding` | Interpolation, property, event, two-way |
| `/core/templates` | `templateUrl` vs inline backtick `template` |
| `/core/defer` | `@defer` / `@placeholder` / `@loading` vs `loadComponent` |
| `/core/pipes` | Built-in + custom `titleCase` |
| `/core/directives` | `@if` / `@for`, ngClass object vs ternary, `appHighlight`, `appModulusColor`, `*appUnless` |
| `/core/services` | `inject()`, `providedIn: 'root'` |
| `/core/forms` | Reactive + template-driven **tabs** |
| `/core/http-states` | loading / empty / error / retry UI states |
| `/core/change-detection` | Default vs `OnPush` check counters |
| `/core/signals` | `signal` / `computed` / `effect` |
| `/core/subjects` | **Subjects · BehaviorSubject** — event bus + late-join replay |
| `/core/interceptors` | HTTP interceptor + demo auth header |
| `/core/xss` | XSS · escaping, `[innerHTML]`, DomSanitizer |
| `/users` | List + **`?q=`** synced filter → navigate to detail |
| `/users/:id` | Resolver + **`switchMap`** posts + **`combineLatest`** summary |
| `/routes` | Nested routing overview (inside shell) |
| `/routes/lazy` | Route lazy load + on-demand `import()` |
| `/routes/guards` | CanActivate + demo login |
| `/routes/protected` | Guard-gated page |
| `/routes/deactivate` | CanDeactivate + unsaved form |

`/routes/*` is wrapped in **`RoutesShellComponent`**: parent stays mounted; children render in `<router-outlet>`; sub-nav for Overview / Lazy / Guards / Protected / Deactivate.

---

## Important behaviors already implemented

### Auth + guard toasts

- **Logged out** + open Protected → **error toast every attempt**, redirect to Guards (`?blocked=protected`).  
- **Logged in** + enter Protected → **success toast once** per login (`notifyProtectedAllowedOnce`).  
- Further Protected visits while still logged in → **no** repeat success toast.  
- **Logout** clears the once-flag; if on Protected, navigate to Guards + info toast. Elsewhere, logout stays on the current page.

### Binding lab teaching nuance

Card 1 (interpolation) is **one-way** `{{ displayName }}`. The input uses `[value]` + `(input)` so learners aren’t taught that interpolation alone is two-way. True `[(ngModel)]` is card 4.

Card 2 warns: boolean DOM props like **`disabled`** need **`[disabled]="flag"`**, not `disabled="{{ flag }}"` — the string `"false"` still leaves a present HTML boolean attribute, so the control stays disabled.

### `appHighlight` gotcha

Bare `appHighlight` binds `""` and would wipe the default color. Directive **transforms** blank → `var(--teal-soft)`. Amber `[appHighlight]="'#fef3c7'"` works as an input binding.

### Teaching convention — show the wiring

Live demos must match the syntax blocks. If the learner clicks **+1/−1**, toggles a checkbox, or binds `[(ngModel)]`, those controls and event handlers belong in the Template (and related methods in TypeScript). Do not show only the “interesting” fragment — show how the value on screen actually changes.

### Custom directives extras

- **ngClass stress point:** `{ }` = object (`className: boolean`); ternary returns a string → **no braces**. Same live `modNumber % 5` demo side-by-side.
- `appModulusColor` — attribute directive colors a number **teal/red** from `n % 2` (`HostBinding` + `effect`).  
- `*appUnless` — custom structural directive (`TemplateRef` + `ViewContainerRef`); opposite of `@if`.

### Users HTTP

`users$` uses `shareReplay(1)` and toasts on first successful connect / failure. Detail page toasts when posts load (or fail).

### User resolver + query search

- `/users/:id` uses **`userResolver`** (`resolve: { user }`) so the user is in `route.data` before activate; posts stay on **`switchMap`**.  
- `runGuardsAndResolvers: 'paramsOrQueryParamsChange'` so jumping `#1` → `#2` re-resolves.  
- `/users` search control syncs with **`?q=`** (debounce → navigate; queryParamMap → filter; back/forward reseeds input).

### CanDeactivate

- `/routes/deactivate` — dirty form → `window.confirm`; Cancel → info toast + stay; OK → success toast + leave; Save → `markAsPristine` so leave is free.

### Forms tabs

- `/core/forms` has **Reactive** and **Template-driven** tabs (same fields for comparison). Reactive uses `FormGroup`; template uses `NgForm` + `[(ngModel)]` + template validators.

### HTTP UI states

- `/core/http-states` — discriminated union (`idle` / `loading` / `success` / `empty` / `error`) with Load OK / empty / fail + Retry toasts.

### Change detection

- `/core/change-detection` — Default vs OnPush children with `ngDoCheck` counters; parent tick, new input refs, in-place mutation, `markForCheck`.

### Subjects event bus

- `/core/subjects` — `LabEventBusService` wraps a `Subject` with `asObservable()`; multiple panels publish, one feed + late subscriber.

### combineLatest (Users detail)

- `/users/:id` summary card: `combineLatest([user$, posts$])` → name / city / post count / top title.

### HTTP interceptor

- `demoAuthInterceptor` registered via `provideHttpClient(withInterceptors([...]))`. When logged in, clones request with `Authorization: Bearer demo-lab-token`. `/core/interceptors` probes the last outgoing request.

### Shell alignment

Do **not** use hacks like `margin-left: -15px` on the header. Keep header/content/footer on the same `--shell-width` and rely on `scrollbar-gutter: stable`.

### Lesson breadcrumbs

Lesson pages use **`app-lesson-breadcrumb`** (`shared/lesson-breadcrumb/`) — active trail (e.g. Home · Core · Forms). Ancestors link; current crumb is plain text. Presets in `crumb-presets.ts`.

### Footer nav

Footer mirrors header **`NAV_ITEMS`**: Home / RxJS / Users as links; **Core** and **Routes** are hover menus that **pop upward** (click also toggles for touch).

### Syntax copy + lab progress

- `app-lesson-syntax` has **Copy** on TypeScript and Template blocks (clipboard + toast).  
- Optional **Full TypeScript** (`typescriptModal`) always pairs with **Full HTML Template** (uses `templateModal` when set, otherwise the inline `templateCode`). Titles like `Foo — Full TypeScript` auto-become `Foo — Full HTML Template`.
- Home **Progress** fold — checklist from `NAV_ITEMS`, persisted in `localStorage` (`LabProgressService`).

---

## File inventory (high level)

```
src/app/
  pages/
    home/
    rxjs-lab/              (+ step complete-code helpers)
    core/
      binding-lab/ templates-lab/ defer-lab/ pipes-lab/ directives-lab/ services-lab/
      forms-lab/ http-states-lab/ change-detection-lab/ signals-lab/
      subjects-lab/ interceptors-lab/ xss-lab/
      _lesson-shared.scss
    users-lab/             list (?q=) + users-detail (resolver + switchMap + combineLatest)
    routes-shell/          parent for /routes/*
    routes-lab/ lazy-lab/ guards-lab/ protected-lab/ deactivate-lab/
  components/              step-panel, code-modal, concept-duo,
                           user-dataset, async-pipe-lesson
  shared/                  toast, lesson-syntax, lesson-breadcrumb, highlight, titleCase, counter, lab-event-bus, lab-progress
  core/                    auth, guards, resolvers, http (interceptor + probe), nav
  layout/                  header, content, footer
  services/ models/
public/angular-logo.svg
src/styles.scss
```

---

## Backlog (suggested next work)

Use when the user asks “what next?” or to implement without re-brainstorming:

**Strong next labs**

1. ~~Template-driven forms card (contrast with `/core/forms`)~~ → Forms page tabs  
2. ~~HTTP states lab (loading / error / empty / retry)~~ → `/core/http-states`  
3. ~~Change detection (Default vs `OnPush`)~~ → `/core/change-detection`  
4. Lifecycle vs `async` / `takeUntilDestroyed`  
4b. ~~Templates · `templateUrl` vs inline backticks~~ → `/core/templates`  
4c. ~~`@defer` template lazy loading~~ → `/core/defer`  
5. ~~`CanDeactivate` unsaved-form guard~~ → `/routes/deactivate`  
6. ~~Resolvers for `/users/:id`~~ → `userResolver`  
7. ~~Query-params synced search (`?q=`)~~ → `/users?q=`  
8. ~~Subjects vs Observables mini event bus~~ → `/core/subjects`  
9. ~~`combineLatest` user + posts~~ → users detail summary  
10. ~~HTTP interceptor + demo auth header~~ → `/core/interceptors`  
10b. ~~XSS safety (escape / sanitize / bypass)~~ → `/core/xss`  
10c. ~~Angular Material suite~~ → `/material` (Overview & Setup, Form Controls, Tables & Grids, Dialogs & Feedback, Navigation & Menus)  

**UX polish**

11. ~~Copy-to-clipboard on Syntax blocks~~ → `app-lesson-syntax` Copy buttons  
12. ~~Lab progress checklist (`localStorage`)~~ → Home Progress fold  
13. “Break it / Fix it” mode  
14. Favorites (persist user ids)  

**Repo hygiene in this workspace**

15. ~~Rename package / `angular.json` → `Angular-Learning-Lab`~~  
16. ~~README title → Angular Learning Lab~~  

---

## How to add a new lab (checklist)

1. Create `pages/.../foo-lab.component.{ts,html,scss}` — `@use` lesson-shared where appropriate.  
2. Add `loadComponent` route in `app.routes.ts`.  
3. Add links in `core/nav/nav-links.ts` (header group + footer).  
4. Add a Home card if it’s a first-class destination.  
5. Every teaching card: live demo + `app-lesson-syntax` (TS + Template).  
6. Wire `ToastService` for meaningful success/failure.  
7. Keep copy interview-oriented and concise.

---

## Smoke checks after big changes

- Logo / nav left edge matches content (80% shell)  
- Forms invalid/valid toasts  
- Signals update computed + effect log  
- `/users/:id` rapid id switches (switchMap + resolver re-run) + combineLatest summary  
- Subjects bus: publish from A/B, feed updates  
- Interceptors: logged in → Authorization header on Fire GET  
- `/users?q=leanne` filters list and updates URL  
- Logged out Protected → toast every click  
- Logged in Protected → toast once until logout  
- Dirty Deactivate form → confirm; Save then leave freely  
- Highlight default teal on hover  

---

## Tone when working here

- Prefer **editing existing labs** over large rewrites.  
- Explain Angular concepts the way the UI does: **class field ↔ template binding**.  
- When the user asks for new features, match the **card + syntax** pattern automatically.  
- Ask before destructive git operations or mass renames unless they already requested them.

---

*Briefing last updated August 2026 — covers Forms tabs, HTTP states, OnPush, Signals, Subjects, Interceptors, Users capstone, routes shell, breadcrumbs, footer upward menus, syntax Copy, Home progress checklist, package rename to Angular-Learning-Lab.*
