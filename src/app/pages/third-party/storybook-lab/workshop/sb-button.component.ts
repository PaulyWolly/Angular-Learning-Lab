import { Component, input, output } from '@angular/core';

export type SbVariant = 'primary' | 'secondary' | 'danger';
export type SbSize = 'sm' | 'md' | 'lg';

/** Isolated workshop subject — the component stories mount. */
@Component({
  selector: 'app-sb-button',
  standalone: true,
  template: `
    <button
      type="button"
      class="sb-btn"
      [class]="'sb-btn--' + variant() + ' sb-btn--' + size()"
      [disabled]="disabled()"
      (click)="clicked.emit(label())"
    >
      {{ label() }}
    </button>
  `,
  styles: `
    .sb-btn {
      appearance: none;
      border-radius: 0.4rem;
      font-weight: 700;
      cursor: pointer;
      border: 1px solid transparent;
    }
    .sb-btn:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
    .sb-btn--sm {
      padding: 0.3rem 0.7rem;
      font-size: 0.8rem;
    }
    .sb-btn--md {
      padding: 0.5rem 1.1rem;
      font-size: 0.95rem;
    }
    .sb-btn--lg {
      padding: 0.7rem 1.4rem;
      font-size: 1.1rem;
    }
    .sb-btn--primary {
      background: #ff4785;
      color: #fff;
    }
    .sb-btn--secondary {
      background: #fff;
      color: #2e3438;
      border-color: #c8cdd2;
    }
    .sb-btn--danger {
      background: #d92626;
      color: #fff;
    }
  `,
})
export class SbButtonComponent {
  readonly label = input('Button');
  readonly variant = input<SbVariant>('primary');
  readonly size = input<SbSize>('md');
  readonly disabled = input(false);
  readonly clicked = output<string>();
}
