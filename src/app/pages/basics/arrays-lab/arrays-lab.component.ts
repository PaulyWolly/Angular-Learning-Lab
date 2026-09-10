import { Component, signal } from '@angular/core';
import { CRUMB_BASICS, CRUMB_HOME } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';

@Component({
  selector: 'app-basics-arrays-lab',
  standalone: true,
  imports: [LessonBreadcrumbComponent, LessonSyntaxComponent],
  templateUrl: './arrays-lab.component.html',
  styleUrl: './arrays-lab.component.scss',
})
export class BasicsArraysLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_BASICS, { label: 'Arrays & Objects' }];

  readonly users = [
    { id: 1, name: 'Ada', role: 'lead' },
    { id: 2, name: 'Grace', role: 'dev' },
    { id: 3, name: 'Alan', role: 'dev' },
  ];

  readonly demoLog = signal('Try map / filter / find.');

  runMap(): void {
    const names = this.users.map((u) => u.name);
    this.demoLog.set(`map → names: ${JSON.stringify(names)}`);
  }

  runFilter(): void {
    const devs = this.users.filter((u) => u.role === 'dev');
    this.demoLog.set(`filter role==='dev' → ${JSON.stringify(devs)}`);
  }

  runFind(): void {
    const ada = this.users.find((u) => u.id === 1);
    this.demoLog.set(`find id===1 → ${JSON.stringify(ada)}`);
  }

  readonly arrTs = `const users = [
  { id: 1, name: 'Ada', role: 'lead' },
  { id: 2, name: 'Grace', role: 'dev' },
  { id: 3, name: 'Alan', role: 'dev' },
];

// Transform each item → new array
const names = users.map(u => u.name);       // ['Ada','Grace','Alan']

// Keep items that match
const devs = users.filter(u => u.role === 'dev');

// First match (or undefined)
const ada = users.find(u => u.id === 1);

// Object access
const user = users[0];
user.name;          // 'Ada'
user['role'];      // 'lead'`;

  readonly arrTpl = `@for (u of users; track u.id) {
  <li>{{ u.name }} — {{ u.role }}</li>
}
<button (click)="runMap()">map names</button>
<button (click)="runFilter()">filter devs</button>
<button (click)="runFind()">find Ada</button>`;

  readonly arrModal = `// These three power most Angular list UIs:
// map    → reshape for display (id → label)
// filter → search boxes / role tabs
// find   → detail by id

// Also useful:
users.some(u => u.role === 'lead');  // true/false
users.every(u => u.id > 0);
users.length;

// Never mutate shared state casually in Angular —
// prefer map/filter that return NEW arrays (OnPush-friendly).`;
}
