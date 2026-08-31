import { Component, output, signal } from '@angular/core';

/**
 * Demo child — notifies the parent via `output()` when the learner clicks.
 * Used by the Components lab to teach child → parent events.
 */
@Component({
  selector: 'app-demo-vote',
  standalone: true,
  template: `
    <div class="vote">
      <p class="vote__eyebrow">app-demo-vote</p>
      <p class="vote__count">Local clicks: <strong>{{ localClicks() }}</strong></p>
      <button type="button" class="vote__btn" (click)="onVote()">Vote up</button>
      <p class="vote__hint">Click emits <code>voted</code> to the parent.</p>
    </div>
  `,
  styles: `
    .vote {
      padding: 0.75rem 0.9rem;
      border: 1px solid color-mix(in srgb, var(--amber) 40%, var(--line));
      border-radius: 0.5rem;
      background: color-mix(in srgb, var(--amber-soft) 55%, #fff);
    }
    .vote__eyebrow {
      margin: 0 0 0.25rem;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--muted);
    }
    .vote__count {
      margin: 0 0 0.5rem;
      font-size: 0.95rem;
    }
    .vote__btn {
      appearance: none;
      border: 1px solid var(--line);
      border-radius: 0.4rem;
      padding: 0.35rem 0.75rem;
      background: var(--teal);
      color: #fff;
      font: inherit;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
    }
    .vote__btn:hover {
      filter: brightness(0.95);
    }
    .vote__hint {
      margin: 0.45rem 0 0;
      font-size: 0.8rem;
      color: var(--muted);
    }
    code {
      font-size: 0.78rem;
    }
  `,
})
export class DemoVoteComponent {
  readonly localClicks = signal(0);
  /** Parent listens: (voted)="onChildVoted()" */
  readonly voted = output<number>();

  onVote(): void {
    const next = this.localClicks() + 1;
    this.localClicks.set(next);
    this.voted.emit(next);
  }
}
