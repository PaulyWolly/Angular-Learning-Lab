import { Component } from '@angular/core';

/**
 * Loaded only when the Lazy Loading page button runs import().
 * Separate file → separate JS chunk in the build.
 */
@Component({
  selector: 'app-lazy-demo-panel',
  standalone: true,
  template: `
    <div class="panel">
      <h3>Lazy-loaded panel</h3>
      <p>
        This component was <strong>not</strong> in the initial page chunk. Clicking the button ran
        <code>import('./lazy-demo-panel.component')</code>, downloaded this file, then rendered it
        with <code>NgComponentOutlet</code>.
      </p>
      <p class="panel__meta">Panel created at {{ createdAt }}</p>
    </div>
  `,
  styles: `
    .panel {
      margin-top: 0.85rem;
      padding: 0.85rem 1rem;
      border-radius: 0.5rem;
      border: 1px solid color-mix(in srgb, var(--violet) 35%, var(--line));
      background: linear-gradient(160deg, var(--emit-soft) 0%, var(--card) 55%);
    }
    h3 {
      margin: 0 0 0.4rem;
      font-size: 1rem;
      color: var(--violet);
    }
    p {
      margin: 0;
      line-height: 1.45;
    }
    .panel__meta {
      margin-top: 0.55rem;
      font-size: 0.85rem;
      color: var(--muted);
    }
    code {
      font-size: 0.85em;
    }
  `,
})
export class LazyDemoPanelComponent {
  readonly createdAt = new Date().toLocaleTimeString();
}
