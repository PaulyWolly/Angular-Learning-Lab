# Migration: RxJS Demo → Angular-RxJs-Demo

Use this doc in a **new freestanding Angular project** named **`Angular-RxJs-Demo`** to rebuild the interactive RxJS learning lab that currently lives inside the resume app as a static page.

## Source of truth (current prototype)

| Item | Location |
|------|----------|
| Working prototype | `resume-app/public/rxjs-demo.html` |
| Local URL (resume app) | `http://localhost:4200/rxjs-demo.html` |
| Not linked from resume UI | By design (learning lab only) |

Copy this file into the new repo root as `MIGRATION-RxJs.md` (or keep it open while scaffolding).

---

## Product goal

Build a **visual, step-by-step RxJS tutorial** in Angular where the learner:

1. Sees a fixed small dataset (first **10 JSONPlaceholder users**).
2. Clicks **Run Step N** and watches staged narration of what happens.
3. Learns **Observable vs Observer vs Subscription**.
4. Practices **nested JSON traversal** (`u.address.city`, `u.company.name`, `u.address.geo.lat`).
5. Does **not** lose prior steps when new concepts are added (extend, don’t replace).

**Audience:** experienced UI/Angular developer re-learning RxJS with a tiny real API.

---

## Design principles (non-negotiable)

1. **Keep Steps 1–6 as durable UI sections** with Run buttons — never rip them out when explaining a new concept.
2. **Show process flow**, not only final JSON dumps (pipeline strip + narrate bar + staged panels).
3. **Answer concepts in chat/docs first**; only *add* to the UI when needed.
4. Prefer **Angular idioms** in the new app (`HttpClient`, `FormControl.valueChanges`, `async` pipe, `takeUntilDestroyed`) while preserving the same teaching story.
5. Visual learner first: cards, KEEP/DROP animation, live search board.

---

## Mental model to teach (from lab discussions)

| Concept | Teaching line |
|---------|----------------|
| Observable | Lazy **recipe** (like an uncalled function). Harmless until subscribed. |
| Observer | Object you pass to `subscribe`: `{ next, error, complete }`. |
| `pipe` | Conveyor belt that holds **operators**. |
| `map` / `filter` / `tap` / … | **Operators** (functions), not “pipes”. You put them *in* `pipe`. |
| Subscription | Active listening session. This is what you unsubscribe / tear down. |
| `complete` callback | You **register** it; the **producer** invokes it when done. Not the same as `ngOnDestroy`. |
| Cold HTTP | Completes after one response — usually no manual unsubscribe needed. |
| Long-lived UI streams | Use `async` pipe or `takeUntilDestroyed()` so teardown ties to component destroy. |

Modern style:

```ts
users$.pipe(map(...), filter(...)).subscribe({ next, error, complete });
```

Not old chained `.map().filter()` on the Observable prototype.

---

## Data source

- **URL:** `https://jsonplaceholder.typicode.com/users`
- **Use:** first 10 users (`data.slice(0, 10)` — API already returns 10).
- **Why users (not posts):** richer nested objects for learning traversal.

### TypeScript interfaces (create in new app)

```ts
export interface Geo {
  lat: string;
  lng: string;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

export interface SlimUser {
  id: number;
  name: string;
  city: string;      // from u.address.city
  company: string;   // from u.company.name
}
```

### JSON paths to display in UI

`u.id` · `u.name` · `u.email` · `u.website` · `u.address.city` · `u.address.street` · `u.address.geo.lat` · `u.company.name` · `u.company.catchPhrase`

---

## Scaffold the new project

```bash
# From parent folder of the new repo
npx @angular/cli@20 new Angular-RxJs-Demo --routing --style=scss --ssr=false
cd Angular-RxJs-Demo
npm start
```

Suggested stack:

- Angular **v20** (match resume app comfort)
- Standalone components
- `provideHttpClient()`
- RxJS (comes with Angular)

Optional later: signals + `toSignal` / `toObservable` as an advanced appendix.

---

## Suggested Angular folder structure

```text
src/app/
  models/user.model.ts
  services/users.service.ts          # users$ via HttpClient + shareReplay(1)
  pages/rxjs-lab/
    rxjs-lab.component.ts
    rxjs-lab.component.html
    rxjs-lab.component.scss
  components/
    concept-duo/                     # Observable vs Observer panels
    user-dataset/                    # cards + JSON path legend
    step-panel/                      # reusable step shell (optional)
  app.routes.ts                      # '' → RxjsLabComponent
  app.config.ts                      # provideHttpClient, provideRouter
```

Single main route is fine (`/`). No need for resume-style version switcher.

---

## Page layout (rebuild this order)

1. **Header** — title “RxJS — watch the data move”, short intro + link to JSONPlaceholder `/users`.
2. **Concept duo** — Observable (teal) | Observer (violet) cheat-sheet.
3. **Note** — Subscription / `unsubscribe` is the third piece (short callout).
4. **Dataset** — load users once; show cards (`name`, `email`, `address.city`, `company.name`) + path legend.
5. **Steps 1–6** — each with: step badge, title, why text, pipeline strip, narrate bar, Run button, staged output, code sample `<pre>`.

---

## Step specifications (must port)

### Step 1 — Observable + subscribe

- **Teach:** recipe vs subscribe; one emission = array of 10 users; Observer `next` then `complete`.
- **UI stages (timed):** A Setup → B subscribe starts → C Observer.next (list users) → D Observer.complete.
- **Code sample:**
  ```ts
  users$.subscribe({
    next: (users) => { /* ONE array */ },
    complete: () => { /* done */ },
  });
  ```

### Step 2 — `map` (nested → slim)

- **Teach:** operators live in `pipe`; Observer only sees slim objects.
- **Transform:**
  ```ts
  map((users) =>
    users.map((u) => ({
      id: u.id,
      name: u.name,
      city: u.address.city,
      company: u.company.name,
    })),
  )
  ```
- **UI:** before (nested sample) → explanation → after (flat sample).

### Step 3 — array filter on nested path

- **Teach:** still **one** array emission; JS `filter` inside RxJS `map`.
- **Rule:** `Number(u.address.geo.lat) < 0`.
- **UI:** animated KEEP/DROP list, then result array.
- **Path callout:** `u.address.geo.lat`.

### Step 4 — `tap`

- **Teach:** side effects; values unchanged by `tap`.
- **Pipe:** `tap` → `map(u => u.company.name)` → `tap` → subscribe.
- **UI:** peephole 1 / after map / peephole 2; also `console.log`.

### Step 5 — `from` + RxJS `filter`

- **Teach:** one array → many emissions; RxJS `filter` per item; `next` runs multiple times.
- **Pipe idea:** `switchMap(users => from(users))` then
  `filter(u => u.website.endsWith('.net') || u.website.endsWith('.org'))`.
- **UI:** animated PASS/BLOCK; kept list. (~280ms delay between items is fine.)

### Step 6 — live search

- **Teach:** `debounceTime(300)`, `distinctUntilChanged`, `switchMap` cancels stale work.
- **Match fields:** `name`, `address.city`, `company.name`.
- **UI live board:** Raw input | After debounce | switchMap | Matches.
- **Angular preference:** `FormControl` + `valueChanges` instead of `fromEvent`.

```ts
this.searchCtrl.valueChanges.pipe(
  map((raw) => (raw ?? '').trim().toLowerCase()),
  debounceTime(300),
  distinctUntilChanged(),
  switchMap((q) =>
    this.usersService.users$.pipe(
      map((users) => users.filter((u) => matchesQuery(u, q))),
    ),
  ),
  takeUntilDestroyed(),
);
```

Sample search strings: `Lebsack`, `Gwenborough`, `Romaguera`.

---

## Angular service pattern (replace hand-rolled fetch Observable)

Prototype used a custom `new Observable` + `fetch` + cache. In Angular:

```ts
@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);

  /** Shared cold→hot cache of first 10 users */
  readonly users$ = this.http.get<User[]>('https://jsonplaceholder.typicode.com/users').pipe(
    map((users) => users.slice(0, 10)),
    shareReplay(1),
  );
}
```

For Step 1 pedagogy you may still show a “recipe before subscribe” narrative; `HttpClient` Observables are also lazy until subscribed.

---

## Visual tokens (port from prototype CSS)

```scss
$bg: #f4f1eb;
$ink: #1c1917;
$muted: #57534e;
$card: #fffdf8;
$line: #d6d3d1;
$teal: #0f766e;
$teal-soft: #ccfbf1;
$amber: #b45309;
$amber-soft: #fef3c7;
$emit: #7c3aed;
$emit-soft: #ede9fe;
$violet: #6d28d9;
$code: #1e293b;
```

Key UI pieces: `.pipeline` / `.pipe-box` (source|op|out), `.narrate`, `.stage`, `.run`, `.user-card`, concept `.duo` panels.

---

## Implementation checklist

- [ ] Create `Angular-RxJs-Demo` with Angular CLI
- [ ] Add `User` models + `UsersService` (`HttpClient` + `shareReplay(1)`)
- [ ] Build `RxjsLabComponent` page matching layout order above
- [ ] Port Steps 1–6 with Run buttons + staged/animated output
- [ ] Concept duo + JSON path legend
- [ ] Step 6 via `FormControl.valueChanges` + `takeUntilDestroyed`
- [ ] Responsive: concept duo stacks on narrow screens
- [ ] README: how to run, what each step teaches
- [ ] (Optional) Copy `rxjs-demo.html` into `/reference` for comparison

---

## Acceptance criteria

1. Opening the app shows 10 user cards with nested city/company visible.
2. Each Step 1–5 has a Run button that narrates the process (not only dumps JSON).
3. Step 2 clearly shows nested → flat mapping.
4. Step 3 KEEP/DROP uses `address.geo.lat`.
5. Step 5 shows multiple `next` calls after `from`.
6. Step 6 search updates the live board and matches name/city/company.
7. Observable vs Observer cheat-sheet is visible without removing steps.
8. No dependency on the resume app.

---

## Out of scope (for v1)

- Auth, state libraries, AG Grid
- Hosting/Netlify (local `ng serve` is enough at first)
- Replacing the resume app’s `rxjs-demo.html` (can keep as reference)

---

## Quick reference — operators used

| Operator | Where |
|----------|--------|
| `map` | Steps 2–6 |
| `filter` (RxJS) | Step 5 |
| `filter` (Array) | Steps 3, 6 |
| `tap` | Steps 2, 4, 6 |
| `from` | Step 5 |
| `switchMap` | Steps 5–6 |
| `debounceTime` | Step 6 |
| `distinctUntilChanged` | Step 6 |
| `shareReplay` | Service (Angular) |
| `takeUntilDestroyed` | Step 6 (Angular) |

---

## Prompt starter for the new Cursor instance

Paste something like:

> Read `MIGRATION-RxJs.md` and scaffold/implement **Angular-RxJs-Demo** as specified. Preserve Steps 1–6 with Run buttons and staged narration. Use JSONPlaceholder `/users` (first 10). Prefer `HttpClient` + `FormControl.valueChanges`. Do not remove steps when adding concepts—only extend.

---

*Generated from the resume-app RxJS lab prototype for migration into a freestanding Angular teaching project.*
