import { HttpClient } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { catchError, of } from 'rxjs';
import { DemoAuthService } from '../../../core/auth/demo-auth.service';
import { DEMO_AUTH_HEADER, jwtFromAuthorization } from '../../../core/http/demo-jwt';
import { InterceptorProbeService } from '../../../core/http/interceptor-probe.service';
import { CRUMB_CORE, CRUMB_HOME } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-interceptors-lab',
  standalone: true,
  imports: [LessonBreadcrumbComponent, LessonSyntaxComponent],
  templateUrl: './interceptors-lab.component.html',
  styleUrl: './interceptors-lab.component.scss',
})
export class InterceptorsLabComponent {
  private readonly http = inject(HttpClient);
  private readonly toast = inject(ToastService);
  readonly auth = inject(DemoAuthService);
  readonly probe = inject(InterceptorProbeService);

  readonly crumbs = [CRUMB_HOME, CRUMB_CORE, { label: 'Interceptors' }];
  readonly jwtParts = computed(() => jwtFromAuthorization(this.probe.last()?.authorization ?? null));

  fireRequest(): void {
    this.http
      .get<unknown[]>('https://jsonplaceholder.typicode.com/users', {
        params: { _limit: '1' },
      })
      .pipe(catchError(() => of(null)))
      .subscribe((result) => {
        const snap = this.probe.last();
        if (!result) {
          this.toast.error('Request failed', 'Could not reach JSONPlaceholder.');
          return;
        }
        if (snap?.authorization) {
          this.toast.success(
            'Header attached',
            'demoAuthInterceptor added Authorization: Bearer <JWT>',
          );
        } else {
          this.toast.info(
            'No auth header',
            'Logged out — interceptor left the request unchanged.',
          );
        }
      });
  }

  readonly ixTs = `// demo-auth.interceptor.ts
import { DEMO_AUTH_HEADER } from './demo-jwt';
// DEMO_AUTH_HEADER = 'Bearer ' + header.payload.signature

export const demoAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(DemoAuthService);
  const outgoing = auth.loggedIn()
    ? req.clone({ setHeaders: { Authorization: DEMO_AUTH_HEADER } })
    : req;
  return next(outgoing);
};

// app.config.ts
provideHttpClient(withInterceptors([demoAuthInterceptor]))`;

  readonly ixTpl = `<button (click)="auth.login()">Log in</button>
<button (click)="auth.logout()">Log out</button>
<button (click)="fireRequest()">Fire HTTP GET</button>

@if (probe.last(); as snap) {
  <pre>Authorization: {{ snap.authorization ?? '(none)' }}</pre>
}`;

  readonly ixModal = `// Functional interceptors (Angular 15+) — no class required.
// Clone the request; never mutate the original.

const DEMO_AUTH_HEADER = \`${DEMO_AUTH_HEADER}\`;

// JWT syntax: header.payload.signature (three Base64URL parts, dots)
// Header / payload decode to JSON. The signature here is a placeholder.

// Interview tips
// - Order matters: withInterceptors([a, b]) runs a then b on the way out.
// - Great for auth headers, logging, correlating IDs, error mapping.
// - This lab is a demo token only — never ship secrets in the client.`;
}
