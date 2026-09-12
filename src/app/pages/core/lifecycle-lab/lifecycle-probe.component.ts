import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  AfterViewInit,
  SimpleChanges,
} from '@angular/core';
import { LifecycleHookLog } from './lifecycle-hook-log';

/**
 * Tiny child that shouts every lifecycle step into the parent-provided log.
 */
@Component({
  selector: 'app-lifecycle-probe',
  standalone: true,
  template: `
    <div class="probe">
      <p class="probe__eyebrow">app-lifecycle-probe</p>
      <p class="probe__hello">
        Hello, <strong>{{ name }}</strong>
      </p>
      <p class="probe__hint">I log constructor → OnChanges → OnInit → AfterViewInit → afterNextRender.</p>
    </div>
  `,
  styles: `
    .probe {
      padding: 0.75rem 0.9rem;
      border: 1px solid color-mix(in srgb, var(--teal) 35%, var(--line));
      border-radius: 0.5rem;
      background: color-mix(in srgb, var(--teal-soft) 40%, #fff);
    }
    .probe__eyebrow {
      margin: 0 0 0.25rem;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--muted);
    }
    .probe__hello {
      margin: 0;
      font-size: 1.05rem;
    }
    .probe__hint {
      margin: 0.35rem 0 0;
      font-size: 0.82rem;
      color: var(--muted);
    }
  `,
})
export class LifecycleProbeComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  private readonly log = inject(LifecycleHookLog);

  /** Classic @Input so ngOnChanges / SimpleChanges match interview answers. */
  @Input({ required: true }) name = '';

  constructor() {
    this.log.push('constructor', 'instance exists; @Input not guaranteed yet');
    afterNextRender(() => {
      this.log.push('afterNextRender', 'browser painted this view — safe to measure DOM');
    });
    inject(DestroyRef).onDestroy(() => {
      this.log.push('DestroyRef.onDestroy', 'modern teardown (no implements OnDestroy required)');
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const ch = changes['name'];
    if (!ch) return;
    this.log.push(
      'ngOnChanges',
      ch.firstChange
        ? `first name="${ch.currentValue}"`
        : `"${ch.previousValue}" → "${ch.currentValue}"`,
    );
  }

  ngOnInit(): void {
    this.log.push('ngOnInit', `inputs are set (name="${this.name}") — start HTTP / subscriptions here`);
  }

  ngAfterViewInit(): void {
    this.log.push('ngAfterViewInit', 'this view and @ViewChild queries are ready');
  }

  ngOnDestroy(): void {
    this.log.push('ngOnDestroy', 'classic teardown — unsubscribe if you did not use DestroyRef');
  }
}
