import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DemoAuthService } from '../auth/demo-auth.service';
import { ToastService } from '../../shared/toast/toast.service';

/**
 * Functional CanActivate guard (modern Angular style).
 * Allows navigation only when DemoAuthService.loggedIn() is true.
 */
export const demoAuthGuard: CanActivateFn = () => {
  const auth = inject(DemoAuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (auth.loggedIn()) {
    // One success toast per login session — not on every revisit while still logged in
    auth.notifyProtectedAllowedOnce();
    return true;
  }

  // Every blocked attempt gets feedback (even if we land back on Guards)
  toast.error(
    'Access blocked',
    'You are logged out. demoAuthGuard sent you back to Guards.',
  );

  return router.createUrlTree(['/routes/guards'], {
    queryParams: { blocked: 'protected' },
  });
};
