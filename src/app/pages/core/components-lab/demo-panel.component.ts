import { Component, input } from '@angular/core';

/**
 * Demo child — projects parent markup into &lt;ng-content&gt;.
 * Used by the Components lab to teach content projection.
 */
@Component({
  selector: 'app-demo-panel',
  standalone: true,
  template: `
    <section class="panel">
      <header class="panel__head">
        <strong>{{ heading() }}</strong>
        <span class="panel__chip">ng-content</span>
      </header>
      <div class="panel__body">
        <ng-content />
      </div>
    </section>
  `,
  styles: `
    .panel {
      border: 1px solid var(--line);
      border-radius: 0.5rem;
      overflow: hidden;
      background: #fff;
    }
    .panel__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      padding: 0.55rem 0.85rem;
      background: #f4f1eb;
      border-bottom: 1px solid var(--line);
      font-size: 0.9rem;
    }
    .panel__chip {
      padding: 0.12rem 0.45rem;
      border-radius: 999px;
      background: var(--teal-soft);
      color: var(--teal);
      font-size: 0.7rem;
      font-weight: 700;
    }
    .panel__body {
      padding: 0.75rem 0.85rem;
      font-size: 0.9rem;
      line-height: 1.45;
    }
  `,
})
export class DemoPanelComponent {
  readonly heading = input('Panel');
}
