import { Injectable, signal } from '@angular/core';

/** Parent-scoped log so the probe child can record hooks without @Output timing issues. */
@Injectable()
export class LifecycleHookLog {
  readonly rows = signal<string[]>([]);
  private seq = 0;

  push(hook: string, detail?: string): void {
    this.seq += 1;
    const at = new Date().toLocaleTimeString();
    const line = `${this.seq}. ${hook}${detail ? ` — ${detail}` : ''} @ ${at}`;
    this.rows.update((rows) => [...rows, line].slice(-18));
  }

  clear(): void {
    this.seq = 0;
    this.rows.set([]);
  }
}
