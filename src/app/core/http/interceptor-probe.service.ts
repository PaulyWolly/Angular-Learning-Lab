import { HttpRequest } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

export interface InterceptorProbeHeader {
  name: string;
  value: string;
}

export interface InterceptorProbeSnapshot {
  method: string;
  url: string;
  headers: InterceptorProbeHeader[];
  authorization: string | null;
  loggedIn: boolean;
  at: string;
}

/** Lets the Interceptors lab show what the last outgoing request looked like. */
@Injectable({ providedIn: 'root' })
export class InterceptorProbeService {
  readonly last = signal<InterceptorProbeSnapshot | null>(null);

  record(req: HttpRequest<unknown>, loggedIn: boolean): void {
    this.last.set({
      method: req.method,
      url: req.urlWithParams,
      headers: req.headers.keys().map((name) => ({
        name,
        value: req.headers.get(name) ?? '',
      })),
      authorization: req.headers.get('Authorization'),
      loggedIn,
      at: new Date().toLocaleTimeString(),
    });
  }
}
