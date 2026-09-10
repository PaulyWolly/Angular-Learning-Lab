import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { catchError, delay, map, Observable, throwError } from 'rxjs';
import { User } from '../../../models/user.model';
import { CRUMB_CORE, CRUMB_HOME } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';
import { ToastService } from '../../../shared/toast/toast.service';

/** UI state machine for an HTTP-backed list. */
export type HttpUiState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; users: User[] }
  | { status: 'empty' }
  | { status: 'error'; message: string };

type DemoMode = 'ok' | 'empty' | 'fail';

@Component({
  selector: 'app-http-states-lab',
  standalone: true,
  imports: [LessonBreadcrumbComponent, LessonSyntaxComponent],
  templateUrl: './http-states-lab.component.html',
  styleUrl: './http-states-lab.component.scss',
})
export class HttpStatesLabComponent {
  private readonly http = inject(HttpClient);
  private readonly toast = inject(ToastService);

  readonly crumbs = [CRUMB_HOME, CRUMB_CORE, { label: 'HTTP States' }];

  private readonly usersUrl = 'https://jsonplaceholder.typicode.com/users';

  state: HttpUiState = { status: 'idle' };
  private mode: DemoMode = 'ok';

  /** Kick a load with the chosen demo mode. */
  load(mode: DemoMode = this.mode): void {
    this.mode = mode;
    this.state = { status: 'loading' };

    this.fetchUsers(mode).subscribe({
      next: (users) => {
        if (users.length === 0) {
          this.state = { status: 'empty' };
          this.toast.info('Empty', 'Request succeeded but the list is empty.');
          return;
        }
        this.state = { status: 'success', users };
        this.toast.success('Loaded', `${users.length} users.`);
      },
      error: (err: Error) => {
        this.state = { status: 'error', message: err.message || 'Request failed' };
        this.toast.error('HTTP error', err.message || 'Request failed');
      },
    });
  }

  retry(): void {
    this.load(this.mode);
  }

  reset(): void {
    this.state = { status: 'idle' };
    this.toast.info('Reset', 'Back to idle — pick a load button.');
  }

  private fetchUsers(mode: DemoMode): Observable<User[]> {
    if (mode === 'fail') {
      return throwError(() => new Error('Simulated network failure')).pipe(delay(400));
    }

    return this.http.get<User[]>(this.usersUrl).pipe(
      delay(500),
      map((users) => {
        const slice = users.slice(0, 5);
        return mode === 'empty' ? [] : slice;
      }),
      catchError(() =>
        throwError(() => new Error('Could not reach JSONPlaceholder.')),
      ),
    );
  }

  readonly statesTs = `type HttpUiState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; users: User[] }
  | { status: 'empty' }
  | { status: 'error'; message: string };

state: HttpUiState = { status: 'idle' };

load(): void {
  this.state = { status: 'loading' };
  this.http.get<User[]>(url).subscribe({
    next: (users) => {
      this.state = users.length
        ? { status: 'success', users }
        : { status: 'empty' };
    },
    error: (err) => {
      this.state = { status: 'error', message: err.message };
    },
  });
}`;

  readonly statesTpl = `@switch (state.status) {
  @case ('idle') { <p>Click Load to start.</p> }
  @case ('loading') { <p>Loading…</p> }
  @case ('empty') { <p>No results. <button (click)="retry()">Retry</button></p> }
  @case ('error') {
    <p>{{ state.message }}</p>
    <button (click)="retry()">Retry</button>
  }
  @case ('success') {
    @for (u of state.users; track u.id) {
      <li>{{ u.name }}</li>
    }
  }
}`;

  readonly statesModal = `// Interview pattern: one discriminated union drives the template.
// Avoid boolean soup: loading + error + empty flags fighting each other.

load(mode: 'ok' | 'empty' | 'fail'): void {
  this.state = { status: 'loading' };
  this.fetchUsers(mode).subscribe({
    next: (users) => { /* success | empty */ },
    error: (err) => { this.state = { status: 'error', message: err.message }; },
  });
}

retry(): void {
  this.load(/* last mode */);
}`;
}
