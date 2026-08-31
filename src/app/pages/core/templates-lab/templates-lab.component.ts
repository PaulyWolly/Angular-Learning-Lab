import { Component } from '@angular/core';
import { CRUMB_CORE, CRUMB_HOME } from '../../../shared/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';
import { InlineTemplateDemoComponent } from './inline-template-demo.component';

@Component({
  selector: 'app-templates-lab',
  standalone: true,
  imports: [LessonBreadcrumbComponent, LessonSyntaxComponent, InlineTemplateDemoComponent],
  templateUrl: './templates-lab.component.html',
  styleUrl: './templates-lab.component.scss',
})
export class TemplatesLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_CORE, { label: 'Templates' }];

  /** Drives the live inline-demo child */
  guestName = 'Leanne';

  readonly externalTs = `@Component({
  selector: 'app-templates-lab',
  standalone: true,
  // Full-page / multi-card lessons → separate .html file
  templateUrl: './templates-lab.component.html',
  styleUrl: './templates-lab.component.scss',
})
export class TemplatesLabComponent {
  guestName = 'Leanne';
}`;

  readonly externalTpl = `<!-- templates-lab.component.html -->
<section class="lesson">
  <h1>Templates</h1>
  <app-inline-template-demo [name]="guestName" />
</section>

<!-- Angular loads this file via templateUrl — great for long markup. -->`;

  readonly inlineTs = `@Component({
  selector: 'app-inline-template-demo',
  standalone: true,
  // Small widgets → inline backtick template in the .ts file
  template: \`
    <div class="inline-demo">
      <p>Hello, <em>{{ name }}</em></p>
      <button type="button" (click)="bump()">Bump</button>
    </div>
  \`,
  styles: [\`
    .inline-demo { padding: 0.75rem; }
  \`],
})
export class InlineTemplateDemoComponent {
  @Input({ required: true }) name!: string;
  clicks = signal(0);
  bump() { this.clicks.update((n) => n + 1); }
}`;

  readonly inlineTpl = `<!-- Host page still uses templateUrl -->
<app-inline-template-demo [name]="guestName" />

<!-- The child's view is NOT a .html file —
     it lives inside template: \`...\` on the @Component decorator. -->`;

  readonly tipsTs = `// Backtick tips (interview + day-to-day)

// 1) Prefer templateUrl for long / lesson-sized HTML.
// 2) Prefer template: \`...\` for tiny demos, one-file widgets, Storybook-style chips.

// 3) Nesting backticks: escape them, or break the string:
template: \`
  <code>Use \\\`code\\\` carefully</code>
\`

// 4) \${ } inside a template string is JS interpolation — Angular bindings use {{ }}.
//    Do NOT write \${name} unless you intend TypeScript string substitution.

// 5) Pair with styles: \`...\` or styleUrl / styleUrls the same way.
`;

  readonly tipsTpl = `<!-- This page (external) -->
<input [value]="guestName"
       (input)="guestName = $any($event.target).value" />
<app-inline-template-demo [name]="guestName" />

<!-- Same binding rules either way: {{ }}, [prop], (event), @if / @for -->`;

  readonly tipsModal = `@Component({
  // ❌ Can't set both — pick one
  // templateUrl: './x.component.html',
  // template: \`<p>hi</p>\`,

  // ✅ One of:
  templateUrl: './x.component.html',
  // or
  template: \`<p>hi</p>\`,
})
export class ExampleComponent {}

// Angular CLI generates templateUrl by default.
// Inline templates shine when the markup is shorter than the import path debate.`;
}
