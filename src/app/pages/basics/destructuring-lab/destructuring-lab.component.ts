import { Component, signal } from '@angular/core';
import { CRUMB_BASICS, CRUMB_HOME } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';

@Component({
  selector: 'app-basics-destructuring-lab',
  standalone: true,
  imports: [LessonBreadcrumbComponent, LessonSyntaxComponent],
  templateUrl: './destructuring-lab.component.html',
  styleUrl: './destructuring-lab.component.scss',
})
export class BasicsDestructuringLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_BASICS, { label: 'Destructuring & Spread' }];
  readonly demoLog = signal('Run a destructuring / spread demo.');

  runObject(): void {
    const user = { name: 'Ada', role: 'lead', city: 'London' };
    const { name, role } = user;
    this.demoLog.set(`const { name, role } = user → name="${name}", role="${role}"`);
  }

  runArray(): void {
    const pair = ['teal', 'amber'] as const;
    const [primary, accent] = pair;
    this.demoLog.set(`const [primary, accent] = pair → ${primary}, ${accent}`);
  }

  runSpread(): void {
    const base = { theme: 'light', density: 'comfortable' };
    const next = { ...base, theme: 'dark' };
    this.demoLog.set(`{ ...base, theme: 'dark' } → ${JSON.stringify(next)}`);
  }

  readonly destTs = `const user = { name: 'Ada', role: 'lead', city: 'London' };

// Object destructuring
const { name, role } = user;

// Rename while unpacking
const { name: displayName } = user;

// Array destructuring
const [first, second] = ['teal', 'amber'];

// Spread — shallow copy / merge
const base = { theme: 'light', density: 'comfortable' };
const next = { ...base, theme: 'dark' };
// next → { theme: 'dark', density: 'comfortable' }

const more = [...['a', 'b'], 'c']; // ['a','b','c']`;

  readonly destTpl = `<button (click)="runObject()">object unpack</button>
<button (click)="runArray()">array unpack</button>
<button (click)="runSpread()">spread merge</button>`;

  readonly destModal = `// Angular / TS patterns you will see:
function save({ name, email }: { name: string; email: string }) { /* … */ }

// Route params often destructured in subscribe / effects
const { id } = route.snapshot.params;

// Immutable update (signals / OnPush friendly)
this.user = { ...this.user, role: 'admin' };`;
}
