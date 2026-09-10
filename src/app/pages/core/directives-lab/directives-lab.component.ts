import { NgClass, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';
import { ModulusColorDirective } from '../../../shared/directives/modulus-color.directive';
import { UnlessDirective } from '../../../shared/directives/unless.directive';
import { CRUMB_CORE, CRUMB_HOME } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';

@Component({
  selector: 'app-directives-lab',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    NgStyle,
    HighlightDirective,
    ModulusColorDirective,
    UnlessDirective,
    LessonBreadcrumbComponent,
    LessonSyntaxComponent,
  ],
  templateUrl: './directives-lab.component.html',
  styleUrl: './directives-lab.component.scss',
})
export class DirectivesLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_CORE, { label: 'Directives' }];
  showPanel = true;
  tone: 'calm' | 'alert' = 'calm';
  items = ['Observable', 'Observer', 'Subscription'];

  /** ngClass modulus demo — green when divisible by 5 (same idea as interview videos) */
  modNumber = 10;

  /** Parity color demo — change me; color flips on n % 2 */
  score = 4;

  /** *appUnless — content shows while this is false */
  hideHint = false;

  bumpMod(delta: number): void {
    this.modNumber += delta;
  }

  bumpScore(delta: number): void {
    this.score += delta;
  }

  readonly structuralTpl = `<label>
  <input type="checkbox" [(ngModel)]="showPanel" />
  showPanel
</label>

@if (showPanel) {
  <p>Visible</p>
} @else {
  <p>Hidden</p>
}

@for (item of items; track item) {
  <li>{{ item }}</li>
}`;
  readonly structuralTs = `showPanel = true;
items = ['Observable', 'Observer', 'Subscription'];
// FormsModule required for [(ngModel)]`;

  readonly attributeTpl = `<button type="button" (click)="bumpMod(-1)">−1</button>
<button type="button" (click)="bumpMod(1)">+1</button>

<!-- OBJECT form: { } is a JS object — className: boolean -->
<div [ngClass]="{
  green: modNumber % 5 === 0,
  red: modNumber % 5 !== 0
}">{{ modNumber }}</div>

<!-- TERNARY form: NO { } — expression returns a string class name -->
<div [ngClass]="modNumber % 5 === 0 ? 'green' : 'red'">
  {{ modNumber }}
</div>

<!-- Wrong: { modNumber % 5 === 0 ? 'green' : 'red' } is NOT a valid object -->

<button type="button" (click)="tone = 'calm'">calm</button>
<button type="button" (click)="tone = 'alert'">alert</button>
<p
  [ngClass]="{ 'tone--alert': tone === 'alert', 'tone--calm': tone === 'calm' }"
  [ngStyle]="{ fontWeight: tone === 'alert' ? '700' : '400' }"
>
  tone = {{ tone }}
</p>`;

  readonly attributeTs = `modNumber = 10;

bumpMod(delta: number): void {
  this.modNumber += delta;
}

tone: 'calm' | 'alert' = 'calm';
// Object → map of classes. Ternary → one string. Braces only for objects.`;

  readonly customTpl = `<p appHighlight>Default teal-soft highlight</p>
<p [appHighlight]="'#fef3c7'">Amber via input</p>`;
  readonly customTplModal = `<!-- Live demo markup for appHighlight -->
<p appHighlight>Default teal-soft highlight</p>
<p [appHighlight]="'#fef3c7'">Amber highlight via input binding</p>

<!--
  Bare appHighlight → input gets "" → transform restores default teal-soft.
  [appHighlight]="'#fef3c7'" → bound string overrides the default.
  HostListener mouseenter/mouseleave + HostBinding style.backgroundColor.
-->`;

  readonly customTs = `// Component
imports: [HighlightDirective]

// Directive input — bare appHighlight binds "" so we fall back:
appHighlight = input('var(--teal-soft)', {
  transform: (v) => v?.trim() ? v : 'var(--teal-soft)',
});`;
  readonly customModal = `import { Directive, HostBinding, HostListener, input } from '@angular/core';

const DEFAULT_HIGHLIGHT = 'var(--teal-soft)';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective {
  readonly appHighlight = input(DEFAULT_HIGHLIGHT, {
    transform: (value: string | null | undefined) =>
      value?.trim() ? value : DEFAULT_HIGHLIGHT,
  });

  private active = false;

  @HostBinding('style.backgroundColor')
  get background(): string {
    return this.active ? this.appHighlight() : 'transparent';
  }

  @HostListener('mouseenter') onEnter() { this.active = true; }
  @HostListener('mouseleave') onLeave() { this.active = false; }
}`;

  readonly modulusTpl = `<button type="button" (click)="bumpScore(-1)">−1</button>
<button type="button" (click)="bumpScore(1)">+1</button>

<!-- Interpolation shows the number; the directive colors the host -->
<strong [appModulusColor]="score">{{ score }}</strong>

<!-- even → teal, odd → danger via n % 2 -->`;

  readonly modulusTplModal = `<!-- Complete live demo markup -->
<button type="button" class="btn" (click)="bumpScore(-1)">−1</button>
<button type="button" class="btn btn--primary" (click)="bumpScore(1)">+1</button>

<span>
  score =
  <strong [appModulusColor]="score">{{ score }}</strong>
  <span>({{ score % 2 === 0 ? 'even' : 'odd' }})</span>
</span>

<!--
  (click) updates score → interpolation redraws the number →
  [appModulusColor] input changes → HostBinding style.color from n % 2.
-->`;

  readonly modulusTs = `score = 4;

bumpScore(delta: number): void {
  this.score += delta;
}

// modulus-color.directive.ts
readonly appModulusColor = input.required<number>();

@HostBinding('style.color') color = 'inherit';

constructor() {
  effect(() => {
    const n = this.appModulusColor();
    this.color = n % 2 === 0 ? 'var(--teal)' : 'var(--danger)';
  });
}`;

  readonly modulusModal = `import { Directive, HostBinding, effect, input } from '@angular/core';

@Directive({
  selector: '[appModulusColor]',
  standalone: true,
})
export class ModulusColorDirective {
  readonly appModulusColor = input.required<number>();

  @HostBinding('style.color')
  color = 'inherit';

  constructor() {
    effect(() => {
      const n = this.appModulusColor();
      this.color = n % 2 === 0 ? 'var(--teal)' : 'var(--danger)';
    });
  }
}`;

  readonly unlessTpl = `<label>
  <input type="checkbox" [(ngModel)]="hideHint" />
  hideHint
</label>

<!-- Interview exercise: * microsyntax → <ng-template [appUnless]="…"> -->
<p *appUnless="hideHint" class="preview">
  Visible while hideHint is <strong>false</strong> (custom structural).
</p>

<!-- Simpler — prefer this in real apps -->
@if (!hideHint) {
  <p class="preview">Same result with @if (!hideHint).</p>
}

<!-- Lists: prefer @for, not a homemade *appRepeat -->
<ul>
  @for (item of items; track item) {
    <li>{{ item }}</li>
  }
</ul>`;

  readonly unlessTplModal = `<!-- Complete live demo: *appUnless vs @if vs @for -->
<label>
  <input type="checkbox" [(ngModel)]="hideHint" />
  hideHint
</label>

<!-- Interview exercise -->
<p *appUnless="hideHint" class="preview">
  Visible while hideHint is <strong>false</strong> — stamped by *appUnless.
</p>

<!-- Simpler — prefer this in real apps -->
@if (!hideHint) {
  <p class="preview">
    Same result with @if (!hideHint) — no custom directive.
  </p>
}

@if (hideHint) {
  <p>Both sides empty — condition true → views cleared / branch skipped.</p>
}

<!-- Lists: prefer @for -->
<ul>
  @for (item of items; track item) {
    <li>{{ item }}</li>
  }
</ul>`;

  readonly unlessTs = `hideHint = false;
items = ['Observable', 'Observer', 'Subscription'];

// Custom *appUnless (learn TemplateRef + ViewContainerRef)
@Input() set appUnless(condition: boolean) {
  if (!condition && !this.hasView) {
    this.viewContainer.createEmbeddedView(this.templateRef);
    this.hasView = true;
  } else if (condition && this.hasView) {
    this.viewContainer.clear();
    this.hasView = false;
  }
}

// Day-to-day: @if (!hideHint) { … } and @for (item of items; track item) { … }`;

  readonly unlessModal = `import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';

@Directive({
  selector: '[appUnless]',
  standalone: true,
})
export class UnlessDirective {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private hasView = false;

  /** Opposite of @if — show the template when condition is false. */
  @Input() set appUnless(condition: boolean) {
    if (!condition && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (condition && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}

// Interview: *appUnless is syntactic sugar for ng-template + [appUnless].
// Prefer built-in @if / @for in new code; custom structural shines for reusable patterns.`;
}
