import { Component, signal } from '@angular/core';
import { CRUMB_BASICS, CRUMB_HOME } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';

@Component({
  selector: 'app-basics-functions-lab',
  standalone: true,
  imports: [LessonBreadcrumbComponent, LessonSyntaxComponent],
  templateUrl: './functions-lab.component.html',
  styleUrl: './functions-lab.component.scss',
})
export class BasicsFunctionsLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_BASICS, { label: 'Functions & Arrows' }];
  readonly demoLog = signal('Click a demo button.');

  greet(name: string): string {
    return `Hello, ${name}!`;
  }

  runGreet(): void {
    this.demoLog.set(this.greet('Ada'));
  }

  runArrow(): void {
    const double = (n: number) => n * 2;
    this.demoLog.set(`const double = (n) => n * 2;  double(7) → ${double(7)}`);
  }

  runMethod(): void {
    this.demoLog.set(`class method this.greet → "${this.greet('Grace')}" (this is the component)`);
  }

  readonly fnTs = `// Function declaration
function greet(name) {
  return 'Hello, ' + name + '!';
}

// Arrow function (common in Angular callbacks)
const double = (n) => n * 2;
const greet2 = (name) => \`Hello, \${name}!\`;

// Class method (Angular components)
export class AppComponent {
  title = 'Lab';
  save() {
    console.log(this.title); // this → the component instance
  }
}`;

  readonly fnTpl = `<button type="button" (click)="runGreet()">greet('Ada')</button>
<button type="button" (click)="runArrow()">arrow double(7)</button>
<button type="button" (click)="runMethod()">class method + this</button>`;

  readonly fnModal = `// Arrow vs function — the this difference
const obj = {
  label: 'A',
  classic: function () { return this.label; },
  arrow: () => this.label, // lexical this — NOT obj in most cases
};

// In Angular templates, (click)="save()" calls a *method* on the component.
// Prefer class methods for event handlers so this is reliable.

// Default + rest parameters
function sum(a = 0, ...rest) {
  return rest.reduce((t, n) => t + n, a);
}`;
}
