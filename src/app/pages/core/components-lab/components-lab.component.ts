import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CRUMB_CORE, CRUMB_HOME } from '../../../shared/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';
import { DemoGreeterComponent } from './demo-greeter.component';
import { DemoPanelComponent } from './demo-panel.component';
import { DemoVoteComponent } from './demo-vote.component';

@Component({
  selector: 'app-components-lab',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    DemoGreeterComponent,
    DemoVoteComponent,
    DemoPanelComponent,
    LessonBreadcrumbComponent,
    LessonSyntaxComponent,
  ],
  templateUrl: './components-lab.component.html',
  styleUrl: './components-lab.component.scss',
})
export class ComponentsLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_CORE, { label: 'Components' }];

  /** Parent fields — labels “Name” / “Title” bind to these */
  name = 'Ada';
  title = 'Engineer';
  parentVoteTotal = 0;

  onChildVoted(count: number): void {
    this.parentVoteTotal = count;
  }

  readonly anatomyTpl = `<!-- Parent template hosts the child by selector -->
<app-demo-greeter [name]="name" [title]="title" />`;

  readonly anatomyTs = `// Parent class fields the template reads
name = 'Ada';
title = 'Engineer';

// @Component always includes metadata — including standalone + imports
@Component({
  selector: 'app-components-lab',
  standalone: true,
  imports: [FormsModule, DemoGreeterComponent /* … */],
  templateUrl: './components-lab.component.html',
})
export class ComponentsLabComponent { /* name, title, … */ }`;

  readonly anatomyModal = `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DemoGreeterComponent } from './demo-greeter.component';

@Component({
  selector: 'app-components-lab',
  standalone: true,
  imports: [
    FormsModule,              // needed for [(ngModel)]
    DemoGreeterComponent,     // needed for <app-demo-greeter>
  ],
  templateUrl: './components-lab.component.html',
  styleUrl: './components-lab.component.scss',
})
export class ComponentsLabComponent {
  name = 'Ada';
  title = 'Engineer';
}

// Building blocks:
// 1. @Component metadata (selector, standalone, imports, template, styles)
// 2. Class (state + methods) — name / title live here
// 3. Template (HTML that reads the class)
// 4. Composition — parent imports + hosts children`;

  readonly standaloneTpl = `<!-- These only work because the parent listed them in imports: -->
<input [(ngModel)]="name" />                    <!-- FormsModule -->
<a routerLink="/core/binding">Binding</a>       <!-- RouterLink -->
<app-demo-greeter [name]="name" [title]="title" />  <!-- DemoGreeterComponent -->`;

  readonly standaloneTs = `@Component({
  selector: 'app-components-lab',
  standalone: true,   // self-contained — no NgModule declarations array
  imports: [
    FormsModule,            // [(ngModel)]
    RouterLink,             // routerLink
    DemoGreeterComponent,   // <app-demo-greeter>
    DemoVoteComponent,      // <app-demo-vote>
    DemoPanelComponent,     // <app-demo-panel>
    LessonBreadcrumbComponent,
    LessonSyntaxComponent,
  ],
  templateUrl: './components-lab.component.html',
})
export class ComponentsLabComponent { }`;

  readonly standaloneModal = `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DemoGreeterComponent } from './demo-greeter.component';

/**
 * standalone: true  → this component owns its template dependencies.
 * imports: […]     → everything the TEMPLATE uses (children, pipes, directives, NgModules).
 *
 * Rules of thumb:
 * - Use a child tag? → import that component.
 * - Use [(ngModel)]? → import FormsModule (or FormControl + ReactiveFormsModule).
 * - Use routerLink? → import RouterLink.
 * - Use | async? → import AsyncPipe.
 * - Built-in @if / @for need NO import (compiler control flow).
 *
 * Legacy: standalone: false + NgModule declarations/imports — avoid in new Angular 20 apps.
 */
@Component({
  selector: 'app-components-lab',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    DemoGreeterComponent,
  ],
  templateUrl: './components-lab.component.html',
})
export class ComponentsLabComponent {
  name = 'Ada';
  title = 'Engineer';
}`;

  readonly inputTpl = `<label>
  Name
  <input [(ngModel)]="name" />
</label>
<label>
  Title
  <input [(ngModel)]="title" />
</label>

<!-- Parent → child: [childInput]="parentField" -->
<app-demo-greeter [name]="name" [title]="title" />`;


  readonly inputTs = `// Parent — these are what the Name / Title inputs edit
name = 'Ada';
title = 'Engineer';

// Child (demo-greeter.component.ts) — inputs receive parent values
readonly name = input.required<string>();
readonly title = input<string>('');`;

  readonly inputModal = `// Parent class
name = 'Ada';
title = 'Engineer';

// Parent template
// <input [(ngModel)]="name" />
// <input [(ngModel)]="title" />
// <app-demo-greeter [name]="name" [title]="title" />

// Child
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-demo-greeter',
  standalone: true,
  template: \`
    <p>Hello, <strong>{{ name() }}</strong>
      @if (title()) { · {{ title() }} }
    </p>
  \`,
})
export class DemoGreeterComponent {
  readonly name = input.required<string>();
  readonly title = input<string>('');
}

// Interview: input() is the signal-based API (prefer over @Input in new code).
// [name]="name" wires parent field → child input.`;


  readonly outputTpl = `<app-demo-vote (voted)="onChildVoted($event)" />
<p>Parent total: {{ parentVoteTotal }}</p>`;

  readonly outputTs = `parentVoteTotal = 0;

onChildVoted(count: number): void {
  this.parentVoteTotal = count;
}

// Child
readonly voted = output<number>();

onVote(): void {
  this.voted.emit(this.localClicks());
}`;

  readonly outputModal = `// Parent template
<app-demo-vote (voted)="onChildVoted($event)" />

// Parent class
parentVoteTotal = 0;
onChildVoted(count: number): void {
  this.parentVoteTotal = count;
}

// Child
import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-demo-vote',
  standalone: true,
  template: \`<button (click)="onVote()">Vote up</button>\`,
})
export class DemoVoteComponent {
  readonly localClicks = signal(0);
  readonly voted = output<number>();

  onVote(): void {
    const next = this.localClicks() + 1;
    this.localClicks.set(next);
    this.voted.emit(next);
  }
}

// Interview: (voted) is event binding — child → parent.
// Prefer output() over @Output() + EventEmitter in new code.`;

  readonly projectTpl = `<app-demo-panel heading="Projected content">
  <p>This markup lives in the <strong>parent</strong>.</p>
  <p>The child stamps it into <code>&lt;ng-content /&gt;</code>.</p>
</app-demo-panel>`;

  readonly projectTs = `// Child template
<section>
  <header>{{ heading() }}</header>
  <div>
    <ng-content />
  </div>
</section>

// heading = input('Panel');`;

  readonly projectModal = `import { Component, input } from '@angular/core';

@Component({
  selector: 'app-demo-panel',
  standalone: true,
  template: \`
    <section>
      <header>{{ heading() }}</header>
      <div>
        <ng-content />
      </div>
    </section>
  \`,
})
export class DemoPanelComponent {
  readonly heading = input('Panel');
}

// Parent:
// <app-demo-panel heading="Projected content">
//   <p>Anything here is projected.</p>
// </app-demo-panel>
//
// Interview: ng-content = content projection (slots). Not the same as @Input.`;
}
