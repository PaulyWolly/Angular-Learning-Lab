import { Component, computed, effect, signal, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CRUMB_CORE, CRUMB_HOME } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';

@Component({
  selector: 'app-signals-lab',
  standalone: true,
  imports: [RouterLink, LessonBreadcrumbComponent, LessonSyntaxComponent],
  templateUrl: './signals-lab.component.html',
  styleUrl: './signals-lab.component.scss',
})
export class SignalsLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_CORE, { label: 'Signals' }];
  /** Writable source of truth */
  readonly count = signal(0);

  /** Derived — recalculates when count() changes */
  readonly doubled = computed(() => this.count() * 2);
  readonly label = computed(() =>
    this.count() === 0 ? 'empty' : this.count() === 1 ? 'one item' : `${this.count()} items`,
  );

  /** Side-effect log (demo only) */
  readonly effectLog = signal<string[]>([]);

  constructor() {
    effect(() => {
      const n = this.count();
      untracked(() => {
        this.effectLog.update((rows) =>
          [`effect saw count = ${n} @ ${new Date().toLocaleTimeString()}`, ...rows].slice(0, 5),
        );
      });
    });
  }

  increment(): void {
    this.count.update((n) => n + 1);
  }

  decrement(): void {
    this.count.update((n) => n - 1);
  }

  setTen(): void {
    this.count.set(10);
  }

  reset(): void {
    this.count.set(0);
  }

  readonly signalTs = `readonly count = signal(0);
readonly doubled = computed(() => this.count() * 2);

increment() { this.count.update((n) => n + 1); }
setTen()    { this.count.set(10); }

// effect() runs when count() changes (constructor / injection context)
effect(() => {
  console.log('count is', this.count());
});`;

  readonly signalTpl = `<p>count = {{ count() }}</p>
<p>doubled = {{ doubled() }}</p>
<button (click)="increment()">+</button>
<button (click)="count.set(10)">set 10</button>`;

  readonly signalModal = `import { Component, computed, effect, signal } from '@angular/core';

@Component({ /* ... */ })
export class SignalsLabComponent {
  readonly count = signal(0);
  readonly doubled = computed(() => this.count() * 2);

  constructor() {
    effect(() => {
      // runs whenever count() is read and later changes
      console.log(this.count());
    });
  }
}`;
}
