import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CRUMB_CORE, CRUMB_HOME } from '../../../shared/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';
import { DeferHeavyPanelComponent } from './defer-heavy-panel.component';

@Component({
  selector: 'app-defer-lab',
  standalone: true,
  imports: [
    RouterLink,
    LessonBreadcrumbComponent,
    LessonSyntaxComponent,
    DeferHeavyPanelComponent,
  ],
  templateUrl: './defer-lab.component.html',
  styleUrl: './defer-lab.component.scss',
})
export class DeferLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_CORE, { label: '@defer' }];

  readonly interactionTs = `// Parent still lists the deferred component in imports —
// Angular splits it into a deferred chunk at build time.
imports: [DeferHeavyPanelComponent],`;

  readonly interactionTpl = `@defer (on interaction) {
  <app-defer-heavy-panel />
} @placeholder {
  <p>Click / focus this area to load the deferred chunk…</p>
} @loading (minimum 400ms) {
  <p>Loading deferred panel…</p>
} @error {
  <p>Could not load the deferred chunk.</p>
}`;

  readonly timerTpl = `@defer (on timer(2s)) {
  <app-defer-heavy-panel />
} @placeholder {
  <p>Auto-loads ~2 seconds after this block renders.</p>
} @loading (minimum 300ms) {
  <p>Fetching…</p>
}`;

  readonly timerTs = `// on timer(2s) — great for below-the-fold content that should
// prefetch shortly after first paint without waiting for scroll.`;

  readonly viewportTpl = `@defer (on viewport) {
  <app-defer-heavy-panel />
} @placeholder {
  <p class="tall-placeholder">Scroll me into view to trigger @defer…</p>
} @loading (minimum 300ms) {
  <p>Loading as you arrive…</p>
}`;

  readonly viewportTs = `// on viewport — IntersectionObserver under the hood.
// Ideal for long pages / carousels / “load when seen”.`;

  readonly compareTs = `// Route lazy (app.routes.ts)
{
  path: 'lazy',
  loadComponent: () => import('./lazy-lab/...').then(m => m.LazyLabComponent),
}

// Template @defer — stays on the SAME route; only a subtree loads later.
// Triggers: on idle | on viewport | on interaction | on hover | on timer(...) | when <expr>`;

  readonly compareTpl = `<!-- Same page, deferred island -->
@defer (on interaction) {
  <app-expensive-chart />
} @placeholder {
  <app-chart-skeleton />
}

<!-- Different page entirely → use loadComponent, not @defer -->
<a routerLink="/routes/lazy">Lazy route</a>`;

  readonly compareModal = `// Interview contrast
// - loadComponent / loadChildren → route-level code splitting (navigation)
// - @defer → template-level code splitting (same URL, delay a subtree)
// - Both use dynamic import chunks; both show up in Network when triggered
//
// Blocks you should know:
//   @defer (on …) { … }
//   @placeholder { … }   // before trigger
//   @loading { … }       // while chunk downloads (minimum / after)
//   @error { … }         // chunk failed
`;
}
