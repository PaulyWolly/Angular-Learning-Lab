import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { DemoAuthService } from '../../core/auth/demo-auth.service';
import { CRUMB_HOME, CRUMB_ROUTES } from '../../shared/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../shared/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../shared/lesson-syntax/lesson-syntax.component';

@Component({
  selector: 'app-guards-lab',
  standalone: true,
  imports: [RouterLink, LessonBreadcrumbComponent, LessonSyntaxComponent],
  templateUrl: './guards-lab.component.html',
  styleUrl: './guards-lab.component.scss',
})
export class GuardsLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_ROUTES, { label: 'Guards' }];
  readonly auth = inject(DemoAuthService);
  private readonly route = inject(ActivatedRoute);

  /** True when redirected here because /protected was blocked */
  readonly wasBlocked = toSignal(
    this.route.queryParamMap.pipe(map((q) => q.get('blocked') === 'protected')),
    { initialValue: false },
  );

  readonly guardTpl = `<button (click)="auth.login()">Log in</button>
<button (click)="auth.logout()">Log out</button>
<a routerLink="/routes/protected">Try /routes/protected</a>

<!-- status -->
{{ auth.loggedIn() ? 'yes' : 'no' }}`;

  readonly guardTs = `readonly auth = inject(DemoAuthService);

// DemoAuthService
loggedIn = signal(false);
login()  { this.loggedIn.set(true); }
logout() { this.loggedIn.set(false); /* + navigate to Guards */ }`;

  readonly guardModal = `// demo-auth.guard.ts — functional CanActivate
export const demoAuthGuard: CanActivateFn = () => {
  const auth = inject(DemoAuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (auth.loggedIn()) {
    auth.notifyProtectedAllowedOnce(); // toast once per login
    return true;
  }

  // toast EVERY blocked attempt
  toast.error('Access blocked', 'Log in first.');
  return router.createUrlTree(['/routes/guards'], {
    queryParams: { blocked: 'protected' },
  });
};`;
}
