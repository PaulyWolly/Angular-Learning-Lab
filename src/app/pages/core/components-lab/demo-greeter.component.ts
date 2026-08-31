import { Component, input } from '@angular/core';

/**
 * Demo child — receives data from the parent via `input()`.
 * Used by the Components lab to teach parent → child data flow.
 */
@Component({
  selector: 'app-demo-greeter',
  standalone: true,
  template: `
    <div class="greeter">
      <p class="greeter__eyebrow">app-demo-greeter</p>
      <p class="greeter__hello">
        Hello, <strong>{{ name() }}</strong>
        @if (title()) {
          <span class="greeter__title"> · {{ title() }}</span>
        }
      </p>
      <p class="greeter__hint">I only render what the parent passes in.</p>
    </div>
  `,
  styles: `
    .greeter {
      padding: 0.75rem 0.9rem;
      border: 1px solid color-mix(in srgb, var(--teal) 35%, var(--line));
      border-radius: 0.5rem;
      background: color-mix(in srgb, var(--teal-soft) 40%, #fff);
    }
    .greeter__eyebrow {
      margin: 0 0 0.25rem;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--muted);
    }
    .greeter__hello {
      margin: 0;
      font-size: 1.05rem;
    }
    .greeter__title {
      color: var(--teal);
      font-weight: 600;
    }
    .greeter__hint {
      margin: 0.35rem 0 0;
      font-size: 0.8rem;
      color: var(--muted);
    }
  `,
})
export class DemoGreeterComponent {
  /** Required name from the parent */
  readonly name = input.required<string>();
  /** Optional subtitle */
  readonly title = input<string>('');
}
