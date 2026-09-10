import { Component } from '@angular/core';
import { CRUMB_HOME, CRUMB_THIRD_PARTY } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';

@Component({
  selector: 'app-bootstrap-lab',
  standalone: true,
  imports: [LessonBreadcrumbComponent, LessonSyntaxComponent],
  templateUrl: './bootstrap-lab.component.html',
  styleUrl: './bootstrap-lab.component.scss',
})
export class BootstrapLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_THIRD_PARTY, { label: 'Bootstrap' }];

  readonly installTs = `// 1. Install Bootstrap (CSS + optional JS)
// npm install bootstrap

// 2. Import styles — styles.scss (or angular.json "styles")
// @use 'bootstrap/scss/bootstrap';

// 3. Optional JS (tooltips, modals) — main.ts or a component:
// import 'bootstrap';`;

  readonly installTpl = `<!-- Bootstrap = class names on normal HTML -->
<button class="btn btn-primary">Save</button>
<div class="alert alert-info" role="alert">
  Wired via CSS classes — not Angular components.
</div>

<div class="row g-3">
  <div class="col-md-6">Left column</div>
  <div class="col-md-6">Right column</div>
</div>`;

  readonly installModal = `// angular.json (alternative to @use in styles.scss)
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "src/styles.scss"
]

// ng-bootstrap (optional) — Angular wrappers for Bootstrap widgets
// npm install @ng-bootstrap/ng-bootstrap
// Then import NgbModule / standalone Ngb* directives.

// Trade-off vs Angular Material:
// Bootstrap → class-based, works with any markup, can clash with Material CSS.
// Material → Angular components + theming tokens, better DI integration.`;

  readonly whenTs = `// Use Bootstrap when:
// • Team already knows Bootstrap markup
// • You want a familiar grid (row / col-*) quickly
// • Marketing / admin pages that are not Material-themed

// Avoid stacking Bootstrap + Material in the same visual shell
// without scoping — both set global button / form styles.`;
}
