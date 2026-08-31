import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import { User } from '../../models/user.model';
import { UsersService } from '../../services/users.service';
import { ToastService } from '../../shared/toast/toast.service';

/**
 * Prefetches the user before UsersDetailComponent activates.
 * On failure returns null so the page can show an empty state (posts still use switchMap).
 */
export const userResolver: ResolveFn<User | null> = (route) => {
  const users = inject(UsersService);
  const toast = inject(ToastService);
  const id = Number(route.paramMap.get('id'));

  if (!Number.isFinite(id) || id <= 0) {
    toast.error('Invalid user id', 'Resolver could not parse :id.');
    return of(null);
  }

  return users.getUser(id).pipe(
    catchError(() => {
      toast.error('User not found', `Resolver: no user for id ${id}.`);
      return of(null);
    }),
  );
};
