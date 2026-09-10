import { Component, signal } from '@angular/core';
import {
  CRUMB_BASICS,
  CRUMB_HOME,
} from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import {
  LessonBreadcrumbComponent,
  LessonCrumb,
} from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';

@Component({
  selector: 'app-basics-variables-lab',
  standalone: true,
  imports: [LessonBreadcrumbComponent, LessonSyntaxComponent],
  templateUrl: './variables-lab.component.html',
  styleUrl: './variables-lab.component.scss',
})
export class BasicsVariablesLabComponent {
  readonly crumbs: LessonCrumb[] = [CRUMB_HOME, CRUMB_BASICS, { label: 'Variables & Types' }];

  name = 'Ada';
  readonly pi = 3.14;
  readonly demoLog = signal<string>('Click a button to run the snippet.');

  bumpName(): void {
    this.name = this.name === 'Ada' ? 'Grace' : 'Ada';
    this.demoLog.set(`let name -> reassigned to "${this.name}"`);
  }

  tryConst(): void {
    this.demoLog.set('const pi = 3.14 - cannot reassign. Use let when the value must change.');
  }

  explainVar(): void {
    this.demoLog.set(
      'Do not use var. Prefer const by default; use let when you must reassign. var is function-scoped and hoisted — a common source of bugs.',
    );
  }

  showTypes(): void {
    const samples = [
      typeof 'hello',
      typeof 42,
      typeof true,
      typeof undefined,
      typeof null, // historical quirk -> "object"
      typeof { a: 1 },
      typeof [1, 2],
    ];
    this.demoLog.set(`typeof samples: ${samples.join(', ')}`);
  }

  readonly varAvoidTs = `// ❌ Don't write this anymore
var count = 0;
count = 1;

// ✅ Modern Angular / TypeScript
let count = 0;     // can reassign
const max = 100;   // cannot reassign (prefer this by default)

// Why var is a problem:
// 1. Function-scoped (leaks out of if/for blocks)
// 2. Hoisted — you can "use" it before the line that assigns it
// 3. Lets you redeclare the same name in one scope silently`;

  readonly varAvoidTpl = `<button type="button" (click)="explainVar()">Why avoid var?</button>
<pre>{{ demoLog() }}</pre>`;

  readonly varAvoidModal = `// var leaks past the block
if (true) {
  var leaked = 'oops';
}
console.log(leaked); // 'oops' — still visible outside the if

// let / const stay in the block
if (true) {
  let safe = 'ok';
}
// console.log(safe); // ReferenceError

// Interview rule of thumb:
// - Never use var in new code
// - const first, let when the binding must change
// - Angular style guides assume let/const only`;

  readonly varsTs = `// Prefer const by default; use let when you must reassign.
// Never use var in modern Angular / TypeScript.
let name = 'Ada';
name = 'Grace';          // OK

const pi = 3.14;
// pi = 3;               // Error - const cannot be reassigned

// const objects can still mutate their *contents*
const user = { role: 'dev' };
user.role = 'lead';        // OK - same object reference`;

  readonly varsTpl = `<p>Name: {{ name }}</p>
<button type="button" (click)="bumpName()">Rename (let)</button>
<button type="button" (click)="tryConst()">Explain const</button>`;

  readonly varsModal = `// Angular component fields are usually class properties:
export class ProfileComponent {
  name = 'Ada';           // like let - can reassign
  readonly title = 'Dev'; // like const for the binding

  // TypeScript adds types (optional but recommended):
  age: number = 36;
  active: boolean = true;
}

// Primitives: string, number, boolean, null, undefined, bigint, symbol
// Everything else is an object (arrays, functions, plain objects).

// Remember: no var — use let / const only.`;

  readonly typesTs = `typeof 'hi'      // "string"
typeof 10        // "number"
typeof true      // "boolean"
typeof undefined // "undefined"
typeof null      // "object"  <- JS quirk - remember it
typeof []        // "object"
typeof {}        // "object"`;
}
