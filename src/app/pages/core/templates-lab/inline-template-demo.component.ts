import { Component, Input, signal } from '@angular/core';

/**
 * Tiny demo child — entire view lives in an inline backtick template.
 * Good for small, self-contained widgets (this lab, CD children, etc.).
 */
@Component({
  selector: 'app-inline-template-demo',
  standalone: true,
  template: `
    <div class="inline-demo">
      <header>
        <strong>Inline template</strong>
        <span class="chip">inline · backticks</span>
      </header>
      <p>
        Hello, <em>{{ name }}</em> — clicks:
        <strong>{{ clicks() }}</strong>
      </p>
      <button type="button" (click)="bump()">Bump</button>
      <p class="hint">This HTML is a TypeScript string, not a .html file.</p>
    </div>
  `,
  styles: [
    `
      .inline-demo {
        padding: 0.75rem 0.85rem;
        border: 1px solid var(--line);
        border-radius: 0.5rem;
        background: color-mix(in srgb, var(--teal-soft) 35%, #fff);
      }
      header {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 0.35rem;
        margin-bottom: 0.4rem;
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
      p {
        margin: 0.25rem 0 0;
        font-size: 0.9rem;
      }
      .hint {
        color: var(--muted);
        font-size: 0.8rem;
      }
      button {
        appearance: none;
        margin-top: 0.5rem;
        border: 1px solid var(--line);
        border-radius: 0.4rem;
        padding: 0.35rem 0.65rem;
        background: #fff;
        font: inherit;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
      }
      button:hover {
        background: #f4f1eb;
      }
      em {
        font-style: normal;
        font-weight: 700;
        color: var(--teal);
      }
    `,
  ],
})
export class InlineTemplateDemoComponent {
  @Input({ required: true }) name!: string;
  readonly clicks = signal(0);

  bump(): void {
    this.clicks.update((n) => n + 1);
  }
}
