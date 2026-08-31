import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../shared/toast/toast.service';

/**
 * Tiny demo "auth" for teaching guards — not real security.
 * Toggle from the Guards page or Header.
 */
@Injectable({ providedIn: 'root' })
export class DemoAuthService {
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  /** After login, first successful Protected entry toasts once */
  private protectedAllowedToasted = false;

  readonly loggedIn = signal(false);

  login(): void {
    this.loggedIn.set(true);
    this.protectedAllowedToasted = false;
    this.toast.success('Logged in', 'Demo auth is on — Protected is unlocked.');
  }

  logout(): void {
    const wasOnProtected = this.router.url.includes('/routes/protected');
    this.loggedIn.set(false);
    this.protectedAllowedToasted = false;
    if (wasOnProtected) {
      this.toast.info('Logged out', 'Demo auth cleared — redirected to Guards.');
      void this.router.navigate(['/routes/guards'], {
        queryParams: { blocked: 'protected' },
      });
      return;
    }
    this.toast.info('Logged out', 'Demo auth cleared.');
  }

  toggle(): void {
    if (this.loggedIn()) {
      this.logout();
    } else {
      this.login();
    }
  }

  /** Called by demoAuthGuard when access is allowed */
  notifyProtectedAllowedOnce(): void {
    if (this.protectedAllowedToasted) {
      return;
    }
    this.protectedAllowedToasted = true;
    this.toast.success('Guard passed', 'Logged in — Protected route is allowed.');
  }
}
