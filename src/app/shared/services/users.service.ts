import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, shareReplay, tap, throwError } from 'rxjs';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';
import { ToastService } from '../toast/toast.service';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly toast = inject(ToastService);

  private readonly usersUrl = 'https://jsonplaceholder.typicode.com/users';
  private readonly postsUrl = 'https://jsonplaceholder.typicode.com/posts';

  /** Shared cold→hot cache of first 8 users */
  readonly users$ = this.http.get<User[]>(this.usersUrl).pipe(
    map((users) => users.slice(0, 8)),
    tap({
      next: (users) =>
        this.toast.success(
          'Connected',
          `Loaded ${users.length} users from JSONPlaceholder.`,
        ),
    }),
    catchError((err) => {
      this.toast.error(
        'Connection failed',
        'Could not reach JSONPlaceholder. Check your network and try again.',
      );
      return throwError(() => err);
    }),
    shareReplay(1),
  );

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/${id}`);
  }

  getPostsByUser(userId: number): Observable<Post[]> {
    return this.http
      .get<Post[]>(this.postsUrl, { params: { userId } })
      .pipe(map((posts) => posts.slice(0, 5)));
  }
}
