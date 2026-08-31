import { Injectable, computed, signal } from '@angular/core';

/**
 * Tiny demo service for the Services lesson — shared counter via DI.
 */
@Injectable({ providedIn: 'root' })
export class CounterService {
  private readonly count = signal(0);

  readonly value = this.count.asReadonly();
  readonly label = computed(() => `Count is ${this.count()}`);

  increment(): void {
    this.count.update((n) => n + 1);
  }

  decrement(): void {
    this.count.update((n) => n - 1);
  }

  reset(): void {
    this.count.set(0);
  }
}
