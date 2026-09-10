import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CRUMB_HOME, CRUMB_THIRD_PARTY } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';

@Component({
  selector: 'app-third-party-overview-lab',
  standalone: true,
  imports: [RouterLink, LessonBreadcrumbComponent, LessonSyntaxComponent],
  templateUrl: './overview-lab.component.html',
  styleUrl: './overview-lab.component.scss',
})
export class ThirdPartyOverviewLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_THIRD_PARTY, { label: 'Overview' }];

  readonly compareTs = `// Four common third-party stacks next to Angular Material
//
// Bootstrap   → CSS framework (utility + components via classes)
// Tailwind    → Utility-first CSS (build-time classes)
// Storybook   → Component workshop / docs (dev tooling)
// Ag-Grid     → High-performance data grid (Community = free tier)`;

  readonly compareTpl = `<!-- Pick by job to be done -->
<!-- UI kit for forms/nav?     → Material or Bootstrap -->
<!-- Custom design system?    → Tailwind (or CSS vars) -->
<!-- Isolated component docs? → Storybook -->
<!-- Huge sortable tables?    → Ag-Grid Community -->`;

  readonly installTs = `// Typical install commands (run in your project root)
// npm install bootstrap
// npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init
// npx storybook@latest init
// npm install ag-grid-community ag-grid-angular`;
}
