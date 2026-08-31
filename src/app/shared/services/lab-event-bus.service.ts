import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface LabBusEvent {
  source: string;
  message: string;
  at: string;
}

/**
 * Mini in-app event bus — Subject is multicast + can push from outside.
 * Expose only `asObservable()` so consumers cannot call next().
 */
@Injectable({ providedIn: 'root' })
export class LabEventBusService {
  private readonly bus$ = new Subject<LabBusEvent>();

  /** Cold-to-hot multicast stream — subscribe from any component. */
  readonly events$: Observable<LabBusEvent> = this.bus$.asObservable();

  publish(source: string, message: string): void {
    this.bus$.next({
      source,
      message,
      at: new Date().toLocaleTimeString(),
    });
  }
}
