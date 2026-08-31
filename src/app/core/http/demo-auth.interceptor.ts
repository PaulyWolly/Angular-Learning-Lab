import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { DemoAuthService } from '../auth/demo-auth.service';
import { InterceptorProbeService } from './interceptor-probe.service';

/**
 * Demo auth header interceptor — not real security.
 * When logged in, clones the request with Authorization: Bearer demo-lab-token.
 */
export const demoAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(DemoAuthService);
  const probe = inject(InterceptorProbeService);
  const loggedIn = auth.loggedIn();

  const outgoing = loggedIn
    ? req.clone({
        setHeaders: { Authorization: 'Bearer demo-lab-token' },
      })
    : req;

  probe.record(outgoing, loggedIn);
  return next(outgoing);
};
