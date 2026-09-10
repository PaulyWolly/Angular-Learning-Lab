import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CRUMB_BASICS, CRUMB_HOME } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';

/** Tiny demo class — same shape as an Angular component/service without decorators. */
class Greeter {
  constructor(public name: string) {}
  hello(): string {
    return `Hello from ${this.name}`;
  }
}

@Component({
  selector: 'app-basics-modules-lab',
  standalone: true,
  imports: [RouterLink, LessonBreadcrumbComponent, LessonSyntaxComponent],
  templateUrl: './modules-lab.component.html',
  styleUrl: './modules-lab.component.scss',
})
export class BasicsModulesLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_BASICS, { label: 'Modules & Classes' }];
  readonly demoLog = signal('Instantiate the demo class.');

  runClass(): void {
    const g = new Greeter('Angular Lab');
    this.demoLog.set(g.hello());
  }

  readonly modTs = `// ES modules — one idea per file, explicit exports
// counter.ts
export function increment(n: number) {
  return n + 1;
}
export const MAX = 100;

// app.ts
import { increment, MAX } from './counter';
import { Greeter } from './greeter'; // default or named

// Classes group state + methods
export class Greeter {
  constructor(public name: string) {}
  hello() {
    return \`Hello from \${this.name}\`;
  }
}

const g = new Greeter('Ada');
g.hello();`;

  readonly modTpl = `<button (click)="runClass()">new Greeter(...).hello()</button>
<p>{{ demoLog() }}</p>
<a routerLink="/core/components">Next: Angular Components →</a>`;

  readonly modModal = `// Angular files are ES modules + classes + decorators
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
})
export class HomeComponent {
  title = 'Home';
  save() { /* … */ }
}

// import  → bring symbols into this file
// export  → make symbols available to others
// class   → the TypeScript shape Angular instantiates
// @Component → metadata Angular reads at runtime/compile time

// You already know constructors from /core/constructors —
// same JS/TS class feature, with Angular DI on top.`;
}
