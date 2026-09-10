import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
} from 'rxjs';
import { User } from '../../models/user.model';
import { CRUMB_HOME } from '../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../shared/lesson-syntax/lesson-syntax.component';
import { UsersService } from '../../shared/services/users.service';

@Component({
  selector: 'app-users-lab',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    RouterLink,
    LessonBreadcrumbComponent,
    LessonSyntaxComponent,
  ],
  templateUrl: './users-lab.component.html',
  styleUrl: './users-lab.component.scss',
})
export class UsersLabComponent implements OnInit {
  readonly crumbs = [CRUMB_HOME, { label: 'Users' }];
  private readonly usersService = inject(UsersService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly searchCtrl = new FormControl('', { nonNullable: true });

  /** Users filtered by ?q= (synced from the search control). */
  readonly filteredUsers$: Observable<User[]> = combineLatest([
    this.usersService.users$,
    this.route.queryParamMap.pipe(
      map((q) => (q.get('q') ?? '').trim().toLowerCase()),
      distinctUntilChanged(),
    ),
  ]).pipe(
    map(([users, q]) =>
      q
        ? users.filter(
            (u) =>
              u.name.toLowerCase().includes(q) ||
              u.email.toLowerCase().includes(q) ||
              u.address.city.toLowerCase().includes(q),
          )
        : users,
    ),
  );

  ngOnInit(): void {
    // Seed the input from the URL (deep link /users?q=leanne)
    const initialQ = this.route.snapshot.queryParamMap.get('q') ?? '';
    this.searchCtrl.setValue(initialQ, { emitEvent: false });

    // Input → URL query param (omit empty q)
    this.searchCtrl.valueChanges
      .pipe(
        debounceTime(300),
        map((v) => v.trim()),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((q) => {
        void this.router.navigate([], {
          relativeTo: this.route,
          queryParams: q ? { q } : { q: null },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      });

    // URL → input (browser back/forward)
    this.route.queryParamMap
      .pipe(
        map((p) => p.get('q') ?? ''),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((q) => {
        if (this.searchCtrl.value !== q) {
          this.searchCtrl.setValue(q, { emitEvent: false });
        }
      });
  }

  readonly listTs = `// users.service.ts
readonly users$ = this.http.get<User[]>(url).pipe(
  map((users) => users.slice(0, 8)),
  shareReplay(1),
);

// component
readonly users$ = inject(UsersService).users$;`;

  readonly listTpl = `@if (filteredUsers$ | async; as users) {
  @for (u of users; track u.id) {
    <a [routerLink]="['/users', u.id]">{{ u.name }}</a>
  }
}`;

  readonly queryTs = `readonly searchCtrl = new FormControl('', { nonNullable: true });

// Input → ?q=
this.searchCtrl.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
).subscribe((q) => {
  this.router.navigate([], {
    relativeTo: this.route,
    queryParams: q ? { q } : { q: null },
    queryParamsHandling: 'merge',
    replaceUrl: true,
  });
});

// ?q= → filtered list
readonly filteredUsers$ = combineLatest([
  this.usersService.users$,
  this.route.queryParamMap.pipe(map((p) => p.get('q') ?? '')),
]).pipe(
  map(([users, q]) => /* filter by name / email / city */),
);`;

  readonly queryTpl = `<input type="search" [formControl]="searchCtrl" />

@if (filteredUsers$ | async; as users) {
  <p>{{ users.length }} match(es)</p>
  <!-- deep-linkable: /users?q=leanne -->
}`;

  readonly switchMapTs = `// users-detail.component.ts
readonly userId$ = this.route.paramMap.pipe(
  map((p) => Number(p.get('id'))),
);

// switchMap cancels in-flight work when id changes
readonly posts$ = this.userId$.pipe(
  switchMap((id) => this.users.getPostsByUser(id)),
);`;

  readonly switchMapTpl = `<!-- /users/:id detail -->
@if (posts$ | async; as posts) {
  @for (p of posts; track p.id) {
    <li>{{ p.title }}</li>
  }
}`;
}
