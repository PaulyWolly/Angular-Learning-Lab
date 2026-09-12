import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CRUMB_CORE, CRUMB_HOME } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';

@Component({
  selector: 'app-binding-lab',
  standalone: true,
  imports: [FormsModule, LessonBreadcrumbComponent, LessonSyntaxComponent],
  templateUrl: './binding-lab.component.html',
  styleUrl: './binding-lab.component.scss',
})
export class BindingLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_CORE, { label: 'Data Binding' }];
  /** Used by {{ }} interpolation and [(ngModel)] */
  displayName = 'Leanne Graham';

  /** Property binding [disabled] / [class] */
  isDisabled = false;
  isHighlight = true;

  /** Event binding (click) */
  clickCount = 0;

  /** Two-way [(ngModel)] */
  notes = 'Type here — the preview updates as you type.';

  bumpClicks(): void {
    this.clickCount += 1;
  }

  resetClicks(): void {
    this.clickCount = 0;
  }

  /** Literal shown in prose so Angular does not interpolate it */
  readonly curlyDisplayName = '{{ displayName }}';
  readonly disabledInterpExample = 'disabled="{{ isDisabled }}"';

  // --- Syntax snippets: TypeScript field → what the template reads ---

  readonly interpolationTs = `displayName = 'Leanne Graham';
// changing this field → change detection updates the DOM`;
  readonly interpolationTpl = `<!-- Interpolation: class → view (one-way) -->
<p>Hello, {{ displayName }}</p>

<!-- Demo helpers (not interpolation itself): -->
<button (click)="displayName = 'Paul'">Paul</button>
<input [value]="displayName"
       (input)="displayName = $any($event.target).value" />`;

  readonly propertyTs = `isDisabled = false;
isHighlight = true;

// Boolean DOM properties → always [prop]="expr"
// NOT disabled="{{ isDisabled }}" (string "false" still disables)`;

  readonly propertyTpl = `<!-- ✅ property binding — real boolean -->
<button [disabled]="isDisabled">Save</button>
<span [class.on]="isHighlight">Highlighted?</span>

<!-- ❌ interpolation — attribute becomes the string "false"/"true"
<button disabled="{{ isDisabled }}">Save</button>
     When false, HTML still sees a present disabled attribute. -->`;

  readonly propertyModal = `// Why [disabled] and not disabled="{{ … }}"?

// Interpolation always produces a STRING in the attribute:
//   isDisabled === false  →  disabled="false"
// HTML boolean attributes care about PRESENCE, not the word "false".
// So disabled="false" often still disables the button.

// Property binding sets the DOM property to a real boolean:
//   [disabled]="false"  →  element.disabled === false  →  enabled
//   [disabled]="true"   →  element.disabled === true   →  disabled

// Apply the same rule to checked, readonly, required, hidden, etc.`;

  readonly eventTs = `clickCount = 0;

bumpClicks(): void {
  this.clickCount += 1;  // template calls this
}`;
  readonly eventTpl = `<button (click)="bumpClicks()">Click me</button>
<span>clickCount = {{ clickCount }}</span>`;

  readonly twoWayTs = `notes = 'Type here — the preview updates as you type.';
// needs FormsModule in the component imports`;
  readonly twoWayTpl = `<textarea [(ngModel)]="notes"></textarea>
<p>{{ notes }}</p>`;

  readonly twoWayModal = `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Angular 19+/20: standalone is the default — omit standalone: true.
// Only set the flag for standalone: false (legacy NgModule).

@Component({
  selector: 'app-binding-lab',
  imports: [FormsModule],  // required for [(ngModel)]
  templateUrl: './binding-lab.component.html',
})
export class BindingLabComponent {
  notes = 'Type here — the preview updates as you type.';
}`;
}
