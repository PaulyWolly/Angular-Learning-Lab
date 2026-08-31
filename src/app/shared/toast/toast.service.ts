import { Injectable, signal } from '@angular/core';
import { Toast, ToastKind } from './toast.model';

const DEFAULT_DURATION_MS = 4200;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();

  readonly toasts = signal<Toast[]>([]);

  success(title: string, message?: string, durationMs = DEFAULT_DURATION_MS): void {
    this.push('success', title, message, durationMs);
  }

  error(title: string, message?: string, durationMs = DEFAULT_DURATION_MS): void {
    this.push('error', title, message, durationMs);
  }

  info(title: string, message?: string, durationMs = DEFAULT_DURATION_MS): void {
    this.push('info', title, message, durationMs);
  }

  dismiss(id: number): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  private push(
    kind: ToastKind,
    title: string,
    message: string | undefined,
    durationMs: number,
  ): void {
    const id = this.nextId++;
    this.toasts.update((list) => [...list, { id, kind, title, message }]);

    if (durationMs > 0) {
      const timer = setTimeout(() => this.dismiss(id), durationMs);
      this.timers.set(id, timer);
    }
  }
}
