import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, combineLatest, map, of, switchMap, tap } from 'rxjs';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';
import { CRUMB_HOME, CRUMB_USERS } from '../../shared/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../shared/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../shared/lesson-syntax/lesson-syntax.component';
import { UsersService } from '../../services/users.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-users-detail',
  standalone: true,
  imports: [AsyncPipe, RouterLink, LessonBreadcrumbComponent, LessonSyntaxComponent],
  templateUrl: './users-detail.component.html',
  styleUrl: './users-detail.component.scss',
})
export class UsersDetailComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_USERS, { label: 'Detail' }];
  private readonly route = inject(ActivatedRoute);
  private readonly users = inject(UsersService);
  private readonly toast = inject(ToastService);

  /** Emits a new id whenever the :id route param changes */
  private readonly userId$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
  );

  readonly userId = toSignal(this.userId$, { initialValue: 0 });

  /**
   * Prefetched by userResolver into route.data['user'] before activate.
   * null = not found (resolver already toasted).
   */
  readonly user = toSignal(
    this.route.data.pipe(map((data) => (data['user'] as User | null) ?? null)),
    { initialValue: (this.route.snapshot.data['user'] as User | null) ?? null },
  );

  private readonly user$ = this.route.data.pipe(
    map((data) => (data['user'] as User | null) ?? null),
  );

  /** switchMap: new id → new posts request; previous request cancelled */
  readonly posts$ = this.userId$.pipe(
    switchMap((id) =>
      this.users.getPostsByUser(id).pipe(
        tap((posts) =>
          this.toast.success('Posts loaded', `${posts.length} posts for user ${id}.`),
        ),
        catchError(() => {
          this.toast.error('Posts failed', 'Could not load posts for this user.');
          return of([] as Post[]);
        }),
      ),
    ),
  );

  /**
   * combineLatest waits until both streams have emitted, then re-emits when either changes.
   * Here: resolved user + posts for a single “summary” view.
   */
  readonly summary$ = combineLatest([this.user$, this.posts$]).pipe(
    map(([user, posts]) =>
      user
        ? {
            name: user.name,
            city: user.address.city,
            postCount: posts.length,
            topTitle: posts[0]?.title ?? '(no posts)',
          }
        : null,
    ),
  );

  readonly detailTs = `// route: resolve: { user: userResolver }
readonly user = toSignal(
  this.route.data.pipe(map((d) => d['user'] as User | null)),
  { initialValue: null },
);

// posts still cancel on rapid id changes
readonly posts$ = this.userId$.pipe(
  switchMap((id) => this.users.getPostsByUser(id)),
);`;

  readonly detailTpl = `@if (user(); as u) {
  <h1>{{ u.name }}</h1>
}
@if (posts$ | async; as posts) {
  @for (p of posts; track p.id) {
    <li>{{ p.title }}</li>
  }
}`;

  readonly resolverTs = `// user.resolver.ts
export const userResolver: ResolveFn<User | null> = (route) => {
  const id = Number(route.paramMap.get('id'));
  return inject(UsersService).getUser(id).pipe(
    catchError(() => of(null)),
  );
};

// app.routes.ts
{
  path: ':id',
  resolve: { user: userResolver },
  runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  loadComponent: () => import('...'),
}`;

  readonly resolverTpl = `<!-- User is ready before the component activates -->
@if (user(); as u) {
  <h1>{{ u.name }}</h1>
}

<!-- Contrast: posts still use switchMap inside the component -->`;

  readonly combineTs = `readonly summary$ = combineLatest([this.user$, this.posts$]).pipe(
  map(([user, posts]) =>
    user
      ? {
          name: user.name,
          city: user.address.city,
          postCount: posts.length,
          topTitle: posts[0]?.title ?? '(no posts)',
        }
      : null,
  ),
);`;

  readonly combineTpl = `@if (summary$ | async; as s) {
  <p>{{ s.name }} · {{ s.city }} · {{ s.postCount }} posts</p>
  <p>Top: {{ s.topTitle }}</p>
}`;
}
