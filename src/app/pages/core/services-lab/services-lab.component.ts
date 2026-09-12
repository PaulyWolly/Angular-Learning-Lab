import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DemoAuthService } from '../../../core/auth/demo-auth.service';
import { UsersService } from '../../../shared/services/users.service';
import { CounterService } from '../../../shared/services/counter.service';
import { AsyncPipe } from '@angular/common';
import { CRUMB_CORE, CRUMB_HOME } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';

@Component({
  selector: 'app-services-lab',
  standalone: true,
  imports: [RouterLink, AsyncPipe, LessonBreadcrumbComponent, LessonSyntaxComponent],
  templateUrl: './services-lab.component.html',
  styleUrl: './services-lab.component.scss',
})
export class ServicesLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_CORE, { label: 'Services' }];
  readonly counter = inject(CounterService);
  readonly auth = inject(DemoAuthService);
  readonly usersService = inject(UsersService);

  readonly users$ = this.usersService.users$;

  readonly counterTpl = `<strong>{{ counter.value() }}</strong>
<button (click)="counter.increment()">+</button>
<button (click)="counter.decrement()">−</button>
<button (click)="counter.reset()">Reset</button>`;
  readonly counterTs = `readonly counter = inject(CounterService);`;
  readonly counterModal = `import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CounterService {
  private readonly count = signal(0);

  readonly value = this.count.asReadonly();
  readonly label = computed(() => \`Count is \${this.count()}\`);

  increment() { this.count.update((n) => n + 1); }
  decrement() { this.count.update((n) => n - 1); }
  reset() { this.count.set(0); }
}

// In a component:
readonly counter = inject(CounterService);`;

  readonly injectTpl = `{{ auth.loggedIn() ? 'yes' : 'no' }}
@if (users$ | async; as users) {
  {{ users.length }} users
}`;
  readonly injectTs = `private readonly http = inject(HttpClient);
readonly users$ = inject(UsersService).users$;
readonly auth = inject(DemoAuthService);`;
}
