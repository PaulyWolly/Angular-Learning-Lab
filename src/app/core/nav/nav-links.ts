export interface NavLink {
  label: string;
  path: string;
  hint?: string;
  exact?: boolean;
  /** Optional dropdown section heading (groups related labs). */
  section?: string;
}

export interface NavSection {
  heading: string | null;
  links: NavLink[];
}

export interface NavGroup {
  label: string;
  basePath: string;
  children: NavLink[];
}

export type NavItem =
  | { kind: 'link'; link: NavLink }
  | { kind: 'group'; group: NavGroup };

/** Group children by `section` for multi-column / labeled dropdowns. */
export function navSections(children: NavLink[]): NavSection[] {
  const order: string[] = [];
  const map = new Map<string, NavLink[]>();
  for (const child of children) {
    const key = child.section ?? '';
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key)!.push(child);
  }
  return order.map((heading) => ({
    heading: heading || null,
    links: map.get(heading)!,
  }));
}

/**
 * Split sections into independent vertical columns (no shared row heights).
 * Even indices → left, odd → right. Single-column menus get one list.
 */
export function navSectionColumns(children: NavLink[], wide: boolean): NavSection[][] {
  const sections = navSections(children);
  if (!wide || sections.length <= 1) {
    return [sections];
  }
  const left: NavSection[] = [];
  const right: NavSection[] = [];
  sections.forEach((section, i) => (i % 2 === 0 ? left : right).push(section));
  return [left, right];
}

/** Compact primary nav — dropdowns keep the header short. */
export const NAV_ITEMS: NavItem[] = [
  {
    kind: 'link',
    link: { label: 'Home', path: '/', hint: 'Start here', exact: true },
  },
  {
    kind: 'group',
    group: {
      label: 'Basics',
      basePath: '/basics',
      children: [
        {
          label: 'Overview',
          path: '/basics/overview',
          hint: 'JS roadmap for Angular',
          section: 'Start',
        },
        {
          label: 'Variables & Types',
          path: '/basics/variables',
          hint: 'let, const, typeof',
          section: 'Language',
        },
        {
          label: 'Functions & Arrows',
          path: '/basics/functions',
          hint: 'Functions, arrows, this',
          section: 'Language',
        },
        {
          label: 'Arrays & Objects',
          path: '/basics/arrays',
          hint: 'map, filter, find',
          section: 'Data',
        },
        {
          label: 'Destructuring & Spread',
          path: '/basics/destructuring',
          hint: 'Unpack and copy',
          section: 'Data',
        },
        {
          label: 'Promises & async',
          path: '/basics/async',
          hint: 'then, await, errors',
          section: 'Async',
        },
        {
          label: 'Modules & Classes',
          path: '/basics/modules',
          hint: 'import/export + class',
          section: 'Structure',
        },
      ],
    },
  },
  {
    kind: 'link',
    link: { label: 'RxJS Lab', path: '/rxjs', hint: 'Observables & operators' },
  },
  {
    kind: 'link',
    link: { label: 'Users', path: '/users', hint: 'List + detail with switchMap' },
  },
  {
    kind: 'group',
    group: {
      label: 'Core',
      basePath: '/core',
      children: [
        {
          label: 'Setup · Node · NVM · CLI',
          path: '/core/setup',
          hint: 'Install Node, NVM, Angular CLI, run this lab',
          section: 'Start here',
        },
        {
          label: 'Components',
          path: '/core/components',
          hint: 'Anatomy, standalone, inputs, outputs',
          section: 'Fundamentals',
        },
        {
          label: 'Constructors',
          path: '/core/constructors',
          hint: 'When you need constructor() vs inject()',
          section: 'Fundamentals',
        },
        {
          label: 'Data Binding',
          path: '/core/binding',
          hint: 'Interpolation, property, event, two-way',
          section: 'Fundamentals',
        },
        {
          label: 'Templates',
          path: '/core/templates',
          hint: 'templateUrl vs inline backticks',
          section: 'Fundamentals',
        },
        {
          label: 'Directives',
          path: '/core/directives',
          hint: 'Structural, attribute, *appUnless',
          section: 'Fundamentals',
        },
        {
          label: 'Pipes',
          path: '/core/pipes',
          hint: 'Built-in + custom pipes',
          section: 'Fundamentals',
        },
        {
          label: 'Services',
          path: '/core/services',
          hint: 'DI, inject, providedIn',
          section: 'App building',
        },
        {
          label: 'Forms',
          path: '/core/forms',
          hint: 'Reactive + template-driven',
          section: 'App building',
        },
        {
          label: '@defer',
          path: '/core/defer',
          hint: 'Template lazy loading',
          section: 'App building',
        },
        {
          label: 'HTTP States',
          path: '/core/http-states',
          hint: 'loading / empty / error / retry',
          section: 'HTTP & safety',
        },
        {
          label: 'Interceptors',
          path: '/core/interceptors',
          hint: 'Auth header demo',
          section: 'HTTP & safety',
        },
        {
          label: 'XSS Safety',
          path: '/core/xss',
          hint: 'Escaping, sanitizer, bypass',
          section: 'HTTP & safety',
        },
        {
          label: 'Signals',
          path: '/core/signals',
          hint: 'signal, computed, effect',
          section: 'Reactivity',
        },
        {
          label: 'Subjects · BehaviorSubject',
          path: '/core/subjects',
          hint: 'Event bus + late-join replay',
          section: 'Reactivity',
        },
        {
          label: 'NgRx',
          path: '/core/ngrx',
          hint: 'Store, effects, SignalStore',
          section: 'Reactivity',
        },
        {
          label: 'Change Detection',
          path: '/core/change-detection',
          hint: 'Default vs OnPush',
          section: 'Reactivity',
        },
      ],
    },
  },
  {
    kind: 'group',
    group: {
      label: 'Material',
      basePath: '/material',
      children: [
        {
          label: 'Overview & Setup',
          path: '/material/overview',
          hint: 'Setup, buttons, cards, badges, chips',
          section: 'Basics',
        },
        {
          label: 'Form Controls',
          path: '/material/forms',
          hint: 'Inputs, selects, switches, datepicker',
          section: 'Forms',
        },
        {
          label: 'Tables & Grids',
          path: '/material/table',
          hint: 'MatTable, sort, pagination, filter, MatGridList',
          section: 'Data & Layout',
        },
        {
          label: 'Dialogs & Feedback',
          path: '/material/dialogs',
          hint: 'MatDialog, snackbar, progress, tooltips',
          section: 'Feedback',
        },
        {
          label: 'Navigation & Menus',
          path: '/material/navigation',
          hint: 'Toolbar, menus, tabs, accordions',
          section: 'Navigation',
        },
      ],
    },
  },
  {
    kind: 'group',
    group: {
      label: 'Third Party',
      basePath: '/third-party',
      children: [
        {
          label: 'Overview',
          path: '/third-party/overview',
          hint: 'Bootstrap, Tailwind, Storybook, Ag-Grid',
          section: 'Hub',
        },
        {
          label: 'Bootstrap',
          path: '/third-party/bootstrap',
          hint: 'CSS framework + class-based UI',
          section: 'CSS & UI',
        },
        {
          label: 'Tailwind',
          path: '/third-party/tailwind',
          hint: 'Utility-first CSS for Angular',
          section: 'CSS & UI',
        },
        {
          label: 'Storybook',
          path: '/third-party/storybook',
          hint: 'Component workshop & docs',
          section: 'Tooling',
        },
        {
          label: 'Ag-Grid Community',
          path: '/third-party/ag-grid',
          hint: 'Live high-performance data grid',
          section: 'Data grids',
        },
      ],
    },
  },
  {
    kind: 'group',
    group: {
      label: 'Routes',
      basePath: '/routes',
      children: [
        {
          label: 'Overview',
          path: '/routes',
          hint: 'router-outlet · where to put it',
          exact: true,
          section: 'Routing',
        },
        {
          label: 'Lazy Loading',
          path: '/routes/lazy',
          hint: 'loadComponent chunks',
          section: 'Routing',
        },
        {
          label: 'Guards',
          path: '/routes/guards',
          hint: 'CanActivate & demo auth',
          section: 'Guards',
        },
        {
          label: 'Protected',
          path: '/routes/protected',
          hint: 'Guard-gated page',
          section: 'Guards',
        },
        {
          label: 'CanDeactivate',
          path: '/routes/deactivate',
          hint: 'Unsaved form leave guard',
          section: 'Guards',
        },
      ],
    },
  },
];

/** Footer reuses NAV_ITEMS (flat FOOTER_LINKS removed — Core/Routes pop upward). */
