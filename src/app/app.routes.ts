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
    path: 'basics',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./pages/basics/overview-lab/overview-lab.component').then(
            (m) => m.BasicsOverviewLabComponent,
          ),
        title: 'Basics Overview',
      },
      {
        path: 'variables',
        loadComponent: () =>
          import('./pages/basics/variables-lab/variables-lab.component').then(
            (m) => m.BasicsVariablesLabComponent,
          ),
        title: 'Variables & Types',
      },
      {
        path: 'functions',
        loadComponent: () =>
          import('./pages/basics/functions-lab/functions-lab.component').then(
            (m) => m.BasicsFunctionsLabComponent,
          ),
        title: 'Functions & Arrows',
      },
      {
        path: 'arrays',
        loadComponent: () =>
          import('./pages/basics/arrays-lab/arrays-lab.component').then(
            (m) => m.BasicsArraysLabComponent,
          ),
        title: 'Arrays & Objects',
      },
      {
        path: 'destructuring',
        loadComponent: () =>
          import('./pages/basics/destructuring-lab/destructuring-lab.component').then(
            (m) => m.BasicsDestructuringLabComponent,
          ),
        title: 'Destructuring & Spread',
      },
      {
        path: 'async',
        loadComponent: () =>
          import('./pages/basics/async-lab/async-lab.component').then(
            (m) => m.BasicsAsyncLabComponent,
          ),
        title: 'Promises & async',
      },
      {
        path: 'modules',
        loadComponent: () =>
          import('./pages/basics/modules-lab/modules-lab.component').then(
            (m) => m.BasicsModulesLabComponent,
          ),
        title: 'Modules & Classes',
      },
    ],
  },
  {
    path: 'core',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'setup' },
      {
        path: 'style-guide',
        loadComponent: () =>
          import('./pages/core/foundations-lab/foundations-lab.component').then(
            (m) => m.FoundationsLabComponent,
          ),
        title: 'Style Guide',
      },
      { path: 'foundations', redirectTo: 'style-guide', pathMatch: 'full' },
      {
        path: 'setup',
        loadComponent: () =>
          import('./pages/core/setup-lab/setup-lab.component').then((m) => m.SetupLabComponent),
        title: 'Setup · Node · NVM · CLI',
      },
      {
        path: 'components',
        loadComponent: () =>
          import('./pages/core/components-lab/components-lab.component').then(
            (m) => m.ComponentsLabComponent,
          ),
        title: 'Components',
      },
      {
        path: 'constructors',
        loadComponent: () =>
          import('./pages/core/constructors-lab/constructors-lab.component').then(
            (m) => m.ConstructorsLabComponent,
          ),
        title: 'Constructors',
      },
      {
        path: 'lifecycle',
        loadComponent: () =>
          import('./pages/core/lifecycle-lab/lifecycle-lab.component').then(
            (m) => m.LifecycleLabComponent,
          ),
        title: 'Lifecycle Hooks',
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
        path: 'ngrx',
        loadChildren: () =>
          import('./pages/core/ngrx-lab/ngrx.routes').then((m) => m.NGRX_ROUTES),
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
      { path: 'style-guide', redirectTo: '/core/style-guide', pathMatch: 'full' },
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
    path: 'third-party',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./pages/third-party/overview-lab/overview-lab.component').then(
            (m) => m.ThirdPartyOverviewLabComponent,
          ),
        title: 'Third Party Overview',
      },
      {
        path: 'bootstrap',
        loadComponent: () =>
          import('./pages/third-party/bootstrap-lab/bootstrap-lab.component').then(
            (m) => m.BootstrapLabComponent,
          ),
        title: 'Bootstrap',
      },
      {
        path: 'tailwind',
        loadComponent: () =>
          import('./pages/third-party/tailwind-lab/tailwind-lab.component').then(
            (m) => m.TailwindLabComponent,
          ),
        title: 'Tailwind CSS',
      },
      {
        path: 'storybook',
        loadComponent: () =>
          import('./pages/third-party/storybook-lab/storybook-lab.component').then(
            (m) => m.StorybookLabComponent,
          ),
        title: 'Storybook',
      },
      {
        path: 'ag-grid',
        loadComponent: () =>
          import('./pages/third-party/ag-grid-lab/ag-grid-lab.component').then(
            (m) => m.AgGridLabComponent,
          ),
        title: 'Ag-Grid Community',
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
