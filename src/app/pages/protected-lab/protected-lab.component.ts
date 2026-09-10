import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DemoAuthService } from '../../core/auth/demo-auth.service';
import { CRUMB_HOME, CRUMB_ROUTES } from '../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';

@Component({
  selector: 'app-protected-lab',
  standalone: true,
  imports: [RouterLink, LessonBreadcrumbComponent],
  templateUrl: './protected-lab.component.html',
  styleUrl: './protected-lab.component.scss',
})
export class ProtectedLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_ROUTES, { label: 'Protected' }];
  readonly auth = inject(DemoAuthService);
}
