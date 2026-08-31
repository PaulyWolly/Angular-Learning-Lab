import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  inject,
  Input,
} from '@angular/core';
import { CRUMB_CORE, CRUMB_HOME } from '../../../shared/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';

@Component({
  selector: 'app-cd-default-child',
  standalone: true,
  template: `
    <div class="child child--default">
      <header>
        <strong>Default</strong>
        <span class="chip">checks: {{ checkCount }}</span>
      </header>
      <p>label = <code>{{ label }}</code></p>
      <p>boxed.text = <code>{{ boxed.text }}</code></p>
      <p class="hint">Re-checked when the parent ticks — even if inputs did not change.</p>
    </div>
  `,
  styles: `
    .child {
      padding: 0.75rem 0.85rem;
      border: 1px solid var(--line);
      border-radius: 0.5rem;
      background: #fff;
    }
    .child--default {
      border-color: color-mix(in srgb, var(--amber) 45%, var(--line));
    }
    header {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
      margin-bottom: 0.35rem;
    }
    .chip {
      display: inline-block;
      padding: 0.15rem 0.45rem;
      border-radius: 999px;
      background: var(--amber-soft);
      font-size: 0.75rem;
      font-weight: 700;
    }
    p {
      margin: 0.25rem 0 0;
      font-size: 0.9rem;
    }
    .hint {
      color: var(--muted);
      font-size: 0.8rem;
    }
  `,
})
export class CdDefaultChildComponent implements DoCheck {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) boxed!: { text: string };
  checkCount = 0;

  ngDoCheck(): void {
    this.checkCount += 1;
  }
}

@Component({
  selector: 'app-cd-onpush-child',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="child child--onpush">
      <header>
        <strong>OnPush</strong>
        <span class="chip">checks: {{ checkCount }}</span>
      </header>
      <p>label = <code>{{ label }}</code></p>
      <p>boxed.text = <code>{{ boxed.text }}</code></p>
      <div class="row">
        <button type="button" (click)="bumpLocal()">Local event</button>
        <button type="button" (click)="forceCheck()">markForCheck()</button>
      </div>
      <p class="hint">
        Checks on input ref change, local events, or markForCheck — not every parent tick.
      </p>
    </div>
  `,
  styles: `
    .child {
      padding: 0.75rem 0.85rem;
      border: 1px solid var(--line);
      border-radius: 0.5rem;
      background: #fff;
    }
    .child--onpush {
      border-color: color-mix(in srgb, var(--teal) 45%, var(--line));
    }
    header {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
      margin-bottom: 0.35rem;
    }
    .chip {
      display: inline-block;
      padding: 0.15rem 0.45rem;
      border-radius: 999px;
      background: var(--teal-soft);
      color: var(--teal);
      font-size: 0.75rem;
      font-weight: 700;
    }
    p {
      margin: 0.25rem 0 0;
      font-size: 0.9rem;
    }
    .hint {
      color: var(--muted);
      font-size: 0.8rem;
    }
    .row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-top: 0.5rem;
    }
    button {
      appearance: none;
      border: 1px solid var(--line);
      border-radius: 0.4rem;
      padding: 0.35rem 0.65rem;
      background: #fff;
      font: inherit;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
    }
    button:hover {
      background: #f4f1eb;
    }
  `,
})
export class CdOnPushChildComponent implements DoCheck {
  private readonly cdr = inject(ChangeDetectorRef);

  @Input({ required: true }) label!: string;
  @Input({ required: true }) boxed!: { text: string };
  checkCount = 0;

  ngDoCheck(): void {
    this.checkCount += 1;
  }

  bumpLocal(): void {
    // Event inside OnPush component → Angular checks this view
  }

  forceCheck(): void {
    this.cdr.markForCheck();
  }
}

@Component({
  selector: 'app-change-detection-lab',
  standalone: true,
  imports: [
    CdDefaultChildComponent,
    CdOnPushChildComponent,
    LessonBreadcrumbComponent,
    LessonSyntaxComponent,
  ],
  templateUrl: './change-detection-lab.component.html',
  styleUrl: './change-detection-lab.component.scss',
})
export class ChangeDetectionLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_CORE, { label: 'Change Detection' }];
  parentTicks = 0;
  label = 'hello';
  boxed = { text: 'box' };

  tickParent(): void {
    this.parentTicks += 1;
  }

  changeLabel(): void {
    this.label = this.label === 'hello' ? 'world' : 'hello';
  }

  changeBoxedRef(): void {
    this.boxed = { text: this.boxed.text === 'box' ? 'BOX' : 'box' };
  }

  mutateBoxed(): void {
    this.boxed.text = this.boxed.text + '!';
  }

  readonly cdTs = `@Component({ changeDetection: ChangeDetectionStrategy.OnPush })
export class CdOnPushChildComponent {
  @Input() label!: string;
  @Input() boxed!: { text: string };
}

// Parent
tickParent() { this.parentTicks += 1; }          // Default checks; OnPush often skips
changeLabel() { this.label = 'world'; }          // new string → OnPush checks
mutateBoxed() { this.boxed.text += '!'; }        // same object ref → OnPush may stale
changeBoxedRef() { this.boxed = { text: 'BOX' }; } // new ref → OnPush checks`;

  readonly cdTpl = `<button (click)="tickParent()">Parent tick</button>
<button (click)="changeLabel()">New label ref</button>
<button (click)="mutateBoxed()">Mutate boxed.text</button>
<button (click)="changeBoxedRef()">New boxed ref</button>

<app-cd-default-child [label]="label" [boxed]="boxed" />
<app-cd-onpush-child [label]="label" [boxed]="boxed" />`;

  readonly cdModal = `@Component({
  selector: 'app-cd-onpush-child',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class CdOnPushChildComponent implements DoCheck {
  private readonly cdr = inject(ChangeDetectorRef);
  @Input({ required: true }) label!: string;
  checkCount = 0;

  ngDoCheck() { this.checkCount += 1; } // counts actual CD runs

  forceCheck() { this.cdr.markForCheck(); }
}`;
}
