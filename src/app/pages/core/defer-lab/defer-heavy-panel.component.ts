import { Component } from '@angular/core';

/**
 * Intentionally separate file so @defer can load it as its own chunk.
 * Used only inside @defer blocks on the Defer lab.
 */
@Component({
  selector: 'app-defer-heavy-panel',
  standalone: true,
  template: `
    <div class="heavy">
      <header>
        <strong>Deferred panel</strong>
        <span class="chip">loaded at {{ loadedAt }}</span>
      </header>
      <p>
        This component lived in a <em>separate chunk</em> until a <code>&#64;defer</code> trigger
        fetched it. Check DevTools → Network after you trigger a block below.
      </p>
      <ul>
        <li>Route lazy = whole page chunk via <code>loadComponent</code></li>
        <li>Template <code>&#64;defer</code> = part of a page, on demand</li>
      </ul>
    </div>
  `,
  styles: [
    `
      .heavy {
        padding: 0.85rem 1rem;
        border: 1px solid color-mix(in srgb, var(--teal) 40%, var(--line));
        border-radius: 0.55rem;
        background: color-mix(in srgb, var(--teal-soft) 40%, #fff);
      }
      header {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 0.35rem;
        margin-bottom: 0.45rem;
      }
      .chip {
        display: inline-block;
        padding: 0.15rem 0.45rem;
        border-radius: 999px;
        background: var(--teal-soft);
        color: var(--teal);
        font-size: 0.72rem;
        font-weight: 700;
      }
      p,
      ul {
        margin: 0.35rem 0 0;
        font-size: 0.9rem;
        line-height: 1.45;
        color: var(--ink);
      }
      ul {
        padding-left: 1.15rem;
        color: var(--muted);
      }
      code {
        font-size: 0.8rem;
      }
      em {
        font-style: normal;
        font-weight: 700;
        color: var(--teal);
      }
    `,
  ],
})
export class DeferHeavyPanelComponent {
  readonly loadedAt = new Date().toLocaleTimeString();
}
