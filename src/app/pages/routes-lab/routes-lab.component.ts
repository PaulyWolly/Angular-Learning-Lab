import { Component } from '@angular/core';
import { CRUMB_HOME, CRUMB_ROUTES } from '../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../shared/lesson-syntax/lesson-syntax.component';

@Component({
  selector: 'app-routes-lab',
  standalone: true,
  imports: [LessonBreadcrumbComponent, LessonSyntaxComponent],
  templateUrl: './routes-lab.component.html',
  styleUrl: './routes-lab.component.scss',
})
export class RoutesLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_ROUTES, { label: 'Overview' }];

  readonly outletWhatTpl = `<!-- Placeholder: Angular inserts the activated route component here -->
<main class="site-content">
  <router-outlet />
</main>`;

  readonly outletWhatTs = `// A route is only a map: URL → component.
// <router-outlet> is the *slot* where that component appears.
//
// No outlet → nowhere for the page to render (blank / error).
// Extra outlets on leaf pages → usually a mistake (nothing nests into them).`;

  readonly appShellTpl = `<!-- app.html — chrome that should NEVER unmount on navigate -->
<div class="app-shell">
  <app-header />          <!-- stays -->
  <app-content />         <!-- owns the primary outlet -->
  <app-footer />          <!-- stays -->
</div>

<!-- content.component.html — THE app-wide outlet -->
<main id="main">
  <router-outlet />
</main>`;

  readonly appShellTs = `// Put ONE primary <router-outlet> in the layout that wraps every page
// (header / footer / toast shell).
//
// Home, RxJS, Core labs, Users… all swap *inside* that outlet.
// Header + footer are siblings of the outlet host — they do not remount.`;

  readonly componentlessTpl = `<!-- No RoutesShell-style template for /core -->
<!-- Parent path has no component → no place to put a second outlet -->

<!-- Setup / Forms / … render directly in the APP outlet -->
<main id="main">
  <router-outlet />   <!-- app-content: Core labs land here -->
</main>`;

  readonly componentlessTs = `// app.routes.ts — /core/* has children but NO shell component
{
  path: 'core',
  children: [
    { path: 'setup', loadComponent: () => import('...SetupLab') },
    { path: 'forms', loadComponent: () => import('...FormsLab') },
    // …
  ],
}

// Parent is "componentless": no loadComponent on path: 'core'.
// Children activate in the *nearest ancestor outlet* — here, the app shell.
//
// Use this when the section needs no shared UI chrome of its own
// (Basics, Core, Material, Third Party in this lab).`;

  readonly nestedShellTpl = `<!-- routes-shell.component.html — feature shell -->
<section class="routes-shell">
  <header>
    <!-- sub-nav stays while children swap -->
    <a routerLink="/routes">Overview</a>
    <a routerLink="/routes/lazy">Lazy</a>
  </header>

  <!-- SECOND outlet: only for this section's children -->
  <router-outlet />
</section>`;

  readonly nestedShellTs = `// Parent HAS a component + children → parent must host an outlet
{
  path: 'routes',
  loadComponent: () => import('...RoutesShell'),
  children: [
    { path: '', loadComponent: () => import('...RoutesLab') },
    { path: 'lazy', loadComponent: () => import('...LazyLab') },
    { path: 'guards', loadComponent: () => import('...GuardsLab') },
  ],
}

// URL /routes/lazy →
//   1) RoutesShell → app <router-outlet>
//   2) LazyLab     → shell's <router-outlet>
//
// Shell (and its sub-nav) stays mounted; only the child swaps.`;

  readonly whereRulesTpl = `<!-- 1. App layout — primary outlet (required) -->
<app-header />
<main><router-outlet /></main>
<app-footer />

<!-- 2. Feature shell — nested outlet (when section chrome must stay) -->
<section class="admin-shell">
  <nav>…</nav>
  <router-outlet />
</section>

<!-- 3. Leaf page — no outlet -->
<section class="lesson">…</section>`;

  readonly whereRulesTs = `// Decision: where do I put <router-outlet>?
//
// 1. App shell (required)
//    Layout with header/footer that wraps the whole app.
//    → one primary outlet for top-level pages.
//
// 2. Feature / section shell (optional)
//    Shared chrome for a URL family (/admin/*, /routes/*, /shop/*).
//    → parent route gets loadComponent + children
//    → parent template gets another <router-outlet>.
//
// 3. Componentless parent (optional)
//    Group URLs under a path prefix with NO shared chrome.
//    → children: [...] only; NO outlet on a missing parent template.
//    → pages render in the ancestor outlet (usually the app shell).
//
// 4. Leaf pages (almost never)
//    Don't put an outlet on a page that has no child routes.
//
// 5. Named outlets (advanced — skip until you need side panels)
//    <router-outlet name="aside" /> + { outlet: 'aside', ... }
//    Secondary routes; rare in most apps.`;

  readonly linkTpl = `<a
  routerLink="/routes/lazy"
  routerLinkActive="is-active"
>
  Lazy Loading
</a>`;

  readonly linkTs = `// Component imports RouterLink + RouterLinkActive
imports: [RouterLink, RouterLinkActive]

// Prefer routerLink over href — SPA navigate, no full page reload.`;
}
