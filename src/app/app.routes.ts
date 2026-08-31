import { Routes } from '@angular/router';
import { demoAuthGuard } from './core/guards/demo-auth.guard';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';
import { userResolver } from './core/resolvers/user.resolver';

/**
 * App routes — feature pages use loadComponent (lazy loading).
 * Core lessons under /core/* · routing lessons under /routes/*.
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'Home',
  },
  {
    path: 'rxjs',
    loadComponent: () =>
      import('./pages/rxjs-lab/rxjs-lab.component').then((m) => m.RxjsLabComponent),
    title: 'RxJS Lab',
  },
  {
    path: 'core',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'components' },
      {
        path: 'components',
        loadComponent: () =>
          import('./pages/core/components-lab/components-lab.component').then(
            (m) => m.ComponentsLabComponent,
          ),
        title: 'Components',
      },
      {
        path: 'binding',
        loadComponent: () =>
          import('./pages/core/binding-lab/binding-lab.component').then(
            (m) => m.BindingLabComponent,
          ),
        title: 'Data Binding',
      },
      {
        path: 'templates',
        loadComponent: () =>
          import('./pages/core/templates-lab/templates-lab.component').then(
            (m) => m.TemplatesLabComponent,
          ),
        title: 'Templates',
      },
      {
        path: 'defer',
        loadComponent: () =>
          import('./pages/core/defer-lab/defer-lab.component').then((m) => m.DeferLabComponent),
        title: '@defer',
      },
      {
        path: 'pipes',
        loadComponent: () =>
          import('./pages/core/pipes-lab/pipes-lab.component').then((m) => m.PipesLabComponent),
        title: 'Pipes',
      },
      {
        path: 'directives',
        loadComponent: () =>
          import('./pages/core/directives-lab/directives-lab.component').then(
            (m) => m.DirectivesLabComponent,
          ),
        title: 'Directives',
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./pages/core/services-lab/services-lab.component').then(
            (m) => m.ServicesLabComponent,
          ),
        title: 'Services',
      },
      {
        path: 'forms',
        loadComponent: () =>
          import('./pages/core/forms-lab/forms-lab.component').then((m) => m.FormsLabComponent),
        title: 'Forms',
      },
      {
        path: 'http-states',
        loadComponent: () =>
          import('./pages/core/http-states-lab/http-states-lab.component').then(
            (m) => m.HttpStatesLabComponent,
          ),
        title: 'HTTP States',
      },
      {
        path: 'change-detection',
        loadComponent: () =>
          import('./pages/core/change-detection-lab/change-detection-lab.component').then(
            (m) => m.ChangeDetectionLabComponent,
          ),
        title: 'Change Detection',
      },
      {
        path: 'signals',
        loadComponent: () =>
          import('./pages/core/signals-lab/signals-lab.component').then(
            (m) => m.SignalsLabComponent,
          ),
        title: 'Signals',
      },
      {
        path: 'subjects',
        loadComponent: () =>
          import('./pages/core/subjects-lab/subjects-lab.component').then(
            (m) => m.SubjectsLabComponent,
          ),
        title: 'Subjects · BehaviorSubject',
      },
      {
        path: 'interceptors',
        loadComponent: () =>
          import('./pages/core/interceptors-lab/interceptors-lab.component').then(
            (m) => m.InterceptorsLabComponent,
          ),
        title: 'Interceptors',
      },
      {
        path: 'xss',
        loadComponent: () =>
          import('./pages/core/xss-lab/xss-lab.component').then((m) => m.XssLabComponent),
        title: 'XSS Safety',
      },
    ],
  },
  {
    path: 'users',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/users-lab/users-lab.component').then((m) => m.UsersLabComponent),
        title: 'Users',
      },
      {
        path: ':id',
        resolve: { user: userResolver },
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
        loadComponent: () =>
          import('./pages/users-lab/users-detail.component').then((m) => m.UsersDetailComponent),
        title: 'User detail',
      },
    ],
  },
  {
    path: 'material',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./pages/material/overview-lab/overview-lab.component').then(
            (m) => m.OverviewLabComponent,
          ),
        title: 'Material Overview & Setup',
      },
      {
        path: 'forms',
        loadComponent: () =>
          import('./pages/material/forms-lab/forms-lab.component').then(
            (m) => m.MaterialFormsLabComponent,
          ),
        title: 'Material Forms',
      },
      {
        path: 'table',
        loadComponent: () =>
          import('./pages/material/table-lab/table-lab.component').then(
            (m) => m.MaterialTableLabComponent,
          ),
        title: 'Material Table & Grid',
      },
      {
        path: 'dialogs',
        loadComponent: () =>
          import('./pages/material/dialogs-lab/dialogs-lab.component').then(
            (m) => m.MaterialDialogsLabComponent,
          ),
        title: 'Material Dialogs & Feedback',
      },
      {
        path: 'navigation',
        loadComponent: () =>
          import('./pages/material/navigation-lab/navigation-lab.component').then(
            (m) => m.MaterialNavigationLabComponent,
          ),
        title: 'Material Navigation & Menus',
      },
    ],
  },
  {
    path: 'routes',
    loadComponent: () =>
      import('./pages/routes-shell/routes-shell.component').then(
        (m) => m.RoutesShellComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/routes-lab/routes-lab.component').then((m) => m.RoutesLabComponent),
        title: 'Routes',
      },
      {
        path: 'lazy',
        loadComponent: () =>
          import('./pages/lazy-lab/lazy-lab.component').then((m) => m.LazyLabComponent),
        title: 'Lazy Loading',
      },
      {
        path: 'guards',
        loadComponent: () =>
          import('./pages/guards-lab/guards-lab.component').then((m) => m.GuardsLabComponent),
        title: 'Guards',
      },
      {
        path: 'protected',
        canActivate: [demoAuthGuard],
        loadComponent: () =>
          import('./pages/protected-lab/protected-lab.component').then(
            (m) => m.ProtectedLabComponent,
          ),
        title: 'Protected',
      },
      {
        path: 'deactivate',
        canDeactivate: [unsavedChangesGuard],
        loadComponent: () =>
          import('./pages/deactivate-lab/deactivate-lab.component').then(
            (m) => m.DeactivateLabComponent,
          ),
        title: 'CanDeactivate',
      },
    ],
  },
  { path: 'lazy', redirectTo: 'routes/lazy' },
  { path: 'guards', redirectTo: 'routes/guards' },
  { path: 'protected', redirectTo: 'routes/protected' },
  { path: 'deactivate', redirectTo: 'routes/deactivate' },
  { path: '**', redirectTo: '' },
];
