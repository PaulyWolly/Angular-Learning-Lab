import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { CodeModalComponent } from '../code-modal/code-modal.component';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-async-pipe-lesson',
  standalone: true,
  imports: [AsyncPipe, CodeModalComponent],
  templateUrl: './async-pipe-lesson.component.html',
  styleUrl: './async-pipe-lesson.component.scss',
})
export class AsyncPipeLessonComponent {
  private readonly usersService = inject(UsersService);

  readonly users$ = this.usersService.users$;
  readonly modalOpen = signal(false);

  readonly sampleCode = `@if (users$ | async; as users) {
  <p>{{ users.length }} users loaded</p>
} @else {
  <p>Loading…</p>
}`;

  readonly completeCode = `// user-dataset.component.ts — async pipe in the template
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-user-dataset',
  standalone: true,
  imports: [AsyncPipe],  // required to use | async
  templateUrl: './user-dataset.component.html',
})
export class UserDatasetComponent {
  private readonly usersService = inject(UsersService);

  // Pass the Observable to the template — do NOT subscribe in the class
  readonly users$ = this.usersService.users$;
}

// user-dataset.component.html
/*
  | async does three things:
  1. Subscribes to users$
  2. Gives you the latest emission (as "users")
  3. Unsubscribes when this view is destroyed

  No ngOnDestroy / DestroyRef needed for this subscription.
*/

@if (users$ | async; as users) {
  <!-- "users" is User[] once the HTTP response arrives -->
  @for (u of users; track u.id) {
    <article>{{ u.name }}</article>
  }
} @else {
  <!-- null/undefined while waiting for the first emission -->
  <p>Loading users…</p>
}

/*
  Contrast with Steps 1–6:
  - async pipe  → best when you only need to *display* the stream
  - subscribe() → best when you need staged narration / animation / side logic
*/`;
}
