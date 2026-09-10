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
  readonly routesTs = `// app.routes.ts — parent shell + nested children
{
  path: 'routes',
  loadComponent: () => import('./pages/routes-shell/...'),
  children: [
    { path: '', loadComponent: () => import('./pages/routes-lab/...') },
    { path: 'lazy', loadComponent: () => import('./pages/lazy-lab/...') },
    { path: 'guards', loadComponent: () => import('./pages/guards-lab/...') },
    {
      path: 'protected',
      canActivate: [demoAuthGuard],
      loadComponent: () => import('./pages/protected-lab/...'),
    },
  ],
}

// routes-shell.component.html
<router-outlet />  // child labs render here`;

  readonly routesTpl = `<!-- Shell sub-nav (stays while children swap) -->
<a routerLink="/routes" routerLinkActive="is-active">Overview</a>
<a routerLink="/routes/lazy">Lazy</a>
<!-- child page appears in the shell's router-outlet -->`;

  readonly linkTpl = `<a
  routerLink="/routes/lazy"
  routerLinkActive="is-active"
>
  Lazy Loading
</a>`;

  readonly linkTs = `// Component imports RouterLink + RouterLinkActive
imports: [RouterLink, RouterLinkActive]

// Prefer routerLink over href — no full page reload`;
}
